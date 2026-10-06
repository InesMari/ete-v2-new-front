<template>
	<view class="minePage">
		<!-- 用户信息头部 -->
		<view class="userHeader">
			<view class="avatar">
				<image v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" mode="aspectFill"></image>
				<uni-icons v-else type="person" size="60" color="#fff"></uni-icons>
			</view>
			<view class="userInfo">
				<view class="name">{{ userInfo.name || userInfo.nickName || '未设置姓名' }}</view>
				<view class="phone">{{ formatPhone(userInfo.phone) }}</view>
			</view>
		</view>

		<!-- 学习进度统计 -->
		<view class="studyStats">
			<view class="title">学习进度</view>
			<view class="statsList">
				<view class="statsItem" v-for="(item, index) in tabList" :key="index" @click="toCourseList(item)">
					<view class="count">{{ item.count }}</view>
					<view class="name">{{ item.tabName }}</view>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="menuList">
			<view class="menuItem" @click="toExamRecord">
				<uni-icons type="paper" size="24"></uni-icons>
				<text class="menuText">考试记录</text>
				<uni-icons type="right" size="18" color="#999"></uni-icons>
			</view>
			<view class="menuItem" @click="toLogout">
				<uni-icons type="logout" size="24"></uni-icons>
				<text class="menuText">退出登录</text>
				<uni-icons type="right" size="18" color="#999"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import mine from './mine.js'
	export default mine
</script>

<style lang="scss" scoped>
.minePage {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;

	.userHeader {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #e50011 0%, #e50011 100%);
		padding: 60rpx 40rpx;
		margin-bottom: 20rpx;

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			background-color: rgba(255, 255, 255, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			margin-right: 30rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.userInfo {
			.name {
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
				margin-bottom: 12rpx;
			}

			.phone {
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.8);
			}
		}
	}

	.studyStats {
		background: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}

		.statsList {
			display: flex;
			flex-wrap: wrap;

			.statsItem {
				width: 25%;
				text-align: center;
				padding: 20rpx 0;
				border-right: 1rpx solid #eee;
				box-sizing: border-box;

				&:last-child {
					border-right: none;
				}

				.count {
					font-size: 40rpx;
					font-weight: bold;
					color: #e50011;
					margin-bottom: 10rpx;
				}

				.name {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}

	.menuList {
		background: #fff;

		.menuItem {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f5f5f5;

			&:active {
				background-color: #f5f5f5;
			}

			.menuText {
				flex: 1;
				font-size: 28rpx;
				color: #333;
				margin-left: 20rpx;
			}
		}
	}
}
</style>
