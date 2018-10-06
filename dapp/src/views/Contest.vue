<template>
    <div>
        <button class="btn btn-primary center" @click="scoreContest">Score Contest</button>
        <button class="btn btn-primary float-right btn-top" @click="reloadLineups">Reload</button>
        <h1 class="title">{{this.contestId}} Lineups</h1>
    
        <div class="clearfix"></div>
    
        <h2 v-show="!bcConnected">Not connect to the blockchain: please wait.</h2>
    
        <h2 v-show="(isLoading && bcConnected)">Loading...</h2>
    
        <table class="table table-striped" v-show="!isLoading">
            <thead class="thead-dark">
                <tr>
                    <th style="width:16%">Address</th>
                    <th style="width:22%">Points</th>
                    <th style="width:20%">Recoup (ETH)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lineup in allLineups">
                    <td>{{ lineup["address"] }}</td>
                    <td>{{ lineup["points"] }}</td>
                    <td>{{ lineup["recoup"] }}</td>
                </tr>
            </tbody>
        </table>
        <br>
    </div>
</template>

<script>
    // importing common function
    import mixin from '../libs/mixinViews';
    import {
        getGolfers
    } from '../libs/getGolfers';
    /**
     * List view component: this component shows list of the registered users
     * and their statuses.
     */
    export default {
        mixins: [mixin],
        data() {
            return {
                slateId: 'pga-r2018-490',
                contestId: '',
                allLineups: [],
                isLoading: true, // true when the user list is loading form the blockchain
                bcConnected: false, // blockchain is connected ()
                tmoConn: null, // contain the intervalID given by setInterval
                golferIdToGolfer: this.getGolferIdToGolfer(),
            }
        },
        methods: {
            scoreContest() {
                window.bc.contract().setSingleContestPayouts(
                    this.bytesContest(), 
                    {
						from: window.bc.web3().eth.coinbase,
						gas: 8000000,
						gasPrice: 20000000000
					},
					(err, txHash) => {
						if (err) {
							console.error('error calling setSingleContestPayouts', err)
						} else {
							console.log('successfully called setSingleContestPayouts: -->', txHash, '<--')
						}
					}
				)
            },
            bytesSlate() {
                return web3.fromAscii(this.slateId)
            },
            bytesContest(){
                return web3.fromAscii(this.contestId)
            },
            getGolferIdToGolfer() {
                var golferIdToGolfer = {};
                var golfers = getGolfers();
                var index;
                for (index in golfers) {
                    var golfer = golfers[index];
                    golferIdToGolfer[parseInt(golfer.pga_id)] = golfer;
                }
                return golferIdToGolfer;
            },
            getAllLineupsList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    // TODO: get contests in lobby
                    // getting all the users from the blockchain
                    this.getAllLineups((address, points, recoup) => {
                        this.isLoading = false
                        this.allLineups.push({
                            address: address,
                            points: Number(points),
                            recoup: Number(recoup) / 1e18
                        })
                    })
                }
            },
            /**
             * It reloads the live contest list.
             */
            reloadLineups() {
                this.allLineups = []
                this.getAllLineupsList()
            },
            getAllLineups(callback) {
                console.log('calling getContestEntries L88', this.slateId, this.contestId)
    
                // var address;
                window.bc.contract().getSlateId.call((err, slateId) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(slateId);
                    }
                })

                window.bc.contract().getContestEntries.call(
                    this.bytesSlate(),
                    this.bytesContest(),
                    (err, addresses) => {
                        if (err) {
                            console.log('error calling getContestEntries: ', err)
                        } else {
                            console.log('addresses', addresses)
                            for (let address of addresses) {
                                window.bc.contract().getEntryScore.call(
                                    this.bytesSlate(),
                                    address,
                                    (getEntryScoreError, entryPoints) => {
                                        if (getEntryScoreError) {
                                            console.log('error calling getEntryScore: ', getEntryScoreError)
                                        } else {
                                            window.bc.contract().getContestRecoup.call(
                                                this.bytesSlate(),
                                                this.bytesContest(),
                                                address,
                                                (getContestRecoupError, recoup) => {
                                                    if (getContestRecoupError) {
                                                        console.log('getContestRecoupError:', getContestRecoupError)
                                                    } else {
                                                        callback(address, entryPoints, recoup)
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    }
                )
            }
        },
        created() {
            this.contestId = this.$route.params.contestId
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.getAllLineupsList()
            }, 1000)
        }
    }
</script>

<style>
    .btn-top {
        margin-top: 10px;
    }
    
    table {
        table-layout: fixed;
    }
    
    td {
        word-wrap: break-word
    }
</style>
