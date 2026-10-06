export default {
    name: 'budgetDetail',
    data() {
        return {
            info: {
                dtls: []
            },
            projectNames: [],
            verifySts: 0,
            showVerify:false,
        }
    },

    mounted() {
        this.verifySts = this.$route.query.verifySts?1:0;
        this.queryDetail();
    },
    /**
     * 组件
     */
    components: {

    },
    methods: {
        /**
         * 初始化数据
         */
        async queryDetail() {
            this.info = await this.common.postUrl("fcBudgetTF", "getFcBudgetInfo", { id: this.$route.query.id });
            this.projectNames = await this.common.postUrl("fcBudgetTF", "queryFcAttrInfoList", {type:1});
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        showVerifyDialog(flag){
            if (flag) {
                this.showVerify = true;
            } else {
                this.budgetInfo = {};
                this.showVerify = false;
            }
        },
        async verify(type){
            let verifyRemark = this.info.verifyRemark;
            if(type == 2 && !verifyRemark){
                this.$message.error("请填写审核不通过原因");
                return;
            }
            await this.common.postUrl("fcBudgetTF", "verifyFcBudgetInfo", {id:this.$route.query.id,type,verifyRemark}, null, null, null, true);
            this.$message.success("审核成功");
            this.close();
        },
        exportExcel()
        {
            let param = this.$route.query;
            param.selfCreateUrl = 'fcBudgetTF|exportBudgetDetail';
            this.common.downloadExcelFile('', param, '', '', '', 'budgetDetailTable');
        },
        close(){
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);            

        },
    },
}
