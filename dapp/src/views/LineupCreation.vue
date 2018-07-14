<template>
<div id="app">
  <multiselect :options="options" :value="optionsProxy" @input="updateSelected" @search-change="searchQuery" :multiple="true" :searchable="true" :close-on-select="true" placeholder="Search" :custom-label="customLabel" :loading="showLoadingSpinner"></multiselect>

  <ul class="resources-list">
    <template v-for="(resource, index) in selectedResources">
      <li class="resource-item" :data-index="index">
        <div class="resource-info">
          <div class="resource-title" :id="index">
            <span>{{ resource.name }} ({{resource.pga_id}}) ... Ξ{{resource.eth_salary}} </span>
          </div>
        </div>
        <div class="delete-controls" v-on:click.prevent="removeDependency(index)">
          <i class="fa fa-times fa-fw"></i>
        </div>
      </li>
    </template>
    <button class="btn btn-primary" :disabled="disableSubmit" @click="performSubmit">Save to blockchain</button>
      <strong v-show="submitting">Submitting...</strong>
      <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
  </ul>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import getGolfers from '../libs/getGolfers'
import mixin from '../libs/mixinViews'
export default {
  mixins: [mixin],
  components: {
  	Multiselect
	},
	data() {
    return {
      	options: [],
        optionsProxy: [],
        selectedResources: [],
        showLoadingSpinner: false,
        submitting: false,
        errorSubmit: false,
        successMessage: false
	   }
  },
  computed: {
    disableSubmit() {
        return (
             this.salarySum(this.selectedResources) > 100
          || !this.uniqueGolfers(this.selectedResources)
          || this.selectedResources.length > 8
          || this.selectedResources.length < 3
          || this.submitting
          || !this.blockchainIsConnected()
        )
    }
  },
  methods: {
    salarySum (golfers) {
      var sum = 0;
      for (var ii = 1; ii < golfers.length; ii++) {
        sum += golfers[ii].eth_salary;
      }
      return sum;
    },
    uniqueGolfers (golfers) {
      var seenGolferIds = {};
      for (var ii = 1; ii < golfers.length; ii++) {
        var pgaId = golfers[ii].pga_id
        if (pgaId in seenGolferIds) {
          return false;
        }
        seenGolferIds[pgaId] = null;
      }
      return true;
    },
     performSubmit() {
       this.submitting = true
       this.errorSubmit = false
       this.successMessage = false
       // calling the function registerUser of the smart contract
       // window.bc.contract().registerUser(
       //     this.userName,
       //     this.userStatus,
       //     {
       //         from: window.bc.web3().eth.coinbase,
       //         gas: 800000
       //     },
       //     (err, txHash) => {
       //         if (err) {
       //             console.error(err)
       //             this.errorSubmit = true
       //         }
       //         else {
       //             this.successMessage = true
       //             // it emits a global event in order to update the top menu bar
       //             Event.$emit('userregistered', txHash);
       //             // the transaction was submitted and the user will be redirected to the
       //             // profile page once the block will be mined
       //             this.redirectWhenBlockMined()
       //         }
       //     }
       // )
    },
  	customLabel (option) {
      return `${option.name} (${option.pga_id}) Ξ${option.eth_salary}`
    },
    updateSelected(value) {
      value.forEach((resource) => {
      	// Adds selected resources to array
        this.selectedResources.push(resource)
      })
      // Clears selected array
      // This prevents the tags from being displayed
      this.optionsProxy = []
    },
    cdnRequest(value) {
      console.log('cdn request')
      this.options = getGolfers();
      // TODO: get data from endpoint
    	// this.$http.get('https://s3.amazonaws.com/ethdfs/jsonSalaries/2018/490.json').then((response) => {
      //   // get body data
      //   this.options = []
      //   response.body.results.forEach((object) => {
      //     this.options.push(object)
      //   });
			// 	this.showLoadingSpinner = false
      // }, (response) => {
      //   // error callback
      // })
    },
    searchQuery(value) {
    	this.showLoadingSpinner = true
    	// GET
      this.cdnRequest(value)
    },
    removeDependency(index) {
      this.selectedResources.splice(index, 1)
    }
  },
  created() {
  	const value = ''
  	this.cdnRequest(value)
  }
}
</script>


<style scoped>
* {
  font-family: 'Lato', 'Avenir', sans-serif;
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
