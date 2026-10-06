export default {
    name: 'monthlySummaryReport',
    data() {
        return {
            // 假数据
            beginYear: this.$route.query.beginMonth.split('-')[0],
            beginMonth: this.$route.query.beginMonth.split('-')[1],
            endYear: this.$route.query.endMonth.split('-')[0],
            endMonth: this.$route.query.endMonth.split('-')[1],
            fcBudgetDtls: [],
            fcActualDtls:[],
            projectNames: [],
            // 假数据 end
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
            this.allData = await this.common.postUrl("fcReportTF", "getFcMonthlySummaryReportInfo", {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')});
            this.projectNames = this.allData.projectNames;
            this.fcBudgetDtls = this.allData.fcBudgetDtls;
            this.fcActualDtls = this.allData.fcActualDtls;
            this.fcDiffDtls = this.allData.fcDiffDtls;
            this.calculateTotals(this.projectNames, this.fcBudgetDtls,'budgetTotal');
            this.calculateTotals(this.projectNames, this.fcActualDtls,'actualTotal');
            this.calculateTotals(this.projectNames, this.fcDiffDtls,'diffTotal');
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
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
            let fileName = '预算&实绩数据对比汇总简要报表';
            let param = {beginMonth:this.$route.query.beginMonth.replace('-',''),endMonth:this.$route.query.endMonth.replace('-','')};
            param.selfCreateUrl = 'fcReportTF|downloadFcMonthlySummaryReportExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'monthlySummaryReportTable');
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
