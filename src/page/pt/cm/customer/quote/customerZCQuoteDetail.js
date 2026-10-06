export default {
    name: 'customerZCQuoteDetail',
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
        /**
         * 关闭当前页面
         */
        close(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
