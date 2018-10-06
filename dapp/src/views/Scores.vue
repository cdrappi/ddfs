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
                    <th style="width:18%">PGA ID</th>
                    <th style="width:22%">Name</th>
                    <th style="width:33%">Salary</th>
                    <th style="width:27%">Points</th>
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
                    this.allScores = this.getAllScores()
                }
            },
            /**
             * It reloads the live contest list.
             */
            reloadScores() {
                this.allScores = []
                this.loadAllScoresList()
            },
            getAllScores() {
                console.log('calling getAllScores L82')

                let scores = [];
                window.bc.contract().getGolferIdsOnSlate.call(
                    (err, golferIds) => {
                        if (err) {
                            console.log('error calling getGolferIdsOnSlate: ', err)
                        } else {
                            for (let golferId of golferIds) {
                                score = {
                                    'pga_id': golferId,
                                    'name': this.golferIdToGolfer[golferId].name
                                }
                                window.bc.contract().getSalary.call(
                                    golferId,
                                    (getSalaryError, salary) => {
                                        if (getSalaryError) {
                                            console.log('error calling getSalary: ', getLineupError)
                                        } else {
                                            score['salary'] = salary
                                        }
                                    }
                                )
                                window.bc.contract().getPoints.call(
                                    golferId,
                                    (getPointsError, points) => {
                                        if (getSalaryError) {
                                            console.log('error calling getPoints: ', getPointsError)
                                        } else {
                                            score['points'] = points
                                        }
                                    }
                                )
                                scores.push(score);
                            }
                        }
                    }
                )
                return scores;
            }
        },
        created() {
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.getAllScoresList()
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
