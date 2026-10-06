import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'expenditureRegisterRecord',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
                {"name": "发票号", "code": "invoiceNum", "width": "110", "type": "text"},
                {"name": "发票类型", "code": "invoiceType", "width": "110", "type": "text"},
                {"name": "发票金额(含税)", "code": "invoiceFee", "width": "110", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "110", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "110", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "110", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "250", "type": "text"},
                {"name": "付款金额", "code": "fee", "width": "110", "type": "text"},
                {"name": "实际付款日期", "code": "payDate_", "width": "110", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {},
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
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(loadParam=this.loadParam) {
            this.loadParam = loadParam;
            //开始时间
            if(this.common.isNotBlank(this.loadParam.createDaterange) && this.loadParam.createDaterange.length==2){
                this.loadParam.stratDate = this.loadParam.createDaterange[0];
                this.loadParam.endDate = this.loadParam.createDaterange[1];
            }else{
                this.loadParam.stratDate = '';
                this.loadParam.endDate = '';
            }
            //实际付款日期
            if(this.common.isNotBlank(this.loadParam.payDaterange) && this.loadParam.payDaterange.length==2){
                this.loadParam.stratPayDate = this.loadParam.payDaterange[0];
                this.loadParam.endPayDate = this.loadParam.payDaterange[1];
            }else{
                this.loadParam.stratPayDate = '';
                this.loadParam.endPayDate = '';
            }
            this.$refs.table.load("fcExpenditureRegisterTF", "querySupplierAllPayData", this.loadParam);
        },
        init() {

        },
        clear() {
            this.loadParam = {};
        },
        /** 撤销付款 */
        cancleSupplierInvoiceRegister() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据!");
                return;
            }
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
                this.common.postUrl("fcExpenditureRegisterTF", "cancleSupplierInvoiceRegister", selectData[0], function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        download(){
            this.$refs.table.downloadExcelFile('付款记录列表');
        },
    },
    computed: {
        formData(){
            return [
                {"name":"供应商名称","placeholder":"供应商名称","model":"supplierName","type":"input","isshow":true},
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","placeholder":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"操作人","placeholder":"操作人","model":"createUserName","type":"input","isshow":true},
                {"name":"操作时间","placeholder":"操作时间","model":"createDaterange","type":"daterange","isshow":true},
                {"name":"实际付款日期","placeholder":"实际付款日期","model":"payDaterange","type":"daterange","isshow":true},
            ]
        }
    }
}
