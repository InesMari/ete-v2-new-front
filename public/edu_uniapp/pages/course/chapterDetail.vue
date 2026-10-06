<template>
	<view class="chapterDetailPage">
		<!-- 章节信息 -->
		<view class="chapterHeader">
			<view class="title">{{ chapterInfo.chapterTitle }}</view>
			<view class="desc">{{ chapterInfo.introduction }}</view>
		</view>

		<!-- 内容区域 -->
		<view class="contentArea">
			<!-- 视频播放 -->
			<view class="videoContainer" v-if="isVideo">
				<video
					id="myVideo"
					:src="fileInfo.fileUrl"
					:poster="fileInfo.posterUrl"
					:initial-time="previousTime"
					controls
					controlslist="noplaybackrate nodownload nofastforward"
					enable-danmu
					enable-play-gesture
					show-center-play-btn
					show-play-btn
					show-fullscreen-btn
					show-loading
					referrerpolicy="no-referrer"
					@timeupdate="videoTimeUpdate"
					@ended="videoEnded"
					@error="videoError"
					@play="videoPlay"
					@pause="videoPause"
				></video>
			</view>

			<!-- PDF文档 -->
			<view class="pdfContainer" v-else>
				<!-- PDF加载提示 -->
				<view class="pdfLoading" v-if="isPdfLoading">
					<view class="loadingContent">
						<view class="loadingIcon"></view>
						<text>PDF渲染中...</text>
					</view>
				</view>
				<!-- PDF iframe显示 -->
				<view class="pdfIframe" v-if="fileInfo.fileUrl">
					<!-- <web-view :src="fileInfo.fileUrl"></web-view> -->
					 <div id="pdfContainer"></div>
				</view>
			</view>
		</view>

		<!-- PDF倒计时悬浮条 -->
		<view class="pdfCountdownBar" v-if="isPdf && pdfCountdown > 0 && !isStudyCompleted">
			<view class="countdownLeft">
				<text class="countdownLabel">剩余学习时间</text>
				<text class="countdownTime">{{ formatTime(pdfCountdown) }}</text>
			</view>
		</view>

		<!-- 返回按钮 -->
		<!-- <view class="bottomBar">
			<button type="default" @click="goBack">返回课程详情</button>
		</view> -->
	</view>
</template>

<script>
	import chapterDetail from './chapterDetail.js'
	export default chapterDetail
</script>

<style lang="scss" scoped>
.chapterDetailPage {
	height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.chapterHeader {
		background: #fff;
		padding: 20rpx 30rpx;
		flex-shrink: 0;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 8rpx;
		}

		.desc {
			font-size: 24rpx;
			color: #666;
			line-height: 1.4;
		}
	}

	.contentArea {
		flex: 1;
		background: #fff;
		position: relative;
		overflow: hidden;

		.videoContainer {
			position: relative;
			height: 100%;
			
			video {
				width: 100%;
				height: 100%;
			}
			
			// 隐藏进度条，禁止拖动进度条
			::v-deep video::-webkit-media-controls-timeline {
				display: none !important;
			}
			::v-deep video::-webkit-media-slider {
				display: none !important;
			}
			
			.videoUrl {
				padding: 20rpx;
				font-size: 24rpx;
				color: #999;
				word-break: break-all;
			}
		}

		.pdfContainer {
			height: calc(100% - 100rpx);
			position: relative;

			.pdfIframe {
				width: 100%;
				height: 100%;
				overflow: auto;
				
				web-view {
					width: 100%;
					height: 100%;
				}
			}

			.pdfLoading {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f5f5f5;

				.loadingContent {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 20rpx;

					.loadingIcon {
						width: 60rpx;
						height: 60rpx;
						border: 4rpx solid #ddd;
						border-top-color: #e50011;
						border-radius: 50%;
						animation: spin 1s linear infinite;
					}

					text {
						color: #666;
						font-size: 28rpx;
					}
				}
			}
		}
	}

	// PDF倒计时悬浮条
	.pdfCountdownBar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		line-height: 100rpx;
		background: linear-gradient(135deg, #e50011 0%, #e13d48 100%);
		padding: 0 40rpx;
		box-shadow: 0 -4rpx 20rpx rgba(102, 126, 234, 0.3);
		z-index: 100;

		.countdownLeft {
			text-align: center;

			.countdownLabel {
				font-size: 40rpx;
				color: rgba(255, 255, 255, 0.85);
				margin-right: 30rpx;
			}

			.countdownTime {
				font-size: 40rpx;
				font-weight: bold;
				color: #fff;
			}
		}

		.countdownRight {
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			.studyTimeLabel {
				font-size: 22rpx;
				color: rgba(255, 255, 255, 0.85);
			}

			.studyTime {
				font-size: 32rpx;
				font-weight: bold;
				color: #fff;
			}
		}
	}

	.bottomBar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		border-top: 1rpx solid #eee;
		z-index: 101;

		button {
			background: #e50011;
			color: #fff;
		}
	}
}
</style>
