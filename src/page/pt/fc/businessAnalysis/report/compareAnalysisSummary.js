export default {
    name: 'allBaseAnalysisSummary',
    data() {
        return {
            info:{
                orgName: null,
                type: this.$route.query.type,
                typeName: this.$route.query.type == 1 ? '预算' : '实绩',
            },
            baseInfo:{
                totalIncome:null,
                totalCost:null,
                profitRate:null,
                grossProfit:null,
                managementFee:null,
                netProfitRate:null,
                netProfit:null,
                adjustNetProfit:null,
            },
            compareInfo:{
                totalIncome:null,
                totalCost:null,
                profitRate:null,
                grossProfit:null,
                managementFee:null,
                netProfitRate:null,
                netProfit:null,
                adjustNetProfit:null,
            },
            differ:{
                totalIncome:null,
                totalCost:null,
                profitRate:null,
                grossProfit:null,
                managementFee:null,
                netProfitRate:null,
                netProfit:null,
                adjustNetProfit:null,
            },
            list: [],
            beginMonth:this.$route.query.beginMonth,
            endMonth:this.$route.query.endMonth,
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
            let data = await this.common.postUrl('fcReportTF','loadSameMonthComparisonAnalysis', this.$route.query);
            this.baseInfo = data.baseInfo;
            this.compareInfo = data.compareInfo;
            this.calcDiffer(this.baseInfo, this.compareInfo, 'totalIncome');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'totalCost');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'profitRate');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'grossProfit');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'managementFee');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'netProfitRate');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'netProfit');
            this.calcDiffer(this.baseInfo, this.compareInfo, 'adjustNetProfit');

            this.list = data.list;
            this.info.orgName = data.orgName;
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        calcDiffer(src, dest, key)
        {
            let value = 0;
            let keyPercent = key + 'Percent';
            let percent = 0;
            if (src && dest && this.common.isNotBlank(src[key]) && this.common.isNotBlank(dest[key]))
            {
                let base = src[key];
                let compare = dest[key];
                value = this.common.accSub(compare, base);
                if (compare == 0)
                    percent = 0;
                else {
                    percent = (compare / base - 1) * 100;
                }
            }
            this.differ[key] = value;
            this.differ[keyPercent] = percent.myToFixed(2);
        },
        exportData()
        {
            let param = this.$route.query;
            param.selfCreateUrl = 'fcReportTF|exportSameMonthComparisonAnalysis';
            this.common.downloadExcelFile('', param, '', '', '', 'compareAnalysisSummaryTable');
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
