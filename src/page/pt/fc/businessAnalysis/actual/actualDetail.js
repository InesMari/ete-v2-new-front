export default {
    name: 'actualDetail',
    data() {
        return {
            info: {
                dtls: []
            },
            projectNames: [],
            verifySts: 0,
            currentItem:{},
            showVerify: false,
        }
    },

    mounted() {
        this.verifySts = this.$route.query.verifySts?this.$route.query.verifySts:0;
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
            this.info = await this.common.postUrl("fcActualTF", "getFcActualInfo", { id: this.$route.query.id });
            this.projectNames = await this.common.postUrl("fcBudgetTF", "queryFcAttrInfoList", {});
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        toVerify(item){
            if(item.verifySts == 0 && this.verifySts == 1){
                this.currentItem = item;
                if(!this.currentItem.code00000009&&!this.currentItem.code00000010){
                    let that = this;
                    this.$confirm(`${item.name}实绩财务还没有调整数据，是否继续审核？`, "提示").then(() => {
                        that.showVerifyDialog(true);
                    }).catch(() => { })
                }else{
                    this.showVerifyDialog(true);
                }
            }
        },
        toCancelVerify(item){
            if(item.verifySts == 1 && this.verifySts == 2){
                let that = this;
                this.$confirm(`你将取消审核${item.name}实绩，数据操作不可逆，是否继续？`, "提示").then(() => {
                    this.common.postUrl("fcActualTF", "cancelVerifyFcActualDtl", item, function (data) {
                        that.queryDetail();
                        that.$message.success("取消审核成功");
                    }, null, null, true);
                }).catch(() => { })
            }
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
            let verifyRemark = this.currentItem.verifyRemark;
            if(type == 2 && !verifyRemark){
                this.$message.error("请填写审核不通过原因");
                return;
            }
            await this.common.postUrl("fcActualTF", "verifyFcActualDtl", {id:this.currentItem.id,type,verifyRemark}, null, null, null, true);
            this.$message.success("审核成功");
            this.queryDetail();
            this.showVerifyDialog(false);
        },
        close(){
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);            

        },
        exportExcel(){
            let param = this.$route.query;
            param.selfCreateUrl = 'fcActualTF|exportActualDetail';
            this.common.downloadExcelFile('', param, '', '', '', 'actualDetailTable');
        },
    },
}
