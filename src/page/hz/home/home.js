import myTab from '@/components/myTab/myTab.vue'
import navMenu from './navMenu.vue'

export default {
    name: 'home',
    data() {
        return {
            userName:this.common.userInfo().userName,
            billId:this.common.userInfo().billId,
            passwordFlag:this.common.userInfo().passwordFlag,
            isshowInfoList:false, //右上 - 是否展示个人信息
            password:'',
            confirmPassword:'',
            smsVaildCode:'',
            showDialog:false,
            showModifyDialog:false,
            msg : '获取验证码',
            stamp : true,
            miao : 60,
            isshowNav:true,
            todo: {totalSum: 0, orderMessageSum: 0},
        }
    },
    mounted() {
        this.common.initTheme();
        this.showDialog=this.passwordFlag==1;
        this.pageInfo = JSON.parse(localStorage.getItem("pageInfo"));
        this.openMain();
        this.checkUrl();
        this.$nextTick(() => this.loadTodoData().then(() => {}));
        this.initMap();
    },
    components: {
        myTab,
        navMenu,
    },
    methods: {
        // 打开首页
        openMain(){
            this.openTab({
                urlName: "首页",
                urlId: "20000",
                urlPath: "/hz/home/toMain.vue",
                urlPathName: "/toMain"
            })
        },
        //打开一个新页面
        openTab(item) {
            this.$refs.myTab.openTab(item);
        },
        /**
         * 关闭页面
         * @param {页面id} id 
         * @param {父页面id} parentId 
         * @param {是否执行父页面方法} isDoParentMethod 
         * @param {执行父页面的方法名，不传默认doQuery} parentMethodName 
         */
        closeTab(id,parentId,isDoParentMethod,parentMethodName){
            this.$refs.myTab.close(id,parentId,isDoParentMethod,parentMethodName);
        },
        //打开一个新页面
        closeAll() {
            this.$refs.myTab.closeAll();
        },
        //关闭当前页面转到父级页面
        closeToOther(id){
            this.closeTab(id,this.$route.meta.parentId);
        },
        navMenuSwitch(state){
            this.isshowNav = state;
        },
        //检测路径，如果后台有配置，则自动跳转，没用则回到首页
        checkUrl(){
            let tab = this.pageInfo;
            if(this.common.isNotBlank(tab)){
                this.openTab(tab);
            }else if(this.$route.path.indexOf('/static')>-1){
                return
            }
        },
        logout(){
            let that = this;
            this.common.postUrl("userTF", "logout", {}, function (data) {
                if(data){
                    that.$store.commit('resetData',{name:'componentName',data:'hzLogin'});
                    localStorage.removeItem("defaultUrl");
                    localStorage.removeItem("token");
                    localStorage.removeItem("entityIds");
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("rememberAccount");
                    localStorage.removeItem("pageInfo");
                    window.location.href='/hz';
                }
            });
        },
        modifyPasswordFirst(){
            let that = this;
            let password = this.password;
            let confirmPassword = this.confirmPassword;
            if(this.common.isBlank(password)){
                this.$message.error("请输入密码!")
                return false;
            }
            if(this.common.isBlank(confirmPassword)){
                this.$message.error("请输入确认密码!")
                return false;
            }
            let param = {};
            param.password=that.$getRsaCode(password);
            param.confirmPassword=that.$getRsaCode(confirmPassword);

            this.common.postUrl("userTF", "modifyPasswordFirst", param, function (data) {
                if(data){
                    let usernfo = that.common.userInfo();
                    usernfo.passwordFlag = 9;
                    that.$forceUpdate();
                    localStorage.setItem("userInfo",JSON.stringify(usernfo));
                    that.showDialog = false;
                }
            },null,null,true);
        },
        sendSmsValidCode(){
            let that=this;
            if(that.stamp){
                that.common.postUrl("userTF","webHzSendPasswordSmsValidCode", {billId:that.billId},function(data){
                    //成功执行
                    if(that.common.isNotBlank(data)){
                        that.stamp=false;
                        that.miao = 60;
                        const timer = setInterval(() =>{
                            // 某些定时器操作
                            if(!that.stamp){
                                that.miao = parseInt(that.miao) - 1;
                                that.msg = that.miao+"S后可重新获取";
                                if(that.miao == 0){
                                    that.msg="获取验证码";
                                    that.stamp=true;
                                    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
                                    that.$once('hook:beforeDestroy', () => {
                                        clearInterval(timer);
                                    })
                                }
                            }else{
                                that.msg="获取验证码";
                                that.stamp=true;
                            }
                        }, 1000);
                    }
                })
            }
        },
        async smsModifyPassword() {
            let that = this;
            if(this.common.isBlank(this.smsVaildCode)){
                this.$message.error("请输入验证码!")
                return false;
            }
            if (this.common.isBlank(this.password)) {
                this.$message.error("请输入密码!")
                return false;
            }
            if (this.common.isBlank(this.confirmPassword)) {
                this.$message.error("请输入二次确认密码!")
                return false;
            }
            if (this.password != this.confirmPassword) {
                this.$message.error("两次输入密码不一致!")
                return false;
            }
            let param = {};
            param.billId = that.billId;
            param.smsVaildCode = that.smsVaildCode;
            param.password = that.$getRsaCode(that.password);
            param.confirmPassword = that.$getRsaCode(that.confirmPassword);
            let data = await this.common.postUrl("userTF", "smsModifyPassword", param);
            if (data) {
                that.$message.success("修改密码成功！");
                that.showModifyDialog = false;
                that.smsVaildCode='';
                that.password='';
                that.confirmPassword='';
                return;
            }
        },
        toBaseInfo(){
            this.openTab({
                urlName: "基础资料",
                urlId: "baseInfo",
                urlPath: "/hz/baseInfo/baseInfo.vue",
                urlPathName: "/baseInfo"
            })
        },
        // 展示右上角个人信息
        showInfoList(){
            this.isshowInfoList = true;
        },
        // 隐藏部分弹出层
        hideDom(){
            this.isshowInfoList = false;
        },
        /**
         * 跳转接单拒单页面
         */
        gotoMessageList()
        {
            this.openTab({
                urlId: 'orderMessageManage',
                query: {},
                urlName: "订单消息列表",
                urlPathName: "/orderMessageManage",
                urlPath: "/hz/ord/order/orderMessageManage.vue"});
        },
        /**
         * 加载待办
         * @returns {Promise<void>}
         */
        async loadTodoData()
        {
            this.todo = await this.common.postUrl("userTF", "loadMessageHZ", {});
        },
        // 全局引入百度地图
        initMap(){
            const script1 = document.createElement('script');
            script1.setAttribute("type", "text/javascript");
            script1.setAttribute("src", "https://api.map.baidu.com/api?v=2.0&ak=ZZPMXMsHVRLZzHR6GUBRcGA2YfqzXOcG&s=1&callback=onBMapCallback");
            document.body.appendChild(script1);
            window.onBMapCallback = function () {
                console.log("百度地图脚本初始化成功...");
                const script2 = document.createElement('script');
                script2.src = "https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js";
                document.body.appendChild(script2);
                const script3 = document.createElement('script');
                script3.src = "/static/map/LuShu.js";
                document.body.appendChild(script3);
            };
        },
    }
}
