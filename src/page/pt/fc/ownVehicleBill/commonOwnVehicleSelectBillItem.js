import innerTab from "@/components/innerTab/innerTab.vue";
import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js"

export default {
	name: 'commonOwnVehicleSelectBillItem',
	data()
	{
		return {
			head: [
				{"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
				{"name": "派车单状态", "code": "waybillStateName", "width": "160", "type": "text"},
				{"name": "供应商", "code": "tenantName", "width": "180", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "200", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "130", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
				{"name": "收车日期", "code": "endCarDate", "width": "130", "type": "text"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			query: this.initQuery(),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			tenantDisabled: false,//禁用供应商输入
			isFilter: true,//是否过滤
			tenantId: '',//选择的数据里面的供应商
			tenantName: '',//选择的数据里面的供应商
		}
	},
	mounted()
	{
		this.doQuery().then(r => {});//默认查询加载数据
	},
	components: {
		innerTab,
		dbTable,
		enumData,
	},
	methods: {
		/**
		 * 初始化静态数据
		 */
		init()
		{

		},
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			return this.query = {
				waybillNum: '',
				tenantName: this.common.isBlank(this.tenantName) ? '' : this.tenantName,
				endCarDate: '',
				driverName: '',
				plateNumber: '',
				tenantId: this.common.isBlank(this.tenantId) ? '' : this.tenantId,
			};
		},
		/**
		 * 查询
		 */
		async doQuery()
		{
			if(this.common.isNotBlank(this.query.endCarDate) && this.query.endCarDate.length === 2){
				this.query.startEndCarDate = this.query.endCarDate[0];
				this.query.endEndCarDate = this.query.endCarDate[1];
			}else{
				this.query.startEndCarDate = '';
				this.query.endEndCarDate = '';
			}
			if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
				this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
				this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
			}else{
				this.query.startCustomerOrderDate = '';
				this.query.endCustomerOrderDate = '';
			}
			if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
				this.query.startWorkDate = this.query.workDate[0];
				this.query.endWorkDate = this.query.workDate[1];
			}else{
				this.query.startWorkDate = '';
				this.query.endWorkDate = '';
			}

			await this.$refs.table.load("ownVehicleBillTF", "queryWaybillPageForOwnVehicleBill", this.query);
		},
		/**
		 * 过滤function
		 * @param data 选择的数据
		 * @param index
		 * @param isSelectAll 是否全选
		 */
		filter(data, index, isSelectAll)
		{
			let tenantId = '';
			if (isSelectAll)//全选
			{
				let set = new Set;
				data.forEach(item => {
					if (this.common.isNotBlank(item.tenantId))
					{
						set.add(item.tenantId);
					}
				})
				if (set.size > 1)
				{
					this.$message.error("不同供应商的派车单无法生成账单,请重新选择");
					return false;
				}
				tenantId = set.values().next().value;
			}
			else
			{
				tenantId = data.tenantId;
			}
			if (this.check(tenantId))
			{
				this.$message.error("已经选择了其他供应商的运输订单,请重新选择");
				return false;
			}

			//添加的和已经选择的归属同一个供应商
			this.isFilter = false;
			this.$nextTick(() => {
				this.$refs.table.toRightTable(data, index, isSelectAll ? 'all' : '');
				this.isFilter = true;//视图渲染完变回继续走过滤
			})
		},
		/**
		 * 校验是否选择的数据和已选择的归属供应商一致
		 * @param tenantId
		 * @returns {boolean}
		 */
		check(tenantId)
		{
			let selectItems = this.$refs.table.getRightData();
			let flag = false;
			selectItems.forEach(item => {
				if (!flag){ flag = tenantId !== item.tenantId; }
			});
			return flag;
		},
		/**
		 * 选择数据到右边
		 * @param left 左边表格数据
		 * @param right 右边选择数据
		 * @param isSelectAll 是否选择全部
		 */
		dataChange(left, right, isSelectAll)
		{
			let selectItems = this.$refs.table.getRightData();
			this.tenantId = '';//右边回退回去的需要重置
			this.tenantName = '';
			selectItems.forEach(item => {
				this.tenantId = item.tenantId;
				this.tenantName = item.tenantName;
			})
			//选择了供应商全部供应商输入框都禁用
			this.tenantDisabled = this.common.isNotBlank(this.tenantId);
			this.query.tenantId = this.tenantId;
			this.query.tenantName = this.tenantName;
			//刷新列表
			if(right!=null&&right.length>1) return
			this.doQuery();
		},
		/**
		 * 生产账单
		 */
		generateBill()
		{
			this.$emit("generateBill");
		}
	},

}
