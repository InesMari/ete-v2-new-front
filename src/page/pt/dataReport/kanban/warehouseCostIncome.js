import tableCommon from "@/components/table/tableCommon.vue";
import $echarts from 'echarts'
import enumData from "@/page/pt/enum";

export default {
    name: 'warehouseCostIncome',
    data()
    {
        return {
            chartQuery1: {billMonth: this.common.formatDate.getMonth()},
            chartQuery2: {billMonth: this.common.formatDate.getMonth()},
            chartQuery3: {billMonth: this.common.formatDate.getMonth()},
            listQuery: {billMonth: this.common.formatDate.getMonth()},
            listData:[],
            storeHouseData:[],
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery()
        {
            await this.initData();
            this.initList();
            this.initEchart1();
            this.initEchart2();
            this.initEchart3();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        // 查询仓库
        async initData(){            
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.chartQuery2.workId = this.storeHouseData[0].workId;
            this.chartQuery3.workId = this.storeHouseData[0].workId;
        },
        //billMonth:月份
        //billYear:年份
        //workId:仓库ID
        async initList(){
            this.listData = await this.common.postUrl("wmsCostService", "loadWarehouseCostIncomeListData", this.listQuery);
        },
        async initEchart1(){
            let data = await this.common.postUrl("wmsCostService", "loadWarehouseCostIncomeBarData", this.chartQuery1);

            //柱形图
            let option = {
                color: ['#4cabce', '#3398DB'],
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
                        data: data.storeHouseNameList,
                        axisLabel:{
                            interval:0, //展示全部条目
                            fontSize:12,
                            overflow:"breakAll",
                            width:60,
                            lineHeight:16,
                            rotate:45,
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
                        data: data.storeIncomeList
                    },
                    {
                        name: '成本',
                        type: 'bar',
                        data: data.storeCostList
                    },

                ]
            };
            $echarts.init(document.getElementById("chart1")).setOption(option);
        },
        
        async initEchart2(date){
            //饼图
            let data = await this.common.postUrl("wmsCostService", "loadWarehouseCostIncomePieData", this.chartQuery2);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: data.typeNameList
                },
                series: [
                    {
                        name: '仓库成本',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        selectedMode: 'single',
                        data: data.dataList,
                    }
                ]
            };
            $echarts.init(document.getElementById("chart2")).setOption(option);
        },
        async initEchart3(){
            //折线图
            let data = await this.common.postUrl("wmsCostService", "loadWarehouseCostIncomeLineData", this.chartQuery3);
            let option = {
                tooltip: {
                    trigger: 'axis'
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
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        smooth: true,
                        data: data.storeIncomeList
                    },
                    {
                        name: '成本',
                        type: 'line',
                        smooth: true,
                        data: data.storeCostList
                    }
                ]
            };
            $echarts.init(document.getElementById("chart3")).setOption(option);
        },
    },
}


