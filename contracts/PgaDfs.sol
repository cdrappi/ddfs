pragma solidity 0.4.18;

import "./lib/oraclize/oraclizeAPI_0.4.sol";
import "./lib/arachnid/solidity-stringutils/strings.sol";


contract PgaDfs is usingOraclize {
    
    using strings for *;

    struct SlateGolfer {
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
        bool submittedHash;    // true when saved
        // keccak hash of lineup before revealing
        // e.g. keccak256("21059:94320:85933:8793")

        bytes32 golferIdsHash;
        // MAX of 8 pga tour ids...
        // you can play less than 8 guys if you want!
        // some older players have leading "0"s (e.g. Tiger "08793")
        // leading zeroes are dropped, so his I.D. is 8793
        uint16[8] golferIds;
    }

    struct Contest {
        address owner; // creator of contest

        uint entryFee; // TODO(christian): what units? wei?
        // all money in contest balance, payable to winners
        mapping (bytes12 => uint) slateIdToPrizePool;

        // yay or nay, is this an active contest
        // must be not live to delete contest
        bool live;

        // have we calculated the address balances after contest is over?
        mapping (bytes12 => bool) slateIdToPayoutsSet;

        // map ETH address --> lineup in contest
        mapping (bytes12 => address[]) slateIdToEntries;

        mapping (bytes12 => mapping(address => bool)) slateIdToEntered;
        mapping (bytes12 => mapping(address => int32)) slateIdToAddressScores;

        // slate --> ETH address --> how much they recouped
        mapping(bytes12 => mapping(address => uint)) recoup;
    }

    event newOraclizeQuery(string description);

    // this is the initializer of the contract
    // who gets special privaledges:
    // (1) if oraclize fucks up, you set scores manually
    // (2) you can spend the extraEther in the contract
    address public contractAdmin;
    uint private extraEther;
    uint private minBal;

    mapping(address => uint) userBalances;

    // status (bool): is this oraclize query complete or not?
    mapping(bytes32 => string) queryIdToCallbackAction;

    // this is the CONSTRUCTOR!
    // we must initialize the lubrication amount
    // with the miniumum balance, which can never be recovered
    function PgaDfs() public payable {
        require(msg.value >= minBal); // , "must initialise contract with at least minBal eth");
        // in the constructor (this function), msg.sender is
        // the owner of the contract
        contractAdmin = msg.sender;
        extraEther = msg.value;

        // OAR for ethereum-bridge
        OAR = OraclizeAddrResolverI(0x15Ce83f7B43082C21deB5bEDd004e2F683B45392);
        // TODO: tinker with this gas value
        /* oraclize_setCustomGasPrice(1000000000 wei); */

        // execute a dummy transcaction to make fee estimation
        // work by burning the free transaction
        /* oraclize_query("URL", "json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP"); */
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
    function withdraw() payable external {
        require(msg.sender == contractAdmin); //, "only contract admin can do this");

        if (extraEther - minBal > 0) {
            contractAdmin.transfer(extraEther - minBal);
            extraEther = minBal;
        }
    }

    function withdrawBalance() public payable {
        require(userBalances[msg.sender] > 0); //, "you have no ether to withdraw");
        msg.sender.transfer(userBalances[msg.sender]);
        userBalances[msg.sender] = 0;
    }

    // active slate id to key slate/lineup mappings
    bytes12[] slateIds;
    mapping (bytes12 => uint) slateIdToLockTimestamp;

    // format: "{pgaId}:{salary}"
    // example: "34360:1522955700:15 32102:1522963620:-2" <-- salaries can be negative!
    string compressedSalariesUrl = ""; // e.g. "https://s3.amazonaws.com/ethdfs/pga/compressedSalaries/2018/471.json";

    // format: "{pgaId}:{rd1}-{rd2}-{rd3}-{rd4}"
    // example: "34360:69-66-67-71 32102:70-72-65-67"
    string compressedScoresUrl = ""; // e.g. "https://s3.amazonaws.com/ethdfs/pga/compressedScores/2018/471.json";

    // slate id ==> golfer ids
    // NOTE: uint16 for golfer ids is really fucking pushing it,
    // as PGA tour is on ID's around 55k or so.
    // the max uint8 number is 65,535. lol
    mapping (bytes12 => uint16[]) slateIdToGolferIds;
    // slate id ==> pga tour id ==> golfer data (salary, scores, etc.)
    mapping (bytes12 => mapping(uint16 => SlateGolfer)) slateIdToSlateGolfers;
    mapping (bytes12 => address[]) slateIdToEnteredAddresses;
    mapping (bytes12 => mapping (address => Lineup)) slateIdToLineups;
    mapping (bytes12 => mapping (address => int16)) slateIdToEntryScores;

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
    mapping (bytes12 => bool) slateIdToCompleteGolferScoring;
    mapping (bytes12 => bool) slateIdToCompleteLineupScoring;


    function getLiveContestIds() public view returns (bytes32[]) {
        return contestIds;
    }

    function getSlateContest(bytes12 slateId_, bytes32 contestId_) public view returns (
            bytes32,
            uint,
            uint,
            address,
            uint
        ) {
            Contest storage contest = contests[contestId_];
            return (
                    contestId_,
                    contest.entryFee,
                    contest.slateIdToEntries[slateId_].length,
                    contest.owner,
                    contest.slateIdToPrizePool[slateId_]
                );
        }

    function getContestEntries(bytes12 slateId_, bytes32 contestId_) public view returns (address[]) {
        return contests[contestId_].slateIdToEntries[slateId_];
    }

    function getContestRecoup(bytes12 slateId_, bytes32 contestId_, address address_) public view returns (uint) {
        return contests[contestId_].recoup[slateId_][address_];
    }

    function getContestPrizePool(bytes12 slateId_, bytes32 contestId_) public view returns (uint) {
        return contests[contestId_].slateIdToPrizePool[slateId_];
    }

    function getEntryScore(bytes12 slateId_, address entry_) public view returns (int16) {
        return slateIdToEntryScores[slateId_][entry_];
    }

    function getGolferIdsOnSlate(bytes12 slateId_) public view returns (uint16[]) {
        return slateIdToGolferIds[slateId_];
    }

    function testFunction() public view returns (string) {
        return "test";
    }

    function setLineupHash(bytes12 slateId_, bytes32 lineupHash) public {
        // can't change lineup hash after lock
        require(block.timestamp <= slateIdToLockTimestamp[slateId_]); //, "entries have locked");
        Lineup storage theLineup = slateIdToLineups[slateId_][msg.sender];
        if (!theLineup.submittedHash) {
                // don't push duped addresses if they already have a lineup
                slateIdToEnteredAddresses[slateId_].push(msg.sender);
        }
        theLineup.golferIdsHash = lineupHash;
        theLineup.submittedHash = true;
    }

    // returns: Lineup.golferIdsHash
    function getLineupHash(bytes12 slateId_, address entrantAddress) public view returns (bytes32) {
        return slateIdToLineups[slateId_][entrantAddress].golferIdsHash;
    }

    function getEnteredAddressesForSlate(bytes12 slateId_) public view returns (address[]) {
            return slateIdToEnteredAddresses[slateId_];
    }

    function getLineupForSlateAddress(bytes12 slateId_, address address_) public view returns (bytes32, uint16[8], int16) {
            Lineup memory theLineup = slateIdToLineups[slateId_][address_];
            return (theLineup.golferIdsHash, theLineup.golferIds, slateIdToEntryScores[slateId_][address_]);
    }

    function getSlateIds() public view returns (bytes12[]) {
        return slateIds;
    }

    function getSalary(bytes12 slateId_, uint16 pgaId_) public view returns (int8) {
        return slateIdToSlateGolfers[slateId_][pgaId_].salary;
    }

    function getPoints(bytes12 slateId_, uint16 pgaId_) public view returns (int8) {
        return slateIdToSlateGolfers[slateId_][pgaId_].points;
    }

    // lineups must:
    // have 8 or less players
    // total salary must be <= salary cap
    // can only play the same guy once
    function revealLineup(bytes12 slateId_, string golferIdsColonDelimited, string revealKey) public returns (int16) {
        require(slateIdToLineups[slateId_][msg.sender].golferIdsHash == keccak256(strConcat(golferIdsColonDelimited, "|", revealKey)));

        var golferIds = new uint16[](8);

        var golferIdsSlice = golferIdsColonDelimited.toSlice();
        var delimiter = ":".toSlice();
        uint256 golferCount = golferIdsSlice.count(delimiter) + 1;

        require(golferCount <= 8); //, "must have 8 or less players");

        // and salary must be under cap
        int16 totalSalary = 0;

        for (uint8 ii = 0; ii < golferCount; ii++) {
            // string    --> left padded bytes32
            // "29725" --> "0x3239373235000000000000000000000000000000000000000000000000000000"
            // replicate this with web3.fromAscii('29725')
            uint16 golferId = uint16(parseInt(golferIdsSlice.split(delimiter).toString()));

            for (uint8 jj = 0; jj < ii; jj++) {
                require(golferId != golferIds[jj]); //, "cannot duplicate golfer in lineup");
            }
            golferIds[ii] = golferId;
            totalSalary += slateIdToSlateGolfers[slateId_][golferId].salary;
        }

        require(totalSalary <= salaryCap); //, "must be under the salary cap");

        for (ii = 0; ii < golferIds.length; ii++) {
            slateIdToLineups[slateId_][msg.sender].golferIds[ii] = golferIds[ii];
        }
    }

    function calculateRake(uint wei_) public view returns (uint) {
        return (wei_ * rakeTimesOneThousand) / 1000;
    }

    function createContest(bytes12 slateId_, bytes32 contestId) public payable {
        // contest id cannot be taken already
        require(!contests[contestId].live); //, "already exists live contest with that ID");
        // contest owner must first have lineup hash on chain
        require(slateIdToLineups[slateId_][msg.sender].submittedHash); //, "must submit hash before creating contest"

        contestIds.push(contestId);
        contests[contestId] = Contest({
            owner : msg.sender,
            // entry fee is AUTOMATICALLY calculated by how much the owner deposits
            entryFee : msg.value,
            live : true
        });
        payEntryFeeToContest(slateId_, contestId, msg.sender, msg.value);
    }

    function enterContest(bytes12 slateId_, bytes32 contestId_) public payable {
        // to enter contest, user must have lineup hash on chain
        Lineup memory entrantLineup = slateIdToLineups[slateId_][msg.sender];
        require(entrantLineup.submittedHash); //, "must submit lineup hash before joining contest"
        payEntryFeeToContest(slateId_, contestId_, msg.sender, msg.value);
    }

    function payEntryFeeToContest(bytes12 slateId_, bytes32 contestId_, address msgSender, uint ethEntered) public payable {

        Contest storage activeContest = contests[contestId_];
        // if they not are already in the contest, pay rake and enter
        require(!activeContest.slateIdToEntered[slateId_][msgSender]); //, "already entered in this contest");

        uint rakeToCollect = calculateRake(ethEntered);

        require(ethEntered >= activeContest.entryFee); //, "must send >= eth as entry fee");

        activeContest.slateIdToPrizePool[slateId_] += (activeContest.entryFee - rakeToCollect);
        extraEther += rakeToCollect;
        // if someone sends us extra money,
        // it goes their user balance
        userBalances[msgSender] += (ethEntered - activeContest.entryFee);
        activeContest.slateIdToEntries[slateId_].push(msgSender);
        activeContest.slateIdToEntered[slateId_][msgSender] = true;
    }

    function setSalaries(bytes12 slateId_, string compressedSalaries) public {
            require(msg.sender == contractAdmin); //, "only contractAdmin can set salaries");
            slateIdToCompleteGolferScoring[slateId_] = false;

            var compressedSalariesSlice = compressedSalaries.toSlice();
            var playerDelimiter = " ".toSlice();
            var salaryDelimiter = ":".toSlice();
            uint playerCount = compressedSalariesSlice.count(playerDelimiter) + 1;

            for (uint8 ii = 0; ii < playerCount; ii++) {
                    var playerColonSalary = compressedSalariesSlice.split(playerDelimiter);

                    uint16 pgaPlayerId = uint16(parseInt(playerColonSalary.split(salaryDelimiter).toString()));

                    slateIdToGolferIds[slateId_].push(pgaPlayerId);
                    slateIdToSlateGolfers[slateId_][pgaPlayerId].salary = int8(parseInt(playerColonSalary.toString()));
            }
    }

    function setScores(bytes12 slateId_, string compressedScores) public {
        // TODO: make internal / only contractAdmin
        // TODO: really make sure this works
        // TODO: difference between var and normal types?
        require(!slateIdToCompleteGolferScoring[slateId_]); //, "already completed golfer scoring for this slate");

        var compressedScoresSlice = compressedScores.toSlice();
        var playerDelimiter = " ".toSlice();
        var playerScoreSlices = new strings.slice[](compressedScoresSlice.count(playerDelimiter) + 1);

        for (uint16 i = 0; i < playerScoreSlices.length; i++) {
            playerScoreSlices[i] = compressedScoresSlice.split(playerDelimiter);
            uint16 pgaPlayerId = uint16(parseInt(playerScoreSlices[i].split(":".toSlice()).toString()));
            slateIdToSlateGolfers[slateId_][pgaPlayerId].points = int8(parseInt(playerScoreSlices[i].toString()));
        }
        slateIdToCompleteGolferScoring[slateId_] = true;
    }

    function scoreEnteredAddresses(bytes12 slateId_) public {
        require(slateIdToCompleteGolferScoring[slateId_]); //, "already completed golfer scoring for this slate");
        for (uint8 ii = 0; ii < slateIdToEnteredAddresses[slateId_].length; ii++) {
            address entry = slateIdToEnteredAddresses[slateId_][ii];
            uint16[8] memory entryPgaIds = slateIdToLineups[slateId_][entry].golferIds;
            for (uint8 g = 0; g < entryPgaIds.length; g++) {
                slateIdToEntryScores[slateId_][entry] += slateIdToSlateGolfers[slateId_][entryPgaIds[g]].points;
            }
        }
    }

    function averagePoints(bytes12 slateId_, bytes32 contestId_) public returns (int) {
        int totalPoints = 0;
        // calculate the average score in the contest
        uint16 totalEntries = uint16(contests[contestId_].slateIdToEntries[slateId_].length);
        for (uint8 ii = 0; ii < totalEntries; ii++) {
            totalPoints += slateIdToEntryScores[slateId_][contests[contestId_].slateIdToEntries[slateId_][ii]];
        }
        return totalPoints / totalEntries;
    }

    function sumSquaredWinners(bytes12 slateId_, bytes32 contestId_, int averagePoints_) public returns (uint) {

        uint summedSquaredWinningScores = 0;

        uint16 totalEntries = uint16(contests[contestId_].slateIdToEntries[slateId_].length);
        for (uint8 ii = 0; ii < totalEntries; ii++) {
            int16 score = slateIdToEntryScores[slateId_][contests[contestId_].slateIdToEntries[slateId_][ii]];
            if (score >= averagePoints_ && score >= 0) {
                uint squaredScore = uint(score) * uint(score);
                summedSquaredWinningScores += squaredScore;
            }
        }
        return summedSquaredWinningScores;
    }

    function setSingleContestPayouts(bytes12 slateId_, bytes32 contestId_) public {
        // everyone who scores > max(0, the contest average) gets paid
        // you are paid proportional to your squared score
        require(slateIdToCompleteGolferScoring[slateId_]); //, "must complete golfer & lineup scoring before determining contest payouts");

        Contest storage contest = contests[contestId_];
        require(contest.live); //, "contest is not live");
        require(!contest.slateIdToPayoutsSet[slateId_]); //,"contest payouts have already been set");

        uint remainingContestFunds = contest.slateIdToPrizePool[slateId_];

        // of the top half (except any of those that scored < 0),
        // sum up the squared scores
        uint16 totalEntries = uint16(contests[contestId_].slateIdToEntries[slateId_].length);
        int averagePointsRoundedDown = averagePoints(slateId_, contestId_);
        uint summedSquaredWinningScores = sumSquaredWinners(slateId_, contestId_, averagePointsRoundedDown);

        // then pay out people proportional to squared points
        for (uint8 ii = 0; ii < totalEntries; ii++) {
            address entry = contest.slateIdToEntries[slateId_][ii];
            int16 score = slateIdToEntryScores[slateId_][entry];
            if (score >= averagePointsRoundedDown && score >= 0) {
                // TODO: make sure there's no rounding error B.S. going on
                // that makes us massively over or under pay people
                uint toPayout = (contest.slateIdToPrizePool[slateId_] * uint(score) * uint(score)) / summedSquaredWinningScores;
                contest.recoup[slateId_][entry] = toPayout;
                userBalances[entry] += toPayout;
                remainingContestFunds -= toPayout;
            }
        }
        // make sure we paid out the entire contest correctly
        require(100 * remainingContestFunds < contest.slateIdToPrizePool[slateId_]); //, "due to rounding errors we paid out the contest incorrectly");
        extraEther += remainingContestFunds;
        contest.slateIdToPayoutsSet[slateId_] = true;
        contest.live = false;
    }

    function getUserBalance(address address_) public view returns (uint) {
        return userBalances[address_];
    }

    function _setCompressedScoresUrl(string _compressedScoresUrl) internal {
        compressedScoresUrl = _compressedScoresUrl;
    }

    function _setCompressedSalariesUrl(string _compressedSalariesUrl) internal {
        compressedSalariesUrl = _compressedSalariesUrl;
    }

    function getSalariesOnChain() public payable {
        innerOraclizeQuery(compressedSalariesUrl, "Salaries");
    }

    function getScoresOnChain() public payable {
        innerOraclizeQuery(compressedScoresUrl, "Scores");
    }

    function setScoresUrlAndGetResultsOnChain(string compressedScoresUrl_) public {
            require(msg.sender == contractAdmin); //, "only contract admin can perform this action");
            _setCompressedScoresUrl(compressedScoresUrl_);
            getScoresOnChain();
    }

    function setSalariesUrlAndGetSalariesOnChain(string compressedSalariesUrl_) public {
            require(msg.sender == contractAdmin); //, "only contract admin can perform this action");
            _setCompressedSalariesUrl(compressedSalariesUrl_);
            getSalariesOnChain();
    }

    function setNewSlateInfo(
        bytes12 _newSlateId,
        string _compressedSalariesUrl,
        string _compressedScoresUrl,
        uint lockTimestamp
    ) public {
        require(msg.sender == contractAdmin); //, "only contract admin can perform this action");
        require(slateIdToLockTimestamp[_newSlateId] == 0); // "already created a slate with this id"
        slateIds.push(_newSlateId);
        slateIdToLockTimestamp[_newSlateId] = lockTimestamp;
        _setCompressedScoresUrl(_compressedScoresUrl);
        _setCompressedSalariesUrl(_compressedSalariesUrl);
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
        require(msg.sender == oraclize_cbAddress()); //, "message was not from oraclize address");
        // can't compare string storage pointers and string literals,
        // so instead let's compare their keccak256 hashes!
        bytes32 actionHash = keccak256(queryIdToCallbackAction[myid]);
        bytes12 slateId_ = "";
        if (actionHash == keccak256("Salaries")) {
            setSalaries(slateId_, result);
        }
        if (actionHash == keccak256("Scores")) {
            setScores(slateId_, result);
        }
    }

    // CRYPTO RIC:
    // should anyone wish to be a good blockchain citizen
    // and delete a wager that is no longer live
    function deleteContest(bytes32 contestId) external {
        require(!contests[contestId].live); //, "cannot delete a live contest");
        require(msg.sender == contests[contestId].owner); //, "only owner can delete their contest");
        delete contests[contestId];
    }
}
