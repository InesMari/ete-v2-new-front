<template>
    <view class="examPage">
        <!-- 顶部信息栏 -->
        <view class="examHeader">
            <view class="examInfo">
                <view class="examName">{{ info.testName }}</view>
                <view class="examStats" style="margin:10px 0 3px;">
                    <text class="statItem">
                        <text>考试课程：{{ info.courseName }}</text>
                    </text>
                </view>
                <view class="examStats">
                    <text class="statItem">
                        <text>共 {{ info.questions.length }} 题</text>
                    </text>
                    <text class="statItem">
                        <text>总分 {{ info.totalScore }} 分</text>
                    </text>
                </view>
            </view>
            <view class="examRight">
                <view class="elapsedTime">
                    <text class="iconfont icon-time"></text>
                    <text>已用时：{{ getElapsedTime() }}</text>
                </view>
                <!-- <text class="switchCount" :class="{ warning: examInfo.switchCount > 0 }">
                    <text class="iconfont icon-warning"></text>
                    切出 {{ examInfo.switchCount }} 次
                </text> -->
            </view>
        </view>

        <!-- 答题区域 -->
        <scroll-view class="examContent" scroll-y>
            <view class="questionCard" v-for="(item, index) in info.questions" :key="item.id">
                <view class="questionHeader">
                    <text class="questionIndex">第 {{ index + 1 }} 题</text>
                    <view class="questionType">
                        <uni-tag v-if="item.type == 1" :text="'单选题'" size="small" type="primary"></uni-tag>
                        <uni-tag v-if="item.type == 2" :text="'多选题'" size="small" type="success"></uni-tag>
                        <uni-tag v-if="item.type == 3" :text="'判断题'" size="small" type="warning"></uni-tag>
                        <uni-tag v-if="item.type == 4" :text="'简答题'" size="small" type="info"></uni-tag>
                    </view>
                    <text class="questionScore">{{ item.score }}分</text>
                </view>
                <view class="questionContent">{{ item.content }}</view>
                <view class="questionAnswers">
                    <!-- 单选题 -->
                    <view v-if="item.type == 1" class="optionsList">
                        <view v-for="(answer, idx) in item.questionOptions" 
                             :key="idx"
                             class="optionItem"
                             :class="{ selected: answer.selectAnswer == '1' }"
                             @click="changeAnswer(item, answer)">
                            <text class="optionPrefix">{{ String.fromCharCode(65 + idx) }}</text>
                            <text class="optionText">{{ answer.content }}</text>
                            <text class="checkIcon" v-if="answer.selectAnswer == '1'">✓</text>
                        </view>
                    </view>

                    <!-- 多选题 -->
                    <view v-if="item.type == 2" class="optionsList">
                        <view v-for="(answer, idx) in item.questionOptions" 
                             :key="idx"
                             class="optionItem multi"
                             :class="{ selected: answer.selectAnswer == '1' }"
                             @click="toggleMultiAnswer(answer)">
                            <text class="checkboxIcon" :class="{ checked: answer.selectAnswer == '1' }">✓</text>
                            <text class="optionPrefix">{{ String.fromCharCode(65 + idx) }}</text>
                            <text class="optionText">{{ answer.content }}</text>
                        </view>
                    </view>

                    <!-- 判断题 -->
                    <view v-if="item.type == 3" class="optionsList judge">
                        <view class="optionItem"
                             :class="{ selected: item.selectAnswer == '1' }"
                             @click="item.selectAnswer = '1'">
                            <text class="optionPrefix">A</text>
                            <text class="optionText">正确</text>
                            <text class="checkIcon" v-if="item.selectAnswer == '1'">✓</text>
                        </view>
                        <view class="optionItem"
                             :class="{ selected: item.selectAnswer == '0' }"
                             @click="item.selectAnswer = '0'">
                            <text class="optionPrefix">B</text>
                            <text class="optionText">错误</text>
                            <text class="checkIcon" v-if="item.selectAnswer == '0'">✓</text>
                        </view>
                    </view>

                    <!-- 简答题 -->
                    <view v-if="item.type == 4" class="shortAnswer">
                        <textarea 
                            v-model="item.answerContent"
                            class="answerTextarea"
                            placeholder="请输入您的答案..."
                            @input="forceUpdate" />
                        <text class="wordCount">已输入 {{ (item.answerContent || '').length }} 字</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部提交栏 -->
        <view class="examFooter">
            <view class="footerActions">
                <button size="mini" class="btn btn-default" @click="handleBack">返回</button>
                <button size="mini" class="btn btn-primary" @click="handleSubmit" :loading="examInfo.isSubmitting">提交试卷</button>
            </view>
        </view>

    </view>
