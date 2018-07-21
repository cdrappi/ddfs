import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/views/Lobby'
import Lineup from '@/views/Lineup'
import Admin from '@/views/Admin'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/lobby',
            name: 'Lobby',
            component: Lobby
        },
        {
          path: '/lineup',
          name: 'Lineup',
          component: Lineup
        },
        {
          path: '/admin',
          name: 'Admin',
          component: Admin,
        }
    ],
    linkActiveClass: 'active'
})
