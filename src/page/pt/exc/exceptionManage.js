import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'exceptionManage',
    data() {
        return {
            head: [
                {"name": "异常编号", "code": "exceptionNum", "width": "120", "type": "text"},
                {"name": "事发时间", "code": "incidentDate", "width": "120", "type": "text"},
                {"name": "事发地点/线路", "code": "incidentAddress", "width": "200", "type": "text"},
                {"name": "事件经过", "code": "incidentProcess", "width": "300", "type": "text"},
                {"name": "问题描述", "code": "problemDescribe", "width": "300", "type": "text"},
                {"name": "现场应急处理措施", "code": "emergencyTreatment", "width": "350", "type": "text"},
                {"name": "请求协助内容", "code": "assistContent", "width": "300", "type": "text"},
                {"name": "当事人", "code": "discoverer", "width": "120", "type": "text"},
                {"name": "产生后果", "code": "party", "width": "120", "type": "text"},
                {"name": "提报部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "提报人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "现场是否向保险公司报案", "code": "whetherReportName", "width": "400", "type": "text"},
                {"name": "保险种类", "code": "insureClass", "width": "120", "type": "text"},
                {"name": "报案号", "code": "reportNum", "width": "120", "type": "text"},
                {"name": "提报时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "异常类型", "code": "typeName", "width": "100", "type": "text"},
                {"name": "异常状态", "code": "stateName", "width": "100", "type": "text"},
                {"name": "责任单位", "code": "responsibleCompany", "width": "160", "type": "text"},
                {"name": "责任人", "code": "responsiblePeople", "width": "120", "type": "text"},
                {"name": "对象客户", "code": "custName", "width": "120", "type": "text"},
                {"name": "有无人员伤害", "code": "peopleInjuryStsName", "width": "120", "type": "text"},
                {"name": "人员伤害情况", "code": "peopleInjuryStr", "width": "160", "type": "text"},
                {"name": "预估损失金额(元)", "code": "lossFee", "width": "120", "type": "text"},
                {"name": "实际损失金额(元)", "code": "actualLossFee", "width": "120", "type": "text"},
                {"name": "处理结果", "code": "result", "width": "300", "type": "text"},
                {"name": "处理完成时间", "code": "doneDate", "width": "150", "type": "text"},
                {"name": "是否纳入月考核评定", "code": "isExamineName", "width": "160", "type": "text"},
                {"name": "一级审核人", "code": "verifyStr1", "width": "160", "type": "text"},
                {"name": "二级审核人", "code": "verifyStr2", "width": "160", "type": "text"},
                {"name": "审核不通过原因", "code": "verifyRemark", "width": "160", "type": "text"},
            ],
            loadParam: {
                exceptionNum:'',
                orgName:'',
                state:'',
                type:'',
                tenantName:'',
                daterange1:'',
            },
            stateData:[],
            typeData:[],
            title:'',
            isShowSetUserDialog:false,
            emailUserList:[],
            staffData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EXCEPTION_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EXCEPTION_TYPE"}, function (data) {
                that.typeData = data;
            });
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.daterange1) && this.loadParam.daterange1.length == 2) {
                this.loadParam.startCreateDate = this.loadParam.daterange1[0];
                this.loadParam.endCreateDate = this.loadParam.daterange1[1];
            } else {
                this.loadParam.startCreateDate = '';
                this.loadParam.endCreateDate = '';
            }

            let {items} = await this.$refs.table.load("exceptionTF", "queryExceptionInfoPage", this.loadParam);
            items.forEach((el)=>{
                if(el.state == 4){
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },

        toDel() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            if(selectData[0].state!=0){
                this.$message.error("待处理的数据才能删除！");
                return;
            }
            // if (this.common.userInfo().userId != selectData[0].createUserId)
            // {
            //     this.$message.error("只有提交人自己才可以删除！");
            //     return false;
            // }
            this.$confirm("是否确认删除异常上报？", "提示").then(async () =>{
                await this.common.postUrl("exceptionTF", "delExceptionInfo", {id:selectData[0].id},
                    null, null, '', true);
                this.$message.success("删除异常上报成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        download(){
            this.$refs.table.downloadExcelFile('异常上报列表');
        },
        print() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = {
                query:{id: selectData[0].id},
                urlId: 'exceptionPrint' + selectData[0].id,
                urlName: '打印',
                urlPathName: '/exceptionPrint',
                urlPath: "/pt/exc/exceptionPrint.vue",
            }
            this.open(data);
        },
        addException() {
            let data = {
                query:{},
                urlId: 'addException'+new Date().getTime(),
                urlName: '异常上报',
                urlPathName: '/addException',
                urlPath: "/pt/exc/addException.vue",
            }
            this.open(data);
        },
        updateException(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            if(selectData[0].state!=0&&selectData[0].state!=9){
                // this.$message.error("待处理或审核不通过的数据才能修改！");
                // return;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                // this.$message.error("只有提交人自己才可以修改！");
                // return false;
            }
            let data = {
                query:{id:selectData[0].id,type: 2},
                urlId: 'updateException'+new Date().getTime(),
                urlName: '异常上报修改',
                urlPathName: '/updateException',
                urlPath: "/pt/exc/addException.vue",
            }
            this.open(data);
        },
        exceptionHandle(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据处理异常！");
                return;
            }
            // if(selectData[0].state==9){
            //     this.$message.error("审核不通过请先修改再处理");
            //     return;
            // }
            if(selectData[0].state>=2&&selectData[0].state!=9){
                this.$message.error("已经进入审核流程，不能再处理！");
                return;
            }
            let data = {
                query:{id:selectData[0].id},
                urlId: 'exceptionHandle'+new Date().getTime(),
                urlName: '处理异常',
                urlPathName: '/exceptionHandle',
                urlPath: "/pt/exc/exceptionHandle.vue",
            }
            this.open(data);
        },
        viewException(item){
            let data = {
                query:{id:item.id,type:1},
                urlId: 'exceptionDetail'+new Date().getTime(),
                urlName: '查看异常',
                urlPathName: '/exceptionDetail',
                urlPath: "/pt/exc/exceptionDetail.vue",
            }
            this.open(data);
        },
        verifyException(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据处理异常！");
                return;
            }
            if(selectData[0].state!=2&&selectData[0].state!=3){
                this.$message.error("数据状态不是待审核或者审核中！");
                return;
            }
            if(selectData[0].currentVerifyUserId==-1){
                if(this.common.userInfo().orgId!=selectData[0].currentVerifyOrgId){
                    this.$message.error("非当前审核人员不可以审核！");
                    return false;
                }
            }else{
                if(this.common.userInfo().userId!=selectData[0].currentVerifyUserId){
                    this.$message.error("非当前审核人员不可以审核！");
                    return false;
                }
            }
            let data = {
                query:{id:selectData[0].id,type:2},
                urlId: 'verifyException'+new Date().getTime(),
                urlName: '审核异常',
                urlPathName: '/verifyException',
                urlPath: "/pt/exc/exceptionDetail.vue",
            }
            this.open(data);
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },

        /**
         * 展示接收邮件人员Dialog
         * @param isShow
         */
        showSetUserDialog(isShow) {
            this.title = "接收邮件人员";
            if (isShow) {
                this.isShowSetUserDialog = true;
                let that = this;
                this.common.postUrl("commonTF", "getRemindEmails", {cfgName:"EXCEPTION_REMIND_EMAIL_USER"}, function (data) {
                    if (data) {
                        that.emailUserList = data;
                        if (that.emailUserList.length == 0) {
                            that.addRow();
                        }
                        that.queryStaffData();
                    }
                });
            }else {
                this.isShowSetUserDialog = false;
            }
        },


        /** 新增仓库用户行 */
        addRow() {
            let newRow = {
                id: '',
                userName:'',
                billId: '-',
                email: '-',
            };
            this.emailUserList.push(newRow);
            this.$forceUpdate();
        },


        /** 删除仓库用户行 */
        delRow(index) {
            this.emailUserList.splice(index,1);
            if(this.emailUserList.length === 0){
                this.addRow();
            }
            this.$forceUpdate();
        },

        /** 查询人员列表 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {haveEmail:1}, function (data) {
                that.staffData = data;
            });
        },

        /**
         * 选择用户
         * @param userData
         */
        selectUser(userData) {
            for (let i = 0; i < this.staffData.length; i++) {
                if (this.staffData[i].userId == userData.userId) {
                    userData.billId = this.staffData[i].billId;
                    userData.userName = this.staffData[i].staffName;
                    userData.email = this.staffData[i].email;
                    break;
                }
            }
        },

        /**
         * 保存仓库人员信息
         */
        saveEmailUser() {
            let method = 'saveEmailUser';
            let that = this;
            let param = {emailUserList : that.emailUserList,cfgName:"EXCEPTION_REMIND_EMAIL_USER"};
            this.common.postUrl("commonTF", method, param, function (data) {
                if (data) {
                    that.showSetUserDialog(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"异常编号","model":"exceptionNum","type":"input","placeholder":"异常编号","isshow":true},
                {"name":"提报部门","model":"orgName","type":"input","placeholder":"提报部门","isshow":true},
                {"name":"处理状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"处理状态","method":"doQuery","isshow":true},
                {"name":"异常类型","model":"type","type":"select","options":this.typeData,"label":"codeName","value":"codeValue","placeholder":"异常类型","method":"doQuery","isshow":true},
                {"name":"对象客户","model":"tenantName","type":"input","placeholder":"对象客户","isshow":true},
                {"name":"事发时间","model":"daterange1","type":"daterange","isshow":true},
            ]
        }
    },
}
