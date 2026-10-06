import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    components: {
        tableCommon,
        searchList,
        myImport,
    },
    data() {
        return {
            head: [
                { "name": "年份", "code": "year", "width": "100", "type": "text" },
                { "name": "总收入预算", "code": "budgetTotalIncome", "width": "100", "type": "text" },
                { "name": "总收入实际", "code": "actualTotalIncome", "width": "100", "type": "text" },
                { "name": "总营收入达成率", "code": "totalIncomeAchievementRate", "width": "120", "type": "text" },
                { "name": "月营收入达成率", "width": "1200", children: [] },
                { "name": "创建人", "code": "createUserName", "width": "100", "type": "text" },
                { "name": "创建时间", "code": "createDate", "width": "100", "type": "text" },
            ],
            impBudget: false,
            impActual: false,
            budgetInfo: {},
            actualInfo: {},
        }
    },
    computed: {
        formData() {
            return [
                { "name": "年份", "model": "years", "type": "years", "isshow": true },
            ]
        }
    },
    mounted() {
        this.doQuery();
        this.init();
    },
    methods: {
        // 查询数据
        async doQuery(query = this.loadParam) {
            this.$refs.table.load("fcAnalysisTF", "queryFcAnalysisInfoPage", query);
        },
        // 初始化
        init() {
            this.initHead();
            this.doQuery();
        },
        initHead() {
            let childrens = this.head[4].children;
            for (let i = 1; i <= 12; i++) {
                childrens.push({ "name": i + "月", "code": "dtlTotalIncomeAchievementRate" + i , "width": "100", "type": "text" });
            }
            this.$refs.table.initHead();
        },

        // 导入预算
        exportBudget() {
            this.impBudget = true;
        },
        myImportBudgetCallback() {
            this.hideBudgetImp();
            this.doQuery();
            this.$message.success("导入成功");
        },
        addBudget() {
            if (this.common.isBlank(this.budgetInfo.year)) {
                this.$message.error("预算年度不能为空！");
                return;
            }
            this.$refs.myBudgetImport.submitFileForm();
        },
        hideBudgetImp() {
            this.impBudget = false;
            this.budgetInfo.year = "";
        },

        // 导入实际
        exportActual() {
            this.impActual = true;
        },
        myImportActualCallback() {
            this.hideActualImp();
            this.doQuery();
            this.$message.success("导入成功");
        },
        addActual() {
            if (this.common.isBlank(this.actualInfo.month)) {
                this.$message.error("实际月份不能为空！");
                return;
            }
            this.$refs.myActualImport.submitFileForm();
        },
        hideActualImp() {
            this.impActual = false;
            this.actualInfo.month = "";
        },

        // 删除
        async del() {
            let item = this.$refs.table.getSelectItem()[0];
            if (!item) {
                this.$message.warning("请先选择要删除的数据");
                return;
            }
            this.$confirm(`是否确认删除${item.year}年数据？`, "提示").then(async () => {
                await this.common.postUrl("fcAnalysisTF", "deleteFcAnalysisInfo", { analysisId: item.analysisId });
                this.$message.success("删除成功");
                this.doQuery();
            }).catch(() => { })
        },
    },
}
