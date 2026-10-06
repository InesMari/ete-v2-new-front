import innerTab from "@/components/innerTab/innerTab.vue";
import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'commonSelectBillItem',
	data()
	{
		return {
			tabs: [
				{
					id: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,
					name: "运输订单",
					active: true,
					router: 'orderList',
				},
				{
					id: enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE,
					name: "仓储费用",
					router: 'storehouseList'
				},
				{
					id: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY,
					name: "其他费用",
					router: 'projectsundryList'
				},
				{
					id: enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE,
					name: "器具费用",
					router: 'packLeaseList'
				},
			],
			orderHead: [
				{"name": "订单号", "code": "orderNum", "width": "160", "type": "text"},
				{"name": "客户名称", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "130", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "起始地省市区", "code": "PCDName", "width": "250", "type": "text"},
				{"name": "目的地省市区", "code": "ePCDName", "width": "250", "type": "text"},
				{"name": "车辆信息", "code": "plateNumber", "width": "250", "type": "text"},
				{"name": "完成时间", "code": "finishDate", "width": "130", "type": "text"},
				{"name": "运输金额", "code": "totalFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "异动金额", "code": "statementFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			storehouseHead: [
				{"name": "项目", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "仓库名称", "code": "workName", "width": "150", "type": "text"},
				{"name": "仓库地址", "code": "workAddressStr", "width": "250", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "费用类型", "code": "itemTypeName", "width": "80", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			projectsundryHead: [
				{"name": "项目", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "费用类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "费用", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
			],
			packLeaseHead: [
				{"name": "项目", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "器具名称", "code": "packName", "width": "120", "type": "text"},
				{"name": "器具数量", "code": "chargeNums", "width": "120", "type": "text"},
				{"name": "费用类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "费用日期", "code": "billDate", "width": "120", "type": "text"},
				{"name": "含税价", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			orderQuery: this.initOrderQuery(this.$route.query.tenantId, this.$route.query.tenantName),
			storehouseQuery: this.initStorehouseQuery(this.$route.query.tenantId, this.$route.query.tenantName),
			projectsundryQuery: this.initProjectsundryQuery(this.$route.query.tenantId, this.$route.query.tenantName),
			packLeaseQuery: this.initPackLeaseQuery(this.$route.query.tenantId, this.$route.query.tenantName),

			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			feeTypeData: [],
			packFeeTypeData: [],
			showTabId: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,//展示tabId
			tenantId: '',//选择的数据里面的客户
			tenantName: '',//选择的数据里面的客户
			tenantDisabled: false,//禁用客户输入
			isFilter: true,//是否过滤
			billDetailShow: false,//展示账单详情
		}
	},
	mounted()
	{
		this.init();
		this.doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.ORDER).then(r => {});//默认加载运输订单收入费用数据
	},
	components: {
		innerTab,
		dbTable,
		enumData,
		searchList
	},
	methods: {
		/**
		 * 初始化静态数据
		 */
		async init()
		{
			//费用类型静态下拉
			this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "OTHER_FEE_ITEM_TYPE"});
			//费用类型静态下拉
			this.packFeeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FEE_ITEM"});
		},
		/**
		 * 初始化运输订单查询条件
		 */
		initOrderQuery(tenantId, tenantName)
		{
			return this.orderQuery = {
				billId: this.$route.query.billId,
				flag: this.$route.query.flag,
				orderNum: '',
				tenantId: this.common.isNotBlank(tenantId) ? tenantId : this.common.isBlank(this.tenantId) ? '' : this.tenantId,
				tenantName: this.common.isNotBlank(tenantName) ? tenantName : this.common.isBlank(this.tenantName) ? '' : this.tenantName,//客户详情新增账单跳转
				finishDate: '',
				beginFinishDate: '',
				endFinishDate: '',
				routeName: '',
				createDate: '',
				workDate: '',
			};
		},
		/**
		 * 初始化仓储费用查询条件
		 */
		initStorehouseQuery(tenantId, tenantName)
		{
			return this.storehouseQuery = {
				billId: this.$route.query.billId,
				flag: this.$route.query.flag,
				tenantId: this.common.isNotBlank(tenantId) ? tenantId : this.common.isBlank(this.tenantId) ? '' : this.tenantId,
				tenantName: this.common.isNotBlank(tenantName) ? tenantName : this.common.isBlank(this.tenantName) ? '' : this.tenantName,
				workName: '',
				workAddressStr: '',
				billMonth: '',
			};
		},
		/**
		 * 初始化项目其他费用查询条件
		 */
		initProjectsundryQuery(tenantId, tenantName)
		{
			return this.projectsundryQuery = {
				billId: this.$route.query.billId,
				flag: this.$route.query.flag,
				tenantId: this.common.isNotBlank(tenantId) ? tenantId : this.common.isBlank(this.tenantId) ? '' : this.tenantId,
				tenantName: this.common.isNotBlank(tenantName) ? tenantName : this.common.isBlank(this.tenantName) ? '' : this.tenantName,
				feeType: '',
				billMonth: '',
				remark: '',
			};
		},
		/**
		 * 初始化包装租赁费用查询条件
		 */
		initPackLeaseQuery(tenantId, tenantName)
		{
			return this.packLeaseQuery = {
				billId: this.$route.query.billId,
				flag: this.$route.query.flag,
				tenantId: this.common.isNotBlank(tenantId) ? tenantId : this.common.isBlank(this.tenantId) ? '' : this.tenantId,
				tenantName: this.common.isNotBlank(tenantName) ? tenantName : this.common.isBlank(this.tenantName) ? '' : this.tenantName,
				feeType: '',
				billDate: '',
				beginBillDate: '',
				endBillDate: '',
			};
		},

		doQueryOrder(query)
		{
			this.orderQuery = query;
			this.doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.ORDER);
		},
		doQueryProjectsundry(query)
		{
			this.projectsundryQuery = query;
			this.doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY);
		},
		doQueryBillSupplement(query)
		{
			this.billSupplementQuery = query;
			this.doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT);
		},
		/**
		 * 查询
		 * @param type 1运输订单 2仓储费用 3项目其他费用 4账单补录费用
		 */
		async doQuery(type)
		{
			if (type === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
			{
				if(this.common.isNotBlank(this.orderQuery.finishDate) && this.orderQuery.finishDate.length === 2){
					this.orderQuery.beginFinishDate = this.orderQuery.finishDate[0];
					this.orderQuery.endFinishDate = this.orderQuery.finishDate[1];
				}else{
					this.orderQuery.beginFinishDate = '';
					this.orderQuery.endFinishDate = '';
				}
				if(this.common.isNotBlank(this.orderQuery.createDate) && this.orderQuery.createDate.length === 2){
					this.orderQuery.beginCreateDate = this.orderQuery.createDate[0];
					this.orderQuery.endCreateDate = this.orderQuery.createDate[1];
				}else{
					this.orderQuery.beginCreateDate = '';
					this.orderQuery.endCreateDate = '';
				}
				if(this.common.isNotBlank(this.orderQuery.workDate) && this.orderQuery.workDate.length === 2){
					this.orderQuery.beginWorkDate = this.orderQuery.workDate[0];
					this.orderQuery.endWorkDate = this.orderQuery.workDate[1];
				}else{
					this.orderQuery.beginWorkDate = '';
					this.orderQuery.endWorkDate = '';
				}
				if(this.common.isNotBlank(this.orderQuery.customerOrderDate) && this.orderQuery.customerOrderDate.length === 2){
					this.orderQuery.startCustomerOrderDate = this.orderQuery.customerOrderDate[0];
					this.orderQuery.endCustomerOrderDate = this.orderQuery.customerOrderDate[1];
				}else{
					this.orderQuery.startCustomerOrderDate = '';
					this.orderQuery.endCustomerOrderDate = '';
				}
				await this.$refs.orderListTable.load("fcCustBillTF", "loadOrderFeeData", this.orderQuery);
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				await this.$refs.storehouseListTable.load("fcCustBillTF", "loadStorehouseFeeData", this.storehouseQuery);
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				await this.$refs.projectsundryListTable.load("fcCustBillTF", "loadProjectsundryFeeData", this.projectsundryQuery);
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				if(this.common.isNotBlank(this.packLeaseQuery.billDate) && this.packLeaseQuery.billDate.length === 2){
					this.packLeaseQuery.beginBillDate = this.packLeaseQuery.billDate[0];
					this.packLeaseQuery.endBillDate = this.packLeaseQuery.billDate[1];
				}else{
					this.packLeaseQuery.beginBillDate = '';
					this.packLeaseQuery.endBillDate = '';
				}
				await this.$refs.packLeaseListTable.load("fcCustBillTF", "loadPackLeaseFeeData", this.packLeaseQuery);
			}
		},
		/**
		 * 选择tab回调
		 * @param data
		 */
		selectCallback(data)
		{
			this.showTabId = data.id;//切换展示界面
			this.tab = data;
			this.componentName = data.router;
			this.common.setSearchIsshowAll();
			this.doQuery(data.id).then(() => {});
		},
		/**
		 * 获取选择数据
		 * @param type
		 * @returns {[]}
		 */
		getSelectItem(type)
		{
			let selectItem = [];
			if (type === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
			{
				selectItem = this.$refs.orderListTable.getRightData();
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				selectItem = this.$refs.storehouseListTable.getRightData();
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				selectItem = this.$refs.projectsundryListTable.getRightData();
			}
			else if (type === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				selectItem = this.$refs.packLeaseListTable.getRightData();
			}
			return selectItem;
		},
		/**
		 * 获取所有选择数据
		 * @returns {[]}
		 */
		getAllSelectItem()
		{
			return [
				...this.$refs.orderListTable.getRightData(),
				...this.$refs.storehouseListTable.getRightData(),
				...this.$refs.projectsundryListTable.getRightData(),
				...this.$refs.packLeaseListTable.getRightData()]
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
				let hasStatementFeeCount = false;//含有未审核通过的异动申请
				let orderNum = "";
				data.forEach(item => {
					if (this.common.isNotBlank(item.tenantId))
					{
						set.add(item.tenantId);
					}
					if (!hasStatementFeeCount && item.statementFeeCount > 0)
					{
						hasStatementFeeCount = true;
						orderNum = item.orderNum;
					}
				})
				if (hasStatementFeeCount)//异动新增校验
				{
					this.$message.error("订单:" + orderNum + "含有费用异动数据未审核！请做完费用异动审核后再生成账单");
					return false;
				}
				if (set.size > 1)
				{
					if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
					{
						this.$message.error("不同客户的运输订单费用无法生成账单,请重新选择");
					}
					else if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
					{
						this.$message.error("不同客户的仓储费用无法生成账单,请重新选择");
					}
					else if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
					{
						this.$message.error("不同客户的其他费用无法生成账单,请重新选择");
					}
					if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
					{
						this.$message.error("不同客户的器具租赁费无法生成账单,请重新选择");
					}
					return false;
				}
				tenantId = set.values().next().value;
			}
			else
			{
				tenantId = data.tenantId;
			}
			if (this.check(tenantId, enumData.FC_CUST_BILL_ITEM_TYPE.ORDER))
			{
				this.$message.error("已经选择了其他客户的运输订单,请重新选择");
				return false;
			}
			if (this.check(tenantId, enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE))
			{
				this.$message.error("已经选择了其他客户的仓储费用,请重新选择");
				return false;
			}
			if (this.check(tenantId, enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY))
			{
				this.$message.error("已经选择了其他客户的其他费用,请重新选择");
				return false;
			}
			if (this.check(tenantId, enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE))
			{
				this.$message.error("已经选择了其他客户的器具租赁费用,请重新选择");
				return false;
			}
			if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER && data.statementFeeCount > 0)//运输订单才可能有异动
			{
				this.$message.error("订单:" + data.orderNum + "含有费用异动数据未审核！请做完费用异动审核后再生成账单");
				return false;
			}
			//添加的和已经选择的归属同一个客户
			this.isFilter = false;
			this.$nextTick(() => {
				if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
				{
					this.$refs.orderListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				else if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
				{
					this.$refs.storehouseListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				else if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
				{
					this.$refs.projectsundryListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				else if (this.showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
				{
					this.$refs.packLeaseListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				this.isFilter = true;//视图渲染完变回继续走过滤
			})
		},
		/**
		 * 校验选择的数据的归属客户是否和已选择的归属客户一致
		 * @param tenantId
		 * @param type
		 * @returns {boolean}
		 */
		check(tenantId, type)
		{
			let selectItems = this.getSelectItem(type);
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
			let selectItems = this.getAllSelectItem();
			this.tenantId = '';
			this.tenantName = '';
			selectItems.forEach(item => {
				if (this.common.isBlank(this.tenantId))
					this.tenantId = item.tenantId;//赋值已经选择的客户ID
				if (this.common.isBlank(this.tenantName))
					this.tenantName = item.tenantName;//赋值已经选择的客户名称
			})
			this.tenantDisabled = this.common.isNotBlank(this.tenantId);//选择了客户的情况全部列表客户输入框都禁用
			this.orderQuery.tenantId = this.tenantId;
			this.orderQuery.tenantName = this.tenantName;
			
			this.storehouseQuery.tenantId = this.tenantId;
			this.storehouseQuery.tenantName = this.tenantName;

			this.projectsundryQuery.tenantId = this.tenantId;
			this.projectsundryQuery.tenantName = this.tenantName;
			
			this.packLeaseQuery.tenantId = this.tenantId;
			this.packLeaseQuery.tenantName = this.tenantName;

			if(right!=null&&right.length>1) return
			this.doQuery(this.showTabId);
		},
		/**
		 * 生成账单
		 */
		generateBill()
		{
			this.$emit("generateBill");
		}
	},
	computed:{
		formDataOrder(){
			return [
				{"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
				{"name":"订单号","model":"orderNum","type":"textarea","placeholder":"订单号","isshow":true},
				{"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
				{"name":"系统录单时间","model":"createDate","type":"daterange","isshow":true},
				{"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
				{"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
				{"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
			]
		},
		// formDataStorehouse(){
		// 	return [
		// 		{"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
		// 		{"name":"仓库名称","model":"workAddressStr","type":"input","placeholder":"仓库名称","isshow":true},
		// 		{"name":"仓库地址","model":"routeName","type":"input","placeholder":"仓库地址","isshow":true},
		// 		{"name":"费用产生月份","model":"billMonth","type":"month","isshow":true},
		// 	]
		// },
		// formDataProjectsundry(){
		// 	return [
		// 		{"name":"项目","model":"tenantName","type":"input","placeholder":"项目","isshow":true},
		// 		{"name":"费用类型","model":"feeType","type":"select","options":this.feeTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
		// 		{"name":"费用产生月份","model":"billMonth","type":"month","isshow":true},
		// 		{"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
		// 	]
		// },
		formDataBillSupplement(){
			return [
				{"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
				{"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
				{"name":"账单编号","model":"billNum","type":"input","placeholder":"账单编号","isshow":true},
				{"name":"账单月份","model":"billMonth","type":"month","isshow":true},
				{"name":"系统录单时间","model":"createDate","type":"daterange","isshow":true},
				{"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
				{"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
			]
		},
		// formDataPackLease(){
		// 	return [
		// 		{"name":"项目","model":"tenantName","type":"input","placeholder":"项目","isshow":true},
		// 		{"name":"费用类型","model":"feeType","type":"select","options":this.packFeeTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
		// 		{"name":"费用日期","model":"billDate","type":"daterange","isshow":true},
		// 	]
		// }
	},
}
