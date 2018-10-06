<template>
    <div>
        <h1 class="title">Balance: {{ this.contractBalanceEth }} ETH </h1>
        <button class="btn" @click="refreshContractBalanceEth">refresh</button>
        <button class="btn btn-primary" :disabled="disableSubmit" @click="performSubmit">withdraw</button>
        <strong v-show="submitting">Submitting...</strong>
        <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
    </div>
</template>

<script>
    // importing common function
    import mixin from '../libs/mixinViews';
    export default {
        mixins: [mixin],
        data() {
            return {
                submitting: false,
                errorSubmit: false,
                successMessage: false,
                contractBalanceEth: 0
            }
        },
        computed: {
            /**
             * It disables the submit button when the the name or lockTimestamp are not filled
             * or the submit button is pressed or the connection with the blockchin is
             * not established.
             */
            disableSubmit() {
                return this.contractBalanceEth
            }
        },
        methods: {
            performSubmit() {
                this.submitting = true
                this.errorSubmit = false
                this.successMessage = false
                // calling the function registerUser of the smart contract
                console.log('calling createContest newContest.vue L136')
                window.bc.contract().withdrawBalance(
                    {
                        from: window.bc.web3().eth.coinbase,
                        gas: 800000,
                        value: 0
                    },
                    (err, txHash) => {
                        if (err) {
                            console.error(err)
                            this.errorSubmit = true
                        } else {
                            this.successMessage = true
                        }
                    }
                )
            },
            getContractBalanceEth() {
                window.bc.contract().getUserBalance.call(
                    window.bc.web3().eth.coinbase,
                    (err, balance) => {
                        if (err) {
                            console.log('error getUserBalance', err)
                        }
                        else {
                            return balance
                        }
                    }
                )
            },
            refreshContractBalanceEth() {
                this.contractBalanceEth = this.getContractBalanceEth()
            }
        },
        created() {
            this.refreshContractBalanceEth()
        }
    }
</script>
