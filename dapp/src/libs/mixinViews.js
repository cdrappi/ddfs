import BcExplorer from './BcExplorer'
import PgaDfsContract from '../assets/PgaDfsContract.json';

let mixinViews = {
    data() {
        return {
            bcConnected: false, // true when the connection with the blockchain is established, plus the contract ABI + address is correctli initialized
            bcConnectionError: false,
            bcSmartContractAddressError: false
        }
    },

    created() {
        // when this file is imported to other component it checks if the BcExplorer
        // is instatiated.
        if (window.bc == undefined) {
            window.bc = new BcExplorer

            // connecting to the blockchain and intializing the smart contract
            window.bc.initWithContractJson(PgaDfsContract, 'http://127.0.0.1:7545')
            .then((error) => {
                // handling the connection error
                if (error) {
                    this.bcConnectionError = true
                    this.bcConnected = false
                    console.log(error)
                }
                else {
                    // calling a smart contract function in order to check the contract address
                    // is correct. NOTE: here you might be connected successfully.
                    // TODO: the check of the smart contract address validity it should be BcExplorer duty
                    console.log('calling testfunction mixinviews L33')
                    window.bc.contract().testFunction.call((errorReg, res) => {
                        if (errorReg) {
                            this.bcConnectionError = true
                            this.bcSmartContractAddressError = true
                            console.error('error calling testfunction mixinviews L33', errorReg)
                        }
                        else {
                            this.bcConnectionError = false
                            console.log('success calling testfunction mixinviews L33')
                        }

                        this.bcConnected = this.blockchainIsConnected()
                    })
                }
            })
        }
    },

    methods: {
        /**
         * Check if the connection with the blockchain is established and if the smart
         * contract ABI + address are correctly initialized.
         */
        blockchainIsConnected() {
            this.bcConnected = ((window.bc != undefined) && window.bc.isConnected())

            return this.bcConnected
        },

        /**
         * Transform the parameter from bytes to string.
         */
        toAscii(bytesStr) {
            return window.bc.toAscii(bytesStr)
        },

        /**
         * Transform a timestamp number to date.
         */
        toDate(timestamp) {
            return new Date(timestamp * 1000).toISOString()
        }
    }
}


export default mixinViews
