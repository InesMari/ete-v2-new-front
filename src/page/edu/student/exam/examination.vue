<template>
    <div id="examination" class="examinationPage">
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
                        <el-radio v-model="answer.selectAnswer" @change="chnageAnswer(item, answer)" label="1" v-if="item.type==1">{{ answer.content }}</el-radio>
                        <!-- 多选 -->
                        <el-checkbox v-model="answer.selectAnswer" true-label="1" v-if="item.type==2">{{ answer.content }}</el-checkbox>
                    </div>
                    <!-- 判断题 -->
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.selectAnswer" label="1">正确</el-radio>
                    </div>
                    <div class="answer" v-if="item.type==3">
                        <el-radio v-model="item.selectAnswer" label="0">错误</el-radio>
                    </div>
                    <!-- 简答题 -->
                    <el-input v-model="item.answerContent" type="textarea" @input="forceUpdate" class="shortAnswer" v-if="item.type==4"></el-input>
                </div>
            </div>
            <div class="bot-btn">                
                <el-button @click="exam" class="btn" type="primary" plain>提交考卷
                </el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import examination from "./examination.js";
export default examination;
</script>
<style lang="scss" src="./examination.scss" scoped></style>