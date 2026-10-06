<template>
	<view class="courseListPage">
		<view class="courseList">
			<view class="item" v-for="item in courseList" :key="item.courseId" @click="toLearn(item)">
				<view class="content">
					<view class="imgView">
						<image mode="scaleToFill" :src="item.imgUrl"></image>
					</view>
					<view class="contentView">
						<view class="innnerItem">
							<view class="label">课程名称：</view>
							<view class="text">{{ item.courseName }}</view>
						</view>
						<view class="innnerItem">
							<view class="label">课程时长：</view>
							<view class="text">{{ item.durationStr }}</view>
						</view>
						<view class="innnerItem">
							<view class="label">学习时长：</view>
							<view class="text">{{ item.studyDurationStr || '0' }}</view>
						</view>
					</view>
				</view>
				<view class="btnView" @click.stop>
					<button class="btn" size="mini" type="primary" plain @click="toLearn(item)">
						{{ item.lastStudyExtId ? '继续学习' : '立即学习' }}
					</button>
					<button class="btn" size="mini" type="success" plain v-if="item.studyState == 2 || item.studyState == 3" @click="toExam(item)">
						开始考试
					</button>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty" v-if="courseList.length === 0 && !loading">
				<uni-icons type="folder-open" size="80" color="#ccc"></uni-icons>
				<text class="emptyText">暂无课程</text>
			</view>

			<!-- 加载状态 -->
			<view class="loading" v-if="loading">
				<uni-load-more status="loading" :content-text="{ contentdown: '上拉加载更多' }"></uni-load-more>
			</view>

			<!-- 没有更多 -->
			<view class="noMore" v-if="courseList.length > 0 && !hasMore">
				<text>没有更多了</text>
			</view>
		</view>
	</view>
</template>

<script>
	import courseList from './courseList.js'
	export default courseList
</script>

<style lang="scss" scoped>
.courseListPage {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;

	.courseList {
		padding: 30rpx;

		.item {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

			.content {
				display: flex;

				.imgView {
					width: 180rpx;
					height: 180rpx;
					border-radius: 12rpx;
					overflow: hidden;
					margin-right: 24rpx;
					flex-shrink: 0;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.contentView {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.innnerItem {
						display: flex;
						line-height: 40rpx;
						margin: 6rpx 0;

						.label {
							font-size: 26rpx;
							color: #666;
							flex-shrink: 0;
						}

						.text {
							font-size: 26rpx;
							color: #333;
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}

			.btnView {
				text-align: center;
				margin-top: 20rpx;
				padding-top: 20rpx;
				border-top: 1rpx solid #f5f5f5;

				.btn {
					margin-left: 20rpx;
					border-color: #e50011;
					color: #e50011;
				}
			}
		}

		.empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;

			.emptyText {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #999;
			}
		}

		.loading {
			padding: 30rpx;
			text-align: center;
		}

		.noMore {
			text-align: center;
			padding: 30rpx;
			font-size: 24rpx;
			color: #999;
		}
	}
}
</style>
