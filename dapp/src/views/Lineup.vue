<template>
    <div>
        <h1>{{this.salarySum()}}/100 salary, {{this.selectedResources.length}}/8 max players</h1>
    
        <div class="flex-container">
            <div v-for="(resource, index) in selectedResources" v-bind:style="{ width: resource.eth_salary + '%' }">
                <span>{{ resource.name }} ({{resource.pga_id}})</span>
                <button class="wrapper" @click="removeDependency(index)">
                                    <span class="close"></span>
                                </button>
            </div>
        </div>
        <br>
        <div class="column">
            <div class="row">
                <multiselect :options="options" :value="optionsProxy" @input="updateSelected" :multiple="true" :searchable="true" :close-on-select="false" :clear-on-select="true" :hide-selected="true" placeholder="SEARCH" :customLabel="formatResource">
                </multiselect>
            </div>
            <div class="row">
                <div>
                    <strong>Hash</strong>: keccak256("{{this.getPlayerIdsForLineupHash()}}|{{this.revealKey}}") = {{ this.getLineupHash() }}
                </div>
                <br>
                <div class="form-group" style="float:left">
                    <label for="description">Reveal key (secret)</label>
                    <input class="form-control" placeholder="change reveal key" type="text" v-model="revealKey">
                </div>
                <button class="btn btn-primary" @click="saveRevealKeyToCookie">Save reveal key to browser</button>
                <strong v-show="submitting">Saving ...</strong>
                <strong v-show="errorSubmit" class="text-danger">Failed to save reveal key!</strong>
                <br>
                <button class="btn btn-primary" :disabled="disableSubmit" @click="saveLineupHashOnChain">Submit hash</button>
                <strong v-show="submitting">Submitting...</strong>
                <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
                <br>
                <button class="btn btn-secondary" :disabled="disableSubmit" @click="saveToCookie">Save lineup locally</button>
                <strong v-show="submitting">Saving ...</strong>
                <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
                <br>
                <button class="btn btn-primary" :disabled="disableSubmit" @click="revealLineupOnChain">Reveal lineup</button>
                <strong v-show="submitting">Revealing ...</strong>
                <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
                <br>
            </div>
        </div>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import mixin from '../libs/mixinViews'
    import {
        getGolfers,
        getSelectedGolfersFromCookie,
        getPgaCookieName,
        getRevealKeyFromCookie
    } from '../libs/getGolfers'
    import Web3 from 'web3';
    var web3 = new Web3();
    export default {
        mixins: [mixin],
        components: {
            Multiselect
        },
        data() {
            return {
                options: getGolfers(),
                selectedResources: getSelectedGolfersFromCookie(
                    window.bc.web3().eth.coinbase
                ),
                optionsProxy: [],
                submitting: false,
                errorSubmit: false,
                successMessage: false,
                revealKey: getRevealKeyFromCookie(window.bc.web3().eth.coinbase)
            }
        },
        computed: {
            /**
             * It disables the submit button when the the name or userStatus are not filled
             * or the submit button is pressed or the connection with the blockchin is
             * not established.
             */
            disableSubmit() {
                return (
                    this.salarySum() > 100 ||
                    this.hasDuplicatePlayers() ||
                    this.selectedResources.length < 3 ||
                    this.selectedResources.length > 8 ||
                    this.submitting ||
                    !this.blockchainIsConnected()
                )
            },
    
        },
        methods: {
            updateSelected(value) {
                value.forEach((resource) => {
                    // Adds selected resources to array
                    this.selectedResources.push(resource)
                })
                this.optionsProxy = []
            },
            salarySum() {
                var totalSalary = 0;
                var index;
                for (index in this.selectedResources) {
                    totalSalary += this.selectedResources[index].eth_salary
                }
                return totalSalary
            },
            getPlayerIdsForLineupHash() {
                var playerIdsListToHash = [];
                for (let player of this.selectedResources) {
                    playerIdsListToHash.push(player.pga_id);
                }
                playerIdsListToHash.sort();
                return playerIdsListToHash.join(':')
            },
            hasDuplicatePlayers() {
                var seenGolferIds = {};
                var index;
                for (index in this.selectedResources) {
                    var golferId = this.selectedResources[index].pga_id;
                    if (seenGolferIds[golferId]) {
                        return true;
                    } else {
                        seenGolferIds[golferId] = true;
                    }
                }
                return false;
            },
            getLineupHash() {
                var playerIdsForLineupHash = this.getPlayerIdsForLineupHash();
                return web3.sha3(playerIdsForLineupHash + "|" + this.revealKey)
            },
            removeDependency(index) {
                this.selectedResources.splice(index, 1)
            },
            formatResource(resource) {
                return (
                    resource.eth_salary +
                    '   -   ' +
                    resource.pga_id +
                    ': ' + resource.name
                )
            },
            saveToCookie() {
                // save map of lineup hash to player ids in cookie
                // so it can be easily revealed later
                localStorage.setItem(
                    getPgaCookieName(window.bc.web3().eth.coinbase),
                    this.getPlayerIdsForLineupHash()
                );
            },
            saveRevealKeyToCookie() {
                localStorage.setItem(
                    getPgaCookieName(window.bc.web3().eth.coinbase) + 'key',
                    this.revealKey
                );
            },
            saveLineupHashOnChain() {
                this.submitting = true
                this.errorSubmit = false
                this.successMessage = false
                // calling the function registerUser of the smart contract
                console.log('calling saveLineupHash L98')
    
                this.saveToCookie()
                this.submitting = false
                window.bc.contract().setLineupHash(
                    this.getLineupHash(), {
                        from: window.bc.web3().eth.coinbase,
                        gas: 200000
                    },
                    (err, txHash) => {
                        if (err) {
                            console.error('error calling setLineupHash: ', err)
                            this.errorSubmit = true
                        } else {
                            console.log('success calling setLineupHash')
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
            revealLineupOnChain() {
                this.submitting = true
                this.errorSubmit = false
                this.successMessage = false
                console.log('calling revealLineupOnChain L202')
    
                window.bc.contract().getLineupHash(
                    window.bc.web3().eth.coinbase,
                    (err, lineupHash) => {
                        if (err) {
                            console.error('error calling getLineupHash: ', err)
                        } else {
                            console.log('success calling getLineupHash: ', lineupHash)
                            if (lineupHash == this.getLineupHash()) {
                                window.bc.contract().revealLineup(
                                    this.getPlayerIdsForLineupHash(),
                                    this.revealKey, {
                                        from: window.bc.web3().eth.coinbase,
                                        gas: 1000000
                                    },
                                    (err, res) => {
                                        if (err) {
                                            console.error('error calling revealLineupOnChain: ', err)
                                            this.errorSubmit = true
                                        } else {
                                            console.log('success calling revealLineupOnChain: ', res)
                                            this.successMessage = true
                                        }
                                    }
                                )
                            } else {
                                console.log(
                                    'attempting to reveal lineup with incorrect hash: ',
                                    lineupHash, ' is not equal to ', this.getLineupHash()
                                )
                            }
    
                        }
                    }
                )
            }
        }
    }
</script>



<style scoped>
    * {
        font-family: monospace;
    }
    
    .flex-container {
        display: flex;
        flex-wrap: wrap;
        background-color: DodgerBlue;
        width: 100%;
        height: 100px;
    }
    
    .flex-container>div {
        background-color: #ffffff;
        margin: 0px;
        height: 96px;
        border: DodgerBlue;
        border-style: ridge;
        font-size: 14px;
        position: relative;
        text-align: justify;
        vertical-align: text-bottom;
        display: table-cell;
    }
    
    .flex-container>div>span {
        position: absolute;
        vertical-align: middle;
        bottom: 25%;
        left: 10%;
        width: 50%;
        text-align: right;
        word-wrap: break-word;
    }
    
    .wrapper {
        width: 20%;
        height: 10%;
        top: 0;
        right: 0;
        border: none;
        position: absolute;
    }
    
    .close:before {
        content: '❌';
    }
    
    .close {
        color: red;
        width: 100%;
        height: 100%;
        position: relative;
    }
    
    .column {
        position: relative;
        float: left;
        width: 40%;
    }
    /* Clear floats after the columns */
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
</style>
