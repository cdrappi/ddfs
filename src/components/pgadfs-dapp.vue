<template>
  <div>
 <hello-metamask/>
 <pga-dfs/>
</div>
</template>
<script>
import HelloMetamask from '@/components/hello-metamask'
import PgaDfs from '@/components/pga-dfs'
export default {
  name: 'pgadfs-dapp',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from pgadfs-dapp.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'hello-metamask': HelloMetamask,
    'pga-dfs': PgaDfs
  }
}
</script>
<style scoped>
</style>
