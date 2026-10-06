<template>
	<view class="courseDetailPage">
		<view class="common-info">
			<view class="courseInfo">
                <view class="courseTitle">
                    <view class="imgView">
                        <image mode="scaleToFill" :src="course.baseInfo.imgUrl" alt=""></image>
                    </view>
                    <view class="inner">
                        <view class="title">{{ course.baseInfo.courseName }}</view>
                        <view class="info">
                            <text>课程时长：{{ course.baseInfo.durationStr }}</text>
                            <text>课程讲师：{{ course.baseInfo.lecturerNames }}</text>
                        </view>
                        <view class="info">
                            <text>学分：{{ course.baseInfo.credit }}</text>
                        </view>
                    </view>
                </view>
                <!-- <view class="study">
                    <button class="btn" type="primary" plain size="mini" style="margin-right:10px;" @click="learn">{{ routeOptions.lastStudyExtId?'继续学习':'开始学习' }}</button>
                    <button class="btn" type="success" plain size="mini" v-if="course.baseInfo.studyState==2||course.baseInfo.studyState==3" @click="toExam(course.baseInfo.testId)">开始考试</button>
                </view> -->
			</view>
			<view class="filesInfo">
				<view class="innerTab clearfix">
					<view class="innerItem" :class="showType==1?'active':''" @click="changeTab(1)">
						<text class="inline">课程简介</text>
					</view>
					<view class="innerItem" :class="showType==2?'active':''" @click="changeTab(2)">
						<text class="inline">课程章节</text>
					</view>
					<view class="innerItem" :class="showType==3?'active':''" @click="changeTab(3)">
						<text class="inline">学习文件</text>
					</view>
				</view>
				<view class="introduction" v-show="showType==1">
					<rich-text :nodes="course.baseInfo.introduction"></rich-text>
				</view>
				<view class="chapterInfo" v-show="showType==2">
					<view class="content">
						<view class="chapterList">
							<!-- <view class="title">课程章节</view> -->
							<view class="list">
								<view class="item" v-for="(file,index) in course.chapters" :key="index">
									<view class="innerTitle">
										第{{index+1}}章：{{ file.chapterTitle }}
									</view>
								<view class="innerItem" v-for="(item,fileIndex) in file.files" :key="fileIndex" @click="chooseChapter(file, item)" :class="item.active?'active':''">
									<view class="itemContent">
										<uni-icons type="bars" v-if="item.isVideo==0"></uni-icons>
										<uni-icons type="videocam" v-if="item.isVideo==1"></uni-icons>
										{{ item.fileName }}
									</view>
									<uni-icons type="checkmarkempty" class="completedIcon" v-if="item.studyDuration >= item.duration"></uni-icons>
								</view>
								</view>
							</view>
						</view>
						<!-- <view class="addChapter">
							<view class="noSelect" v-if="currentChapter<0">请选择章节</view>
							<view v-if="currentChapter>-1">
								<view class="title">{{ currentChapter>-1?`第${currentChapter+1}章节`:'章节详情' }}</view>
								<view class="inner_con">
									<view class="label">{{ course.chapters[currentChapter].chapterTitle }}</view>
									<view class="text">{{ course.chapters[currentChapter].introduction }}</view>
									<view class="video" v-if="course.chapters[currentChapter].files[currentFileIndex].isVideo==1">
										<video
											id="myVideo"
											:src="course.chapters[currentChapter].files[currentFileIndex].fileUrl"
											controls
											controlslist="noplaybackrate nodownload"
											enable-danmu
											enable-play-gesture
											show-center-play-btn
											show-play-btn
											show-fullscreen-btn
											show-loading
											@timeupdate="videoTimeUpdate"
											@ended="videoEnded"
										></video>
									</view>
									<view class="iframe" v-if="course.chapters[currentChapter].files[currentFileIndex].isVideo!=1">
										<button class="btn" type="default" size="mini" @click="openPDF(course.chapters[currentChapter].files[currentFileIndex].fileUrl)">全屏观看</button>
									</view>
								</view>
							</view>
						</view> -->
					</view>
				</view>
			<view class="studyFiles" v-show="showType==3">
				<view class="emptyTip" v-if="!course.baseInfo.files || course.baseInfo.files.length === 0">
					暂无学习文件
				</view>
				<template v-else>
					<view class="tableHeader">
						<view class="th" style="width:100rpx;">序号</view>
						<view class="th" style="flex:1;">文件名称</view>
						<view class="th" style="width:200rpx;">操作</view>
					</view>
					<view class="tableBody">
						<view class="tr" v-for="(item,index) in course.baseInfo.files" :key="index">
							<view class="td" style="width:100rpx;">{{ index+1 }}</view>
							<view class="td" style="flex:1;">
								{{ item.fileName }}
							</view>
							<view class="td" style="width:200rpx;">
								<text class="link" @click="visitFile(item.fileUrl)" style="margin-right: 10rpx;">预览</text>
								<text class="link" @click="downloadFile(item.fileUrl)">下载</text>
							</view>
						</view>
					</view>
				</template>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import courseDetail from './courseDetail.js'
	export default courseDetail
