import Vue from 'vue'
import App from './App'
// import Vuex from 'Vuex'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faGithub,faWikipediaW} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faGithub);
library.add(faWikipediaW);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/index.css'
// import VXETablePluginElement from 'vxe-table-plugin-element'
// import 'vxe-table-plugin-element/dist/style.css'
import axios from 'axios'
import VePie from 'v-charts/lib/pie.common'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.component(VePie.name, VePie);
const VueCookie = require('vue-cookies');
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(VXETable);
Vue.config.debug = true;
Vue.config.productionTip = false;

Vue.prototype.$axios = axios;
// Vue.use(VXETable);
// VXETable.use(VXETablePluginElement);
Vue.use(ElementUI);
Vue.use(router);
// Vue.use(Vuex);
new Vue({
    el: '#app',
    router: router,
    store: store,
    template: '<App/>',
    components: {App}
});
