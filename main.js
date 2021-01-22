import Vue from 'vue'
import App from './App'
import api from "@/common/js/api.js"
import http from "@/common/js/request.js"
import sPullScroll from "@/components/s-pull-scroll/index.vue"
import filter from './filter/filter.js'
Vue.component('s-pull-scroll', sPullScroll)
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype._reqw=http;
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
