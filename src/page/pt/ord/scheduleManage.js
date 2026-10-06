import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import $echarts from 'echarts'
import "../../../../node_modules/echarts/map/js/china.js";

export default {
	name: 'scheduleManage',
	data()
	{
		return {
			head: [
				{"name": "订单计划编号", "code": "ordScheduleNum", "width": "150", "type": "text"},
				{"name": "订单编号", "code": "orderNum", "width": "160", "type": "diy"},
				{"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
				{"name": "客户单号", "code": "custOrderNum", "width": "180", "type": "text"},
				{"name": "线路始终城市", "code": "beginEndCity", "width": "200", "type": "text"},
				{"name": "计划发货时间", "code": "scheduleTime", "width": "120", "type": "text"},
				{"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
				{"name": "状态", "code": "isMatch", "width": "100", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "200", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			query: this.initQuery(),
			schedule: this.initSchedule(),
			vehicleLengthData: [],
			customerData: [],
			routeData: [],
			matchData: [
				{"codeValue": 0, "codeName": "未匹配"},
				{"codeValue": 1, "codeName": "已匹配"},
				{"codeValue": 9, "codeName": "已取消"},
			],
			title: '查看订单计划',
			showSchedule: false,
			showDelete: false,
			delSchedule:false,
			isOnlySee:false,
			pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
			info: {},
			scheduleData: {},
			unMatchVehicleScheduleList: [],
			showMatch: false,
            text: '切换图形',
            showList: false, //默认展示图表
			showMap:true,
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.query.routeName = this.$route.query.routeName;
		this.query.isMatch = this.common.isBlank(this.$route.query.isMatch) ? '' : Number(this.$route.query.isMatch);
		this.initData();
		this.loadCustomerData();
		this.$nextTick(() => {
			this.doQuery(this.query);
			// this.$refs.table && this.$refs.table.doQuery(this.query);
		});
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList,
		myElDatePicker,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
			if(this.common.isNotBlank(this.query.scheduleTime) && this.query.scheduleTime.length === 2){
				this.query.startScheduleTime = this.query.scheduleTime[0];
				this.query.endScheduleTime = this.query.scheduleTime[1];
			}else{
				this.query.startScheduleTime = '';
				this.query.endScheduleTime = '';
			}
			let {items} = await this.$refs.table.load("scheduleService", "querySchedulePage", this.query);
			items.forEach((el)=>{
				if(el.sts == 0){
					el.disabled = true;
				}
			})
			this.$refs.table.resetData(items);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
			await this.loadData();
		},
		async loadData()
		{
			this.info = await this.common.postUrl("scheduleService", "queryScheduleData", {isLoadScheduleData: 1});
			this.$nextTick(async() => {
				await this.initMap();
			})
		},
		async go(type)
		{
			if(type === 0){
				this.query.isMatch = '';
				await this.doQuery();
			}
			else if (type === 1)
			{
				this.query.isMatch = 1;
				await this.doQuery();
			}
			else if (type === 2)
			{
				this.query.isMatch = 0;
				await this.doQuery();
			}
			else if (type === 3)
			{
				this.$emit('openTab', {
					urlName: '运力管理',
					urlId: '1003069',
					urlPathName: "/res",
					urlPath: "/pt/res/vehicleScheduleManage.vue",
					query: {isMatch: 0}
				});
			}
		},
		async generateOrder()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要生成订单的订单计划！");
				return false;
			}
			if (selectData[0].orderId > 0)
			{
				this.$message.error("该订单计划已经生成订单！");
				await this.doQuery();
				return false;
			}
			if (selectData[0].sts == 0)
			{
				this.$message.error("该订单计划已经取消！");
				await this.doQuery();
				return false;
			}
			let data = this.common.copyObj(selectData[0]);
			this.$emit("openTab",{
				urlId: '34' + data.id,
				query: {scheduleId: data.id, tenantId: data.orderCustId, routeId: data.routeId, vehicleLength: data.vehicleLength,custOrderNum: data.custOrderNum},
				urlName: "订单计划生成订单",
				urlPathName: "/order",
				urlPath: "/pt/ord/order/addOrder.vue"});
		},
		toOrderDetail(item)
		{
			let orderId = item.orderId;
			this.$emit("openTab",{
				urlId: 'orderDetail' + orderId,
				query: {orderId: orderId,pId: 1001070},
				urlName: "订单详情",
				urlPathName: "/order",
				urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
		},
		initQuery()
		{
			this.query = {
				ordScheduleNum: '',
				beginCityName: '',
				endCityName: '',
				vehicleLength: '',
				supplierName: '',
				plateNumber: '',
				remark: '',
				tenantName: '',
				scheduleTime: '',
				routeName: this.$route.query.routeName,
				isMatch: this.common.isBlank(this.$route.query.isMatch) ? '' : Number(this.$route.query.isMatch),
			};
			return this.query;
		},
		initSchedule()
		{
			this.schedule = {
				id: '',
				orderCustId: '',
				routeId: '',
				beginEndCity: '',
				vehicleLength: '',
				scheduleTime: '',
				custOrderNum: '',
				remark: '',
			};
			return this.schedule;
		},
		addSchedule()
		{
			this.initSchedule();
			this.title = "新增订单计划";
			this.loadCustomerData();
			this.routeData = [];
			this.isOnlySee = false;
			this.showScheduleDialog(true);
		},
		async copySchedule()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要复制的订单的订单计划！");
				return false;
			}
			let data = selectData[0];
			data.id =  '';
			this.schedule = this.common.copyObj(data);
			this.changeTenant(data.tenantId);
			this.title = "复制订单计划";
			this.isOnlySee = false;
			this.showScheduleDialog(true);
		},
		async dblclickItem(data)
		{
			this.schedule = this.common.copyObj(data);
			this.changeTenant(data.tenantId);
			this.title = "查看订单计划";
			this.isOnlySee = true;
			this.showScheduleDialog(true);
		},
		showScheduleDialog(flag)
		{
			this.showSchedule = flag;
			this.$forceUpdate();
		},
		showMatchDialog(flag)
		{
			this.showMatch = flag;
			this.$forceUpdate();
		},
		showDelScheduleDialog(flag)
		{
			this.delSchedule = flag;
			this.$forceUpdate();
		},
		async loadCustomerData()
		{
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
		},
		async changeTenant(tenantId)
		{
			if (this.common.isBlank(tenantId))
				this.routeData = [];
			else
				this.routeData = await this.common.postUrl("routeTF", "loadRouteSelectByTenantId", {tenantId: tenantId});
		},
		async changeRoute(routeId)
		{
			this.schedule.routeName = "";
			for (let i = 0; i < this.routeData.length; i++)
			{
				if (this.routeData[i].routeId == routeId)
					this.schedule.routeName = this.routeData[i].routeName;
			}
			this.schedule.beginEndCity = "";
			this.schedule.beginProvinceId = "";
			this.schedule.beginCityId = "";
			this.schedule.endProvinceId = "";
			this.schedule.endCityId = "";
			let workData = await this.common.postUrl("routeTF", "loadWorkByRouteId", {routeId: routeId});
			if (workData.length > 0)
			{
				let work0 = workData[0];
				let work = workData[workData.length - 1];
				this.schedule.beginProvinceId = work0.provinceId;
				this.schedule.beginCityId = work0.cityId;
				this.schedule.endProvinceId = work.provinceId;
				this.schedule.endCityId = work.cityId;
				this.schedule.beginEndCity = work0.provinceName + work0.cityName + "-" + work.provinceName + work.cityName;

				this.schedule.beginLatitude = work0.latitude;
				this.schedule.beginLongitude = work0.longitude;
				this.schedule.endLatitude = work.latitude;
				this.schedule.endLongitude = work.longitude;
			}
			this.$forceUpdate();
		},
		saveSchedule()
		{
			if (this.common.isBlank(this.schedule.orderCustId))
			{
				this.$message.error("请选择客户再提交！");
				return false;
			}
			if (this.common.isBlank(this.schedule.routeId))
			{
				this.$message.error("请选择线路名称再提交！");
				return false;
			}
			if (this.common.isBlank(this.schedule.vehicleLength))
			{
				this.$message.error("请选择车长再提交！");
				return false;
			}
			if (this.common.isBlank(this.schedule.scheduleTime))
			{
				this.$message.error("请选择计划发货时间再提交！");
				return false;
			}
			let that = this;
			this.common.postUrl("scheduleService", "saveOrUpdateSchedule", this.schedule, function (data)
			{
				that.doQuery();
				if (that.showList)
					that.loadData();
				that.showScheduleDialog(false);
				that.$message.success("新增成功");
			},null, null,true);
		},
		deleteSchedule()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要取消的订单计划！");
				return false;
			}
			if (selectData[0].sts == 0)
			{
				this.$message.error("该订单计划已经取消！");
				return false;
			}
			this.schedule = this.common.copyObj(selectData[0]);

			this.showDelScheduleDialog(true);
		},
		sureDeleteSchedule()
		{
			let that = this;
			this.common.postUrl("scheduleService", "deleteScheduleById", this.schedule, function (data)
			{
				that.doQuery();
				that.showDelScheduleDialog(false);
				that.$message.success("取消成功");
			},null, null,true);
		},
		async openMatch()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要匹配的订单计划！");
				return false;
			}
			if (selectData[0].sts == 0)
			{
				this.$message.error("该订单计划已经取消！");
				return false;
			}
			if (selectData[0].isMatchFlag)
			{
				this.$message.error("订单计划已匹配！");
				return false;
			}
			this.scheduleData = this.common.copyObj(selectData[0]);
			this.unMatchVehicleScheduleList = await this.common.postUrl("vehicleScheduleService", "queryVehicleScheduleUnMatchList", this.scheduleData);
			this.showMatchDialog(true);
		},
		selectVehicleSchedule(vehicleScheduleId)
		{
			for (let i = 0; i < this.unMatchVehicleScheduleList.length; i++)
			{
				let data = this.unMatchVehicleScheduleList[i];
				if (data.id == vehicleScheduleId)
				{
					this.scheduleData.supplierName2 = data.tenantName;
					this.scheduleData.plateNumber2 = data.plateNumber;
					this.scheduleData.vehicleLengthName2 = data.vehicleLengthName;
					this.scheduleData.beginEndCity2 = data.beginEndCity;
					this.scheduleData.scheduleTime2 = data.scheduleTime;
					this.$forceUpdate();
					break;
				}
			}
		},
		async syncMatch()
		{
			if (this.common.isBlank(this.scheduleData.vehicleScheduleId))
			{
				this.$message.error("请选择运力再提交！");
				return false;
			}
			await this.common.postUrl("scheduleService", "syncMatch", this.scheduleData);
			await this.doQuery();
			await this.loadData();
			this.showMatchDialog(false);
			this.$message.success("手工匹配成功");
		},
		// 初始化地图
		initMap(){
			if(this.common.isBlank(this.$refs.mapChart)) return;
			let mapChart = $echarts.init(this.$refs.mapChart);
			let matchList = [];
			let unmatchList = [];
			this.info.list.forEach(el => {
				let obj = {
					coords:[
						[el.beginLongitude,el.beginLatitude],
						[el.endLongitude,el.endLatitude]
					],
					fromName:el.beginCityStr,
					toName:el.endCityStr
				}
				if(el.isMatchFlag){
					matchList.push(obj);
				}else{
					unmatchList.push(obj);					
				}
			})
			// 封顶渲染50条数据
			matchList.length = matchList.length>50?50:matchList.length;
			unmatchList.length = unmatchList.length>50?50:unmatchList.length;
			let color = ['#a6c84c','#ffa022']
			let series = [];
			let mapData;
			if(this.query.isMatch === 1){
				mapData = [['已匹配',matchList]];
				color = ['#a6c84c'];
			}else if(this.query.isMatch === 0){
				mapData = [['未匹配',unmatchList]];
				color = ['#ffa022'];
			}else{
				mapData = [['已匹配',matchList],['未匹配',unmatchList]];
				color = ['#a6c84c','#ffa022'];
			}
			mapData.forEach((item,i) => {
				series.push(
					{
						name: item[0],
						type: 'lines',
						zlevel: 1,
						effect: {
							show: true,
							period: 6,
							trailLength: 0.7,
							color: '#fff',
							symbolSize: 3
						},
						lineStyle: {
							normal: {
								color: color[i],
								width: 0,
								curveness: 0.2
							}
						},
						data: item[1]
					},
					{
						name: item[0],
						type: 'lines',
						zlevel: 2,
						lineStyle: {
							normal: {
								color: color[i],
								width: 2,
								opacity: 0.7,
								curveness: 0.2
							}
						},
						data: item[1]
					},
					{
						name: item[0],
						type: 'effectScatter',
						coordinateSystem: 'geo',
						zlevel: 2,
						rippleEffect: {
							brushType: 'stroke'
						},
						label: {
							normal: {
								show: true,
								position: 'right',
								formatter: '{b}'
							}
						},
						symbolSize: function (val) {
							return val[2] / 14;
						},
						itemStyle: {
							normal: {
								color: color[i]
							}
						},
						data: item[1].map(function (dataItem) {
							let value = dataItem.coords[1].map(el => Number(el));
							value.push(90);
							return {
								// name: dataItem.toName,
								value,
							};
						})
					},
					{
						name: item[0],
						type: 'effectScatter',
						coordinateSystem: 'geo',
						zlevel: 2,
						rippleEffect: {
							brushType: 'stroke'
						},
						label: {
							normal: {
								show: true,
								position: 'right',
								formatter: '{b}'
							}
						},
						symbolSize: function (val) {
							return val[2] / 16;
						},
						itemStyle: {
							normal: {
								color: color[i]
							}
						},
						data: item[1].map(function (dataItem) {
							let value = dataItem.coords[0].map(el => Number(el));
							value.push(90);
							return {
								// name: dataItem.toName,
								value,
							};
						})
					}
				)
			})
			let option = {
				geo: {
					map: 'china',
					label: {
						emphasis: {
							show: false
						}
					},
					roam: true,
					itemStyle: {
						normal: {//选取前颜色
							areaColor: '#1990ff',
							borderColor: '#fff'
						},
						emphasis: {//选取后颜色
							areaColor: '#2e9aff'
						}
					}
				},
				series,
			};
			mapChart.setOption(option, true);
		},
        async changeShowStyle()
        {
            if (this.showList)
            {
                this.text = '切换列表';
                this.$nextTick(async() => {
					await this.doQuery();
                })
            }
            else
            {
                //页面展示问题导致后面$nextTick再处理表格
                this.text = '切换图形';
            }
            this.showList = !this.showList;

            //需要页面渲染完毕才处理图标
            if (this.showList)
            {
                this.$nextTick(async() => {
                    await this.loadData();
                })
            }
            this.$forceUpdate();
        },
		
        async initEchart(){
            //饼图
            $echarts.init(document.getElementById("chart1")).setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [{
                    name: '运力数据',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: this.info.scheduleUnMatch, name: '未匹配' },
                        { value: this.info.scheduleMatch, name: '已匹配' },
                    ]
                }]
            });
            //折线图
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '按车型',
                    left: '10%',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {},
                xAxis: {
                    type: 'category',
                    data: this.info.vehicleLengthNameList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '未匹配',
                        type: 'line',
                        smooth: true,
                        data: this.info.vehicleLengthUnMatchList
                    },
                    {
                        name: '已匹配',
                        type: 'line',
                        smooth: true,
                        data: this.info.vehicleLengthMatchList
                    }
                ]
            });
            //柱形图
            $echarts.init(document.getElementById("chart3")).setOption({
                legend: {},
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: this.info.beginCityhNameList
                },
                yAxis: {},
                series: [
                    {
                        name: '未匹配',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.info.beginCityUnMatchList
                    },
                    {
                        name: '已匹配',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.info.beginCityMatchList
                    }
                ]
            });

        },
		changeEchart(){
			this.showMap = !this.showMap;
			if(this.showMap){
				this.loadData();
			}else{
				this.$nextTick(()=>{
					this.initEchart();
				})
			}
		},
	},
	computed:{
		formData(){
			return [
				{"name":"订单计划编号","model":"ordScheduleNum","type":"input","placeholder":"请输入订单计划编号","isshow":true},
				{"name":"起始地","model":"beginCityName","type":"input","placeholder":"请输入起始地","isshow":true},
				{"name":"目的地","model":"endCityName","type":"input","placeholder":"请输入目的地","isshow":true},
				{"name":"状态","model":"isMatch","type":"select","options":this.matchData,"label":"codeName","value":"codeValue","placeholder":"状态","method":"doQuery","isshow":true},
				{"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
				{"name":"供应商名称","model":"supplierName","type":"input","placeholder":"供应商名称","isshow":true},
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
				{"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
				{"name":"备注信息","model":"remark","type":"input","placeholder":"备注信息","isshow":true},
				{"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
				{"name":"计划发货时间","model":"scheduleTime","type":"daterange","isshow":true},
			]
		}
	},
}