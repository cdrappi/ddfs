<template>
	<div>
		<h1 class="title">New Slate</h1>

		<div class="row">
			<div class="col-md-3">

	            <div class="form-group">
	                <label for="description">Slate ID</label>
	                <input class="form-control" placeholder="New Slate ID" type="text" v-model="slateId">
	            </div>

	            <div class="form-group">
	                <label for="description">Lock Timestamp</label>
	                <input class="form-control" placeholder="Lock timestamp (seconds)" type="number" v-model="lockTimestamp">
	            </div>

							<div class="form-group">
	                <label for="description">Salaries URL</label>
	                <input class="form-control" placeholder="compressedSalariesUrl" type="text" v-model="compressedSalariesUrl">
	            </div>
							<div class="form-group">
	                <label for="description">Scores URL</label>
	                <input class="form-control" placeholder="compressedScoresUrl" type="text" v-model="compressedScoresUrl">
	            </div>

	            <button class="btn btn-primary" :disabled="disableSubmit" @click="performSubmit">Set New Slate Info</button>
                <strong v-show="submitting">Submitting...</strong>
                <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>

                <p v-show="successMessage" class="text-success">
                    <strong>Set new slate info</strong>
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
    			slateId: "pga-r2018-490", // variable binded with the input field: name
    			lockTimestamp: 1532771616, // variable binded with the input field: status
					compressedSalariesUrl: "https://s3.amazonaws.com/ethdfs/pga/compressedSalaries/2018/490.json",
					compressedScoresUrl: "https://s3.amazonaws.com/ethdfs/pga/compressedScores/2018/490.json",
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
									   !this.slateId
									|| !this.lockTimestamp
									|| !this.compressedSalariesUrl
									|| !this.compressedScoresUrl
									|| this.submitting
									|| !this.blockchainIsConnected()
								)
            }
        },
        methods: {
            /**
             * Perform the registration of the user when the submit button is pressed.
             */
        	performSubmit() {
                this.submitting = true
                this.errorSubmit = false
                this.successMessage = false
                // calling the function registerUser of the smart contract
								console.log('calling setNewSlateInfo Admin.vue L86')
                window.bc.contract().setNewSlateInfo(
                    this.slateId,
										this.compressedSalariesUrl,
										this.compressedScoresUrl,
                    this.lockTimestamp,
                    {
                        from: window.bc.web3().eth.coinbase,
                        gas: 800000
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
        	},
            /**
             * Check if the user visitng this page is registered: if the user is already
             * registered he will be redirected to the Profile page.
             */
            redirectIfUserRegistered() {
                // this.tmoConn = setInterval(() => {
                //     // checking first the connection
                //     if (this.blockchainIsConnected()) {
                //         // stopping the interval
                //         clearInterval(this.tmoConn)
                //         // calling the smart contract
                //         window.bc.contract().isRegistered.call((error, res) => {
                //             if (res) {
								//
                //                 // redirecting to the profile page
                //                 // this.$router.push("profile")
                //             }
                //         })
                //     }
                // }, 500)
            },
            /**
             * Once the user submitted his registration this funciton checks every 1000 ms
			 * if the registration is successfully. Once the user is registered he will be
			 * redirected to the profile page.
             *
             * NOTE: in order to check if the user has been registered successfully the
             * function has to check several time because the block can take several
             * minutes to be mined (depending on the configuration of the blockchain you
			 * are using).
             */
            redirectWhenBlockMined() {
                // this.tmoReg = setInterval(() => {
                //     if (this.blockchainIsConnected()) {
                //         window.bc.contract().isRegistered.call((error, res) => {
                //             if (error) {
                //                 console.error(error)
                //             }
                //             else if (res) {
                //                 // stopping the setInterval
                //                 clearInterval(this.tmoReg)
                //                 // this.$router.push("profile")
                //             }
                //         })
                //     }
                // }, 1000)
            }
        },
        created() {
            // it checks every 500ms if the user is registered until the connection is established
            this.redirectIfUserRegistered()
        }
    }
</script>
