<template>
    <div id="courseDetail" class="courseDetailPage">
        <div class="common-info">
            <div class="courseInfo">
                <div class="imgView">
                    <img :src="course.baseInfo.imgUrl" alt="">
                </div>
                <div class="inner">
                    <div class="title">{{ course.baseInfo.courseName }}</div>
                    <div class="info">
                        <span>课程时长：{{ course.baseInfo.durationStr }}</span>
                        <span>课程讲师：{{ course.baseInfo.lecturerNames }}</span>
                    </div>
                    <div class="info">
                        <span>学分：{{ course.baseInfo.credit }}</span>
                    </div>
                    <div class="study">
                        <el-button class="btn" type="primary" plain style="margin-right:10px;" @click="learn">{{ $route.query.lastStudyExtId?'继续学习':'开始学习' }}</el-button>
                        已有{{course.baseInfo.studyNums}}人学习
                        <el-button class="btn fr" type="success" plain v-if="course.baseInfo.studyState==2||course.baseInfo.studyState==3" @click="toExam(course.baseInfo.testId)">开始考试</el-button>
                    </div>
                </div>
            </div>
            <div class="filesInfo">
                <div class="innerTab clearfix">
                    <div class="innerItem" :class="showType==1?'active':''" @click="changeTab(1)">
                        <p class="inline"><i class="el-icon-collection-tag"></i> 课程简介</p>
                    </div>
                    <div class="innerItem" :class="showType==2?'active':''" @click="changeTab(2)">
                        <p class="inline"><i class="el-icon-reading"></i> 课程章节</p>
                    </div>
                    <div class="innerItem" :class="showType==3?'active':''" @click="changeTab(3)">
                        <p class="inline"><i class="el-icon-document"></i> 学习文件</p>
                    </div>
                </div>
                <div class="introduction" v-show="showType==1">
                    <div v-html="course.baseInfo.introduction"></div>
                </div>
                <div class="chapterInfo" v-show="showType==2">
                    <div class="content">
                        <div class="chapterList">
                            <div class="title">课程章节</div>
                            <div class="list">
                                <div class="item" v-for="(file,index) in course.chapters">
                                    <div class="innerTitle">
                                        第{{index+1}}章：{{ file.chapterTitle }}
                                    </div>
                                    <div class="innerItem" v-for="(item,fileIndex) in file.files" @click="chooseChapter(index,fileIndex)" :class="item.active?'active':''">
                                        <i class="el-icon-document" v-if="item.isVideo==0"></i>
                                        <i class="el-icon-caret-right" v-if="item.isVideo==1"></i>
                                        {{ item.fileName }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="addChapter">
                            <div class="noSelect" v-if="currentChapter<0">请选择章节</div>
                            <div v-if="currentChapter>-1">
                                <div class="title">{{ currentChapter>-1?`第${currentChapter+1}章节`:'章节详情' }}</div>
                                <div class="inner_con">
                                    <div class="label">{{ course.chapters[currentChapter].chapterTitle }}</div>
                                    <div class="text">{{ course.chapters[currentChapter].introduction }}</div>
                                    <div class="video" v-if="course.chapters[currentChapter].files[currentFileIndex].isVideo==1" >
                                        <video                                         
                                            ref="myVideo" 
                                            :src="course.chapters[currentChapter].files[currentFileIndex].fileUrl"
                                            controls
                                            controlslist="noplaybackrate nodownload nofastforward"
                                            @timeupdate="videoTimeUpdate"
                                            @ended="videoEnded"
                                            @error="videoError"
                                            @play="videoPlay"
                                            @pause="videoPause"
                                        ></video>
                                    </div>
                                    <div class="iframe" v-if="course.chapters[currentChapter].files[currentFileIndex].isVideo!=1">
                                        <a target="_blank" :href="course.chapters[currentChapter].files[currentFileIndex].fileUrl" class="btn">全屏观看</a>
                                        <iframe ref="pdfFrame" :src="course.chapters[currentChapter].files[currentFileIndex].fileUrl" frameborder="0"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- PDF倒计时悬浮条 -->
                        <div class="pdfCountdownBar" v-if="isPdf && pdfCountdown > 0 && !isStudyCompleted">
                            <div class="countdownLeft">
                                <span class="countdownLabel">剩余学习时间</span>
                                <span class="countdownTime">{{ formatTime(pdfCountdown) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="studyFiles" v-show="showType==3">
                    <table class="tableCommon" width="800" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th width="100">序号</th>
                                <th>文件名称</th>
                                <th width="200">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in course.baseInfo.files">
                                <td>{{ index+1 }}</td>
                                <td>
                                    {{ item.fileName }}
                                </td>
                                <td>
                                    <a :href="item.fileUrl" target="_blank" class="link">下载</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import courseDetail from './courseDetail.js'
	export default courseDetail
</script>
<style lang="scss" src="./courseDetail.scss" scoped></style>

