import scrollTable from "@/components/scrollTable/scrollTable.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import $echarts from 'echarts'

export default {
    name: 'budgetAchievement',
    data() {
        return {
            head: [
                { "name": "指标", "code": "name", "width": "200", "type": "text" },
                { "name": "营收年度", "code": "year", "width": "120", "type": "text" },
                { "name": "1月", "code": "fee1", "width": "80", "type": "text" },
                { "name": "2月", "code": "fee2", "width": "80", "type": "text" },
                { "name": "3月", "code": "fee3", "width": "80", "type": "text" },
                { "name": "4月", "code": "fee4", "width": "80", "type": "text" },
                { "name": "5月", "code": "fee5", "width": "80", "type": "text" },
                { "name": "6月", "code": "fee6", "width": "80", "type": "text" },
                { "name": "7月", "code": "fee7", "width": "80", "type": "text" },
                { "name": "8月", "code": "fee8", "width": "80", "type": "text" },
                { "name": "9月", "code": "fee9", "width": "80", "type": "text" },
                { "name": "10月", "code": "fee10", "width": "80", "type": "text" },
                { "name": "11月", "code": "fee11", "width": "80", "type": "text" },
                { "name": "12月", "code": "fee12", "width": "80", "type": "text" },
                { "name": "合计", "code": "totalFee", "width": "100", "type": "text" },
            ],
            query: {
                year:''
            },
            tabs: [
                { "name": "年度趋势", id: 1, active: true },
                { "name": "区域对比", id: 2 },
                { "name": "物流中心对比", id: 3 }
            ],
            currentTab: {},
            type:"1",
            data:{},
        }
    },

    mounted() {
        this.initYear();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        scrollTable,
        innerTab,
    },
    methods: {
        /**
         * 清空
         */
        initYear() {
            this.query.year = this.common.formatTime(new Date(),'yyyy');
        },

        /**
         * 查询列表
         */
        async doQuery() {
            this.query.type=this.type;
            this.query.subType = this.currentTab.id;
            if(this.type==1){
                this.data = await this.$refs.table1.load("fcActualSalesTF", "queryAllSalesStatisticsInfo", this.query);
            }else{
                if (this.currentTab.id == 1) {
                    this.data = await this.$refs.table2.load("fcActualSalesTF", "queryAllSalesStatisticsInfo", this.query);
                }else{
                    this.data = await this.common.postUrl("fcActualSalesTF", "queryAllSalesStatisticsInfo", this.query);
                }
                this.initChartData();
            }
        },
        changeType(){
            if(this.type==2) {
                this.currentTab = this.tabs[0];
            }
            this.doQuery();
        },
        selectCallback(data) {
            this.currentTab = data;
            this.doQuery();
        },
        downloadExcelFile(){
            // 前端导出
            import('@/utils/excelOut').then(excel => {
                //表头
                let tHeader = []
                //表头对应字段
                let filterVal = []
                let list = this.$refs.table1.getData();
                this.head.forEach(el => {
                    tHeader.push(el.name);
                    filterVal.push(el.code);
                })
                const data = list.map(v => filterVal.map(j => v[j]))
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename:'营收预算达成情况表',   // 文件名
                    autoWidth: true,
                })
            })
        },
        initChartData(){
            if (this.currentTab.id == 1) {
                this.$nextTick(() => {
                    this.initYearChart();
                })
            } else if (this.currentTab.id == 2) {
                this.$nextTick(() => {
                    this.initRegionChart();
                })
            } else if (this.currentTab.id == 3) {
                this.$nextTick(() => {
                    this.initLogisticsChart();
                })
            }
        },
        // 初始化年度趋势图表
        initYearChart() {
            const echart = $echarts.init(document.getElementById('yearChart'));
            echart.setOption({
                legend: {
                    data: ['年度营收预算表', '实际营收表']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                color:['#ffdc90','#007bd2'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.data.yearChartData[0]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '年度营收预算表',
                        type: 'line',
                        data: this.data.yearChartData[1]
                    },
                    {
                        name: '实际营收表',
                        type: 'line',
                        data: this.data.yearChartData[2]
                    },
                ]
            });

        },
        // 初始化区域对比图表
        initRegionChart() {
            const echart = $echarts.init(document.getElementById('regionChart'));
            let option = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    crossStyle: {
                      color: '#999'
                    }
                  },
                    formatter: function(params) {
                        var html = params[0].name + '<br>';
                        for (var i = 0; i < params.length - 1; i++) {
                            html +=
                                params[i].marker +
                                params[i].seriesName +
                                '：' +
                                params[i].value +
                                '<br>';
                        }
                        //最后一个 添加%
                        html +=
                            params[i].marker +
                            params[i].seriesName +
                            '：' +
                            params[i].value +
                            '%' +
                            '<br>';
                        return html;
                    }
                },
                legend: {
                    data: ['预算', '实际', '达成率'],
                    orient: "vertical",
                    right: 20,
                    top: '40%'
                },
                grid: {
                    left: '3%',
                    right: '150',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                color:['#ff7875','#68bbc4','#e99d42'],
                xAxis: [
                    {
                        type: 'category',
                        data: this.data.chartData[0]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                    {
                      type: 'value',
                      axisLabel: {
                        formatter: '{value}%'
                      }
                    }
                ],
                series: [
                    {
                        name: '预算',
                        type: 'bar',
                        data: this.data.chartData[1]
                    },
                    {
                        name: '实际',
                        type: 'bar',
                        data: this.data.chartData[2]
                    },
                    {
                        name: '达成率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.data.chartData[3]
                    }
                ]
            };
            echart.setOption(option);
        },
        // 初始化物流中心对比图表
        initLogisticsChart() {
            const echart = $echarts.init(document.getElementById('logisticsChart'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function(params) {
                        var html = params[0].name + '<br>';
                        for (var i = 0; i < params.length - 1; i++) {
                            html +=
                                params[i].marker +
                                params[i].seriesName +
                                '：' +
                                params[i].value +
                                '<br>';
                        }
                        //最后一个 添加%
                        html +=
                            params[i].marker +
                            params[i].seriesName +
                            '：' +
                            params[i].value +
                            '%' +
                            '<br>';
                        return html;
                    }
                },
                legend: {
                    data: ['预算', '实际', '达成率'],
                    orient: "vertical",
                    right: 20,
                    top: '40%'
                },
                grid: {
                    left: '3%',
                    right: '150',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                color:['#ff7875','#68bbc4','#e99d42'],
                xAxis: [
                    {
                        type: 'category',
                        data: this.data.chartData[0]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '预算',
                        type: 'bar',
                        data: this.data.chartData[1]
                    },
                    {
                        name: '实际',
                        type: 'bar',
                        data: this.data.chartData[2]
                    },
                    {
                        name: '达成率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.data.chartData[3]
                    }
                ]
            };
            echart.setOption(option)
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
