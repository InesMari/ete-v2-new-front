<template>
	<view class="examRecordPage">

		<!-- 记录列表 -->
		<scroll-view class="recordList" scroll-y @scrolltolower="onLoadMore">
			<view class="recordItem" v-for="(item, index) in records" :key="index" @click="goToDetail(item)">
				<view class="recordHeader">
					<view class="courseName">{{ item.courseName }}</view>
				</view>
				<view class="recordInfo">
                    <view class="infoItem">
                        <text class="label">得分</text>
                        <text class="value score">{{ item.totalScore }}分</text>
                    </view>
					<view class="infoItem">
						<text class="label">通过测试</text>
						<text class="value" :class="item.isPass!=1?'score':''">{{ item.isPassName }}</text>
					</view>
					<view class="infoItem">
						<text class="label">考试用时</text>
						<text class="value">{{ item.testDurationStr }}</text>
					</view>
					<view class="infoItem">
						<text class="label">考试次数</text>
						<text class="value">第{{ item.count }}次</text>
					</view>
					<view class="infoItem" style="width: 100%;">
						<text class="label">考试时间</text>
						<text class="value">{{ item.createDate }}分</text>
					</view>
				</view>
				<view class="recordArrow">
					<uni-icons type="right" size="18" color="#999"></uni-icons>
				</view>
			</view>

			<!-- 加载状态 -->
			<view class="loadingMore" v-if="loading">
				<text>加载中...</text>
			</view>
			<view class="noMore" v-if="finished && records.length > 0">
				<text>没有更多了</text>
			</view>
			<view class="empty" v-if="!loading && records.length === 0">
				<uni-icons type="calendar" size="60" color="#ccc"></uni-icons>
				<text class="emptyText">暂无考试记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import examRecord from './examRecord.js'
	export default examRecord
</script>

<style lang="scss" scoped>
.examRecordPage {
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
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

/* 记录列表 */
.recordList {
	flex: 1;
	padding: 20rpx;
    box-sizing: border-box;
}

.recordItem {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	position: relative;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

	.recordHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;

		.courseName {
			font-size: 30rpx;
			font-weight: bold;
			color: #333;
			flex: 1;
			margin-right: 20rpx;
		}

		.passStatus {
			font-size: 24rpx;
			padding: 8rpx 16rpx;
			border-radius: 20rpx;
			// background: #f5f5f5;
			color: #999;

			&.pass {
				background: #f6ffed;
				color: #52c41a;
			}
		}
	}

	.recordInfo {
		display: flex;
		flex-wrap: wrap;

		.infoItem {
			width: 50%;
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;

			.label {
				font-size: 24rpx;
				color: #999;
				margin-right: 12rpx;
			}

			.value {
				font-size: 26rpx;
				color: #666;

				&.score {
					font-weight: bold;
					color: #e50011;
				}
			}
		}
	}

	.recordArrow {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
	}
}

/* 加载状态 */
.loadingMore {
	text-align: center;
	padding: 30rpx;
	color: #999;
	font-size: 24rpx;
}

.noMore {
	text-align: center;
	padding: 30rpx;
	color: #ccc;
	font-size: 24rpx;
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
</style>
