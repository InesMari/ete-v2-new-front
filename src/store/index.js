import Vue from 'vue'
import Vuex from 'vuex'

//引入vuex状态管理插件
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        componentName:"",   //各端登录逻辑处理
        token:"",           //存储token，用于标签切换时对比token,判断是否在别的标签有做过登录操作
        routeId:'',         //当前页面ID（侧边栏定位时无法获取this.$route.meta.id，需使用vuex）
        keepAlivePage:[],   //存储keepalive页面
        visitPageInfo:{},   //存储访问链接信息
        cityRegExp:/(市|盟|自治州|地区|土家族苗族自治州|藏族羌族自治州|藏族自治州|彝族自治州|布依族苗族自治州|苗族侗族自治州|哈尼族彝族自治州|壮族苗族自治州|傣族自治州|白族自治州|傈僳族自治州|傣族景颇族自治州|回族自治州|蒙古族藏族自治州|蒙古自治州|柯尔克孜自治州|哈萨克自治州)$/
    },
    mutations:{
        resetData(state,{name,data}){
            state[name] = data;
        }
    }
});

export default store