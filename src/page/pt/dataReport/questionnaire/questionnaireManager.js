import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'questionnaireManager',
    data()
    {
        return {
            head: [
                {"name": "编号", "code": "questionnaireNum", "width": "150", "type": "text"},
                {"name": "问卷报表名称", "code": "questionnaireName", "width": "200", "type": "text"},
                {"name": "题目数量", "code": "topicCount", "width": "150", "type": "text"},
                {"name": "答卷总分", "code": "totalScore", "width": "200", "type": "text"},
                {"name": "投放状态", "code": "putStateName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "200", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"},
            ],
            loadParam: {
                questionnaireNum:'',
                questionnaireName:'',
            },
            showCodeView:false, //二维码弹窗
            codeUrl:"", //二维码地址
            questionnaireDialog:false,
            effectTime:''
        }
    },
    async mounted()
    {
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("questionnaireService", "queryQuestionnairePage", this.loadParam);
        },
        // 查看详情
        dblclickItem(item){
            let id = item.id;
            this.$emit('openTab', {
                urlName: '问卷详情',
                urlId: 'questionnaireTemp'+id,
                urlPathName: "/questionnaireTemp",
                urlPath: "/pt/dataReport/questionnaire/addQuestionnaire.vue",
                query:{id,temp:true},
            });
        },
        // 新增
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增问卷',
                urlId: 'addQuestionnaire'+new Date().getTime(),
                urlPathName: "/addQuestionnaire",
                urlPath: "/pt/dataReport/questionnaire/addQuestionnaire.vue"
            });
        },
        // 修改
        toUpdate(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            if (selectData[0].putState == 1)
            {
                this.$message.error("问卷模板已经投放，不能再修改！");
                return false;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '修改问卷',
                urlId: 'editQuestionnaire'+id,
                urlPathName: "/editQuestionnaire",
                urlPath: "/pt/dataReport/questionnaire/addQuestionnaire.vue",
                query:{id},
            });
        },
        // 详情
        toVisitTemp(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看的数据！");
                return false;
            }
            this.dblclickItem(selectData[0]);
        },
        // 删除
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            if (selectData[0].putState == 1)
            {
                this.$message.error("问卷模板已经投放，不能删除！");
                return false;
            }
            let that = this;
            let id = selectData[0].id;            
            this.$confirm('是否确认删除该问卷？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await that.common.postUrl("questionnaireService", "deleteQuestionnaireById", {id});
                that.$message.success("删除成功。")
                that.doQuery();
            });
        },
        // 复制
        toCopy(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '复制问卷',
                urlId: 'copyFcExamineDetail'+new Date().getTime(),
                urlPathName: "/copyQuestionnaire",
                urlPath: "/pt/dataReport/questionnaire/addQuestionnaire.vue",
                query:{id,copy:true},
            });
        },
        // 数据报表
        toQuestionnaireReportMain(){
            this.$emit('openTab', {
                urlName: '数据报表',
                urlId: 'reportMain',
                urlPathName: "/reportMain",
                urlPath: "/pt/dataReport/questionnaire/reportMain.vue"
            });
        },
        toQuestionnaireTemplate()
        {
            this.$emit('openTab', {
                urlName: '问卷模板管理',
                urlId: 'questionnaireTemplateManager',
                urlPathName: "/questionnaireTemplateManager",
                urlPath: "/pt/dataReport/questionnaire/template/questionnaireTemplateManager.vue",
                query:{},
            });
        },
        // 投放问卷
        async toLaunch(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            this.selectId = selectData[0].id;
            this.questionnaireDialog = true;
        },
        async toEffect(){
            let info = await this.common.postUrl("questionnaireService", "putQuestionnaire", {id:this.selectId}, null, null, null, true);
            this.codeUrl = info.imgPath;
            this.showCodeView = true;
            this.questionnaireDialog = false;
            this.$message.success("投放成功。")
        },
    },
    computed:{
        formData(){
            return [
                {"name":"问卷编号","model":"questionnaireNum","type":"input","isshow":true},
                {"name":"问卷报表名称","model":"questionnaireName","type":"input","isshow":true},
            ]
        }
    },
}
