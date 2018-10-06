var PgaDfs = artifacts.require("./PgaDfs.sol");

module.exports = function(deployer) {
    deployer.deploy(
      PgaDfs,
      { gas: 7500000, value: 600000000000000000 }
    );
};
