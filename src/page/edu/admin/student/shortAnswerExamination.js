
export default {
    name: 'shortAnswerExamination',
    data() {
        return {
            info:{
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
            this.info = await this.common.postUrl("eduCourseService", "getEduTestInfo", {testId: this.$route.query.testId,relId:this.$route.query.relId,answerFlag:0,type: this.$route.query.showType});
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        async exam(){
            let info = this.info;
            if (this.common.isBlank(info.id))
            {
                this.$message.error("试卷不存在，请刷新试试！");
                return false;
            }
            if (this.common.isBlank(info.questions) || info.questions.length === 0)
            {
                this.$message.error("试卷简答题题目为空！");
                return false;
            }
            for (let i = 0; i < info.questions.length; i++)
            {
                let question = info.questions[i];
                if (this.common.isBlank(question.answerQuestionId))
                {
                    this.$message.error("试卷第" + (i + 1) + "条题目答案为空！");
                    return false;
                }
                if (this.common.isBlank(question.markScore))
                {
                    this.$message.error("试卷第" + (i + 1) + "条题目分数为空！");
                    return false;
                }
            }
            this.info.relId = this.$route.query.relId;
            await this.common.postUrl("eduTestService", "shortAnswerMark", this.info,null,null,null,true);
            this.$message.success("提交成功！");
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    }
}
