<template>
    <div id="examination" class="examinationPage">
        <div class="examTitle">
            <div class="title">{{info.testName}}</div>
        </div>
        <div class="examList">
            <div class="item" v-for="(item,index) in info.questions" :style="item.type==4?'width: 70%;':''">
                <i class="icon el-icon-check" v-if="item.isCorrect == 1 && item.type!= 4"></i>
                <i class="icon el-icon-close" v-if="item.isCorrect == 0 && item.type!= 4"></i>
                <div class="title">
                    {{ index+1 }}、{{ item.content }}
                    <span v-if="item.type == 1">（单选题）</span>
                    <span v-if="item.type == 2">（多选题）</span>
                    <span v-if="item.type == 3">（判断题）</span>
                    <span v-if="item.type == 4">（简答题）</span>
                    （{{ item .score }}分）
                    <span class="red score" v-if="item.type == 4">得分:{{ item .markScore }}分</span>
                </div>
                <div class="answers">
                    <div class="answer" v-for="(answer,index) in item.questionOptions">
                        <!-- 单选 -->
                        <el-radio v-model="answer.selectAnswer" label="1" v-if="item.type==1">{{ answer.content }}</el-radio>
                        <!-- 多选 -->
                        <el-checkbox v-model="answer.selectAnswer" true-label="1" v-if="item.type==2">{{ answer.content }}</el-checkbox>
                    </div>
                    <!-- 判断题 -->
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.selectAnswer" label="1" >正确</el-radio>
                    </div>
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.selectAnswer" label="0">错误</el-radio>
                    </div>
                    <!-- 简答题 -->
                    <div class="shortAnswerText" v-if="item.type==4">
                        <label class="label-term">回答：</label>
                        <span>{{ item.answerContent }}</span>
                    </div>
                    <div class="shortAnswerText" v-if="item.type==4 && item.markContent">
                        <label class="label-term">评语：</label>
                        <span>{{ item.markContent }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import examination from "./examination.js";
export default examination;
</script>
<style lang="scss" src="./examination.scss" scoped></style>