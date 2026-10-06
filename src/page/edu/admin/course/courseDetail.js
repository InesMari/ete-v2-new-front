export default {
    name: 'courseDetail',
    data() {
        return {
            course:{
                baseInfo:{
                    files:[{}],
                },
                chapters:[
                    {
                        files:[]
                    }
                ]
            },
            showType:1,
            currentChapter:-1
        }
    },

    mounted() {
		this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        
    },
    methods: {
        async doQuery() {
            this.course = await this.common.postUrl("eduCourseService", "getEduCourseInfo", {id: this.$route.query.id});
        },
        // 切换Tab
        changeTab(type){
            this.showType = type;
        },
        // 选择课程章节
        chooseChapter(index,fileIndex){
            this.currentChapter = index;
            this.currentFileIndex = fileIndex;
            this.course.chapters[index].files.forEach(el => {
                el.active = false;
            })
            this.course.chapters[index].files[fileIndex].active = true;
            this.$forceUpdate();
        },
    },
}
