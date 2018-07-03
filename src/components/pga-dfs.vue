<template>
  <div class="pga-dfs container">
    <h2>Set Salary URL</h2>
    <div>
        <input v-model="salaryUrl" placeholder="INPUT URL HERE">
    </div>
    <div>
        <button v-on:click="setSalaries">SET SALARIES</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pga-dfs',
  data () {
    return {
      amount: null,
      pending: false,
      winEvent: null,
      salaryUrl: '',
      scoresUrl: ''
    }
  },
  methods: {
    setSalaries(event) {
        console.log('Setting scores to ', this.salaryUrl)
        this.$store.state.contractInstance().setSalariesUrlAndGetSalariesOnChain(
            event.target.innerHTML,
            {
                gas: 300000,
                from: this.$store.state.web3.coinbase,
                // value:
                compressedSalariesUrl_: this.salaryUrl
            }, (err, result) => {
                if (err) {
                  console.log('error in salaries url: ', err)
                } else {
                    console.log('salaries url result: ', result)
                }
            }
        )
    }
  },
  mounted () {
    console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractInstance')
  }
}
</script>

<style scoped>
.pga-dfs {
     margin-top: 50px;
     text-align:center;
}
#loader {
  width:150px;
}
ul {
    margin: 25px;
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap:25px;
    grid-row-gap:25px;
}
li{
    padding: 20px;
    margin-right: 5px;
    border-radius: 50%;
    cursor: pointer;
    background-color:#fff;
    border: -2px solid #bf0d9b;
    color: #bf0d9b;
    box-shadow:3px 5px #bf0d9b;
}
li:hover{
    background-color:#bf0d9b;
    color:white;
    box-shadow:0px 0px #bf0d9b;
}
li:active{
    opacity: 0.7;
}
*{
   color: #444444;
}
#has-won {
  color: green;
}
#has-lost {
  color:red;
}
</style>
