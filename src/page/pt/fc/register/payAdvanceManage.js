import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'payAdvanceManage',
    data() {
        return {
            head: [
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "预付原因", "code": "advanceCause", "width": "110", "type": "text"},
                {"name": "预付金额", "code": "advanceFee", "width": "110", "type": "text"},
                {"name": "收款日期", "code": "advanceDate", "width": "110", "type": "text"},
                {"name": "已收票金额", "code": "isVerificationFee", "width": "110", "type": "text"},
                {"name": "未收票金额", "code": "noVerificationFee", "width": "110", "type": "text"},
                {"name": "预付状态", "code": "advanceStateName", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"}
            ],
            detailHead: [
                {"name": "核销金额", "code": "verificationFee", "width": "110", "type": "text", "isSum":"true"},
                {"name": "核销人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "核销时间", "code": "createDate", "width": "110", "type": "text"}
            ],
            loadParam: {supplierName: this.$route.query.supplierName},
            pay: {},//预付信息
            invoice: {},//发票信息
            advanceStateData: [],//预付状态下拉
            supplierData: [],//供应商下拉
            supplierInvoiceData: [],//供应商已审核发票下拉
            showPay: false,//预付
            showVerification: false,//核销
            showVerificationDetail: false,//核销明细
            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,//初始化日期快捷
            verificationFee: '',//核销金额
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
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            if(this.common.isNotBlank(this.loadParam.daterange) && this.loadParam.daterange.length==2){
                this.loadParam.startDate = this.loadParam.daterange[0];
                this.loadParam.endDate = this.loadParam.daterange[1];
            }else{
                this.loadParam.startDate = '';
                this.loadParam.endDate = '';
            }
            this.$refs.table.load("fcAdvanceTF", "queryPayVancePage", this.loadParam);
        },
        init() {
            let that = this;
            //预付状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ADVANCE_STATE"}, function (data) {
                that.advanceStateData = data;
            });
            //供应商
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 打开关闭 新增预付弹窗 */
        toAddPay(flag) {
            if(flag){
                this.title = "新增预付";
                this.showPay = true;
            }else{
                this.pay = {};
                this.showPay = false;
            }
        },
        /** 打开关闭 修改预付弹窗 */
        async toUpPay() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预付信息！");
                return;
            }
            this.pay = await this.common.postUrl("fcAdvanceTF", "queryPayInfoById", {id:selectData[0].id});
            this.title = "修改预付";
            this.showPay = true;
        },
        /** 保存预付信息 */
        savePayInfo() {
            if(this.common.isBlank(this.pay.tenantId)){
                this.$message.error("请选择供应商名称！");
                return;
            }
            if(this.common.isBlank(this.pay.advanceCause)){
                this.$message.error("请输入预付原因！");
                return;
            }
            if(this.common.isBlank(this.pay.advanceFee)){
                this.$message.error("请输入收款金额！");
                return;
            }
            if(this.common.isBlank(this.pay.advanceDate)){
                this.$message.error("请选择收款日期！");
                return;
            }
            let mes = this.common.isBlank(this.pay.id) ? "新增成功！" : "修改成功！";
            let that = this;
            that.pay.tenantName = that.supplierData.find(item=>item.tenantId===that.pay.tenantId).supplierName;
            that.common.postUrl("fcAdvanceTF", "savePayInfo", that.pay, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddPay(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /** 删除预付信息 */
        delPayInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条预付信息！");
                return;
            }
            if(selectData[0].advanceState!=3){
                let mes = selectData[0].advanceState == 1 ? "已核销" : "部分核销"
                this.$message.error("该笔预付是"+mes+"状态，无法删除！");
                return;
            }
            let that = this;
            this.$confirm("是否确认删除？", "提示").then(async () =>{
                await this.common.postUrl("fcAdvanceTF", "delPayInfo", selectData[0],
                null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        /** 打开关闭 预付核销弹窗 */
        async toAddVerification(flag) {
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条预付信息！");
                    return;
                }
                this.pay = await this.common.postUrl("fcAdvanceTF", "queryPayInfoById", {id:selectData[0].id});
                this.pay.tenantName = selectData[0].tenantName;
                this.supplierInvoiceData = await this.common.postUrl("fcAdvanceTF", "querySupplierAllSubmitInvoice", {tenantId:selectData[0].tenantId});
                this.showVerification = true;
            }else{
                this.pay = {};
                this.invoice = {};
                this.verificationFee = '';
                this.showVerification = false;
            }
        },
        /** 选择供应商发票 */
        changeInvoice(data) {
            if(this.common.isBlank(data)){
                this.invoice.noPayFee = '';
                return;
            }
            for (let i = 0; i < this.supplierInvoiceData.length; i++) {
                if(this.supplierInvoiceData[i].invoiceId == data){
                    this.invoice.noPayFee = this.supplierInvoiceData[i].noPayFee;
                    break;
                }
            }
        },
        /** 保存核销信息 */
        saveVerification() {
            if(this.common.isBlank(this.invoice.invoiceId)){
                this.$message.error("请选择供应商发票提交编号！");
                return;
            }
            if(this.common.isBlank(this.verificationFee)){
                this.$message.error("请输入本次核销金额！");
                return;
            }
            let param = {
                id: this.pay.id,
                invoiceId: this.invoice.invoiceId,
                tenantName:this.pay.tenantName,
                verificationFee: this.verificationFee
            };
            let that = this;
            that.common.postUrl("fcAdvanceTF", "saveVerificationPay", param, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.toAddVerification(false);
                    that.$message.success("核销成功");
                }
            },null,'',true);
        },
        /** 打开关闭 预付核销明细弹窗 */
        toShowVerificationDetail(flag) {
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条预付信息！");
                    return;
                }
                this.showVerificationDetail = true;
                this.$nextTick(() => {
                    this.$refs.detailTable.load("fcAdvanceTF", "queryPayDetail", {id:selectData[0].id});
                });
                this.pay = selectData[0];
            }else{
                this.pay = {};
                this.showVerificationDetail = false;
            }
        },
    },
}
