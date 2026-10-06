import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'deviceInventoryManage',
    data()
    {
        return {
            head: [
                {"name": "器具名称", "code": "deviceName", "width": "200", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "110", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "150", "type": "text"},
                {"name": "所属人", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "使用客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "数量", "code": "nums", "width": "110", "type": "text"},
            ],
            showDialog: false,
            showSelWork: false,
            query: this.initQuery(),
            info: this.initInfo(),
        }
    },
    mounted()
    {
        this.doQuery();
        this.initSelWork();
        this.initData();
    },
    components: {
        selectWork,
        myFileModel,
        tableCommon,
    },
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
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("stockDeviceService", "queryDeviceStockPageForInventory", query);
        },
        async initData()
        {
        },
        initQuery()
        {
            return this.query = {
                deviceName: '',
                tenantName: '',
            };
        },
        initInfo()
        {
            return this.info = {
                id: null,
                deviceName: null,
                spec: null,
                srcTenantName: null,
                tenantName: null,
                nums: null,
                actualNum: null,
            }
        },
        async openDialog(flag)
        {
            this.showDialog = flag;
            this.$forceUpdate();
        },
        async openStockInventory()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条需要盘点的器具库存！");
                return false;
            }
            await this.openDialog(true);
            this.info = this.common.copyObj(selectData[0]);
            this.$forceUpdate();
        },
        async goStockInventoryLog()
        {
            this.$emit("openTab",{
                urlId: "stockInventoryLog" + new Date().getTime(),
                query: {},
                urlName: '器具盘点记录',
                urlPathName: "/stockInventoryLog",
                urlPath: '/pt/wms/inventory/device/deviceInventoryManageLog.vue'});
        },
        async saveInventory()
        {
            if (this.common.isBlank(this.info.actualNum)) {
                this.$message.error("盘点数量不能为空");
                return false;
            }
            let that = this;
            let msg = `
                    <p style="text-align:center;">器具：${this.info.deviceName}</p>
                    <p style="text-align:center;">当前库存：${this.info.nums},盘点后库存：${this.info.actualNum}</p>
                    <p style="text-align:center;margin-top:10px;color:red;">注：确认盘点后，当前库存=盘点后库存</p>
                    `;
            that.$confirm(msg, {
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            },"器具库存盘点").then(() =>{
                that.common.postUrl("stockDeviceService", "saveDeviceInventory", this.info, function (data) {
                    that.doQuery();
                    that.$message.success("盘点成功！");
                    that.openDialog(false);
                }, null, '', true).then(() => {});
            }).catch(() =>{})
        },
    },
}
