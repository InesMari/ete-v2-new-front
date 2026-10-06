import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'hrManagementCostManage',
    data()
    {
        return {
            head: [
                {"name": "成本月份", "code": "billMonth", "width": "150", "type": "text"},
                {"name": "工资", "code": "wages", "width": "120", "type": "text"},
                {"name": "社保", "code": "socialInsurance", "width": "120", "type": "text"},
                {"name": "公积金", "code": "accumulationFund", "width": "120", "type": "text"},
                {"name": "福利", "code": "welfareCosts", "width": "120", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "150", "type": "text"},
            ],
            loadParam: {
                billMonth:'',
            },
            baseInfo:{},
            impFlag:false,
            password:'',
            showLoginPasswordDialog:false,

            info:{
                oldPassword:'',
                newPassword:'',
                confirmPassword:'',
            },
            showDialog:false,
        }
    },
    async mounted()
    {
        this.firstLoad();
    },
    components: {
        tableCommon,
        searchList,
        myImport
    },
    methods: {
        clearFn(){
            this.loadParam={
                billMonth:'',
            };
        },

        firstLoad(){
            if(this.common.isBlank(this.common.userInfo().aesKey)){
                this.showLoginPasswordDialog=true;
            }else{
                this.doQuery();
            }
        },

        toAdd(){
            this.$emit('openTab', {
                urlName: '新增管理成本',
                urlId: 'hrManagementCostDetail'+new Date().getTime(),
                urlPathName: "/hrManagementCostDetail",
                urlPath: "/pt/hr/cost/hrManagementCostDetail.vue",
                query:{type:1}
            });
        },
        toUpdate(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '修改管理成本',
                urlId: 'hrManagementCostDetail'+new Date().getTime(),
                urlPathName: "/hrManagementCostDetail",
                urlPath: "/pt/hr/cost/hrManagementCostDetail.vue",
                query:{type:2,billMonth:selectData[0].billMonth}
            });
        },
        toDel(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() => {
                that.common.postUrl("hrManagementCostTF", "deleteManagementCost", {billMonth: selectData[0].billMonth}, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.doQuery();
                        that.$message.success("删除成功");
                    }
                }, function (msg) {
                    if (msg == "密码已经被修改，请重新输入") {
                        let userInfo = that.common.userInfo();
                        userInfo.aesKey = '';
                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                        that.$message.error("密码已经被修改，请重新输入");
                    }
                }, '', true);
            });
        },
        toView(item){
            this.$emit('openTab', {
                urlName: '查看管理成本',
                urlId: 'hrManagementCostDetail'+new Date().getTime(),
                urlPathName: "/hrManagementCostDetail",
                urlPath: "/pt/hr/cost/hrManagementCostDetail.vue",
                query:{type:3,billMonth:item.billMonth}
            });
        },
        downloadExcel(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要导出的数据！");
                return false;
            }
            let param = {};
            param.billMonth = selectData[0].billMonth;
            param.selfCreateUrl = 'hrManagementCostTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', "管理成本", 'hrManagementCostManageTable');
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            let that = this;
            await this.$refs.table.load("hrManagementCostTF", "queryManagementCostPage", this.loadParam,"",function (data){
                if(data.message=="密码已经被修改，请重新输入"){
                    let userInfo = that.common.userInfo();
                    userInfo.aesKey = '';
                    localStorage.setItem("userInfo",JSON.stringify(userInfo));
                }
            });
        },
        showImp(flag) {
            if (flag) {
                this.baseInfo={};
                var currentDate = new Date();
                // 将当前日期设置为上一个月的最后一天
                currentDate.setDate(0);
                this.baseInfo.billMonth = this.common.formatTime(currentDate,'yyyy-MM');
            }
            this.$forceUpdate();
            this.impFlag=flag;
        },
        myImportSuccessCallback(){
            this.doQuery();
            this.showImp(false);
            this.$message.success("导入成功！");
        },
        impAdd(){
            if(this.common.isBlank(this.baseInfo.billMonth)){
                this.$message.error("成本月份不能为空！");
                return;
            }
            this.$refs.myImport.submitFileForm();
        },
        loginPassword(){
            let password = this.password;
            if(this.common.isBlank(password)){
                this.$message.error("请输入密码!")
                return false;
            }
            password=this.$getRsaCode(password);
            let that = this;
            this.common.postUrl("hrManagementCostTF","checkPassword", {password},function(data){
                let userInfo = that.common.userInfo();
                userInfo.aesKey = password;
                localStorage.setItem("userInfo",JSON.stringify(userInfo));
                that.showLoginPasswordDialog = false;
                that.doQuery();
            },null,'',true);

        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.showLoginPasswordDialog = false;
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
        displayChangePasswordDialog(){
            this.info={};
            this.showDialog=true;
        },
        closeDialog(){
            this.showDialog=false;
            this.$forceUpdate();
        },
        changePassword(){
            let that = this;
            if(this.common.isBlank(this.info.oldPassword)){
                this.$message.error("请输入旧密码!")
                return false;
            }
            if(this.common.isBlank(this.info.newPassword)){
                this.$message.error("请输入新密码!")
                return false;
            }
            if(this.common.isBlank(this.info.confirmPassword)){
                this.$message.error("请输入确认密码!")
                return false;
            }
            if(this.info.newPassword!=this.info.confirmPassword){
                this.$message.error("两次密码不一致!")
                return false;
            }
            let param = {};
            param.oldPassword=that.$getRsaCode(this.info.oldPassword);
            param.newPassword=that.$getRsaCode(this.info.newPassword);
            param.confirmPassword=that.$getRsaCode(this.info.confirmPassword);

            this.common.postUrl("hrManagementCostTF", "changePassword", param, function (data) {
                if(data){
                    let userInfo = that.common.userInfo();
                    userInfo.aesKey = that.info.newPassword;
                    localStorage.setItem("userInfo",JSON.stringify(userInfo));
                    that.showDialog = false;
                    this.$message.success("修改成功！");
                }
            },null,null,true);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"成本月份","placeholder":"成本月份","model":"billMonth","type":"month","method":"doQuery","isshow":true},
            ]
        }
    },
}
