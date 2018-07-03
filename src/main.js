import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {$,jQuery} from 'jquery';
import './plugins/vuetify'
import App from './App'
import router from './router'
import { store } from './store/'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.config.productionTip = false

function get_salaries () {
    return $.ajax({
        type : 'GET',
        url : 'https://s3.console.aws.amazon.com/s3/object/ethdfs/jsonSalaries/2018/490.json',
    });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data: {
      salaries: get_salaries()
  },
})
