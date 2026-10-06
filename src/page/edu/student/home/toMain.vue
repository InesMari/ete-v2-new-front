<template>
    <div id="toMainStudent" class="toMainStudentPage">
        <div class="topHead">
            <div class="title">{{ currentHour < 12 ? '上午' : currentHour < 18 ? '下午' : '晚上'}}好！{{ userName }}</div>
            <div class="info">
                <span>最近登录时间:{{ lastLoginDateTime }}</span>
                <span v-show="lastLearningCourse.courseName">上次学习：{{ lastLearningCourse.courseName }}
                </span>
                <el-button @click="go(lastLearningCourse, 5001009, '/edu/student/course/courseDetail.vue', '课程：' + lastLearningCourse.courseName)"
                           class="btn" type="primary" size="mini" plain v-show="lastLearningCourse.courseName">继续学习
                </el-button>
            </div>
        </div>
        <div class="studyInfo">
            <div class="item" v-for="item in courseData.tabList">
                <div class="title">{{ item.tabName}}课程</div>
                <div class="num">{{ item.count }}</div>
                <div><a href="javascript:void(0);" class="link" @click="go(item, 5001002,'/edu/student/course/myCourse.vue', '我的课程')">查看课程</a></div>
            </div>
            <div class="item">
                <div class="title">学习总积分</div>
                <div class="num">{{ courseData.totalCredit }}</div>
                <div><a href="javascript:void(0);" class="link" @click="go({}, 5001003, '/edu/student/exam/examRecord.vue', '学习记录')">查看积分</a></div>
            </div>
        </div>
        <!--        最近在学习课程-->
        <div style="padding-left:20px;font-size:18px;font-weight:bold;line-height:40px;margin-top: 20px;">
            最近在学习课程
        </div>
        <div class="courseList">
            <div class="item" v-for="item in lastLearningCourses">
                <div class="content">
                    <div class="coverImg">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="dec">
                        <div class="title">{{ item.courseName }}</div>
                        <div class="text">课程长约：{{ item.durationStr }} |
                            共{{ item.chapterNums }}个小节
                        </div>
                        <div class="text">上次学习：{{ item.chapterTitle }}</div>
                    </div>
                    <el-button v-show="item.courseName" @click="go(item, 5001009, '/edu/student/course/courseDetail.vue', '课程：' + item.courseName)"
                               class="btn" type="primary" plain>继续学习
                    </el-button>
                </div>
            </div>
        </div>
        <div style="text-align: center;line-height: 80px;">
            <a href="javascript:void(0);" class="link" @click="go({}, 5001002,'/edu/student/course/myCourse.vue', '我的课程')">更多课程>>></a>
        </div>
    </div>
</template>

<script>
import toMain from "./toMain.js";

export default toMain;
</script>
<style lang="scss" src="./toMain.scss" scoped></style>
