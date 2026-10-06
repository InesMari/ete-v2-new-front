
export default {
    name: 'examination',
    data() {
        return {
            info:{
                id:this.$route.query.id,
                testDuration:0,//考试时长
                beginTime:0,//开始时间
                questions:[]
            },
        }
    },
    mounted() {
        this.doQuery();
    },
    components: {
        
    },
    methods: {
        async doQuery(){
            this.info = await this.common.postUrl("eduCourseService", "getEduTestInfo", {testId: this.$route.query.testId,relId:this.$route.query.id});
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    }
}
