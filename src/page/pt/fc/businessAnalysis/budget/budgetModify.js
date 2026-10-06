export default {
    name: 'budgetModify',
    data() {
        return {
            info: {
                dtls: []
            },
            projectNames: [],
        }
    },

    mounted() {
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
            this.projectNames.forEach(item => {
                if (item.valueSourceType != 1 && item.valueSourceType != 3) {
                    item.disable = true;
                }
            });
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        // 计算行合计
        toCalcRowsTotal(item, monthData, index){
            const timer = setTimeout(() => {
                if(this.currentHdIndex != index || document.activeElement.tagName !=="INPUT") this.calcRowsTotal(item, monthData, index);
                clearTimeout(timer);
            }, 500);
        },
        async calcRowsTotal(item, monthData, index) {
            let data = await this.common.postUrl("fcBudgetTF", "resolveValue", monthData);
            this.info.dtls[index] = data;
            this.info.dtls[12] = await this.common.postUrl("fcBudgetTF", "calTotalMap", {dtls:this.info.dtls});
            this.$forceUpdate();
        },
        async save() {
            await this.common.postUrl("fcBudgetTF", "saveFcBudgetInfo", this.info, null, null, null, true);
            this.$message.success("保存成功");
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        close(){
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);            

        },
    },
}
