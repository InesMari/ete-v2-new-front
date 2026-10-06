import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
	name: 'ownVehicleScheduleManage',
	data()
	{
		return {
			head: [
				{"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "120", "type": "text"},
                {"name": "司机手机号码", "code": "driverPhone", "width": "150", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "120", "type": "text"},
                {"name": "运力状态", "code": "stsName", "width": "150", "type": "text"},
                {"name": "申请时间", "code": "scheduleCreateDate", "width": "150", "type": "text"},
                {"name": "回程起始地", "code": "beginAddress", "width": "250", "type": "text"},
                {"name": "当前位置", "code": "curLocation", "width": "250", "type": "text"},
                {"name": "距离", "code": "distance", "width": "120", "type": "text"},
                {"name": "收车时间", "code": "endCarDate", "width": "150", "type": "text"},
                {"name": "等待时间", "code": "duration", "width": "150", "type": "text"},
                {"name": "回程单状态", "code": "waybillStateName", "width": "120", "type": "text"},
                {"name": "订单号", "code": "relOrderNum", "width": "150", "type": "diy"},
                {"name": "派车单号", "code": "relWaybillNum", "width": "150", "type": "diy"},
                {"name": "是否回程单", "code": "isReturnTripName", "width": "120", "type": "text"},
                {"name": "调度人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "调度时间", "code": "createDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
            vehicleLengthData:[],
            vehicleTypeData:[],
            whetherData:[],
            waybillStateData:[],

            showDialog: false,
            info:{},
            stsData:[],

        }
	},
	/**
	 * 初始化
	 */
	mounted()
	{
        this.doQuery();
        this.init();
	},
	/**
	 * 组件
	 */
	components: {
        myFileModel,
		tableCommon,
		searchList,
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
            let {items} = await this.$refs.table.load("resOwnVehicleScheduleTF", "queryOwnVehicleSchedulePage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
		},
		initQuery()
		{
			this.query = {
                plateNumber: '',
                vehicleLength: '',
                vehicleType:'',
                isReturnTrip:'',
                waybillState:'',
                orderNum:'',
                waybillNum:'',
			};
			return this.query;
		},
        async init() {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'VEHICLE_LENGTH,VEHICLE_TYPE,WHETHER,WAYBILL_STATE,SCHEDULE_STS'});
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.vehicleTypeData = data.VEHICLE_TYPE;
            this.whetherData = data.WHETHER;
            this.waybillStateData = data.WAYBILL_STATE;
            this.stsData = data.SCHEDULE_STS;
        },
        /**
         * 打开详情
         * @param data
         * @param isCallParent 是否调用父组件调用
         */
        toWaybillDetail(data)
        {
            if (data.isTransit == 1)
            {
                this.$emit('openTab', {
                    urlName: '查看中转',
                    urlId: 'transitManage' + data.relWaybillId,
                    urlPathName: "/order",
                    urlPath: "/pt/ord/transit/transitDetailMain",
                    query:{t:3,waybillNum: data.relWaybillNum, tansitWaybillId: data.relWaybillId},
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + data.relWaybillId,
                    query: {waybillId: data.relWaybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
        /**
         * 订单详情
         */
        toOrderDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'orderDetail' + data.relOrderId,
                query: {orderId: data.relOrderId, pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        /**
         * 新增订单
         */
        toAddOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个需要下单调度的运力！");
                return false;
            }
            if (selectData[0].sts != '1') {
                this.$message.error("你选择的运力状态不是有效状态，不能操作！");
                return false;
            }
            if (selectData[0].relOrderId) {
                this.$message.error("你选择的运力已匹配订单，不能操作！");
                return false;
            }

            this.$emit("openTab",{
                urlId: 'ownVehicleScheduleId'+selectData[0].id+new Date().getTime(),
                query: {ownVehicleScheduleId:selectData[0].id,isReturnTrip:1},
                urlName: "新增订单",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/addOrder.vue"});
        },

        /**
         * 关闭详情弹出框
         */
        closeDialog() {
            this.showDialog = false;
        },
        dblclickItem(data){
            this.info = data;
            this.showDialog = true;
        },
	},
	computed:{
		formData(){
			return [
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"车型","model":"vehicleType","type":"select","options":this.vehicleTypeData,"label":"codeName","value":"codeValue","placeholder":"车型","method":"doQuery","isshow":true},
                {"name":"是否回程单","model":"isReturnTrip","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否回程单","method":"doQuery","isshow":true},
                {"name":"回程单状态","model":"waybillState","type":"select","options":this.waybillStateData,"label":"codeName","value":"codeValue","placeholder":"回程单状态","method":"doQuery","isshow":true},
                {"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
                {"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
                {"name":"运力状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"运力状态","method":"doQuery","isshow":true},
            ]
		}
	},
}