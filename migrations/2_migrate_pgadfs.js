var PgaDfs = artifacts.require("./PgaDfs.sol");

module.exports = function(deployer) {
    deployer.deploy(
      PgaDfs,
      { gas:9000000, value: 600000000000000000 }
    );
};
