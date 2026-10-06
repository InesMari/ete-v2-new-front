export default {
    data() {
        return {
            info: {
                values: [],
                titles: [],
            },
            head: [],
            projectNames: [],
            verifySts: 0,
        }
    },
    mounted() {
        this.verifySts = this.$route.query.verifySts ? this.$route.query.verifySts : 0;
        this.queryDetail();
    },
    methods: {
        // 查询详情
        async queryDetail() {
            this.info = await this.common.postUrl("fcAnalysisTF", "getFcAnalysisInfo", { analysisId: this.$route.query.id });
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
                month.width = 70;
                this.head.push(month);
            }
            this.$forceUpdate();
            this.$nextTick(() => {
                this.common.tableStretch(this.$refs.table)
            })
        },
        // 审核跳转
        toVerify(item) {
            // if (item.verifySts == 0) {
                this.toDetail(item.id, 2);
            // }
        },
        // 关闭
        close() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        // 跳转详情
        toDetail(id, type = 1) {
            const config = this.getDetailConfig();
            this.$emit("openTab", {
                urlId: config.urlIdPrefix + id + '_' + type,
                query: {
                    id,
                    analysisId: this.$route.query.id,
                    type,
                },
                urlName: config.urlName,
                urlPathName: config.urlPathName,
                urlPath: config.urlPath
            });
        },

        // 跳转详情
        toFinanceDetail(id, type = 1) {
            const config = this.getDetailConfig();
            this.$emit("openTab", {
                urlId: config.financeUrlIdPrefix + id + '_' + type,
                query: {
                    id,
                    analysisId: this.$route.query.id,
                    type,
                },
                urlName: config.financeUrlName,
                urlPathName: config.financeUrlPathName,
                urlPath: config.financeUrlPath
            });
        },

        // 导出excel
        async exportExcel() {
            const config = this.getDetailConfig();
            let param = { analysisType: config.analysisType, analysisId: this.$route.query.id, year: this.info.year };
            param.selfCreateUrl = 'fcAnalysisTF|exportAnalysisInfo';
            this.common.downloadExcelFile('', param, '', '', '', config.exportFileName);
        },
        // 获取详情配置 - 子类需要重写
        getDetailConfig() {
            return {
                analysisType: 1,
                urlIdPrefix: 'transportMonthDetail',
                urlName: "ETE运输中心营收实际数据详情",
                urlPathName: "/transportMonthDetail",
                urlPath: "/pt/dataReport/operatingData/transport/transportMonthDetail.vue",
                exportFileName: 'transportOperatingDataDetail'
            }
        }
    },
}
