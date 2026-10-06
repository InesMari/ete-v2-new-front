import tableCommon from "@/components/table/tableCommon.vue"
export default {
    name: 'examRecord',
    data() {
        return {
            userName:this.common.userInfo().userName,
            head:[
                {"name": "试卷课程名称", "code": "courseName", "width": "200", "type": "text"},
                {"name": "考试时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "考试用时", "code": "testDurationStr", "width": "150", "type": "text"},
                // {"name": "考试次数", "code": "count", "width": "100", "type": "text"},
                {"name": "得分", "code": "totalScore", "width": "100", "type": "text"},
                {"name": "通过测试", "code": "isPassName", "width": "100", "type": "text"},
                {"name": "操作", "code": "", "width": "120", "type": "diy"},
            ],
            info:{
                todayScoreSum: 0,
                weekScoreSum: 0,
                monthScoreSum: 0,
                scoreSum: 0,
                ranking: null,
            }
        }
    },
    mounted() {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
    },
    methods: {
        async initData()
        {
            this.info =  await this.common.postUrl("eduCourseService", "loadStudentCreditData", {});
        },
        async doQuery(){
            await this.$refs.table.load("eduTestService", "queryUserTestRecordPage", {});
        },
        async againExam(item)
        {
            this.$emit("openTab",{
                urlName: "重新考试",
                urlId: "examination" + item.testId,
                urlPath: "/edu/student/exam/examination.vue",
                urlPathName: "/examination",
                query:{relId:item.relId,testId:item.testId}
            })
        },
        // 查看详情
        toDetail(item){
            this.$emit("openTab",{
                urlName: "答题详情",
                urlId: "examination" + item.testId,
                urlPath: "/edu/admin/student/examination.vue",
                urlPathName: "/examination",
                query:{relId:item.relId,testId:item.testId, id: item.relId}
            })
        },
    }
}
