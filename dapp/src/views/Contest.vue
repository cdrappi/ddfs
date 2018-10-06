<template>
    <div>
        <button class="btn btn-primary float-right btn-top" @click="reloadLineups">Reload</button>
        <h1 class="title">All Lineups</h1>
    
        <div class="clearfix"></div>
    
        <h2 v-show="!bcConnected">Not connect to the blockchain: please wait.</h2>
    
        <h2 v-show="(isLoading && bcConnected)">Loading...</h2>
    
        <table class="table table-striped" v-show="!isLoading">
            <thead class="thead-dark">
                <tr>
                    <th style="width:16%">Address</th>
                    <th style="width:22%">Points</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lineup in allLineups">
                    <td>{{ lineup["address"] }}</td>
                    <td>{{ lineup["points"] }}</td>
                </tr>
            </tbody>
        </table>
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
                slateId: 'pga-2018-r490',
                contestId: '',
                allLineups: [],
                isLoading: true, // true when the user list is loading form the blockchain
                bcConnected: false, // blockchain is connected ()
                tmoConn: null, // contain the intervalID given by setInterval
                golferIdToGolfer: this.getGolferIdToGolfer(),
            }
        },
        methods: {
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
                    this.getAllLineups((address, points) => {
                        this.isLoading = false
                        this.allLineups.push({
                            address: address,
                            points: points
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
                console.log('calling  allLineups L148')
    
                // var address;
                window.bc.contract().getContestEntries.call(
                    this.slateId,
                    this.contestId,
                    (err, addresses) => {
                        if (err) {
                            console.log('error calling getEnteredAddressesForCurrentSlate: ', err)
                        } else {
                            for (let address of addresses) {
                                window.bc.contract().getEntryScore.call(
                                    this.slateId,
                                    this.contestId,
                                    address,
                                    (getEntryScoreError, entryPoints) => {
                                        if (getEntryScoreError) {
                                            console.log('error calling getEntryScore: ', getEntryScore)
                                        } else {
                                            callback(address, entryPoints)
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
            this.contestId = this.$router.params.contestId
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
