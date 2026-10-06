import enumData from "@/page/pt/enum.js"

export default {
	data()
	{
		return {
			order: this.initOrder(this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString()),//订单数据
			fee: this.initFee(),//订单费用
			customerData: [],//客户
			orderTypeData: [],//订单类型
			workTypeData: [],//作业点作业类型
			classTypeData: [],//货物类别
			packTypeData: [],//货物包装
			vehicleTypeData: [],//车型
			vehicleLengthData: [],//车长
			billingTypeData: [],//计费方式
			payModeData: [],//结算方式
			isUrgentData: [],//是否加急
			quoteVehicleTypeData:[],
			routeData: [],//客户下面的所有线路
			workData: [],//客户下面的所有作业点
			goodsGroupData:this.initGoodsGroupData(),//货物分组的组集合
			workList: this.initOrderWork(),//订单作业点数据
			goodsList: this.initOrderGoods(),//订单货物
			beginWorkData: this.initBeginWork(),//货物的提货点
			endWorkData: this.initEndWork(),//货物的卸货点
			goodsMap: new Map(),//货物id和名称
			successData: {},//成功界面提示信息
			showEdit: false,//编辑作业点顺序窗口
			isEdit: false,//页面字段是否可编辑
			pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,//初始化日期快捷
			limitPickerOptions:this.common.copyObj(enumData.DATE_SHORTCUT_OPTIONS),//初始化日期快捷，客户下单时间特殊处理
			workIdSet: new Set,//作业点ID集合
			isMatch: true,//是否匹配报价
			cdtRegionArray: [],
			farthestDistanceShow: false,
			bizTypeData:[],

			// 新增作业点
			workInfo: {
                workinfoType: '1',
            },
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            mapPointDraw: null,//地图标点位置
            workVisible: false,//显示弹窗
            isShowMap: false,//显示地图
            isShowMapDraw: false,//显示电子围栏
            disabled: false,//禁用弹窗内容
            isOverlays: false,//禁用电子围栏输入框
            isNotDistrict: true,//地图区域没有返回提供选择
            showMapBotton: false,//地图按钮显示
            isDraw: true,//围栏绘制按钮显示
            title:"新增作业点",
            electricPlace:"不填默认300米",
            mapPoint:null,
            drawPoints:null,
            showSelWork: false,
            identifyText:'',
            showIdentify:false,
            currentIndex: -1,
			
			goodsVisible: false,//显示弹窗
			goodsData: [],
			goodsInfo: {},
			showSingleVolume: false,
			classData: [],//所有货物类别
			packingTypeData: [],//所有货物包装类型
			currentGoodsIndex: -1,
			
		}
	},
	async mounted()
	{
		await this.initData();
		this.cdtRegionArray = await this.loadCdtRegion();

		let that = this;
		this.limitPickerOptions.disabledDate = function (date){
			var now =  new Date();
			if(now.getDate()>12){
				if(date<that.preMonth(now)){
					return true;
				}
			}else{
				var year = now.getFullYear();
				var month = now.getMonth();
				if(month==0){
					month = 11;
					year = year-1;
				}else{
					month -= 1;
				}

				var dateTime = new Date(year,month,1);
				if(date<dateTime){
					return true;
				}
			}
			return false;
		};

	},
	methods:{
		preMonth(date) {
			var dateTime=new Date(date.getFullYear(),date.getMonth(),1);
			return dateTime;
		},

		/**
		 * 初始化基础数据
		 */
		async initData()
		{
			await this.loadCustomerData();//加载客户数据
			//订单类型
			this.orderTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_TYPE"});
			//作业类型
			this.workTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WORK_TYPE"});
			//货物类别
			this.classTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "GOODS_CLASS_TYPE"});
			//货物包装
			this.packTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "GOODS_PACKING_TYPE"});
			//计费方式
			this.billingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BILLING_TYPE_ORDER"});
			//车型
			this.vehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE"});
			//车长
			this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_LENGTH"});
			//是否加急
			this.isUrgentData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WHETHER"});
			//报价车型
			this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE_QUOTE"});
			//结算方式
			let data = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_MODE"});
			for (let i = 0; i < data.length; i++)
			{
				if (!(data[i].codeValue == 1 || data[i].codeValue == 4)) { data.splice(i, 1); i--; }
			}
			this.payModeData = data;
			this.bizTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BIZ_TYPE"});
			this.provinceData = await this.common.postUrl("selectStaticDataTF", "selectProvince", {});
			
			this.classData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_CLASS_TYPE"});
			this.packingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"});
		},
		/**
		 * 初始化订单数据
		 * @returns {[]}
		 */
		initOrder(tenantId, orderId, orderNum, orderState, orderStateName, createDate, createUserName)
		{
			this.order = {
				orderId: this.common.isBlank(orderId) ? '' : orderId,
				tenantId: this.common.isBlank(tenantId) ? '' : tenantId,
				orderNum: this.common.isBlank(orderNum) ? '' : orderNum,
				orderState: this.common.isBlank(orderState) ? '' : orderState,
				orderStateName: this.common.isBlank(orderStateName) ? '' : orderStateName,
				createDate: this.common.isBlank(createDate) ? '' : createDate,
				createUserName: this.common.isBlank(createUserName) ? '' : createUserName,
				routeId: '',
				routeName: '',
				bizType: '',
				orderType: '1',//默认整车
				isUrgent: '0',//默认不加急
				haveReceipt: '0',//默认没有回单
				custOrderNum: '',
				farthestDistanceInfo: '',
				customerOrderDate: '',
				cdtRegionId: '',
				orderTypeName: '',
				bizTypeName: '',
				isReturnTrip: this.$route.query.isReturnTrip==1?true:false, // 回程单标识，默认false
                ownVehicleScheduleId:this.$route.query.ownVehicleScheduleId,//自有车运力ID
			};
			return this.order;
		},
		/**
		 * 初始化费用数据
		 * @returns {[]}
		 */
		initFee()
		{
			this.fee = {
				billingType: '1',//默认按整车
				payMode: '1',//默认月结
				goodsCountSum: 0,//总件数
				goodsWeightSum: 0,//总重量
				goodsVolumeSum: 0,//总体积
				goodsActualCountSum: 0,//总实际件数
				netWeight: '',//净重
				grossWeight: '',//毛重
				volume: '',//体积
				freightPrice: '',//单价
				pointFee: '',//点位费单价
				totalPointFee: 0,//点位费合计
				freight: '',//运费
				premiumFee: '',//保险费
				pickupFee: '',//提货费
				deliveryFee: '',//送货费
				loadingFee: '',//装货费
				dischargeFee: '',//卸货费
                emptyDrivingFee: '',//放空费
				standbyFee: '',//压夜费
				otherFee: '',//其他费
				totalFee: 0,//费用合计
				statementFee: 0,//异动费用合计
				cdtFee: '',//协同费用
				totalStatementFeeSum: 0,//费用合计+异动合计 总金额
				payModeName: '',
			};
			return this.fee;
		},
		/**
		 * 初始化线路下拉
		 * @returns {void}
		 */
		initRoute()
		{
			return this.routeData = [];
		},
		/**
		 * 初始化订单作业点下拉
		 * @returns {void}
		 */
		initWork()
		{
			return this.workData = [];
		},
		/**
		 * 初始化货物的分组数据
		 */
		initGoodsGroupData()
		{
			return this.goodsGroupData = [{
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
		/**
		 * 初始化订单作业点数据
		 * @returns {[{workType: string, workId: string}, {workType: string, workId: string}]}
		 */
		initOrderWork()
		{
			this.workList = [this.initSingletonWork(1, 1), this.initSingletonWork(2, 2)];
			return this.workList;
		},
		/**
		 * 初始化单个作业点实例
		 * @param workType
		 * @param workOrder
		 * @returns {{workDate: string, phone: string, workAddressStr: string, workType: *, bill: string, linkmanName: string, workId: string}}
		 */
		initSingletonWork(workType, workOrder)
		{
			return {
				workId: '',
				workType: this.common.isBlank(workType) ? '3' : workType.toString(),
				workDate: '',
				linkmanName: '',
				bill: '',
				phone: '',
				workAddressStr: '',
				workOrder: this.common.isBlank(workOrder) ? '' : workOrder,
				disabled: false
			}
		},
		/**
		 * 初始化订单货物数据
		 * @returns {[{}]}
		 */
		initOrderGoods()
		{
			this.goodsList = [ this.initSingletonGoods() ];
			return this.goodsList;
		},
		/**
		 * 初始化单个货物实例
		 */
		initSingletonGoods()
		{
			return {
				goodsId: '',
				classId: '',
				packingType: '',
				beginWorkId: '',
				endWorkId: '',
				goodsCount: '',
				goodsWeight: '',
				goodsVolume:'',
				goodsModel:'',
				actualGoodsCount:'',
				piecePrice:'',
			}
		},
		/**
		 * 初始化订单货物提货点下拉
		 * @returns {[{}]}
		 */
		initBeginWork()
		{
			this.beginWorkData = [];
			return this.beginWorkData;
		},
		/**
		 * 初始化订单货物卸货点下拉
		 * @returns {[{}]}
		 */
		initEndWork()
		{
			this.endWorkData = [];
			return this.endWorkData;
		},
		/**
		 *  初始化作业点可选择状态
		 */
		initWorkDisabled()
		{
			this.workData.forEach(item => {
				item.disabled = false;
				this.workList.forEach(itemW => {
					if (item.workId == itemW.workId){ item.disabled = true; }
				})
			});
		},
		/**
		 *  初始化货物可选择状态
		 */
		initGoodsDisabled()
		{
			this.goodsGroupData[0].goodsData.forEach(item => {
				item.disabled = false;
			});
			this.goodsGroupData[1].goodsData.forEach(item => {
				item.disabled = false;
			});
			this.goodsGroupData[2].goodsData.forEach(item => {
				item.disabled = false;
			});
			this.goodsGroupData[3].goodsData.forEach(item => {
				item.disabled = false;
			});
		},
		/**
		 * 初始化订单作业点顺序
		 */
		initWorkOrder()
		{
			for (let i = 0; i < this.workList.length; i++)
			{
				this.workList[i].workOrder = i + 1;
			}
		},

		/******************************************************************** 业务处理 上面都是初始化 ********************************************************************/

		/**
		 * 加载客户数据
		 */
		async loadCustomerData()
		{
			let isTemporaryCustomer = 0;
			if (this.order.isReturnTrip)
			{
				isTemporaryCustomer = 1;
			}
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID, isTemporaryCustomer});
		},
		/**
		 * 改变线路
		 * 加载线路相关发作业点、常用货物等
		 */
		async changeRoute(routeId)
		{
			await this.loadRouteDataByRouteId(routeId)
		},
		/**
		 * 加载客户相关数据
		 * 线路
		 * 作业点
		 * 货物
		 * 包装货物
		 */
		async loadCustomerDataByTenantId(tenantId)
		{
			if (this.common.isNotBlank(tenantId))
			{
				/** 客户的线路数据 */
				this.routeData = await this.loadRouteDataByTenantId(tenantId);
				/** 客户的作业点数据 */
				this.workData = await this.loadWorkDataByTenantId(tenantId);
				/** 客户的线路货物数据 */
				this.goodsGroupData[0].goodsData = [];
				/** 客户的货物数据 */
				this.goodsGroupData[1].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
				/** 客户的包装货物数据 */
				this.goodsGroupData[2].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.PACK_GOODS);
				/** 客户的仓储货物数据 */
				this.goodsGroupData[3].goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.WAREHOUSE_GOODS);
				//临时客户的货物
				this.goodsData = await this.loadGoodsDataByTenantId(tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
			}
		},
		/**
		 * 通过客户加载作业点集合
		 * @param tenantId
		 */
		async loadWorkDataByTenantId(tenantId)
		{
			if (this.common.isBlank(tenantId)){ return []; }
			let data = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId: tenantId,isLoadStoreHouse: 1});
			data.forEach(item => item.disabled = false);//默认都是可选择
			return data;
		},
		/**
		 * 通过客户加载线路集合
		 * @param tenantId
		 */
		async loadRouteDataByTenantId(tenantId)
		{
			if (this.common.isBlank(tenantId)){ return []; }
			return await this.common.postUrl("routeTF", "loadRouteSelectByTenantId", {tenantId: tenantId}, null, null, null, true);
		},
		/**
		 * 通过客户加载货物集合
		 * @param tenantId
		 * @param type 1常规  2包装
		 */
		async loadGoodsDataByTenantId(tenantId, type)
		{
			if (this.common.isBlank(tenantId)){ return []; }
			let data = await this.common.postUrl("workGoodsTF", "queryGoodsDataByTenantId", {tenantId: tenantId,type: type});
			data.forEach(item => { item.disabled = false; this.goodsMap.set(item.goodsId, item.goodsName)});//默认都是可选择
			return data;
		},
		/**
		 * 加载线路相关的数据
		 * 作业点
		 * 常用货物
		 */
		async loadRouteDataByRouteId(routeId)
		{
			if(!routeId){
				return;
			}
			let data = this.routeData.filter((item) => { return routeId == item.routeId; });
			this.order.routeName = data[0].routeName;
			this.order.orderType = data[0].orderType;
			if (this.common.isNotBlank(data[0].bizType))
				this.order.bizType = data[0].bizType;
			this.initBeginWork();//初始化货物的提货点下拉集合
			this.initEndWork();//初始化货物的卸货点下拉集合
			/** 加载线路作业点数据 */
			this.workList = await this.loadWorkListByRouteId(routeId);
			/** 加载线路常用货物数据 */
			this.goodsGroupData[0].goodsData = await this.loadGoodsListByRouteId(routeId);
			this.goodsList.forEach(item => {
				item.beginWorkId = '';
				item.endWorkId = '';
			});
			for (let i = 0; i < this.workList.length; i++)
				this.changeWork(this.workList[i], i, true);//更换线路isAuto=true不匹配报价

			this.syncOrderDistance(false);
			this.matchOrderFee(false);//查询完作业点匹配价格

			this.forceUpdate();
		},
		/**
		 * 通过线路加载作业点集合
		 * @param routeId
		 * @returns {Promise<any>}
		 */
		async loadWorkListByRouteId(routeId)
		{
			return await this.common.postUrl("routeTF", "loadWorkByRouteId", {routeId: routeId});
		},
		/**
		 * 通过线路加载常用货物集合
		 * @param routeId
		 * @returns {Promise<any>}
		 */
		async loadGoodsListByRouteId(routeId)
		{
			return await this.common.postUrl("routeTF", "loadGoodsByRouteId", {routeId: routeId});
		},

		/**
		 * 记录最后一次订单类型
		 */
		keepOrderType() { this.order.lastOrderType = this.order.orderType; },

		/**
		 * 改变订单类型
		 * @returns {boolean}
		 */
		async changeOrderType()
		{
			if (this.order.orderType == 3 && this.workList.length > 2)
			{
				this.$message.error("零担订单作业点不可以超过2个，请修改作业点！");
				return false;
			}
			this.matchOrderFee(this.common.isBlank(this.order.tenantId));
		},
		/**
		 * 改变报价车型
		 */
		changeQuoteVehicleType()
		{
			this.matchOrderFee(this.order.orderType == enumData.ORDER_TYPE.LESS_THAN_CARLOAD);//零担不匹配
		},
		/**
		 * 改变车长
		 */
		changeVehicleLength()
		{
			this.matchOrderFee(this.order.orderType == enumData.ORDER_TYPE.LESS_THAN_CARLOAD);//零担不匹配
		},
		/**
		 * 获取报价
		 * @param isNoMatch 是否不执行
		 * @returns {boolean}
		 */
		matchOrderFee(isNoMatch)
		{
			if (!this.isMatch || isNoMatch) return false;

			//没有客户、订单类型、计费方式不匹配
			if (this.common.isBlank(this.order.tenantId) || this.common.isBlank(this.order.orderType)
					|| this.common.isBlank(this.fee.billingType))
				return false;

			if (this.order.orderType != enumData.ORDER_TYPE.LESS_THAN_CARLOAD)
			{
				if (this.common.isBlank(this.fee.vehicleLength) || this.common.isBlank(this.fee.quoteVehicleType))
					return false;  //订单类型是：整车没有车长和报价车型不匹配
			}
			//置空单价
			if (this.fee.billingType != enumData.billingTypeOrder.count)
			{
				this.goodsList.forEach(item => {
					item.piecePrice = "";
				})
			}
			//有效作业点处理
			let count = 0;
			for (let i = 0; i < this.workList.length; i++)
			{
				if (this.common.isNotBlank(this.workList[i].workId))
					count++;
			}
			if (count >= 2)//至少选择两个有效点才去匹配
			{
				let param = this.common.copyObj(this.fee);
				//整车订单没有选择车长不匹配
				param.tenantId = this.order.tenantId;
				param.orderType = this.order.orderType;
				param.workList = this.workList;
				param.goodsList = this.goodsList;

				let that = this;
				that.common.postUrl("ZCQuoteNewTF", "matchOrderFee", param, async function (data)
				{
					that.fee.freightPrice = that.common.isNotBlank(data.feePrice) ? data.feePrice : "";
					that.fee.freight = that.common.isNotBlank(data.freight) ? data.freight : "";
					that.fee.pointFee = that.common.isNotBlank(data.pointFee) ? data.pointFee : "";
					that.fee.pickupFee = that.common.isNotBlank(data.pickupFee) ? data.pickupFee : "";
					that.fee.deliveryFee = that.common.isNotBlank(data.deliveryFee) ? data.deliveryFee : "";

					await that.changePointFee(true);// 有没有点位费都计算一下点位费合计
					if (that.fee.billingType != enumData.billingTypeOrder.count)
					{
					} else//按件数的额外处理
					{
						that.goodsList.forEach(item => {
							item.piecePrice = "";//重置单价
						})
						let goodsQuoteList = data.goodsQuoteList;
						if (that.common.isNotBlank(goodsQuoteList))
						{
							that.goodsList.forEach(item => {
								let goodsBeginEndWorkId = (that.common.isBlank(item.goodsId) ? "0" : item.goodsId ) + "-" + item.beginWorkId + "-" + item.endWorkId;
								let continueFindMaxPrice = true;
								for (let i = 0; i < goodsQuoteList.length; i++)
								{
									let el = goodsQuoteList[i];
									//提货送货处理
									if (that.common.isNotBlank(el.pickupFee) && el.pickupFee > that.fee.pickupFee)
										that.fee.pickupFee = el.pickupFee;
									if (that.common.isNotBlank(el.deliveryFee) && el.deliveryFee > that.fee.deliveryFee)
										that.fee.deliveryFee = el.deliveryFee;

									if (continueFindMaxPrice && el.goodsBeginEndWorkId == goodsBeginEndWorkId)
									{
										item.piecePrice = el.feePrice;
										continueFindMaxPrice = false;
									}
								}
							})
						}
						that.calcGoodsTotalFee();
					}
					that.calcTotalFee();
					that.calcStatementTotalFee();
					that.forceUpdate();
				});
			}
		},

		/**
		 * 改变作业点
		 * @param work
		 * @param index 作业点在订单作业点集合的索引
		 * @param isAuto
		 */
		changeWork(work, index, isAuto)
		{
			this.workData.forEach(item =>
			{
				if (this.common.isNotBlank(work.workId))
				{
					if (work.workId == item.workId){
						item.workTypeName = this.workList[index].workTypeName;
						this.workList[index] = this.common.copyObj(item);//将选择的作业点数据赋值
						this.workList[index].workType = work.workType;
						this.workList[index].workOrder = work.workOrder;
						this.workList[index].workDate = work.workDate;
						if (isAuto)//改单作业点是数据会覆盖订单的 改变客户加载线路的作业点的数据，不加载作业点本身的
						{
							this.workList[index].linkmanName = work.linkmanName;
							this.workList[index].bill = work.bill;
							this.workList[index].phone = work.phone;
						}
						if (work.workType == 1){ this.beginWorkData.push(item); }
						else if(work.workType == 2){ this.endWorkData.push(item); }
						else
						{
							this.beginWorkData.push(item);
							this.endWorkData.push(item);
						}
					}
				}
				else
				{
					this.workList[index] = this.initSingletonWork(work.workType);
				}
			});
			this.removeGoodsWorkItemNonExistWorkList(this.beginWorkData, 1);//移除货物的提卸货点（不存在订单作业点集合）
			this.removeGoodsWorkItemNonExistWorkList(this.endWorkData, 2);//移除货物的提卸货点（不存在订单作业点集合）
			this.setGoodsBeginWorkIdAndEndWorkId();//作业点中只有一个提货/卸货的货物的所有提货点/卸货点都是这个
			this.initWorkDisabled();//初始化作业点可选状态
			this.matchOrderFee(isAuto);//自动改变不匹配
			this.syncOrderDistance(isAuto);
			this.forceUpdate();
		},
		/**
		 * 移除每条货物的提卸货点（不存在订单作业点集合）
		 * @param collection
		 * @param type 1 提货点 2 卸货点
		 */
		removeGoodsWorkItemNonExistWorkList(collection, type)
		{
			let set = new Set();
			for (let i = 0; i < collection.length; i++)
			{
				let flag = true;
				let data = collection[i];
				let isRepeat = set.has(data.workId);
				for (let j = 0; j < this.workList.length; j++)
				{
					let data2 = this.workList[j];
					if (data.workId == data2.workId && ((type === 1 && data2.workType != 2) || (type === 2 && data2.workType != 1)))
					{
						flag = false;
						set.add(data2.workId);
						break;
					}
				}
				if (isRepeat)//移除货物的提卸货下拉中重复的作业点数据
				{
					collection.splice(i, 1);
					i--;
				}
				if (flag)
				{
					collection.splice(i, 1);
					i--;
					this.removeWorkInGoodsCollection(data, type);
				}
			}
		},
		/**
		 * 作业点中只有一个提货/卸货的货物的所有提货点/卸货点都是这个
		 */
		setGoodsBeginWorkIdAndEndWorkId()
		{
			let beginWorkId = '';
			let endWorkId = '';
			let pickupCount = 0;
			let deliveryCount = 0;
			for (let i = 0; i < this.workList.length; i++)
			{
				if (this.workList[i].workType == 1)//提货
				{
					beginWorkId = this.workList[i].workId;
					pickupCount ++;
				}
				else if (this.workList[i].workType == 2)//卸货
				{
					endWorkId = this.workList[i].workId;
					deliveryCount++;
				}
				else //提+卸
				{
					return false;
				}
			}
			if (pickupCount === 1)//只有一个提货点 且不存在提+卸
			{
				for (let i = 0; i < this.goodsList.length; i++)
				{
					this.goodsList[i].beginWorkId = beginWorkId;
				}
			}
			if (deliveryCount === 1)//只有一个卸货点 且不存在提+卸
			{
				for (let i = 0; i < this.goodsList.length; i++)
				{
					this.goodsList[i].endWorkId = endWorkId;
				}
			}
			this.forceUpdate();
		},
		/**
		 * 移除货物的提卸货点里面不属于订单作业点范围的点
		 * @param work
		 * @param type 1 提货点 2 卸货点
		 */
		removeWorkInGoodsCollection(work, type)
		{
			this.goodsList.forEach(item => {
				if (type === 1 && item.beginWorkId == work.workId){ item.beginWorkId = ''; }
				if (type === 2 && item.endWorkId == work.workId){ item.endWorkId = ''; }
			});
		},
		/**
		 * 货物改变
		 * @param goods
		 * @param index
		 */
		changeGoods(goods, index, isNoMatch)
		{
			if (!isNoMatch)
			{
				this.goodsList[index].goodsName = this.goodsMap.get(goods.goodsId);
				let find = this.setGoodsPros(this.goodsGroupData[1], goods, index);
				if (!find)//常规货物没有找到匹配包装货物
					this.setGoodsPros(this.goodsGroupData[2], goods, index);
				if (!find)//包装货物没有找到匹配仓储货物
					this.setGoodsPros(this.goodsGroupData[3], goods, index);
				
				if (this.common.isNotBlank(goods.goodsCount) && this.common.isNotBlank(goods.singleGoodsVolume))
					goods.goodsVolume = this.common.accMul(goods.goodsCount, goods.singleGoodsVolume);
			}
			this.fee.goodsVolumeSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsVolume))
					this.fee.goodsVolumeSum = this.common.accAdd(this.fee.goodsVolumeSum, item.goodsVolume);
			});

			this.changeGoodsWork(goods, -1, false);
			this.initGoodsDisabled();
			this.matchOrderFee(isNoMatch);
		},
		/**
		 * 设置货物属性值
		 * @param temp
		 * @param goods
		 * @param index
		 */
		setGoodsPros(temp, goods, index)
		{
			let find = false;
			if (this.common.isNotBlank(temp.goodsData))
			{
				for (let i = 0; i < temp.goodsData.length; i++)
				{
					let item = temp.goodsData[i];
					if (item.goodsId == goods.goodsId)
					{
						find = true;
						this.goodsList[index].classId = item.classId;
						this.goodsList[index].goodsModel = item.goodsModel;
						this.goodsList[index].singleGoodsVolume = item.singleGoodsVolume;
						if (this.common.isNotBlank(item.packingType))
							this.goodsList[index].packingType = item.packingType;
						break;
					}
				}
			}
			return find;
		},
		/**
		 * 增加订单作业点
		 */
		addOrderWork()
		{
			if (this.isEdit)
			{
				this.$message.error("运作的订单不允许新增作业点");
				return false;
			}
			if (this.order.orderType == 3)
			{
				this.$message.error("零担订单只有两个作业点!");
				return false;
			}
			if (this.workList.length >= 10)
			{
				this.$message.error("作业点太多了，请确认是否真的需要这么多作业点！");
				return false;
			}
			let work = this.initSingletonWork(3);
			this.workList.splice(this.workList.length - 1,0, work);
			this.initWorkOrder();
			this.changePointFee();
		},
		/**
		 * 移除订单作业点
		 * @param work
		 * @param index
		 */
		removeOrderWork(work, index)
		{
			if (this.isEdit)
			{
				this.$message.error("运作的订单不允许删除作业点");
				return false;
			}
			if (this.workList.length <= 2)
			{
				this.$message.error("订单至少需要保留两个作业点！");
				return false;
			}
			this.workList.splice(index, 1);
			this.workList[this.workList.length - 1].workType = '2';//最后一个点是卸货点
			this.removeGoodsWorkItemNonExistWorkList(this.beginWorkData, 1);
			this.removeGoodsWorkItemNonExistWorkList(this.endWorkData, 2);
			this.setGoodsBeginWorkIdAndEndWorkId();
			this.initWorkOrder();
			this.initWorkDisabled();
			this.changePointFee();
			this.matchOrderFee();//作业点改变重新匹配价格
			this.syncOrderDistance(false);
			this.forceUpdate();
		},
		/**
		 * 增加订单货物
		 */
		addOrderGoods()
		{
			if (this.isEdit)
			{
				this.$message.error("运作的订单不允许增加货物");
				return false;
			}
			if (this.goodsList.length >= 30)
			{
				this.$message.error("货物太多了，多条货物可以新增一个订单！");
				return false;
			}
			this.goodsList.splice(this.goodsList.length, 0 , this.initSingletonGoods());
			this.setGoodsBeginWorkIdAndEndWorkId();
			this.matchOrderFee();
		},
		/**
		 * 移除订单货物
		 * @param index
		 */
		removeOrderGoods(index)
		{
			if (this.isEdit)
			{
				this.$message.error("运作的订单不允许删除货物");
				return false;
			}
			if (this.goodsList.length <= 1)
			{
				this.$message.error("订单至少需要保留一件货物！");
				return false;
			}
			this.goodsList.splice(index, 1);
			this.changeGoodsVolume();
			this.matchOrderFee(false);
			this.initGoodsDisabled();
		},
		/**
		 * 提示选择客户
		 * @param flag 1选择线路 2选择作业点 3货物
		 * @returns {boolean}
		 */
		selectCustomerTip(flag)
		{
			if (this.order.isReturnTrip)
			{
				return false;
			}
			if (flag === 1)
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
					this.$message.error("请先选择客户！");
				return false;
			}
			if (flag === 2)
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
					this.$message.error("请先选择客户！");
				return false;
			}
			if (flag === 3)
			{
				let temp = this.goodsGroupData[1];
				let temp2 = this.goodsGroupData[2];
				let temp3 = this.goodsGroupData[3];
				if (this.common.isNotBlank(this.order.tenantId))
				{
					if ((this.common.isBlank(temp.goodsData) || temp.goodsData.length === 0)
						&& (this.common.isBlank(temp2.goodsData) || temp2.goodsData.length === 0)
						&& (this.common.isBlank(temp3.goodsData) || temp3.goodsData.length === 0))
					{
						this.$confirm("当前客户还没有货物,是否需要前往新增货物？", "提示").then(() =>{
							this.$emit("openTab",{
								urlId: 'goodInfoManage' + this.order.tenantId,
								query: {tenantId: this.order.tenantId, pId: 1001024},
								urlName: "货物配置",
								urlPathName: "/customer",
								urlPath: "/pt/cm/customer/goodsInfoManage.vue"});
						}).catch(() =>{});
					}
				}
				else
					this.$message.error("请先选择客户！");
				return false;
			}
		},
		/**
		 * 提示选择作业点
		 * @param type
		 * @returns {boolean}
		 */
		tipSelectWork(type)
		{
			if (type === 1)
			{
				if (this.beginWorkData.length === 0)
				{
					this.$message.error("请先选择作业内容是（提或者提+卸）的作业点！");
					return false;
				}
			}
			else
			{
				if (this.endWorkData.length === 0)
				{
					this.$message.error("请先选择作业内容是（卸或者提+卸）的作业点！");
					return false;
				}
			}
		},
		/**
		 * 相同的货物校验
		 * @param goods
		 * @param type 1提货点 2卸货点
		 * @param isMatch 是否匹配报价
		 */
		changeGoodsWork(goods, type, isMatch)
		{
			let set = new Set();
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsId) && this.common.isNotBlank(item.beginWorkId) && this.common.isNotBlank(item.endWorkId))
				{
					if (set.has(item.goodsId + "" + item.beginWorkId + item.endWorkId))
					{
						isMatch = false;
						this.$message.error("存在相同提卸货点的货物:" + this.goodsMap.get(item.goodsId) + "，请修改！");
						return false;
					}
					set.add(item.goodsId + "" + item.beginWorkId + item.endWorkId)
				}
			});
			if (this.common.isNotBlank(goods.beginWorkId) && goods.beginWorkId == goods.endWorkId)
			{
				this.$message.error("货物的提卸货点不能相同！");
				if (type == 1){ goods.beginWorkId = ''; }
				if (type == 2){ goods.endWorkId = ''; }
				isMatch = false;
			}
			if (isMatch)//匹配报价
				this.matchOrderFee();
			this.forceUpdate();
		},
		/**
		 * 重设货物体积
		 */
		resetGoodsVolume()
		{
			this.fee.goodsVolumeSum = 0;
			this.goodsList.forEach(item => {
				item.goodsVolume = item.goodsVolumeCopy;//重复你赋值
				if (this.common.isNotBlank(item.goodsVolume))
					this.fee.goodsVolumeSum = this.common.accAdd(this.fee.goodsVolumeSum, item.goodsVolume);
			})
		},
		/**
		 * 改变货物件数
		 */
		changeGoodsCount(goods, index)
		{
			this.fee.goodsCountSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsCount)){ this.fee.goodsCountSum = this.common.accAdd(this.fee.goodsCountSum, item.goodsCount); }
			});

			if (this.common.isNotBlank(goods.goodsCount) && this.common.isNotBlank(goods.singleGoodsVolume))
			{
				goods.goodsVolume = this.common.accMul(goods.goodsCount, goods.singleGoodsVolume);
			}
			this.fee.goodsVolumeSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsVolume))
					this.fee.goodsVolumeSum = this.common.accAdd(this.fee.goodsVolumeSum, item.goodsVolume);
			});
		},
		/**
         * input 失焦也会调用
		 * 改变货物重量
		 */
		changeGoodsWeight()
		{
			this.fee.goodsWeightSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsWeight))
				    this.fee.goodsWeightSum = this.common.accAdd(this.fee.goodsWeightSum, item.goodsWeight);
			});
		},
		/**
		 * 改变货物体积
		 */
		changeGoodsVolume()
		{
			this.fee.volume = 0;
			this.fee.goodsVolumeSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.goodsVolume))
				{
					this.fee.goodsVolumeSum = this.common.accAdd(this.fee.goodsVolumeSum, item.goodsVolume);
					this.fee.volume = this.common.accAdd(this.fee.volume, item.goodsVolume);
				}
			});
		},
		/**
		 * 改变货物实际件数
		 */
		changeGoodsActualCount()
		{
			let oldGoodsActualCountSum = this.fee.goodsActualCountSum;
			this.fee.goodsActualCountSum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.actualGoodsCount)){ this.fee.goodsActualCountSum = this.common.accAdd(this.fee.goodsActualCountSum, item.actualGoodsCount); }
			});
			if (oldGoodsActualCountSum == this.fee.goodsActualCountSum)//总件数没有变更
				return false;

			if (this.fee.billingType == enumData.billingTypeOrder.count)
			{
				this.calcGoodsTotalFee();//改变货物实际件数
				this.calcTotalFee();
			}
		},
		/**
		 * 改变点位费
		 */
		async changePointFee(isNoCalcTotalFee)
		{
			let pointFee = this.common.isNotBlank(this.fee.pointFee) ? this.fee.pointFee : "0";
			pointFee = !isNaN(parseFloat(pointFee)) ? pointFee : "0";
			this.fee.totalPointFee = this.common.accMul(pointFee, this.workList.length - 2);
			if (!isNoCalcTotalFee) this.calcTotalFee();
		},
		/**
		 * 计算订单基础费用合计
		 */
		calcTotalFee()
		{
			this.fee.totalFee = 0;
			let feeData = this.common.isBlank(this.fee.freight) ? '' : this.fee.freight;//运费
			if (this.fee.billingType == enumData.billingTypeOrder.byVehicle)
			{

			}
			else if (this.fee.billingType == enumData.billingTypeOrder.byVolume)
			{
				feeData = this.common.accMul(this.fee.volume, this.fee.freightPrice);
				if (!(this.common.isNotBlank(this.fee.volume) && this.common.isNotBlank(this.fee.freightPrice)))
				{
					if (feeData == 0){ feeData = ''; }
				}
			}
			else if (this.fee.billingType == enumData.billingTypeOrder.byNetweight)//净重
			{
				feeData = this.common.accMul(this.fee.netWeight, this.fee.freightPrice);
				if (!(this.common.isNotBlank(this.fee.netWeight) && this.common.isNotBlank(this.fee.freightPrice)))
				{
					if (feeData == 0){ feeData = ''; }
				}
			}
			else if (this.fee.billingType == enumData.billingTypeOrder.byGrossweight)//毛重
			{
				feeData = this.common.accMul(this.fee.grossWeight, this.fee.freightPrice);
				if (!(this.common.isNotBlank(this.fee.grossWeight) && this.common.isNotBlank(this.fee.freightPrice)))
				{
					if (feeData == 0){ feeData = ''; }
				}
			}
			else if (this.fee.billingType == enumData.billingTypeOrder.count)//件数
			{

			}
			if (isNaN(feeData)){ feeData = ''; }
			this.fee.freight = this.getValid(feeData, true);//返回两位有效数值
			this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.dealValue(this.fee.freight));
			this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.dealValue(this.fee.totalPointFee));
			this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.dealValue(this.fee.pickupFee));
			this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.dealValue(this.fee.deliveryFee));
			this.changePayMode();
			this.calcTotalStatementFeeSum();
			this.forceUpdate();
		},
		/**
		 * 计算异动费用合计
		 */
		calcStatementTotalFee()
		{
			this.fee.statementFee = 0;
			this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.premiumFee));
			this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.loadingFee));
			this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.dischargeFee));
            this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.emptyDrivingFee));
			this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.standbyFee));
			this.fee.statementFee = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.otherFee));
			this.calcTotalStatementFeeSum();
			this.forceUpdate();
		},
		/**
		 * 计算货物费用
		 * @param flag 是否需要执行改变费用
		 */
		calcGoodsTotalFee(flag)
		{
			if (flag) return false;

			let sum = 0;
			this.goodsList.forEach(item => {
				if (this.common.isNotBlank(item.actualGoodsCount) && this.common.isNotBlank(item.piecePrice))
				{
					item.pieceFee = this.common.accMul(item.actualGoodsCount, item.piecePrice);
					sum = this.common.accAdd(sum, item.pieceFee);
				}
			})
			this.fee.freight = sum;
		},
		/**
		 * 处理异常数值输入
		 * @param value
		 * @returns {number}
		 */
		dealValue(value)
		{
			let newValue = 0;
			if (this.common.isNotBlank(value) && !isNaN(parseFloat(value + "")))
				newValue = value;
			return newValue;
		},
		/**
		 * 强制刷新视图绑定
		 */
		forceUpdate(){ this.$forceUpdate(); },
		/**
		 * 返回两位有效数值的数 如果是.0结尾直接返回整数
		 * @param data
		 * @param flag 是否和小数点一起返回
		 * @returns {number|*}
		 */
		getValid(data, flag)
		{
			data = data + "";
			if (this.common.isNotBlank(data))
			{
				if (data.includes("."))
				{
					let array = data.split(".");
					let decimal = array[1];//小数位
					if(this.common.isNotBlank(decimal))
					{
						let value = (Math.round(Number.parseFloat(data) * 10000) / 10000);
						if (decimal.length > 2)
						{
							if (decimal.length > 4)
								return value.toFixed(4);
							else
								return data;
						}
						else
							return data;
					}
					else
					{
						if (flag)
							return data;
						else
							return array[0];
					}
				}
				else
					return data;
			}
			return '';
		},
		/**
		 * 1、非多笔付 费用合计等于对应的结算方式的金额  即：结算方式=提付  费用合计(fee.totalFee) == 提付(fee.pickupPay)
		 * 2、多笔付 费用合计(fee.totalFee) == 提付(fee.pickupPay) + 现付(fee.spotPay) + 回单付(fee.receiptPay) + 月结(fee.monthPay)
		 * 改变结算方式
		 */
		changePayMode()
		{
			this.fee.payModeItemDisabled = this.fee.payMode !== '5';//多笔付输入框才可以输入
			if (this.fee.payMode !== '5')//非多笔付
			{
				this.fee.monthPay = '';
				this.fee.pickupPay = '';
				this.fee.spotPay = '';
				this.fee.receiptPay = '';
				if (this.fee.payMode === '1')//月结
				{
					// this.fee.monthPay = this.fee.totalFee;
				}
				else if (this.fee.payMode === '2')//提付
				{
					// this.fee.pickupPay = this.fee.totalFee;
				}
				else if (this.fee.payMode === '3')//现付
				{
					// this.fee.spotPay = this.fee.totalFee;
				}
				else if (this.fee.payMode === '4')//回单付
				{
					// this.fee.receiptPay = this.fee.totalFee;
				}
			}
			else
			{
				let sum = this.common.accAdd(this.fee.monthPay, this.fee.pickupPay);
				sum = this.common.accAdd(sum, this.fee.spotPay);
				sum = this.common.accAdd(sum, this.fee.receiptPay);
				if (sum != 0 && sum != this.fee.totalFee)
				{
					this.$message.error("结算方式的多笔付的（提付 + 现付 + 回单付 + 月结）必须等于费用合计");
				}
			}
			this.forceUpdate();
		},
		/**
		 * 下单校验检查抽取
		 */
		checkOrderDataCommon()
		{
			/************** 订单基础数据校验 **************/
			if (this.common.isBlank(this.order.tenantId))
			{
				this.$message.error("请选择订单的客户！");
				return false;
			}
			if (this.common.isBlank(this.order.orderType))
			{
				this.$message.error("请选择订单类型！");
				return false;
			}
			if (this.common.isBlank(this.order.routeId) && !this.order.isReturnTrip)
			{
				this.$message.error("请选择订单的线路！");
				return false;
			}
			if (this.common.isBlank(this.order.routeName))
			{
				this.$message.error("线路名称不能为空，请选择！");
				return false;
			}
			return true;
		},
		/**
		 * 下单作业点校验检查抽取
		 */
		checkOrderWorkData()
		{
			/************** 订单作业点校验 **************/
			if (this.workList.length < 2)
			{
				this.$message.error("请选择至少两个订单作业点！");
				return false;
			}
			if (this.order.orderType == 3 && this.workList.length > 2)
			{
				this.$message.error("零担订单只有两个作业点,请修改再保存!");
				return false;
			}
			for (let i = 0; i < this.workList.length; i++)
			{
				let workId = this.workList[i].workId;
				if (this.common.isBlank(workId))
				{
					this.$message.error("请选择第" + ( i + 1) + "个作业点！");
					return false;
				}
				if (this.common.isBlank(this.workList[i].workDate))
				{
					this.$message.error("请选择第" + ( i + 1) + "个作业点的要求运作时间！");
					return false;
				}
			}
			return true;
		},
		/**
		 * 订单货物数据校验
		 */
		checkOrderGoodsData()
		{
			/************** 订单货物校验 **************/
			if (this.common.isBlank(this.goodsList) || this.goodsList.length < 1)
			{
				this.$message.error("请填写至少一条订单货物!");
				return false;
			}
			let goodsBeginEndMap = new Map();
			for (let i = 0; i < this.goodsList.length; i++)
			{
				let goodsId = this.goodsList[i].goodsId;
				let beginWorkId = this.goodsList[i].beginWorkId;
				let endWorkId = this.goodsList[i].endWorkId;
				if (this.common.isBlank(goodsId)){ this.$message.error("请选择第" + ( i + 1) + "个货物信息！"); return false; }
				if (this.common.isBlank(beginWorkId)){ this.$message.error("请选择第" + ( i + 1) + "个货物的提货点！"); return false; }
				if (this.common.isBlank(endWorkId)){ this.$message.error("请选择第" + ( i + 1) + "个货物的卸货点！"); return false; }
				let goodsCount = this.goodsList[i].goodsCount;
				let goodsWeight = this.goodsList[i].goodsWeight;
				let goodsVolume = this.goodsList[i].goodsVolume;
				if (this.common.isBlank(goodsCount) && this.common.isBlank(goodsWeight) && this.common.isBlank(goodsVolume))
				{
					this.$message.error("第" + ( i + 1) + "个货物的件数、重量、体积必须填写一个有效数值！"); return false;
				}
				let j = goodsBeginEndMap.get("" + goodsId + beginWorkId + endWorkId);
				if (this.common.isNotBlank(j))
				{
					this.$message.error("第" + j + "个货物和第" + ( i + 1) + "个货物相同且提货点和卸货点相同，请重新选择！");
					return false;
				}
				// if (this.workList.length > 2)//含有包装货物的订单只能两个作业点 阿涛说的
				// {
				// 	if (this.common.isNotBlank(this.goodsGroupData[2].goodsData) && this.goodsGroupData[2].goodsData.length > 0)
				// 	{
				// 		for (let k = 0; k < this.goodsGroupData[2].goodsData.length; k++)
				// 		{
				// 			if (this.goodsGroupData[2].goodsData[k].goodsId == goodsId)
				// 			{
				// 				this.$message.error("含有包装货物的订单只能两个作业点!");
				// 				return false;
				// 			}
				// 		}
				// 	}
				// }
				goodsBeginEndMap.set("" + goodsId + beginWorkId + endWorkId, i + 1);
			}
			return true;
		},
		/**
		 * 订单费用数据校验
		 */
		checkOrderFeeData()
		{
			/************** 订单费用校验 **************/
			if (this.common.isBlank(this.fee.billingType))
			{
				this.$message.error("请选择计费方式！");
				return false;
			}
			if (this.common.isBlank(this.fee.payMode))
			{
				this.$message.error("请选择结算方式！");
				return false;
			}
			let sum = this.common.accAdd(this.fee.totalPointFee, this.fee.freight);
			sum = this.common.accAdd(sum, this.fee.pickupFee);
			sum = this.common.accAdd(sum, this.fee.deliveryFee);
			if (this.fee.totalFee != sum)
			{
				this.$message.error("(点位费合计 + 运费 + 提货费 + 送货费)不等于费用合计，请确认！");
				return false;
			}
			return true;
		},
		/**
		 * 订单数据校验
		 */
		checkOrderData()
		{
			/**
			 * 订单数据校验不通过
			 */
			if (!this.checkOrderDataCommon())
			{
				return false;
			}
			if (this.common.isBlank(this.order.customerOrderDate))
			{
				this.$message.error("客户下单时间不能为空，请选择！");
				return false;
			}
			
			let now = new Date();
			let customerOrderDate = new Date(this.order.customerOrderDate);
			let year = now.getFullYear();
			let month = now.getMonth();
			if(now.getDate() <= 12) {
				//如果是12号或者以前 不能选上上个月的
				let beginOfMonth = new Date(year, month - 1, 1);
				if(customerOrderDate.getTime() < beginOfMonth.getTime()){
					this.$message.error("客户下单时间不能选择上上个月！");
					return false;
				}
			}else{
				//如果是12号以后  不能选上个月的
				let beginOfMonth = new Date(year, month, 1);
				if (customerOrderDate.getTime() < beginOfMonth.getTime())
				{
					this.$message.error("12号以后，客户下单时间不能选择上个月！");
					return false;
				}
			}
			
			/**
			 * 下单作业点校验检查不通过
			 */
			if (!this.checkOrderWorkData())
			{
				return false;
			}
			/**
			 * 下单货物校验检查不通过
			 */
			if (!this.checkOrderGoodsData())
			{
				return false;
			}
			/**
			 * 下单费用校验检查不通过
			 */
			if (!this.checkOrderFeeData())
			{
				return false;
			}
			//保存订单
			return true;
		},

		/**
		 * 订单数据校验
		 */
		checkOrderDataHZ()
		{
			/**
			 * 订单数据校验不通过
			 */
			if (!this.checkOrderDataCommon())
			{
				return false;
			}
			/**
			 * 下单作业点校验检查不通过
			 */
			if (!this.checkOrderWorkData())
			{
				return false;
			}
			/**
			 * 下单货物校验检查不通过
			 */
			if (!this.checkOrderGoodsData())
			{
				return false;
			}
			/**
			 * 下单费用校验检查不通过
			 */
			if (!this.checkOrderFeeData())
			{
				return false;
			}
			//保存订单
			return true;
		},
		/**
		 * 控制打开编辑作业点顺序对话
		 */
		showEditDialog()
		{
			if (this.isEdit)
			{
				this.$message.error("运作的订单不允许修改作业点顺序");
				return false;
			}
			if (!this.showEdit)
			{
				let count = 0;
				for (let i = 0; i < this.workList.length; i++)
				{
					if (this.common.isBlank(this.workList[i].workId)){ count++; }
				}
				if (this.workList.length === count)
				{
					this.$message.error("请先选择作业点再调整顺序！");
					return false;
				}
				if (this.workList.length === 2 && count === 0)//两个都选择了作业点，只有2个作业点直接切换
				{
					let first = this.workList[0];
					let last = this.workList[1];
					last.workType = '1';
					last.workOrder = '1';
					this.workList[0] = last;
					this.changeWork(last, 0, true);
					first.workType = '2';
					first.workOrder = '2';
					this.workList[1] = first;
					this.changeWork(first, 1, true);
					this.forceUpdate();
					return false;
				}
			}
			this.showEdit = !this.showEdit;
		},
		/**
		 * 改变作业点顺序
		 */
		updateWorkOrder()
		{
			let blank = [];
			let count = 0;
			let length = this.workList.length;
			for (let i = 0; i < this.workList.length; i++)
			{
				if (this.common.isBlank(this.workList[i].workOrder))
				{
					blank.push(this.workList.splice(i, 1)[0]);
					count++;
					i--;
				}
			}
			//顺序都是空的，恢复之前的顺序
			if (length === count){ this.initWorkOrder(); return false; }
			//重新排序
			this.workList.sort((a, b) => a.workOrder - b.workOrder);

			let maxOrder = this.workList[this.workList.length - 1].workOrder
			if (blank.length > 0)
			{
				for (let i = 0; i < blank.length; i++)
				{
					blank[i].workOrder = ++maxOrder;
					this.workList.push(blank[i]);
				}
			}
			//移除选线路之前已经选择的作业点集合
			this.initBeginWork();
			this.initEndWork();
			for (let i = 0; i < this.workList.length; i++)
			{
				let workOrder = this.workList[i].workOrder;
				if (i === 0)
				{
					this.workList[i].workType = '1';
				}
				if (i === this.workList.length - 1)
				{
					this.workList[i].workType = '2';
				}
				this.changeWork(this.workList[i], i);//会把顺序重置掉
				this.workList[i].workOrder = workOrder;
			}
			//每个货物的提卸货点不存在提卸货点下拉中的移除
			for (let i = 0; i < this.goodsList.length; i++)
			{
				let existWork = false;
				for (let j = 0; j < this.beginWorkData.length; j++)
				{
					if (this.beginWorkData[j].workId == this.goodsList[i].beginWorkId){ existWork = true; }
				}
				if (!existWork){ this.goodsList[i].beginWorkId = ''; }
				existWork = false;
				for (let j = 0; j < this.endWorkData.length; j++)
				{
					if (this.endWorkData[j].workId == this.goodsList[i].endWorkId){ existWork = true; }
				}
				if (!existWork){ this.goodsList[i].endWorkId = ''; }
			}
			//只有两个作业点，货物的所有提卸货点统一赋值
			this.setGoodsBeginWorkIdAndEndWorkId();
			this.forceUpdate();
			this.showEditDialog();
			this.syncOrderDistance(false);
		},
		/**
		 * 上传文件回调
		 * @param imgData
		 */
		uploadSuccessCallback(imgData)
		{
			this.order.fileName = imgData.fileName;
			this.order.imgId = imgData.flowId;
			this.order.imgPath = imgData.storePath;
			this.$forceUpdate();
		},
		/**
		 * 货主打开详情
		 * @param data
		 */
		toOrderDetailHZ(data)
		{
			this.$emit("openTab",{
				urlId: 'hzOrderDetail' + data.orderId,
				query: data,
				urlName: "订单详情",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/orderDetail/orderDetailMain.vue"});
		},
		/**
		 * @returns {Promise<unknown>}
		 */
		async loadCdtRegion()
		{
			let data =  await this.common.postUrl("regionOrgTF", "getRegionInfoList", {}, null, null, '', true);
			for (let i = 0; i < data.length; i++)
			{
				let item = data[i];
				if (item.id == 1)//总部的处理掉
				{
					data.splice(i, 1);
					i--;
				}
			}
			return data;
		},
		/**
		 * 检查是否选择客户
		 * @returns {boolean}
		 */
		checkTenant()
		{
			if (this.common.isBlank(this.order.tenantId))
			{
				this.$message.error("请先选择客户！");
				return false;
			}
		},
		/**
		 * 改变协同区域
		 */
		changeCdtRegion()
		{
			if (this.common.isBlank(this.order.cdtRegionId))
				this.fee.cdtFee = '';

			if (this.common.isBlank(this.order.tenantId) && this.common.isNotBlank(this.order.cdtRegionId))
			{
				this.$message.error("请先选择客户！");
				this.order.cdtRegionId = '';
				return false;
			}
		},
		/**
		 * 改变协同区域选择
		 * @param tenantId
		 */
		changeCdtRegionSelect(tenantId)
		{
			this.cdtRegionData = [];
			if (this.common.isNotBlank(tenantId))
			{
				let regionIds = "";
				this.customerData.forEach(item => {
					if (item.tenantId == tenantId)
						regionIds = item.regionIds;
				})
				regionIds = this.common.userInfo().regionId + "";
				for (let i = 0; i < this.cdtRegionArray.length; i++)
				{
					if (!this.isSubElement(regionIds, this.cdtRegionArray[i].id))
					{
						this.cdtRegionData.push(this.cdtRegionArray[i]);
					}
				}
			}
			this.$forceUpdate();
		},
		isSubElement(regionIds, id)
		{
			if (this.common.isBlank(regionIds))
				return false;
			let arr = regionIds.split(",");
			for (let i = 0; i < arr.length; i++)
			{
				if (arr[i] == id)
					return true;
			}
			return false;
		},
		/**
		 * 计算 费用合计+异动合计=加上本次异动总金额
		 */
		calcTotalStatementFeeSum()
		{
			this.fee.totalStatementFeeSum = this.common.accAdd(this.fee.statementFee, this.dealValue(this.fee.totalFee));
			this.forceUpdate();
		},
		async syncOrderDistance(flag)
		{
			if (flag)
				return;
			this.order.farthestDistanceInfo = null;
			this.order.predictTime = null;
			let count = 0;
			for (let i = 0; i < this.workList.length; i++)
			{
				let work = this.workList[i];
				if (this.common.isNotBlank(work.latitude) && this.common.isNotBlank(work.longitude))
					count++;
			}
			if (count < 2)
				return;
			let data =  await this.common.postUrl("orderTF", "getOrderDistance", {"workList": this.workList});
			this.farthestDistanceShow = this.common.isNotBlank(data.farthestDistanceInfo);
			if (this.farthestDistanceShow)
			{
				this.order.farthestDistanceInfo = data.farthestDistanceInfo;
				this.order.predictTime = data.predictTime;
				this.$forceUpdate();
			}
		},

        /** 打开关闭作业点弹窗 */
		addWork(flag, index)
		{
            this.identifyText = '';
            if (flag)
			{
				if (this.common.isBlank(this.order.tenantId))
				{
					this.$message.error("请先选择客户再新增作业点！");
					return;
				}
				this.title = "新增作业点";
				this.showIdentify = true;
				this.showMapBotton = false;
				this.isDraw = true;
                this.workVisible = true;
				this.initWorkInfo();
				this.currentIndex = index >= 0 ? index : -1;
            }
			else
			{
                this.workInfo = {
                    workinfoType: '1'
                };
                this.mapPointDraw = null;
                this.electricPlace = "不填默认300米";
                this.isOverlays = false;
                this.workVisible = false;
                this.disabled = false;
                this.mapPoint = null;
                this.drawPoints = null;
                this.isNotDistrict = true;
                this.showMapBotton = false;
				this.currentIndex = -1;
            }
            this.$forceUpdate();
        },
		// 初始化新增作业信息
        initWorkInfo() {
            this.workInfo =  {
				workinfoType: '1',
			};
        },
        /** 地图选择省市区 */
        showMap(){
            this.isShowMap = true;
        },
        hideMapBack(){
            this.isShowMap = false;
        },		
        /** 选中省份 */
        changeProvinceSelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId: this.workInfo.provinceId}, function (data) {
                that.cityData = data;
            });
        },
        /** 选中城市 */
        changeCitySelect() {
            let that = this;
            this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.workInfo.cityId}, function (data) {
                that.districtData = data;
            });
        },
        /** 地图选择省市区回调 */
        async sureWorkAddress(data){
            let addressComponents = data.addressComponents;
            let point = data.point;
            if(this.common.isNotBlank(point)){
                this.workInfo.latitude = point.lat;
                this.workInfo.longitude = point.lng;
            }
            if(this.common.isNotBlank(addressComponents)){
                this.workInfo.address = addressComponents.street;
                if(this.common.isNotBlank(addressComponents.province)){
                    let provinceId = await this.common.postUrl("selectStaticDataTF","getProvinceId",{"codeValueName" : addressComponents.province});
                    if(provinceId>0){
                        this.workInfo.provinceId = Number(provinceId);
                        await this.changeProvinceSelect();
                        if(this.common.isNotBlank(addressComponents.city)){
                            let cityId = await this.common.postUrl("selectStaticDataTF","getCityId",{"codeValueName":addressComponents.city});
                            if(cityId>0){
                                this.workInfo.cityId = Number(cityId);
                                await this.changeCitySelect();
                            }
                            //有区县数据的后台获取对应的ID再回调
                            if(this.common.isNotBlank(addressComponents.district)){
                                let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictId",{"codeValueName":addressComponents.district,"cityId":cityId});
                                if(districtId<0){
                                    this.$message.error("很抱歉，系统地址库没有区县:"+addressComponents.district+"，请联系管理人员。");
                                }
                                if(this.common.isNotBlank(districtId)){
                                    this.workInfo.districtId = Number(districtId);
                                    let address = '';
                                    address += addressComponents.city + addressComponents.district + addressComponents.street + addressComponents.streetNumber;
                                    this.mapPoint = {addressName:address, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                                    this.workInfo.workAddressStr = address;
                                }
                                this.isNotDistrict = true;
                            }else{
                                this.isNotDistrict = false;
                            }
                        }else {
                            this.$message.error("没有匹配到当前位置信息，请手动选择！");
                            this.isNotDistrict = false;
                        }
                    }
                }
            }
            this.$forceUpdate();
            this.hideMapBack();
        },

        showMapDraw(){
            if(this.common.isNotBlank(this.workInfo.longitude) && this.common.isNotBlank(this.workInfo.latitude)){
                this.mapPointDraw = {addressName:this.workInfo.workAddressStr, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
            }
            this.isShowMapDraw = true;
        },
        modifyMapDraw(){
            //查看电子围栏
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            this.drawPoints = [];
            if(this.common.isNotBlank(selectData[0].overlays)){
                let overlayData = selectData[0].overlays.split("|");
                for (let i = 0; i < overlayData.length; i++) {
                    let pointStr = overlayData[i].split(",");
                    let point = {
                        "lng":pointStr[1],
                        "lat":pointStr[0],
                    }
                    this.drawPoints.push(point);
                }
            }
            //没有绘制范围显示默认
            if (this.drawPoints.length == 0)
            {
                this.drawPoints = selectData[0].electricFence;
            }
            this.mapPointDraw = {addressName:selectData[0].workAddressStr, point:{"lng":selectData[0].longitude,"lat":selectData[0].latitude}};
            this.isShowMapDraw = true;
            this.showMapBotton = true;
            this.isDraw = false;
        },
        hideMapBackDraw(){
            this.isShowMapDraw = false;
        },
        /** 电子围栏回调 */
        sureWorkAddressDraw(data){
            if(this.common.isNotBlank(data.overlays)){
                let overlays = "";
                this.drawPoints = [];
                for (let i = 0; i < data.overlays.length; i++) {
                    overlays += data.overlays[i].lat + "," + data.overlays[i].lng + "|";
                    //绘制围栏需要回显
                    let point = {
                        "lng":data.overlays[i].lng,
                        "lat":data.overlays[i].lat,
                    }
                    this.drawPoints.push(point);
                }
                overlays = overlays.substring(0,overlays.length-1);
                this.workInfo.overlays = overlays;
                this.workInfo.electricFence = "";//清空电子围栏范围
                this.electricPlace = "已绘制";
                this.isOverlays = true;
            }else{
                this.drawPoints = [];
                this.workInfo.overlays = '';
                this.electricPlace = "不填默认300米";
                this.isOverlays = false;
            }
        },
        /** 保存作业点 */
        saveWorkInfo() {
            this.workInfo.tenantId = this.order.tenantId;
            if(this.common.isBlank(this.workInfo.workName)){
                this.$message.error("请输入作业点名称！");
                return;
            }
            if(this.common.isBlank(this.workInfo.provinceId) || this.workInfo.provinceId<0
                || this.common.isBlank(this.workInfo.cityId) || this.workInfo.cityId<0
                || this.common.isBlank(this.workInfo.districtId) || this.workInfo.districtId<0){
                this.$message.error("请选择作业点省市区！");
                return;
            }
            if(this.common.isBlank(this.workInfo.address)){
                this.$message.error("请输入作业点街道地址！");
                return;
            }
            if(this.common.isBlank(this.workInfo.latitude) || this.common.isBlank(this.workInfo.longitude)){
                this.$message.error("没有获取到作业点经纬度！");
                return;
            }
            if(this.common.isBlank(this.workInfo.workinfoType) || this.workInfo.workinfoType<0){
                this.$message.error("请选择作业点类型！");
                return;
            }
            let that = this;
            this.common.postUrl("workGoodsTF", "checkWorkDistance", this.workInfo, function (data) {
                if (data.result == 'Y') {
                    const h = that.$createElement;
                    that.$msgbox({
                        title: "提示",
                        message: h('p', null, [
                            h('span', null, "该作业点"),
                            h('i', { style: 'color: red' }, data.workDistanceStr),
                            h('span', null, "米范围内存在作业点："),
                            h('i', { style: 'color: red' }, data.workNameStr),
                            h('span', null, "请确认是否继续操作？"),
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: "warning",
                    }).then(() => {
                        that.common.postUrl("workGoodsTF", "addWorkInfo", that.workInfo, function (data_) {
							if (that.common.isNotBlank(data_)) {
                                that.refreshWork(data_);
                                that.$message.success("保存成功！");
                            }
                        });
                    }).catch(() => {
                        that.$message.info("已取消新增");
                    });
                }else{
                    that.common.postUrl("workGoodsTF", "addWorkInfo", that.workInfo, function (data_) {
						if (that.common.isNotBlank(data_)) {
                            that.refreshWork(data_);
                            that.$message.success("保存成功！");
                        }
                    });
                }
            },null,'',true);
        },
		async refreshWork(data)
		{
			//填充作业点数据
			this.workData = await this.loadWorkDataByTenantId(data.tenantId);
			if (this.currentIndex >= 0)
			{
				this.workList[this.currentIndex].workId = data.id + "";
				this.changeWork(this.workList[this.currentIndex], this.currentIndex, true);
			}
			this.addWork(false);
			this.$forceUpdate();
		},
		addGoods(flag, index) {
			this.goodsInfo = {};
			this.showSingleVolume = false;
			this.currentGoodsIndex = index >= 0 ? index : -1;
			this.openDialog(flag);
		},
		openDialog(flag) {
			this.goodsVisible = flag;
		},
		/**
		 * 改变货物属性
		 */
		changeProperty(type)
		{
			if (type == 1 && this.goodsInfo.goodsLength > 5)
				this.$message.warning("请注意:您输入的货物长度为:" + this.goodsInfo.goodsLength + "米！");
			if (type == 2 && this.goodsInfo.goodsWidth > 5)
				this.$message.warning("请注意:您输入的货物宽度为:" + this.goodsInfo.goodsWidth + "米！");
			if (type == 3 && this.goodsInfo.goodsHeight > 5)
				this.$message.warning("请注意:您输入的货物高度为:" + this.goodsInfo.goodsHeight + "米！");
			
			//都不为空计算体积
			if (this.common.isNotBlank(this.goodsInfo.goodsLength) && !isNaN(this.goodsInfo.goodsLength)
				&& this.common.isNotBlank(this.goodsInfo.goodsWidth) && !isNaN(this.goodsInfo.goodsWidth)
				&& this.common.isNotBlank(this.goodsInfo.goodsHeight) && !isNaN(this.goodsInfo.goodsHeight))
			{
				let acreage = this.common.accMul(this.goodsInfo.goodsLength, this.goodsInfo.goodsWidth);
				let volume = this.common.accMul(this.goodsInfo.goodsHeight, acreage);
				this.goodsInfo.singleGoodsVolume = Number((Math.round(volume * 10000) / 10000).toFixed(4));
				this.showSingleVolume = true;
			}
			else
			{
				this.goodsInfo.singleGoodsVolume = '';
				this.showSingleVolume = false;
			}
		},
		/** 保存货物 */
		saveGoodsInfo() {
			this.goodsInfo.tenantId = this.order.tenantId;
			if(this.common.isBlank(this.goodsInfo.goodsName)){
				this.$message.error("请输入货物名称！");
				return;
			}
			if(this.common.isBlank(this.goodsInfo.classId) || this.goodsInfo.classId<0){
				this.$message.error("请选择货物类别！");
				return;
			}
			if(this.common.isBlank(this.goodsInfo.packingType) || this.goodsInfo.packingType<0){
				this.$message.error("请选择货物包装类型！");
				return;
			}
			let that = this;
			this.common.postUrl("workGoodsTF", "addGoodsInfo", this.goodsInfo, function (data) {
				if (that.common.isNotBlank(data)) {
					that.refreshGoods(data);
					that.$message.success("保存成功！");
				}
			},null,'',true);
		},
		async refreshGoods(data)
		{
			await this.loadCustomerDataByTenantId(data.tenantId);
			if (this.currentGoodsIndex >= 0)
			{
				this.goodsList[this.currentGoodsIndex].goodsId = data.id + "";
				this.changeGoods(this.goodsList[this.currentGoodsIndex], this.currentGoodsIndex, true);
			}
			this.openDialog(false);
			this.$forceUpdate();
		},
		async changeReturnTrip()
		{
			this.order.tenantId = null;
			await this.loadCustomerData();
			await this.changeTenant(null);
		},
		querySearch(queryString, cb)
		{
			let routeData = this.routeData;
			let results = queryString ? routeData.filter(this.createFilter(queryString)) : routeData;
			cb(results);
		},
		createFilter(queryString)
		{
			return (item) => {
				return (item.routeName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		selectRouteName(item)
		{
			this.order.routeId = item.routeId;
			this.changeRouteSelect(item.routeId);
		},
		changeRouteName()
		{
			this.order.routeId = null;
		},
		clearRouteName()
		{
			this.order.routeId = null;
			this.order.routeName = "";
		},
	},
}
