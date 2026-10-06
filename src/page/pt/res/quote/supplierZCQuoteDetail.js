export default {
    name: 'supplierZCQuoteDetail',
    data() {
        return {
            info:{},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(){
            this.info = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", {quoteId: this.$route.query.quoteId});
        },
        toContractDetail(contractId)
        {
            let title = "查看供应商-仓储运作合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:3,id:contractId},
            });
        },
        /**
         * 关闭当前页面
         */
        close(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
