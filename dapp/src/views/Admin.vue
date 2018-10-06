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

		<br><br>
		<div class="row">
			<div class="col-md-3">
				<div class="form-group">
						<label for="description">Salary string</label>
						<input class="form-control" type="text" v-model="compressedSalariesString">
				</div>

				<button class="btn btn-primary" @click="submitCompressedSalaries">Submit Compressed Salaries</button>
					<strong v-show="submitting">Submitting...</strong>
					<strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>

					<p v-show="successMessage" class="text-success">
							<strong>Set salaries on chain</strong>
					</p>
			</div>
		</div>
		<br><br>
		<div class="row">
				<div class="col-md-3">
					<div class="form-group">
							<label for="description">Scores string</label>
							<input class="form-control" type="text" v-model="compressedScoresString">
					</div>

					<button class="btn btn-primary" @click="submitCompressedScores">Submit Compressed Scores</button>
						<strong v-show="submitting">Submitting...</strong>
						<strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>

						<p v-show="successMessage" class="text-success">
								<strong>Set scores on chain</strong>
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
				var date = new Date();
				var timestamp = date.getTime();
    		return {
    			slateId: "pga-r2018-490", // variable binded with the input field: name
    			lockTimestamp: timestamp + 172800, // variable binded with the input field: status
					compressedSalariesUrl: "https://s3.amazonaws.com/ethdfs/pga/compressedSalaries/2018/490.json",
					compressedScoresUrl: "https://s3.amazonaws.com/ethdfs/pga/compressedScores/2018/490.json",
          submitting: false, // true once the submit button is pressed
          successMessage: false, // true when the user has been registered successfully
          tmoConn: null, // contain the intervalID given by setInterval
          tmoReg: null, // contain the intervalID given by setInterval
          errorSubmit: false, // it shows the erro message
					compressedSalariesString: (
						  "29725:23 1810:22 25804:22 29221:21 34098:20 48081:20 45486:19 27644:19 25632:18 27141:18 26596:17 29926:17 25396:17 27214:17 "
						+ "33141:17 27649:16 31420:16 29461:16 19846:16 29478:16 49964:15 27958:15 36699:15 34256:15 19803:15 32366:15 46501:15 25818:15 "
						+ "46435:15 48084:15 39546:15 34076:15 26300:15 39324:14 47128:14 46550:14 28252:14 27095:14 45526:14 36799:14 26951:14 34409:14 "
						+ "24924:14 35879:14 23621:14 46601:14 49771:14 31202:14 32448:14 35532:14 35421:14 20472:14 45609:14 47993:14 23541:14 40058:14 24490:14 "
						+ "27963:14 29535:14 34431:14 37454:14 39953:14 39997:14 29268:14 22056:14 10809:14 34466:13 35506:13 12510:13 25493:13 30692:13 34099:13 "
						+ "40009:13 37278:13 33418:13 27895:13 6567:13 24140:13 39975:13 28500:13 24358:13 34174:13 32150:13 35541:13 37275:13 23325:13 32757:13 "
						+ "34264:13 20104:13 30944:13 31416:13 29223:13 39327:13 50526:13 35310:13 39328:13 26758:13 39954:13 29479:13 22046:13 28132:13 23353:13 "
						+ "28158:13 33419:13 29485:13 25892:13 25834:13 12782:13 27933:13 47958:13 54328:13 8385:13 27942:13 37338:13 35544:13 28455:13 24846:13 "
						+ "20098:13 24449:13 28307:12 35545:12 1320:12 32876:12 46402:12 47347:12 47287:12 24925:12 22892:12 10885:12 27120:12 46440:12 30750:12 "
						+ "1249:12 51833:12 37065:12 34262:12 11123:12 32254:12 34358:12 47125:12 22582:12 23638:12 25274:12 27556:15 28679:13 29222:13"
					),
					compressedScoresString: (
						  "25198:61 19803:53 27974:52 8793:51 45526:51 29268:50 35461:50 23320:49 19846:49 34563:49 33410:49 32102:48 31420:47 36799:47 23541:47 "
						+ "26851:47 45486:46 29420:46 21961:46 52330:46 32640:46 29908:46 27556:45 20229:45 34076:45 27958:45 39324:44 49771:44 24358:44 34256:44 "
						+ "40058:44 53165:43 27963:43 28679:43 22056:43 20472:43 35421:43 46501:43 30110:43 27214:43 26758:42 37189:42 39997:42 47347:42 26951:42 "
						+ "45609:42 33948:42 34409:41 33399:41 30978:41 37275:41 47287:41 31323:40 28500:40 27895:40 36699:40 28252:40 31416:40 35545:40 29479:38 "
						+ "25632:38 32448:38 35376:38 32254:37 40009:37 25396:37 50526:37 27095:37 35310:37 34174:37 24924:36 52375:36 32333:32 29461:28 22046:18 "
						+ "22371:18 28307:18 39546:18 32150:18 35879:18 37278:18 39327:18 37454:18 31560:18 30692:18 27936:18 25240:17 30944:17 35658:17 34358:17 "
						+ "12510:17 29222:17 34466:17 37455:17 35532:17 27141:17 23353:17 12782:17 35544:17 39975:16 28132:16 39954:16 27942:16 46402:16 47993:16 "
						+ "47128:15 29926:15 22892:15 34099:15 46601:15 23621:15 25834:14 26300:14 20572:14 29223:14 24846:14 25493:13 33418:13 34431:11 32876:6"
					)
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
				  submitCompressedSalaries() {
						console.log('calling setSalaries Admin.vue L112')
						window.bc.contract().setSalaries(
								this.compressedSalariesString,
								{
										from: window.bc.web3().eth.coinbase,
										gas: 8000000,
										gasPrice: 20000000000
								},
								(err, txHash) => {
										if (err) {
												console.error('error calling setSalaries', err)
												this.errorSubmit = true
										}
										else {
												this.successMessage = true
												console.log('successfully called setSalaries: -->', txHash, '<--')
										}
								}
						)
					},
					submitCompressedScores() {
						console.log('calling setScores Admin.vue L132')
						window.bc.contract().setScores(
								this.compressedScoresString,
								{
										from: window.bc.web3().eth.coinbase,
										gas: 8000000,
										gasPrice: 20000000000
								},
								(err, txHash) => {
										if (err) {
												console.error('error calling setScores', err)
												this.errorSubmit = true
										}
										else {
												this.successMessage = true
												console.log('successfully called setScores: -->', txHash, '<--')
										}
								}
						)
					},
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
