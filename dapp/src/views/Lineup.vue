<template>
  <div>
      <div>
          TOTAL SALARY: {{ this.salarySum() }}  (max is 100)
      </div>
      <ul class="resources-list">
          <template v-for="(resource, index) in selectedResources">
              <li class="resource-item" :data-index="index">
                  <div class="resource-info">
                      <div class="resource-title" :id="index">
                          <span>{{ resource.name }}</span>
                          <span class="version">{{resource.eth_salary}}</span>
                      </div>
                      <div class="resource-description">
                          <span>{{ resource.pga_id }}</span>
                      </div>
                  </div>
                  <div class="delete-controls" v-on:click.prevent="removeDependency(index)">
                      remove
                      <i class="fa fa-times fa-fw"></i>
                  </div>
              </li>
          </template>
    </ul>

    <br>
    <div>
      keccak256("{{this.getPlayerIdsForLineupHash()}}|{{this.revealKey}}") ==> {{ this.getLineupHash() }}
    </div>
    <br>
    <br>
    <div class="form-group">
        <label for="description">Scores URL</label>
        <input class="form-control" placeholder="change reveal key" type="text" v-model="revealKey">
    </div>
    <button class="btn btn-primary" @click="saveRevealKeyToCookie">Save reveal key to browser</button>
    <strong v-show="submitting">Saving ...</strong>
    <strong v-show="errorSubmit" class="text-danger">Failed to save reveal key!</strong>
    <br>
    <br>
    <button class="btn btn-primary" :disabled="disableSubmit" @click="saveLineupHashOnChain">Save lineup hash to blockchain</button>
    <strong v-show="submitting">Submitting...</strong>
    <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
    <br>
    <br>
    <button class="btn btn-secondary" :disabled="disableSubmit" @click="saveToCookie">Save lineup locally</button>
    <strong v-show="submitting">Saving ...</strong>
    <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
    <br>
    <br>
    <button class="btn btn-primary" :disabled="disableSubmit" @click="revealLineupOnChain">Reveal lineup to chain</button>
    <strong v-show="submitting">Revealing ...</strong>
    <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
    <br>
    <br>
    <br>

    <multiselect
      :options="options"
      :value="optionsProxy"
      @input="updateSelected"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="true"
      :hide-selected="true"
      placeholder="SEARCH"
      :customLabel="formatResource"
    >
    </multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import mixin from '../libs/mixinViews'
  import {getGolfers, getSelectedGolfersFromCookie, getPgaCookieName, getRevealKeyFromCookie} from '../libs/getGolfers'
  import Web3 from 'web3';
  var web3 = new Web3();
  export default {
    mixins: [mixin],
    components: { Multiselect },
    data () {
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
                this.salarySum() > 100
                || this.hasDuplicatePlayers()
                || this.selectedResources.length < 3
                || this.selectedResources.length > 8
                || this.submitting
                || !this.blockchainIsConnected()
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
            var playerIdsToHash = '';
            var index;
            for (index in this.selectedResources) {
                playerIdsToHash += String(this.selectedResources[index].pga_id);
                if (!(index == this.selectedResources.length - 1)) {
                    playerIdsToHash += ':';
                }
            }
            return playerIdsToHash
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
            resource.eth_salary
            + '   -   '
            + resource.pga_id
             + ': ' + resource.name
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
                this.getLineupHash(),
                {
                    from: window.bc.web3().eth.coinbase,
                    gas: 800000
                },
                (err, txHash) => {
                    if (err) {
                        console.error('error calling setLineupHash: ', err)
                        this.errorSubmit = true
                    }
                    else {
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
                }
                else {
                  console.log('success calling getLineupHash: ', lineupHash)
                  if (lineupHash == this.getLineupHash()) {
                    window.bc.contract().revealLineup(
                        this.getPlayerIdsForLineupHash(),
                        this.revealKey,
                        {
                            from: window.bc.web3().eth.coinbase,
                            gas: 800000
                        },
                        (err, res) => {
                            if (err) {
                                console.error('error calling revealLineupOnChain: ', err)
                                this.errorSubmit = true
                            }
                            else {
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

.resources-list {
  margin-top: 15px;
  padding: 0;
  list-style: none;
}

.resources-list li {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 10px 40px 10px 0;
  border-bottom: 1px solid rgba(51, 51, 51, 0.1);
  position: relative;
}

.resources-list li:last-child {
  border-bottom: none;
}

.resources-list li .resource-title {
  font-size: 1em;
  color: #333;
}

.resources-list li .version {
  opacity: 0.7;
  margin-left: 5px;
  font-size: 75%;
}

.resources-list li .resource-description,
.resources-list li .resource-url {
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
}

.resources-list li .resource-url {
  margin-top: 0;
}

.resources-list li .resource-description:empty {
  display: none;
}

.resources-list li .delete-controls {
  position: absolute;
  right: 0;
  width: 40px;
  text-align: center;
  color: #999;
  cursor: pointer;
}

.resources-list li .delete-controls:hover,
.resources-list li .delete-controls:focus {
  color: red;
}
</style>
