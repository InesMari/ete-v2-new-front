import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'fcBudgetSalesDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                billMonth:this.$route.query.billMonth,
                detailList:[],
                totalInfo:{},
            },
            type:this.$route.query.type, //1 新增  2 修改 3 查看
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            if(this.type==1){
                var currentDate = new Date();
                // 将当前日期设置为上一个月的最后一天
                currentDate.setDate(0);
                this.info.billMonth = this.common.formatTime(currentDate,'yyyy-MM');
                //加载静态枚举
                let that = this;
                this.common.postUrl("commonTF", "getSysStaticData", {codeType:"MANAGE_ORG"}, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        that.info.detailList.push({orgId:data[i].codeValue,orgName:data[i].codeName});
                    }
                });
            }else{
                let that = this;
                this.common.postUrl("hrManagementCostTF", 'queryManagementCostDetail', {billMonth:this.$route.query.billMonth}, function (data) {
                    that.info = data;
                },function (msg){
                    if(msg=="密码已经被修改，请重新输入"){
                        let userInfo = that.common.userInfo();
                        userInfo.aesKey = '';
                        localStorage.setItem("userInfo",JSON.stringify(userInfo));
                        that.$message.error("密码已经被修改，请重新输入");
                    }
                });
            }
            this.$forceUpdate();
        },
        calFee(item,feeName){
            this.info.totalInfo[feeName]=0;
            for (let i = 0; i < this.info.detailList.length; i++) {
                if(this.common.isNotBlank(this.info.detailList[i][feeName])){
                    this.info.totalInfo[feeName] = this.common.accAdd(this.info.totalInfo[feeName],Number.parseInt(this.info.detailList[i][feeName]));
                }
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        //  提交
        async submit(){
            let info = this.common.copyObj(this.info);
            if(this.common.isBlank(info.billMonth)){
                this.$message.error("请选择成本月份");
                return;
            }
            if(this.type==2){
                info.isUpdate = 1;
            }
            let that = this;
            await this.common.postUrl('hrManagementCostTF','saveManagementCost',info,null,function (data){
                if(data.message=="密码已经被修改，请重新输入"){
                    let userInfo = that.common.userInfo();
                    userInfo.aesKey = '';
                    localStorage.setItem("userInfo",JSON.stringify(userInfo));
                    that.$message.error("密码已经被修改，请重新输入");
                }
            },null,true);
            this.$message.success("提交成功")
            this.closePage();
        },
    },
    computed: {

    }
}
