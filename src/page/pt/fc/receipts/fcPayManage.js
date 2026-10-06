import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'fcPayManage',
    data()
    {
        return {
            head: [
                {"name": "付款单号", "code": "payNum", "width": "120", "type": "text"},
                {"name": "付款单状态", "code": "stateName", "width": "100", "type": "text"},
                {"name": "采购费用申请", "code": "applyNums", "width": "200", "type": "diy"},
                {"name": "请款单号", "code": "reqNums", "width": "200", "type": "diy"},
                {"name": "供应商账单", "code": "billNums", "width": "150", "type": "diy"},
                {"name": "业务月份", "code": "businessDates", "width": "150", "type": "text"},
                {"name": "报销公司", "code": "payTitleName", "width": "180", "type": "text"},
                {"name": "收款方全称", "code": "bankAccountName", "width": "200", "type": "text"},
                {"name": "开户行", "code": "bankDeposit", "width": "180", "type": "text"},
                {"name": "账号", "code": "bankCard", "width": "180", "type": "text"},
                {"name": "备注", "code": "payRemark", "width": "200", "type": "text"},
                {"name": "报销部门", "code": "orgName", "width": "100", "type": "text"},
                {"name": "填写日期", "code": "createDate", "width": "100", "type": "text"},
                {"name": "报销内容", "code": "payProjectsName", "width": "180", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "90", "type": "text"},
                {"name": "应付金额", "code": "mustPayFee", "width": "100", "type": "text"},
                {"name": "扣款金额", "code": "deduction", "width": "100", "type": "text"},
                {"name": "实付金额", "code": "payFee", "width": "100", "type": "text"},
                {"name": "已付金额", "code": "hasPayFee", "width": "90", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "90", "type": "diy"},
                {"name": "应补(退)金额", "code": "actualPayFee", "width": "90", "type": "text"},
                {"name": "预计支付日期", "code": "expectDate", "width": "100", "type": "text"},
                {"name": "最后付款日期", "code": "lastPayDate", "width": "100", "type": "text"},
                {"name": "部门制成", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "当前审核人", "code": "currentApplyUserName", "width": "150", "type": "text"},
                {"name": "收单状态", "code": "receiveStateName", "width": "150", "type": "text"},
                {"name": "收单人", "code": "receiveUserName", "width": "150", "type": "text"},
                {"name": "收单时间", "code": "receiveDate", "width": "150", "type": "text"},
                {"name": "收单备注", "code": "receiveRemark", "width": "150", "type": "text"},
                {"name": "作废人", "code": "invalidUserName", "width": "150", "type": "text"},
                {"name": "作废时间", "code": "invalidDate", "width": "150", "type": "text"},
                {"name": "作废备注", "code": "invalidRemark", "width": "150", "type": "text"},
            ],
            query:{
                payNum: "",
                orgName: "",
                bankAccountName:'',
                createUserName: "",
                remark:'',
                state: [],
                currentApplyUserName:'',
            },
            stateData: [],
            payTitleOptions:[],
            payProjectOptions:[],
            subTypeData:[],
            treeData:[],

            registerShow:false,
            info:this.initInfo(),
            receiveReceiptStateData:[],
            registerDetailShow: false,//付款明细
            detailHead: [
                {"name": "操作", "code": "caozuo", "width": "110", "type": "diy"},
                {"name": "本次付款金额", "code": "fee", "width": "110", "type": "text"},
                {"name": "实际付款日期", "code": "payDate", "width": "110", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "110", "type": "text"},
            ],
            disabledFee: false,//是否禁用输入付款金额
            payStateData: [],
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();
        await this.initHead();
        await this.enterDoQuery();
    },

    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async enterDoQuery(){
            if (this.$route.query.verifyStateFlag == 1){
                this.query.state = [String(enumData.FC_STS.WAIT), String(enumData.FC_STS.DOING)];
                this.query.currentApplyUserName = this.common.userInfo().userName;
            }//待办跳转
            await this.doQuery();
        },
        async initHead(){
            let heads = await this.common.postUrl("fcPayTF", "getAllBaseVerifyExt");
            let that = this;
            heads.forEach(el=>{
                that.head.push({"name":el.name,"code":el.code,"width": "200", "type": "text"});
            });
        },
        /**
         * 初始化静态数据
         */
        async initData()
        {
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_STATE"});
            this.payTitleOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            this.payProjectOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE"});
            this.subTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE_SUB"});
            this.thrdTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE_THRD"});
            this.receiveReceiptStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIVE_RECEIPT_STATE"});
            this.payStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_STATE"});

            this.subTypeData.forEach(item => {
                let codeValue = item.codeValue;
                item.children = '';
                this.thrdTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if(item.children == ''){
                            item.children = [];
                        }
                        item.children.push(data2);
                    }
                })
            })
            this.treeData = [];
            this.payProjectOptions.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.subTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })
        },
        /**
         * 清空查询条件
         */
        clear(query=this.query)
        {
            this.query=query;
            this.query = {
                payNum: "",
                orgName: "",
                createUserName: "",
                remark:'',
                payTitle:'',
                currentApplyUserName:'',
                payState:'',
            };
        },
        /**
         * 加载角色列表
         */
        async doQuery(query=this.query)
        {
            // 结束上一次查询后再进行下一次查询
            if(this.isQuery){
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    this.doQuery();
                }, 100);
            }else{
                this.isQuery = true;
            }
            this.query=query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.query.payProjectData!=null){
                this.query.payProject = this.query.payProjectData[0];
                if (this.query.payProjectData.length > 1)
                {
                    this.query.paySubProject = this.query.payProjectData[1];
                    if(this.query.payProjectData.length > 2){
                        this.query.payThrdProject = this.query.payProjectData[2];
                    }else{
                        this.query.payThrdProject = null;
                    }
                }
                else
                {
                    this.query.paySubProject = null;
                    this.query.payThrdProject = null;
                }
            }
            if(this.common.isNotBlank(this.query.expectDate) && this.query.expectDate.length==2){
                this.query.startExpectDate = this.query.expectDate[0];
                this.query.endExpectDate = this.query.expectDate[1];
            }else{
                this.query.startExpectDate = '';
                this.query.endExpectDate = '';
            }

            let {items} = await this.$refs.table.load("fcPayTF", "queryFcPayInfoPage", this.query);
            items.forEach((el)=>{
                el.disabled =  (el.payState == 2&&el.receiveState==1)||el.state==enumData.FC_STS.INVALID;
            });
            this.$refs.table.resetData(items);
            this.tableData = items;
            this.$forceUpdate();
            // 防止渲染异步
            this.$nextTick(()=>{
                this.isQuery = false;
            });
        },
        initInfo(){
            this.info = {
                bankAccountName: null,
                payNum: null,
                payFee: null,
                hasPayFee: null,
                noPayFee: null,
                fee: null,
                actualPayDate: null,
                remark: null,
            }
            return this.info;
        },
        addPayOrder() {
            let item = {
                urlName: '新增付款单',
                urlId: 'addPayOrder'+(new Date()).getTime(),
                urlPathName: "/addPayOrder",
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue",
            }
            this.$emit('openTab', item);
        },
        delPayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要删除的付款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT != selectData[0].state
                    && enumData.FC_STS.NOT != selectData[0].state
                    && enumData.FC_STS.DOING != selectData[0].state){
                this.$message.error("只有未审核、审核中或者审核不通过的付款单才可以删除！");
                return false;
            }
            if (enumData.FC_STS.CANCEL == selectData[0].state)
            {
                this.$message.error("已删除，请勿重复操作！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有付款人自己才可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("fcPayTF", "delFcPayInfo", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        updatePayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要修改的付款单！");
                return false;
            }
            if (!(enumData.FC_STS.WAIT == selectData[0].state
                    || enumData.FC_STS.DOING == selectData[0].state
                    || enumData.FC_STS.NOT == selectData[0].state)){
                this.$message.error("只有未审核、审核中或者审核不通过的付款单才可以修改！");
                return false;
            }
            let item = {
                urlName: '修改付款单',
                urlId: "updatePayOrder" + selectData[0].id,
                urlPathName: "/updatePayOrder",
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue",
                query: {id:selectData[0].id, isUpdate: 1, applyIds: selectData[0].applyIds},
            }
            this.$emit('openTab', item);
        },
        copyAddPayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要复制新增的付款单！");
                return false;
            }
            //核销不能复制
            if(selectData[0].payType==3){
                this.$message.error("核销不能复制！");
                return false;
            }
            let item = {
                urlName: '新增付款单',
                urlId: "copyAddPayOrder" + selectData[0].id,
                urlPathName: "/copyAddPayOrder",
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue",
                query: {id:selectData[0].id, isCopy: 1, applyIds: selectData[0].applyIds},
            }
            this.$emit('openTab', item);
        },
        viewPayOrder(data){
            let item = {
                urlName: '查看付款单',
                urlId: "payOrderDetail" + data.id,
                urlPathName: "/payOrderDetail",
                urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                query: {id:data.id,currentApplyStep:data.currentApplyStep,type:0, applyIds: data.applyIds},
            }
            this.$emit('openTab', item);
        },
        /**
         * 跳转采购申请明细
         * @param param
         * @param index
         * @returns {Promise<void>}
         */
        async toDetail(param,code,index)
        {
            if (code == 'reqNums')
            {
                let id = param.reqIdArray[index];
                this.$emit("openTab",{
                    urlId: "requestFeeDetail" + id,
                    urlName: '查看请款单',
                    urlPathName: '/requestFeeDetail',
                    query: {id: id,type:'0'},
                    urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
                });
            }else if(code=='applyNums'){
                let id = param.applyIdArray[index];
                if(param.feeApplySrc==2){
                    this.$emit("openTab",{
                        query: {id : id},
                        urlId: "paymentPlanDetail" + id,
                        urlName: "查看费用清单",
                        urlPathName: "/paymentPlanDetail",
                        urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"});
                }else {
                    this.$emit("openTab", {
                        urlName: '查看采购费用申请',
                        urlId: "purchaseDetail" + id,
                        urlPathName: "/purchaseDetail",
                        urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue",
                        query: {id: id},
                    });
                }
            }

        },
        verifyPayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要审核的付款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT != selectData[0].state && enumData.FC_STS.DOING != selectData[0].state){
                this.$message.error("只有未审核和审核中的付款单才可以审核！");
                return false;
            }
            let data = selectData[0];
            if(this.common.userInfo().userId!=data.currentApplyUser){
                this.$message.error("非当前审核人员不可以审核！");
                return false;
            }
            let item = {
                urlName: '审核付款单',
                urlId: "verifyPayOrderDetail" + data.id,
                urlPathName: "/verifyPayOrderDetail",
                urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                query: {id:data.id,currentApplyStep:data.currentApplyStep,type:3},
            }
            this.$emit('openTab', item);
        },
        cancelPayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要取消审核的付款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT == selectData[0].state)
            {
                this.$message.error("未审核的付款单不可以取消审核！");
                return false;
            }
            if(selectData[0].receiveState==1){
                this.$message.error("已收单的付款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.PAYED == selectData[0].state)
            {
                this.$message.error("已付款的付款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.PRINTED == selectData[0].state)
            {
                this.$message.error("已完结的付款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.CANCEL == selectData[0].state)
            {
                this.$message.error("已取消的付款单不能取消审核！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要取消审核？", "提示").then(() =>{
                this.common.postUrl("fcPayTF", "cancelFcPayInfo", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消审核成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        oneKeyCancelFcPayInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要取消审核的付款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT == selectData[0].state){
                this.$message.error("未审核的付款单不可以取消审核！");
                return false;
            }
            if(selectData[0].receiveState==1){
                this.$message.error("已收单的付款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.PAYED == selectData[0].state){
                this.$message.error("已付款的付款单不可以取消审核！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要取消审核？", "提示").then(() =>{
                this.common.postUrl("fcPayTF", "oneKeyCancelFcPayInfo", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消审核成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        printPayOrder(){
            let selectData = this.$refs.table.getSelectItem();
            let ids = [];
            let isDone = true;
            selectData.forEach(el => {
                if (enumData.FC_STS.DONE != el.state && enumData.FC_STS.PRINTED != el.state && enumData.FC_STS.PAYED != el.state){
                    isDone = false;
                }
                ids.push(el.id);
            })
            if(!isDone){
                this.$message.error("只有审核完毕和已完结的付款单才可以打印！");
                return false;
            }
            let item = {
                urlName: '打印付款单',
                urlId: "printPayOrderDetail" + new Date().getTime(),
                urlPathName: "/printPayOrderDetail",
                urlPath: "/pt/fc/receipts/print/payOrderDetail.vue",
                query: {ids},
            }
            this.$emit('openTab', item);
        },
        goto(item)
        {
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'confirmSupplierBillDetail_' + item.billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
                query: {fcSupplierBillId: item.billId},
            });
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
        payRegistNew(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一条需要付款登记的付款单！");
                return false;
            }
            let ids = [];
            let hasPayFee = 0;
            let noPayFee = 0;
            let payFee = 0;
            let hasRequestWriteoff = false;
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.PRINTED != selectData[i].state
                    && enumData.FC_STS.PAYED != selectData[i].state)
                {
                    this.$message.error("只有已完结/已付款的付款单才可以付款登记！");
                    return false;
                }
                if (enumData.FC_STS.CANCEL == selectData[i].state){
                    this.$message.error("取消的付款单不能付款登记！");
                    return false;
                }
                if(selectData[i].noPayFee==0){
                    this.$message.error("未付金额为0的付款单不能付款登记！");
                    return false;
                }
                ids.push(selectData[i].id);
                hasPayFee = this.common.accAdd(hasPayFee, selectData[i].hasPayFee);
                noPayFee = this.common.accAdd(noPayFee, selectData[i].noPayFee);
                payFee = this.common.accAdd(payFee, selectData[i].payFee);
                // if (selectData[i].payType == 3){
                //     hasRequestWriteoff = true;
                // }
            }
            if (hasRequestWriteoff)
            {
                this.$message.error("核销单不需进行付款登记！");
                return false;
            }

            this.disabledFee = ids.length > 1;//多条的不能输入金额
            this.info = this.common.copyObj(selectData[0]);
            this.info.ids = ids;
            this.info.payFee = payFee;
            this.info.hasPayFee = hasPayFee;
            this.info.noPayFee = noPayFee;
            this.info.fee = noPayFee;
            this.info.actualPayDate = new Date();
            this.showRegister(true);
        },
        showRegister(flag){
            this.registerShow = flag;
        },
        sureRegister(){
            let that = this;
            let param = this.common.copyObj(this.info);
            if (this.common.isBlank(param.fee))
            {
                this.$message.error("本次付款金额未填写！");
                return;
            }
            if(param.fee==0){
                this.$message.error("本次付款金额不能为0！");
                return;
            }
            if (this.common.isBlank(param.actualPayDate))
            {
                this.$message.error("实际付款日期未填写！");
                return;
            }
            if (param.fee > param.noPayFee)
            {
                this.$message.error("本次付款金额大于未付金额！");
                return;
            }
            this.common.postUrl("fcPayTF", "payRegist", this.info, function (){
                that.doQuery(that.query);
                that.$message.success("付款登记成功!");
                that.showRegister(false);
            },null,'',true);
        },
        cancelPayRegist(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一条需要取消付款登记的付款单！");
                return false;
            }
            let ids = [];
            let hasRequestWriteoff = false;
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.PAYED != selectData[i].state){
                    this.$message.error("只有已付款的付款单才可以付款登记！");
                    return false;
                }
                ids.push(selectData[i].id);
                if (selectData[i].payType == 3){
                    hasRequestWriteoff = true;
                }
            }
            if (hasRequestWriteoff)
            {
                this.$message.error("请返回请款单中进行取消付款登记操作！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要取消付款登记？", "提示").then(() =>{
                this.common.postUrl("fcPayTF", "cancelPayRegist", {ids:ids}, function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消付款登记成功!");
                },null,'',true);
            }).catch(() =>{});
        },
        async receiveReceipt(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0)
            {
                this.$message.error("请至少选择一条需要收单的付款单！");
                return false;
            }
            let ids=[];
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.INVALID == selectData[i].state){
                    this.$message.error("已作废的付款单不可以操作！");
                    return false;
                }
                if (selectData[i].state != enumData.FC_STS.DONE
                    && selectData[i].state != enumData.FC_STS.PRINTED
                    && selectData[i].state != enumData.FC_STS.PAYED){
                    this.$message.error("审核完的付款单才能收单！");
                    return false;
                }
                ids.push(selectData[i].id);
            }
            let param = {ids};
            let that = this;
            let data = await this.common.postUrl("fcPayTF", "getReceiveStates", param);
            if (data.receiveState == 0)
            {
                this.$prompt("您正在进行收单操作，是否继续?", "提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                    showInput: true,
                    closeOnClickModal: false,
                    distinguishCancelAndClose: true,
                    inputPlaceholder: '收单备注',
                    beforeClose:async function (action, instance, done)
                    {
                        param.receiveRemark = instance.inputValue;
                        if (action == 'confirm')
                        {
                            param.type = 1;
                            await this.common.postUrl("fcPayTF", "receiveReceiptById", param,null,null,'',true);
                            this.$message.success("收单成功！");
                            that.doQuery(that.query);
                        }
                        else if (action === 'cancel')
                        {
                            param.type = 2;
                            this.$message.info("取消收单操作！");
                            that.doQuery(that.query);
                        }
                        done();
                    }
                });
            }
            else
            {
                this.$confirm("是否<span style='color: red'>撤销</span>该收单操作？", "提示",{
                    confirmButtonText: '撤销',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                    dangerouslyUseHTMLString: true,
                }).then(() =>{
                    this.common.postUrl("fcPayTF", "cancelReceiveReceiptById", param, function ()
                    {
                        that.doQuery(that.query);
                        that.$message.success("撤销收单成功!");
                    },null,'',true);
                }).catch(() =>{});
            }
        },

        showRegisterDetail(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                // if (selectData[0].payType == 3)
                // {
                //     this.$message.error("请返回请款单中查看对应的付款明细！");
                //     return false;
                // }
                this.registerDetailShow = true;
                this.$nextTick(() => this.loadPayRecordList(selectData[0].id));
                this.info = this.common.copyObj(selectData[0]);
            } else {
                this.initInfo();
                this.registerDetailShow = false;
                this.doQuery(this.query);
            }
        },
        loadPayRecordList(id)
        {
            this.$refs.detailTable.load("requestServiceImpl", "loadPayRecordPage", {mainId: id, type: 2});
        },
        revokePay(item) {
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "撤销付款",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认撤销该付款记录？付款金额:" + item.fee),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
                center: true,
            }).then(() => {
                this.common.postUrl("fcPayTF", "revokePayById", {id: item.id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.loadPayRecordList(item.payId)
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        invalidFcPayInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要作废的付款单！");
                return false;
            }
            if (enumData.FC_STS.INVALID == selectData[0].state){
                this.$message.error("已作废的付款单不可以操作！");
                return false;
            }
            if (enumData.FC_STS.DONE != selectData[0].state&&enumData.FC_STS.PRINTED != selectData[0].state){
                this.$message.error("只有审核完毕和已完结的付款单才可以作废，其余请直接删除！");
                return false;
            }
            let param = {id:selectData[0].id,payNum:selectData[0].payNum};
            let that = this;
            this.$prompt("您正在进行作废操作，是否继续?", "提示",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '作废备注',
                beforeClose:async function (action, instance, done)
                {
                    param.invalidRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        await this.common.postUrl("fcPayTF", "invalidFcPayInfo", param,null,null,'',true);
                        this.$message.success("作废成功！");
                        that.doQuery(that.query);
                    }
                    else if (action === 'cancel')
                    {
                        this.$message.info("取消作废操作！");
                        that.doQuery(that.query);
                    }
                    done();
                }
            });

        },

    },
    computed:{
        formData(){
            return [
                {"name":"付款单号","placeholder":"请输入","model":"payNum","type":"input","isshow":true},
                {"name":"报销部门","placeholder":"请输入报销部门","model":"orgName","type":"input","isshow":true},
                {"name":"收款方","placeholder":"请输入收款方","model":"bankAccountName","type":"input","isshow":true},
                {"name":"开户行","placeholder":"请输入开户行","model":"bankDeposit","type":"input","isshow":true},
                {"name":"账号","placeholder":"请输入账号","model":"bankCard","type":"input","isshow":true},
                {"name":"部门制成","placeholder":"请输入部门制成","model":"createUserName","type":"input","isshow":true},
                {"name":"当前审核人","placeholder":"请输入当前审核人","model":"currentApplyUserName","type":"input","isshow":true},
                {"name":"付款单状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","clearable":true,multiple:true,"method":"doQuery","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"业务月份","model":"businessMonth","type":"month","isshow":true},
                {"name":"应付金额","placeholder":"请输入应付金额","model":"payFee","type":"input","isshow":true},
                {"name":"备注","placeholder":"备注","model":"remark","type":"input","isshow":true},
                {"name":"付款公司","model":"payTitle","type":"select","options":this.payTitleOptions,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"报销内容","model":"payProjectData","type":"cascader","options":this.treeData,"props": { checkStrictly: true,value: 'codeValue',label: 'codeName' },"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"收单状态","model":"receiveState","type":"select","options":this.receiveReceiptStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,multiple:true,"method":"doQuery","isshow":true},
                {"name":"收单备注","placeholder":"收单备注","model":"receiveRemark","type":"input","isshow":true},
                {"name":"预计支付日期","model":"expectDate","type":"daterange","isshow":true},
            ]
        }
    },
}
