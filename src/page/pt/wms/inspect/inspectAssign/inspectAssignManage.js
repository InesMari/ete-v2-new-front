import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'inspectAssignManage',
    data()
    {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "巡检事项", "code": "inspectionItem", "width": "200", "type": "text"},
                {"name": "巡检频率", "code": "inspectionTimesStr", "width": "500", "type": "text"},
                {"name": "上次巡检时间", "code": "lastInspectionDate", "width": "100", "type": "text"},
                {"name": "执行人", "code": "executorStr", "width": "150", "type": "diy"},
                {"name": "设备数", "code": "dtlCount", "width": "100", "type": "text"},
                {"name": "累计巡检天数", "code": "totalInspectionDays", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            workData: [],
            standardData: [],
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
                standardId: '',
                workStoreId: '',
                executor: '',
            };
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("wmsInspectionAppointService", "queryWmsInspectionAppointPage", this.query);
        },
        async initData()
        {
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.standardData = await this.common.postUrl("wmsInspectionStandardService", "queryWmsInspectionStandardList", {});
        },
        async add()
        {
            await this.open({
                query: {type: 1},//0 查看 1 新增 2 修改
                urlId: 'addInspectAssign' + new Date().getTime(),
                urlName: '新增指定巡检',
                urlPathName: '/addInspectAssign',
                urlPath: "/pt/wms/inspect/inspectAssign/addInspectAssign.vue",
            });
        },
        async update()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            await this.open({
                query: {type: 2, id: selectData[0].id},//0 查看 1 新增 2 修改
                urlId: 'updateInspectAssign' + selectData[0].id,
                urlName: '修改指定巡检',
                urlPathName: '/updateInspectAssign',
                urlPath: "/pt/wms/inspect/inspectAssign/addInspectAssign.vue",
            });
        },
        print(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要打印二维码的数据！");
                return false;
            }
            if(selectData[0].scanQrcode!=1){
                this.$message.error("请选择一条设定了设备扫码的数据！");
                return false;
            }
            this.open({
                query: {id: selectData[0].id},//0 查看 1 新增 2 修改
                urlId: 'inspectionPrintCode' + selectData[0].id,
                urlName: '打印二维码',
                urlPathName: '/inspectionPrintCode',
                urlPath: "/pt/wms/inspect/inspectAssign/inspectionPrintCode.vue",
            });
        },
        async dblclickItem(item)
        {
            await this.open({
                query: {id: item.id},
                urlId: 'inspectAssignDetail' + item.id,
                urlName: '查看指定巡检详情',
                urlPathName: '/inspectAssignDetail',
                urlPath: "/pt/wms/inspect/inspectAssign/inspectAssignDetail.vue",
            });
        },
        async open(data)
        {
            this.$emit("openTab", {
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath
            });
        },
        deleteQa()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>
            {
                this.common.postUrl("wmsInspectionAppointService", "deleteWmsInspectionAppointById", {id: selectData[0].id}, function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() => {});
        },
    },
    computed: {
        formData(){
            return [
                {"name":"巡检事项","model":"standardId","type":"select","options":this.standardData,"label":"inspectionItem","value":"id","method":"doQuery","isshow":true},
                {"name":"仓库名称","model":"workStoreId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"执行人","model":"executor","type":"input","isshow":true},
            ]
        }
    },
}
