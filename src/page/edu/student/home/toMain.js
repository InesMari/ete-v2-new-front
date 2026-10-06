export default {
    name: 'toMainStudent',
    data() {
        return {
            currentHour: new Date().getHours(),
            userName:this.common.userInfo().userName,
            lastLoginDateTime: this.common.userInfo().lastLoginDateTime,
            courseData:{
                allCourse:{
                    count: 0,
                    stateStr: "",
                    activeName: "0",
                },
                tabList:[],
                totalCredit: 0,
            },
            lastLearningCourses: [],//最近在学习的2门课程
            lastLearningCourse:{
                courseName: null,
                durationStr: null,
                chapterNums: null,
                chapterTitle: null,
            }
        }
    },
    mounted() {
        this.initData();
    },
    components: {
    },
    methods: {
        async initData()
        {
            this.courseData =  await this.common.postUrl("eduUserService", "loadStudentHomeData", {});
            let array =  await this.common.postUrl("eduCourseService", "loadLastLearningCourseData", {});
            if (array.length <= 2)
            {
                this.lastLearningCourses = array;
                if (array.length > 0)
                {
                    this.lastLearningCourse = this.common.copyObj(array[0]);
                }
            }
            else
            {
                for (let i = 0; i < 2; i++)
                {
                    this.lastLearningCourses.push(array[i]);
                }
                this.lastLearningCourse = this.common.copyObj(array[0]);
            }
            this.$forceUpdate();
        },
        go(data, urlId, path, urlName)
        {
            if (this.common.isBlank(path))
            {
                return;
            }
            if (this.common.isBlank(urlId))
            {
                urlId = new Date().getTime();
            }
            this.$emit("openTab",{
                urlId: urlId,
                query: data,
                urlName: urlName,
                urlPath: path,
                urlPathName: "/student/course/courseDetail.vue"});
        },
    }
}
