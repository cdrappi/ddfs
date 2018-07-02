import Vue from 'vue'
import Router from 'vue-router'
import PgadfsDapp from '@/components/pgadfs-dapp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pgadfs-dapp',
      component: PgadfsDapp
    }
  ]
})
