
export default {
    name: 'addExam',
    data() {
        return {
            info:{
                id:this.$route.query.id,
                standardScore:80,
                questions:[]
            },
            questionDialog:false,
            dialogTitle:"第1题",
            quesTypes:[],
            ques:{},
        }
    },
    mounted() {
        this.initData();
        if(this.common.isNotBlank(this.$route.query.testId)){
            this.doQuery();
        }
    },
    components: {
        
    },
    methods: {
        async initData(){
            this.quesTypes = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TEST_QUESTION_TYPE"});
        },
        async doQuery(){
            this.info = await this.common.postUrl("eduCourseService", "getEduTestInfo", {id:this.$route.query.id,testId: this.$route.query.testId});
            this.info.testId = this.$route.query.testId;
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
        forceUpdate(){
            this.$forceUpdate();
        },
        // 添加题目
        addQues(){
            this.questionDialog = true;
            this.dialogTitle = `第${this.info.questions.length+1}题`;
            this.ques = {};
            this.currentIndex = null;
        },
        // 更改题目
        editQues(item,index){
            this.questionDialog = true;
            this.dialogTitle = `第${index+1}题`;
            this.ques = this.common.copyObj(item);
            this.currentIndex = index;
        },
        // 删除题目
        delQues(index){
            this.info.questions.splice(index,1);
        },
        // 更换类型
        changeType(){
            // 判断题
            if(this.ques.type == 3){
                this.ques.questionOptions = [
                    {content:"正确",isAnswer:0},
                    {content:"错误",isAnswer:0},
                ];
            }else{
                this.ques.questionOptions = [
                        {content:"",isAnswer:0},
                        {content:"",isAnswer:0},
                ];
            }
        },
        // 添加答案选项
        addAnswer(){
            let obj = {content:"",isAnswer:0};
            this.ques.questionOptions.push(obj);
            this.$forceUpdate();
        },
        // 删除答案选项
        delAnswer(index){
            if(this.ques.questionOptions.length==2){
                this.$message.error("最少保留两个答案选项");
                return;
            }
            this.ques.questionOptions.splice(index,1);
            this.$forceUpdate();
        },
        // 单选（单选题或者判断题）
        singleSel(item){
            if(this.ques.type == 1 || this.ques.type == 3){
                this.ques.questionOptions.forEach(el => {
                    el.isAnswer = '0';
                })
                item.isAnswer = '1';
            }
            this.$forceUpdate();
        },
        // 保存题目编辑
        saveEdit(){
            this.questionDialog = false;
            if(this.common.isBlank(this.ques.type)){
                this.$message.error("请选择题目类型");
                return;
            }
            if(this.common.isBlank(this.ques.score)){
                this.$message.error("请输入题目分数");
                return;
            }
            if(this.common.isBlank(this.ques.content)){
                this.$message.error("请输入题目");
                return;
            }
            // 判断
            if(this.common.isBlank(this.ques.answer) && this.ques.type == 3){
                this.$message.error("请设置正确答案");
                return;
            }
            // 单选
            if(this.ques.type == 1){
                let isSel = false;
                for(let el of this.ques.questionOptions){
                    if(this.common.isBlank(el.content)){
                        this.$message.error("选项文字不能为空");
                        return;
                        break;
                    }
                    if(el.isAnswer == '1'){
                        isSel = true
                    }
                }
                if(!isSel){
                    this.$message.error("请设置正确答案");
                    return;
                }
            }
            // 多选
            if(this.ques.type == 2){
                let selNum = 0;
                for(let el of this.ques.questionOptions){
                    if(this.common.isBlank(el.content)){
                        this.$message.error("选项文字不能为空");
                        return;
                        break;
                    }
                    if(el.isAnswer == '1'){
                        selNum++;
                    }
                }
                if(selNum<2){
                    this.$message.error("多选题至少设置两个正确答案");
                    return;
                }
            }
            if(this.common.isBlank(this.currentIndex)){
                this.info.questions.push(this.ques);
            }else{
                this.info.questions[this.currentIndex] = this.common.copyObj(this.ques);
            }
        },
        // 保存试卷
        async save(){
            if(this.common.isBlank(this.info.testName)){
                this.$message.error("请输入试卷标题");
                return;
            }
            await this.common.postUrl("eduCourseService", "saveEduTestInfo", this.info,null,null,null,true);
            this.$message.success("保存成功");
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    }
}
