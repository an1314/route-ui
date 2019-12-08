import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element, { Form } from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import VueAMap from 'vue-amap';
import { findChildrenParams } from '@/utils/route'
import moment from 'moment'

Vue.use(VueAMap);

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.$moment = moment
Vue.prototype.markerList = [{
  color: "#d500c8",
  img: require("@/assets/markers/d500c8.png") 
},
{
  color: "#d70000",
  img: require("@/assets/markers/d70000.png")        
},
{
  color: "#eb5777",
  img: require("@/assets/markers/eb5777.png")
},
{
  color: "#f49800",
  img: require("@/assets/markers/f49800.png")
},
{
  color: "#ff0084",
  img: require("@/assets/markers/ff0084.png")
},
{
  color: "#ff5640",
  img: require("@/assets/markers/ff5640.png")
},
{
  color: "#ffab64",
  img: require("@/assets/markers/ffab64.png")
},
{
  color: "#ffe50b",
  img: require("@/assets/markers/ffe50b.png")
},
{
  color: "#00baff",
  img: require("@/assets/markers/00baff.png")
},
{
  color: "#00ef00",
  img: require("@/assets/markers/00ef00.png")
},
{
  color: "#0f86fb",
  img: require("@/assets/markers/0f86fb.png")
},
{
  color: "#1c4ca0",
  img: require("@/assets/markers/1c4ca0.png")
},
{
  color: "#3aac11",
  img: require("@/assets/markers/3aac11.png")
},
{
  color: "#6b4cbb",
  img: require("@/assets/markers/6b4cbb.png")
},
{
  color: "#7ee7c5",
  img: require("@/assets/markers/7ee7c5.png")
},
{
  color: "#8ac248",
  img: require("@/assets/markers/8ac248.png")
},
{
  color: "#6000ff",
  img: require("@/assets/markers/6000ff.png")
},
{
  color: "#9575cd",
  img: require("@/assets/markers/9575cd.png")
},
{
  color: "#65005f",
  img: require("@/assets/markers/65005f.png")
},
{
  color: "#b0e264",
  img: require("@/assets/markers/b0e264.png")
},
{
  color: "#c4b6fa",
  img: require("@/assets/markers/c4b6fa.png")
},
{
  color: "#7ee7c5",
  img: require("@/assets/markers/7ee7c5.png")
},
{
  color: "#d8e764",
  img: require("@/assets/markers/d8e764.png")
}]

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.prototype.findChildrenParams = findChildrenParams;

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
