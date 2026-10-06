import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'questionnaireTemplateManager',
    data()
    {
        return {
            head: [
                {"name": "编号", "code": "questionnaireNum", "width": "150", "type": "text"},
                {"name": "问卷模板名称", "code": "questionnaireName", "width": "150", "type": "text"},
                {"name": "题目数量", "code": "topicCount", "width": "150", "type": "text"},
                {"name": "答卷总分", "code": "totalScore", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "200", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"},
            ],
            loadParam: {
                questionnaireNum:'',
                questionnaireName:'',
            },
        }
    },
    async mounted()
    {
        await this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("questionnaireTemplateService", "queryQuestionnaireTemplatePage", this.loadParam);
        },
        dblclickItem(item){
            let id = item.id;
            this.$emit('openTab', {
                urlName: '模板查看',
                urlId: 'seeQuestionnaireTemplate'+id,
                urlPathName: "/seeQuestionnaireTemplate",
                urlPath: "/pt/dataReport/questionnaire/template/addQuestionnaireTemplate.vue",
                query:{id,temp:true},
            });
        },
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增问卷模板',
                urlId: 'addQuestionnaireTemplate' + new Date().getTime(),
                urlPathName: "/addQuestionnaireTemplate",
                urlPath: "/pt/dataReport/questionnaire/template/addQuestionnaireTemplate.vue"
            });
        },
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
                urlName: '修改问卷模板',
                urlId: 'editQuestionnaireTemplate'+id,
                urlPathName: "/editQuestionnaireTemplate",
                urlPath: "/pt/dataReport/questionnaire/template/addQuestionnaireTemplate.vue",
                query:{id},
            });
        },
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            let id = selectData[0].id;
            this.$confirm('是否确认删除该问卷模板？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                 await that.common.postUrl("questionnaireTemplateService", "deleteQuestionnaireTemplateById", {id});
                that.$message.success("删除成功。")
                await that.doQuery();
            });
        },
    },
    computed:{
        formData(){
            return [
                {"name":"问卷模板编号","model":"questionnaireNum","type":"input","isshow":true},
                {"name":"问卷模板名称","model":"questionnaireName","type":"input","isshow":true},
            ]
        }
    },
}
