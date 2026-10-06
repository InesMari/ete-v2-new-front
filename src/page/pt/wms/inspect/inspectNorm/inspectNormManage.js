import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'inspectNormManage',
    data()
    {
        return {
            head: [
                {"name": "巡检事项编号", "code": "inspectionNum", "width": "100", "type": "text"},
                {"name": "巡检事项", "code": "inspectionItem", "width": "200", "type": "text"},
                {"name": "检查结果填写方式", "code": "typeName", "width": "100", "type": "text"},
                {"name": "设备类别", "code": "equipmentTypeName", "width": "100", "type": "text"},
                {"name": "设备扫码", "code": "scanQrcodeName", "width": "100", "type": "text"},
                {"name": "备注", "code": "remark", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
            typeData:[],
            whetherData:[],
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
                inspectionNum: '',
                inspectionItem: '',
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'QUESTION_TYPE,WHETHER'});
            this.whetherData = data.WHETHER;
            this.typeData = data.QUESTION_TYPE;
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            await this.$refs.table.load("wmsInspectionStandardService", "queryWmsInspectionStandardPage", this.query);
        },
        async add()
        {
            await this.open({
                query:{type:1},//type 1 新增 2 修改
                urlId: 'addInspectNorm'+new Date().getTime(),
                urlName: '新增巡检标准',
                urlPathName: '/addInspectNorm',
                urlPath: "/pt/wms/inspect/inspectNorm/addInspectNorm.vue",
            });
        },
        async update() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            await this.open({
                query: {type: 2,id:selectData[0].id},//type 1 新增 2 修改
                urlId: 'updateInspectNorm'+selectData[0].id,
                urlName: '修改巡检标准',
                urlPathName: '/updateInspectNorm',
                urlPath: "/pt/wms/inspect/inspectNorm/addInspectNorm.vue",
            });
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'inspectNormDetail'+item.id,
                urlName: '查看巡检标准详情',
                urlPathName: '/inspectNormDetail',
                urlPath: "/pt/wms/inspect/inspectNorm/inspectNormDetail.vue",
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
        deleteStandard(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("wmsInspectionStandardService", "deleteWmsInspectionStandardById", {id: selectData[0].id}, function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
    },
    computed:{
      formData(){  
            return [
                {"name":"巡检事项编号","model":"inspectionNum","type":"input","isshow":true},
                {"name":"巡检事项","model":"inspectionItem","type":"input","isshow":true},
                {"name":"设备扫码","model":"scanQrcode","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
