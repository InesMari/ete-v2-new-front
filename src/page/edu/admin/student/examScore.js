import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'examScore',
    data() {
        return {
            head:[
                {"name": "试卷名称", "code": "testName", "width": "200", "type": "text"},
                {"name": "简答题考评", "code": "", "width": "100", "type": "diy"},
                {"name": "考试学生", "code": "userName", "width": "150", "type": "text"},
                // {"name": "考试次数", "code": "todayTestTimes", "width": "100", "type": "text"},
                {"name": "选择判断满分", "code": "standardPart1Score", "width": "100", "type": "text"},
                {"name": "选择判断得分", "code": "part1Score", "width": "100", "type": "text"},
                {"name": "简答题满分", "code": "standardPart2Score", "width": "120", "type": "text"},
                {"name": "简答题得分", "code": "part2Score", "width": "120", "type": "text"},
                {"name": "总成绩", "code": "totalScore", "width": "120", "type": "text"},
                {"name": "评卷时间", "code": "markDate", "width": "120", "type": "text"},
                {"name": "评卷人", "code": "markUserName", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
        }
    },
    mounted() {
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        initQuery(){
            return this.query = {
                userName:'',
                testName:'',
            }
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        async doQuery(query = this.query) {
            this.query = query;//赋值
            await this.$refs.table.load("eduUserService", "queryEduUserTestInfoPage", this.query);
        },
        async againExam(item)
        {
            this.$emit("openTab",{
                urlName: "试卷简答题评分",
                urlId: "shortAnswerExamination" + item.testId,
                urlPath: "/edu/admin/student/shortAnswerExamination.vue",
                urlPathName: "/shortAnswerExamination",
                query:{relId:item.id,testId:item.testId, showType: 4}
            })
        },
        // 查看详情
        toDetail(item){
            this.$emit("openTab",{
                urlName: "答题详情",
                urlId: "examination" + item.testId,
                urlPath: "/edu/admin/student/examination.vue",
                urlPathName: "/examination",
                query:{relId:item.id,testId:item.testId, id: item.id}
            })
        },
    },
    computed:{
        formData(){
            return [
                {"name":"学员名称","model":"userName","type":"input","isshow":true},
                {"name":"试卷名称","model":"testName","type":"input","isshow":true},
            ]
        }
    },
}
