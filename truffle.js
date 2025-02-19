/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
 module.exports = {
     networks: {
         ganache: {
      			 host: "127.0.0.1",
      			 port: 7545,
      			 network_id: "*",
             gas: 8000000,
             gasPrice: 200000000
         }
     },
     solc: {
         optimizer: {
             enabled: true,
             runs: 200
         }
     }
 };
