import uuidv1 from 'uuid/v1'
import th from "element-ui/src/locale/lang/th";
export default {
    name: 'login',
    data() {
        return {
            userName: "",           //用户名
            password: "",           //密码
            vaildCode: "",          //验证码
            smsVaildCode : "",      //短信验证码
            msg : '获取验证码',
            stamp : true,
            miao : 60,
            codeUrl: "",            //验证码路径
            rememberAccount:false,  //记住账号密码
            validCodeRandomNum:"",
            validCodeShow:false,
            loginType:"1",        //登录方式，1学员，2管理员
        }
    },
    mounted(){
        this.common.initTheme('edu');
        this.initWindwoSize();  //初始化页面高度
        // this.genCode()  //获取验证码
        // this.initAccount(); //初始化账户信息
    },
    methods: {
        initAccount(){
            let account = JSON.parse(localStorage.getItem("rememberAccount"));
            if(this.common.isNotBlank(account)){
                this.userName = account.userName;
                this.password = this.common.base64.decode(account.password);
                this.rememberAccount = true;
            }
        },
        initWindwoSize(){
            let login = document.getElementById('login');
            login.style.height = window.innerHeight + 'px';
            window.onresize = function(){
                login.style.height = window.innerHeight + 'px';
            }
        },
        genCode() {
            this.validCodeRandomNum = uuidv1();
            let host = window.location.host;
            if(host.indexOf('localhost')>-1 || host.indexOf('127.0.0.1') >-1 || host.indexOf('192.168') >-1){
                this.codeUrl = "/api/genCode?validCodeRandomNum=" + this.validCodeRandomNum;
            }else{
                this.codeUrl = "genCode?validCodeRandomNum=" + this.validCodeRandomNum;
            }
        },
        getBrowser : function () {
            let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            let isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            let isIE = userAgent.indexOf("compatible") > -1
                    && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            let isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
            let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            let isSafari = userAgent.indexOf("Safari") > -1
                    && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            let isChrome = userAgent.indexOf("Chrome") > -1
                    && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

            if (isIE) {
                let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                let fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return "IE7";
                } else if (fIEVersion == 8) {
                    return "IE8";
                } else if (fIEVersion == 9) {
                    return "IE9";
                } else if (fIEVersion == 10) {
                    return "IE10";
                } else if (fIEVersion == 11) {
                    return "IE11";
                } else {
                    return "0";
                }//IE版本过低
                return "IE";
            }
            if (isOpera) {
                return "Opera";
            }
            if (isEdge) {
                return "Edge";
            }
            if (isFF) {
                return "Firefox";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
        },
        sendLoginSmsValidCode(){
            let that=this;
            if(that.userName==null || that.userName==undefined || that.userName==""){
                this.$message.error("请输入手机号!")
                return false;
            }
            if(that.userName.length!=11){
                this.$message.error("请输入有效的手机号！");
                return false;
            }
            if(that.stamp){
                that.common.postUrl("userTF","webPtSendLoginSmsValidCode", {billId:that.userName},function(data){
                    //成功执行
                    if(that.common.isNotBlank(data)){
                        that.stamp=false;
                        that.miao = 60;
                        const timer = setInterval(() =>{
                            // 某些定时器操作
                            if(!that.stamp){
                                that.miao = parseInt(that.miao) - 1;
                                that.msg = that.miao+"S后可重新发送";
                                if(that.miao == 0){
                                    that.msg="获取验证码";
                                    that.stamp=true;
                                }
                            }else{
                                that.msg="获取验证码";
                                that.stamp=true;
                            }
                        }, 1000);
                        // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
                        this.$once('hook:beforeDestroy', () => {
                            clearInterval(timer);
                        })
                    }
                })
            }
        },
        getShowCode(){
            let that=this;
            if (this.common.isNotBlank(that.userName))
            {
                that.common.postUrl("userTF","webPtgetShowCode", {billId:that.userName},function(data){
                    //成功执行
                    if(that.common.isNotBlank(data)){
                        that.validCodeShow = data.validCodeShow;
                        if(that.validCodeShow){
                            that.genCode();
                        }
                    }
                })
            }
        },
        submit(){
            // this.$router.replace('/');   //防止后退去到登录页
            // this.$store.commit('resetData',{name:'componentName',data:'eduAdminHome'});
            // localStorage.setItem("defaultUrl","eduAdminHome");

            let username = this.userName;
            let password = this.password;
            let smsVaildCode = this.smsVaildCode;
            let vaildCode = this.vaildCode;
            let validCodeRandomNum = this.validCodeRandomNum;

            if(this.common.isBlank(username)){
                this.$message.error("请输入用户名!")
                return false;
            }
            if(this.common.isBlank(password)){
                this.$message.error("请输入密码!")
                return false;
            }
            if(this.validCodeShow && this.common.isBlank(vaildCode)){
                this.$message.error("请输入验证码!")
                return false;
            }
            let that = this;
            let login = {
                billId: username,
                password:that.$getRsaCode(password),
                vaildCode: vaildCode,
                validCodeRandomNum: validCodeRandomNum,
            };
            let method = '';
            if(this.loginType==1){
                // method = 'webPtLogin';
                method = 'studentLoginForWeb';
                login.browser =  this.browser;
            }else{
                // method = 'webPtValidCodeLogin';
                method = 'adminLoginForWeb';
            }
            this.common.postUrl("eduUserService",method,login,function(data){
                localStorage.clear();
                if(that.common.isNotBlank(data)){
                    if (that.loginType==2 && data.noAuthHome)
                    {
                        that.$message.error(data.msg);//没有授权管理者首页
                        return;
                    }
                    if(data.validCodeShow){
                        that.validCodeShow = data.validCodeShow;
                        that.genCode();
                        that.$message.error(data.msg);
                    }else{
                        localStorage.setItem("token",data.token);
                        localStorage.setItem("entityIds",data.entityIds);
                        localStorage.setItem("userInfo",JSON.stringify(data));
                        if (that.loginType==1)
                        {
                            that.$store.commit('resetData',{name:'componentName',data:'eduHome'});
                            localStorage.setItem("defaultUrl","eduHome");
                        }
                        else
                        {
                            that.$store.commit('resetData',{name:'componentName',data:'eduAdminHome'});
                            localStorage.setItem("defaultUrl","eduAdminHome");
                        }
                        that.$store.commit('resetData',{name:'token',data:data.token});
                        if(that.rememberAccount){   //记住账户密码
                            localStorage.setItem("rememberTime",new Date().getTime());
                        }
                        localStorage.setItem("sessionTime",new Date().getTime());
                    }
                }
            },function () {
                if(that.loginType==1) {
                    that.genCode();
                }
            },null,true)
        },
        handleSelect(key){
            this.loginType = key;
        },
        toForget(){
            this.$store.commit('resetData',{name:'componentName',data:'eduForgetPassword'});
        }
    }
}
