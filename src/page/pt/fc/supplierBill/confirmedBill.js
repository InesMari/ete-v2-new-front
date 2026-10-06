import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'confirmedBill',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "text"},
                {"name": "附件", "code": "imgUrl", "width": "120", "type": "diyColorTd"},
                {"name": "付款单号", "code": "payNums", "width": "200", "type": "diy"},
                {"name": "账单月份", "code": "billMonth", "width": "90", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "90", "type": "text"},
                {"name": "是否生成付款单", "code": "isGeneratePayName", "width": "90", "type": "text"},
                // {"name": "发票提交状态", "code": "supplyInvoiceStateName", "width": "90", "type": "text"},
                // {"name": "发票提交金额", "code": "supplyInvoiceFee", "width": "90", "type": "text"},
                {"name": "核销金额", "code": "writeoffFee", "width": "90", "type": "text"},
                //{"name": "审核通过金额", "code": "verifyInvoiceFee", "width": "90", "type": "text"},
                //{"name": "未审核发票金额", "code": "noVerifyInvoiceFee", "width": "90", "type": "text"},
                //{"name": "审核不通过金额", "code": "verifyOutInvoiceFee", "width": "90", "type": "text"},
                {"name": "应付金额", "code": "payableFee", "width": "90", "type": "text"},
                {"name": "已付金额", "code": "payFee", "width": "90", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "90", "type": "text"},
                {"name": "账单备注", "code": "remark", "width": "180", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "confirmUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "confirmDate", "width": "150", "type": "text"}
            ],
            detailHead:[
                {"name": "发票提交编号", "code": "submitInvoiceNum", "width": "110", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "开户名字", "code": "bankAccountName", "width": "110", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "120", "type": "text"},
                {"name": "发票类型", "code": "invoiceType", "width": "110", "type": "text"},
                {"name": "发票金额(含税)", "code": "invoiceFee", "width": "90", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "90", "type": "text"},
                {"name": "发票号", "code": "invoiceNum", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "180", "type": "text"},
                {"name": "提交人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "提交时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
            ],
            supplyInvoiceStateData: [],//发票提交状态
            supplierBankData:[],//供应商银行卡信息
            query: this.initQuery(this.$route.query.supplierId, this.$route.query.billNum),//初始化查询条件
            invoiceShow:false,//展示发票提交
            showSupplyInvoiceSingle: false,//是否展示发票申请单个
            title:'',//发票提交弹出框title 跟修改一起的页面
            billInfo:{},
            billInvoiceData: [],

            // submitInvoiceTypeData:[],
            invoiceTypeData:[],
            verifyStateData:[],
            bigImgList:[],//显示大图数组
            isShowBigImg:false,//是否展示大图

            upInvoiceDetailDialog:false,
            billNum:'',
            queryDetail:{},
            srcList: [],

            writeoffTitle:'',
            writeoffShow:false,

            regionData:[],
            allOrgData:[],
            orgData:[],

            supplierData:[],
            settleBodyData:[],
            whetherData:[],
        }
    },
    mounted() {
		this.init();
        this.initSupplierData();
        this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
        myFileModel,
        fileViewer,
        searchList
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'SUPPLY_INVOICE_STATE,VERIFY_STATE,INVOICING_COMPANY,WHETHER'}, function (data) {
                that.supplyInvoiceStateData = data.SUPPLY_INVOICE_STATE;
                that.verifyStateData = data.VERIFY_STATE;
                that.settleBodyData = data.INVOICING_COMPANY;
                that.whetherData = data.WHETHER;
            });
            this.initInvoiceTypeData();
            this.regionData = await this.common.postUrl("regionOrgTF", "queryRegionSelect", {});
            this.allOrgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.orgData=this.common.copyObj(this.allOrgData);
        },
        initSupplierData(){
            let that = this;
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
        },
        changeRegion(query=this.query) {
            this.query=query;
            this.orgData=[];
            if(this.query.regionId>0){
                for (let i = 0; i < this.allOrgData.length; i++) {
                    if(this.allOrgData[i].regionId==this.query.regionId){
                        this.orgData.push(this.allOrgData[i]);
                    }
                }
            }
            this.doQuery();
        },
        initInvoiceTypeData(){
            let that = this;
            this.common.postUrl('fcSupplierBillTF','queryInvoiceTypeData',{},function (data) {
                that.invoiceTypeData = data;
            });
        },
        initBankData(supplierTenantId){
            let that = this;
            that.supplierBankData = [];
            that.setBank();
            this.common.postUrl("fcSupplierBillTF", "querySupplierBankDataNoPage", {supplierTenantId}, function (data) {
                if(data){
                    that.supplierBankData = data;
                    that.setBank(that.supplierBankData[0]);
                }
            });
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, applyInvoiceState: string, tenantId: string, confirmState: number, billNum: string}}
         */
        initQuery(supplierId, billNum) {
            return this.query = {
                billNum: this.common.isNotBlank(billNum) ? billNum : '',
                billMonths: [],
                supplierTenantIds: this.common.isBlank(supplierId) ? [] : [Number.parseInt(supplierId)],
                supplyInvoiceState: '',
                regionId:'',
                orgId:'',
                isGeneratePay:null,
                payNum:'',
            };
        },

        /**
         * 查询列表
         */
        doQuery(query=this.query) {
            this.query=query;
			this.$refs.table.load("fcSupplierBillTF", "queryConfirmedFcSupplierBillInfo", this.query);
        },
        /**
         * 打开发票提交
         * @param flag
         */ async showInvoice(flag) {
            if (flag) {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1) {
                    this.$message.error("请选择一条需要提交发票的账单！");
                    return false;
                }
                if (selectItem[0].supplyInvoiceState == enumData.APPLY_INVOICE_STATE.ALL_APPLY) {
                    this.$message.error("账单金额已经全部提交发票！");
                    return false;
                }
                this.billInfo = this.common.copyObj(selectItem[0]);
                this.title = "账单编号【" + selectItem[0].billNum + "】发票提交";
                this.showSupplyInvoiceSingle = false;
                // this.billInvoiceData=[this.initBillInvoice()];
                //初始化银行卡
                this.initBankData(selectItem[0].supplierTenantId);
                //初始化所有未开票的金额，按照税点来
                let that = this;
                await this.common.postUrl("fcSupplierBillTF", "queryAllNoSupplyInvoiceFee", {fcSupplierBillId:selectItem[0].id}, function (data) {
                    that.billInvoiceData = data;
                    for (let i = 0; i < that.billInvoiceData.length; i++) {
                        that.billInvoiceData[i].order = i + 1;
                        that.billInvoiceData[i].parentOrder = -1;
                        that.billInvoiceData[i].rows = 1;
                        that.billInvoiceData[i].addFlag = 1;
                    }
                });

            }
            this.invoiceShow = flag;
        },

        async showWriteoff(flag) {
            if (flag) {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1) {
                    this.$message.error("请选择一条需要手动核销的账单！");
                    return false;
                }
                let item = selectItem[0];
                //应付金额+核销金额
                let total = item.payableFee;
                let flag = false;
                if (item.writeoffFee > 0)
                {
                    //+核销金额
                    total = this.common.accAdd(total,item.writeoffFee);
                    flag = true;
                }
                this.billInfo = this.common.copyObj(item);
                this.writeoffTitle = "账单编号【" + item.billNum + "】手动核销";
                //初始化所有未开票的金额，按照税点来
                let that = this;
                await this.common.postUrl("fcSupplierBillTF", "queryAllNoSupplyInvoiceFee", {fcSupplierBillId:item.id}, function (data) {
                    that.billInvoiceData = data;
                });
            }
            this.writeoffShow = flag;
        },
        showModifyInvoice(flag){
            if (flag){
                let selectItem1 = this.$refs.table.getSelectItem();
                let selectItem = this.$refs.detailTable.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条需要修改的发票明细！");
                    return false;
                }
                if(selectItem[0].verifyState==1){
                    this.$message.error("审核通过的发票明细不允许修改！");
                    return false;
                }

                this.billInfo = Object.assign({},selectItem1[0], selectItem[0]);
                this.billInfo.id = selectItem[0].id;
                this.billInfo.submitInvoiceType = this.billInfo.submitInvoiceType+'';

                this.submitInvoiceType = this.billInfo.submitInvoiceType;
                this.invoiceFee = this.billInfo.invoiceFee;

                this.billInfo.invoiceType = this.billInfo.invoiceType+'';
                this.title = "账单编号【"+this.billInfo.billNum+"】修改发票";
                this.showSupplyInvoiceSingle = true;
                //初始化银行卡
                let that = this;
                this.$nextTick(() => {
                    that.initBankData(that.billInfo.supplierTenantId);
                    if(that.billInfo.invoiceImgId){
                        that.$refs.invoiceInfo.initDate(that.billInfo.invoiceImgId);
                    }
                })
            }else{
                this.$refs.invoiceInfo.clean();
            }
            this.invoiceShow = flag;
        },

        selBank(){
            this.setBank();
            for (let i = 0; i < this.supplierBankData.length; i++) {
                let bankInfo = this.supplierBankData[i];
                if(this.billInfo.receiveBankId==bankInfo.receiveBankId){
                    this.setBank(bankInfo);
                    break;
                }
            }
            this.$forceUpdate();
        },
        setBank(bankInfo){
            if(bankInfo){
                this.billInfo.receiveBankId = bankInfo.receiveBankId;
                this.billInfo.receiveUserId = bankInfo.receiveUserId;
                this.billInfo.bankNum = bankInfo.bankNum;
                this.billInfo.bankName = bankInfo.bankName;
                this.billInfo.branchName = bankInfo.branchName;
                this.billInfo.receiveUserIdCard = bankInfo.receiveUserIdCard;
            }else{
                // this.billInfo.receiveBankId = '';
                this.billInfo.receiveUserId = '';
                this.billInfo.bankNum = '';
                this.billInfo.bankName = '';
                this.billInfo.branchName = '';
                this.billInfo.receiveUserIdCard = '';
            }
        },
        querySearch(queryString, cb) {
            var invoiceTypeData = this.invoiceTypeData;
            var results = queryString ? invoiceTypeData.filter(this.createFilter(queryString)) : invoiceTypeData;
            cb(results);
        },
        createFilter(queryString) {
            return (invoiceType) => {
                return (invoiceType.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        /**
         * 返回发票申请对象
         * @returns {{invoiceType: string, applyInvoiceFee: string, invoiceTax: string, remark: string, applyInvoiceType: string}}
         */
        initBillInvoice()
        {
            return {
                invoiceType: '',
                invoiceTax: '9',
                invoiceFee: '',
                remark: '',
                invoiceNum:'',
            }
        },
        /**
         * 增加账单发票申请明细
         */
        addItem(item,index)
        {
            //后台数据
            let parentOrder = item.order;
            if(item.parentOrder!=-1){
                parentOrder = item.parentOrder;
            }
            for (let i = 0; i < this.billInvoiceData.length; i++) {
                if(this.billInvoiceData[i].order==parentOrder){
                    this.billInvoiceData[i].rows++;
                    break;
                }
            }
            this.billInvoiceData[index].addFlag = 0;
            let data = {
                invoiceType: '',
                invoiceTax: item.invoiceTax,
                parentOrder:parentOrder,
            }
            this.billInvoiceData.splice(index+1,0,data);
            this.billInvoiceData[index+1].addFlag = 1;
        },
        /**
         * 移除账单发票申请明细
         * @param index
         */
        removeItem(index)
        {
            for (let i = 0; i < this.billInvoiceData.length; i++) {
                if(this.billInvoiceData[i].order==this.billInvoiceData[index].parentOrder){
                    this.billInvoiceData[i].rows--;
                    break;
                }
            }
            let that  = this;
            if(this.billInvoiceData[index].invoiceImgId){
                eval("that.$refs.businessLicense" + index + "[0].clean()");
            }
            if(this.billInvoiceData[index].addFlag==1){
                this.billInvoiceData[index-1].addFlag = 1;
            }

            if (this.billInvoiceData.length > 1)
            {
                this.billInvoiceData.splice(index, 1);
            }
            else
            {
                this.$message.error("至少需要一条开票申请数据！");
                return false;
            }
        },
        checkWriteoffFee(item){
            if(item.writeoffFee&&item.writeoffFee>item.maxInvoiceFee){
                this.$message.error("本次核销金额不能大于需交票金额！");
                return false;
            }
            return true;
        },
        checkInvoiceFee(item){
            let parentOrder = item.parentOrder;
            if(parentOrder==-1){
                parentOrder = item.order;
            }
            this.checkInvoicFeeByParentOrder(parentOrder);
        },
        checkInvoicFeeByParentOrder(parentOrder){
            let maxInvoiceFee = 0;
            let sumInvoiceFee = 0;
            for (let i = 0; i < this.billInvoiceData.length; i++) {
                if(this.billInvoiceData[i].order==parentOrder){
                    maxInvoiceFee = this.billInvoiceData[i].maxInvoiceFee;
                    sumInvoiceFee = this.common.accAdd(sumInvoiceFee,this.billInvoiceData[i].invoiceFee);
                }
                if(this.billInvoiceData[i].parentOrder==parentOrder){
                    sumInvoiceFee = this.common.accAdd(sumInvoiceFee,this.billInvoiceData[i].invoiceFee);
                }
            }
            if(sumInvoiceFee>maxInvoiceFee){
                this.$message.error("第"+parentOrder+"项的本次交票金额之和大于需交票金额（含税）");
                return false;
            }
            return true;
        },
        /**
         * 发票提交
         */
        sureSubmit()
        {
            let that = this;
            this.billInfo.fcSupplierBillId = this.billInfo.id;
            this.billInfo.invoiceList = [];

            for(let i = 0; i < this.billInvoiceData.length; i++) {
                let data = this.billInvoiceData[i];
                if (data.parentOrder == -1) {
                    if(!this.checkInvoicFeeByParentOrder(data.order)){
                        return;
                    }
                    if(data.rows>1&&!data.invoiceFee){
                        this.$message.error("请输入第" + data.order + "项的本次交票金额！");
                        return false;
                    }
                } else {
                    if(!data.invoiceFee){
                        this.$message.error("请输入第" + data.parentOrder + "项的本次交票金额！");
                        return false;
                    }
                }
                if(data.invoiceFee){
                    this.billInfo.invoiceList.push(data);
                }
            }

            this.common.postUrl("fcSupplierBillTF", "batchAddFcSubmitInvoice", this.billInfo, function (data)
            {
                that.$message.success("发票提交成功！");
                that.doQuery();
                that.showInvoice(false);
                for(let i = 0; i < that.billInvoiceData.length; i++) {
                    eval("that.$refs.businessLicense" + i + "[0].clean()");
                }
            },null,'',true);
        },
        submitWriteoff(){
            let that = this;
            this.billInfo.fcSupplierBillId = this.billInfo.id;
            this.billInfo.writeoffList = [];

            for(let i = 0; i < this.billInvoiceData.length; i++) {
                let data = this.billInvoiceData[i];
                if(!this.checkWriteoffFee(data)){
                    return;
                }
                if(data.writeoffFee){
                    this.billInfo.writeoffList.push(data);
                }
            }

            this.common.postUrl("fcSupplierBillTF", "writeoffFcSupplierBillInfo", this.billInfo, function (data)
            {
                that.$message.success("手动核销成功！");
                that.doQuery();
                that.showWriteoff(false);
            },null,'',true);
        },

        /**
         * 修改发票
         */
        sureUpdate()
        {
            let that = this;
            this.billInfo.invoiceImgId = this.$refs.invoiceInfo.getImageData().flowId;
            this.billInfo.invoiceImgPath = this.$refs.invoiceInfo.getImageData().storePath;
            this.common.postUrl("fcSubmitInvoiceTF", "updateFcSubmitInvoice", this.billInfo, function (data)
            {
                that.$message.success("修改发票成功！");
                that.loadBillInvoiceDetail();
                that.showModifyInvoice(false);
            },null, null, true);
        },
        /**
         * 是否打开发票明细
         * @param flag
         */
        showUpInvoiceDetailDialog(flag)
        {
            if (flag)
            {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条需要查看发票明细的账单！");
                    return false;
                }
                this.upInvoiceDetailDialog = flag;//渲染表格
                this.billNum = selectItem[0].billNum;
                this.queryDetail.fcSupplierBillId = selectItem[0].id;
                this.$nextTick(() => this.loadBillInvoiceDetail())
            }
            else
            {
                this.doQuery();
            }
            this.upInvoiceDetailDialog = flag;
        },
        /**
         * 加载账单开票明细
         */
        loadBillInvoiceDetail()
        {
            this.$refs.detailTable.load("fcSubmitInvoiceTF", "queryFcSubmitInvoice", this.queryDetail);
        },
        /**
         * 显示发票
         */
        viewInvoice(){
            let selectItem = this.$refs.detailTable.getSelectItem();
            if (selectItem.length !== 1)
            {
                this.$message.error("请选择一条需要查看发票的明细数据！");
                return false;
            }
            let data = selectItem[0];
            if(!data.invoiceImgUrl){
                this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(data.invoiceImgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 发票撤销
         */
        revokeBillInvoice()
        {
            let selectItem = this.$refs.detailTable.getSelectItem();
            if (selectItem.length < 1)
            {
                this.$message.error("请至少选择一条需要撤销的发票明细！");
                return false;
            }
            let ids = [];
            let submitInvoiceNums = '';
            for (let i = 0; i < selectItem.length; i++) {
                let data = selectItem[i];
                if (data.invoicePayFee>0)
                {
                    this.$message.error("无法撤销已经付款的发票提交信息!");
                    return false;
                }
                ids.push(data.id);
                submitInvoiceNums += ','+data.submitInvoiceNum;
            }
            submitInvoiceNums.substring(1);
            let that = this;
            that.$confirm("确定需要撤销该发票？", "提示").then(() =>{
                that.common.postUrl("fcSubmitInvoiceTF", "delFcSubmitInvoice", {ids,submitInvoiceNums}, function (data)
                {
                    that.loadBillInvoiceDetail();
                    that.$message.success("发票撤销成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         *图片上传回调
         */
        imgCallback(data){
            this.billInvoiceData[data.componentId].invoiceImgFullPath = data.fullPath;
            this.billInvoiceData[data.componentId].invoiceImgPath = data.storePath;
            this.billInvoiceData[data.componentId].invoiceImgId = data.flowId;
            this.$forceUpdate();
        },
        /**
         * 显示大图
         */
        showBigImg(img){
            let img_big = this.common.getBigImgPath(img);
            this.srcList = [img_big];
            this.$refs.viewer.show();
        },
        /**
         * 账单明细
         */
        toFcSupplierBillDetail(data)
        {
            let selectItems = this.$refs.table.getSelectItem();
            if (this.common.isNotBlank(data))
            {
                selectItems[0] = data;
            }
            if(selectItems.length !== 1)
            {
                this.$message.error("请选择一条需要查看的账单！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'confirmSupplierBillDetail_' + selectItems[0].id,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
                query: {fcSupplierBillId: selectItems[0].id},
            });
        },
        /**
         * 删除账单
         */
        revokeFcSupplierBillInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length != 1)
            {
                this.$message.error("请选择一条需要撤销的账单！");
                return false;
            }
            let that = this;
            that.$confirm("确认需要撤销审核？", "提示").then(() =>{
                that.common.postUrl("fcSupplierBillTF", "revokeFcSupplierBillInfo", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("撤销审核成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        /**
         * 生成付款单
         * @returns {Promise<boolean>}
         */
        async gotoPay()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0)
            {
                this.$message.error("请至少选择一条需要生成付款单的供应商账单！");
                return false;
            }
            let billIds = "";
            let totalBillFee = 0;//账单总金额
            let totalWriteoffFee = 0;
            for (let i = 0; i < selectData.length; i++)
            {
                let item = selectData[i];
                if (item.writeoffFee > 0)
                {
                    totalWriteoffFee = this.common.accAdd(totalWriteoffFee,item.writeoffFee);
                }
                billIds += "," + item.id;
                totalBillFee = this.common.accAdd(totalBillFee,item.totalFee);
            }
            billIds = billIds.substring(1);
            let hasGeneratePayFee = await this.common.postUrl("fcPayTF", "loadFcPayBillDataByBillIds", {billIds});
            //账单金额减去已经生成付款单的金额 减去核销金额才是可生成付款单的金额
            let fee = this.common.accSub(totalBillFee, this.common.accAdd(totalWriteoffFee, hasGeneratePayFee.fee));
            if (fee <= 0)
            {
                this.$message.error("供应商账单可生成付款金额已经全部生成付款单！");
                return false;
            }
            let item = {
                urlName: '新增付款单',
                urlId: 'addPayOrder'+(new Date()).getTime(),
                urlPathName: "/addPayOrder",
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue",
                query: {billId: billIds, verifyInvoiceFee: fee, isFromSupplierBill: 1},
            }
            this.$emit('openTab', item);
        },
        /**
         * 跳转
         * @param param
         * @param code
         * @param index
         * @returns {Promise<void>}
         */
        async toDetail(param, code, index)
        {
            if(code == 'applyNums'){
                let id = param.applyIdArray[index];
                await this.openRequest({
                    urlId: "purchaseDetail" + id,
                    urlName: '查看采购费用申请',
                    urlPathName: '/purchaseDetail',
                    id: id,
                    urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue",
                });
            } else if (code == 'payNums') {
                let id = param.payIdArray[index];
                await this.openRequest({
                    urlName: '查看付款单',
                    urlId: "payOrderDetail" + id,
                    urlPathName: "/payOrderDetail",
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                    id: id,
                    type:0
                });
            }
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
         * 导出EXCEL
         */
        downloadExcel(){
            this.$refs.table.downloadExcelFile("供应商已审核账单");
        },
        exportExcel()
        {
            let selecctData = this.$refs.table.getSelectItem();
            if (selecctData.length === 0)
            {
                this.$message.error("请至少选择一条数据");
                return false;
            }
            let param = {billIds:[]};
            for (let i = 0; i < selecctData.length; i++)
            {
                param.billIds.push(selecctData[i].id);
            }
            param.fileSubName = 'xlsx';
            param.selfCreateUrl = 'fcSupplierBillTF|downloadSupplierBillExcelById';
            this.common.downloadExcelFile('', param, '', '', '', 'confirmedBillDetailTable');
        },
        showImg(data){
            if(!data.imgUrl){
                // this.$message.error("没有附件~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.imgUrl.substring(data.imgUrl.lastIndexOf('.'), data.imgUrl.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.imgUrl);
                this.$refs.viewer.show();
            }else{
                data.imgUrl = data.imgUrl.replace("_big", "");
                let url = data.imgUrl;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"textarea","isshow":true},
                {"name":"账单月份","model":"billMonths","type":"months","isshow":true},
                {"name":"付款单号","model":"payNum","type":"input","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierTenantIds","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","clearable":true,"multiple":true,"filterable":true,"method":"doQuery","isshow":true},
                {"name":"是否生成付款单","model":"isGeneratePay","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"所属区域","model":"regionId","type":"select","options":this.regionData,"label":"regionName","value":"id","clearable":true,"method":"changeRegion","isshow":true},
                {"name":"所属部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","clearable":true,"method":"doQuery","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
