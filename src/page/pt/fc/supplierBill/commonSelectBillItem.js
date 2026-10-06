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
					id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,
					name: "派车单、中转单",
					active: true,
					router: 'waybillList',
				},
				{
					id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE,
					name: "仓储费用",
					router: 'storehouseList'
				},
				{
					id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST,
					name: "器具费用",
					router: 'packCostList'
				},
			],
			waybillHead: [
				{"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
                {"name": "平台运单号", "code": "thrdWaybillNum", "width": "160", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
				{"name": "客户", "code": "custName", "width": "180", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "120", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
				{"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
				{"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "完成时间", "code": "endCarDate", "width": "150", "type": "text"},
				{"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
				{"name": "运输金额", "code": "totalFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "异动金额", "code": "statementFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			storehouseHead: [
				{"name": "供应商", "code": "supplierName", "width": "250", "type": "text"},
				{"name": "客户", "code": "custName", "width": "250", "type": "text"},
				{"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
				{"name": "仓库地址", "code": "workAddress", "width": "300", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "130", "type": "text"},
				{"name": "费用类型", "code": "itemTypeName", "width": "100", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "90", "type": "text", "issum": "true"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			packCostHead: [
				{"name": "采购单号", "code": "purchaseOrderNum", "width": "150", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "仓库名称", "code": "workName", "width": "180", "type": "text"},
				{"name": "业务模式", "code": "businessModeName", "width": "100", "type": "text"},
				{"name": "计费单位", "code": "unitName", "width": "100", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "160", "type": "text"},
				{"name": "客户名称", "code": "custName", "width": "160", "type": "text"},
				{"name": "器具名称", "code": "packName", "width": "120", "type": "text"},
				{"name": "器具数量", "code": "purchaseNums", "width": "120", "type": "text"},
				{"name": "含税价", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			waybillQuery: this.initWaybillQuery(Number(this.$route.query.supplierId)),
			storehouseQuery: this.initStorehouseQuery(Number(this.$route.query.supplierId)),
			packCostQuery: this.initPackCostQuery(Number(this.$route.query.supplierId)),

			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			feeTypeData: [],
			showTabId: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,//展示tabId
			supplierTenantId: '',//选择的数据里面的供应商
			tenantDisabled: false,//禁用供应商输入
			isFilter: true,//是否过滤
			billDetailShow: false,//展示账单
			supplierData:[],

			equipmentFocus:false,    //订单号是否获取焦点

			typeData:[{codeValue:'1',codeName:'买断'},{codeValue:'2',codeName:'分期'},{codeValue:'3',codeName:'租赁'}],//1 买断 2 分期 3 租赁
			itemTypeData:[],
		}
	},
	mounted()
	{
		this.doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL);//默认查询加载数据
		this.initSupplierData();
		this.initStaticData();
	},
	components: {
		innerTab,
		dbTable,
		enumData,
		searchList
	},
	methods: {
		initStaticData(){
			let that = this;
			this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'OTHER_FEE_ITEM_TYPE,WMS_FEE_COST_ITEM_TYPE'},function (data) {
				that.feeTypeData = data.OTHER_FEE_ITEM_TYPE;
				that.itemTypeData = data.WMS_FEE_COST_ITEM_TYPE;
				that.itemTypeData = that.itemTypeData.filter((el) => (el.codeValue != '3' && el.codeValue != '4'
					&& el.codeValue != '5' && el.codeValue != '6' && el.codeValue != '8' && el.codeValue != '9' && el.codeValue != '13'));
			});

		},
		initSupplierData(){
			let that = this;
			this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
				that.supplierData = data;
			});
		},
		/**
		 * 初始化运输订单查询条件
		 */
		initWaybillQuery(supplierTenantId)
		{
			return this.waybillQuery = {
				waybillNum: '',
				supplierTenantId: supplierTenantId?supplierTenantId:this.supplierTenantId,
				isInvoice:'',
				endCarDate: '',
				driverName: '',
				plateNumber: '',
				custName:'',
			};
		},
		/**
		 * 初始化仓储费用查询条件
		 */
		initStorehouseQuery(supplierTenantId)
		{
			return this.storehouseQuery = {
				supplierTenantId: supplierTenantId?supplierTenantId:this.supplierTenantId,
				storehouseName: '',
				storehouseAddress: '',
				billMonth: '',
				custName:'',
			};
		},
		/**
		 * 初始化包装采购费用查询条件
		 */
		initPackCostQuery(supplierTenantId){
			return this.packCostQuery = {
				supplierTenantId: supplierTenantId?supplierTenantId:this.supplierTenantId,
				packName:'',
				purchaseOrderNum:'',
				packCostQuery:'',
				billMonth: '',
				workName:'',
			};
		},

		/**
		 * 查询
		 * @param type 1运输订单 2仓储费用 3客户其他费用 4账单补录费用
		 */
		async doQuery(type)
		{
			if (type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)
			{
				if(this.common.isNotBlank(this.waybillQuery.createDate) && this.waybillQuery.createDate.length === 2){
					this.waybillQuery.beginCreateDate = this.waybillQuery.createDate[0];
					this.waybillQuery.endCreateDate = this.waybillQuery.createDate[1];
				}else{
					this.waybillQuery.beginCreateDate = '';
					this.waybillQuery.endCreateDate = '';
				}
				if(this.common.isNotBlank(this.waybillQuery.workDate) && this.waybillQuery.workDate.length === 2){
					this.waybillQuery.beginWorkDate = this.waybillQuery.workDate[0];
					this.waybillQuery.endWorkDate = this.waybillQuery.workDate[1];
				}else{
					this.waybillQuery.beginWorkDate = '';
					this.waybillQuery.endWorkDate = '';
				}
				if(this.common.isNotBlank(this.waybillQuery.endCarDate) && this.waybillQuery.endCarDate.length === 2){
					this.waybillQuery.startEndCarDate = this.waybillQuery.endCarDate[0];
					this.waybillQuery.endEndCarDate = this.waybillQuery.endCarDate[1];
				}else{
					this.waybillQuery.startEndCarDate = '';
					this.waybillQuery.endEndCarDate = '';
				}
				if(this.common.isNotBlank(this.waybillQuery.customerOrderDate) && this.waybillQuery.customerOrderDate.length === 2){
					this.waybillQuery.startCustomerOrderDate = this.waybillQuery.customerOrderDate[0];
					this.waybillQuery.endCustomerOrderDate = this.waybillQuery.customerOrderDate[1];
				}else{
					this.waybillQuery.startCustomerOrderDate = '';
					this.waybillQuery.endCustomerOrderDate = '';
				}
				await this.$refs.waybillListTable.load("fcSupplierBillTF", "queryOrdWaybillPageForBill", this.waybillQuery);
			}
			else if (type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
			{
				await this.$refs.storehouseListTable.load("fcSupplierBillTF", "queryStorehouseBillPageForBill", this.storehouseQuery);
			}
			else if(type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST){
				await this.$refs.packCostListTable.load("fcSupplierBillTF", "queryPackCostPageForBill", this.packCostQuery);
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
			this.doQuery(data.id);
		},
		/**
		 * 获取选择数据
		 * @param type
		 * @returns {[]}
		 */
		getSelectItem(type)
		{
			let selectItem = [];
			if (type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)
			{
				selectItem = this.$refs.waybillListTable.getRightData();
			}
			else if (type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
			{
				selectItem = this.$refs.storehouseListTable.getRightData();
			}
			else if (type === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)
			{
				selectItem = this.$refs.packCostListTable.getRightData();
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
				...this.$refs.waybillListTable.getRightData(),
				...this.$refs.storehouseListTable.getRightData(),
				...this.$refs.packCostListTable.getRightData()]
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
					if (this.common.isNotBlank(item.supplierTenantId))
					{
						set.add(item.supplierTenantId);
					}
				})
				if (set.size > 1)
				{
					if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)
					{
						this.$message.error("不同供应商的运输订单无法生成账单,请重新选择");
					}
					else if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
					{
						this.$message.error("不同供应商的仓储费用无法生成账单,请重新选择");
					}
					else if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)
					{
						this.$message.error("不同供应商的包装采购费用无法生成账单,请重新选择");
					}
					return false;
				}
				tenantId = set.values().next().value;
			}
			else
			{
				tenantId = data.supplierTenantId;
			}
			if (this.check(tenantId, enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL))
			{
				this.$message.error("已经选择了其他供应商的运输订单,请重新选择");
				return false;
			}
			if (this.check(tenantId, enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE))
			{
				this.$message.error("已经选择了其他供应商的仓储费用,请重新选择");
				return false;
			}
			if (this.check(tenantId, enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST))
			{
				this.$message.error("已经选择了其他供应商的包装采购费用,请重新选择");
			}
			//添加的和已经选择的归属同一个客户
			this.isFilter = false;
			this.$nextTick(() => {
				if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)
				{
					this.$refs.waybillListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				else if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
				{
					this.$refs.storehouseListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				else if (this.showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)
				{
					this.$refs.packCostListTable.toRightTable(data, index, isSelectAll ? 'all' : '');
				}
				this.isFilter = true;//视图渲染完变回继续走过滤
			})
		},
		/**
		 * 校验是否选择的数据和已选择的归属客户一致
		 * @param tenantId
		 * @param type
		 * @returns {boolean}
		 */
		check(tenantId, type)
		{
			let selectItems = this.getSelectItem(type);
			let flag = false;
			selectItems.forEach(item => {
				if (!flag){ flag = tenantId !== item.supplierTenantId; }
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
			this.supplierTenantId = '';
			this.isInvoice = '';
			selectItems.forEach(item => {
				if (this.common.isBlank(this.supplierTenantId)){
					this.supplierTenantId = item.supplierTenantId;
				}
				if (this.common.isBlank(this.isInvoice)){
					this.isInvoice = item.isInvoice;
				}

			})
			//选择了客户全部客户输入框都禁用
			this.tenantDisabled = this.common.isNotBlank(this.supplierTenantId);
			this.waybillQuery.supplierTenantId = this.supplierTenantId;
			this.waybillQuery.isInvoice = this.isInvoice;
			this.storehouseQuery.supplierTenantId = this.supplierTenantId;
			this.packCostQuery.supplierTenantId = this.supplierTenantId;
			this.$forceUpdate();
			//刷新列表
			if(right!=null&&right.length>1) return
			this.doQuery(this.showTabId);
		},
		/**
		 * 生产账单
		 */
		generateBill()
		{
			this.$emit("generateBill");
		},
		/** 设备号获取/失去焦点 */
		setEquipmentFocus(){
			this.equipmentFocus = this.equipmentFocus?false:true;
		},
		doQueryWaybill(query){
			this.waybillQuery = query;
			this.doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL);
		},
		doQueryStorehouse(query){
			this.storehouseQuery = query;
			this.doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE);
		},
	},
	computed:{
		formDataWaybill(){
			return [
				{"name":"派车单号","model":"waybillNum","type":"textarea","placeholder":"派车单号","isshow":true},
				{"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
				{"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
				{"name":"系统录单时间","model":"createDate","type":"daterange","isshow":true},
				{"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
				{"name":"收车时间","model":"endCarDate","type":"daterange","isshow":true},
				{"name":"司机","model":"driverName","type":"input","placeholder":"司机","isshow":true},
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
				{"name":"客户","model":"custName","type":"input","placeholder":"客户","isshow":true},
			]
		},
		formDataStorehouse(){
			return [
				{"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
				{"name":"仓库名称","model":"workName","type":"input","placeholder":"仓库名称","isshow":true},
				{"name":"仓库地址","model":"workAddressStr","type":"input","placeholder":"仓库地址","isshow":true},
				{"name":"费用产生月份","model":"billMonth","type":"month","isshow":true},
				{"name":"客户","model":"custName","type":"input","placeholder":"客户","isshow":true},
			]
		},

	},

}
