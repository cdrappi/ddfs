import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/views/Profile'
import Lobby from '@/views/Lobby'
import Register from '@/views/Register'
import LineupCreation from '@/components/LineupCreation'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Lobby',
            component: Lobby
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
          path: '/create',
          name: 'LineupCreation',
          component: LineupCreation
        }
    ],
    linkActiveClass: 'active'
})
