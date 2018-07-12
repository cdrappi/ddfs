<template>
	<div>
		<button class="btn btn-primary float-right btn-top" @click="reloadLobby">Reload</button>
        <h1 class="title">Contest Lobby</h1>

        <div class="clearfix"></div>

        <h2 v-show="!bcConnected">Not connect to the blockchain: please wait.</h2>

        <h2 v-show="(isLoading && bcConnected)">Loading...</h2>

        <table class="table table-striped" v-show="!isLoading">
            <thead class="thead-dark">
                <tr>
                    <th>Contest ID</th>
                    <th>Buyin</th>
                    <th>Entrants</th>
                    <th>Owner Address</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contest in contests">
                    <td>{{ contest[0] }}</td>
                    <td>{{ contest[1] }}</td>
                    <td>{{ contest[2] }}</td>
                    <td>{{ contest[3] }}</td>
                    <td>{{ toDate(contest[4]) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    // importing common function
    import mixin from '../libs/mixinViews';
    /**
     * List view component: this component shows list of the registered users
     * and their statuses.
     */
    export default {
        mixins: [mixin],
        data() {
            return {
                contests: [], // array that stores all the registered users
                isLoading: true, // true when the user list is loading form the blockchain
                bcConnected: false, // blockchain is connected ()
                tmoConn: null, // contain the intervalID given by setInterval
            }
        },
        methods: {
            /**
             * Get the list of the registered users once the connection to the
             * blockchain is established.
             */
            getContestList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    // TODO: get contests in lobby
                    // getting all the users from the blockchain
                    this.getAllContests(contest => {
                        this.isLoading = false
                        this.contests.push(contest)
                    })
                }
            },
            /**
             * It reloads the user list.
             */
            reloadLobby() {
                this.contests = []
                this.getContestList()
            },
			/**
			 * Get all users.
			 */
			getAllContests(callback) {
				// getting the total number of users stored in the blockchain
				// calling the method totalUsers from the smart contract
        // TODO: make dfs
				window.bc.contract().totalContests.call((err, total) => {
					var tot = 0
					if (total) tot = total.toNumber()
					if (tot > 0) {
						// getting the user one by one
						for (var i=1; i<tot; i++) {
							window.bc.contract().getUserById.call(i, (error, userProfile) => {
								callback(userProfile)
							})
						} // end for
					} // end if
				}) // end totalUsers call
			}
        },
        created() {
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.getUserList()
            }, 1000)
        }
    }
</script>

<style>
	.btn-top {
		margin-top: 10px;
	}
</style>
