import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'scrapManage',
    data()
    {
        return {
            head: [
                {"name": "物流基地", "code": "workName", "width": "250", "type": "text"},
                {"name": "总面积", "code": "storehouseArea", "width": "150", "type": "text"},
                {"name": "平库面积", "code": "flatWarehouseArea", "width": "150", "type": "text"},
                {"name": "立库面积", "code": "verticalWarehouseArea", "width": "120", "type": "text"},
                {"name": "每月总租金", "code": "monthRent", "width": "120", "type": "text"},
                {"name": "立库库位数", "code": "verticalStorage", "width": "120", "type": "text"},
                {"name": "每托面积", "code": "palletArea", "width": "120", "type": "text"},
                {"name": "总库位面积", "code": "storageWarehouseArea", "width": "120", "type": "text"},
                {"name": "面积利用率", "code": "areaUsePercent", "width": "120", "type": "text"},
                {"name": "货架价格(元/月)", "code": "shelfPrice", "width": "120", "type": "text"},
                {"name": "设备费用", "code": "equipmentCost", "width": "120", "type": "text"},
                {"name": "人员费用", "code": "personCost", "width": "120", "type": "text"},
                {"name": "平库成本元/㎡", "code": "flatWarehouseCost", "width": "120", "type": "text"},
                {"name": "立库成本元/㎡", "code": "verticalWarehouseCost", "width": "120", "type": "text"},
                {"name": "水费(元/月/㎡)", "code": "waterCost", "width": "120", "type": "text"},
                {"name": "保险(元/月/㎡)", "code": "insuranceCost", "width": "120", "type": "text"},
                {"name": "板位利用率(%)", "code": "plateUseRate", "width": "120", "type": "text"},
                {"name": "管理成本(%)", "code": "manageCost", "width": "120", "type": "text"},
                {"name": "平库成本合计", "code": "flatWarehouseAmount", "width": "120", "type": "text"},
                {"name": "立库成本合计", "code": "verticalWarehouseAmount", "width": "120", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            workData: [],
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'SALES_METHOD,SCRAP_TYPE'});
            this.salesMethodData = data.SALES_METHOD;
            this.scrapTypeData = data.SCRAP_TYPE;
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            let {items} = await this.$refs.table.load("standardCostWarehousingService", "queryStandardCostWarehousingPage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        addInfo()
        {
            this.$emit('openTab', {
                urlName: "估算仓储成本",
                urlId: 'storehouseCostInfo' + new Date().getDate(),
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/storehouseCostInfo.vue",
                query: {},
            });
        },
        /**
         * 修改
         */
        updateInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据~");
                return false;
            }
            let item = selectData[0];
            this.$emit('openTab', {
                urlName: "修改仓储成本",
                urlId: 'storehouseCostInfo' + item.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/storehouseCostInfo.vue",
                query: {
                    id: item.id,
                    type: 2,
                },
            });
        },
        async deleteInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据~");
                return false;
            }
            let item = selectData[0];
            let that = this;
            this.$confirm("你将删除当前数据，是否确认删除", "删除提示" ,{
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                center: true
            }).then(async () => {
                await that.common.postUrl("standardCostWarehousingService", "deleteStandardCostWarehousing", {id: item.id});
                await that.doQuery();
                that.$message.success("删除成功!");
            }).catch(() =>{})
        },
        detailIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看详情的数据~");
                return false;
            }
            this.dblclickItem(selectData[0]);
        },
        dblclickItem(data)
        {
            this.$emit('openTab', {
                urlName: "仓储成本详情",
                urlId: 'storehouseCostInfo' + data.id,
                urlPathName: "/standardCost",
                urlPath: "/pt/fc/standardCost/storehouseCostInfo.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('仓储成本列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"物流基地","model":"workId","type":"select","options":this.workData, "label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
            ]
        }
    },
}
