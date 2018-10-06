<template>
    <div>
        <button class="btn btn-primary float-right btn-top" @click="reloadScores">Reload</button>
        <h1 class="title">All Scores</h1>
    
        <div class="clearfix"></div>
    
        <h2 v-show="!bcConnected">Not connect to the blockchain: please wait.</h2>
    
        <h2 v-show="(isLoading && bcConnected)">Loading...</h2>
    
        <table class="table table-striped" v-show="!isLoading">
            <thead class="thead-dark">
                <tr>
                    <th style="width:20%">PGA ID</th>
                    <th style="width:50%">Name</th>
                    <th style="width:15%">Salary</th>
                    <th style="width:15%">Points</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="playerScore in allScores">
                    <td>{{ playerScore["pga_id"] }}</td>
                    <td>{{ playerScore["name"] }}</td>
                    <td>{{ playerScore["salary"] }}</td>
                    <td>{{ playerScore["points"] }}</td>
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
                slateId: "pga-r2018-490",
                allScores: [],
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
            loadAllScoresList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    this.getAllScores((pgaId, name, salary, points) => {
                        this.isLoading = false
                        this.allScores.push({
                            pga_id: pgaId,
                            name: name,
                            salary: salary,
                            points: points,
                        })
                    })
                }
            },
            /**
             * It reloads the live contest list.
             */
            reloadScores() {
                this.allScores = []
                this.loadAllScoresList()
            },
            getAllScores(callback) {
                console.log('calling getEnteredAddressesForCurrentSlate allLineups L86')
    
                // var address;
                window.bc.contract().getGolferIdsOnSlate.call(
                    this.slateId,
                    (err, slateGolfers) => {
                        if (err) {
                            console.log('error calling getGolferIdsOnSlate: ', err)
                        } else {
                            for (let pgaId of slateGolfers) {
                                window.bc.contract().getPoints.call(
                                    pgaId,
                                    (getPointsError, points) => {
                                        if (getPointsError) {
                                            console.log('error calling getPoints: ', getPointsError)
                                        } else {
                                            callback(
                                                Number(pgaId),
                                                this.golferIdToGolfer[pgaId].name,
                                                this.golferIdToGolfer[pgaId].eth_salary,
                                                Number(points)
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    }
                )
            },
        },
        created() {
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.loadAllScoresList()
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
