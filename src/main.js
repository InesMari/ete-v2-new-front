import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
//路由
import Router from 'vue-router'
//自定义指令
import './utils/directive.js'
//过滤器
import './utils/filter.js'
//公用js
import common from './utils/common.js'
//vuex
import store from './store/index.js'
//全局引入datapicker组件
import dataPicker from './components/dataPicker/dataPicker.vue'
//rsa加密
import JSEncrypt from 'jsencrypt';
import VueClipboard from 'vue-clipboard2';

//引用饿了么组件

ElementUI.Select.computed.readonly = function () {  //解决ios无法唤醒键盘问题
  const isIE = !this.$isServer && !Number.isNaN(Number(document.documentMode));
  return !(this.filterable || this.multiple || !isIE) && !this.visible;
};
Vue.use(ElementUI)

Vue.prototype.$getRsaCode = function(str){ // 注册方法
  let pubkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGeHY3oYYWut4enCcvfMLpPkGe' +
      '1pJ0biBDd3w8vdhjf48VzvywmTN3UMIfr+iiq6aWhuhdn8dDe5b6AmeWkVenf3oH' +
      'AKUcXebhM1E5RMhIWHoVt81mFhUCQaYIeoouUOYktzVNmNynDaJPIpHd16glVMtc' +
      '4l2lBD2hIJN8P3mgdQIDAQAB';
  let encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubkey); // 设置 加密公钥
  let  data = encryptStr.encrypt(str.toString());  // 进行加密
  return data;
}

Vue.config.productionTip = false
//引入公用方法
Vue.prototype.common = common;

//引入路由插件
Vue.use(Router)
const router = new Router({
  mode:"history",//路径不展示#号
  routes: []
});
// 路由进入前的操作
router.beforeEach((to, from, next) => {
  next();
  // 生成表格title
  common.setTableTitle();
  //处理表格表头和固定列定位问题
  const timer = setInterval(()=>{
    let tableCommonComponents = document.querySelector(".tableCommonComponents");
    let scrollTableComponents = document.querySelector(".scrollTableComponents");
    resetTableTopLeft(tableCommonComponents);
    resetTableTopLeft(scrollTableComponents);
  },50)
  // 重新定位到表头顶部
  const resetTableTopLeft = function (components) {
    if(components){
      let fixtable =  components.querySelector("#js_my_fixtable");
      let fixtableR =  components.querySelector("#js_my_fixtable_right");
      let thead = components.querySelectorAll(".fixed-thead");
      if(fixtable) fixtable.style.left = '0px';
      for(let i=0;i<thead.length;i++){
        thead[i].style.marginTop = '0px'
      }
      if(fixtableR) fixtableR.style.left = '0px';
      if(fixtable && fixtable.style.left == '0px' && thead[0].style.marginTop == '0px'){
        clearInterval(timer);
      }
    }else{
      clearInterval(timer);
    }
  }
})
// 路由进入后的操作
router.afterEach((to, from) => {
  common.setSearchIsshowAll();
})
//重写push避免push方法打开相同页面报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
//日期时间范围选择
Vue.component("dataPicker",dataPicker);

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard);

window.vm = new Vue({
  router,
  store,
  render: h => h(App),
});
vm.$mount('#app');
