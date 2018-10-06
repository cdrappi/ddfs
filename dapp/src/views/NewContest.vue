<template>
	<div>
		<h1 class="title">New Contest</h1>

		<div class="row">
			<div class="col-md-3">

	            <div class="form-group">
	                <label for="description">Contest ID</label>
	                <input class="form-control" placeholder="New Contest ID" type="text" v-model="contestId">
	            </div>


	            <div class="form-group">
	                <label for="description">Entry Fee (in ETH)</label>
	                <input class="form-control" placeholder="Entry Fee" type="number" v-model="entryFee">
	            </div>

	            <button class="btn btn-primary" :disabled="disableSubmit" @click="performSubmit">Create New Contest</button>
                <strong v-show="submitting">Submitting...</strong>
                <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>

                <p v-show="successMessage" class="text-success">
                    <strong>created new contest</strong>
                    <br>
                    You will be redirected to the lobby
										<strong>once the block is mined!</strong>
                </p>
			</div>
		</div>
	</div>
</template>

<script>
    // importing common function
    import mixin from '../libs/mixinViews';
    export default {
			mixins: [mixin],
    	data() {
    		return {
    			contestId: "", // variable binded with the input field: name
          entryFee: 0, // in ETH
    			submitting: false, // true once the submit button is pressed
          successMessage: false, // true when the user has been registered successfully
          tmoConn: null, // contain the intervalID given by setInterval
          tmoReg: null, // contain the intervalID given by setInterval
          errorSubmit: false, // it shows the erro message
    		}
    	},
    	computed: {
            /**
             * It disables the submit button when the the name or lockTimestamp are not filled
             * or the submit button is pressed or the connection with the blockchin is
             * not established.
             */
            disableSubmit() {
                return (
                  // TODO: add check to see if contest is owned by user
									   !this.contestId
                  || !this.entryFee
									|| this.submitting
									|| !this.blockchainIsConnected()
								)
            }
        },
        methods: {
        	performSubmit() {
                this.submitting = true
                this.errorSubmit = false
                this.successMessage = false
                // calling the function registerUser of the smart contract
								console.log('calling createContest newContest.vue L136')
                window.bc.contract().createContest(
                    this.contestId,
                    {
                        from: window.bc.web3().eth.coinbase,
                        gas: 800000,
                        value: Math.ceil(this.entryFee * 1e18)
                    },
                    (err, txHash) => {
                        if (err) {
                            console.error(err)
                            this.errorSubmit = true
                        }
                        else {
                            this.successMessage = true
                            // it emits a global event in order to update the top menu bar
                            // Event.$emit('userregistered', txHash);
                            // the transaction was submitted and the user will be redirected to the
                            // profile page once the block will be mined
                            // this.redirectWhenBlockMined()
                        }
                    }
                )
        	}
        }
      }
</script>
