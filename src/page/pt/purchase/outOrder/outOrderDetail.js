import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: "outOrderDetail",
    components: {
        fileViewer,
    },
    data() {
        return {
            info: {},
            dtlList: [],
            bigImageUrl:null,
            total:{
                outNums: 0,
            }
        };
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        // 初始化数据
        async doQuery() {
            let data = await this.common.postUrl('purStockService','loadPurPurchaseOutById',{id:this.$route.query.id});
            this.info = data.info;
            this.dtlList = data.dtlList;
            this.total.outNums = 0;
            data.dtlList.forEach(item => {
                this.total.outNums = this.common.accAdd(this.total.outNums, item.outNums);
            })
            this.$forceUpdate();

        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        seeBigImg(url){
            this.bigImageUrl = url;
            this.$refs.viewer.show();
            this.$forceUpdate();
        },
    },
};