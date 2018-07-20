pragma solidity 0.4.18;

import "./lib/oraclize/oraclizeAPI_0.4.sol";
import "./lib/arachnid/solidity-stringutils/strings.sol";

contract PgaDfs is usingOraclize {

  using strings for *;

  struct Golfer {
    // not storing name,
    // since we're trying to be minimal with data storage
    // on ethereum's bloated ass blockchain.

    // increments in 1
    // salaries are roughly DK salaries / $500
    // and can be negative!
    int8 salary;

    // fantasy points at end of tournament
    int8 points;
  }


  struct Lineup {
    // keccak hash of lineup before revealing
    // e.g. keccak("21059:94320:85933")
    bytes32 golferIdsHash;
    // MAX of 8 pga tour ids...
    // you can play less than 8 guys if you want!
    // e.g. ["21059", "94320", "85933"]
    bytes6[8] golferIds;
  }

  struct Contest {
    address owner; // creator of contest

    uint entryFee; // TODO(christian): what units? wei?
    uint prizePool; // TODO: delete
    // all money in contest balance, payable to winners
    mapping (bytes12 => uint) slateIdToPrizePool;

    // yay or nay, is this an active contest
    bool live;

    // have we calculated the addressBalances after contest is over?
    bool arePayoutsSet; // TODO: delete
    mapping (slateId => bool) slateIdToPayoutsSet;

    // map ETH address --> lineup in contest
    address[] entries;  // TODO: DELETE
    mapping (bytes12 => address[]) slateIdToEntries;

    mapping(address => bool) addressHasEntry; // TODO: delete
    mapping(address => Lineup) lineups;
    mapping(address => int) entryScores;

    // ETH address --> how much they recouped
    // once we confirmed the event ends, then payout!
    mapping(address => uint) balances;
  }


  event newOraclizeQuery(string description);

  // this is the initializer of the contract
  // who gets special privaledges:
  // (1) if oraclize fucks up, you set scores manually
  // (2) you can spend the extraEther in the contract
  address public contractAdmin;
  uint private extraEther;
  uint private minBal;

  // status (bool): is this oraclize query complete or not?
  mapping(bytes32 => string) queryIdToCallbackAction;

  // this is the CONSTRUCTOR!
  // we must initialize the lubrication amount
  // with the miniumum balance, which can never be recovered
  function PgaDfs() public payable {
    require(msg.value >= minBal);
    // in the constructor (this function), msg.sender is
    // the owner of the contract
    contractAdmin = msg.sender;
    extraEther = msg.value;

    // OAR for ethereum-bridge
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    // TODO: tinker with this gas value
    oraclize_setCustomGasPrice(1000000000 wei);

    // execute a dummy transcaction to make fee estimation
    // work by burning the free transaction
    oraclize_query("URL", "json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP");
  }


  // N.B. FROM CRYPTO RIC:
  // if we want to fund money into the "lubrication account"
  // this will allow the contract to function if the price
  // of ether falls dramatically between querires
  // and, as a result, because the query fee is charged in USD,
  // the fee for subsequent queries goes up
  // this should average out over time,
  // we charge a small fee to make sure it more likely going up
  // this fee, over the course of 400 wagers,
  // should offset the irrecovable minimum balance
  function deposit() payable external {
    extraEther += msg.value;
  }

  // CRYPTO RIC:
  // if we want to withdraw money from the lubrication account
  // we can only draw from the extraEther gained,
  // so as to protect and wall off funds from active wagers
  // we must leave a minBal of .1 ether to serve as lubrication
  // this protects people with wagers from us withdrawing
  // all the lubrication while they have bets in, which
  // would make them have the potential to fail
  function withdraw() external {
    require(msg.sender == contractAdmin);

    if (extraEther - minBal > 0) {
      contractAdmin.transfer(extraEther - minBal);
      extraEther = minBal;
    }
  }

  // active slate id to key slate/lineup mappings
  bytes12 slateId;
  mapping (bytes12 => uint) slateIdToLockTimestamp;

  // format: "{pgaId}:{salary}"
  // example: "34360:1522955700:15 32102:1522963620:-2" <-- salaries can be negative!
  string compressedSalariesUrl = ""; // e.g. "https://s3.amazonaws.com/ethdfs/pga/compressedSalaries/2018/471.json";

  // format: "{pgaId}:{rd1}-{rd2}-{rd3}-{rd4}"
  // example: "34360:69-66-67-71 32102:70-72-65-67"
  string compressedScoresUrl = ""; // e.g. "https://s3.amazonaws.com/ethdfs/pga/compressedScores/2018/471.json";


  // slate id ==> golfer ids
  mapping (bytes12 => bytes6[]) slateIdToGolferIds;
  // slate id ==> pga tour id ==> golfer data (salary, scores, etc.)
  mapping(bytes12 => mapping(bytes6 => Golfer)) slateIdToSalaries;

  mapping(bytes12 => Golfer) slateIdToSalaries[slateId];  // TODO: DELETE

  mapping bytes12 => (mapping address => Lineup) slateIdToLineups;

  // contest data
  bytes32[] contestIds;
  mapping(bytes32 => Contest) contests;

  // salary cap is 100
  // salaries are integers and CAN BE NEGATIVE
  // think mike weir
  int salaryCap = 100;

  // rake is 2.0% or 20/1000
  uint rakeTimesOneThousand = 20;

  // is scoring complete for the current slate
  mapping (bytes12 ==> bool) slateIdToCompleteScoring;

  function isValidLineup(bytes6[8] proposedGolferIds) public view returns (bool) {

    uint lineupLength = proposedGolferIds.length;
    if (lineupLength > 8) {
      // you can play at most 8 guys
      // does the type in function arg already prevent this?
      return false;
    }

    int16 totalSalary = 0;
    for (uint8 ii = 0; ii < lineupLength; ii++) {
      totalSalary += slateIdToSalaries[slateId][proposedGolferIds[ii]].salary;
    }

    // and if you have 8 or less guys, their total salary
    // must be less than or equal to the cap
    return totalSalary <= salaryCap;
  }

  function setLineupHash(bytes32 lineupHash) public {
    // can't change lineup hash after lock
    require(block.timestamp <= slateIdToLockTimestamp[slateId]);
    slateIdToLineups[slateId][msg.sender] = lineupHash;
  }

  function setAlreadyValidatedLineup(bytes32 contestId, bytes6[8] proposedGolferIds, address lineupAddress) public {
    // TODO: ENCRYPT THIS LATER w/ Ric's idea
    // EVERYONES LINEUPS ARE PUBLIC DATA RIGHT NOW LOL
    // OR: use the jim hashed lineup trick,
    // united with a really good frontend
    // for revealing the lineup you have
    Contest storage contest = contests[contestId];
    contest.lineups[lineupAddress] = Lineup({golferIds : proposedGolferIds});
    contest.addressHasEntry[lineupAddress] = true;
  }

  function isNewContestValid(bytes32 contestId, address proposedNewOwner) public view returns (bool) {
    // make sure we aren't overwriting a previously used contestId.
    // however, re-use of contest id is okay.
    // that way, people can remember contest ids and join their fav
    // contests without having to look for a link
    if (contests[contestId].owner) {
      Contest memory oldContest = contests[contestId];

      if (oldContest.live) {
        // you can't re-create a live contest.
        // prevents contest owners from
        // effectively deleting a contest
        return false;
      }

      // if we have a contest, check that the
      // owner is the only one re-using it.
      return (oldContest.owner == proposedNewOwner);
    } else {
      // if a contest with this contestId does not exist,
      // then yes we can create it
      return true;
    }
  }

  function calculateRake(uint eth) public view returns (uint) {
    return eth - (eth * rakeTimesOneThousand) / 1000;
  }

  function createContest(bytes32 contestId, bytes6[8] proposedGolferIds) public payable {
    // when you make a contest, you also must make a lineup, and you are auto-joined
    require(isNewContestValid(contestId, msg.sender));
    require(isValidLineup(proposedGolferIds));

    contestIds.push(contestId);
    contests[contestId] = Contest({
      owner : msg.sender,
      // entry fee is AUTOMATICALLY calculated by how much the owner deposits
      entryFee : msg.value - calculateRake(msg.value),
      live : true,
    });
    payEntryFeeToContest(contestId, msg.sender, msg.value);
  }

  function enterContest(bytes32 contestId, bytes6[8] proposedGolferIds) public payable {
    require(isValidLineup(proposedGolferIds));
    payEntryFeeToContest(contestId, msg.sender, msg.value);
    setAlreadyValidatedLineup(contestId, proposedGolferIds, msg.sender);
  }

  function editLineupInContest(bytes32 contestId, bytes6[8] proposedGolferIds) public {
    require(isValidLineup(proposedGolferIds));
    setAlreadyValidatedLineup(contestId, proposedGolferIds, msg.sender);
  }

  function payEntryFeeToContest(bytes32 contestId, address msgSender, uint ethEntered) public payable {

    Contest storage activeContest = contests[contestId];
    if (!activeContest.addressHasEntry[msgSender]) {
      // if they not are already in the contest, pay rake and enter
      uint rakeToCollect = calculateRake(ethEntered);

      require(ethEntered > activeContest.entryFee + rakeToCollect);

      activeContest.prizePool += activeContest.entryFee;
      extraEther += rakeToCollect;
      // if someone sends us extra money,
      // it goes their balance for the contest
      // and by default they can get paid out at the end
      // otherwise they can withdraw
      activeContest.balances[msgSender] += ethEntered - activeContest.entryFee - rakeToCollect;
    }

  }

  function toBytes6(string memory source) returns (bytes6 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 6))
    }
  }


  function setSalaries(string compressedSalaries) public {

    slateIdToCompleteScoring[slateId] = false;

    var compressedSalariesSlice = compressedSalaries.toSlice();
    var playerDelimiter = " ".toSlice();
    var playerSlices = new strings.slice[](compressedSalariesSlice.count(playerDelimiter) + 1);

    for (ii = 0; ii < playerSlices.length; ii++) {
      playerSlices[ii] = compressedSalariesSlice.split(playerDelimiter);
      bytes6 pgaPlayerId = toBytes6(playerSlices[ii].split(":".toSlice()).toString());
      int8 salary = int8(parseInt(playerSlices[ii].split("-".toSlice()).toString()));

      slateIdToGolferIds[slateId][ii] = pgaPlayerId;
      slateIdToSalaries[slateId][pgaPlayerId] = Golfer({
          salary : salary,
          points : 0
        });
    }
  }

  function setScores(string compressedScores) public {
    // TODO: really make sure this works
    // TODO: difference between var and normal types?
    require(!slateIdToCompleteScoring[slateId]);

    var compressedScoresSlice = compressedScores.toSlice();
    var playerDelimiter = " ".toSlice();
    var playerScoreSlices = new strings.slice[](compressedScoresSlice.count(playerDelimiter) + 1);

    for (uint16 i = 0; i < playerScoreSlices.length; i++) {
      playerScoreSlices[i] = compressedScoresSlice.split(playerDelimiter);
      bytes6 pgaPlayerId = toBytes6(playerScoreSlices[i].split(":".toSlice()).toString());
      uint roundSlices = playerScoreSlices[i].count("-".toSlice()) + 1;
      for (uint rd = 0; rd < roundSlices; rd++) {
        int8 rdScore = int8(parseInt(playerScoreSlices[i].split("-".toSlice()).toString()));
        slateIdToSalaries[slateId][pgaPlayerId].points += int8(80) - rdScore;
      }
    }
    slateIdToCompleteScoring[slateId] = true;
  }

  function setSingleContestPayouts(bytes32 contestId) public {
    // everyone who scores > max(0, the contest average) gets paid
    // you are paid proportional to your squared score
    require(slateIdToCompleteScoring[slateId]);

    Contest storage contest = contests[contestId];
    require(contest.live);
    require(!contest.arePayoutsSet);

    int32 totalEntries = int32(contest.entries.length);
    int totalPoints = 0;

    // calculate the average score in the contest
    for (uint8 ii = 0; ii < totalEntries; ii++) {
      address entry = contest.entries[ii];
      bytes6[8] memory entryPgaIds = contest.lineups[entry].golferIds;
      for (uint8 g = 0; g < entryPgaIds.length; g++) {
        contest.entryScores[entry] += slateIdToSalaries[slateId][entryPgaIds[g]].points;
      }
      totalPoints += contest.entryScores[entry];
    }

    // of the top half (except any of those that scored < 0),
    // sum up the squared scores
    int averagePointsRoundedDown = totalPoints / totalEntries;
    // ugh... only using storage since memory isnt dynamic
    address[] storage winningEntries;
    uint summedSquaredWinningScores = 0;

    for (ii = 0; ii < totalEntries; ii++) {
      entry = contest.entries[ii];
      if (contest.entryScores[entry] >= averagePointsRoundedDown && contest.entryScores[entry] >= 0) {
        uint squaredScore = uint(contest.entryScores[entry] * contest.entryScores[entry]);
        winningEntries.push(entry);
        summedSquaredWinningScores += squaredScore;
      }
    }

    // then pay out people proportional to squared points
    for (ii = 0; ii < winningEntries.length; ii++) {
      entry = winningEntries[ii];
      // TODO: make sure there's no rounding error B.S. going on
      // that makes us massively over or under pay people
      squaredScore = uint(contest.entryScores[entry] * contest.entryScores[entry]);
      uint toPayout = (contest.prizePool * squaredScore) / summedSquaredWinningScores;
      contest.balances[entry] += toPayout;
    }

    contest.arePayoutsSet = true;
  }

  function withdrawBalanceFromContest(bytes32 contestId) public {
    Contest storage contest = contests[contestId];
    if (contest.balances[msg.sender] > 0) {
      msg.sender.transfer(contest.balances[msg.sender]);
      contest.balances[msg.sender] = 0;
    }
  }

  function payOutContest(bytes32 contestId) public {
    require(slateIdToCompleteScoring[slateId]);

    Contest storage contest = contests[contestId];
    require(contest.arePayoutsSet);
    require(contest.live);

    for (uint ii = 0; ii < contest.entries.length; ii++) {
      address entry = contest.entries[ii];
      if (contest.balances[entry] > 0) {
        entry.transfer(contest.balances[entry]);
        contest.balances[msg.sender] = 0;
      }
    }

    contest.live = false;
  }

  function setScoresUrlAndGetResultsOnChain(string compressedScoresUrl_) public {
      require(msg.sender == contractAdmin);
      setCompressedScoresUrl(compressedScoresUrl_);
      getScoresOnChain();
  }

  function setSalariesUrlAndGetSalariesOnChain(string compressedSalariesUrl_) public {
      require(msg.sender == contractAdmin);
      setCompressedSalariesUrl(compressedSalariesUrl_);
      getSalariesOnChain();
  }

  function setNewSlateInfo(
    bytes12 newSlateId_,
    uint lockTimestamp,
    string compressedSalariesUrl_,
    string compressedScoresUrl
  ) public {
    require(msg.sender == contractAdmin);
    slateId = newSlateId;
    slateIdToLockTimestamp[slateId] = lockTimestamp;
    compressedSalariesUrl = compressedSalariesUrl_;
    compressedScoresUrl = compressedScoresUrl_;
  }

  function getSalariesOnChain() public payable {
    innerOraclizeQuery(compressedSalariesUrl, "Salaries");
  }

  function getScoresOnChain() public payable {
    innerOraclizeQuery(compressedScoresUrl, "Scores");
  }

  // ========================= ORACLIZE functions =========================


  function innerOraclizeQuery(string queryUrl, string callbackAction) public payable {
    // TODO: make these views
    uint cost = 2400000000000000 + (oraclize_getPrice("URL") * 3);
    uint fee = 100000000000000;

    if (msg.value < cost + fee) {
      newOraclizeQuery("Oraclize query failed. Send more ETH (.0025ETH in gas + $.03 per query");
      msg.sender.transfer(msg.value);
    } else {
      extraEther += msg.value - cost;
      newOraclizeQuery("Oraclize queries were sent, standing by for the answer.");
      bytes32 queryId = oraclize_query(
        "URL",
        strConcat("json(", queryUrl, ").compressedScores"),
        600000
      );
      queryIdToCallbackAction[queryId] = callbackAction;
    }
  }

  // switch function for callbacks
  function __callback(bytes32 myid, string result) public {
    require(msg.sender == oraclize_cbAddress());
    // can't compare string storage pointers and string literals,
    // so instead let's compare their keccak256 hashes!
    bytes32 actionHash = keccak256(queryIdToCallbackAction[myid]);
    if (actionHash == keccak256("Salaries")) {
      setSalaries(result);
    }
    if (actionHash == keccak256("Scores")) {
      setScores(result);
    }
  }

  // CRYPTO RIC:
  // should anyone wish to be a good blockchain citizen
  // and delete a wager that is no longer live
  function deleteContest(bytes32 contestId) external {
    require(!contests[contestId].live);
    // can't delete someone else's contest
    require(msg.sender == contests[contestId].owner);
    delete contests[contestId];
  }

  function getLiveContestIds() public view returns (bytes32[]) {
    bytes32[] liveContestIds;
    for (uint ii = 0; ii < contestIds.length; ii++) {
      bytes32 contestId = contestIds[ii];
      if (contests[contestId].live) {
        liveContestIds.push(contestId);
      }
    }
    return liveContestIds;
  }

  function getContestById(bytes32 contestId) public view returns (
      bytes32,
      uint,
      uint,
      address,
      uint
    ) {
      Contest memory contest = contests[contestId];
      return (
          contestId,
          contest.entryFee,
          contest.entries.length,
          contest.owner
        );
    }

  function testFunction() public view returns (string) {
    return 'test';
  }
}
