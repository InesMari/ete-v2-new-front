import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'customerContractReviewManage',
    data() {
        return {
            head: [
                {"name": "合同评审编码", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "申请日期", "code": "createDate", "width": "150", "type": "text"},
                {"name": "申请部门", "code": "orgName", "width": "180", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "申请事由", "code": "remark", "width": "200", "type": "text"},
                {"name": "上传状态", "code": "contractStateName", "width": "120", "type": "text"},
                {"name": "当前评审人", "code": "currentReviewUserName", "width": "120", "type": "text"},
                {"name": "评审截止日期", "code": "expireDate", "width": "150", "type": "text"},
                {"name": "评审状态", "code": "stsName", "width": "120", "type": "text"},
                {"name": "寄出状态", "code": "sendOffRegisterStateName", "width": "120", "type": "text"},
            ],
            stsData: [],
            contractStateData:[],
            sendOffStateData:[],
            query: this.initQuery(this.$route.query.userName),
            payTitleOptions:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"合同评审编码","model":"contractNum","type":"input","isshow":true},
                {"name":"申请部门","model":"orgName","type":"input","isshow":true},
                {"name":"申请人","model":"createUserName","type":"input","isshow":true},
                {"name":"客户名称","model":"tenantName","type":"input","isshow":true},
                {"name":"评审状态","model":"sts","type":"select","options":this.stsData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"寄出状态","model":"sendOffRegisterState","type":"select","options":this.sendOffStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"当前评审人","model":"currentReviewUserName","type":"input","isshow":true},
                {"name":"上传状态","model":"contractState","type":"select","options":this.contractStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"申请事由","model":"remark","type":"input","isshow":true},
                {"name":"结算主体","model":"settleBody", "type":"select","options":this.payTitleOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    mounted() {
		this.init();
        this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
        searchList,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            this.stsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_REVIEW_STS"});
            this.contractStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WHETHER"});
            this.sendOffStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"SEND_OFF_STATE"});
            // let reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {type:1});
            // for (let i = 0; i < reviewUserList.length; i++) {
            //     let code = "reviewStr"+reviewUserList[i].reviewStep;
            //     let reviewRemarkCode = "reviewRemark"+reviewUserList[i].reviewStep;
            //     this.head.push({"name": reviewUserList[i].orgName+"评审", "code": code, "width": "150", "type": "text"})
            //     this.head.push({"name": reviewUserList[i].orgName+"评审意见", "code": reviewRemarkCode, "width": "150", "type": "text"})
            // }
            if(this.$route.query.userName){
                this.query.sts = [String(enumData.FC_STS.WAIT), String(enumData.FC_STS.DOING)];
            }
            this.payTitleOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
        },
        /**
         * 初始化查询条件
         * @returns
         */
        initQuery(userName) {
            return this.query = {
                contractNum: '',
                orgName: '',
                createUserName: '',
                tenantName: '',
                sts: '',
                currentReviewUserName:userName,
            };
        },

        /**
         *
         */
        async doQuery(query = this.query) {
            this.query = query;
            await this.$refs.table.load("contractReviewTF", "queryCustomerContractReviewPage", this.query);
        },
        addContractReview(){
            let item = {
                urlName: '新增客户合同评审',
                urlId: 'addCustomerContract'+(new Date()).getTime(),
                urlPathName: "/addCustomerContract",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {type: 1},
            }
            this.$emit('openTab', item);
        },
        updateContractReview(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的合同评审！");
                return false;
            }
            if(selectData[0].sts!=1&&selectData[0].sts!=2&&selectData[0].sts!=9){
                this.$message.error("只有未评审或者评审不通过的合同才能修改！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有申请人自己才可以修改！");
                return false;
            }
            let item = {
                urlName: '修改客户合同评审',
                urlId: 'updateCustomerContract'+selectData[0].id,
                urlPathName: "/updateCustomerContract",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {id: selectData[0].id,type: 2},
            }
            this.$emit('openTab', item);
        },
        reviewContract(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要评审的合同评审！");
                return false;
            }
            if(selectData[0].sts!=1&&selectData[0].sts!=2){
                this.$message.error("只有未评审或者评审中的合同才能评审！");
                return false;
            }
            let data = selectData[0];
            let currentReviewUserArray = data.currentReviewUser.split(',').map(Number);
            let flag = false;
            for (let i = 0; i < currentReviewUserArray.length; i++) {
                let item = currentReviewUserArray[i];
                if(item===this.common.userInfo().userId){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                this.$message.error("非当前评审人员不可以评审！");
                return false;
            }
            let item = {
                urlName: '客户合同评审',
                urlId: 'reviewCustomerContract'+selectData[0].id,
                urlPathName: "/reviewCustomerContract",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {id: selectData[0].id,type: 3},
            }
            this.$emit('openTab', item);
        },
        printContractReview(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要打印的合同评审！");
                return false;
            }
            if(selectData[0].sts!=3&&selectData[0].sts!=4){
                this.$message.error("只有评审完毕或者已完结的合同才能打印！");
                return false;
            }
            let item = {
                urlName: '打印客户合同评审',
                urlId: 'printCustomerContract'+selectData[0].id,
                urlPathName: "/printCustomerContract",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {id: selectData[0].id,type: 4},
            }
            this.$emit('openTab', item);
        },
        viewContractReview(data){
            let item = {
                urlName: '查看客户合同评审',
                urlId: "customerContractDetail" + data.id,
                urlPathName: "/customerContractDetail",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {id: data.id,type: 5},
            }
            this.$emit('openTab', item);
        },
        copyContractReview(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的合同评审！");
                return false;
            }
            let item = {
                urlName: '复制客户合同评审',
                urlId: 'copyCustomerContract'+selectData[0].id,
                urlPathName: "/copyCustomerContract",
                urlPath: "/pt/cm/contract/review/customerContractInfo.vue",
                query: {id: selectData[0].id,type: 6},
            }
            this.$emit('openTab', item);
        },
        delContractReviewInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的合同评审！");
                return false;
            }
            if(selectData[0].sts!=1&&selectData[0].sts!=2&&selectData[0].sts!=9){
                this.$message.error("只有未评审或者评审不通过的合同才能删除！");
                return false;
            }
            let data = selectData[0];
            let that = this;
            that.$confirm("确认需要删除合同评审？", "提示").then(() =>{
                that.common.postUrl("contractReviewTF", "delContractReviewInfo", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },

        sendOffRegister(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要寄出登记的合同评审！");
                return false;
            }
            let data = selectData[0];
            //单据状态 1 未审核 2 审核中 3 审核完毕 4 已完结 （审核完毕才能打印，打印以后变成已完结）9 审核不通过（不能再操作）
            if(data.sts != 3 && data.sts != 4){
                this.$message.error("只有评审完毕或者已完结的合同评审才能登记！");
                return false;
            }
            let that = this;
            if (data.sendOffRegisterState == 1)
            {
                let tip = '是否' + '<span style="color:red;font-size: 16px">撤销</span>' + '合同寄出登记？';
                that.$confirm(tip, "撤销合同寄出登记提示",{
                    center: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '关闭',
                    dangerouslyUseHTMLString: true,
                }).then(() =>{
                    that.common.postUrl("contractReviewTF", "sendOffRegisterContractReviewInfo", {id: data.id, sendOffRegisterState: 0}, function (data)
                    {
                        that.doQuery();
                        that.$message.success("登记成功！");
                    },null,'',true);
                }).catch(() =>{});
            }
            else
            {
                that.$confirm("是否确认合同寄出登记？", "合同寄出登记提示",{
                    center: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '关闭',
                }).then(() =>{
                    that.common.postUrl("contractReviewTF", "sendOffRegisterContractReviewInfo", {id: data.id, sendOffRegisterState: 1}, function (data)
                    {
                        that.doQuery();
                        that.$message.success("登记成功！");
                    },null,'',true);
                }).catch(() =>{});
            }
        },


        cancelReviewContractInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要取消评审的合同！");
                return false;
            }
            let data = selectData[0];
            let that = this;
            that.$confirm("确认需要取消合同评审？", "提示").then(() =>{
                that.common.postUrl("contractReviewTF", "cancelReviewContractInfo", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("取消评审成功！");
                },null,'',true);
            }).catch(() =>{});
        }
    },
}
