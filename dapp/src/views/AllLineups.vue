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
                    <th style="width:22%">Hash</th>
                    <th style="width:47%">Lineup</th>
					<th style="width:13%">Salary</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lineup in allLineups">
                    <td>{{ lineup["address"] }}</td>
                    <td>{{ lineup["hash"] }}</td>
					<td>
						<pre>{{ joinPlayers(lineup["players"]) }}</pre>
					</td>
					<td>{{ sumSalary(lineup["players"]) }}</td>

                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    // importing common function
    import mixin from '../libs/mixinViews';
    import {getGolfers} from '../libs/getGolfers';
    /**
     * List view component: this component shows list of the registered users
     * and their statuses.
     */
    export default {
        mixins: [mixin],
        data() {
            return {
                allLineups: [],
                isLoading: true, // true when the user list is loading form the blockchain
                bcConnected: false, // blockchain is connected ()
                tmoConn: null, // contain the intervalID given by setInterval
                zeroInBytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
                golferIdToGolfer: this.getGolferIdToGolfer(),
            }
        },
        methods: {
            dropBlanks(playerIds) {
                var playerIdsNoBlanks = [];
                var index;
                for (index in playerIds) {
                    if (playerIds[index] != this.zeroInBytes32) {
                        playerIdsNoBlanks.push(playerIds[index]);
                    }
                }
                return playerIdsNoBlanks;
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
			sumSalary(golfers) {
				var totalSalary = 0;
				var index;
				for (index in golfers) {
					totalSalary += golfers[index].eth_salary;
				}
				return totalSalary;
			},
            formatPlayers(pgaIdsBytes32_) {
                var pgaIdsBytes32 = this.dropBlanks(pgaIdsBytes32_);
                var lineup = [];
                var index;
                for (index in pgaIdsBytes32) {
					var pgaIdString = window.bc.web3inst.toAscii(pgaIdsBytes32[index]);
					var pgaIdInt = parseInt(pgaIdString);
					if (pgaIdInt in this.golferIdToGolfer) {
						lineup.push(this.golferIdToGolfer[pgaIdInt])
					}
					else {
						console.warn('cannot find ' + pgaIdInt + ' in this.golferIdToGolfer');
					}
                }
				return lineup;
            },
			joinPlayers(playersArray) {
				var pgaNameIds = []
				var index;
				for (index in playersArray) {
					var player = playersArray[index];
					pgaNameIds.push(player["name"] + ' (' + player["pga_id"] + ')')
				}
				return pgaNameIds.join("\n")
			},
            getAllLineupsList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    // TODO: get contests in lobby
                    // getting all the users from the blockchain
                    this.getAllLineups(allLineup => {
                        this.isLoading = false
                        this.allLineups.push(allLineup)
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
                console.log('calling getEnteredAddressesForCurrentSlate allLineups L86')
                window.bc.contract().getEnteredAddressesForCurrentSlate.call(
                    (err, addresses) => {
                        if (err) {
                            console.log('error calling getEnteredAddressesForCurrentSlate: ', err)
                        }
                        else {
                            var index;
                            for (index in addresses) {
                                window.bc.contract().getCurrentSlateLineupForAddress.call(
                                    addresses[index],
                                    (getLineupError, lineup) => {
                                        if (getLineupError) {
                                            console.log('error calling getCurrentSlateLineupForAddress: ', getLineupError)
                                        }
                                        else {
                                            callback({
                                                address: addresses[index],
                                                hash: lineup[0],
                                                players: this.formatPlayers(lineup[1])
                                            })
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
    	word-wrap:break-word
	}

</style>
