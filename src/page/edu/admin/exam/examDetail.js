
export default {
    name: 'examDetail',
    data() {
        return {
            info:{
                id:this.$route.query.id,
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
            this.info = await this.common.postUrl("eduCourseService", "getEduTestInfo", {id:this.$route.query.id,testId: this.$route.query.testId});
            
            this.info.questions.forEach(el => {
                el.type = String(el.type);
                if(this.common.isNotBlank(el.questionOptions)){
                    el.questionOptions.forEach(eItem => {
                        eItem.isAnswer = String(eItem.isAnswer);
                    })
                }
            })
            this.forceUpdate();
        },
    }
}
