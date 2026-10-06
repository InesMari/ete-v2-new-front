import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'submitInvoiceManage',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "", "width": "130", "type": "diy"},
                {"name": "发票提交编号", "code": "submitInvoiceNum", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "110", "type": "text"},
                {"name": "发票审核备注", "code": "verifyRemark", "width": "110", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "110", "type": "text"},
                {"name": "发票号码", "code": "invoiceNum", "width": "110", "type": "text"},
                {"name": "发票类型", "code": "invoiceType", "width": "110", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "110", "type": "text"},
                {"name": "开票金额", "code": "invoiceFee", "width": "110", "type": "text"},
                {"name": "发票备注", "code": "remark", "width": "110", "type": "text"},
                {"name": "收款人", "code": "receiveUserName", "width": "250", "type": "text"},
                {"name": "收款账号", "code": "bankCard", "width": "200", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "250", "type": "text"},
                {"name": "银行卡类型", "code": "bankTypeName", "width": "110", "type": "text"},
                {"name": "提交人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "提交时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {supplierName: this.$route.query.supplierName, verifyState: this.$route.query.verifyState,submitInvoiceNum:this.$route.query.submitInvoiceNum},
            invoiceInfo: {},//开票提交
            supplierBillInfo: {},//账单信息
            copySupplierBillInfo: {},//临时账单信息
            verifyStateData: [],//审核状态
            invoiceTypeData: [],//发票类型
            // applyInvoiceTypeData: [],//开票金额类型
            supplierBankData:[],//供应商银行卡信息
            srcList:[],//图片
            title: '',//弹窗标题
            uptitle: '',//弹窗标题
            showVerify: false,//发票审核
            upInvoiceDeal: false,//修改发票
            verify: false,//发票审核
            isLock: false,//查看信息
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        fileViewer,
        myFileModel,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(loadParam=this.loadParam) {
            this.loadParam=loadParam;
            this.$refs.table.load("fcSubmitInvoiceTF", "querySubmitInvoicePage", this.loadParam);
        },
        init() {
            let that = this;
            //审核状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
            //发票类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"FC_INVOICE_TYPE"}, function (data) {
                that.invoiceTypeData = data;
            });
            // //开票金额类型
            // this.common.postUrl("commonTF", "getSysStaticData", {codeType:"APPLY_INVOICE_TYPE"}, function (data) {
            //     that.applyInvoiceTypeData = data;
            // });
        },
        clear() {
            this.loadParam = {};
        },
        /** 账单明细 */
        toFcSupplierBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'confirmSupplierBillDetail',
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
                query: {fcSupplierBillId: data.billId},
            });
        },
        dblclickItem(data){
            this.toShowVerify(true,3,data);
        },
        /** 打开关闭 发票审核弹窗 type:1发票审核 2查看发票 3双击查看详情*/
        toShowVerify(flag,type,obj) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1 && type!=3) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                let invoice = selectData[0];
                if(type==3){
                    invoice = obj;
                }
                //1发票审核
                if(type==1 && invoice.verifyState!=enumData.verifyState.notReviewed){
                    this.$message.error("当前发票提交不是未审核状态!");
                    return;
                }
                //2查看发票 3双击查看详情
                if((type==2 || type==3) && invoice.verifyState==enumData.verifyState.notReviewed){
                    this.$message.error("当前发票提交还是未审核状态!");
                    return;
                }
                let that = this;
                this.common.postUrl("fcSubmitInvoiceTF", "querySubmitInvoiceById", {invoiceId:invoice.invoiceId,type:type}, function (data) {
                    that.invoiceInfo = data;
                    that.srcList=[];
                    that.srcList.push(that.common.getBigImgPath(data.invoiceImgPath_));
                });
                this.verify = false;
                this.isLock = false;
                if(type==1){
                    this.title = "发票审核";
                    this.verify = true;
                }else if(type==2 || type==3){
                    this.title = "查看发票";
                    this.isLock = true;
                }
                this.showVerify = true;
      			this.$refs.viewer.show();
            } else {
                this.invoiceInfo = {};
                this.showVerify = false;
            }
        },
        /** 发票审核 1审核通过 2审核不通过*/
        verifyInvoice(state) {
            let param = {
                invoiceId: this.invoiceInfo.invoiceId,
                verifyRemark: this.invoiceInfo.verifyRemark,
                verifyState: state
            };
            let that = this;
            this.common.postUrl("fcSubmitInvoiceTF", "verifyInvoice", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success("审核成功!");
                    that.$parent.loadTodoData();
                }
            },null,'',true);
            this.toShowVerify(false);
        },
        /** 初始化供应商银行卡信息 */
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
        /** 切换开户名称 */
        selBank(){
            for (let i = 0; i < this.supplierBankData.length; i++) {
                let bankInfo = this.supplierBankData[i];
                if(this.supplierBillInfo.receiveBankId==bankInfo.receiveBankId){
                    this.setBank(bankInfo);
                    break;
                }
            }
            this.$forceUpdate();
        },
        setBank(bankInfo){
            if(bankInfo){
                this.supplierBillInfo.receiveBankId = bankInfo.receiveBankId;
                this.supplierBillInfo.receiveUserId = bankInfo.receiveUserId;
                this.supplierBillInfo.bankCard = bankInfo.bankNum;
                this.supplierBillInfo.bankDepositName = bankInfo.bankName;
                this.supplierBillInfo.bankSubName = bankInfo.branchName;
            }else{
                this.supplierBillInfo.receiveBankId = '';
                this.supplierBillInfo.receiveUserId = '';
                this.supplierBillInfo.bankNum = '';
                this.supplierBillInfo.bankName = '';
                this.supplierBillInfo.branchName = '';
            }
        },
        /** 修改发票 */
        toUpApplyInvoice(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                if(selectData[0].verifyState==enumData.verifyState.approved){
                    this.$message.error("无法修改审核通过的发票提交信息!");
                    return;
                }
                let param = {
                    supplierBillId: selectData[0].fcSupplierBillId,
                    invoiceId: selectData[0].invoiceId
                };
                let that = this;
                this.common.postUrl("fcSubmitInvoiceTF", "queryUpSubmitInvoice", param, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.supplierBillInfo = data;
                        that.copySupplierBillInfo = that.common.copyObj(that.supplierBillInfo);
                        if(that.supplierBillInfo.invoiceImgId){
                            that.$refs.invoiceFile.initDate(that.supplierBillInfo.invoiceImgId);
                        }
                    }
                });
                this.uptitle = "账单编号【"+selectData[0].billNum+"】修改发票";
                this.upInvoiceDeal = true;
                //初始化银行卡
                this.initBankData(selectData[0].supplierTenantId);
            }else{
                this.supplierBillInfo = {};
                this.copySupplierBillInfo = {};
                this.$refs.invoiceFile.clean();
                this.upInvoiceDeal = false;
            }
        },
        /** 修改申请
         * 选择开票金额类型，如果跟原来类型一样，可输入金额为当前提交发票金额+选中开票金额类型的可提交发票金额
         *                 如果不一样，可输入金额为选中开票金额类型的可提交发票金额
         * 输入开票金额 */
        changeApplyInvoiceType() {
            if(this.common.isBlank(this.supplierBillInfo.invoiceFee)){
                return;
            }
            let noApplyInvoiceFee = this.supplierBillInfo.noWaybillFee;
            switch (this.supplierBillInfo.applyInvoiceType){
                case enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE+"":
                    noApplyInvoiceFee = this.supplierBillInfo.noStorehouseFee;
                    break;
                case enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY+"":
                    noApplyInvoiceFee = this.supplierBillInfo.noOtherFee;
                    break;
                case enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT+"":
                    noApplyInvoiceFee = this.supplierBillInfo.noMakeupFee;
                    break;
            }
            if(this.supplierBillInfo.applyInvoiceType==this.copySupplierBillInfo.applyInvoiceType) {//跟原来类型一样
                if(this.supplierBillInfo.invoiceFee>this.common.accAdd(this.copySupplierBillInfo.invoiceFee,noApplyInvoiceFee)){
                    this.$message.error("输入金额不能大于当前提交发票金额与未提交发票金额总和!");
                    this.supplierBillInfo.invoiceFee = '';
                }
            }else{
                if(this.supplierBillInfo.invoiceFee>noApplyInvoiceFee){
                    this.$message.error("输入金额不能大于未提交发票金额!");
                    this.supplierBillInfo.invoiceFee = '';
                }
            }
        },
        /** 保存修改发票 */
        saveUpApplyInvoice() {
            if(this.common.isBlank(this.supplierBillInfo.receiveUserId) || this.common.isBlank(this.supplierBillInfo.receiveBankId)){
                this.$message.error("请选择开户行!");
                return;
            }
            if(this.common.isBlank(this.supplierBillInfo.invoiceNum)){
                this.$message.error("请输入发票号码!");
                return;
            }
            if(this.common.isBlank(this.supplierBillInfo.invoiceType)){
                this.$message.error("请选择发票类型!");
                return;
            }
            if(this.common.isBlank(this.supplierBillInfo.applyInvoiceType)){
                this.$message.error("请选择开票金额类型!");
                return;
            }
            if(this.common.isBlank(this.supplierBillInfo.invoiceTax)){
                this.$message.error("请输入发票税率!");
                return;
            }
            if(this.common.isBlank(this.supplierBillInfo.invoiceFee)){
                this.$message.error("请输入开票金额!");
                return;
            }
            this.supplierBillInfo.invoiceFileImg = this.$refs.invoiceFile.getImageData().flowId;
            this.supplierBillInfo.invoiceFileImgPath = this.$refs.invoiceFile.getImageData().storePath;
            if(this.common.isBlank(this.supplierBillInfo.invoiceFileImg) || this.common.isBlank(this.supplierBillInfo.invoiceFileImgPath)){
                this.$message.error("请上传发票图片!");
                return;
            }
            let that = this;
            this.common.postUrl("fcSubmitInvoiceTF", "saveUpSubmitInvoice", this.supplierBillInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.toUpApplyInvoice(false);
                    that.$message.success("修改成功!");
                }
            },null,'',true);
        },
        /** 撤销提交 */
        cancleApplyInvoice() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据!");
                return;
            }
            if(selectData[0].invoicePayFee>0){
                this.$message.error("无法撤销已经付款的发票提交信息!");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "撤销审核",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认撤销审核发票？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("fcSubmitInvoiceTF", "cancleSubmitInvoice", selectData[0], function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
    },
    computed: {
        formData(){
            return [
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","placeholder":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"提交人","placeholder":"提交人","model":"createUserName","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"发票提交编号","placeholder":"发票提交编号","model":"submitInvoiceNum","type":"input","isshow":true},
            ]
        }
    }
}
