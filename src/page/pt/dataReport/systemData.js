import $echarts from "echarts";

export default {
    name: 'systemData',
    data() {
        return {
            info:{
                orderCount1:0,//已下单未调度订单
                orderCount2:0,//已调度未出车订单
                waybillCount1:0,//已出车未收车派车单
                waybillCount2:0,//司机异常打点派车单
                
                waybillCount3:0,//司机正常打点派车单
                waybillCount4:0,//收车异常派车单
                orderCount3:0,//订单完成未入账
                waybillCount5:0,//派车单完成未入账
                
                receivableCount:0,//
                receivableAmount:0,//
                payableCount:0,//
                payableAmount:0,//
                
                orderCount:0,//
                waybillCount:0,//
            },
            query:{
                orderDay1: 1,
                orderDay2: 1,
                waybillDay1: 3,
                waybillDay2: 30,
                waybillDay3: 30,
                waybillDay4: 7,
                orderDay3: 90,
                waybillDay5: 7,
                receivableDay: 30,
                payableDay: 30,
                orderDay: 90,
                waybillDay: 90,
            }
        }
    },
    /**
     * 初始化
     */
    mounted(){
        this.init();
    },
    /**
     * 组件
     */
    components: {

    },
    /**
     * 绑定函数
     */
    methods: {
        init(){
            this.loadOrderData1(this.query.orderDay1);
            this.loadOrderData2(this.query.orderDay2);
            this.loadWaybillData1(this.query.waybillDay1);
            this.loadWaybillData2(this.query.waybillDay2);
            this.loadWaybillData3(this.query.waybillDay3);
            this.loadWaybillData4(this.query.waybillDay4);
            this.loadOrderData3(this.query.orderDay3);
            this.loadWaybillData5(this.query.waybillDay5);
            this.loadOrderData(this.query.orderDay);
            this.loadWaybillData(this.query.waybillDay);
            this.initEchart(30);
            this.loadReceivableData(this.query.receivableDay);
            this.loadPayableData(this.query.payableDay);
        },
        async loadOrderData1(day){
            let orderData = await this.common.postUrl("orderService", "loadOrderCount", {day, orderState: 0, isUnDispatch: 1});
            this.info.orderCount1 = orderData.count;
            this.$forceUpdate();
        },
        async loadOrderData2(day){
            let orderData = await this.common.postUrl("orderService", "loadOrderCount", {day, orderState: 1, isUnStartCar: 1});
            this.info.orderCount2 = orderData.count;
            this.$forceUpdate();
        },
        async loadOrderData3(day){
            let orderData = await this.common.postUrl("orderService", "loadOrderCount", {day, isUnEntryBill: 1});
            this.info.orderCount3 = orderData.count;
            this.$forceUpdate();
        },
        async loadOrderData(day){
            let orderData = await this.common.postUrl("orderService", "loadOrderCount", {day, orderState: 2, isNoIncome: 1});
            this.info.orderCount = orderData.count;
            this.$forceUpdate();
        },
        
        
        async loadWaybillData1(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, waybillState: 2, isStartCar: 1});
            this.info.waybillCount1 = waybillData.count;
            this.$forceUpdate();
        },
        async loadWaybillData2(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, isAbnormalOp: 1});
            this.info.waybillCount2 = waybillData.count;
            this.$forceUpdate();
        },
        async loadWaybillData3(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, isNormalOp: 1});
            this.info.waybillCount3 = waybillData.count;
            this.$forceUpdate();
        },
        async loadWaybillData4(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, isAbnormalEndCar: 1});
            this.info.waybillCount4 = waybillData.count;
            this.$forceUpdate();
        },
        async loadWaybillData5(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, waybillState: 3, isUnEntryBill: 1});
            this.info.waybillCount5 = waybillData.count;
            this.$forceUpdate();
        },
        async loadWaybillData(day){
            let waybillData = await this.common.postUrl("ordWaybillTF", "loadWaybillCount", {day, waybillState: 3, isNoCost: 1, vehicleAttribution: 1});
            this.info.waybillCount = waybillData.count;
            this.$forceUpdate();
        },
        async loadReceivableData(day){
            let data = await this.common.postUrl("rptFeeReportTF", "loadReceivableCount", {day});
            this.info.receivableCount = data.count;
            this.info.receivableAmount = data.feeSum;
            this.$forceUpdate();
        },
        async loadPayableData(day){
            let data = await this.common.postUrl("rptFeeReportTF", "loadPayableCount", {day});
            this.info.payableCount = data.count;
            this.info.payableAmount = data.feeSum;
            this.$forceUpdate();
        },
        async initEchart(day){
            let total = await this.common.postUrl("vehicleBenefitAccountingService", "loadOwnVehicleAttendanceData",{day});
            //饼图
            $echarts.init(document.getElementById("chart1")).setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                // legend: {
                //     left: 'center',
                //     bottom: 10,
                // },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '50%',
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
                        { value: total.attendanceCount, name: '出勤' },
                        { value: total.noAttendanceCount, name: '空置' },
                    ]
                }]
            });
            $echarts.init(document.getElementById("chart2")).setOption({
                // title: {
                //     text: '合同份数：' + total.totalContract,
                //     left: 'center',
                //     bottom: '2%',
                //     textStyle:{
                //         fontSize:14,
                //     }
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },

                xAxis: {
                    type: 'category',
                    data: ["有效保险", "车辆总数"]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '',
                        type: 'bar',
                        barWidth: '40%',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 12
                        },
                        data: [total.insuranceContractCount, total.sum]
                    }
                ]
            });
        },
        
        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param param
         */
        go(path, pId, urlName, param) {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item == pId)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看"+urlName+"的权限,请联系上级授权！");
                return false;
            }
            let query = {isFromSystemData: 1};
            if (this.common.isNotBlank(param))
                query.systemDataParam = param;//区分跳转界面相同别名参数
            let urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            
            this.$emit("openTab",{
                urlId: urlId + pId,
                query: query,
                urlName: urlName,
                urlPathName: "/"+urlId,
                urlPath: path});
        },
        seeBigger()
        {
        
        },
    }
}
