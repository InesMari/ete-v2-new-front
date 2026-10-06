import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'supplierContractReviewManage',
    data() {
        return {
            head: [
                {"name": "合同评审编码", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "合同评审类型", "code": "contractTypeName", "width": "150", "type": "text"},
                {"name": "合同类型", "code": "contractParentTypeName", "width": "150", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "申请日期", "code": "createDate", "width": "150", "type": "text"},
                {"name": "关联部门", "code": "relOrgName", "width": "180", "type": "text"},
                {"name": "申请部门", "code": "orgName", "width": "180", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "申请事由", "code": "remark", "width": "200", "type": "text"},
                {"name": "上传状态", "code": "contractStateName", "width": "120", "type": "text"},
                {"name": "当前评审人", "code": "currentReviewUserName", "width": "120", "type": "text"},
                {"name": "评审截止日期", "code": "expireDate", "width": "150", "type": "text"},
                {"name": "评审状态", "code": "stsName", "width": "120", "type": "text"},
                {"name": "寄出状态", "code": "sendOffRegisterStateName", "width": "120", "type": "text"},

                // {"name": "评审不通过原因", "code": "reviewRemark", "width": "120", "type": "text"},
            ],
            stsData: [],
            contractStateData:[],
            contractTypeData:[],
            sendOffStateData:[],
            contractParentTypeData:[],
            query: this.initQuery(this.$route.query.userName),
            storeHouseData:[],
            orgData:[],
            payTitleOptions:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"评审编码","model":"contractNum","type":"input","isshow":true},
                {"name":"申请部门","model":"orgName","type":"input","isshow":true},
                {"name":"申请人","model":"createUserName","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"评审状态","model":"sts","type":"select","options":this.stsData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"寄出状态","model":"sendOffRegisterState","type":"select","options":this.sendOffStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"当前评审人","model":"currentReviewUserName","type":"input","isshow":true},
                {"name":"上传状态","model":"contractState","type":"select","options":this.contractStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"申请事由","model":"remark","type":"input","isshow":true},
                {"name":"评审类型","model":"contractType","type":"select","options":this.contractTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"合同类型","model":"contractParentType","type":"select","options":this.contractParentTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"关联部门","model":"relOrgId","type":"select","options":this.orgData, "label":"orgName","value":"id","method":"doQuery","isshow":true},
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
            this.contractTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_TYPE"});
            this.contractParentTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_PARENT_TYPE"});
            let reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {type:2,headFlg:1});
            for (let i = 0; i < reviewUserList.length; i++) {
                let code = "reviewStr"+reviewUserList[i].reviewStep;
                let reviewRemarkCode = "reviewRemark"+reviewUserList[i].reviewStep;
                this.head.push({"name": reviewUserList[i].orgName+"评审", "code": code, "width": "150", "type": "text"})
                this.head.push({"name": reviewUserList[i].orgName+"评审意见", "code": reviewRemarkCode, "width": "150", "type": "text"})
            }
            if(this.$route.query.userName){
                this.query.sts = [String(enumData.FC_STS.WAIT), String(enumData.FC_STS.DOING)];
            }
            this.storeHouseData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
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
            let {items} = await this.$refs.table.load("contractReviewTF", "querySupplierContractReviewPage", this.query);
            items.forEach((el) => {
                if (el.sts == 99) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        addContractReview(){
            let item = {
                urlName: '新增供应商合同评审',
                urlId: 'supplierContractInfo'+(new Date()).getTime(),
                urlPathName: "/supplierContractInfo",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
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
            if(selectData[0].sts!=1&&selectData[0].sts!=2&&selectData[0].sts!=9&&selectData[0].sts!=99){
                this.$message.error("只有待申请、未评审、审核中或者评审不通过的合同才能修改！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有申请人自己才可以修改！");
                return false;
            }
            let item = {
                urlName: '修改供应商合同评审',
                urlId: 'updateSupplierContract'+selectData[0].id,
                urlPathName: "/updateSupplierContract",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
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
            if(this.common.userInfo().userId!=data.currentReviewUser){
                this.$message.error("非当前评审人员不可以评审！");
                return false;
            }
            let item = {
                urlName: '供应商合同评审',
                urlId: 'reviewSupplierContract'+selectData[0].id,
                urlPathName: "/reviewSupplierContract",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
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
                urlName: '打印供应商合同评审',
                urlId: 'printSupplierContract'+selectData[0].id,
                urlPathName: "/printSupplierContract",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
                query: {id: selectData[0].id,type: 4},
            }
            this.$emit('openTab', item);
        },
        viewContractReview(data){
            let item = {
                urlName: '查看供应商合同评审',
                urlId: "supplierContractDetail" + data.id,
                urlPathName: "/supplierContractDetail",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
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
            //1普通运输,2危险品运输,3仓储服务,4劳务服务,5销售,6租赁,7工程类,8保险,9仓储租赁,10人力劳务
            //旧的仓储服务、旧的保险不允许复制
            if (selectData[0].isOld && (selectData[0].contractType == 3 || selectData[0].contractType == 8))
            {
                this.$message.error("旧的仓储服务、旧的保险不允许复制！");
                return false;
            }
            let item = {
                urlName: '复制供应商合同评审',
                urlId: 'copySupplierContract'+selectData[0].id,
                urlPathName: "/copySupplierContract",
                urlPath: "/pt/cm/contract/review/supplierContractInfo.vue",
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
            if(selectData[0].sts!=1&&selectData[0].sts!=2&&selectData[0].sts!=9&&selectData[0].sts!=99){
                this.$message.error("只有待申请、未评审、审核中、或者评审不通过的合同才能删除！");
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
        revokeContractReviewInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要寄出登记的合同评审！");
                return false;
            }
            let data = selectData[0];
            if(data.createUserId!=this.common.userInfo().userId){
                this.$message.error("只有申请人自己才可以撤销申请！");
                return false;
            }
            //单据状态 1 未审核 2 审核中 3 审核完毕 4 已完结 （审核完毕才能打印，打印以后变成已完结）9 审核不通过（不能再操作）
            if(data.sts != 1 && data.sts != 2 && data.sts != 9){
                this.$message.error("只有未评审、审核中或者评审不通过的合同评审才能撤销申请！");
                return false;
            }
            let that = this;
            that.$confirm("是否确认撤销申请合同评审？", "撤销申请提示",{
                center: true,
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
            }).then(() =>{
                that.common.postUrl("contractReviewTF", "revokeContractReviewInfo", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("撤销申请成功！");
                },null,'',true);
            }).catch(() =>{});
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
