<template>
  <div id="app">
    <component :is="componentName"></component>

    <!-- 导出进度条 开始 -->
    <div id="fileProgress" style="display:none;">
      <div class="progress progress-striped"
           style="position:fixed; padding:5px;border-radius:3px; width:200px; margin:-21px 0 0 -21px;top:51%; left:44%;z-index: 999999999; ">
        <div class="progress-bar progress-bar-success" id="fileProgressRate">
          <div>1%</div>
        </div>
      </div>
      <div style="z-index: 99999;" class="popup_bj"></div>
    </div>
    <!-- 导入进度条 结束 -->
  </div>
</template>

<script>
// 平台
import home from './page/pt/home/home.vue'
import login from './page/pt/login/login.vue'
import forgetPassword from './page/pt/login/forgetPassword.vue'
import selectTenant from './page/pt/login/selectTenant.vue'

// 货主
import hzHome from './page/hz/home/home.vue'
import hzLogin from './page/hz/login/login.vue'
import hzForgetPassword from './page/hz/login/forgetPassword.vue'
import hzSelectTenant from './page/hz/login/selectTenant.vue'

// 易迁易大学
import eduHome from './page/edu/main/home/toMain.vue'
import eduLogin from './page/edu/login/login.vue'
import eduForgetPassword from './page/edu/login/forgetPassword.vue'
import eduAdminHome from './page/edu/admin/home/home.vue'
import eduStudentHome from './page/edu/student/home/home.vue'

// 微信公众号下单，h5页面
import wxOrder from './page/wx/order/addOrder.vue'

// 车辆监控
import vehicleMonitorSaaS from './page/pt/res/vehicleMonitorSaaS.vue'
// 预约大屏
import appointmentBoard from './page/pt/wms/board/appointmentBoard.vue'
// 仓库看板大屏
import warehousingCenterBoard from './page/pt/wms/board/warehousingCenterBoard.vue'
// 今日计划大屏
import todayPlanBoard from './page/pt/wms/board/todayPlanBoard.vue'
// 配送大屏
import deliveryBoard from './page/pt/wms/board/deliveryBoard.vue'
// 订单大屏
import orderBoard from './page/pt/dataReport/kanban/orderBoard.vue'
// OnlyOffice查看页
import fileViewer from './components/myFile/file-viewer.vue'

// 路由配置
import routerConfig from './router/config.js'