</template>

<script>
import exam from "./exam.js";
export default exam;
</script>

<style lang="scss" scoped>
.examPage {
    min-height: 100vh;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
}

/* 顶部信息栏 */
.examHeader {
    background: #fff;
    padding: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: sticky;
    top:0;
}

.examInfo {
    flex: 1;
}

.examName {
    font-size: 32rpx;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12rpx;
}

.examStats {
    display: flex;
    gap: 24rpx;
}

.statItem {
    font-size: 24rpx;
    color: #909399;
    
    .iconfont {
        margin-right: 8rpx;
        color: #c0c4cc;
    }
}

/* 右侧信息 */
.examRight {
    text-align: right;
}

.elapsedTime {
    font-size: 26rpx;
    color: #606266;
    margin-bottom: 8rpx;
    
    .iconfont {
        margin-right: 8rpx;
        color: #409eff;
    }
}

.switchCount {
    font-size: 24rpx;
    color: #909399;
    display: inline-flex;
    align-items: center;
    
    .iconfont {
        margin-right: 8rpx;
        color: #909399;
    }
    
    &.warning {
        color: #e6a23c;
        
        .iconfont {
            color: #e6a23c;
        }
    }
}

/* 答题区域 */
.examContent {
    flex: 1;
    padding: 24rpx;
    padding-top: 20rpx;
    padding-bottom: 160rpx;
    max-width: 900rpx;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.questionCard {
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.questionHeader {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    gap: 16rpx;
}

.questionIndex {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
}

.questionType {
    flex: 1;
}

.questionScore {
    font-size: 26rpx;
    color: #909399;
}

.questionContent {
    font-size: 28rpx;
    color: #303133;
    line-height: 1.8;
    margin-bottom: 28rpx;
}

/* 选项列表 */
.optionsList {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.optionItem {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #f5f7fa;
    border: 2px solid transparent;
    border-radius: 12rpx;
    
    &.selected {
        background: #ecf5ff;
        border-color: #409eff;
        
        .optionPrefix {
            background: #409eff;
            color: #fff;
        }
        
        .checkIcon {
            color: #409eff;
        }
    }
    
    .optionPrefix {
        width: 48rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 50%;
        font-weight: 600;
        color: #606266;
        margin-right: 16rpx;
        font-size: 26rpx;
    }
    
    .optionText {
        flex: 1;
        color: #606266;
        line-height: 1.6;
        font-size: 28rpx;
    }
    
    .checkIcon {
        font-size: 32rpx;
        margin-left: 12rpx;
        font-weight: bold;
    }
    
    &.multi {
        .checkboxIcon {
            width: 36rpx;
            height: 36rpx;
            border: 2px solid #c0c4cc;
            border-radius: 6rpx;
            margin-right: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22rpx;
            color: #fff;
            
            &.checked {
                background: #409eff;
                border-color: #409eff;
            }
        }
    }
    
    &.judge {
        display: inline-flex;
        width: auto;
        padding: 24rpx 32rpx;
        margin-right: 20rpx;
    }
}

/* 简答题 */
.shortAnswer {
    .answerTextarea {
        width: 100%;
        height: 200rpx;
        padding: 20rpx;
        background: #f5f7fa;
        border-radius: 12rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        border: 2px solid transparent;
        
        &:focus {
            border-color: #409eff;
            background: #fff;
        }
    }
    
    .wordCount {
        display: block;
        text-align: right;
        font-size: 24rpx;
        color: #c0c4cc;
        margin-top: 12rpx;
    }
}

/* 底部提交栏 */
.examFooter {
    background: #fff;
    padding: 24rpx 30rpx;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    .btn{        
        flex:1;
    }
}

.footerActions {
    display: flex;
    gap: 16rpx;
}

/* 按钮样式 */
.btn {
    font-size: 28rpx;
    border-radius: 8rpx;
    
    &.btn-default {
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
    }
    
    &.btn-primary {
        background: #409eff;
        border: 1px solid #409eff;
        color: #fff;
    }
}
</style>
