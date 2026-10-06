<template>
	<view class="homePage">
		<!-- 课程列表页面 -->
		<view v-show="navActive == 1" class="coursePage">
			<v-tabs v-model="currentTabs" field="name" :tabs="tabs" height="90rpx" line-height="5rpx" @change="changeTab"></v-tabs>

			<view class="courseList">
				<view class="item" v-for="item in courseList">
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
								<view class="label">课程长约：</view>
								<view class="text">{{ item.durationStr }}</view>
							</view>
							<view class="innnerItem">
								<view class="label">学习时长：</view>
								<view class="text">{{ item.studyDurationStr }}</view>
							</view>
						</view>
					</view>
					<div class="btnView">
						<button class="btn" size="mini" type="default" plain @click.stop="toLearn(item)">{{item.lastStudyExtId?'继续学习':'立即学习'}}</button>
						<button class="btn" size="mini" type="default" plain v-if="item.studyState==2||item.studyState==3" @click.stop="toExam(item)">开始考试</button>
					</div>
				</view>
			</view>
		</view>

		<!-- 我的页面 -->
		<view v-show="navActive == 2" class="minePage">
			<!-- 用户信息头部 -->
			<view class="userHeader">
				<view class="avatar">
					<image v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" mode="aspectFill"></image>
					<uni-icons v-else type="person" size="60" color="#fff"></uni-icons>
				</view>
				<view class="userInfo">
					<view class="name">{{ userInfo.userName}}</view>
					<view class="phone">{{ formatPhone(userInfo.billId) }}</view>
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

		<!-- nav -->
		<view class="navList">
			<view class="item" :class="navActive == 1?'active':''" @click="changeNav(1)">
				<uni-icons type="list"></uni-icons>
				<view class="name">
					课程
				</view>
			</view>
			<view class="item" :class="navActive == 2?'active':''" @click="changeNav(2)">
				<uni-icons type="person"></uni-icons>
				<view class="name">
					我的
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import home from './home.js'
	export default home
</script>

<style lang="scss" scoped>
	:deep .homePage {
		height: 100%;
		background-color: #f5f5f5;
		.v-tabs__container-item.active{
			color: #e50011!important;
		}
		.v-tabs__container-line{
			background-color: #e50011!important;
		}
		.coursePage {
			height: calc(100% - 120rpx);
		}

		.demandList {
			padding-bottom: 130rpx;
			height: 100%;
			box-sizing: border-box;

			.scorll {
				height: calc(100% - 200rpx);
			}
		}
		.v-tabs__container-item{
			flex:1;
			justify-content: center;
		}

		.courseList{
			padding:40rpx;
			height: calc(100% - 100rpx);
    		overflow: auto;
			.item{
				background-color: #ff3e3e;
				border-radius: 20rpx;
				padding:20rpx;
				margin-bottom:20rpx;
				.content{
					display: flex;
					.imgView{
						width:200rpx;
						height: 200rpx;
						border-radius: 6rpx;
						overflow: hidden;
						margin-right: 20rpx;
						image{
							width:200rpx;
							height: 200rpx;
						}
					}
					.contentView{
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.innnerItem{							
							display: flex;
							justify-content: center;
							line-height: 30rpx;
							margin: 10rpx 0;
							.label{
								color: #fff;
							}
							.text{
								color: #fff;
								flex:1;
							}
						}
					}
				}
				.btnView{
					text-align: center;
					margin-top: 20rpx;
					.btn{
						border-color: #fff;
						color: #fff;
						margin:0 20rpx;
						box-shadow: 0 0 10rpx rgbg(255,255,255,0.3);
					}
				}
			}
		}

	}
	.contain {
		overflow: hidden;
		padding: 24rpx 30rpx;
		margin: 30rpx;
		background: #fff;
	}

	// mine 页面样式
	.minePage {
		min-height: calc(100% - 120rpx);
		padding-bottom: 20rpx;

		.userHeader {
			display: flex;
			align-items: center;
			background: linear-gradient(135deg, #e50011 0%, #e96a72 100%);
			padding: 60rpx 40rpx;

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
			margin: 20rpx;
			border-radius: 16rpx;

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
					width: 33.33%;
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
			margin: 20rpx;
			border-radius: 16rpx;

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

	.navList {
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		border-top: 1rpx solid $uni-border-color;

		:deep .item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.uni-icons {
				font-size: 44rpx !important;
			}

			.name {
				margin-top: 10rpx;
				font-size: 26rpx;
			}

			&.active {
				.uni-icons {
					color: $uni-color-primary !important;
				}

				.name {
					color: $uni-color-primary;
				}
			}
		}

		:deep .addDemand {
			width: 80rpx;
			position: relative;
			margin: 0 4%;

			.uni-icons {
				position: absolute;
				font-size: 80rpx !important;
				top: -40rpx;
				left: 0;
			}
		}
	}

</style>