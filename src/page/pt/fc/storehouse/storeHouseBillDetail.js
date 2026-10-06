import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
	name: 'storeHouseBillDetail',
	data()
	{
		return {
			info: this.initInfo(),
			isOnlySee: this.$route.query.type == 3,
			storeHouseData: [],
			storeHouseDataAll: [],
			supplierData: [],
			customerData: [],
			wmsFeeCostItemTypeData: [],
			type: this.$route.query.type,//type 1 新增  2 修改  3 查看
			tdName: '当月库存板数',
			shareCostDataList: [this.initShareCostData()],
			totalShareCount: 0,
			totalShareAmount: 0,
			totalShareAmountWithTax: 0,
			treeData:[],
			props: { checkStrictly: true,value: 'workId',label: 'workName' },

			pickerOptions: {
				disabledDate(time)
				{
					//当前日期小于等于5号时,可以选择上月和当月.
					let now = new Date();
					let date = now.getDate();
					if (date <= 5)
					{
						let curDate = new Date().getTime();
						let monthTime = 30 * 24 * 3600 * 1000;
						let startDate = curDate - monthTime;
						return time.getTime() < startDate;
					}
					else
					{
						return time.getTime() < new Date(now.toLocaleDateString()).getTime();
					}
				},
			},

			//
			head: [
				{"name": "单号", "code": "wmsOrderNum", "width": "150"},
				{"name": "费用类型", "code": "itemTypeName", "width": "150"},
				{"name": "费用项目名称", "code": "itemName", "width": "150"},
				{"name": "单位", "code": "unit", "width": "120"},
				{"name": "不含税单价", "code": "price", "width": "120"},
				{"name": "税率", "code": "tax", "width": "100"},
				{"name": "含税价", "code": "priceWithTax", "width": "100"},
				{"name": "不含税金额", "code": "totalFee", "width": "100"},
				{"name": "含税金额", "code": "totalFeeWithTax", "width": "130"}
			],
			isShowDialog:false,
			totalInfo: {
				costNum: 0,
				costTotalFee: 0,
				costTotalFeeWithTax: 0,
			},
			costList:[],
			monthCostList:[],
			query: {
				wmsOrderNum: null,
				itemName: null,
				itemType: null,
				type: this.$route.query.type,
				id: this.$route.query.id,
			},
			itemTypeData: [],
			feeModifyFlag:true,
			equipmentCostList:[],
		}
	},
	mounted()
	{
		this.queryData();
	},
	components: {
		dbTable,
		tableCommon,
	},
	methods: {
		initInfo()
		{
			return this.info = {
				id: '',
				workId: '',
				workIdSub: null,
				workIds: null,
				workAddressStr: '',
				supplierTenantId: '',
				wmsFeeCostItemType: '1',
				billMonth: '',
				wmsFeeCostItemTypeTenantData: [],

				isNew:1,
				leaseFee: '',
				leaseFeeTax: '',
				waterFee: '',
				waterFeeTax: '',
				hardwareFee: '',
				hardwareFeeTax: '',
				insureFee: '',
				insureFeeTax: '',
				propertyFee: '',
				propertyFeeTax: '',
				energyFee: '',
				energyFeeTax: '',
				manageFee: '',
				manageFeeTax: '',
				otherFee: '',
				otherFeeTax: '',
				totalWarehouseLeaseFeeWithTax: 0,
				totalWarehouseLeaseFee: 0,

				times: 0,
				waybillFeePerTimes: 0,
				waybillFee: '',
				recoveryTransportFee: 0,
				recoveryTransportFeeTax: '',
				waybillChangeFee: '',
				waybillChangeRemark: '',
				totalWaybillFeeWithTax: 0,
				totalWaybillFee: 0,

				packCount: 0,
				packPrice: '',
				packFee: 0,
				packFeeTax: '',
				packChangeFee: '',
				packChangeRemark: '',
				totalPackFeeWithTax: 0,
				totalPackFee: 0,

				upstairsCount: 0,
				upstairsPrice: '',
				upstairsFee: 0,
				upstairsFeeTax: '',
				upstairsChangeFee: '',
				upstairsChangeRemark: '',
				totalUpstairsFeeWithTax: 0,
				totalUpstairsFee: 0,

				recoveryCount: 0,
				recoveryFee: 0,
				recoveryFeeTax: '',
				recoveryChangeFee: '',
				recoveryChangeRemark: '',
				totalRecoveryFeeWithTax: 0,
				totalRecoveryFee: 0,

				equipmentLeaseCount: '',
				equipmentLeaseFee: '',
				equipmentLeaseFeeTax: '',
				equipmentLeaseChangeFee: '',
				equipmentLeaseChangeRemark: '',
				totalEquipmentLeaseFeeWithTax: 0,
				totalEquipmentLeaseFee: 0,

				consumableCount: '',
				consumableFee: '',
				consumableFeeTax: '',
				consumableChangeFee: '',
				consumableChangeRemark: '',
				totalConsumableFeeWithTax: 0,
				totalConsumableFee: 0,

				temporaryServiceTimes: '',
				temporaryServiceCount: '',
				temporaryServiceFee: '',
				temporaryServiceTax: '',
				temporaryServiceChangeFee: '',
				temporaryServiceChangeRemark: '',
				totalTemporaryServiceFeeWithTax: 0,
				totalTemporaryServiceFee: 0,

				totalAssetFeeWithTax: 0,
				totalAssetFee: 0,

				outDeviceRegisterFee: '',
				outDeviceReoveryFee: '',
				outDeviceClearUpFee: '',
				outDeviceTax: '',
				outDeviceChangeFee: '',
				outDeviceChangeRemark: '',
				totalOutDeviceFeeWithTax: '',
				totalOutDeviceFee: '',
				waybillFeeTax:'',
				emptyReturnFee:'',
				emptyReturnFeeTax:'',
				totalFeeWithTax:0,
				totalFee:0,

				fee1:'',
				tax1:'',
				fee2:'',
				tax2:'',
				fee3:'',
				tax3:'',
				fee4:'',
				tax4:'',
			}
		},
		initShareCostData(tenantId)
		{
			return {
				tenantId: this.common.isBlank(tenantId) ? '' : tenantId,
				count: '0',
				shareCostAmount: '',
				shareCostAmountWithTax: '',
			}
		},
		// 初始查询数据
		async queryData(){
			await this.initData();
			let entityIds = localStorage.getItem("entityIds").split(",");
			let that = this;
			entityIds.forEach(item => {
				if (item == 1005229) {
					that.feeModifyFlag = false;
				}
			});
			if (this.common.isNotBlank(this.$route.query.id))//修改 查看
			{
				this.loadStoreHouseFeeDataById(this.$route.query.id)
			}else{
				this.userInfo = this.common.userInfo();
				if(this.userInfo.workId){
					this.info.workIds = [this.userInfo.workId];
					this.changeWork();
				}
			}
		},
		async initData()
		{
			let workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {parentFlag: 1,regionFlag: 1});//仓库数据
			this.storeHouseDataAll = this.common.copyObj(workData);
			let IdIndex = new Map();
			workData.forEach(item => {
				let parentWorkId = item.parentWorkId;
				if (this.common.isBlank(parentWorkId))//才是主仓
				{
					this.storeHouseData.push(item);
					this.treeData.push(item);
					IdIndex.set(item.storeHouseId, this.treeData.length - 1);
				}
			});
			//处理子仓库的
			workData.forEach(item => {
				let parentWorkId = item.parentWorkId;
				if (parentWorkId > 0)
				{
					let i = IdIndex.get(parentWorkId);
					let map = this.treeData[i];//主仓库的数据
					let children = map.children;
					if (this.common.isBlank(children) || children.length === 0)
					{
						children = [];
					}
					children.push(item);
					map.children = children;
				}
			});
			this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});//供应商数据
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID, isLoadAllRegion: 1});
			let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'WHETHER,WMS_FEE_COST_ITEM_TYPE,WMS_FEE_ITEM_TYPE'});
			this.whetherData = data.WHETHER;
			this.wmsFeeCostItemTypeData = data.WMS_FEE_COST_ITEM_TYPE;
			if(this.type==1||this.type==2){
				this.wmsFeeCostItemTypeData = this.wmsFeeCostItemTypeData.filter((el) => (el.codeValue != '3' && el.codeValue != '4'
					&& el.codeValue != '5' && el.codeValue != '6' && el.codeValue != '8' && el.codeValue != '9' && el.codeValue != '13'));
			}
			this.itemTypeData = data.WMS_FEE_ITEM_TYPE;
			this.initCustomerName();
			let billDateInfo = await this.common.postUrl("commonTF", "getBillDate", {});

			this.pickerOptions = {
				disabledDate(time) {
					//当前日期小于等于5号时,可以选择上月和当月.
					let now = new Date();
					let date = now.getDate();
					if (date < parseInt(billDateInfo.billDate)||billDateInfo.specialOrg) {
						let month = parseInt(billDateInfo.billMonth);
						let curDate = new Date().getTime();
						let monthTime = 30 * 24 * 3600 * 1000 * month;
						let startDate = curDate - monthTime;
						return time.getTime() < startDate;
					} else {
						return time.getTime() < new Date(now.toLocaleDateString()).getTime();
					}
				},
			};
			this.$forceUpdate();
		},
		async loadStoreHouseFeeDataById(id)
		{
			let data = await this.common.postUrl("wmsCostService", 'loadFeeCostDataById', {id}, null, null, '', true);
			if (data.info.wmsFeeCostItemType == 1||data.info.wmsFeeCostItemType == 30)
			{
				data.info.workIds = [];
				data.info.workIds.push(data.info.workId);
				if (data.info.workIdSub)
				{
					data.info.workIds.push(data.info.workIdSub);
				}
			}
			this.info = data.info;
			this.info.wmsFeeCostItemType = data.info.wmsFeeCostItemType + "";
			this.info.workAddressStr = this.storeHouseDataAll.find(item => item.workId === this.info.workId).workAddressStr;

			if (data.info.wmsFeeCostItemType == 1)
			{
				if(this.info.isNew==1){
					await this.loadStoreHouseData();
				}else{
					this.info.totalWarehouseLeaseFeeWithTax = data.info.totalFeeWithTax;
					this.info.totalWarehouseLeaseFee = data.info.totalFee;
				}
			} else if (data.info.wmsFeeCostItemType == 30)
			{
				this.info.totalWarehouseLeaseFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalWarehouseLeaseFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 2)
			{
				this.info.totalWaybillFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalWaybillFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 3)
			{
				this.info.totalPackFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalPackFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 4)
			{
				this.info.totalUpstairsFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalUpstairsFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 5)
			{
				this.info.totalRecoveryFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalRecoveryFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 6)
			{
				this.info.totalEquipmentLeaseFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalEquipmentLeaseFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 8)
			{
				this.info.totalConsumableFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalConsumableFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 9)
			{
				this.info.totalTemporaryServiceFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalTemporaryServiceFee = data.info.totalFee;
			}
			else if (data.info.wmsFeeCostItemType == 13)
			{
				this.info.totalOutDeviceFeeWithTax = data.info.totalFeeWithTax;
				this.info.totalOutDeviceFee = data.info.totalFee;
			}
			if (data.info.wmsFeeCostItemType == 40)
			{
				await this.loadStoreHouseData();
			}
			if (data.info.wmsFeeCostItemType == 20)
			{
				this.costList = data.costList;
				this.calcCostTotal();
			}
			else
			{
				this.shareCostDataList = data.shareCostDataList;
				this.initCustomerName();
				this.calcShareSum();
			}
			this.$forceUpdate();
		},
		initCustomerName(){
			this.shareCostDataList.forEach(item => {
				this.customerData.forEach(el => {
					if(item.tenantId == el.tenantId){
						item.customerName = el.name;
					}
				})
			})
		},
		async changeWork()
		{
			let data = this.info.workIds;
			this.info.workId = null;
			if (this.common.isNotBlank(data) && data.length > 0)
			{
				this.info.workId = data[0];
				if (data.length > 1)
				{
					this.info.workId = data[1];
				}
			}
			this.changeStoreHouse();
		},
		/**
		 * 改变仓库
		 * @returns {Promise<void>}
		 */
		async changeStoreHouse()
		{
			this.info.workAddressStr = '';
			let workId = this.info.workId;
			for (let i = 0; i < this.storeHouseDataAll.length; i++)
			{
				let item = this.storeHouseDataAll[i];
				if (item.workId === workId)
				{
					this.info.workAddressStr = item.workAddressStr;
					this.info.leaseFee = item.leaseFee;
					this.info.workId = item.workId;
					await this.loadStoreHouseData();
					break;
				}
			}
		},
		/**
		 * 改变供应商
		 * @param tenantId
		 * @returns {Promise<void>}
		 */
		async changeSupplier(tenantId)
		{
			await this.loadStoreHouseData();
		},
		async changeBillMonth()
		{
			await this.loadStoreHouseData();
		},
		async changeWmsFeeCostItemType(type)
		{
			if (type == 1||type==30)
			{
				this.tdName = '当月库存板数';
			}
			else if(type == 2)
			{
				this.tdName = '当月出库板数';
			}
			else if(type == 3)
			{
				this.tdName = '当月打包板数';
			}
			else if(type == 4)
			{
				this.tdName = '当月上楼板数';
			}
			else if(type == 5)
			{
				this.tdName = '回收总数';
			}
			else if(type == 6)
			{
				this.tdName = '当月库存板数';
			}
			else if(type == 8)
			{
				this.tdName = '当月库存板数';
			}
			else if(type == 9||type == 10)
			{
				this.tdName = '当月库存板数';
			}
			else if(type == 13)
			{
				this.tdName = '器具数';
			}
			else if(type == 40)
			{
				this.tdName = '数量';
			}
			this.shareCostDataList = [this.initShareCostData()];
			this.info.waybillFee='';
			await this.loadStoreHouseData();
		},
		/**
		 * 加载仓库相关数据
		 * @returns {Promise<void>}
		 */
		async loadStoreHouseData()
		{
			let data;
			if ((this.info.supplierTenantId > 0 && this.info.workId && this.common.isNotBlank(this.info.billMonth)) || this.info.id > 0)
			{
				data = await this.common.postUrl("wmsCostService", 'loadStoreHouseData', {
					supplierTenantId: this.info.supplierTenantId,
					billMonth: this.info.billMonth,
					workId: this.info.workId,
					id: this.info.id,
					wmsFeeCostItemType: this.info.wmsFeeCostItemType,
				}, null, null, '', true);
				let that  = this;
				if (that.info.wmsFeeCostItemType == 2)
				{
					const supplier = that.supplierData.find(function (item) {
						return item.tenantId === that.info.supplierTenantId;
					});
					that.info.recoveryTransportFeeTax = that.common.isNotBlank(supplier) ? supplier.taxRate : null;
				}
			}
			else
			{
				data = {};
			}
			let storeHouse = this.storeHouseDataAll.find(item => item.workId == this.info.workId);
			if (storeHouse)
			{
				this.info.leaseFee = storeHouse.leaseFee;
			}
			if (this.info.wmsFeeCostItemType == 20)
			{
				this.costList = [];
			}else if(this.info.wmsFeeCostItemType == 1){
				if ((this.info.supplierTenantId > 0 && this.info.workId && this.common.isNotBlank(this.info.billMonth)) || this.info.id > 0)
				{
					this.monthCostList = await this.common.postUrl("wmsStorehouseTF", 'queryStorehouseFeeDetailList', {
						supplierTenantId: this.info.supplierTenantId,
						billMonth: this.info.billMonth,
						workId: this.info.workId,
						id: this.info.id,
					}, null, null, '', true);
				}else{
					this.monthCostList = [];
				}
			}
			else if(this.info.wmsFeeCostItemType == 40){
				if ((this.info.supplierTenantId > 0 && this.info.workId && this.common.isNotBlank(this.info.billMonth)) || this.info.id > 0)
				{
					this.equipmentCostList = await this.common.postUrl("wmsStorehouseTF", 'queryAssetFeeDetailList', {
						supplierTenantId: this.info.supplierTenantId,
						billMonth: this.info.billMonth,
						workId: this.info.workId,
						id: this.info.id,
					}, null, null, '', true);
				}else{
					this.equipmentCostList = [];
				}
			}
			this.info.wmsFeeCostItemTypeTenantData = data.wmsFeeCostItemTypeTenantData;
			this.info.waybillDtlIds = data.waybillDtlIds;//后台更新使用
			this.info.ids = data.ids;//后台更新使用
			this.info.times = this.getValue(data.times, 0);
			this.info.waybillFeePerTimes = this.getValue(data.waybillFeePerTimes, 0);
			if(this.info.wmsFeeCostItemType != 10){
				this.info.waybillFee = this.getValue(data.waybillFee, 0);
			}else{
				this.info.waybillFee = data.waybillFee;
				this.info.waybillFeeTax = data.waybillFeeTax;
				this.info.emptyReturnFee = data.emptyReturnFee;
				this.info.emptyReturnFeeTax = data.emptyReturnFeeTax;
			}
			this.info.fee1 = data.fee1;
			this.info.tax1 = data.tax1;
			this.info.fee2 = data.fee2;
			this.info.tax2 = data.tax2;
			this.info.fee3 = data.fee3;
			this.info.tax3 = data.tax3;
			this.info.fee4 = data.fee4;
			this.info.tax4 = data.tax4;

			this.info.recoveryTransportFee = this.getValue(data.recoveryTransportFee, 0);
			this.info.packCount = this.getValue(data.packCount, 0);
			this.info.upstairsCount = this.getValue(data.upstairsCount, 0);
			this.info.recoveryCount = this.getValue(data.recoveryCount, 0);
			this.info.recoveryFee = this.getValue(data.recoveryFee, 0);
			this.info.temporaryServiceTimes = this.getValue(data.temporaryServiceTimes, 0);
			this.info.temporaryServiceCount = this.getValue(data.temporaryServiceCount, 0);
			this.info.temporaryServiceFee = this.getValue(data.temporaryServiceFee, 0);

			this.info.equipmentLeaseCount = data.equipmentLeaseCount;
			this.info.equipmentLeaseFee = data.equipmentLeaseFee;
			this.info.equipmentLeaseFeeTax = data.equipmentLeaseFeeTax;

			this.info.outDeviceRegisterFee = data.outDeviceRegisterFee;
			this.info.outDeviceReoveryFee = data.outDeviceReoveryFee;
			this.info.outDeviceClearUpFee = data.outDeviceClearUpFee;
			if (this.info.wmsFeeCostItemType  ==13 && this.common.isNotBlank(data.shareCostDataList) && data.shareCostDataList.length > 0)
			{
				data.shareCostDataList.forEach(item => {
					if (item.tenantId > 0)
						item.tenantId = String(item.tenantId)
				})
				this.shareCostDataList = data.shareCostDataList;

				let totalCount = 0;
				for (let i = 0; i < this.shareCostDataList.length; i++)
				{
					let data = this.shareCostDataList[i];
					totalCount = this.common.accAdd(totalCount, data.count);
					if (this.common.isBlank(this.info.outDeviceTax))
					{
						data.shareCostAmount = data.shareCostAmountWithTax;
					}
				}
				let rate = 0;
				if (this.common.isNotBlank(this.info.outDeviceTax))
				{
					rate = this.info.outDeviceTax;
				}
				if (rate > 0)
				{
					// let totalFeeWithTax = 0;
					// totalFeeWithTax = this.common.accAdd(totalFeeWithTax, data.outDeviceRegisterFee);
					// totalFeeWithTax = this.common.accAdd(totalFeeWithTax, data.outDeviceReoveryFee);
					// totalFeeWithTax = this.common.accAdd(totalFeeWithTax, data.outDeviceClearUpFee);
					// let totalFeeShareSum = 0;
					// let totalFeeWithTaxShareSum = 0;
					// for (let i = 0; i < this.shareCostDataList.length; i++)
					// {
					// 	let item = this.shareCostDataList[i];
					// 	if (this.common.isNotBlank(item.count))
					// 	{
					// 		let per = this.getValue(this.common.accDiv(item.count, totalCount), 0);
					// 		item.shareCostAmountWithTax = this.getValue(this.common.accMul(per, totalFeeWithTax).toFixed(4), 0);
					// 		item.shareCostAmount = item.shareCostAmountWithTax;
					// 	}
					// 	totalFeeWithTaxShareSum = this.common.accAdd(totalFeeWithTaxShareSum, item.shareCostAmountWithTax);
					// 	totalFeeShareSum = this.common.accAdd(totalFeeShareSum, item.shareCostAmount);
					// }
					// let sub = this.common.accSub(totalFeeWithTax, totalFeeShareSum);
					// if (sub != 0)
					// {
					// 	this.shareCostDataList[0].shareCostAmount = this.common.accAdd(sub, this.shareCostDataList[0].shareCostAmount);
					// }
					// let sub2 = this.common.accSub(totalFeeWithTax, totalFeeWithTaxShareSum);
					// if (sub2 != 0)
					// {
					// 	this.shareCostDataList[0].shareCostAmountWithTax = this.common.accAdd(sub2, this.shareCostDataList[0].shareCostAmountWithTax);
					// }
				}
			}
			this.$forceUpdate();
			this.$nextTick(() => {
				this.calculateTotalFee(this.info.wmsFeeCostItemType);
			})
		},
		getValue(value, defaultValue)
		{
			if (this.common.isBlank(value))
				return defaultValue;
			if (isNaN(value))
				return defaultValue;
			return parseFloat(value);
		},
		/**
		 * 计算未税金额
		 * @param fee
		 * @param tax
		 * @returns {*|number}
		 */
		calcNotTaxFee(fee, tax, fixed)
		{
			if (this.common.isBlank(fee))
				return 0;
			if (this.common.isBlank(tax))
				return fee;
			let myFixed=4;
			if(fixed){
				myFixed = fixed;
			}

			return this.common.accDiv(fee, 1 + this.common.accDiv(tax, 100)).myToFixed(myFixed);
		},
		/**
		 * 计算单价x数量的金额
		 * @param count
		 * @param price
		 * @returns {*|number}
		 */
		calcTotal(count, price)
		{
			if (this.common.isBlank(count) || count == 0)
				return 0;
			if (this.common.isBlank(price) || price == 0)
				return 0;
			return this.common.accMul(count, price).toFixed(4);
		},
		calculateFee(type)
		{
			if (type == 3)
			{
				this.info.packFee = this.calcTotal(this.info.packCount, this.info.packPrice)
			}
			else if(type == 4)
			{
				this.info.upstairsFee = this.calcTotal(this.info.upstairsCount, this.info.upstairsPrice)
			}
			this.calculateTotalFee(type);
		},
		/**
		 * @param type 1仓库租赁 2短驳配送 3打包费用 4上楼费用 5回收费用 6设备租赁 8耗材
		 */
		calculateTotalFee(type)
		{
			let totalFeeTax = 0;//总费用含税
			let totalFee = 0;//总费用
			this.calcShareSum();
			let info = this.info;
			if (type == 1)
			{
				for (let i = 0; i < this.monthCostList.length; i++) {
					let item = this.monthCostList[i];
					totalFeeTax = this.common.accAdd(totalFeeTax, item.totalFee);
					// totalFeeTax = this.common.accAdd(totalFeeTax, item.manageFee);
					// totalFeeTax = this.common.accAdd(totalFeeTax, item.otherFee);
					totalFeeTax = this.common.accAdd(totalFeeTax, item.waterFee);
					totalFeeTax = this.common.accAdd(totalFeeTax, item.energyFee);
					totalFeeTax = this.common.accAdd(totalFeeTax, item.changeFee);

					totalFee = this.common.accAdd(totalFee, item.totalFeeNoTax);
					// totalFee = this.common.accAdd(totalFee, item.manageFeeNoTax);
					// totalFee = this.common.accAdd(totalFee, item.otherFeeNoTax);
					totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(item.waterFee, item.waterFeeTaxRate,2));
					totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(item.energyFee, item.energyFeeTaxRate,2));
					totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(item.changeFee, item.leaseFeeTaxRate,2));
				}
				this.info.totalWarehouseLeaseFeeWithTax = totalFeeTax;
				this.info.totalWarehouseLeaseFee = totalFee;
			} else if (type == 30) {
				totalFeeTax = this.common.accAdd(totalFeeTax, this.info.waterFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, this.info.energyFee);
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(this.info.waterFee, this.info.waterFeeTax,2));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(this.info.energyFee, this.info.energyFeeTax,2));
				this.info.totalWarehouseLeaseFeeWithTax = totalFeeTax;
				this.info.totalWarehouseLeaseFee = totalFee;
			}
			else if (type == 2)
			{
				let rate = info.recoveryTransportFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.waybillFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.recoveryTransportFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.waybillChangeFee);
				this.info.totalWaybillFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.waybillFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.recoveryTransportFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.waybillChangeFee, rate));
				this.info.totalWaybillFee = totalFee;
			}
			else if (type == 3)
			{
				let rate = info.packFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.packFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.packChangeFee);
				this.info.totalPackFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.packFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.packChangeFee, rate));
				this.info.totalPackFee = totalFee;
			}
			else if (type == 4)
			{
				let rate = info.upstairsFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.upstairsFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.upstairsChangeFee);
				this.info.totalUpstairsFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.upstairsFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.upstairsChangeFee, rate));
				this.info.totalUpstairsFee = totalFee;
			}
			else if (type == 5)
			{
				let rate = info.recoveryFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.recoveryFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.recoveryChangeFee);
				this.info.totalRecoveryFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.recoveryFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.recoveryChangeFee, rate));
				this.info.totalRecoveryFee = totalFee;
			}
			else if (type == 6)
			{
				let rate = info.equipmentLeaseFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.equipmentLeaseFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.equipmentLeaseChangeFee);
				this.info.totalEquipmentLeaseFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.equipmentLeaseFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.equipmentLeaseChangeFee, rate));
				this.info.totalEquipmentLeaseFee = totalFee;
			}
			else if (type == 8)
			{
				let rate = info.consumableFeeTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.consumableFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.consumableChangeFee);
				this.info.totalConsumableFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.consumableFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.consumableChangeFee, rate));
				this.info.totalConsumableFee = totalFee;
			}
			else if (type == 9)
			{
				let rate = info.temporaryServiceTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.temporaryServiceFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.temporaryServiceChangeFee);
				this.info.totalTemporaryServiceFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.temporaryServiceFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.temporaryServiceChangeFee, rate));
				this.info.totalTemporaryServiceFee = totalFee;
			}
			else if (type == 13)
			{
				let rate = info.outDeviceTax;
				totalFeeTax = this.common.accAdd(totalFeeTax, info.outDeviceRegisterFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.outDeviceReoveryFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.outDeviceClearUpFee);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.outDeviceChangeFee);
				this.info.totalOutDeviceFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.outDeviceRegisterFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.outDeviceReoveryFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.outDeviceClearUpFee, rate));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.outDeviceChangeFee, rate));
				this.info.totalOutDeviceFee = totalFee;
			}
			else if (type == 10)
			{
				totalFeeTax = this.common.accAdd(info.waybillFee, info.emptyReturnFee);
				this.info.totalFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(this.calcNotTaxFee(info.waybillFee, info.waybillFeeTax,2), this.calcNotTaxFee(info.emptyReturnFee, info.emptyReturnFeeTax,2));
				this.info.totalFee = totalFee;
			}
			else if (type == 11)
			{
				totalFeeTax = this.common.accAdd(info.fee1, info.fee2);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.fee3);
				totalFeeTax = this.common.accAdd(totalFeeTax, info.fee4);
				this.info.totalFeeWithTax = totalFeeTax;

				totalFee = this.common.accAdd(this.calcNotTaxFee(info.fee1, info.tax1,2), this.calcNotTaxFee(info.fee2, info.tax2,2));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.fee3, info.tax3,2));
				totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(info.fee4, info.tax4,2));
				this.info.totalFee = totalFee;
			}
			else if (type == 40)
			{
				for (let i = 0; i < this.equipmentCostList.length; i++) {
					let item = this.equipmentCostList[i];
					totalFeeTax = this.common.accAdd(totalFeeTax, item.totalFeeWithTax);
					totalFeeTax = this.common.accAdd(totalFeeTax, item.changeFee);

					totalFee = this.common.accAdd(totalFee, item.totalFee);
					totalFee = this.common.accAdd(totalFee, this.calcNotTaxFee(item.changeFee, item.tax,2));
				}
				this.info.totalAssetFeeWithTax = totalFeeTax;
				this.info.totalAssetFee = totalFee;
			}
		},
		/**
		 * 计算成本分摊合计
		 */
		calcShareSum()
		{
			let totalFee = 0;
			let totalFeeWithTax = 0;
			let totalCount = 0;
			for (let i = 0; i < this.shareCostDataList.length; i++)
			{
				let data = this.shareCostDataList[i];
				totalFee = this.common.accAdd(totalFee, data.shareCostAmount);
				totalFeeWithTax = this.common.accAdd(totalFeeWithTax, data.shareCostAmountWithTax);
				totalCount = this.common.accAdd(totalCount, data.count);
			}
			this.totalShareAmount = totalFee;
			this.totalShareAmountWithTax = totalFeeWithTax;
			this.totalShareCount = totalCount;
		},
		/**
		 * 一键分摊
		 */
		share()
		{
			let totalFee = this.info.totalFee;
			let totalFeeWithTax = this.info.totalFeeWithTax;
			let tenantData = {};
			if (this.common.isNotBlank(this.info.wmsFeeCostItemTypeTenantData) && this.info.wmsFeeCostItemTypeTenantData.length > 0){
				if(this.info.wmsFeeCostItemType==30||this.info.wmsFeeCostItemType==8
					||this.info.wmsFeeCostItemType==9||this.info.wmsFeeCostItemType==10
					||this.info.wmsFeeCostItemType==11){
					tenantData = this.info.wmsFeeCostItemTypeTenantData[0];
				}else{
					tenantData = this.info.wmsFeeCostItemTypeTenantData[Number(this.info.wmsFeeCostItemType) - 1];
				}
				if(this.info.wmsFeeCostItemType==40){
					tenantData = {};
					let filter = new Set();
					let array = [];
					for (let i = 0; i < this.equipmentCostList.length; i++)
					{
						let item = this.equipmentCostList[i];
						let value = tenantData[item.tenantId];
						if (this.common.isNotBlank(value))
						{
							tenantData[item.tenantId] = this.common.accAdd(value, item.num);
						}
						else
						{
							tenantData[item.tenantId] = item.num;
						}
						if (!filter.has(item.tenantId))
						{
							array.push(item.tenantId);
						}
						filter.add(item.tenantId);
					}
					tenantData[0] = array;
				}
			}
			switch (this.info.wmsFeeCostItemType)
			{
				case "1":
				{
					totalFee = this.info.totalWarehouseLeaseFee;
					totalFeeWithTax = this.info.totalWarehouseLeaseFeeWithTax;
					break;
				}
				case "2":
				{
					totalFee = this.info.totalWaybillFee;
					totalFeeWithTax = this.info.totalWaybillFeeWithTax;
					break;
				}
				case "3":
				{
					totalFee = this.info.totalPackFee;
					totalFeeWithTax = this.info.totalPackFeeWithTax;
					break;
				}
				case "4":
				{
					totalFee = this.info.totalUpstairsFee;
					totalFeeWithTax = this.info.totalUpstairsFeeWithTax;
					break;
				}
				case "5":
				{
					totalFee = this.info.totalRecoveryFee;
					totalFeeWithTax = this.info.totalRecoveryFeeWithTax;
					break;
				}
				case "6":
				{
					totalFee = this.info.totalEquipmentLeaseFee;
					totalFeeWithTax = this.info.totalEquipmentLeaseFeeWithTax;
					break;
				}
				case "8":
				{
					totalFee = this.info.totalConsumableFee;
					totalFeeWithTax = this.info.totalConsumableFeeWithTax;
					break;
				}
				case "9":
				{
					totalFee = this.info.totalTemporaryServiceFee;
					totalFeeWithTax = this.info.totalTemporaryServiceFeeWithTax;
					break;
				}
				case "30":
				{
					totalFee = this.info.totalWarehouseLeaseFee;
					totalFeeWithTax = this.info.totalWarehouseLeaseFeeWithTax;
					break;
				}
				case "40":
				{
					totalFee = this.info.totalAssetFee;
					totalFeeWithTax = this.info.totalAssetFeeWithTax;
					break;
				}
			}
			//处理分摊条数
			let size = this.shareCostDataList.length;
			let tenantIds = tenantData[0];//包含的客户tenantId

			if (this.common.isNotBlank(tenantIds))
			{
				let set = new Set();
				for (let ii = 0; ii < this.shareCostDataList.length; ii++)
				{
					let item = this.shareCostDataList[ii];
					if (this.common.isNotBlank(item.tenantId))
						set.add(item.tenantId + '');
				}
				//一条客户的数据都没有的
				if (set.size === 0)
				{
					this.shareCostDataList = [];
					for (let k = 0; k < tenantIds.length; k++)
					{
						this.shareCostDataList.push(this.initShareCostData(tenantIds[k] + ''))
					}
					size = tenantIds.length;
				}
				else
				{
					for (let k = 0; k < tenantIds.length; k++)
					{
						if (!set.has(tenantIds[k] + ''))
						{
							this.shareCostDataList.push(this.initShareCostData(tenantIds[k] + ''))
							size++;
						}
					}
				}
			}
			//处理分摊
			if (this.shareCostDataList.length === 1)
			{
				let item = this.shareCostDataList[0];
				let tenantId = item.tenantId;
				if (this.common.isNotBlank(tenantId))
				{
					let value = tenantData[tenantId];
					if (this.common.isNotBlank(value))
						item.count = value;
				}
				item.shareCostAmount = totalFee;
				item.shareCostAmountWithTax = totalFeeWithTax;
			}
			else
			{
				let countSum = 0;
				//赋值板数
				for (let i = 0; i < size; i++)
				{
					let count = 0;
					let item = this.shareCostDataList[i];
					if (this.common.isNotBlank(item.tenantId))
					{
						let value = tenantData[item.tenantId];
						if (this.common.isNotBlank(value))
							count = value;
					}
					item.count = count;
					item.shareCostAmountWithTax = 0;
					item.shareCostAmount = 0;
					countSum = this.common.accAdd(countSum, count);
				}
				if (totalFee > 0 && size > 0)
				{
					let totalFeeShareSum = 0;
					let totalFeeWithTaxShareSum = 0;
					for (let j = 0; j < size; j++)
					{
						let item2 = this.shareCostDataList[j];
						if (item2.count > 0)
						{
							let per = this.getValue(this.common.accDiv(item2.count, countSum), 0);
							item2.shareCostAmount = this.getValue(this.common.accMul(per, totalFee).toFixed(4), 0);
							item2.shareCostAmountWithTax = this.getValue(this.common.accMul(per, totalFeeWithTax).toFixed(4), 0);
						}
						totalFeeShareSum = this.common.accAdd(totalFeeShareSum, item2.shareCostAmount);
						totalFeeWithTaxShareSum = this.common.accAdd(totalFeeWithTaxShareSum, item2.shareCostAmountWithTax);
					}
					let sub = this.common.accSub(totalFee, totalFeeShareSum);
					if (sub != 0)
						this.shareCostDataList[0].shareCostAmount = this.common.accAdd(sub, this.shareCostDataList[0].shareCostAmount);
					let sub2 = this.common.accSub(totalFeeWithTax, totalFeeWithTaxShareSum);
					if (sub2 != 0)
						this.shareCostDataList[0].shareCostAmountWithTax = this.common.accAdd(sub2, this.shareCostDataList[0].shareCostAmountWithTax);
				}
			}
			this.calcShareSum();
			this.$forceUpdate();
		},
		addCostShare()
		{
			if (this.shareCostDataList.length > 50)
			{
				this.$message.error("成本分摊不能超过50条！");
				return false;
			}
			this.shareCostDataList.push(this.initShareCostData());
			this.$forceUpdate();
		},
		deleteCostShare(index)
		{
			this.shareCostDataList.splice(index, 1);
			this.calcShareSum();
			this.$forceUpdate();
		},
		toWmsWaybill()
		{
			if (this.info.waybillFee <= 0)
				return;
			let supplierName = this.supplierData.find(item => item.tenantId === this.info.supplierTenantId).supplierName;
			let param = {
				supplierName: supplierName,
				billMonth: this.info.billMonth,
				workId: this.info.workId,
				waybillState: 5,
			};
			this.$emit('openTab', {
				urlName: '短驳配送管理',
				urlId: 'wmsWaybillManage',
				urlPathName: "/wmsWaybillManage",
				urlPath: "/pt/wms/waybill/wmsWaybillManage.vue",
				query: param,
			});
		},
		openSelectDialog(flag)
		{
			//校验
			if (this.common.isBlank(this.info.workId))
			{
				this.$message.error("请先选择仓库！");
				return false;
			}
			if (this.common.isBlank(this.info.supplierTenantId))
			{
				this.$message.error("请先选择供应商！");
				return false;
			}
			if (this.common.isBlank(this.info.billMonth))
			{
				this.$message.error("请先选择费用月份！");
				return false;
			}
			this.query.supplierTenantId = this.info.supplierTenantId;
			this.query.workId = this.info.workId;
			this.query.billMonth = this.info.billMonth;

			this.open(flag);
		},
		async open(flag){
			this.isShowDialog = flag;
			if (flag)
			{
				this.$nextTick(async ()=>{
					if (this.costList && this.costList.length > 0)
					{
						this.$refs.table.setRightData(this.common.copyObj(this.costList));
						this.$forceUpdate();
					}
					await this.doQuery();
				})
			}
			this.$forceUpdate();
		},
		// 查看仓储合同
		toAssetFeeDetail(item){
			this.$emit("openTab",{
				query:{id:item.id,assetId:item.assetId},
				urlId: 'assetFeeDetail' + item.id,
				urlName: '资产费用详情',
				urlPathName: '/assetFeeDetail',
				urlPath: "/pt/purchase/asset/assetFeeDetail.vue",
			});
		},
		toDetail({id}){
			this.$emit("openTab",{
				urlId: id+"detail",
				query:{id},
				urlName: "查看仓储租赁月费用详情",
				urlPathName: "/wmsStorehouseFeeDetail",
				urlPath: "/pt/res/wmsStorehouse/wmsStorehouseFeeDetail.vue"
			});
		},
		deleteDetail(index){
			this.monthCostList.splice(index, 1);
			this.calculateTotalFee(1);
		},
		async doQuery()
		{
			await this.$refs.table.load("wmsFeeCostItemDtlService", "queryFeeCostItemDtlPage", this.query);
		},
		saveCostItem()
		{
			let data = this.$refs.table.getRightData();
			this.costList = this.common.copyObj(data);
			let tax = this.costList[0].tax;
			for (let i = 0; i < this.costList.length; i++) {
				if(tax!=this.costList[i].tax){
					this.$message.error("请选择税点一样的作业单");
				}
			}
			this.calcCostTotal();
			this.open(false);
			this.$forceUpdate();
		},
		calcCostTotal()
		{
			this.totalInfo.costNum = 0;
			this.totalInfo.costTotalFee = 0;
			this.totalInfo.costTotalFeeWithTax = 0;
			for (let i = 0; i < this.costList.length; i++)
			{
				let item = this.costList[i];
				if (this.common.isNotBlank(item.num))
				{
					this.totalInfo.costNum = this.common.accAdd(item.num, this.totalInfo.costNum);
				}
				if (this.common.isNotBlank(item.totalFee))
				{
					this.totalInfo.costTotalFee = this.common.accAdd(item.totalFee, this.totalInfo.costTotalFee);
				}
				if (this.common.isNotBlank(item.totalFeeWithTax))
				{
					this.totalInfo.costTotalFeeWithTax = this.common.accAdd(item.totalFeeWithTax, this.totalInfo.costTotalFeeWithTax);
				}
			}
			this.$forceUpdate();
		},
		async saveFeeCost()
		{
			let info = this.info;
			if (this.common.isBlank(info.workId))
			{
				this.$message.error("请选择仓库！");
				return false;
			}
			if (this.common.isBlank(info.supplierTenantId))
			{
				this.$message.error("请选择供应商！");
				return false;
			}
			if (this.common.isBlank(info.billMonth))
			{
				this.$message.error("请选择费用月份！");
				return false;
			}
			if (this.common.isBlank(info.wmsFeeCostItemType))
			{
				this.$message.error("请选择费用类型！");
				return false;
			}
			let totalShareFee = 0;
			let totalShareFeeWithTax = 0;
			let totalShareCount = 0;
			if (info.wmsFeeCostItemType != 20)
			{
				for(let index in this.shareCostDataList)
				{
					let item = this.shareCostDataList[index];
					if (this.common.isBlank(item.tenantId))
					{
						this.$message.error("第" + (parseInt(index) + 1) + "条成本分摊的客户为空！");
						return false;
					}
					if (this.common.isBlank(item.count))
					{
						// this.$message.error("第" + (parseInt(index) + 1) + "条成本分摊的" + this.tdName + "为空！");
						// return false;
					}
					if (this.common.isBlank(item.shareCostAmountWithTax))
					{
						this.$message.error("第" + (parseInt(index) + 1) + "条成本分摊的分摊成本(含税)为空！");
						return false;
					}
					if (this.common.isBlank(item.shareCostAmount))
					{
						this.$message.error("第" + (parseInt(index) + 1) + "条成本分摊的分摊成本(未税)为空！");
						return false;
					}
					totalShareCount = this.common.accAdd(totalShareCount, item.count);
					totalShareFee = this.common.accAdd(totalShareFee, item.shareCostAmount);
					totalShareFeeWithTax = this.common.accAdd(totalShareFeeWithTax, item.shareCostAmountWithTax);
				}
			}

			switch (info.wmsFeeCostItemType)
			{
				case "1":
				{
					if (info.totalWarehouseLeaseFee == 0)
					{
						this.$message.error("仓库租赁未税总金额不能为0！");
						return false;
					}
					if (info.totalWarehouseLeaseFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("仓库租赁含税总金额：" + info.totalWarehouseLeaseFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalWarehouseLeaseFee != totalShareFee)
					{
						this.$message.error("仓库租赁未税总金额：" + info.totalWarehouseLeaseFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.totalFee = info.totalWarehouseLeaseFee;
					info.totalFeeWithTax = info.totalWarehouseLeaseFeeWithTax;
					break;
				}
				case "2":
				{
					if (info.totalWaybillFee == 0)
					{
						this.$message.error("短驳配送未税总金额不能为0！");
						return false;
					}
					if (info.totalWaybillFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("短驳配送含税总金额：" + info.totalWaybillFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalWaybillFee != totalShareFee)
					{
						this.$message.error("短驳配送未税总金额：" + info.totalWaybillFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.recoveryTransportFeeTax;
					info.totalFee = info.totalWaybillFee;
					info.totalFeeWithTax = info.totalWaybillFeeWithTax;
					info.changeFee = info.waybillChangeFee;
					info.changeRemark = info.waybillChangeRemark;
					break;
				}
				case "3":
				{
					if (info.totalPackFee == 0)
					{
						this.$message.error("打包费用未税总金额不能为0！");
						return false;
					}
					if (info.totalPackFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("打包费用含税总金额：" + info.totalPackFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalPackFee != totalShareFee)
					{
						this.$message.error("打包费用未税总金额：" + info.totalPackFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.packFeeTax;
					info.totalFee = info.totalPackFee;
					info.totalFeeWithTax = info.totalPackFeeWithTax;

					info.sums = info.packCount;
					info.price = info.packPrice;
					info.fee = info.packFee;
					info.changeFee = info.packChangeFee;
					info.changeRemark = info.packChangeRemark;
					break;
				}
				case "4":
				{
					if (info.totalUpstairsFee == 0)
					{
						this.$message.error("上楼费用未税总金额不能为0！");
						return false;
					}
					if (info.totalUpstairsFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("上楼费用含税总金额：" + info.totalUpstairsFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalUpstairsFee != totalShareFee)
					{
						this.$message.error("上楼费用未税总金额：" + info.totalUpstairsFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.upstairsFeeTax;
					info.totalFee = info.totalUpstairsFee;
					info.totalFeeWithTax = info.totalUpstairsFeeWithTax;

					info.sums = info.upstairsCount;
					info.price = info.upstairsPrice;
					info.fee = info.upstairsFee;
					info.changeFee = info.upstairsChangeFee;
					info.changeRemark = info.upstairsChangeRemark;
					break;
				}
				case "5":
				{
					if (info.totalRecoveryFee == 0)
					{
						this.$message.error("回收费用未税总金额不能为0！");
						return false;
					}
					if (info.totalRecoveryFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("回收费用含税总金额：" + info.totalRecoveryFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalRecoveryFee != totalShareFee)
					{
						this.$message.error("回收费用未税总金额：" + info.totalRecoveryFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.recoveryFeeTax;
					info.totalFee = info.totalRecoveryFee;
					info.totalFeeWithTax = info.totalRecoveryFeeWithTax;

					info.sums = info.recoveryCount;
					info.price = info.recoveryFee;
					info.fee = info.recoveryFee;
					info.changeFee = info.recoveryChangeFee;
					info.changeRemark = info.recoveryChangeRemark;
					break;
				}
				case "6":
				{
					if (info.totalEquipmentLeaseFee == 0)
					{
						this.$message.error("设备租赁未税总金额不能为0！");
						return false;
					}
					if (info.totalEquipmentLeaseFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("设备租赁含税总金额：" + info.totalEquipmentLeaseFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalEquipmentLeaseFee != totalShareFee)
					{
						this.$message.error("设备租赁未税总金额：" + info.totalEquipmentLeaseFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.equipmentLeaseFeeTax;
					info.totalFee = info.totalEquipmentLeaseFee;
					info.totalFeeWithTax = info.totalEquipmentLeaseFeeWithTax;

					info.sums = info.equipmentLeaseCount;
					info.price = info.equipmentLeaseFee;
					info.fee = info.equipmentLeaseFee;
					info.changeFee = info.equipmentLeaseChangeFee;
					info.changeRemark = info.equipmentLeaseChangeRemark;
					break;
				}
				case "8":
				{
					if (info.totalConsumableFee == 0)
					{
						this.$message.error("耗材未税总金额不能为0！");
						return false;
					}
					if (info.totalConsumableFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("耗材含税总金额不等于分摊成本(含税)合计！");
						return false;
					}
					if (info.totalConsumableFee != totalShareFee)
					{
						this.$message.error("耗材未税总金额：" + info.totalConsumableFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.consumableFeeTax;
					info.totalFee = info.totalConsumableFee;
					info.totalFeeWithTax = info.totalConsumableFeeWithTax;

					info.sums = info.consumableCount;
					info.price = info.consumableFee;
					info.fee = info.consumableFee;
					info.changeFee = info.consumableChangeFee;
					info.changeRemark = info.consumableChangeRemark;
					break;
				}
				case "9":
				{
					if (info.totalTemporaryServiceFee == 0)
					{
						this.$message.error("临时劳务未税总金额不能为0！");
						return false;
					}
					if (info.totalTemporaryServiceFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("临时劳务含税总金额不等于分摊成本(含税)合计！");
						return false;
					}
					if (info.totalTemporaryServiceFee != totalShareFee)
					{
						this.$message.error("临时劳务未税总金额：" + info.totalConsumableFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}

					info.tax = info.temporaryServiceTax;
					info.totalFee = info.totalTemporaryServiceFee;
					info.totalFeeWithTax = info.totalTemporaryServiceFeeWithTax;

					info.price = info.temporaryServiceTimes;//工时
					info.sums = info.temporaryServiceCount;//件数
					info.fee = info.temporaryServiceFee;//费用
					info.changeFee = info.temporaryServiceChangeFee;
					info.changeRemark = info.temporaryServiceChangeRemark;
					break;
				}
				case "13":
				{
					if (info.totalOutDeviceFee == 0)
					{
						this.$message.error("客户器具成本未税总金额不能为0！");
						return false;
					}
					if (info.totalOutDeviceFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("客户器具成本含税总金额不等于分摊成本(含税)合计！");
						return false;
					}
					if (info.totalOutDeviceFee != totalShareFee)
					{
						this.$message.error("客户器具成本未税总金额：" + info.totalOutDeviceFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.tax = info.outDeviceTax;
					info.totalFee = info.totalOutDeviceFee;
					info.totalFeeWithTax = info.totalOutDeviceFeeWithTax;

					info.sums = info.outDeviceRegisterFee;//运输成本
					info.price = info.outDeviceReoveryFee;//回收成本
					info.fee = info.outDeviceClearUpFee;//整理成本

					info.changeFee = info.outDeviceChangeFee;
					info.changeRemark = info.outDeviceChangeRemark;
					break;
				}
				case "10":
				{
					if (info.totalFee == 0)
					{
						this.$message.error("干线运输未税总金额不能为0！");
						return false;
					}
					if (info.totalFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("干线运输含税总金额：" + info.totalFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalFee != totalShareFee)
					{
						this.$message.error("干线运输未税总金额：" + info.totalFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					break;
				}
				case "11":
				{
					if (info.totalFee == 0)
					{
						this.$message.error("外包劳务费未税总金额不能为0！");
						return false;
					}
					if (info.totalFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("外包劳务费含税总金额：" + info.totalFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalFee != totalShareFee)
					{
						this.$message.error("外包劳务费未税总金额：" + info.totalFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					break;
				}
				case "20":
				{
					if (this.common.isBlank(this.costList))
					{
						this.$message.error("请选择作业成本数据！");
						return false;
					}
					info.tax = this.costList[0].tax;
					for (let i = 0; i < this.costList.length; i++) {
						if(info.tax!=this.costList[i].tax){
							this.$message.error("请选择税点一样的作业单");
						}
					}
					info.totalFee = this.totalInfo.costTotalFee;
					info.totalFeeWithTax = this.totalInfo.costTotalFeeWithTax;
					break;
				}
				case "30":
				{
					if (info.totalWarehouseLeaseFee == 0)
					{
						this.$message.error("水电费未税总金额不能为0！");
						return false;
					}
					if (info.totalWarehouseLeaseFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("水电费含税总金额：" + info.totalWarehouseLeaseFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalWarehouseLeaseFee != totalShareFee)
					{
						this.$message.error("水电费未税总金额：" + info.totalWarehouseLeaseFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.totalFee = info.totalWarehouseLeaseFee;
					info.totalFeeWithTax = info.totalWarehouseLeaseFeeWithTax;
					break;
				}
				case "40":
				{
					if (info.totalAssetFee == 0)
					{
						this.$message.error("设备集采未税总金额不能为0！");
						return false;
					}
					if (info.totalAssetFeeWithTax != totalShareFeeWithTax)
					{
						this.$message.error("设备集采含税总金额：" + info.totalAssetFeeWithTax + "不等于分摊成本(含税)合计：" + totalShareFeeWithTax);
						return false;
					}
					if (info.totalAssetFee != totalShareFee)
					{
						this.$message.error("设备集采未税总金额：" + info.totalAssetFee + "不等于分摊成本(未税)合计：" + totalShareFee);
						return false;
					}
					info.totalFee = info.totalAssetFee;
					info.totalFeeWithTax = info.totalAssetFeeWithTax;
					break;
				}
			}
			if ((info.wmsFeeCostItemType == 1||info.wmsFeeCostItemType==30) && info.workIds)
			{
				info.workId = info.workIds[0];
				if (info.workIds.length > 1)
				{
					info.workIdSub = info.workIds[1];
				}
			}
			let param = this.common.copyObj(this.info);
			param.shareCostDataList = this.common.copyObj(this.shareCostDataList);
			param.costList = this.common.copyObj(this.costList);
			param.monthCostList = this.monthCostList;
			param.equipmentCostList = this.equipmentCostList;
			param.tdName = this.tdName;
			await this.common.postUrl("wmsCostService", 'saveFeeCost', param, null, null, '', true);
			this.$message.success("保存成功！");
			this.closePage();
		},
		closePage()
		{
			this.$emit("closeTab", this.$route.meta.id,true);
		},
		forceUpdate(){
			this.$forceUpdate();
		}
	},
}
