import enumData from "@/page/pt/enum.js"
import mycity from '@/components/mycity/mycity.vue'

export default {
	data()
	{
		return {
			enumData: enumData,
			order: this.initOrder(),
			customerData: [],//客户
			routeData: [],//客户下面的所有线路
			goodsGroupData:this.initGoodsGroupData(),//货物分组的组集合
			rfqQuoteTypeData: [],//报价类型
			quoteLevelData: [],//报价级别
			workData: [],//客户下面的所有作业点
			beginWorkData:[],//起始点仓库数据
			endWorkData:[],//目的地
			workList: this.initWorkList(),//作业点数据
			requirementList: [],//作业要求
			quoteList: [],//报价数据
			billingTypeData: [],//计费方式
			quoteVehicleTypeData:[],//报价车型
			vehicleLengthData: [],//车长
			feeTypeData: [],//费用类型
			rangeUnitData: [],//单位
			serviceAreasData: [],//服务区域
			supplierTypeData: [],//供应商类型
			mainBusinessData: [],//主营业务
			supplierData: [],//竞价供应商
			showDistance: false,
			quoteLevelDisabled: false,
			billingTypeDisabled22: false,
			begin: this.initBeginWork(),
			end: this.initEndWork(),
			tenantTip: '请选择客户',
			routeTip: '请选择线路',
		}
	},
	mounted() {},
	components: {
		mycity,
	},
	methods:{
		async initStaticData(isInit)
		{
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
			let rfqQuoteTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"RFQ_QUOTE_TYPE"});
			this.rfqQuoteTypeData = [];
			for (let i = 0; i < rfqQuoteTypeData.length; i++)
			{
				let item = rfqQuoteTypeData[i];
				if (item.codeValue != 4)
					this.rfqQuoteTypeData.push(item);
			}
			this.quoteLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"QUOTE_LEVEL"});
			this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"FEE_TYPE"});
			this.rangeUnitData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"RANGE_UNIT"});
			this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
			this.vehicleLengthData.unshift({codeValue: "0", codeName: "通用"});
			this.vehicleLengthData.forEach(item => {item.disabled = false;});
			this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
			this.quoteVehicleTypeData.unshift({codeValue: "0", codeName: "通用"});
			this.quoteVehicleTypeData.forEach(item => {item.disabled = false;});
			this.serviceAreasData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"SERVICE_AREAS"});
			//仓配查询仓库数据
			this.beginWorkData = await this.common.postUrl("storeHouseBizTF","queryStoreHouseList", {});
			await this.loadSupplierData();
			await this.loadBillingTypeData('BILLING_TYPE_ORDER');

			this.supplierTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SUPPLIER_TYPE"});
			this.mainBusinessData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "MAIN_BUSINESS"});
			if (isInit)
			{
				this.$nextTick(() => {
					this.addRequirement();
					this.addQuoteItem();
				});
			}
			return true;
		},
		initOrder(tenantId)
		{
			return this.order = {
				tenantId: tenantId,
				routeId: '',
				goodsId: [],
				validDate: [],
				rfqQuoteType: '1',//默认整车
				quoteLevel: '1',//默认作业点
				accountPeriod: '',
				predictDistance: '',
				predictTime: '',
				serviceAreas: [],
				supplierTenantId: [],
				smsFlag:false,
			};
		},
		initQuoteItem()
		{
			return {
				billingType: '',
				quoteVehicleType: '',
				vehicleLength: '',
				feeType: '',
				rangeUnit: '',
				rangeStart: '',
				rangeEnd: '',
				vehicleCount: '',
				billingTypeDisabled: false,
				vehicleLengthDisabled: false,
				vehicleCountDisabled: false,
				quoteVehicleTypeData: this.common.copyObj(this.quoteVehicleTypeData),
				vehicleLengthData: this.common.copyObj(this.vehicleLengthData),
				feeTypeData: this.common.copyObj(this.feeTypeData),
				rangeUnitData: this.common.copyObj(this.rangeUnitData),
			};
		},
		initGoodsGroupData()
		{
			return this.goodsGroupData = [{
				label: '全部货物',
				goodsData: [{goodsId: "0", goodsName: "通用"}]
			}, {
				label: '线路常用货物',
				goodsData: []
			}, {
				label: '客户所有货物',
				goodsData: [],
			}, {
				label: '客户包装货物',
				goodsData: [],
			}, {
				label: '仓储货物',
				goodsData: [],
			}];
		},
		initWorkList()
		{
			this.workList = [
				this.initSingletonWork('起始地'),
				this.initSingletonWork('目的地')
			];
			this.$nextTick(() => {
				for (let i = 0; i < this.workList.length; i++)
				{
					let refs = this.getRef(i);
					if (refs && refs[0])
						refs[0].cleanData();
				}
			});
			return this.workList
		},
		initBeginWork()
		{
			return this.begin = {
				workId: null,
				workAddressStr: ''
			}
		},
		initEndWork()
		{
			return this.end = {
				workId: null,
				workAddressStr: ''
			}
		},
		initSingletonWork(name)
		{
			return {
				workId: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				workAddressStr: '',
				name: name
			}
		},
		initWorkDisabled()
		{
			this.workData.forEach(item => {
				item.disabled = this.workList.filter(w => item.workId == w.workId).length > 0;
			});
		},

		/******************************************************************** 业务处理 上面都是初始化 ********************************************************************/
		isExistTenant(tenantId)
		{
			let result = false;
			for (let i = 0; i < this.customerData.length; i++)
			{
				let item = this.customerData[i];
				if (item.tenantId == tenantId && item.name != tenantId)
				{
					result = true;
					break;
				}
			}
			return result;
		},
		isExistRoute(routeId)
		{
			let result = false;
			for (let i = 0; i < this.routeData.length; i++)
			{
				let item = this.routeData[i];
				if (item.routeId == routeId && item.routeName != routeId)
				{
					result = true;
					break;
				}
			}
			return result;
		},

		/**
		 * 改变客户
		 * @param tenantId
		 * @returns {Promise<void>}
		 */
		async changeTenant(tenantId)
		{
			if (tenantId && !this.isExistTenant(tenantId))
			{
				if (this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK)
				{
					this.order.tenantId = '';
					if (this.order.rfqQuoteType == 3)
						this.$message.error("仓配报价不允许手动填写客户！");
					else
						this.$message.error("按作业点的报价级别无法填写客户，请先修改报价级别为按区域！");
					this.$forceUpdate();
					return;
				}
			}
			this.order.routeId = '';
			this.order.goodsId = null;
			this.routeData = [];
			this.workData = [];
			await this.initAllWorkData();
			if (tenantId && this.isExistTenant(tenantId))
			{
				/** 客户的线路货物数据 */
				this.goodsGroupData[1].goodsData = [];
				/** 客户的作业点数据 */
				this.workData = await this.loadWorkDataByTenantId(tenantId);
				/** 客户的线路数据 */
				this.routeData = await this.loadRouteDataByTenantId(tenantId);
				/** 客户的货物数据 */
				this.goodsGroupData[2].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
				/** 客户的包装货物数据 */
				this.goodsGroupData[3].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.PACK_GOODS);
				/** 客户的仓储货物数据 */
				this.goodsGroupData[4].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.WAREHOUSE_GOODS);
			}
			else
			{
				this.initGoodsGroupData();
			}
			this.$forceUpdate();
		},
		async loadWorkDataByTenantId(tenantId)
		{
			if (this.common.isBlank(tenantId))
				return [];
			let data = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId});
			data.forEach(item => item.disabled = false);
			return data;
		},
		async loadRouteDataByTenantId(tenantId)
		{
			if (this.common.isBlank(tenantId))
				return [];
			return await this.common.postUrl("routeTF", "loadRouteSelectByTenantId", {tenantId}, null, null, null, true);
		},
		async loadGoodsDataByTenantId(tenantId, type)
		{
			if (this.common.isBlank(tenantId))
				return [];
			let data = await this.common.postUrl("workGoodsTF", "queryGoodsDataByTenantId", {tenantId,type});
			data.forEach(item => item.disabled = false);
			return data;
		},
		/**
		 * 改变线路
		 * 加载线路相关发作业点、常用货物等
		 */
		async changeRoute(routeId)
		{
			if(this.common.isBlank(routeId)) return;
			if (routeId && !this.isExistRoute(routeId))
			{
				if (this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK)
				{
					this.order.routeId = '';
					if (this.order.rfqQuoteType == 3)
						this.$message.error("仓配报价不允许手动填写线路！");
					else
						this.$message.error("按作业点的报价级别无法填写线路，请先修改报价级别为按区域！");
					this.$forceUpdate();
					return;
				}
				this.goodsGroupData[1].goodsData = [];
			}
			else
			{
				if (this.order.quoteLevel == enumData.quoteLevel.PRESS_REGION)
				{
					this.$message.warning("当前报价级别:按区域,需要按线路作业点请修改报价级别：按作业点！");
					return;
				}
				/** 加载线路作业点数据 */
				this.workList = await this.loadWorkListByRouteId(routeId);
				/** 加载线路常用货物数据 */
				this.goodsGroupData[1].goodsData = await this.loadGoodsListByRouteId(routeId);
				this.changeWorkListName();
				await this.syncWorkListDistance(true);
			}
		},
		async loadWorkListByRouteId(routeId)
		{
			return await this.common.postUrl("routeTF", "loadWorkByRouteId", {routeId});
		},
		async loadGoodsListByRouteId(routeId)
		{
			if (!routeId)
				return [];
			return await this.common.postUrl("routeTF", "loadGoodsByRouteId", {routeId});
		},
		async changeRfqQuoteType()
		{
			await this.initAllWorkData();
			this.quoteList = [];
			await this.addQuoteItem();
			this.quoteLevelDisabled = this.order.rfqQuoteType == enumData.rfqQuoteType.WMS;
			if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
			{
				if (this.order.quoteLevel == enumData.quoteLevel.PRESS_REGION)
					this.order.quoteLevel = enumData.quoteLevel.PRESS_WORK + "";
				this.quoteLevelDisabled = true;
			}
			await this.loadBillingTypeData(
					this.order.rfqQuoteType == enumData.rfqQuoteType.WMS
					? 'BILLING_TYPE_WMS'
					: this.order.rfqQuoteType == enumData.rfqQuoteType.LD
					? 'QUOTE_BILLING_TYPE'
					: 'BILLING_TYPE_ORDER');
			if (this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK
					&& this.common.isNotBlank(this.order.routeId))
				await this.changeRoute(this.order.routeId)
			else
				await this.syncWorkListDistance(true);
		},
		async loadBillingTypeData(codeType)
		{
			this.billingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType});
		},
		async loadSupplierData(flag)
		{
			let param = {
				serviceAreas: this.order.serviceAreas,
				supplierType: this.order.supplierType,
				mainBusiness: this.order.mainBusiness,
			};
			this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", param);
			this.supplierData.unshift({tenantId: 0, supplierName: "全部"});
			if (flag)
				this.changeSupplier();
		},
		async changeQuoteLevel()
		{
			await this.initAllWorkData();
			if (this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK
			 && this.common.isNotBlank(this.order.routeId))
				await this.changeRoute(this.order.routeId)
			else
				await this.syncWorkListDistance(true);
			if (this.order.quoteLevel == enumData.quoteLevel.PRESS_REGION)
			{
				this.tenantTip = '请输入客户';
				this.routeTip = '请输入线路';
			}
			else
			{
				this.tenantTip = '请输入/选择客户';
				this.routeTip = '请输入/选择线路';
			}
			this.$forceUpdate();
		},
		async initAllWorkData()
		{
			this.initWorkList();
			this.initBeginWork();
			this.initEndWork();
			this.workData.forEach(item => item.disabled = false);
			this.beginWorkData.forEach(item => item.disabled = false);
			this.endWorkData.forEach(item => item.disabled = false);
			this.order.predictDistance = '';
			this.order.predictTime = '';
			this.$forceUpdate();
		},
		changeWorkListName()
		{
			for (let i = 0; i < this.workList.length; i++)
			{
				let work = this.workList[i];
				if (i === 0)
					work.name = '起始地';
				else
				{
					work.name = '中途点' + i;
					if (i === this.workList.length - 1)
						work.name = '目的地';
				}
			}
			this.$forceUpdate();
		},
		/**
		 * 改变起始地仓库
		 * @param work
		 * @returns {Promise<void>}
		 */
		async changeBeginWork(work)
		{
			if (!work.workId)
				this.begin.workAddressStr = '';
			this.end.workId = null;
			this.end.workAddressStr = '';
			this.endWorkData = [];
			if (work.workId)
			{
				let works = this.beginWorkData.filter(item => item.workId == work.workId);
				this.begin.workAddressStr = works[0].workAddressStr;

				await this.loadEndWork(work.workId);
				if (this.endWorkData.length === 1)
				{
					this.end.workId = this.endWorkData[0].workId;
					this.end.workAddressStr = this.endWorkData[0].workAddressStr;
					await this.syncWorkListDistance(true);
				}
				this.$forceUpdate();
			}
			else
				await this.syncWorkListDistance(true);
		},
		async changeEndWork(work)
		{
			if (work.workId)
			{
				let works = this.endWorkData.filter(item => item.workId == work.workId);
				this.end.workAddressStr = works[0].workAddressStr;
			}
			await this.syncWorkListDistance(true);
		},
		async loadEndWork(beginWorkId)
		{
			this.endWorkData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {isWmsWork: 1,storeId: beginWorkId});
		},
		changeBillingType(quote)
		{
			if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
			{
				quote.vehicleLengthDisabled = quote.billingType == 2;
				//按月的才能填车辆数
				quote.vehicleCountDisabled = quote.billingType != 3;
				if (quote.billingType != 3)//按月的才能填车辆数
					quote.vehicleCount = null;
				if (quote.billingType == 2)
					quote.vehicleLength = null;
				quote.vehicleLengthData.forEach(item => {item.disabled = false;});
				this.$forceUpdate();
				let count = 0;
				if (quote.billingType == 3)
				{
					for (let i = 0; i < this.quoteList.length; i++)
					{
						let item = this.quoteList[i];
						if (item.billingType == 3) count++
					}
				}
				if (count > 1)
				{
					this.$message.warning("仓配报价只能有一条按月的！");
				}
			}
			else
				quote.vehicleLengthDisabled = false;
		},
		async addWork()
		{
			if (this.workList.length >= 5)
			{
				this.$message.error("作业点太多了，不允许增加！");
				return false;
			}
			if (this.order.rfqQuoteType == 3)
			{
				this.$message.error("仓配报价，不允许增加中途点！");
				return false;
			}
			let index = this.workList.length - 1;
			let work = this.initSingletonWork('中途点' + index);
			this.workList.splice(this.workList.length - 1, 0, work);
		},
		async removeWork(work, index)
		{
			let message = this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK ? '作业点！' : '区域！';
			if (this.workList.length <= 2)
			{
				this.$message.error("至少需要保留两个" + message);
				return false;
			}
			this.workList.splice(index, 1);
			this.initWorkDisabled();
			this.changeWorkListName();
			await this.syncWorkListDistance(true);
		},
		addRequirement()
		{
			if (this.requirementList.length >= 20)
			{
				this.$message.error("作业要求太多了，不允许增加了！");
				return false;
			}
			if (this.order.rfqQuoteType != 4)
				this.requirementList.push({content: ''});
		},
		removeRequirement(index)
		{
			if (this.order.rfqQuoteType != 4)
				this.requirementList.splice(index, 1);
		},
		async addQuoteItem()
		{
			if (this.quoteList.length >= 20)
			{
				this.$message.error("不允许超过20条报价信息！");
				return false;
			}
			this.quoteList.push(this.initQuoteItem());
		},
		removeQuoteItem(index)
		{
			if (this.quoteList.length <= 1)
			{
				this.$message.error("至少需要保留一条报价明细！");
				return false;
			}
			this.quoteList.splice(index, 1);
		},
		changeQuoteVehicleType(data)
		{
			if (this.changeEvent(data.quoteVehicleTypeData, data.quoteVehicleType))
			{
				data.quoteVehicleType = [];
				data.quoteVehicleType.push("0");
			}
		},
		changeVehicleLength(data)
		{
			if (this.changeEvent(data.vehicleLengthData, data.vehicleLength))
			{
				data.vehicleLength = [];
				data.vehicleLength.push("0");
			}
		},
		changeEvent(selectList, selectData)
		{
			let initAll = false;
			selectList.forEach(el => {
				let find = false;
				let selectAll = false;
				selectData.forEach(item => {
					if (item == el.codeValue)
						find = true;
					if (item == 0)
						selectAll = true;
				})
				initAll = selectData.length > 0 && selectAll;
				el.disabled = find || selectAll;
			})
			return initAll;
		},
		changeFeeType(index)
		{
			let item = this.quoteList[index];
			if(item.feeType == 1 || item.feeType == 3)
			{
				item.billingType = '1';
				this.order.goodsId = ['0'];
				item.billingTypeDisabled = true;
			}
			else
			{
				item.billingTypeDisabled = false;
			}
		},
		async changeGoods()
		{
			if (this.order.goodsId && this.order.goodsId.length > 0)
			{
				let selectAll = this.order.goodsId.filter(item => item == 0);
				if (selectAll.length > 0)
				{
					this.order.goodsId = [];
					this.order.goodsId.push("0");
					this.goodsGroupData.forEach(goodsData => {
						goodsData.goodsData.forEach(item => {
							item.disabled = true;
						});
					});
				}
				else
				{
					this.goodsGroupData.forEach(goodsData => {
						goodsData.goodsData.forEach(item => {
							item.disabled = this.order.goodsId.filter(goodsId => goodsId == item).length > 0;
						});
					});
				}
			}
			else
			{
				this.goodsGroupData.forEach(goodsData => {
					goodsData.goodsData.forEach(item => {
						item.disabled = false;
					});
				});
			}
		},
		changeSupplier()
		{
			if (this.order.supplierTenantId && this.order.supplierTenantId.length > 0)
			{
				let selectAll = this.order.supplierTenantId.filter(item => item == 0);
				if (selectAll.length > 0)
				{
					this.order.supplierTenantId = [];
					this.order.supplierTenantId.push(0);
					this.supplierData.forEach(item => {
						item.disabled = true;
					});
				}
				else
				{
					this.supplierData.forEach(item => {
						item.disabled = this.order.supplierTenantId.filter(tenantId => tenantId == item.tenantId).length > 0;
					});
				}
			}
			else
			{
				this.supplierData.forEach(item => {
					item.disabled = false;
				});
			}
		},
		async changeWork(index, work, isAuto)
		{
			if (work.workId)
			{
				let works = this.workData.filter(item => item.workId == work.workId);
				work.workAddressStr = works[0].workAddressStr;
			}
			if (!isAuto)
				await this.syncWorkListDistance(true);
		},
		async selectCallback(index, work)
		{
			let ref = this.getRef(index)[0];
			let address = ref.getData();
			work.provinceId = address.ProvinceId;
			work.cityId = address.CityId;
			work.districtId = address.DistrictId;
			work.workAddressStr = address.ProvinceName + address.CityName + address.DistrictName;
			for (let i = 0; i < this.workList.length; i++)
			{
				let item = this.workList[i];
				if (i != index)
				{
					if (item.cityId == work.cityId && this.common.isNotBlank(work.cityId))
					{
						if (this.common.isNotBlank(item.districtId))
						{
							if (item.districtId == work.districtId)
								this.$message.error("省市区:" + work.workAddressStr + ",与" + item.name + "的相同,请修改!");
						}
						else
						{
							if (item.districtId == work.districtId)
								this.$message.error("省市:" + work.workAddressStr + ",与" + item.name + "的相同,请修改!");
						}
					}
				}
			}
			await this.syncWorkListDistance(true);
		},
		/**
		 * 提示选择客户
		 * @param type 1选择线路 2选择作业点 3货物
		 * @returns {boolean}
		 */
		selectCustomerTip(type)
		{
			if (type === 1 && this.isExistTenant(this.order.tenantId))
			{
				if (this.common.isNotBlank(this.order.tenantId))
				{
					if (this.common.isBlank(this.routeData) || this.routeData.length === 0)
						this.$confirm("当前客户还没有线路,是否需要前往新增线路？", "提示").then(() =>{
							this.$emit("openTab",{
								urlId: 'addRoute' + this.order.tenantId,
								query: this.order,
								urlName: "新增线路",
								urlPathName: "/route",
								urlPath: "/pt/cm/customer/route/addRoute.vue"});
						}).catch(() =>{});
				}
				else
					this.$message.warning("请先选择客户加载线路数据！");
			}
			else if (type === 2 && this.isExistTenant(this.order.tenantId))
			{
				if (this.common.isNotBlank(this.order.tenantId))
				{
					if (this.common.isBlank(this.workData) || this.workData.length === 0)
						this.$confirm("当前客户还没有作业点,是否需要前往新增作业点？", "提示").then(() =>{
							this.$emit("openTab",{
								urlId: 'workInfoManage' + this.order.tenantId,
								query: {tenantId: this.order.tenantId},
								urlName: "作业点配置",
								urlPathName: "/customer",
								urlPath: "/pt/cm/customer/workInfoManage.vue"});
						}).catch(() =>{});
				}
				else
					this.$message.warning("请先选择客户加载作业点数据！");
			}
		},
		selectSupplierTip()
		{
			if (this.order.serviceAreas && this.order.serviceAreas.length > 0
			&& this.supplierData.length === 0)
			{
				this.$message.warning("您选择的服务区域没有供应商，请删除供应商服务区域！");
			}
		},
		checkOrderData()
		{
			if (!this.checkOrderCommonData())
				return false;
			if (!this.checkOrderWorkData())
				return false;
			if (!this.checkOrderQuoteData())
				return false;
			return true;
		},
		checkOrderCommonData()
		{
			if (this.common.isBlank(this.order.rfqQuoteType))
			{
				this.$message.error("请选择报价类型！");
				return false;
			}
			if (this.common.isBlank(this.order.quoteLevel))
			{
				this.$message.error("请选择报价级别！");
				return false;
			}
			if (this.common.isBlank(this.order.validDate) || this.order.validDate.length === 0)
			{
				this.$message.error("请选择询价截止时间！");
				return false;
			}
			if (this.common.isBlank(this.order.supplierTenantId) || this.order.supplierTenantId.length === 0)
			{
				this.$message.error("请选择竞价供应商！");
				return false;
			}
			return true;
		},
		checkOrderWorkData()
		{
			let selectWork = this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK;
			let message = selectWork ? '作业点！' : '区域！';
			if (this.workList.length < 2)
			{
				this.$message.error("请选择至少两个" + message);
				return false;
			}
			if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS && this.workList.length > 2)
			{
				this.$message.error("仓配询价只能有起始地目的地,请修改!");
				return false;
			}
			if (this.order.rfqQuoteType != enumData.rfqQuoteType.WMS)
			{
				for (let i = 0; i < this.workList.length; i++)
				{
					let work = this.workList[i];
					if (selectWork)
					{
						if (this.common.isBlank(work.workId))
						{
							this.$message.error("请选择第" + ( i + 1) + "个作业点！");
							return false;
						}
					}
					else
					{
						if (this.common.isBlank(work.cityId))
						{
							this.$message.error("请选择第" + ( i + 1) + "个省市区！");
							return false;
						}
					}
				}
			}
			else
			{
				if (this.common.isBlank(this.begin.workId))
				{
					this.$message.error("请选择起始地！");
					return false;
				}
				if (this.common.isBlank(this.end.workId))
				{
					this.$message.error("请选择起始地！");
					return false;
				}
			}
			return true;
		},
		checkOrderQuoteData()
		{
			let count = 0;
			for (let i = 0; i < this.quoteList.length; i++)
			{
				let quote = this.quoteList[i];
				if (this.order.rfqQuoteType == enumData.rfqQuoteType.ZC)
				{
					if (this.common.isBlank(quote.billingType))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的计费方式！");
						return false;
					}
					if (this.common.isBlank(quote.quoteVehicleType)  || quote.quoteVehicleType.length === 0)
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的报价车型！");
						return false;
					}
					if (this.common.isBlank(quote.vehicleLength)  || quote.vehicleLength.length === 0)
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的车长！");
						return false;
					}
				}
				else if (this.order.rfqQuoteType == enumData.rfqQuoteType.LD)
				{
					if (this.common.isBlank(quote.feeType))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的费用类型！");
						return false;
					}
					if (this.common.isBlank(quote.billingType))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的计费方式！");
						return false;
					}
					if (this.common.isBlank(quote.rangeUnit))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的单位！");
						return false;
					}
					if(this.common.isNotBlank(quote.rangeEnd) && this.common.isBlank(quote.rangeStart)){
						this.$message.error("请输入第"+(i+1)+"行起始区间值！");
						return false;
					}
					if(this.common.isNotBlank(quote.rangeStart) && this.common.isNotBlank(quote.rangeEnd) &&
						((Number(quote.rangeStart)>Number(quote.rangeEnd) || quote.rangeStart==quote.rangeEnd))){
						this.$message.error("请输入第"+(i+1)+"行正确的区间值！");
						return false;
					}
					// if (this.common.isBlank(quote.rangeStart))
					// {
					// 	this.$message.error("请选择第" + (i + 1) + "条报价的数量区间最小值！");
					// 	return false;
					// }
					// if (this.common.isBlank(quote.rangeEnd))
					// {
					// 	this.$message.error("请选择第" + (i + 1) + "条报价的数量区间最大值！");
					// 	return false;
					// }
				}
				else
				{
					if (this.common.isBlank(quote.billingType))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的计费方式！");
						return false;
					}
					if (this.common.isBlank(quote.quoteVehicleType)  || quote.quoteVehicleType.length === 0)
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的报价车型！");
						return false;
					}
					if (quote.billingType != 2 && (this.common.isBlank(quote.vehicleLength)  || quote.vehicleLength.length === 0))
					{
						this.$message.error("请选择第" + (i + 1) + "条报价的车长！");
						return false;
					}
				}
			}
			if (count > 1)
			{
				this.$message.error("仓配报价只能有一条按月的！");
				return false;
			}
			return true;
		},
		getRef(index)
		{
			let that = this;
			return eval('that.$refs.city' + index);
		},
		async syncWorkListDistance(isCalc)
		{
			this.showDistance = false;
			this.order.predictDistance = '';
			this.order.predictTime = '';
			if (!isCalc)
				return;
			let workList = [];
			if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
			{
				if (this.common.isNotBlank(this.begin.workId) && this.common.isNotBlank(this.end.workId))
				{
					workList.push({workId: this.begin.workId});
					workList.push({workId: this.end.workId});
				}
				else
					return;
			}
			else
			{
				// if (this.order.quoteLevel == enumData.quoteLevel.PRESS_WORK)
				// {
					let count = 0;
					for (let i = 0; i < this.workList.length; i++)
					{
						if (this.workList[i].workId||this.common.isNotBlank(this.workList[i].workAddressStr))
						{
							count++;
							workList.push(this.workList[i]);
						}
					}
					if (count < 2)
						return;
				// }
				// else
				// 	return;
			}
			let data =  await this.common.postUrl("orderTF", "getWorkListDistance", {"workList": workList});
			if (data)
			{
				this.showDistance = true;
				this.order.predictDistance = data.distance;
				this.order.predictTime = data.duration;
			}
		},
		forceUpdate()
		{
			this.$forceUpdate();
		},
	},
}
