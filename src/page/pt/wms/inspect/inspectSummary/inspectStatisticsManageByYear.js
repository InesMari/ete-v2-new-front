import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'inspectStatisticsManageByYear',
    data()
    {
        return {
            head: [
                {"name": "巡检年份", "code": "inspectYear", "width": "100", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "设备编号", "code": "equipmentNum", "width": "120", "type": "text"},
                {"name": "巡检事项", "code": "inspectionItem", "width": "180", "type": "text"},
                {"name": "异常数", "code": "ngNums", "width": "100", "type": "diyColorTd"},
                {"name": "正常数", "code": "okNums", "width": "100", "type": "text"},
                {"name": "已检数", "code": "hasNums", "width": "100", "type": "text"},
                {"name": "待检数", "code": "todoNums", "width": "100", "type": "text"},
                {"name": "漏检数", "code": "unNums", "width": "100", "type": "text"},
            ],
            query: this.initQuery(),
            workData: [],
        }
    },
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods: {
        initQuery()
        {
            return this.query = {
                inspectYear: '',
                workId: '',
                equipmentNum: '',
            };
        },
        async initData()
        {
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            await this.$refs.table.load("wmsInspectionTaskService", "queryWmsInspectionTaskStatisticsYearPage", this.query);
        },
        async dblclickItem(item) {
            let data = {
                query: item,
                urlId: 'inspectionDetail2'+item.id,
                urlName: '巡检统计详情',
                urlPathName: '/inspectionDetail2',
                urlPath: "/pt/wms/inspect/inspectSummary/inspectionDetail2.vue",
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
                {"name":"巡检年份","model":"inspectYear","type":"year","isshow":true},
                {"name":"仓库名称","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"设备编号","model":"equipmentNum","type":"input","isshow":true},
            ]
        }
    },
}