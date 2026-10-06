import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'answerSheetManager',
    data()
    {
        return {
            head: [
                {"name": "答卷编号", "code": "answerNum", "width": "150", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "150", "type": "text"},
                {"name": "问卷报表名称", "code": "questionnaireName", "width": "200", "type": "text"},
                {"name": "答卷总分", "code": "totalScore", "width": "200", "type": "text"},
                {"name": "客户评分", "code": "score", "width": "200", "type": "text"},
                {"name": "客户名称", "code": "customerName", "width": "200", "type": "text"},
                {"name": "问卷投放时间", "code": "putDate", "width": "200", "type": "text"},
                {"name": "答题开始", "code": "startDate", "width": "200", "type": "text"},
                {"name": "答题结束", "code": "endDate", "width": "200", "type": "text"},
                {"name": "耗时", "code": "betweenTime", "width": "200", "type": "text"},
            ],
            loadParam: {},
            allStoreHouseData: [],
            questionnaireList: [],
        }
    },
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async initData(){   
            //所有仓库
            this.allStoreHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.questionnaireList = await this.common.postUrl("questionnaireService", "queryQuestionnaireList");
            if (this.$route.query.loadNewest == 1 && this.questionnaireList.length > 0)
                this.loadParam.questionnaireId = this.questionnaireList[this.questionnaireList.length - 1].id;
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            let data = await this.$refs.table.load("answerService", "queryAnswerPage", this.loadParam);
        },
        toDetail(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '答卷详情',
                urlId: 'answerDetail'+id,
                urlPathName: "/answerDetail",
                urlPath: "/pt/dataReport/questionnaire/answerDetail.vue",
                query:{id}
            });
        },
        // 查看详情
        dblclickItem(item){
            let id = item.id;
            this.$emit('openTab', {
                urlName: '答卷详情',
                urlId: 'answerDetail'+id,
                urlPathName: "/answerDetail",
                urlPath: "/pt/dataReport/questionnaire/answerDetail.vue",
                query:{id}
            });
        },

        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"问卷编号","model":"answerNum","type":"input","isshow":true},
                {"name":"仓库名称","model":"workId","type":"select","options":this.allStoreHouseData,"label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"问卷报表名称","model":"questionnaireId","type":"select","options":this.questionnaireList,"label":"questionnaireName","value":"id","method":"doQuery","isshow":true},
                {"name":"客户名称","model":"customerName","type":"input","isshow":true},
            ]
        }
    },
}
