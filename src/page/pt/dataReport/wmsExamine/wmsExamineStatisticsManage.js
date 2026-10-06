import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'wmsExamineStatisticsManage',
    data()
    {
        return {
            head: [
                {"name": "核查编号", "code": "examineNum", "width": "100", "type": "text"},
                {"name": "核查名称", "code": "examineName", "width": "180", "type": "text"},
                {"name": "正常数", "code": "sts1", "width": "100", "type": "diy"},
                {"name": "异常数", "code": "sts2", "width": "100", "type": "diy"},
                {"name": "未操作", "code": "sts0", "width": "100", "type": "diy"},
            ],
            loadParam: {
                examineNum:'',
                examineName:'',
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
        clearFn(){
            this.loadParam={
                examineNum:'',
                examineName:'',
            };
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("wmsExamineTF", "queryWmsExamineStatisticsPage", this.loadParam);
        },
        doItemCfg(){
            let item = {
                urlName: '核查项目维护',
                urlId: 'wmsExamineItemCfgManage',
                urlPathName: "/wmsExamineItemCfgManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineItemCfgManage.vue",
                query: {},
            }
            this.$emit('openTab', item);
        },
        viewDetail(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看的数据！");
                return false;
            }
            let item = {
                urlName: '核查统计详情',
                urlId: 'wmsExamineItemStatisticsManage'+selectData[0].id,
                urlPathName: "/wmsExamineItemStatisticsManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineItemStatisticsManage.vue",
                query: {id:selectData[0].id},
            }
            this.$emit('openTab', item);
        },
        viewExamineDetail(){
            let item = {
                urlName: '核查明细',
                urlId: 'wmsExamineDTLStatisticsManage',
                urlPathName: "/wmsExamineDTLStatisticsManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineDTLStatisticsManage.vue",
                query: {},
            }
            this.$emit('openTab', item);
        },
        goto(value,code){
            let sts = 0;
            if('sts0'==code){
                sts = 0;
            }else if('sts1'==code){
                sts=1;
            }else{
                sts=2;
            }
            let item = {
                urlName: '核查明细',
                urlId: 'wmsExamineDTLStatisticsManage-examineId'+value.id,
                urlPathName: "/wmsExamineDTLStatisticsManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineDTLStatisticsManage.vue",
                query: {examineId:value.id,sts},
            }
            this.$emit('openTab', item);
        }
    },
    computed:{
        formData(){
            return [
                {"name":"核查编号","placeholder":"核查编号","model":"examineNum","type":"input","isshow":true},
                {"name":"核查名称","placeholder":"核查名称","model":"examineName","type":"input","isshow":true},
            ]
        }
    },
}
