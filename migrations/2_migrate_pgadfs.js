var PgaDfs = artifacts.require("./PgaDfs.sol");

module.exports = function(deployer) {
    deployer.deploy(
      PgaDfs,
      { gas:6721975, value: 500000000000000000 }
    );
};
