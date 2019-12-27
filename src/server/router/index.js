import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  routes:[
    {
      path: '/',
      name: '管理系统',
      component: home,
      children: [
        { path: '/product', component: product, name: '列表管理' },
      ]
    }
  ]
});
export default router;
