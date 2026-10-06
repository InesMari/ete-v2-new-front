import $echarts from "echarts";

export default {
    name: 'incomeCostReport',
    data() {
        return {
            // 假数据
            beginYear: this.$route.query.beginMonth.split('-')[0],
            beginMonth: this.$route.query.beginMonth.split('-')[1],
            endYear: this.$route.query.endMonth.split('-')[0],
            endMonth: this.$route.query.endMonth.split('-')[1],
            type: this.$route.query.type,
            orgName:'',
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
            let allData = await this.common.postUrl("fcReportTF", "getFcIncomeCostReportInfo", {beginMonth:this.$route.query.beginMonth.replace('-',''),
                endMonth:this.$route.query.endMonth.replace('-',''),type:this.$route.query.type,orgId:this.$route.query.orgId});
            this.projectNames = allData.projectNames;
            this.allDatas = allData.allDatas;
            this.orgName = allData.orgName;
            this.initPieChart(allData.allDatas,"收入", 'income','chart1');
            this.initPieChart(allData.allDatas,"成本", 'cost','chart2');
            this.initBarChart(allData.allDatas,"毛利额", 'profit','chart3');
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        initBarChart(data,tilteName,key,divId,type='bar'){
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [tilteName]
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
                    dimensions: ['name', key],
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
                        name: tilteName,
                        type: type,
                        smooth: true,
                    }
                ]
            };
            $echarts.init(document.getElementById(divId)).setOption(option);
        },

        initPieChart(data,tilteName,key,divId){
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [tilteName]
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
                    dimensions: ['name', key],
                    source: data
                },
                series: [
                    {
                        name: tilteName,
                        type: 'pie',
                        smooth: true,
                        radius:"60%",
                        avoidLabelOverlap: true,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                return params.name+'\n'+params.value[key]+'\n'+params.percent+"%";
                            }
                        }
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
            let fileName = '业务收入成本分析表';
            let param = {beginMonth:this.$route.query.beginMonth.replace('-',''),
                endMonth:this.$route.query.endMonth.replace('-',''),type:this.$route.query.type,orgId:this.$route.query.orgId};
            param.selfCreateUrl = 'fcReportTF|downloadFcIncomeCostReportExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'fcIncomeCostReport');
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
