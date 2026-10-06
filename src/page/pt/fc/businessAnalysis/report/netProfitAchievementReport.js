import $echarts from "echarts";

export default {
    name: 'netProfitAchievementReport',
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
            let allData = await this.common.postUrl("fcReportTF", "getFcNetProfitAchievementReportInfo", {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')});
            this.projectNames = allData.projectNames;
            this.allDatas = allData.allDatas;
            this.calculateTotals(this.projectNames, this.allDatas,'total');
            this.initChart(allData.allDatas,"预算净利润", 'budgetNetProfit','实绩净利润','actualNetProfit','核算净利润','adjustNetProfit','chart1');
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        initChart(data,yDataName1,key1,yDataName2,key2,yDataName3,key3,divId){
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [yDataName1, yDataName2,yDataName3]
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
                    dimensions: ['orgName', key1,key2,key3],
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
                        barWidth:'60px',
                        smooth: true,
                    },
                    {
                        name: yDataName2,
                        type: 'line',
                        smooth: true,
                    } ,
                    {
                        name: yDataName3,
                        type: 'line',
                        smooth: true,
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
            // let actualNetProfit = 0;
            let adjustNetProfit = 0;
            let budgetNetProfit = 0;
            rowsData.forEach(row => {
                // 遍历每个项目，累加对应字段的值
                colsData.forEach(col => {
                    // 获取当前项目对应 rowsData 中的字段值
                    const value = parseFloat(col[row.code]) || 0;
                    // 累加到 total 中
                    row[code] = this.common.accAdd(row[code],value);
                });
                if(row.code=='adjustNetProfit'){
                    adjustNetProfit = row.total;
                }else if(row.code=='budgetNetProfit'){
                    budgetNetProfit = row.total;
                }
            });

            rowsData.forEach(row => {
                if(row.code=='achievementRate'){
                    let total = this.common.accDiv(adjustNetProfit,budgetNetProfit).myToFixed(4);
                    total = this.common.accMul(total,100);
                    row[code] = total;
                }
            });
        },
        downloadExcel(){
            let fileName = '净利达成表';
            let param = {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')};
            param.selfCreateUrl = 'fcReportTF|downloadFcNetProfitAchievementReportExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'fcNetProfitAchievementReport');
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
