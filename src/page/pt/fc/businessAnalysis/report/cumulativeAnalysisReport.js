import $echarts from "echarts";

export default {
    name: 'cumulativeAnalysisReport',
    data() {
        return {
            // 假数据
            beginYear: this.$route.query.beginMonth.split('-')[0],
            beginMonth: this.$route.query.beginMonth.split('-')[1],
            endYear: this.$route.query.endMonth.split('-')[0],
            endMonth: this.$route.query.endMonth.split('-')[1],
            allDatas: [],
            projectNames: [],
        }
    },

    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {

    },
    methods: {
        async doQuery() {
            let allData = await this.common.postUrl("fcReportTF", "getFcCumulativeAnalysisReportInfo", {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')});
            this.projectNames = allData.projectNames;
            this.allDatas = allData.allDatas;
            this.calculateTotals(this.projectNames, this.allDatas,'total');
            this.initChart(allData.allDatas,"预算收入", 'budgetTotalIncome','实际收入','actualTotalIncome','chart1');
            this.initChart(allData.allDatas,"预算成本", 'budgetTotalCost','实际成本','actualTotalCost','chart2');
            this.initChart(allData.allDatas,"预算收入", 'budgetTotalIncome','预算成本','budgetTotalCost','chart3');
            this.initChart(allData.allDatas,"实际收入", 'actualTotalIncome','实际成本','actualTotalCost','chart4');
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        initChart(data,yDataName1,key1,yDataName2,key2,divId){
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [yDataName1, yDataName2]
                },
                grid: {
                    top: 30,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                dataset: {
                    // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
                    // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
                    // 如果不指定 dimensions，也可以通过指定 series.encode
                    // 完成映射，参见后文。
                    dimensions: ['orgName', key1,key2],
                    source: data
                },
                xAxis: {
                    type: 'category',
                    axisLabel: { interval: 0, rotate: 30 }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: yDataName1,
                        type: 'bar',
                        smooth: true,
                        barMaxWidth:60,
                    },
                    {
                        name: yDataName2,
                        type: 'bar',
                        smooth: true,
                        barMaxWidth:60,
                    }
                ]
            };
            $echarts.init(document.getElementById(divId)).setOption(option);
        },
        calculateTotals(rowsData, colsData,code) {
            // 初始化每个项目的 total 为 0
            rowsData.forEach(item => {
                item[code] = 0;
            });

            // 遍历每个月的数据
            rowsData.forEach(row => {
                // 遍历每个项目，累加对应字段的值
                colsData.forEach(col => {
                    // 获取当前项目对应 rowsData 中的字段值
                    const value = parseFloat(col[row.code]) || 0;
                    // 累加到 total 中
                    row[code] = this.common.accAdd(row[code],value);
                });
            });
        },
        downloadExcel(){
            let fileName = '预算&实绩数据累计分析报表';
            let param = {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')};
            param.selfCreateUrl = 'fcReportTF|downloadFcCumulativeAnalysisReportExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'cumulativeAnalysisReport');
            this.closeDownload();
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
