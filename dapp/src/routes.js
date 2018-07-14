import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/views/Lobby'
import Lineup from '@/views/Lineup'
import LineupCreation from '@/views/LineupCreation'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Lobby',
            component: Lobby
        },
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
          path: '/lineup2',
          name: 'Lineup2',
          component: LineupCreation
        }
    ],
    linkActiveClass: 'active'
})
