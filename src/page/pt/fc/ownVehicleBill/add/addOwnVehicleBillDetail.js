import simpleTable from "@/components/simpleTable/simpleTable.vue"

export default {
	name: 'addOwnVehicleBillDetail',
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
	},
	components: {
		simpleTable,
	},
	methods: {
		init(tenantId)
		{
			let that = this;
			that.common.postUrl("bankTF", "queryBankInfoBytenantId", {tenantId: tenantId}, function (data) {
				that.bankData = data;
				if (that.common.isBlank(data) || data.length === 0)
				{
					that.$message.error("请先增加供应商的银行卡信息！");
					return false;
				}
				else
				{
					if (data.length === 1)
					{
						that.bill.bankId = data[0].bankId;
						that.bill.userId = data[0].userId;
					}
				}
			});
		},
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
		 * 重新勾选
		 */
		recheck()
		{
			this.$emit("recheck");
		},
		/**
		 * 改变银行卡信息
		 * @param data
		 */
		changeBank(data)
		{
			this.bankData.forEach(item => {
				if (item.bankId === data.bankId)
				{
					this.bill.userId = item.userId;
				}
			})
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.toWaybillDetail(data.waybillId);
		},
		toWaybillDetail(waybillId)
		{
			this.$parent.$emit("openTab",{
				urlId: 'waybillDetail' + waybillId,
				query: {waybillId: waybillId},
				urlName: "派车单详情",
				urlPathName: "/detail",
				urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
		},
		checkTip()
		{
			if (this.bill.billMonth)
			{
				let array = this.bill.billMonth.split("-");
				let billYear = array[0];
				let billMonth = Number(array[1]);
				let now = new Date();
				let nowYear = now.getFullYear();
				let nowMonth = now.getMonth();
				let tip = false;
				if (billYear == nowYear)//相同年份的
				{
					tip = Math.abs((nowMonth + 1) - billMonth) >= 3;
				}
				else//不同年份的
				{
					if (Math.abs(nowYear - billYear) > 1)//超过1年的
					{
						tip = true;
					}
					else//相邻的两年
					{
						if (
							!((billMonth == 10 && nowMonth == 0) || (billMonth == 11 && nowMonth <= 1) || (billMonth == 12 && nowMonth <= 2)
								|| (nowMonth == 9 && billMonth == 1) || (nowMonth == 10 && billMonth <= 2) || (nowMonth == 11 && billMonth <= 3)
							))
						{
							tip = true;
						}
					}
				}
				if (tip)
				{
					this.$message.warning("您选择的月份:" + this.bill.billMonth + "与当前月份相差超过3个月！");
				}
			}
		}
	},
}
