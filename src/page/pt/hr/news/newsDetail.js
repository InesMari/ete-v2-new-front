
export default {
    name: "newsDetail",
    data() {
        return {
            info: {
                id:'',
                title:'',
                createDate:'',
                content:'',
            },
        };
    },
    mounted() {
        this.initQuestionData();
    },
    methods: {
        // 初始化数据
        async initQuestionData() {
            this.info = await this.common.postUrl('hrNewsTF','getNewsDetail',{id:this.$route.query.id});
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
};