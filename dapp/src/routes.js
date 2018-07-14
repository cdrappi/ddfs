import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/views/Lobby'
import Lineup3 from '@/views/Lineup3'

Vue.use(Router)

export default new Router({
    routes: [
        // {
        //     path: '/',
        //     name: 'Lobby',
        //     component: Lobby
        // },
        {
            path: '/lobby',
            name: 'Lobby',
            component: Lobby
        },
        {
          path: '/lineup3',
          name: 'Lineup3',
          component: Lineup3
        },
        // {
        //   path: '/sweat',
        //   name: 'Sweat',
        //   component: Sweat,
        // }
    ],
    linkActiveClass: 'active'
})
