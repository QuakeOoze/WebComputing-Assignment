import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue';
import User from './User.vue';
import Admin from './Admin.vue';
import Auctions from './Auctions.vue';
import singleAuction from './singleAuction.vue';
import createAuction from './createAuction';

import VueRouter from 'vue-router';

import VueResource from 'vue-resource';
Vue.use(VueResource);

//Vue.http.options.emulateJSON = true;

Vue.use(VueRouter);

//sessionStorage.auth_token = null;

const routes = [
  {
    path: "/",
    component: Home
  },
  //ADMIN-----------------------
    {
      path: "/status",
      name: "status",
      component: Admin
    },
    {
      path: "/reset",
      name: "reset",
      component: Admin
    },
    {
      path: "/resample",
      name: "resample",
      component: Admin
    },
  //AUCTIONS--------------------
    {
      path: "/auctions",
      name: "auctions",
      component: Auctions
    },
    {
      path: "/auctions/:id",
      name: "auction",
      component: singleAuction
    },
    {
      path: "/auction/other",
      name: "auctionOther",
      component: createAuction
    },
    {
      path: "/auction/create",
      name: "createAuction",
      component: createAuction
    },
  //USERS-----------------------
    {
      path: "/user/:id",
      name: "user",
      component: User
    },

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
