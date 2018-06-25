<template>
  <hello-metamask/>
</template>

<script>
import HelloMetamask from '@/components/hello-metamask'
export default {
  name: 'pga-dfs',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from pga-dfs.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
