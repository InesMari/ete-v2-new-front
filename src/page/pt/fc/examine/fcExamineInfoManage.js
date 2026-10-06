import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'fcExamineInfoManage',
    data()
    {
        return {
            head: [
                {"name": "考核名称", "code": "name", "width": "150", "type": "text"},
                {"name": "考核年度", "code": "yearDisplay", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
            ],
            loadParam: {
                year:'',
            },
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
            await this.$refs.table.load("fcExamineTF", "queryFcExamineInfoPage", this.loadParam);
        },
        // 查看详情
        dblclickItem(item){
            let id = item.id;
            this.$emit('openTab', {
                urlName: '财务考核详情',
                urlId: 'detail'+id,
                urlPathName: "/fcExamineDetail",
                urlPath: "/pt/fc/examine/fcExamineDetail.vue",
                query:{id,type:3}
            });
        },
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增财务考核',
                urlId: 'addFcExamineDetail',
                urlPathName: "/fcExamineDetail",
                urlPath: "/pt/fc/examine/fcExamineDetail.vue",
                query:{type:1}
            });
        },
        toUpdate(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '修改财务考核',
                urlId: 'updateFcExamineDetail'+id,
                urlPathName: "/fcExamineDetail",
                urlPath: "/pt/fc/examine/fcExamineDetail.vue",
                query:{id,type:2}
            });
        },
        downloadExcel(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要导出的数据！");
                return false;
            }
            let fileName = selectData[0].name;
            let param = {};
            param.id = selectData[0].id;
            param.year = selectData[0].year;
            param.selfCreateUrl = 'fcExamineTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'fcExamineInfoManageTable');
            this.closeDownload();
        },
        toFcExamineItemManage(){
            this.$emit('openTab', {
                urlName: '指标维护',
                urlId: 'fcExamineItemInfoManage',
                urlPathName: "/fcExamineItemInfoManage",
                urlPath: "/pt/fc/examine/item/fcExamineItemInfoManage.vue",
                query:{}
            });
        },

    },
    computed:{
        formData(){
            return [
                {"name":"考核年度","model":"year","type":"year","isshow":true,"method":"doQuery"},
            ]
        }
    },
}
