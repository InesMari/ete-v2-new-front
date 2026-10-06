<template>
    <div id="shortAnswerExamination" class="shortAnswerExaminationPage">
        <div class="examTitle">
            <div class="title">{{info.testName}}</div>
        </div>
        <div class="examList">
            <div class="item" v-for="(item,index) in info.questions">
                <div class="title">
                    {{ index+1 }}、{{ item.content }}（{{ item.score }}分）
                </div>
                <div class="answers">
                    <!-- 简答题 -->
                    <el-input v-model="item.answerContent" type="textarea" @input="forceUpdate" class="shortAnswer" disabled></el-input>
                    <div style="line-height:30px;font-size:16px;margin-top:40px;">评分：</div>
                    <el-input v-model="item.markScore" v-mynumval @input="forceUpdate" class="shortAnswer" placeholder="请输入评分"></el-input>
                    <div style="line-height:30px;font-size:16px;margin-top:10px;">评语：</div>
                    <el-input v-model="item.markContent" type="textarea" @input="forceUpdate" class="shortAnswer" placeholder="请输入评语" ></el-input>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="exam" class="btn" type="primary" plain>提交评分
                </el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import shortAnswerExamination from "./shortAnswerExamination.js";
export default shortAnswerExamination;
</script>
<style lang="scss" src="./shortAnswerExamination.scss" scoped></style>