export default {
  name: 'app',
  data() {
    return {}
  },
  mounted() {
    this.initMessage(); // 初始化iframe+postmassage数据请求
    this.init();
    this.listenToken();
  },
  methods: {
    initMessage(){
      // 监听其他页面的消息
      window.addEventListener("message", (e) => {
        // 安全校验：只响应指定来源的消息（防止恶意网站调用）
        if (e.origin !== "https://salary.1000e56.com") return;
        
        // 如果父页面请求「获取localStorage数据」，则返回
        if (e.data.type === "TOKEN") {
          const token = localStorage.getItem(e.data.key); // 读取b的localStorage
          e.source.postMessage({ type: "DATA_RESULT", data: token }, e.origin); // 回传数据
        }
      });
    },
    // 是否微信浏览器打开
    isWechatPC() {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('micromessenger') && userAgent.includes('windowswechat');
    },
    init() {
      let pathName = this.$route.path;  //获取访问路径
      
      // 浏览器提醒
      if(this.isWechatPC() && pathName != '/wxOrder'){
        alert("请使用谷歌浏览器。")
        // return
      };

      let query = this.$route.query;  //获取访问路径参数

       // 获取当前页面的 pathname
       const pathname = window.location.pathname;
      // 去除路径名前面的 /
      const paramStr = pathname.slice(1);
      // 存储参数的对象
      const params = {};
      // 使用 & 分割字符串得到参数对
      const paramPairs = paramStr.split('&');
      // 遍历参数对
      paramPairs.forEach(pair => {
          const [key, value] = pair.split('=');
          params[key] = decodeURIComponent(value);
      });
      if(params.appointPage == 1){
        sessionStorage.setItem("appointPage",params.appointPage);
        sessionStorage.setItem("appointPageInfo",params.appointPageInfo);
        // location.href = location.origin;
      }


      this.$store.commit('resetData',{name:'visitPageInfo',data:{path:pathName,query}});
      let href = window.location.href;

      // vuex保存token用于验证
      let token = localStorage.getItem("token");
      if(this.common.isNotBlank(token)){
        this.$store.commit('resetData',{name:'token',data:token});
      }

      //生产http跳转https
      if (window.location.protocol == "http:" && window.location.host.indexOf("1000e56.com") > -1) {
        window.location.href = href.replace(/^http/, "https");
      }

      // pt跳到平台，hz跳到货主，阿涛说的
      //拦截防止平台进入货主页
      if (href == "https://pt.1000e56.com/hz" || href == "https://pt.1000e56.com/edu") {
        window.location.href = "https://pt.1000e56.com/"
      }
      //拦截防止平台进入货主页
      if (href == "https://hz.1000e56.com/pt" || href == "https://hz.1000e56.com/edu") {
        window.location.href = "https://hz.1000e56.com/"
      }
      //拦截防止其它页面进入货主页
      if (href == "https://edu.1000e56.com/pt" || href == "https://edu.1000e56.com/hz") {
        window.location.href = "https://edu.1000e56.com/"
      }

      // 遍历router配置
      Object.entries(routerConfig).forEach(([key, value]) => {
        if(href.includes(key)){
          localStorage.setItem("pageInfo",JSON.stringify(value));
          this.$store.commit('resetData',{name:'visitPageInfo',data:null});
        }
      });

      if (pathName == '/hz' || href == "https://hz.1000e56.com/") { //货主
        this.$store.state.componentName = 'hzLogin'
      } else if (pathName == '/ahresty') {
        this.$store.state.componentName = 'vehicleMonitorSaaS'
      } else if (pathName == '/appointmentBoard') {   //预约大屏
        this.$store.state.componentName = 'appointmentBoard'
      } else if (pathName == '/warehousingCenterBoard') {   //仓库看板大屏
        this.$store.state.componentName = 'warehousingCenterBoard'
      } else if (pathName == '/todayPlanBoard') {   // 今日计划大屏
        this.$store.state.componentName = 'todayPlanBoard'
      } else if (pathName == '/deliveryBoard') {   // 配送大屏
        this.$store.state.componentName = 'deliveryBoard'
      } else if (pathName == '/orderBoard') {   // 订单大屏
        this.$store.state.componentName = 'orderBoard'
      } else if (pathName == '/edu' || href == "https://edu.1000e56.com/") {  //易迁易大学
        this.$store.state.componentName = 'eduLogin'
      } else if(pathName == '/wxOrder'){  //公众号下单
        this.$store.state.componentName = 'wxOrder'
      } else if(pathName == '/fileViewer'){  //文件查看器
        this.$store.state.componentName = 'fileViewer'
      }else {
        let name = localStorage.getItem("defaultUrl");  //获取之前访问的缓存页面
        let rememberTime = localStorage.getItem("rememberTime");
        if (rememberTime) {
          var time1 = parseInt(rememberTime) + 7 * 24 * 60 * 60 * 1000;
          var time2 = new Date().getTime();
          if (this.common.isNotBlank(name) && time1 > time2) {
            localStorage.setItem("defaultUrl", name);
          }else{
            localStorage.setItem("defaultUrl", 'login');
          }
        }

        let host = window.location.host;
        if (pathName == "/login") { //访问登录页
          if (host.indexOf('hz') > -1) {  //货主登陆
            this.$store.state.componentName = 'hzLogin'
          } else if (host.indexOf('edu') > -1) {  //易迁易大学登陆
            this.$store.state.componentName = 'eduLogin'
          } else {  //平台登陆
            this.$store.state.componentName = 'login'
          }
        } else {
          let sessionTime = localStorage.getItem("sessionTime");
          var flag = false;
          if (sessionTime) {
            var time3 = parseInt(sessionTime) + 4 * 60 * 60 * 1000;
            var time4 = new Date().getTime();
            if (time3 > time4) {
              flag = true;
            }
          }
          if (this.common.isBlank(name)||!flag) {  //没获取到缓存页时访问登录页
            if (host.indexOf('hz') > -1) {  //货主登陆
              this.$store.state.componentName = 'hzLogin'
            } else if (host.indexOf('edu') > -1) {  //易迁易大学登陆
              this.$store.state.componentName = 'eduLogin'
            } else {  //平台登陆
              this.$store.state.componentName = 'login'
            }
          } else {  //访问缓存页面
            this.$store.state.componentName = name
          }
        }
      }


    },
    // 监听页面是否展示
    listenToken(){
      let _this = this;
      document.addEventListener('visibilitychange', function(){
          if(_this.common.isNotBlank(_this.$store.state.token) && _this.$store.state.token!=localStorage.getItem("token")){
            _this.$alert('登录状态发生改变，请刷新网页。', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  showClose:false,
                  callback(){
                    let time = new Date().getTime();
                    let href = "/?ver="+time;
                    window.location.href = href;
                  }
              })
          }
      });
    }
  },
  components: {
    home,
    login,
    forgetPassword,
    selectTenant,
    hzHome,
    hzLogin,
    hzForgetPassword,
    hzSelectTenant,
    eduHome,
    eduLogin,
    eduForgetPassword,
    eduAdminHome,
    eduStudentHome,
    vehicleMonitorSaaS,
    appointmentBoard,
    warehousingCenterBoard,
    todayPlanBoard,
    deliveryBoard,
    orderBoard,
    wxOrder,
    fileViewer,
  },
  computed: {
    componentName() {
      return this.$store.state.componentName
    },
  }
}
</script>

<style lang="scss" src="./static/css/global.scss"></style>
<style lang="scss">
@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}

.progress {
  height: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  background-color: #428bca;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.progress-striped .progress-bar {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-size: 40px 40px;
}

.progress.active .progress-bar {
  -webkit-animation: progress-bar-stripes 2s linear infinite;
  animation: progress-bar-stripes 2s linear infinite;
}

.progress-bar-success {
  background-color: #5cb85c;
}

.progress-striped .progress-bar-success {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
</style>
