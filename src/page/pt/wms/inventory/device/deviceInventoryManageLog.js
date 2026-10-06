import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'deviceInventoryManageLog',
    data()
    {
        return {
            head: [
                {"name": "器具名称", "code": "deviceName", "width": "200", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "110", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "150", "type": "text"},
                {"name": "所属人", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "使用客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "盘点前在库数量", "code": "oldNums", "width": "110", "type": "text"},
                {"name": "盘点后在库数量", "code": "newNums", "width": "110", "type": "text"},
                {"name": "盘点人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "盘点时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        tableCommon,
    },
    methods: {
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("stockDeviceService", "queryDeviceStockPageForInventoryLog", query);
        },
        initQuery()
        {
            return this.query = {
                deviceName: '',
                tenantName: '',
            };
        },
    },
}
