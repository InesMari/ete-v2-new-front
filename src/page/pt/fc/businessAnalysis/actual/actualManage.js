import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'actualManage',
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
                { "name": "核算净利润", "code": "adjustNetProfit", "width": "100", "type": "text","isPermill":true },
            ],
            query: {
                orgIds: [],
                years: [String(new Date().getFullYear())],
            },
            orgData: [],
            actualInfo: {},
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
        myImport,
        tableCommon,
        searchList,
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
            let {items} = await this.$refs.table.load("fcActualTF", "queryFcActualInfoPage", this.query);
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
        dblclickItem(item, verifySts) {
            let urlName = '实绩详情';
            if(verifySts==1){
                urlName = '实绩审核';
            }else if (verifySts==2){
                urlName = '取消实绩审核';
            }
            this.open({
                query: { id: item.id, verifySts },
                urlId: 'actualDetail' + item.id + verifySts,
                urlName: urlName,
                urlPathName: '/actualDetail',
                urlPath: "/pt/fc/businessAnalysis/actual/actualDetail.vue",
            });
        },
        /** 打开关闭 弹窗 */
        showModifyDialog(flag) {
            if (flag) {
                this.showModify = true;
            } else {
                this.actualInfo = {};
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
            if (this.common.isBlank(this.actualInfo.year)) {
                this.$message.error("请选择实绩年度！");
                return;
            }
            if (this.common.isBlank(this.actualInfo.orgId)) {
                this.$message.error("请选择物流基地！");
                return;
            }
            this.actualInfo.isSaveUpload = "1";//服务端是否保存上传文件
            this.$refs.myImport.submitFileForm();
            this.doQuery();
        },
        // 新增
        add(){
            let data = {
                urlId: 'addActual'+new Date().getTime(),
                urlName: '实绩新建',
                urlPathName: '/addActual',
                urlPath: "/pt/fc/businessAnalysis/actual/addActual.vue",
            }
            this.open(data);
        },
        // 修改
        edit(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的实绩！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'actualModify' + selectData[0].id,
                query: {id: selectData[0].id},
                urlName: "修改实绩",
                urlPathName: '/addActual',
                urlPath: "/pt/fc/businessAnalysis/actual/addActual.vue",
            })
        },
        // 修改
        adjust(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的实绩！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'actualModify' + selectData[0].id,
                query: {id: selectData[0].id,adjust:1},
                urlName: "财务核算",
                urlPathName: '/addActual',
                urlPath: "/pt/fc/businessAnalysis/actual/addActual.vue",
            })
        },
        // 删除
        async deleteInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要删除的实绩！");
                return false;
            }
            let that = this;
            let item = selectData[0];
            this.$confirm(`你将删除${item.year}年【${item.orgName}】实绩，数据操作不可逆，是否继续？`, "提示").then(() => {
                this.common.postUrl("fcActualTF", "deleteFcActualInfo", { id: item.id }, function (data) {
                    that.doQuery();
                    that.$message.success("删除成功");
                }, null, null, true);
            }).catch(() => { })
        },
        // 审核
        verify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要审核的实绩！");
                return false;
            }
            this.dblclickItem(selectData[0], 1);
        },
        // 取消审核
        cancelVerify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要取消审核的实绩！");
                return false;
            }
            this.dblclickItem(selectData[0], 2);
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
