import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport";

export default {
    name: 'budgetManage',
    props: [],
    data() {
        return {
            head: [
                { "name": "费用年度", "code": "year", "width": "120", "type": "text" },
                { "name": "物流基地", "code": "orgName", "width": "180", "type": "text" },
                { "name": "总收入", "code": "totalIncome", "width": "100", "type": "text","isPermill":true },
                { "name": "总成本", "code": "totalCost", "width": "100", "type": "text","isPermill":true },
                { "name": "毛利率（%）", "code": "profitRate", "width": "100", "type": "text" },
                { "name": "毛利额", "code": "grossProfit", "width": "100", "type": "text","isPermill":true },
                { "name": "管理费率（%）", "code": "managementFeeRate", "width": "100", "type": "text" },
                { "name": "管理费用", "code": "managementFee", "width": "100", "type": "text","isPermill":true },
                { "name": "净利率（%）", "code": "netProfitRate", "width": "100", "type": "text" },
                { "name": "净利润", "code": "netProfit", "width": "100", "type": "text","isPermill":true },
                { "name": "创建人", "code": "createUserName", "width": "100", "type": "text" },
                { "name": "创建时间", "code": "createDate", "width": "120", "type": "text" },
                { "name": "审核状态", "code": "verifyStsName", "width": "100", "type": "text" },
                { "name": "审核人", "code": "verifyUserName", "width": "100", "type": "text" },
                { "name": "审核时间", "code": "verifyDate", "width": "120", "type": "text" },
                { "name": "审核备注", "code": "verifyRemark", "width": "180", "type": "text" },
            ],
            query: {
                orgIds: [],
                years: [String(new Date().getFullYear())],
            },
            orgData: [],
            budgetInfo: {},
            showModify: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.doQuery();
    },

    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        myImport,
    },

    /**
     * 绑定函数
     */
    methods: {
        /**
         * 查询列表
         */
        async doQuery(query = this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("fcBudgetTF", "queryFcBudgetInfoPage", this.query);
            items.forEach(item => {
                this.head.forEach(hd => {
                    let value = item[hd.code];
                    if(!isNaN(value) && value < 0){
                        item.tdClass = "red";
                        item[hd.code+'tdClass'] = true;
                    }
                })
            })
        },
        /**
         * 初始化数据
         */
        async initData() {
            this.orgData = await this.common.postUrl("fcBudgetTF", "queryWorkOrgList", {});
        },
        /**
         * 清空
         */
        clear() {
            this.query =
            {
                orgIds: [],
                years: [],
            };
        },
        /** 打开关闭 弹窗 */
        showModifyDialog(flag) {
            if (flag) {
                this.showModify = true;
            } else {
                this.budgetInfo = {};
                this.$refs.myImport.close();
                this.showModify = false;
            }
        },
        myImportSuccessCallback() {
            this.$message.success("上传成功！");
            this.showModifyDialog(false);
            this.doQuery();
        },
        /** 确定导入 */
        saveReovery() {
            if (this.common.isBlank(this.budgetInfo.year)) {
                this.$message.error("请选择预算年度！");
                return;
            }
            if (this.common.isBlank(this.budgetInfo.managementFeeRate)) {
                this.$message.error("请输入管理费率！");
                return;
            }
            if (this.common.isBlank(this.budgetInfo.orgId)) {
                this.$message.error("请选择物流基地！");
                return;
            }
            this.budgetInfo.isSaveUpload = "1";//服务端是否保存上传文件
            this.$refs.myImport.submitFileForm();
            this.doQuery();
        },
        // 修改
        edit() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要修改的预算！");
                return false;
            }
            if (selectData[0].verifySts == 1) {
                this.$message.error("审核完成数据不能修改");
                return false;
            }
            this.$emit("openTab", {
                urlId: 'budgetModify' + selectData[0].id,
                query: { id: selectData[0].id },
                urlName: "修改预算",
                urlPathName: "/budgetModify",
                urlPath: "/pt/fc/businessAnalysis/budget/budgetModify.vue"
            });
        },
        dblclickItem(item, verifySts) {
            this.open({
                query: { id: item.id, verifySts },
                urlId: 'budgetDetail' + item.id + verifySts,
                urlName: verifySts ? '预算审核' : '预算详情',
                urlPathName: '/budgetDetail',
                urlPath: "/pt/fc/businessAnalysis/budget/budgetDetail.vue",
            });
        },
        // 删除
        async delect() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要删除的预算！");
                return false;
            }
            let that = this;
            let item = selectData[0];
            this.$confirm(`你将删除${item.year}年【${item.orgName}】预算，数据操作不可逆，是否继续？`, "提示").then(() => {
                this.common.postUrl("fcBudgetTF", "deleteFcBudgetInfo", item, function (data) {
                    that.doQuery();
                    that.$message.success("删除成功");
                }, null, null, true);
            }).catch(() => { })
        },
        // 审核
        verify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要审核的预算！");
                return false;
            }
            if (selectData[0].verifySts != 0) {
                this.$message.error("数据已审核，请勿重复审核");
                return false;
            }
            this.dblclickItem(selectData[0], 1);
        },
        // 审核
        cancelVerify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要取消审核的预算！");
                return false;
            }
            if (selectData[0].verifySts == 0) {
                this.$message.error("当前处于未审核状态，无需取消审核");
                return false;
            }
            let that = this;
            let item = selectData[0];
            this.$confirm(`你将取消审核${item.year}年【${item.orgName}】预算，数据操作不可逆，是否继续？`, "提示").then(() => {
                this.common.postUrl("fcBudgetTF", "cancelVerifyFcBudgetInfo", item, function (data) {
                    that.doQuery();
                    that.$message.success("取消审核成功");
                }, null, null, true);
            }).catch(() => { })
        },

        // 打开页面
        open(data) {
            this.$emit("openTab", {
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath
            });
        },


    },
    computed: {
        formData() {
            return [
                { "name": "物流基地", "row": 2, "model": "orgIds", "type": "select", "options": this.orgData, "label": "orgName", "value": "id", "placeholder": "物流基地", "method": "doQuery", "isshow": true, "multiple": true },
                { "name": "年度", "row": 2, "model": "years", "type": "years", "isshow": true },
            ]
        }
    },
}
