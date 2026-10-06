import WangEditor from "@/components/wangEditor/wangEditor.vue";

export default {
    name: "questionDetail",
    components: {
        WangEditor,
    },
    data() {
        return {
            info: {
                id:'',
                name:'',
                type:'',
                sortId:'',
                isPopular:'1',
            },
        };
    },
    mounted() {
        this.initQuestionData();
    },
    methods: {
        // 初始化数据
        async initQuestionData() {
            this.info = await this.common.postUrl('hcQuestionTF','getQuestionInfoDetail',{id:this.$route.query.id});
            console.log(this.info);
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