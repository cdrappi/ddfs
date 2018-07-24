<template>
	<div>
		<button class="btn btn-primary float-right btn-top" @click="reloadLineups">Reload</button>
        <h1 class="title">Revealed Lineups</h1>

        <div class="clearfix"></div>

        <h2 v-show="!bcConnected">Not connect to the blockchain: please wait.</h2>

        <h2 v-show="(isLoading && bcConnected)">Loading...</h2>

        <table class="table table-striped" v-show="!isLoading">
            <thead class="thead-dark">
                <tr>
                    <th>Address</th>
                    <th>Lineup Hash</th>
                    <th>Player Count</th>
                    <th>Players</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lineup in revealedLineups">
                    <td>{{ lineup["address"] }}</td>
                    <td>{{ lineup["hash"] }}</td>
                    <td>{{ lineup["players"].length }}</td>
                    <td>
                        <pre>{{ joinPlayers(lineup["players"]) }}</pre>
                    </td>
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
                revealedLineups: [],
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
                    golferIdToGolfer[golfer.pga_id] = golfer;
                }
                return golferIdToGolfer;
            },
            formatPlayers(pgaIdsBytes32_) {
                var pgaIdsBytes32 = this.dropBlanks(pgaIdsBytes32_);
                var lineup = [];
                var index;
                console.log(this.golferIdToGolfer)
                for (index in pgaIdsBytes32) {
                    var pgaId = window.bc.web3inst.toAscii(pgaIdsBytes32[index])
                    lineup.push(pgaId)
                }
				return lineup;
                // if (lineup.length) {
                //     return lineup.join("\n");
                // }
                // else {
                //     return "Not yet revealed";
                // }
            },
			joinPlayers(playersArray) {
				return playersArray.join("\n")
			},
            getRevealedLineupsList() {
                if (this.blockchainIsConnected()) {
                    // it shows the loading message
                    this.isLoading = true
                    // stopping the interval
                    clearInterval(this.tmoConn)
                    // TODO: get contests in lobby
                    // getting all the users from the blockchain
                    this.getAllRevealedLineups(revealedLineup => {
                        this.isLoading = false
                        this.revealedLineups.push(revealedLineup)
                    })
                }
            },
            /**
             * It reloads the live contest list.
             */
            reloadLineups() {
                this.revealedLineups = []
                this.getRevealedLineupsList()
            },
            getAllRevealedLineups(callback) {
                console.log('calling getEnteredAddressesForCurrentSlate revealedLineups L86')
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
                this.getRevealedLineupsList()
            }, 1000)
        }
    }
</script>

<style>
	.btn-top {
		margin-top: 10px;
	}
</style>
