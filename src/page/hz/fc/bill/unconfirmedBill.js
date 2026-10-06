import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'unconfirmedBillHZ',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "200", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "200", "type": "text"},
                {"name": "对账客户", "code": "custTenantName", "width": "180", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            customerAllData: [],//对账客户下拉
            query: this.initQuery(),
        }
    },

    mounted() {
    	this.init();
		this.doQuery().then(r => {});
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        enumData,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
			//对账客户
            this.customerAllData = await this.common.postUrl("customerTF", "queryCustomerData", {isLoadSubCompany: true});
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, tenantId: string, billNum: string}}
         */
        initQuery() {
            return this.query = {
                billNum: '',
                billMonth: '',
                tenantId: this.common.userInfo().tenantId,
                custTenantId: '',
                confirmState: enumData.FC_CONFIRM_STATE.UNCONFIRMED,//未确认
            };
        },
        /**
         * 查询客户账单列表
         */
        async doQuery() {
			let {items} = await this.$refs.table.load("fcCustBillTF", "queryCustomerBillPage", this.query);
			this.$refs.table.resetData(items);
        },
        /**
         * 账单确认
         */
        async sureFcCustomerBill() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要确认的账单！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED) {
                this.$message.error("已确认的账单,无须再次确认！");
                return false;
            }
            if (data.applyInvoiceState !== enumData.APPLY_INVOICE_STATE.NOT_APPLY) {
                this.$message.error("已申请发票发的账单,无法再次确认！");
                return false;
            }
            if (data.receiveState !== enumData.RECEIVE_STATE.NOT_REGISTER) {
                this.$message.error("已收款登记的账单,无法再次确认！");
                return false;
            }
            let detailDatas = await this.common.postUrl("fcCustBillTF", "queryCustomerBillPage", {billId: data.billId, flag: 1});
            let detailData = detailDatas.items[0];
            let listArray = await this.common.postUrl("fcCustBillTF", "queryCustomerBillDetailList", {billId: data.billId, flag: 1});

            let msg = '确认账单后不可回退,是否确认账单？<br>'+
                '账单月份：'+detailData.billMonth+'<br>' +
                '账单金额：￥'+detailData.totalFee+' 元<br>' +
                '运输金额：￥'+detailData.waybillFee+' 元 '+listArray[0].length+'条记录<br>' +
                '仓储金额：￥'+detailData.storehouseFee+' 元 '+listArray[1].length+'条记录<br>' +
                '器具金额：￥'+detailData.packLeaseFee+' 元 '+listArray[4].length+'条记录<br>' +
                '其他金额：￥'+detailData.otherFee+' 元 '+listArray[2].length+'条记录<br>' +
                '补录金额：￥'+detailData.makeupFee+' 元 '+listArray[3].length+'条记录<br>' +
                '账单备注： '+detailData.remark;
            let that = this;
            that.$confirm(msg, "提示",{
                    dangerouslyUseHTMLString: true,
                }).then(() => {
                that.common.postUrl("fcCustBillTF", "sureFcCustomerBill", {billId: data.billId}, function (data) {
                    that.doQuery();
                    that.$message.success("确认成功！");
                }, null, '', true);
            }).catch(() => {
            });
        },
        /**
         * 账单明细
         */
        toCustomerBillDetail(data)
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
                urlId: 'billDetail_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/billDetail.vue",
                query: {billId: selectItems[0].billId, flag: 1},
            });
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