</script>
<style lang="scss" scoped>
.courseDetailPage {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
	
	:deep .common-info {
		.courseInfo {
			background: #fff;
			padding: 30rpx;
			margin-bottom: 20rpx;
            .courseTitle{
			    display: flex;                
            }
			.imgView {
				width: 200rpx;
				height: 200rpx;
				border-radius: 8rpx;
				overflow: hidden;
				margin-right: 20rpx;
				flex-shrink: 0;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.inner {
				flex: 1;
				display: flex;
				flex-direction: column;
                justify-content: center;
				
				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 16rpx;
				}
				
				.info {
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					color: #666;
					margin-bottom: 10rpx;
					line-height: 36rpx;
				}
			}
				
            .study {
                margin-top: 20rpx;
                text-align: center;

                .btn {
                    margin:0 10rpx;
                }
            }
		}
		
		.filesInfo {
			background: #fff;
			
			.innerTab {
				display: flex;
				border-bottom: 1rpx solid #eee;
				
				.innerItem {
					flex: 1;
					text-align: center;
					padding: 24rpx 0;
					font-size: 28rpx;
					color: #666;
					position: relative;
					
					.inline {
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
				&.active {
					color: #e50011;
					
					&::after {
							content: '';
							position: absolute;
							bottom: 0;
							left: 50%;
							transform: translateX(-50%);
							width: 60rpx;
							height: 4rpx;
							background: #e50011;
							border-radius: 2rpx;
						}
					}
				}
			}
			
			.introduction {
				padding: 30rpx;
				font-size: 28rpx;
				line-height: 1.8;
				color: #333;
			}
			
			.chapterInfo {
				.content {
					padding: 20rpx;	
					
					.chapterList {
						margin-right: 20rpx;
						
						.title {
							font-size: 28rpx;
							font-weight: bold;
							padding: 20rpx 0;
						}
						
						.list {
							.item {
								margin-bottom: 20rpx;
								
								.innerTitle {
									font-size: 26rpx;
									color: #333;
									padding: 16rpx;
									background: #f5f5f5;
									margin-bottom: 10rpx;
									font-weight: bold;
								}
								
							.innerItem {
								font-size: 24rpx;
								padding: 16rpx;
								color: #666;
								display: flex;
								align-items: center;
								justify-content: space-between;
								.itemContent {
									display: flex;
									align-items: center;
									flex: 1;
								}
								.uni-icons{
									margin-right:10rpx;
								}
								.completedIcon {
									color: #52c41a !important;
									font-weight: bold;
								}
						&.active {
							color: #e50011;
							background: #fff0f0;
						}
							}
							}
						}
					}
					

				}
			}
			
			.studyFiles {
			padding: 20rpx;
			
			.emptyTip {
				text-align: center;
				padding: 60rpx 0;
				color: #999;
				font-size: 28rpx;
			}
				
				.tableHeader {
					display: flex;
					background: #f5f5f5;
					padding: 20rpx 0;
					font-size: 26rpx;
					font-weight: bold;
					
					.th {
						text-align: center;
					}
				}
				
				.tableBody {
					.tr {
						display: flex;
						padding: 24rpx 0;
						border-bottom: 1rpx solid #eee;
						
						.td {
							text-align: center;
							font-size: 24rpx;
						}
					}
				}
				
				.link {
					color: #e50011;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
