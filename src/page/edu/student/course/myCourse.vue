<template>
    <div id="myCourse" class="myCoursePage">
        <el-tabs ref="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="0" :label="'全部课程（' + courseData.allCourse.count + '）'"></el-tab-pane>
            <el-tab-pane v-for="item in courseData.tabList" :name="item.activeName" :label="item.tabName+'（' + item.count + '）'"></el-tab-pane>
        </el-tabs>
        <div class="courseList">
            <div class="clearfix">
                <el-input class="fr" style="width:200px;margin-right:20px;" placeholder="搜索课程"
                          suffix-icon="el-icon-search" v-model="param.searchKey" @input="doQuery"></el-input>
            </div>
            <div class="item" v-for="item in list" @click="toLearn(item,1)">
                <div class="content">
                    <div class="coverImg">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="dec">
                        <div class="title">{{ item.courseName }}</div>
                        <div class="text">课程长约：{{ item.durationStr }} | 共{{ item.chapterNums }}个小节</div>
                        <div class="text" v-if="item.chapterTitle">上次学习：{{ item.chapterTitle }}</div>
                    </div>
                    <div class="btnView">
                        <el-button class="btn" type="primary" plain @click.stop="toLearn(item)">{{item.lastStudyExtId?'继续学习':'立即学习'}}</el-button>
                        <el-button class="btn" type="success" plain v-if="item.studyState==2||item.studyState==3" @click.stop="toExam(item.testId)">开始考试</el-button>
                    </div>
                    <el-button class="seeImgBtn" v-if="item.creditImgUrl" size="mini" type="success" plain @click.stop="seeBigImg(item)">查看证书</el-button>
                </div>
            </div>
        </div>
        <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
    </div>
</template>

<script>
import myCourse from "./myCourse.js";

export default myCourse;
</script>
<style lang="scss" src="./myCourse.scss" scoped></style>
  