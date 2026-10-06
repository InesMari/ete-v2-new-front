export default {
    name: 'specificBaseAnalysisSummary',
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
            orgName:null,
            summaryList: [],
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
            let data = await this.common.postUrl('fcReportTF','loadBusinessResultsAnalysisByOrgId', this.$route.query);
            this.budgetInfo = data.budgetInfo;
            this.actualInfo = data.actualInfo;
            data.monthData.forEach((item,index) => {
                if(data.monthData.length - 1 == index){
                    item.month = "合计"
                }else{                    
                    item.month = parseInt(item.yyyyMM.substring(4)) + "月";
                }
            })
            this.monthData = data.monthData;
            for(let i of this.monthData)
            {
                this.monthDataDouble.push({month: i.yyyyMM, name: "预算", type: 1});
                this.monthDataDouble.push({month: i.yyyyMM, name: "实绩", type: 2});
            }
            //合计
            this.summaryList = data.summaryList;
            this.projectNames = data.projectNames;
            this.orgName = data.orgName;
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        exportData()
        {
            let param = this.$route.query;
            param.selfCreateUrl = 'fcReportTF|exportBusinessResultsAnalysisByOrgId';
            this.common.downloadExcelFile('', param, '', '', '', 'specificBaseAnalysisSummaryTable');
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
