import Vue from 'vue'
import Router from 'vue-router'
import PgaDfs from '@/components/pga-dfs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pga-dfs',
      component: PgaDfs
    }
  ]
})
