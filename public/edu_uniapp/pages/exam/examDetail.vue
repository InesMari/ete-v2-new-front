<template>
	<view class="examDetailPage">

		<!-- 加载中 -->
		<view class="loading" v-if="loading">
			<text>加载中...</text>
		</view>

		<!-- 考试信息 -->
		<view class="examHeader" v-else>
			<view class="examName">{{ info.testName }}</view>
            <view class="examStats" style="margin:10px 0 3px;">
                <text class="statItem">
                    <text>考试课程：{{ info.courseName }}</text>
                </text>
            </view>
			<!-- <view class="scoreInfo">
				<view class="scoreItem">
					<view class="scoreValue user">{{ info.userScore }}</view>
					<view class="scoreLabel">我的得分</view>
				</view>
				<view class="scoreDivider">
					<text>/</text>
				</view>
				<view class="scoreItem">
					<view class="scoreValue total">{{ info.totalScore }}</view>
					<view class="scoreLabel">总分</view>
				</view>
			</view> -->
			<!-- <view class="passStatus" :class="{ pass: info.isPass }">
				<uni-icons :type="info.isPass ? 'checkmarkempty' : 'closeempty'" size="20"></uni-icons>
				<text>{{ info.isPassName }}</text>
			</view> -->
		</view>

		<!-- 答题区域 -->
        <scroll-view class="examContent" scroll-y>
            <view class="questionCard" v-for="(item, index) in info.questions" :key="item.id">
                <view class="questionHeader">
                    <view class="correctIcon" :class="{ correct: item.isCorrect == 1, wrong: item.isCorrect != 1 }">
                        <uni-icons :type="item.isCorrect == 1 ? 'checkmarkempty' : 'closeempty'" size="14"></uni-icons>
                    </view>
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
                             :class="{ selected: answer.selectAnswer == '1', wrongSelected: answer.selectAnswer == '1' && item.isCorrect != 1 }">
                            <text class="optionPrefix">{{ String.fromCharCode(65 + idx) }}</text>
                            <text class="optionText">{{ answer.content }}</text>
                            <text class="checkIcon" v-if="answer.selectAnswer == '1'" :class="{ wrongIcon: item.isCorrect != 1 }">✓</text>
                        </view>
                    </view>

                    <!-- 多选题 -->
                    <view v-if="item.type == 2" class="optionsList">
                        <view v-for="(answer, idx) in item.questionOptions" 
                             :key="idx"
                             class="optionItem multi"
                             :class="{ selected: answer.selectAnswer == '1', wrongSelected: answer.selectAnswer == '1' && item.isCorrect != 1 }">
                            <text class="checkboxIcon" :class="{ checked: answer.selectAnswer == '1', wrongChecked: answer.selectAnswer == '1' && item.isCorrect != 1 }">✓</text>
                            <text class="optionPrefix">{{ String.fromCharCode(65 + idx) }}</text>
                            <text class="optionText">{{ answer.content }}</text>
                        </view>
                    </view>

                    <!-- 判断题 -->
                    <view v-if="item.type == 3" class="optionsList judge">
                        <view class="optionItem"
                             :class="{ selected: item.selectAnswer == '1', wrongSelected: item.selectAnswer == '1' && item.isCorrect != 1 }">
                            <text class="optionPrefix">A</text>
                            <text class="optionText">正确</text>
                            <text class="checkIcon" v-if="item.selectAnswer == '1'" :class="{ wrongIcon: item.isCorrect != 1 }">✓</text>
                        </view>
                        <view class="optionItem"
                             :class="{ selected: item.selectAnswer == '0', wrongSelected: item.selectAnswer == '0' && item.isCorrect != 1 }">
                            <text class="optionPrefix">B</text>
                            <text class="optionText">错误</text>
                            <text class="checkIcon" v-if="item.selectAnswer == '0'" :class="{ wrongIcon: item.isCorrect != 1 }">✓</text>
                        </view>
                    </view>

                    <!-- 简答题 -->
                    <view v-if="item.type == 4" class="shortAnswer">
                        <textarea 
                            v-model="item.answerContent"
                            class="answerTextarea"
                            placeholder="请输入您的答案..."
                            :disabled="true"
                            @input="forceUpdate" />
                        <!-- <text class="wordCount">已输入 {{ (item.answerContent || '').length }} 字</text> -->
                    </view>
                </view>
            </view>
        </scroll-view>

		<!-- 底部按钮 -->
		<view class="bottomBar">
			<button type="default" @click="goBack">返回列表</button>
		</view>
	</view>
</template>

<script>
	import examDetail from './examDetail.js'
	export default examDetail
</script>

<style lang="scss" scoped>
.examDetailPage {
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	padding-bottom: 120rpx;
}

/* 顶部导航 */
.navBar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background: #fff;
	border-bottom: 1rpx solid #eee;

	.navBack {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.navTitle {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.navRight {
		width: 60rpx;
	}
}

/* 加载中 */
.loading {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
}

/* 考试信息头部 */
.examHeader {
	background: #fff;
	padding: 40rpx 30rpx;
	margin-bottom: 20rpx;

	.examName {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		// margin-bottom: 30rpx;
	}

	.scoreInfo {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;

		.scoreItem {
			text-align: center;

			.scoreValue {
				font-size: 56rpx;
				font-weight: bold;

				&.user {
					color: #e50011;
				}

				&.total {
					color: #666;
				}
			}

			.scoreLabel {
				font-size: 24rpx;
				color: #999;
				margin-top: 8rpx;
			}
		}

		.scoreDivider {
			font-size: 48rpx;
			color: #ccc;
			margin: 0 20rpx;
		}
	}

	.passStatus {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #f56c6c;

        .uni-icons{
            background-color: #f56c6c;
            border-radius: 50%;
            color: #fff!important;
            font-size: 14px !important;
            padding: 3px;
            margin-right: 8rpx;
        }

		&.pass {
			color: #52c41a;
            .uni-icons{
                background-color: #52c41a;
            }
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

.correctIcon {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.correct {
        background: #52c41a;
    }
    
    &.wrong {
        background: #f56c6c;
    }
    .uni-icons{
        color: #fff!important;
    }
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
    
    &.wrongSelected {
        background: #fef0f0;
        border-color: #f56c6c;
        
        .optionPrefix {
            background: #f56c6c;
            color: #fff;
        }
    }
    
    .wrongIcon {
        color: #f56c6c !important;
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
            
            &.wrongChecked {
                background: #f56c6c;
                border-color: #f56c6c;
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
/* 底部按钮 */
.bottomBar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	background: #fff;
	border-top: 1rpx solid #eee;
	z-index: 100;

	button {
		background: #007aff;
		color: #fff;
	}
}
</style>
