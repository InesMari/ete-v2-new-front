import scrollTable from "@/components/scrollTable/scrollTable.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import $echarts from 'echarts'

export default {
    name: 'budgetAchievement',
    data() {
        return {
            head: [
                { "name": "账单编号", "code": "billNum", "width": "200", "type": "text" },
                { "name": "账单月份", "code": "billMonth", "width": "200", "type": "text" },
                { "name": "客户", "code": "tenantName", "width": "180", "type": "text" },
                { "name": "对账客户", "code": "custTenantName", "width": "180", "type": "text" },
                { "name": "账单金额", "code": "totalFee", "width": "150", "type": "text" },
                { "name": "账单备注", "code": "remark", "width": "200", "type": "text" },
                { "name": "所属区域", "code": "regionName", "width": "120", "type": "text" },
                { "name": "所属部门", "code": "orgName", "width": "160", "type": "text" },
                { "name": "创建人", "code": "createUserName", "width": "100", "type": "text" },
                { "name": "创建时间", "code": "createDate", "width": "150", "type": "text" }
            ],
            query: {},
            tabs: [
                { "name": "年度趋势", id: 1, active: true },
                { "name": "区域对比", id: 2 },
                { "name": "物流中心对比", id: 3 }
            ],
            currentTab: {},
            showType:"1",
        }
    },

    mounted() {
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
        clear() {
            return this.query = {

            };
        },
        /**
         * 查询列表
         */
        async doQuery() {
            //let { items } = await this.$refs.table.load("fcCustBillTF", "queryCustomerBillPage", this.query);
            // this.$refs.table.resetData(items);
        },
        initInnerInfo(){
            this.initChart();
        },
        initChart() {
            this.currentTab = this.tabs[0];
            this.$nextTick(() => {
                this.initYearChart();
            })
        },
        selectCallback(data) {
            this.currentTab = data;
            if (data.id == 1) {
                this.$nextTick(() => {
                    this.initYearChart();
                })
            } else if (data.id == 2) {
                this.$nextTick(() => {
                    this.initRegionChart();
                })
            } else if (data.id == 3) {
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
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '年度营收预算表',
                        type: 'line',
                        stack: 'Total',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '实际营收表',
                        type: 'line',
                        stack: 'Total',
                        data: [220, 182, 191, 234, 290]
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
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
                        data: [
                            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                        ]
                    },
                    {
                        name: '实际',
                        type: 'bar',
                        data: [
                            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                        ]
                    },
                    {
                        name: '达成率',
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                          valueFormatter: function (value) {
                            return value + ' %';
                          }
                        },
                        data: [2.0, 120.2, 30.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 60.2]
                    }
                ]
            };
            echart.setOption(option);
        },
        // 初始化物流中心对比图表
        initLogisticsChart() {
            const echart = $echarts.init(document.getElementById('logisticsChart'));
            let option = {
                legend: {
                    data: ['Evaporation', 'Precipitation', 'Temperature'],
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
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: 'Evaporation',
                        type: 'bar',
                        data: [
                            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                        ]
                    },
                    {
                        name: 'Precipitation',
                        type: 'bar',
                        data: [
                            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                        ]
                    },
                    {
                        name: 'Temperature',
                        type: 'line',
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
