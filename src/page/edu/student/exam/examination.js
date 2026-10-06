
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
        this.beginTime = new Date().getTime();
        this.doQuery();
    },
    components: {
        
    },
    methods: {
        async doQuery(){
            this.info = await this.common.postUrl("eduCourseService", "getEduTestInfo", {testId: this.$route.query.testId,relId:this.$route.query.relId,answerFlag:1});
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        async exam(){
            this.info.testDuration = new Date().getTime() - this.beginTime;
            let info = this.info;

            if (this.common.isBlank(info.id))
            {
                this.$message.error("试卷不存在，请刷新试试！");
                return false;
            }
            if (this.common.isBlank(info.questions) || info.questions.length === 0)
            {
                this.$message.error("试卷题目为空！");
                return false;
            }
            for (let i = 0; i < info.questions.length; i++)
            {
                let question = info.questions[i];
                if (this.common.isBlank(question.id))
                {
                    this.$message.error("试卷第" + (i + 1) + "条题目不存在！");
                    return false;
                }
                if (question.type == 4)
                {
                    if (this.common.isBlank(question.answerContent))
                    {
                        this.$message.error("试卷第" + (i + 1) + "条题目答案为空！");
                        return false;
                    }
                }
                else if (question.type == 3)
                {
                    if (this.common.isBlank(question.selectAnswer) || question.selectAnswer < 0)
                    {
                        this.$message.error("试卷第" + (i + 1) + "条题目答案为空！");
                        return false;
                    }
                }
                else
                {
                    let answerCount = 0;
                    for (let j = 0; j < question.questionOptions.length; j++)
                    {
                        let option = question.questionOptions[j];
                        if (option.selectAnswer == "1")
                        {
                            answerCount++;
                        }
                    }
                    if (answerCount === 0)
                    {
                        this.$message.error("试卷第" + (i + 1) + "条题目还没有选择答案！");
                        return false;
                    }
                }
            }
            this.info.relId = this.$route.query.relId;
            await this.common.postUrl("eduTestService", "exam", this.info);
            this.$message.success("提交成功！");
            this.closePage();
        },
        chnageAnswer(item, answer)
        {
            item.questionOptions.forEach(el => {
                el.selectAnswer = "0";
            })
            answer.selectAnswer = "1";
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    }
}
