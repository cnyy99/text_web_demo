import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  routes:[
    {
      path: '/',
      name: 'demo',
      component: home,
    }
  ]
});
export default router;
