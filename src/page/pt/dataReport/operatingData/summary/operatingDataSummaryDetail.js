import operatingDataDetailMixin from '../operatingDataDetailMixin.js';

export default {
    name: 'operatingDataSummaryDetail',
    mixins: [operatingDataDetailMixin],
    methods: {
        // 查询详情
        async queryDetail() {
            this.info = await this.common.postUrl("fcAnalysisTF", "queryFcAnalysisSummaryInfoDtl", { year: this.$route.query.year });
            this.projectNames = [];
            this.info.titles.forEach((item, index) => {
                let obj = {};
                obj.name = item.title || "标题";
                obj.isTitle = true;
                this.projectNames.push(obj);
                if (item.codeList) {
                    item.codeList.forEach(codeItem => {
                        this.projectNames.push(codeItem);
                    })
                }
            });
            this.head = [];
            for (let i = 1; i <= 12; i++) {
                let month = this.info.values["month" + i];
                month.name = i + "月";
                this.head.push(month);
            }
            this.$forceUpdate();
            this.$nextTick(() => {
                this.common.tableStretch(this.$refs.table)
            })
        },
        getDetailConfig() {
            return {
                analysisType: 0,
            }
        }
        
    },
}
