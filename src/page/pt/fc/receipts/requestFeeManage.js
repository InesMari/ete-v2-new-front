import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'requestFeeManage',
    data()
    {
        return {
            head: [
                {"name": "请款单号", "code": "payNum", "width": "150", "type": "text"},
                {"name": "请款单状态", "code": "stateName", "width": "110", "type": "text"},
                {"name": "采购费用申请", "code": "applyNums", "width": "200", "type": "diy"},
                {"name": "付款单号", "code": "payNums", "width": "200", "type": "diy"},
                {"name": "收款方全称", "code": "bankAccountName", "width": "200", "type": "text"},
                {"name": "开户行", "code": "bankDeposit", "width": "180", "type": "text"},
                {"name": "账号", "code": "bankCard", "width": "180", "type": "text"},
                {"name": "请款公司", "code": "payTitleName", "width": "200", "type": "text"},
                {"name": "请款部门", "code": "orgName", "width": "180", "type": "text"},
                {"name": "用途", "code": "payProjectName", "width": "120", "type": "text"},
                {"name": "备注", "code": "payRemark", "width": "200", "type": "text"},
                {"name": "请款人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "请款金额", "code": "payFee", "width": "90", "type": "text"},
                {"name": "核销金额", "code": "writeOffFee", "width": "90", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "90", "type": "text"},
                {"name": "已付金额", "code": "hasPayFee", "width": "90", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "90", "type": "diy"},
                {"name": "未核销金额", "code": "noWriteOffFee", "width": "90", "type": "text"},
                {"name": "退款金额", "code": "refundFee", "width": "90", "type": "text"},
                {"name": "请款日期", "code": "createDate", "width": "120", "type": "text"},
                {"name": "核销状态", "code": "writeOffStateName", "width": "110", "type": "text"},
                {"name": "当前审核人", "code": "currentApplyUserName", "width": "150", "type": "text"},
                {"name": "收单状态", "code": "receiveStateName", "width": "150", "type": "text"},
                {"name": "收单人", "code": "receiveUserName", "width": "150", "type": "text"},
                {"name": "收单时间", "code": "receiveDate", "width": "150", "type": "text"},
                {"name": "收单备注", "code": "receiveRemark", "width": "150", "type": "text"},
                {"name": "作废人", "code": "invalidUserName", "width": "150", "type": "text"},
                {"name": "作废时间", "code": "invalidDate", "width": "150", "type": "text"},
                {"name": "作废备注", "code": "invalidRemark", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            stateData: [],
            writeOffStateData:[],
            symbolOptions: enumData.compareText,
            payTitleOptions:[],
            payProjectOptions:[],
            subTypeData:[],
            treeData:[],
            receiveReceiptStateData:[],
            registerShow: false,
            info:this.initInfo(),
            registerDetailShow: false,//付款明细
            detailHead: [
                {"name": "操作", "code": "caozuo", "width": "110", "type": "diy"},
                {"name": "本次付款金额", "code": "fee", "width": "110", "type": "text"},
                {"name": "实际付款日期", "code": "payDate", "width": "110", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "110", "type": "text"},
            ],
            payStateData: [],
            disabledFee: false,//是否禁用输入付款金额

            refundShow:false,
        }
    },
    async mounted()
    {
        await this.initData();
        await this.initHead();
        await this.enterDoQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async enterDoQuery(){
            if (this.$route.query.verifyStateFlag == 1){
                this.query.state = [String(enumData.FC_STS.WAIT), String(enumData.FC_STS.DOING)];
                this.query.currentApplyUserName = this.common.userInfo().userName;
            }//待办跳转
            await this.doQuery();
        },
        async initHead(){
            let heads = await this.common.postUrl("requestServiceImpl", "getAllBaseVerifyExt");
            let that = this;
            heads.forEach(el=>{
                that.head.push({"name":el.name,"code":el.code,"width": "200", "type": "text"});
            });
        },
        /**
         *
         */
        async doQuery(query=this.query)
        {
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
            let {items} = await this.$refs.table.load("requestServiceImpl", "loadRequestFeePage", this.query);
            items.forEach((el)=>{
                el.disabled = (el.payState == 2&&el.receiveState==1)||el.state==enumData.FC_STS.INVALID;
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
            // 防止渲染异步
            this.$nextTick(()=>{
                this.isQuery = false;
            });
        },
        /**
         * 初始化查询条件
         * @returns
         */
        initQuery(query=this.query)
        {
            this.query=query;
            this.query = {
                payNum: '',
                orgName: '',
                bankAccountName:'',
                createUserName: '',
                remark:'',
                state: [],
                payTitle:'',
                currentApplyUserName:'',
                payState:'',
            };
            return this.query;
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
        /**
         * 初始化静态数据
         */
        async initData()
        {
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_STATE"});
            this.writeOffStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
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
        async openRequest(data)
        {
            this.$emit("openTab",{
                query: data,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        /**
         * 跳转采购申请明细
         * @param param
         * @returns {Promise<void>}
         */
        async toDetail(param, code, index) {

            if (code == 'applyNums') {
                let id = param.applyIdArray[index];
                if (param.feeApplySrc == 2) {
                    this.$emit("openTab", {
                        query: {id: id},
                        urlId: "paymentPlanDetail" + id,
                        urlName: "查看费用清单",
                        urlPathName: "/paymentPlanDetail",
                        urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"
                    });
                } else {
                    await this.openRequest({
                        urlId: "purchaseDetail" + id,
                        urlName: '查看采购费用申请',
                        urlPathName: '/purchaseDetail',
                        id: id,
                        urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue",
                    });
                }
            } else if (code == 'payNums') {
                let id = param.payIdArray[index];
                await this.openRequest({
                    urlName: '查看付款单',
                    urlId: "payOrderDetail" + id,
                    urlPathName: "/payOrderDetail",
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                    id: id,
                    type: 0
                });
            }
        },
        /**
         * 双击查看
         * @param data
         * @returns {Promise<void>}
         */
        async dblclickItem(data)
        {
            let param = this.common.copyObj(data);
            param.urlId = "requestFeeDetail" + param.id;
            param.urlName = "查看请款单";
            param.urlPathName = "/requestFeeDetail";
            param.type = 0;
            param.urlPath = "/pt/fc/receipts/detail/requestFeeDetailMain.vue";
            await this.openRequest(param);
        },
        /**
         * 新增请款
         * @returns {Promise<void>}
         */
        async addRequest()
        {
            let data = {
                type: 1,
                urlId: new Date().getTime(),
                urlName: '新增请款单',
                urlPathName: '/addReq',
                urlPath: "/pt/fc/receipts/add/addRequestFee.vue",
            }
            await this.openRequest(data);
        },
        async copyAddRequest() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要复制新增的付款单！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            param.urlId = "copy" + param.id;
            param.urlName = "新增请款单";
            param.urlPathName = "/copy";
            param.type = 2;
            param.isCopy = 1;
            param.urlPath = "/pt/fc/receipts/add/addRequestFee.vue";
            await this.openRequest(param);
        },
        /**
         * 修改请款
         * @returns {Promise<boolean>}
         */
        async updateRequest()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要需要修改的请款单！");
                return false;
            }
            if (!(enumData.FC_STS.WAIT == selectData[0].state
                    || enumData.FC_STS.DOING == selectData[0].state
                    || enumData.FC_STS.NOT == selectData[0].state))
            {
                this.$message.error("只有未审核、审核中或审核不通过的请款单才可以修改！");
                return false;
            }
            // if (this.common.userInfo().userId != selectData[0].createUserId)
            // {
            //     this.$message.error("只有请款人自己才可以修改！");
            //     return false;
            // }
            let param = this.common.copyObj(selectData[0]);
            param.urlId = "update" + param.id;
            param.urlName = "修改请款单";
            param.urlPathName = "/update";
            param.type = 2;
            param.isUpdate = 1;
            param.urlPath = "/pt/fc/receipts/add/addRequestFee.vue";
            await this.openRequest(param);
        },
        /**
         * 审核校验
         * @returns {Promise<boolean>}
         */
        async verify()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的请款单！");
                return false;
            }
            if (!(enumData.FC_STS.WAIT == selectData[0].state || enumData.FC_STS.DOING == selectData[0].state))
            {
                this.$message.error("只有未审核或审核中的请款单才可以审核！");
                return false;
            }
            if (!selectData[0].verifyFlag)
            {
                this.$message.error("您不是该请款单的当前审核人！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            param.urlId = "verify" + param.id;
            param.urlName = "审核请款单";
            param.urlPathName = "/verify";
            param.type = 3;
            param.urlPath = "/pt/fc/receipts/detail/requestFeeDetailMain.vue";
            await this.openRequest(param);
        },
        cancelRequest(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要取消审核的请款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT == selectData[0].state)
            {
                this.$message.error("未审核的请款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.PRINTED == selectData[0].state||enumData.FC_STS.PAYED == selectData[0].state)
            {
                this.$message.error("已完结的请款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.CANCEL == selectData[0].state)
            {
                this.$message.error("取消的请款单不能取消审核！");
                return false;
            }
            if (enumData.FC_STS.PRINTED == selectData[0].state||enumData.FC_STS.PAYED == selectData[0].state)
            {
                this.$message.error("已完结的请款单不能取消审核！");
                return false;
            }
            if(selectData[0].receiveState==1){
                this.$message.error("已收单的请款单不可以取消审核！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要取消审核？", "提示").then(() =>{
                this.common.postUrl("requestServiceImpl", "cancelVerifyRequestFeeById", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消审核成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         * 打印
         * @returns {Promise<boolean>}
         */
        async printRequest()
        {
            let selectData = this.$refs.table.getSelectItem();
            let isDone = true;
            selectData.forEach(el => {
                if (!(el.state == enumData.FC_STS.DONE || el.state == enumData.FC_STS.PRINTED || el.state == enumData.FC_STS.PAYED))
                {
                    isDone = false;
                }
            })
            if(!isDone){                
                this.$message.error("只有审核完毕和已完结的请款单才可以打印！");
                return;
            }
            let obj = {
                selectData:this.common.copyObj(selectData)
            }
            this.$emit("openTab",{
                query: obj,
                urlId: "print" + new Date().getTime(),
                urlName: "打印请款单",
                urlPathName: "/print",
                urlPath: "/pt/fc/receipts/print/requestFeePrintDetail.vue"
            });
        },
        /**
         * 取消请款单
         * @returns {Promise<boolean>}
         */
        async deleteRequest()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的请款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT != selectData[0].state
                    && enumData.FC_STS.NOT != selectData[0].state
                    && enumData.FC_STS.DOING != selectData[0].state)
            {
                this.$message.error("只有未审核、审核不通过或者审核中的请款单才可以删除！");
                return false;
            }
            if (enumData.FC_STS.CANCEL == selectData[0].state)
            {
                this.$message.error("已删除，请勿重复操作！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有请款人自己才可以取消！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("requestServiceImpl", "deleteRequestFeeById", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         * 核销请款单
         * type 1 合单核销  2 分单核销
         * @returns {Promise<boolean>}
         */
        async writeOffRequest(type) {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一条需要核销的请款单！");
                return false;
            }
            if (type == 2){
                if (selectData.length > 3) {
                    this.$message.error("最多只能选择3条请款单！");
                    return false;
                }
            }
            let ids = new Array();
            let payTitle = selectData[0].payTitle;
            let bankCard = selectData[0].bankCard;
            let payProjectSet = new Set();
            for (let i = 0; i < selectData.length; i++)
            {
                if (enumData.FC_STS.PRINTED != selectData[i].state&&enumData.FC_STS.PAYED!= selectData[i].state)
                {
                    this.$message.error("只有已完结的请款单才可以核销！");
                    return false;
                }
                if(selectData[i].writeOffState==1){
                    this.$message.error("只有未核销的请款单才可以核销！");
                    return false;
                }
                if(selectData[i].payState != 2){
                    this.$message.error("只有全部登记付款的请款单才可以核销！");
                    return false;
                }
                if (enumData.FC_STS.CANCEL == selectData[i].state)
                {
                    this.$message.error("取消的请款单不能核销！");
                    return false;
                }
                if(payTitle!=selectData[i].payTitle){
                    this.$message.error("结算主体不一致不能一起核销！");
                    return false;
                }
                if(bankCard.trim()!=selectData[i].bankCard.trim()){
                    this.$message.error("收款账户不一致不能一起核销！");
                    return false;
                }
                ids.push(selectData[i].id);
                payProjectSet.add(selectData[i].payProject);
            }
            if(type==1){
                if(payProjectSet.size>3){
                    this.$message.error("一次核销的项目类型不能超过3个！");
                    return false;
                }
            }
            //
            //
            // let that = this;
            // this.$confirm("确定需要核销？", "提示").then(() =>{
            //     this.common.postUrl("requestServiceImpl", "writeOffFcPayReqInfo", selectData[0], function ()
            //     {
            //         that.doQuery(that.query);
            //         that.$message.success("核销成功!");
            //     });
            // }).catch(() =>{});
            let str = ids.join(",")

            this.$emit("openTab",{
                query: {ids:str,type:type},
                urlId: new Date().getTime(),
                urlName: '核销生成付款单',
                urlPathName: '/addPayOrder',
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue"});
        },

        refundConfirm(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要退款核销的请款单！");
                return false;
            }
            if (enumData.FC_STS.PAYED!= selectData[0].state)
            {
                this.$message.error("只有已付款的请款单才可以退款核销！");
                return false;
            }
            if(selectData[0].writeOffState==1){
                this.$message.error("只有未核销的请款单才可以退款核销！");
                return false;
            }
            if (enumData.FC_STS.CANCEL == selectData[0].state)
            {
                this.$message.error("取消的请款单不能退款核销！");
                return false;
            }
            if(selectData[0].hasPayFee<=0){
                this.$message.error("还未进行支付，不能进行退款核销！");
                return false;
            }
            let fee = this.common.accSub(selectData[0].hasPayFee,selectData[0].writeOffFee);
            fee = this.common.accSub(fee,selectData[0].refundFee);
            if(fee<=0){
                this.$message.error("已付金额减去核销金额以及退款金额等于0，不能进行退款核销！");
                return false;
            }

            this.info = this.common.copyObj(selectData[0]);
            this.info.fee1 = fee;
            this.$forceUpdate();
            this.showRefund(true);
        },
        sureRefund(){
            if (this.common.isBlank(this.info.fee1))
            {
                this.$message.error("本次核销确认金额未填写！");
                return;
            }
            let that = this;
            this.$confirm("确定需要核销确认，核销确认以后，核销确认的金额需要退款，是否确认？", "提示").then(() =>{
                this.common.postUrl("requestServiceImpl", "refundConfirm", this.info, function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("核销确认成功!");
                    that.showRefund(false);
                },null,'',true);
            }).catch(() =>{});
        },
        showRefund(flag){
            this.refundShow = flag;
            this.$forceUpdate();
        },
        payRegist(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一条需要付款登记的请款单！");
                return false;
            }
            let ids = [];
            let hasPayFee = 0;
            let noPayFee = 0;
            let payFee = 0;
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.PRINTED != selectData[i].state
                    && enumData.FC_STS.PAYED != selectData[i].state)
                {
                    this.$message.error("只有已完结/已付款的请款单才可以付款登记！");
                    return false;
                }
                if (enumData.FC_STS.CANCEL == selectData[i].state){
                    this.$message.error("取消的请款单不能付款登记！");
                    return false;
                }
                if(selectData[i].payState==2){
                    this.$message.error("全部付款的请款单不能付款登记！");
                    return false;
                }
                ids.push(selectData[i].id);
                hasPayFee = this.common.accAdd(hasPayFee, selectData[i].hasPayFee);
                noPayFee = this.common.accAdd(noPayFee, selectData[i].noPayFee);
                payFee = this.common.accAdd(payFee, selectData[i].payFee);
            }
            //多条的时候全部一起付款完毕，单条的可以付款部分金额
            let that = this;
            // if (selectData.length > 1)
            // {
            //     this.$confirm("确定需要付款登记？", "提示",{
            //         center: true,
            //     }).then(() =>{
            //         this.common.postUrl("requestServiceImpl", "payRegist", {ids:ids}, function ()
            //         {
            //             that.doQuery(that.query);
            //             that.$message.success("付款登记成功!");
            //         },null,'',true);
            //     }).catch(() =>{});
            // }
            // else
            // {
                this.disabledFee = ids.length > 1;//多条的不能输入金额
                this.info = this.common.copyObj(selectData[0]);
                this.info.ids = ids;
                this.info.payFee = payFee;
                this.info.hasPayFee = hasPayFee;
                this.info.noPayFee = noPayFee;
                this.info.fee = noPayFee;
                this.info.actualPayDate = this.common.formatDate.getDate();
                this.$forceUpdate();
                this.showRegister(true);
            // }
        },
        async sureRegister()
        {
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
            await this.common.postUrl("requestServiceImpl", "payRegist", param,null,null,'',true);
            this.doQuery(this.query);
            this.showRegister(false);
            this.$message.success("付款成功!");
        },
        cancelPayRegist(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一条需要取消付款登记的请款单！");
                return false;
            }
            let ids = [];
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.PAYED != selectData[i].state){
                    this.$message.error("只有已付款的请款单才可以取消付款登记！");
                    return false;
                }
                ids.push(selectData[i].id);
            }
            let that = this;
            this.$confirm("确定需要取消付款登记？", "提示",{
                center: true,
            }).then(() =>{
                this.common.postUrl("requestServiceImpl", "cancelPayRegist", {ids:ids}, function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消付款登记成功!");
                },null,'',true);
            }).catch(() =>{});
        },
        invalidRequestFeeById(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要作废的请款单！");
                return false;
            }
            if (enumData.FC_STS.INVALID == selectData[0].state){
                this.$message.error("已作废的请款单不可以操作！");
                return false;
            }
            if (enumData.FC_STS.DONE != selectData[0].state&&enumData.FC_STS.PRINTED != selectData[0].state){
                this.$message.error("只有审核完毕和已完结的请款单才可以作废，其余请直接删除！");
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
                        await this.common.postUrl("requestServiceImpl", "invalidRequestFeeById", param,null,null,'',true);
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
        async receiveReceipt(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length ==0)
            {
                this.$message.error("请至少选择一条需要收单的请款单！");
                return false;
            }
            let ids=[];
            for (let i = 0; i < selectData.length; i++) {
                if (enumData.FC_STS.INVALID == selectData[i].state){
                    this.$message.error("已作废的请款单不可以操作！");
                    return false;
                }
                if (selectData[i].state != enumData.FC_STS.DONE
                    && selectData[i].state != enumData.FC_STS.PRINTED
                    && selectData[i].state != enumData.FC_STS.PAYED){
                    this.$message.error("审核完的请款单才能收单！");
                    return false;
                }
                ids.push(selectData[i].id);
            }
            let param = {ids};
            let that = this;
            let data = await this.common.postUrl("requestServiceImpl", "getReceiveStates", param);
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
                            await this.common.postUrl("requestServiceImpl", "receiveReceiptById", param,null,null,'',true);
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
                    this.common.postUrl("requestServiceImpl", "cancelReceiveReceiptById", param, function ()
                    {
                        that.doQuery(that.query);
                        that.$message.success("撤销收单成功!");
                    },null,'',true);
                }).catch(() =>{});
            }
        },
        showRegister(flag){
            this.registerShow = flag;
        },
        showRegisterDetail(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
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
            this.$refs.detailTable.load("requestServiceImpl", "loadPayRecordPage", {mainId: id, type: 1});
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
                this.common.postUrl("requestServiceImpl", "revokePayById", {id: item.id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.loadPayRecordList(item.payId)
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
        oneKeyCancelFcPayReqInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1){
                this.$message.error("请选择一条需要取消审核的请款单！");
                return false;
            }
            if (enumData.FC_STS.WAIT == selectData[0].state){
                this.$message.error("未审核的请款单不可以取消审核！");
                return false;
            }
            if(selectData[0].receiveState==1){
                this.$message.error("已收单的请款单不可以取消审核！");
                return false;
            }
            if (enumData.FC_STS.PAYED == selectData[0].state){
                this.$message.error("已付款的请款单不可以取消审核！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要取消审核？", "提示").then(() =>{
                this.common.postUrl("requestServiceImpl", "oneKeyCancelFcPayReqInfo", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("取消审核成功!");
                },null,'',true);
            }).catch(() =>{})
        },
    },
    computed:{
        formData(){
            return [
                {"name":"请款单号","placeholder":"请输入请款单号","model":"payNum","type":"input","isshow":true},
                {"name":"请款部门","placeholder":"请输入请款部门","model":"orgName","type":"input","isshow":true},
                {"name":"收款方","placeholder":"请输入收款方","model":"bankAccountName","type":"input","isshow":true},
                {"name":"开户行","placeholder":"请输入开户行","model":"bankDeposit","type":"input","isshow":true},
                {"name":"账号","placeholder":"请输入账号","model":"bankCard","type":"input","isshow":true},
                {"name":"请款人","placeholder":"请输入请款人","model":"createUserName","type":"input","isshow":true},
                {"name":"当前审核人","placeholder":"请输入当前审核人","model":"currentApplyUserName","type":"input","isshow":true},
                {"name":"请款单状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","clearable":true,multiple:true,"method":"doQuery","isshow":true},
                {"name":"核销状态","model":"writeOffState","type":"select","options":this.writeOffStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"请款金额","placeholder":"请输入请款金额","model":"payFee","type":"input","isshow":true},
                {"name":"备注","placeholder":"备注","model":"remark","type":"input","isshow":true},
                {"name":"请款公司","model":"payTitle","type":"select","options":this.payTitleOptions,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"报销内容","model":"payProjectData","type":"cascader","options":this.treeData,"props": { checkStrictly: true,value: 'codeValue',label: 'codeName' },"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"收单状态","model":"receiveState","type":"select","options":this.receiveReceiptStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,multiple:true,"method":"doQuery","isshow":true},
                {"name":"收单备注","placeholder":"收单备注","model":"receiveRemark","type":"input","isshow":true},
            ]
        }
    },
}
