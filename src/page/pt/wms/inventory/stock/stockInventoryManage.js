import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'stockInventoryManage',
    data()
    {
        return {
            head: [
                {"name": "盘点单号", "code": "inventoryNum", "width": "150", "type": "text"},
                {"name": "任务日期", "code": "taskDate", "width": "150", "type": "text"},
                {"name": "盘点状态", "code": "stsName", "width": "150", "type": "text"},
                {"name": "异常状态", "code": "inventoryStateName", "width": "150", "type": "text"},
                {"name": "盘点人", "code": "inventoryUserName", "width": "130", "type": "text"},
                {"name": "盘点时间", "code": "inventoryDate", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "inventoryRemark", "width": "200", "type": "text"}
            ],
            query: this.initQuery(),
            showSelWork: false,
            verifyStateData: [],
            stsData: [],
            inventoryStateData: [
                {
                    codeValue:0,
                    codeName:'正常',
                },
                {
                    codeValue:1,
                    codeName:'异常',
                }
            ],
            storeHouseData:[],
            showWork:this.common.userInfo().regionId==1,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initSelWork();
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        selectWork,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork()
        {
            this.userInfo = this.common.userInfo();
            if (!this.userInfo.workId)
                this.showSelWork = true;
            else
            {
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork()
        {
            this.showSelWork = false;
            this.$forceUpdate();
            if (!this.firstIn)
            {
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        doQuery(query = this.query) {
            this.query = query;
            this.$refs.table.load("wmsStockInventoryService", "queryWmsStockInventoryPage", this.query);
        },
        async initData()
        {
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.stsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVENTORY_STS"});
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        initQuery()
        {
            return this.query = {
                inventoryNum: '',
                sts:'',
                verifyState: '',
                inventoryRemark: ''
            };
        },
        async addStockInventory()
        {
            this.$emit("openTab",{
                urlId: "addStockInventory" + new Date().getTime(),
                query: {},
                urlName: '新增库存盘点',
                urlPathName: "/addStockInventory",
                urlPath: '/pt/wms/inventory/stock/addStockInventory.vue'});
        },
        updateStockInventory()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1)
            {
                this.$message.error("请选择一条需要修改的库存盘点数据！");
                return;
            }
            if (this.common.isNotBlank(selectData[0].taskDate))
            {
                this.$message.error("自动生成任务不能修改！");
                return false;
            }
            if (selectData[0].verifyState == 1)
            {
                this.$message.error("审核通过不能修改！");
                return false;
            }
            this.$emit("openTab",{
                urlId: "addStockInventory" + selectData[0].inventoryId,
                query: {inventoryId: selectData[0].inventoryId},
                urlName: '修改库存盘点',
                urlPathName: "/addStockInventory",
                urlPath: '/pt/wms/inventory/stock/addStockInventory.vue'});
        },
        deleteStockInventory()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1)
            {
                this.$message.error("请选择一条需要删除的库存盘点数据！");
                return;
            }
            if (this.common.isNotBlank(selectData[0].taskDate))
            {
                this.$message.error("自动生成任务不能删除！");
                return false;
            }
            if (selectData[0].verifyState == 1)
            {
                this.$message.error("审核通过不能删除！");
                return false;
            }
            this.$confirm("是否确认删除库存盘点？", "提示").then(async () =>
            {
                await this.common.postUrl("wmsStockInventoryService", "deleteWmsStockInventory", selectData[0],
                    null, null, '', true);
                this.$message.success("删除库存盘点成功！");
                await this.doQuery();
            }).catch(() =>
            {
                //取消
            });
        },
        inventoryWmsStock()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1)
            {
                this.$message.error("请选择一条需要盘点的库存盘点数据！");
                return;
            }
            if (selectData[0].sts != 0)
            {
                this.$message.error("待盘点才能盘点！");
                return false;
            }
            this.$emit("openTab",{
                urlId: "addStockInventory" + selectData[0].inventoryId,
                query: {inventoryId: selectData[0].inventoryId},
                urlName: '库存盘点',
                urlPathName: "/addStockInventory",
                urlPath: '/pt/wms/inventory/stock/addStockInventory.vue'});
        },
        async dblclickItem(data)
        {
            this.$emit("openTab",{
                urlId: "stockInventoryDetail" + data.inventoryId,
                query: {inventoryId: data.inventoryId,
                    logId: data.inventoryId,
                    logType: enumData.LOG_TYPE.WMS_STOCK_INVENTORY,
                },
                urlName: '库存盘点详情',
                urlPathName: "/stockInventoryDetail",
                urlPath: '/pt/wms/inventory/stock/stockInventoryDetailMain.vue'});
        },
        async verifyStockInventory()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条需要审核的库存盘点数据！");
                return false;
            }
            if (selectData[0].sts != 1)
            {
                this.$message.error("已盘点的才可以审核！");
                return false;
            }
            if (selectData[0].verifyState != 0)
            {
                this.$message.error("未审核的才可以审核！");
                return false;
            }
            let param = selectData[0];
            this.$prompt("您正在操作审核操作，是否继续?", "提示",{
                confirmButtonText: '不通过',
                cancelButtonText: '通过',
                type: 'warning',
                center: true,
                showInput: false,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
            }).then(async ({value}) =>{
                param.verifyState = 2;
                await this.common.postUrl("wmsStockInventoryService", "verifyWmsStockInventory", param);
                await this.doQuery();
                this.$message.success("审核不通过成功！");
            }).catch(async action =>{
                if ( action === 'cancel')
                {
                    param.verifyState = 1;
                    await this.common.postUrl("wmsStockInventoryService", "verifyWmsStockInventory", param);
                    await this.doQuery();
                    this.$message.success("审核通过成功！")
                }
            });

        },
        toUninventoryDetail()
        {
            let date = this.common.formatDate.getDate();
            let item = {
                urlName: '未盘点明细',
                urlId: 'uninventoryStockStorageManage',
                urlPathName: "/uninventoryStockStorageManage",
                urlPath: "/pt/dataReport/kanban/uninventoryStockStorageManage.vue",
                query: {workStoreId: this.userInfo.workId, backupMonth: date.substring(0, 7)},
            }
            this.$emit('openTab', item);
        }
    },
    computed: {
        formData() {
            return [
                {"name":"盘点单号","model":"inventoryNum","type":"input","placeholder":"盘点单号","isshow":true},
                {"name":"盘点状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"异常状态","model":"inventoryState","type":"select","options":this.inventoryStateData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"请选择","method":"doQuery","isshow":true},
                {"name":"备注","model":"inventoryRemark","type":"input","placeholder":"备注","isshow":true},
                {"name":"仓库","model":"workId","type":"select","options":this.storeHouseData,"label":"workName","value":"workId","placeholder":"请选择","method":"doQuery","isshow":true,if:this.showWork},
            ]
        }
    },
}
