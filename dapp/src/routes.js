import Vue from 'vue'
import Router from 'vue-router'
import AllLineups from '@/views/AllLineups'
import Lineup from '@/views/Lineup'
import Lobby from '@/views/Lobby'
import Admin from '@/views/Admin'
import NewContest from '@/views/NewContest'
import Scores from '@/views/Scores'
import Contest from '@/views/Contest'
import Withdraw from '@/views/Withdraw'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/lineups',
            name: 'AllLineups',
            component: AllLineups
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
          path: '/admin',
          name: 'Admin',
          component: Admin,
        },
        {
          path: '/new-contest',
          name: 'NewContest',
          component: NewContest
        },
        {
          path: '/scores',
          name: 'Scores',
          component: Scores
        },
        {
          path: '/contest/:contestId',
          name: 'Contest',
          component: Contest
        },
        {
            path: '/withdraw',
            name: 'Withdraw',
            component: Withdraw
        }
    ],
    linkActiveClass: 'active'
})
