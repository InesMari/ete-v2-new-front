import scrollTable from "@/components/scrollTable/scrollTable.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
	name: 'ownVehicleBillDetail',
	data()
	{
		return {
			bill: this.initBill(),
			tableData: [],
			bankData: [],
			head: [
				{"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
				{"name": "调度类型", "code": "dispatchTypeName", "width": "160", "type": "text"},
				{"name": "派车单状态", "code": "waybillStateName", "width": "160", "type": "text"},
				{"name": "供应商", "code": "tenantName", "width": "180", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "200", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "130", "type": "text"},
				{"name": "要去运作时间", "code": "workDate", "width": "130", "type": "text"},
				{"name": "出车时间", "code": "startCarDate", "width": "130", "type": "text"},
				{"name": "收车时间", "code": "endCarDate", "width": "130", "type": "text"},
				{"name": "调度件数/件", "code": "goodsCount", "width": "130", "type": "text"},
				{"name": "调度重量/kg", "code": "goodsWeight", "width": "130", "type": "text"},
				{"name": "调度体积/m³", "code": "goodsVolume", "width": "130", "type": "text"},
				{"name": "运费合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "成本记账", "code": "accountFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "调度人", "code": "dispatchUserName", "width": "130", "type": "text"},
				{"name": "调度时间", "code": "dispatchDate", "width": "130", "type": "text"},
			],
		}
	},
	mounted()
	{
		this.loadBillData();
		this.loadBillWaybillData();
	},
	components: {
		scrollTable,
		simpleTable,
		tableCommon,
	},
	methods: {
		async loadBillData()
		{
			 this.bill = await this.common.postUrl("ownVehicleBillTF", "queryOwnVehicleBillDetail", this.$route.query);
		},
		async loadBillWaybillData()
		{
			await this.$refs.table.load("ownVehicleBillTF", "queryWaybillPageForOwnVehicleBill", this.$route.query);
		},
		/**
		 * 初始化账单
		 * @returns {{invoiceFee1: number, invoiceFee2: number, bankId: string, billMonth: string, fee2: number, invoiceTotalFee: number, tenantName: string, fee1: number, totalFee: number, tenantId: string, remark: string, waybillNums: number}}
		 */
		initBill()
		{
			return this.bill = {
				tenantId:'',
				tenantName:'',
				bankId:'',
				billMonth:'',
				remark:'',
				totalFee: 0,
				fee1: 0,
				fee2: 0,
				invoiceTotalFee: 0,
				invoiceFee1: 0,
				invoiceFee2: 0,
				waybillNums: 0,
			}
		},
		/**
		 * 导出EXCEL
		 */
		download()
		{
			this.$refs.table.downloadExcelFile('自有车账单派车单列表');
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.toWaybillDetailCommon(data.waybillId);
		},
		/**
		 * 查看详情
		 * @param data
		 */
		toWaybillDetail()
		{
			let selectItems = this.$refs.table.getSelectItem();
			if (selectItems.length != 1)
			{
				this.$message.error("请选择一条需要查看的派车单数据！");
				return false;
			}
			this.toWaybillDetailCommon(selectItems[0].waybillId);
		},
		/**
		 * 查看详情公共调用
		 * @param data
		 */
		toWaybillDetailCommon(waybillId)
		{
			this.$emit("openTab",{
				urlId: 'waybillDetail' + waybillId,
				query: {waybillId: waybillId},
				urlName: "派车单详情",
				urlPathName: "/detail",
				urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
		},
	},
}
