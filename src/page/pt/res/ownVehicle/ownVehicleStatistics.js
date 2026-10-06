import $echarts from 'echarts'

export default {
    name: 'ownVehicleStatistics',
    data() {
        return {
            info: {
                stateNums1: []
            },
            expireDayTypeList: [],
            listData: [],
            waybillRankList: [],
            fatigueDrivingList:[],
            offLineList:[],
            mileageType:'1',
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
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
        async doQuery() {
            this.initData();
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        // 查询仓库
        async initData() {
            this.info = await this.common.postUrl("vehicleBenefitAccountingService", "getOwnVehicleStatisticInfo", { num: 30, type: 1 });
            await this.loadVehicleMileageSumData();
            // 疲劳驾驶列表
            let fatigueDrivingList = await this.common.postUrl("vehicleBenefitAccountingService", "queryOwnVehicleFatigueDrivingPage", { count: 99 });
            // 长时间离线列表
            let offLineList = await this.common.postUrl("vehicleBenefitAccountingService", "queryOwnVehicleOfflinePage", { count: 99 });
            this.fatigueDrivingList = fatigueDrivingList.items;
            this.offLineList = offLineList.items;
            this.waybillRankList = await this.common.postUrl("vehicleBenefitAccountingService", "queryOwnVehicleFinishWaybillRankList");
            let { EXPIRE_DAY_TYPE } = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", { codeType: "EXPIRE_DAY_TYPE" });
            this.expireDayTypeList = EXPIRE_DAY_TYPE;

            this.initPieEchart1();
            this.initPieEchart2();
            this.initLineEchart();
        },
        /**
         *
         * @param type 1 昨天 2 上个月 默认昨天
         * @returns {Promise<void>}
         */
        async loadVehicleMileageSumData(type){
            let data = await this.common.postUrl("vehicleMileageService", "loadVehicleMileageSumData", {type});
            this.info.sumMileageSum = data.sumMileageSum;
            this.info.effectiveMileageSum = data.effectiveMileageSum;
            this.info.deadheadMileageSum = data.deadheadMileageSum;
            this.$forceUpdate();
            //处理饼图
            let array = [
                {
                    name: "有效里程",
                    value: data.effectiveMileageSum
                },
                {
                    name: "空驶里程",
                    value: data.deadheadMileageSum
                }
            ];
            this.initPieEchart(array);
        },
        async initPieEchart(data){
            //饼图
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                label: {
                    formatter: '{b} :{d}%',
                },
                series: [
                    {
                        name: '车辆里程出勤率',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        selectedMode: 'single',
                        data: data,
                    }
                ]
            };
            $echarts.init(document.getElementById("pieChart0")).setOption(option);
        },
        async initPieEchart1() {
            let value0 = this.info.stateNums1[0] || 0;
            let name0 = this.info.stateNames1[0];
            let value1 = this.info.stateNums1[1] || 0;
            let name1 = this.info.stateNames1[1];
            let data = [
                { value: value0, name: name0 },
                { value: value1, name: name1 }
            ];
            console.log(data);
            let option = {
                color:['#34c758','#ff3a30'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                label: {
                    formatter: '{b} : {c}',
                },
                series: [
                    {
                        center: ['50%', '55%'],
                        name: '车辆状态',
                        type: 'pie',
                        selectedMode: 'single',
                        data,
                    }
                ]
            };
            $echarts.init(document.getElementById("pieChart1")).setOption(option);
        },
        async initPieEchart2() {
            let value0 = this.info.stateNums2[0] || 0;
            let name0 = this.info.stateNames2[0];
            let value1 = this.info.stateNums2[1] || 0;
            let name1 = this.info.stateNames2[1];
            let data = [
                { value: value0, name: name0 },
                { value: value1, name: name1 }
            ];
            console.log(data);
            let option = {
                color:['#0258d9','#ff3a30'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                label: {
                    formatter: '{b} : {c}',
                },
                series: [
                    {
                        center: ['50%', '55%'],
                        name: '车辆状态',
                        type: 'pie',
                        selectedMode: 'single',
                        data,
                    }
                ]
            };
            $echarts.init(document.getElementById("pieChart2")).setOption(option);
        },
        async initLineEchart() {
            let months = this.info.ownVehicleFeeList.map(item => item.month);
            let costFees = this.info.ownVehicleFeeList.map(item => item.costFee);
            let incomeFees = this.info.ownVehicleFeeList.map(item => item.incomeFee);
            //柱形图
            let option = {
                color: ['#3398DB', '#c0c4cc'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['收入', '成本']
                },
                grid: {
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: months,
                        axisLabel: {
                            interval: 0, //展示全部条目
                            fontSize: 12,
                            overflow: "breakAll",
                            width: 60,
                            lineHeight: 16,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '收入',
                        type: 'bar',
                        barGap: 0,
                        data: incomeFees
                    },
                    {
                        name: '成本',
                        type: 'bar',
                        data: costFees
                    },

                ]
            };
            $echarts.init(document.getElementById("lineChart")).setOption(option);
        },
        // 保险到期
        toInsurance(){
            this.$emit("openTab",{
                urlId: 'contractManageMain' + new Date().getTime(),
                query: {
                    openTab: 5,
                    expirationStatus:"2,3",
                    isVehicleInsurance:1,
                    isGroupByFlag:1,
                },
                urlName: "合同管理",
                urlPathName: "/contractManageMain",
                urlPath: "/pt/cm/contract/contractManageMain.vue"});
        },
        // 年检到期
        toAnnual(){
            this.$emit("openTab",{
                urlId: 'ownVehicleCostCapacityManageMain' + new Date().getTime(),
                query: {
                    openTab: 4,
                    verifyState: 1,
                    expirationStatus:"2,3",
                    isGroupByFlag:1,
                },
                urlName: "自有车成本",
                urlPathName: "/ownVehicleCostCapacityManageMain",
                urlPath: "/pt/res/ownVehicleCostCapacityManageMain.vue"});
        },
        // 保养到期
        toMaintenance(){
            this.$emit("openTab",{
                urlId: 'ownVehicleCostCapacityManageMain' + new Date().getTime(),
                query: {
                    openTab: 2,
                    repairType: 2,
                    verifyState: 1,
                    expirationStatus:"2,3",
                    isGroupByFlag:1,
                },
                urlName: "自有车成本",
                urlPathName: "/ownVehicleCostCapacityManageMain",
                urlPath: "/pt/res/ownVehicleCostCapacityManageMain.vue"});
        },
        // 自有车里程管理
        toOwnVehicleMileage(){
            this.$emit("openTab",{
                urlId: 'ownVehicleMileage',
                urlName: "自有车里程管理",
                urlPathName: "/ownVehicleMileage",
                urlPath: "/pt/res/ownVehicle/ownVehicleMileage.vue"});
        }
    },
}


