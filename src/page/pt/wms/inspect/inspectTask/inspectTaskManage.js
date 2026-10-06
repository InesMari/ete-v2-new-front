import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'inspectTaskManage',
    data()
    {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "任务状态", "code": "taskStateName", "width": "120", "type": "text"},
                {"name": "巡检任务编号", "code": "taskNum", "width": "150", "type": "text"},
                {"name": "巡检事项", "code": "inspectionItem", "width": "200", "type": "text"},
                {"name": "巡检设备", "code": "equipment", "width": "150", "type": "text"},
                {"name": "设备编号", "code": "equipmentNum", "width": "150", "type": "text"},
                {"name": "是否有异常", "code": "haveExceptionName", "width": "150", "type": "text"},
                {"name": "规定巡检时间", "code": "stipulateDate", "width": "250", "type": "text"},
                {"name": "执行人", "code": "executorStr", "width": "150", "type": "diy"},
                {"name": "实际巡检时间", "code": "actualDate", "width": "150", "type": "text"},
                {"name": "实际巡检人", "code": "actualUserName", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            workData: [],
            whetherData:[],
            taskStateData:[],
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
        async doQuery(query=this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.stipulateDate) && this.query.stipulateDate.length === 2){
                this.query.stipulateBeginDate = this.query.stipulateDate[0];
                this.query.stipulateEndDate = this.query.stipulateDate[1];
            }else{
                this.query.stipulateBeginDate = '';
                this.query.stipulateEndDate = '';
            }
            await this.$refs.table.load("wmsInspectionTaskService", "queryWmsInspectionTaskPage", this.query);
        },
        async initData()
        {
            this.taskStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_INSPECTION_TASK_STATE"});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        initQuery()
        {
            return this.query = {
                workStoreId: null,
                taskNum: null,
                inspectionItem: null,
                equipment: null,
                executorStr: null,
                stipulateDate: null,
                haveException: null,
                taskState: null,
            };
        },
        dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'inspectTaskDetail'+item.id,
                urlName: '巡检任务详情',
                urlPathName: '/inspectTaskDetail',
                urlPath: "/pt/wms/inspect/inspectTask/inspectTaskDetail.vue",
            }
            this.open(data);
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        done(){
            let selectData = this.$refs.table.getSelectItem();
            let id = 0;
            if(selectData.length==1){
                if(selectData[0].taskState!=0){
                    this.$message.error("任务状态不是待巡检");
                    return;
                }
                let executorArray = selectData[0].executor.split(",");
                if(!executorArray.includes(this.common.userInfo().userId+'')){
                    this.$message.error("你不是该任务执行人，不能进行任务巡检");
                    return;
                }
                id = selectData[0].id;
            }else if(selectData.length>1){
                this.$message.error("请选择一条待巡检的数据");
                return;
            }
            this.open({
                query: {id},
                urlId: 'doneInspectTask' + id,
                urlName: '任务巡检',
                urlPathName: '/doneInspectTask',
                urlPath: "/pt/wms/inspect/inspectTask/doneInspectTask.vue",
            });
        },
        downloadExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
      formData(){  
            return [
                {"name":"仓库名称","model":"workStoreId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"巡检任务编号","model":"taskNum","type":"input","isshow":true},
                {"name":"巡检事项","model":"inspectionItem","type":"input","isshow":true},
                {"name":"巡检设备","model":"equipment","type":"input","isshow":true},
                {"name":"执行人","model":"executorStr","type":"input","isshow":true},
                {"name":"规定巡检时间","model":"stipulateDate","type":"daterange","isshow":true},
                {"name":"是否有异常","model":"haveException","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"任务状态","model":"taskState","type":"select","options":this.taskStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
