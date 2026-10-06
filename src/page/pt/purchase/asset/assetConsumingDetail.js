
export default {
    name: "assetConsumingDetail",
    components: {
    },
    data() {
        return {
            consumingList: [],
        };
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        // 初始化数据
        async doQuery() {
            this.consumingList = await this.common.postUrl('purStockService','queryPurConsumingListByAssetId',{id:this.$route.query.id});
            this.$forceUpdate();
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },

    },
};