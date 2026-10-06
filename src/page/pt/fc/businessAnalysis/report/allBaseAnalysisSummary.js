export default {
    name: 'allBaseAnalysisSummary',
    data() {
        return {
            budgetInfo:{
                totalIncome:null,
                totalCost:null,
                profitRate:null,
                grossProfit:null,
                managementFee:null,
                netProfitRate:null,
                netProfit:null,
            },
            actualInfo:{
                totalIncome:null,
                totalCost:null,
                profitRate:null,
                grossProfit:null,
                managementFee:null,
                netProfitRate:null,
                netProfit:null,
            },
            monthData: [],
            monthDataDouble: [],
            summaryList: [],
            baseList: [],
            projectNames:[],
            beginMonth:this.$route.query.beginMonth,
            endMonth:this.$route.query.endMonth,
        }
    },

    mounted() {
        let beginMonth = this.$route.query.beginMonth;
        let endMonth = this.$route.query.endMonth;
        if (this.common.isNotBlank(beginMonth))
        {
            this.beginMonth = beginMonth.substring(0, 4) + "年-" + beginMonth.substring(5) + "月";
        }
        if (this.common.isNotBlank(endMonth))
        {
            this.endMonth = endMonth.substring(0, 4) + "年-" + endMonth.substring(5) + "月";
        }
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {

    },
    methods: {
        async doQuery() {
            let data = await this.common.postUrl('fcReportTF','loadBusinessResultsAnalysis', this.$route.query);
            this.budgetInfo = data.budgetInfo;
            this.actualInfo = data.actualInfo;
            this.monthData = data.monthData;
            for(let i of this.monthData)
            {
                this.monthDataDouble.push({month: i.yyyyMM, name: "预算", type: 1});
                this.monthDataDouble.push({month: i.yyyyMM, name: "实绩", type: 2});
            }
            //合计
            this.summaryList = data.summaryList;
            this.baseList = data.baseList;
            this.projectNames = data.projectNames;
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
                this.baseList.forEach((item,index) => {
                    this.common.tableStretch(this.$refs['table'+index][0]);
                })
            })
        },
        exportData()
        {
            let param = this.$route.query;
            param.selfCreateUrl = 'fcReportTF|exportBusinessResultsAnalysis';
            this.common.downloadExcelFile('', param, '', '', '', 'allBaseAnalysisSummaryTable');
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
