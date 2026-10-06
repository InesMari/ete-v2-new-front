<template>
    <div id="examDetail" class="addExamPage">
        <div class="examTitle">
            <div class="title">{{info.testName}}</div>
        </div>
        <div class="examList">
            <div class="item" v-for="(item,index) in info.questions">
                <div class="title">
                    {{ index+1 }}、{{ item.content }}
                    <span v-if="item.type == 1">（单选题）</span>
                    <span v-if="item.type == 2">（多选题）</span>
                    <span v-if="item.type == 3">（判断题）</span>
                    <span v-if="item.type == 4">（简答题）</span>
                    （{{ item .score }}分）
                </div>
                <div class="answers">
                    <div class="answer" v-for="(answer,index) in item.questionOptions">
                        <!-- 单选 -->
                        <el-radio v-model="answer.isAnswer" label="1" v-if="item.type==1">{{ answer.content }}</el-radio>
                        <!-- 多选 -->
                        <el-checkbox v-model="answer.isAnswer" true-label="1" v-if="item.type==2">{{ answer.content }}</el-checkbox>
                    </div>
                    <!-- 判断题 -->
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.answer" label="1">正确</el-radio>  
                    </div>
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.answer" label="0">错误</el-radio>  
                    </div>
                    <!-- 简答题 -->
                    <div class="box" v-if="item.type==4"></div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import examDetail from "./examDetail.js";
export default examDetail;
</script>
<style lang="scss" src="./addExam.scss" scoped></style>
<style lang="scss" scoped>
.addExamPage{
    .examList{
        height: calc(100% - 105px);
        padding:20px;
    }
}
</style>
  