
export default {
    name: 'forgetPassword',
    data() {
        return {
            active: 0,
            userName: "",           //用户名
            smsVaildCode: "",          //验证码
            password: "",           //密码
            confirmPassword: "",           //密码
            btnMsg:'下一步',
            msg : '获取验证码',
            stamp : true,
            miao : 60,
        }
    },
    mounted() {

    },
    components: {
    },
    methods: {
        async next() {
            let that = this;
            let method = '';
            let param = {};
            if(this.active==0){
                if(this.common.isBlank(this.userName)){
                    this.$message.error("请输入用户名!")
                    return false;
                }
                // if(this.userName.length!=11){
                //     this.$message.error("请输入有效的手机号！");
                //     return false;
                // }
            }
            if(this.active==1){
                if(this.common.isBlank(this.smsVaildCode)){
                    this.$message.error("请输入验证码!")
                    return false;
                }
                method = 'checkSmsValidCode';
                param = {};
                param.billId = that.userName;
                param.smsVaildCode = that.smsVaildCode;

                await this.common.postUrl("userTF",method, param);
            }
            if(this.active==2){
                if(this.common.isBlank(this.password)){
                    this.$message.error("请输入密码!")
                    return false;
                }
                if(this.common.isBlank(this.confirmPassword)){
                    this.$message.error("请输入二次确认密码!")
                    return false;
                }
                if(this.password!=this.confirmPassword){
                    this.$message.error("两次输入密码不一致!")
                    return false;
                }
                method = 'smsModifyPassword';
                param = {};
                param.billId = that.userName;
                param.smsVaildCode = that.smsVaildCode;
                param.password = that.$getRsaCode(that.password);
                param.confirmPassword = that.$getRsaCode(that.confirmPassword);
                let data = await this.common.postUrl("userTF",method, param);
                if(data){
                    that.$message.success("修改密码成功！");
                    that.$store.commit('resetData',{name:'componentName',data:'hzLogin'});
                    return;
                }
            }

            if(that.active<2){
                that.active++;
            }
            if(that.active==2){
                that.btnMsg = '完成';
            }

        },
        toLogin(){
            this.$store.commit('resetData',{name:'componentName',data:'hzLogin'});
        },
        sendSmsValidCode(){
            let that=this;
            if(that.userName==null || that.userName==undefined || that.userName==""){
                this.$message.error("请输入用户名!")
                return false;
            }
            // if(that.userName.length!=11){
            //     this.$message.error("请输入有效的手机号！");
            //     return false;
            // }
            if(that.stamp){
                that.common.postUrl("userTF","webHzSendPasswordSmsValidCode", {billId:that.userName},function(data){
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
    }
}
