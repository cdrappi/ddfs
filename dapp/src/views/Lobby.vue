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
                    <th>Buyin (ETH)</th>
                    <th>Entrants</th>
                    <th>Owner Address</th>
                    <th>Prize Pool</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contest in contests">
                    <td>{{ contest["id"] }}</td>
                    <td><button @click="enterContest(contest.id, contest.entryFeeEth)">{{ contest["entryFeeEth"] }}</button></td>
                    <td><button @click="viewContest(contest.id)">{{ contest["entries"] }}</button></td>
                    <td>{{ contest["owner"] }}</td>
                    <td>{{ contest["prize_pool"] }}</td></t>
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
             * Get the list of all live contests users once the connection to the
             * blockchain is established.
             */
            enterContest(contestId, entryFeeEth) {
                let contestIdBytes32 = web3.fromAscii(contestId);
                console.log(contestIdBytes32);
                window.bc.contract().enterContest(
                    contestIdBytes32, {
                        from: window.bc.web3().eth.coinbase,
                        gas: 800000,
                        value: (entryFeeEth * 1e18 / 0.98)
                    },
                    (err, txHash) => {
                        if (err) {
                            console.error('error calling enterContest: ', err)
                        } else {
                            console.log('success calling enterContest')
                        }
                    }
                )
            },
            viewContest(contestId) {
                this.$router.push('/contest/'+contestId)
            },
            formatContest(contest) {
                return {
                    'id': web3.toAscii(contest[0]),
                    'entryFeeEth': contest[1] / 1e18,
                    'entries': Number(contest[2]),
                    'owner': contest[3],
                    'prize_pool': Number(contest[4]) / 1e18
                }
            },
            getContestList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    // TODO: get contests in lobby
                    // getting all the users from the blockchain
                    this.getAllLiveContests(contest => {
                        this.isLoading = false;
                        var formattedContest = this.formatContest(contest);
                        this.contests.push(formattedContest);
                        console.log(formattedContest);
                    })
                }
            },
            /**
             * It reloads the live contest list.
             */
            reloadLobby() {
                this.contests = []
                this.getContestList()
            },
            getAllLiveContests(callback) {
                // getting the total number of users stored in the blockchain
                // calling the method totalUsers from the smart contract
                // TODO: make contract calls work
                console.log('calling getLiveContestIds lobby L86')
                window.bc.contract().getLiveContestIds.call((err, contestIds) => {
                    if (err) {
                        console.log('error!!!')
                        console.log(err)
                    } else {
                        console.log(contestIds)
                        for (let contestId of contestIds) {
                            console.log(contestId, ': calling getContestById lobby L93')
                            window.bc.contract().getContestById.call(
                                contestId,
                                (getContestError, contestData) => {
                                    if (getContestError) {
                                        console.log('error calling getContestById ', getContestError)
                                    } else {
                                        callback(contestData)
                                    }
                                }
                            )
                        } // end if
                    }
                }) // end getLiveContestIds call
            }
        },
        created() {
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.getContestList()
            }, 1000)
        }
    }
</script>

<style>
    .btn-top {
        margin-top: 10px;
    }
</style>
