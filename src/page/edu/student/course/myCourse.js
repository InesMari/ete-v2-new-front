import fileViewer from '@/components/myFile/file-viewer.vue';
export default {
    name: 'myCourse',
    data() {
        return {
            activeName: this.$route.query.activeName || '0',
            param: {
                searchKey: '',
                stateStr: this.$route.query.stateStr || '',
            },
            courseData: {
                allCourse: {
                    count: 0,
                },
                tabList: [],
            },
            list: [],
        }
    },
    mounted() {
        this.initData();
        this.doQuery();
    },
    components: {
        fileViewer
    },
    methods: {
        async initData()
        {
            this.courseData =  await this.common.postUrl("eduUserService", "loadStudentHomeData", {});
            this.$forceUpdate();
        },
        async doQuery(){
            let {items} = await this.common.postUrl("eduCourseService", "queryCoursePageForStudent", this.param);
            // 转换时长字段
			if (items && items.length > 0) {
				items.forEach(item => {
					item.durationStr = this.formatDuration(item.duration);
					item.studyDurationStr = this.formatDuration(item.studyDuration);
				});
			}
            this.list = items;
            this.$forceUpdate();
        },
        // 格式化时长（秒转为xx分xx秒，少于一分钟显示xx秒）
		formatDuration(seconds) {
			if (!seconds || seconds <= 0) return '0秒';
			seconds = Math.floor(seconds);
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			if (minutes === 0) {
				return secs + '秒';
			}
			return minutes + '分' + secs + '秒';
		},
        async handleClick(data)
		{
            if (data.index == 0)
            {
                //全部课程
                this.param.stateStr = "";
            }
            else
            {
                this.param.stateStr = this.courseData.tabList[data.index-1].stateStr;
            }
            await this.doQuery();
		},
        // 去考试
        toLearn(item,state){
            item.state = state;
            let {lastStudyExtId,chapterId,studyDuration,courseId} = item;
            this.$emit("openTab",{
                urlName: "查看课程",
                urlId: "courseDetail"+item.courseId,
                urlPath: "/edu/student/course/courseDetail.vue",
                urlPathName: "/courseDetail",
                query:{lastStudyExtId,state,chapterId,studyDuration,courseId}
            })
        },
        // 去考试
        toExam(testId){
            if (this.common.isBlank(testId))
            {
                this.$message.error("课程还没有发布试卷，无法考试！");
                return false;
            }
            this.$emit("openTab",{
                urlName: "考试",
                urlId: "examination"+testId,
                urlPath: "/edu/student/exam/examination.vue",
                urlPathName: "/examination",
                query:{testId}
            })
        },        
        seeBigImg(item){
            this.bigImageUrl = this.common.getBigImgPath(item.creditImgUrl);
            this.$refs.viewer.show();
        },
    }
}
