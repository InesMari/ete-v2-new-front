import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'inspectSummaryManage',
    data()
    {
        return {
            head: [
                {"name": "巡检日期", "code": "inspectionDate", "width": "100", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "查看", "code": "", "width": "250", "type": "diy"},
                {"name": "待巡检", "code": "todoTasks", "width": "100", "type": "text"},
                {"name": "已巡检", "code": "hasTasks", "width": "100", "type": "text"},
                {"name": "漏巡检", "code": "unTasks", "width": "100", "type": "text"},
            ],
            query: this.initQuery(),
            taskStateData:[],
            workData: [],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods: {
        initQuery()
        {
            return this.query = {
                inspectionDate: '',
                workStoreId: '',
                inspectionState: '',
            };
        },
        async initData()
        {
            this.taskStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_INSPECTION_SUMMARY_STATE"});
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.inspectionDate) && this.query.inspectionDate.length === 2){
                this.query.inspectionBeginDate = this.query.inspectionDate[0];
                this.query.inspectionEndDate = this.query.inspectionDate[1];
            }else{
                this.query.inspectionBeginDate = '';
                this.query.inspectionEndDate = '';
            }
            this.query.type = 1;
            await this.$refs.table.load("wmsInspectionSummaryService", "queryWmsInspectionSummaryPage", this.query);
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'inspectSummaryDetail'+item.id,
                urlName: '查看巡检汇总详情',
                urlPathName: '/inspectSummaryDetail',
                urlPath: "/pt/wms/inspect/inspectSummary/inspectSummaryDetail.vue",
            }
            await this.open(data);
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
    },
    computed:{
      formData(){  
            return [
                {"name":"巡检日期","model":"inspectionDate","type":"daterange","isshow":true},
                {"name":"仓库名称","model":"workStoreId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                // {"name":"状态","model":"inspectionState","type":"select","options":this.taskStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}