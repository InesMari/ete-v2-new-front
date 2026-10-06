import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'deviceBusinessManage',
    data() {
        return {
            head: [
                {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "120", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "120", "type": "text"},
                {"name": "总数量", "code": "totalNums", "width": "100", "type": "text"},
                {"name": "内部在库", "code": "innerNums", "width": "100", "type": "text"},
                {"name": "客户在库", "code": "outterNums", "width": "100", "type": "text"},
                {"name": "未回收", "code": "reoveryNums", "width": "100", "type": "text"},
                {"name": "上月利用数量", "code": "opNums", "width": "100", "type": "text"},
                {"name": "上月利用利用率", "code": "opRate", "width": "100", "type": "text"},
                {"name": "上月回收数量", "code": "returnNums", "width": "100", "type": "text"},
                {"name": "上月回收率", "code": "returnRate", "width": "100", "type": "text"},
            ],
            query: this.initQuery(this.$route.query.tenantId),
            info: this.initInfo(),
            deviceData:[],//器具数据
            POData: [],
            tenantData: [],//归属客户
            showDialog: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery() {
            this.query.isGroupByBusinessMode = 1;
            this.query.srcTenantId = 1;
            this.$refs.table.load("stockDeviceService", "queryDeviceStockPage", this.query);
        },
        //初始化数据
        async initData() {
            this.tenantData = await this.common.postUrl("deviceContractService", "queryContractTenant", {businessModes: [2,3]});
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
        },
        //初始化查询条件
        initQuery(tenantId) {
            return this.query = {
                custTenantId : this.common.isBlank(tenantId) ? '' : Number(tenantId),
                deviceName: '',
            };
        },
        async openDialog(flag) {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                let data = selectData[0];
                if(selectData.length != 1)
                {
                    this.$message.error("请选择一个需要手工回收的数据！");
                    return false;
                }
                if(data.businessMode != 2)
                {
                    this.$message.error("只有静态租赁点库存才能手工回收！");
                    return false;
                }
                this.info = this.common.copyObj(data);
                this.info.reoveryCount = null;
                await this.loadPO(this.info.tenantId, this.info.deviceId);
            }
            this.showDialog = flag;
            this.$forceUpdate();
        },
        async saveReovery() {
            if(this.common.isBlank(this.info.purchaseId))
            {
                this.$message.error("po单不能为空！");
                return false;
            }
            if(this.common.isBlank(this.info.reoveryCount))
            {
                this.$message.error("回收数量不能为空！");
                return false;
            }
            if(this.common.isBlank(this.info.actualDate))
            {
                this.$message.error("回收日期不能为空！");
                return false;
            }

            await this.common.postUrl("stockDeviceService", "saveDeviceReovery", this.info);
            await this.doQuery();
            this.$message.success("回收成功！");
            await this.openDialog(false);
        },
        initInfo()
        {
            return this.info = {
                ids:'',
                custTenantId:'',
                deviceId: '',
                purchaseId: '',
                reoveryCount: '',
                actualDate: ''
            }
        },
        //改变器具
        async changeDevice()
        {
            this.info.spec = '';
            for (let i = 0; i < this.deviceData.length; i++)
            {
                let item = this.deviceData[i];
                if (this.info.deviceId == item.id)
                {
                    this.info.spec = item.spec;
                    await this.loadPO(this.info.custTenantId, this.info.deviceId)
                    break;
                }
            }
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        //改变采购单
        changePurchase(purchaseId)
        {
            if (this.common.isNotBlank(purchaseId))
            {
                for (let i = 0; i < this.POData.length; i++)
                {
                    let item = this.POData[i];
                    if (item.id == purchaseId)
                    {
                        this.info.reoveryCount = item.deliveryNums;
                        break;
                    }
                }
            }
            this.$forceUpdate();
        },
        //加载已经确认的采购单数据
        async loadPO(tenantId, deviceId)
        {
            this.POData = await this.common.postUrl("devPurchaseOrderService", "queryPurchaseOrderData", {tenantId, businessMode: 2, deviceId});
        },
    },
}
