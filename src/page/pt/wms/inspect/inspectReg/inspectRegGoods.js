import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'inspectRegGoods',
    data()
    {
        return {
            head: [
                {"name": "仓库名称", "code": "workName", "width": "100", "type": "text"},
                {"name": "客户名称", "code": "customerName", "width": "200", "type": "text"},
                {"name": "料号", "code": "materialNum", "width": "100", "type": "text"},
                {"name": "批次", "code": "batchNum", "width": "100", "type": "text"},
                {"name": "数量", "code": "count", "width": "120", "type": "text"},
                {"name": "计划处理时间", "code": "planDealDate", "width": "120", "type": "text"},
                {"name": "异常品存放区域图片", "code": "imgUrlList", "width": "120", "type": "diy"},
                {"name": "登记人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "登记时间", "code": "createDate", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
            workData: [],
            srcList: [],
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
        fileViewer,
    },
    methods: {
        initQuery()
        {
            return this.query = {
                workStoreId: '',
            };
        },
        async initData()
        {
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            await this.$refs.table.load("wmsInspectionExceptionRecordService", "queryWmsInspectionExceptionRecordPage", this.query);
        },
        async add()
        {
            await this.open({
                query:{type:1},
                urlId: 'addInspectRegGoods'+new Date().getTime(),
                urlName: '新增仓库异常品登记',
                urlPathName: '/addInspectRegGoods',
                urlPath: "/pt/wms/inspect/inspectReg/addInspectRegGoods.vue",
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
                query: {type: 2,id:selectData[0].id},
                urlId: 'updateInspectRegGoods'+selectData[0].id,
                urlName: '修改仓库异常品登记',
                urlPathName: '/updateInspectRegGoods',
                urlPath: "/pt/wms/inspect/inspectReg/addInspectRegGoods.vue",
            });
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id,type: 0},
                urlId: 'inspectRegGoodsDetail'+item.id,
                urlName: '查看仓库异常品登记详情',
                urlPathName: '/inspectRegGoodsDetail',
                urlPath: "/pt/wms/inspect/inspectReg/addInspectRegGoods.vue",
            }
            await this.open(data);
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data.query,//type 1 新增 2 修改 0详情
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async toDetail(param, code, index)
        {
            let url = param.imgUrlList[index];
            if(!url){
                this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(url);
            this.$refs.viewer.show();
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
                this.common.postUrl("wmsInspectionExceptionRecordService", "deleteWmsInspectionExceptionRecordById", {id: selectData[0].id}, function ()
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
                {"name":"仓库名称","model":"workStoreId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
            ]
        }
    },
}
