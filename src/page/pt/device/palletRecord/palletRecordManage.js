import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'palletRecordManage',
    data()
    {
        return {
            head: [
                {"name": "托盘台账编号", "code": "recordNum", "width": "250", "type": "text"},
                {"name": "月份", "code": "month", "width": "100", "type": "text"},
                {"name": "基地名称", "code": "workName", "width": "100", "type": "text"},
                {"name": "上月结存", "code": "lastMonthNums", "width": "100", "type": "text"},
                {"name": "本月新增", "code": "purchaseNums", "width": "100", "type": "text"},
                {"name": "本月报废", "code": "scrapNums", "width": "100", "type": "text"},
                {"name": "本月调拨", "code": "allocatNums", "width": "100", "type": "text"},
                {"name": "调拨基地", "code": "allocatWorkNames", "width": "200", "type": "text"},
                {"name": "本月结存", "code": "monthNums", "width": "100", "type": "text"},
                {"name": "回收数量", "code": "recoverNums", "width": "100", "type": "text"},
                {"name": "出库数量", "code": "outNums", "width": "100", "type": "text"},
                {"name": "回收率(%)", "code": "recoverRate", "width": "80", "type": "text"},
                {"name": "实盘结存", "code": "actualInventoryNums", "width": "100", "type": "text"},
                {"name": "差异数", "code": "diffNums", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
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
        async initData() {
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query = this.query) {
            this.query = query;
            if(this.common.isNotBlank(this.query.month) && this.query.month.length === 2){
                this.query.beginMonth = this.query.month[0];
                this.query.endMonth = this.query.month[1];
            }else{
                this.query.beginMonth = '';
                this.query.endMonth = '';
            }
            await this.$refs.table.load("palletRecordService", "queryPalletRecordPage", this.query);
        },
        initQuery()
        {
            return this.query = {
                recordNum: null,
                month: null,
                workIds: null,
            };
        },
        async dblclickItem(data)
        {
            this.$emit('openTab', {
                urlName: '托盘台账详情',
                urlId: 'palletRecordInfo-detail' + data.id,
                urlPathName: "/device",
                urlPath: "/pt/device/palletRecord/palletRecordInfo.vue",
                query: {
                    id: data.id,
                    type: enumData.OPEN_PAGE_TYPE.DETAIL,
                },
            });
        },
        async openAddPage()
        {
            this.$emit('openTab', {
                urlName: '新增托盘台账',
                urlId: 'palletRecordInfo-add' + new Date().getTime(),
                urlPathName: "/device",
                urlPath: "/pt/device/palletRecord/palletRecordInfo.vue",
                query: {
                    type: enumData.OPEN_PAGE_TYPE.ADD,
                },
            });
        },
        async openUpdatePage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '修改托盘台账',
                urlId: 'palletRecordInfo-update' + selectData[0].id,
                urlPathName: "/device",
                urlPath: "/pt/device/palletRecord/palletRecordInfo.vue",
                query: {
                    id: selectData[0].id,
                    type: enumData.OPEN_PAGE_TYPE.UPDATE,
                },
            });
        },
        async deletePalletRecord()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            
            let that = this;
            this.$confirm("确定需要删除？", "提示", {
                center: true,
            }).then(() =>{
                this.common.postUrl("palletRecordService", "deletePalletRecordById", {id: selectData[0].id}, function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('托盘管理台账列表托盘管理台账列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"托盘台账编号","model":"recordNum","type":"input","isshow":true},
                {"name":"月份","model":"month","type":"monthrange","isshow":true},
                {"name":"基地","model":"workIds","type":"select","options":this.workData,"multiple":true,"label":"workName","value":"workId","method":"doQuery","isshow":true},
            ]
        }
    },
}
