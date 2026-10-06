import tableCommon from "@/components/table/tableCommon.vue";
import $echarts from 'echarts'
import enumData from "@/page/pt/enum";

export default {
    name: 'inspectData',
    data()
    {
        return {
            chartQuery1: {billMonth: this.common.formatDate.getMonth()},
            listQuery: {workId:null,billMonth: this.common.formatDate.getMonth()},
            chartQuery3: {workId:null,billMonth: this.common.formatDate.getMonth()},
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
            this.initEchart3();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        async initData(){
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.listQuery.workId = this.storeHouseData[0].workId;
            this.chartQuery3.workId = this.storeHouseData[0].workId;
        },
        async initList(){
            this.listData = await this.common.postUrl("wmsInspectionSummaryService", "loadInspectionTaskByCondition", this.listQuery);
        },
        async initEchart1(){
            let data = await this.common.postUrl("wmsInspectionSummaryService", "loadInspectionTaskGroupByWorkBarData", this.chartQuery1);
            if (this.common.isNotBlank(data) && this.common.isNotBlank(data.list) && data.list.length > 0)
            {
                data.list[0].barGap = 0;
            }
            let instance = $echarts.init(document.getElementById("chart1"));
            instance.clear();
            instance.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: data.equipmentSet
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
                series: data.list
            });
            this.$forceUpdate();
        },
        async initEchart3(){
            //折线图
            let data = await this.common.postUrl("wmsInspectionSummaryService", "loadHasDoneInspectionTaskData", this.chartQuery3);
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['已巡检任务数']
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
                    data: data.dayList,
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '已巡检任务数',
                        type: 'line',
                        smooth: true,
                        data: data.list
                    }
                ]
            };
            $echarts.init(document.getElementById("chart3")).setOption(option);
            this.$forceUpdate();
        },
    },
}


