import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'confirmedBillHZ',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "200", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "200", "type": "text"},
                {"name": "对账客户", "code": "custTenantName", "width": "180", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "发票申请状态", "code": "applyInvoiceStateName", "width": "150", "type": "text"},
                {"name": "未申请发票金额", "code": "noApplyInvoiceFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "确认人", "code": "confirmUserName", "width": "100", "type": "text"},
                {"name": "确认时间", "code": "confirmDate", "width": "150", "type": "text"}
            ],
            applyInvoiceStateData: [],
            query: this.initQuery(),
            showTable: true,
        }
    },
    mounted() {
		this.init();
        this.doQuery().then(() => {});
    },
    components: {
        tableCommon,
        enumData,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
			//申请开票静态
            this.applyInvoiceStateData = await that.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_INVOICE_STATE"});
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, applyInvoiceState: string, tenantId: string, confirmState: number, billNum: string}}
         */
        initQuery() {
            return this.query = {
                billNum: '',
                billMonth: '',
                tenantId: this.common.userInfo().tenantId,
                applyInvoiceState: '',
                confirmState: enumData.FC_CONFIRM_STATE.CONFIRMED,//已确认
            };
        },
        /**
         * 查询客户账单列表
         */
		async doQuery() {
			await this.$refs.table.load("fcCustBillTF", "queryCustomerBillPage", this.query);
        },
        /**
         * 确认账单的明细
         */
        toCustomerConfirmedBillDetail(data)
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
                urlId: 'confirmBillDetail_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                query: {billId: selectItems[0].billId, flag: 1},
            });
        },
    },
}
