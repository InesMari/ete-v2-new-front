import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'expenditureRegisterManage',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "状态", "code": "payStateName", "width": "110", "type": "text"},
                {"name": "费用类型", "code": "invoiceTypeName", "width": "200", "type": "text"},
                {"name": "最晚支付日期", "code": "expectDate", "width": "110", "type": "text"},
                {"name": "实际支付日期", "code": "actualPayDate", "width": "110", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "110", "type": "text"},
                {"name": "已收发票金额", "code": "verifyInvoiceFee", "width": "110", "type": "text"},
                {"name": "应付金额", "code": "payableFee", "width": "110", "type": "text"},
                {"name": "已付金额", "code": "payFee", "width": "110", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "110", "type": "text"}
            ],
            registerInvoiceHead: [
                {"name": "发票号", "code": "invoiceNum", "width": "110", "type": "text"},
                {"name": "发票类型", "code": "invoiceType", "width": "110", "type": "text"},
                {"name": "发票金额(含税)", "code": "invoiceFee", "width": "110", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "110", "type": "text"},
                {"name": "审核日期", "code": "verifyDate_", "width": "110", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "110", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "110", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "110", "type": "text"},
                {"name": "应付金额", "code": "invoiceFee", "width": "110", "type": "text"},
                {"name": "已付金额", "code": "invoicePayFee", "width": "110", "type": "text"},
                {"name": "未付金额", "code": "noInvoicePayFee", "width": "110", "type": "text"},
                {"name": "付款金额","code": "payFee","width": "110","type": "input","placeholder": "付款金额","inputFn": "inputFn",'isSum':"true"},
                {"name": "实际付款日期", "code": "payDate", "width": "150", "type": "date", "placeholder": "实际付款日期","inputFn": "inputFn"},
                {"name": "付款备注", "code": "remark", "width": "150", "type": "input"},
            ],
            detailHead: [
                {"name": "发票号", "code": "invoiceNum", "width": "110", "type": "text"},
                {"name": "发票类型", "code": "invoiceType", "width": "110", "type": "text"},
                {"name": "发票金额(含税)", "code": "invoiceFee", "width": "110", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "110", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "110", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "110", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "110", "type": "text"},
                {"name": "付款金额", "code": "fee", "width": "110", "type": "text"},
                {"name": "实际付款日期", "code": "payDate_", "width": "110", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "110", "type": "text"},
                {"name": "操作", "code": "caozuo", "width": "110", "type": "diy"}
            ],
            loadParam: {
                billNum:'',
                supplierName: this.$route.query.supplierName,
                noPayFeeSymbol:'>',
                noPayFee: this.$route.query.noPayFee,
            },
            bill: {},//账单信息
            payStateData: [],//登记状态
            tableData: [],//列表数据
            title: '',//付款登记弹窗标题
            hisTitle: '',//付款记录弹窗标题
            totalFee: '',//付款金额
            showRegister: false,//付款登记
            showRegisterHis: false,//付款记录
            symbolOptions: enumData.compareText,

            registerShowBatch:false,
            info:{},

            settleBodyData:[],
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
        scrollTable,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam=query;
            this.loadParam.loadPayDate = 1;
            this.loadParam.payFlag = 1;
            this.$refs.table.load("fcSupplierBillTF", "queryPaySupplierBillPage", this.loadParam);
        },
        init() {
            let that = this;
            //登记状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_STATE"}, function (data) {
                that.payStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
                that.settleBodyData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 付款登记弹窗 */
        toShowVerify(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length<=0){
                    this.$message.error("请至少选择一个需要付款登记的账单！");
                    return false;
                }
                let billIds = [];
                if(selectData.length > 1){
                    let noPayFee = 0;
                    let billNums = '';
                    this.info = {};
                    for (let i = 0; i < selectData.length; i++) {
                        let data = selectData[i];
                        if (data.payState == enumData.RECEIVE_STATE.REGISTER)
                        {
                            this.$message.error("已登记账单无法付款登记！");
                            return false;
                        }
                        if (data.noPayFee <= 0)
                        {
                            this.$message.error("请选择未付金额不为0的账单付款登记！");
                            return false;
                        }
                        billNums += ','+data.billNum;
                        billIds.push(data.id);
                        noPayFee = this.common.accAdd(noPayFee,data.noPayFee);
                    }
                    this.info.billNums = billNums.substring(1);
                    this.info.billIds = billIds;
                    this.info.noPayFee = noPayFee;
                    this.info.actualPayDate = new Date();
                    this.showRegisterBatch(true);
                    return ;
                }
                if (selectData[0].noPayFee <= 0)
                {
                    this.$message.error("请选择未付金额不为0的账单收款登记！");
                    return false;
                }
                if (selectData[0].payState == enumData.RECEIVE_STATE.REGISTER) {
                    this.$message.error("该账单金额已是全部登记状态!");
                    return;
                }
                let that = this;
                //账单信息
                this.common.postUrl("fcExpenditureRegisterTF", "querySupplierBillDetail", {supplierBillId: selectData[0].id}, function (data) {
                    that.bill = data;
                });
                this.showRegister = true;
                //账单发票信息
                // this.common.postUrl("fcExpenditureRegisterTF", "querySupplierBillInvoice", {supplierBillId: selectData[0].id}, function (data) {
                //     that.$nextTick(() => {
                //         that.tableData = data;
                //     })
                // });
                this.$nextTick(async()=>{
                    this.tableData = await this.$refs.invoiceTable.load("fcExpenditureRegisterTF", "querySupplierBillInvoice", {supplierBillId: selectData[0].id});
                    this.tableData.forEach(item => {
                        item.remark = '';//备注字段
                    })
                    this.$refs.invoiceTable.initData(this.tableData);//重新赋值
                })

                this.title = "账单编号【" + selectData[0].billNum + "】付款登记";
            } else {
                this.bill = {};
                this.totalFee = '';
                this.showRegister = false;
            }
        },
        showRegisterBatch(flag){
            this.registerShowBatch = flag;
        },
        sureRegisterBatch(){
            let that = this;
            that.common.postUrl("fcExpenditureRegisterTF", "batchSaveSupplierBillRegister", that.info, function (data){
                that.$message.success("批量付款登记成功！");
                that.doQuery();
                that.showRegisterBatch(false);
            },null,'',true);
        },
        /** 自动拆分 */
        shareFee() {
            this.tableData = this.$refs.invoiceTable.getData();
            let remainFee = parseFloat(this.totalFee);
            for (let i = 0; i < this.tableData.length; i++) {
                let item = this.tableData[i];
                if (remainFee > item.noInvoicePayFee) {
                    item.payFee = item.noInvoicePayFee;
                    remainFee = this.common.accSub(remainFee, item.noInvoicePayFee);
                } else {
                    item.payFee = remainFee;
                    remainFee = 0;
                    break;
                }
                this.tableData[i] = item;
            }
            this.$refs.invoiceTable.initData(this.tableData);//重新赋值
            this.$refs.invoiceTable.calcFootSum();//合计
            if (remainFee > 0) {
                this.$message.error("申请金额太大，拆分不完");
            }
        },
        /** 保存付款登记 */
        saveSupplierBillRegister() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据!");
                return;
            }
            if (selectData[0].verifyState == enumData.RECEIVE_STATE.REGISTER) {
                this.$message.error("该账单金额已是全部登记状态!");
                return;
            }
            //需要登记的发票信息
            let registerData = [];
            for (let i = 0; i < this.tableData.length; i++) {
                if(this.common.isBlank(this.tableData[i].payFee) || this.tableData[i].payFee<=0){
                    continue;
                }
                if(this.common.isBlank(this.tableData[i].invoiceId)){
                    this.$message.error("请输入第"+(i+1)+"行的发票编号!");
                    return;
                }
                if(this.common.isBlank(this.tableData[i].payDate)){
                    this.$message.error("请选择第"+(i+1)+"行的付款日期!");
                    return;
                }
                let payInfo = {
                    invoiceId: this.tableData[i].invoiceId,
                    payFee: this.tableData[i].payFee,
                    payDate: this.tableData[i].payDate,
                    remark: this.tableData[i].remark,
                };
                registerData.push(payInfo);
            }
            if(registerData.length==0){
                this.$message.error("请至少输入一条需要付款登记的发票信息!");
                return;
            }
            let param = {
                supplierBillId: selectData[0].id,
                billNum: selectData[0].billNum,
                registerData: registerData
            };
            let that = this;
            this.common.postUrl("fcExpenditureRegisterTF", "saveSupplierBillRegister", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success("付款登记成功!");
                    that.toShowVerify(false);
                }
            },null,'',true);
        },
        //付款登记弹窗输入框监听方法
        inputFn(item, code, index) {
            if (isNaN(item.payFee))
            {
                this.$message.error("请输入有效的付款金额！");
                item.payFee = '';
            }
            if(item.payFee>item.noInvoicePayFee){
                this.$message.error("付款金额不能大于未收金额!");
                item.payFee = '';
            }
            this.tableData = this.$refs.invoiceTable.getData();
            this.$refs.invoiceTable.calcFootSum();
        },
        /** 打开关闭 付款记录弹窗 */
        toShowRegisterHis(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                this.showRegisterHis = true;
                //账单发票信息
                this.$nextTick(() => this.loadBillInvoiceDetail(selectData[0].id));
                this.hisTitle = "账单编号【" + selectData[0].billNum + "】付款记录";
                this.bill = selectData[0];
            } else {
                this.bill = {};
                this.totalFee = '';
                this.showRegisterHis = false;
            }
        },
        /** 加载账单发票明细 */
        loadBillInvoiceDetail(supplierBillId)
        {
            this.$refs.detailTable.load("fcExpenditureRegisterTF", "querySupplierBillPayData", {supplierBillId: supplierBillId});
        },
        /** 撤销付款 */
        cancleSupplierInvoiceRegister(item) {
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "撤销付款",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认撤销该付款记录？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("fcExpenditureRegisterTF", "cancleSupplierInvoiceRegister", {payId: item.payId}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.loadBillInvoiceDetail(item.fcSupplierBillId)
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        download(){
            this.$refs.table.downloadExcelFile('付款登记列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"textarea","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"未付金额","model":"noPayFeeSymbolItem","isshow":true,
                    children:[
                        {"model":"noPayFeeSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true,"method":"doQuery"},
                        {"model":"noPayFee"}]
                },
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"所属区域","placeholder":"所属区域","model":"regionName","type":"input","isshow":true},
                {"name":"所属部门","placeholder":"所属部门","model":"orgName","type":"input","isshow":true},
            ]
        }
    },
}
