<template>
    <div id="addExam" class="addExamPage">
        <div class="examTitle">
            <div class="innerTitle" style="flex: 1;">
                <div class="label"><em>*</em>试卷标题</div>
                <el-input v-model="info.testName" maxlength="20" type="text" placeholder="请输入"></el-input>
            </div>
            <div class="score" style="width: 400px;">
                <div class="label">达标分数</div>
                <el-input v-model="info.standardScore" maxlength="10" type="number" placeholder="请输入"></el-input>
            </div>
        </div>
        <div class="opBtn clearfix">
            <el-button class="fr" type="primary" @click="addQues">新增题目</el-button>
        </div>
        <div class="examList">
            <div class="noQuestion" v-if="info.questions.length==0">请添加题目</div>
            <div class="item" v-for="(item,index) in info.questions">
                <i class="el-icon-error" @click="delQues(index)"></i>
                <i class="el-icon-edit" @click="editQues(item,index)"></i>
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
        <div class="page-bot-btn">
            <el-button type="primary" @click="save()">保存</el-button>
        </div>

        
        <!-- 添加题目 -->
        <el-dialog class="questionDialog" :title="dialogTitle" :visible.sync="questionDialog" width="800px" :close-on-click-modal="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">                    
                    <li class="item">
                        <label class="label-term"><em>*</em>题目类型</label>
                        <div class="input-text">
                            <el-select v-model="ques.type" clearable filterable placeholder="请选择题目类型" @change="changeType">
                                <el-option v-for="item in quesTypes" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>  
                    </li>
                </ul>
                <ul class="content clearfix">  
                    <li class="item">
                        <label class="label-term"><em>*</em>题目分数</label>
                        <div class="input-text">
                            <el-input v-model="ques.score" v-mynumval type="text" placeholder="请输入题目分数"></el-input>
                        </div>
                    </li>            
                    <li class="item item100">
                        <label class="label-term"><em>*</em>题目</label>
                        <div class="input-text">
                            <el-input v-model="ques.content" type="text" placeholder="请输入题目"></el-input>
                        </div>
                    </li>
                </ul>
                <!-- 单选、多选 -->
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="ques.type==1 || ques.type==2">
                    <thead>
                        <tr>
                            <th width="40"><i class="el-icon-circle-plus" @click="addAnswer"></i></th>
                            <th>选项文字</th>
                            <th>正确答案</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in ques.questionOptions">
                            <td><i class="el-icon-remove" @click="delAnswer(index)"></i></td>
                            <td>
                                <el-input v-model="item.content" @input="forceUpdate" type="text" placeholder="请输入选项文字"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="item.isAnswer" @change="singleSel(item)" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 判断题 -->
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="ques.type==3">
                    <thead>
                        <tr>
                            <th>选项文字</th>
                            <th>正确答案</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr v-for="(item,index) in ques.questionOptions">
                            <td>
                                {{ item.content }}
                            </td>
                            <td>
                                <el-checkbox v-model="item.isAnswer" @change="singleSel(item)" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr> -->
                        <tr>
                            <td>正确</td>
                            <td><el-checkbox v-model="ques.answer" true-label="1" false-label="0"></el-checkbox></td>
                        </tr>
                        <tr>
                            <td>错误</td>
                            <td><el-checkbox v-model="ques.answer" true-label="0" false-label="1"></el-checkbox></td>
                        </tr>
                    </tbody>
                </table>

            </div>            
            <div class="page-bot-btn">
                <el-button size="mini" @click="questionDialog = false">关闭</el-button>
                <el-button type="primary" size="mini" @click="saveEdit()">完成编辑</el-button>
            </div>
        </el-dialog>
        <!-- 添加题目 -->
    </div>
</template>
  
<script>
import addExam from "./addExam.js";
export default addExam;
</script>
<style lang="scss" src="./addExam.scss" scoped></style>
  