import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'deviceStoreDetailManage',
    data() {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "220", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "180", "type": "text"},
                {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "100", "type": "text"},
                {"name": "数量", "code": "nums", "width": "80", "type": "text"},
            ],
            query: this.initQuery(),
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        await this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化查询对象
         * @returns {*}
         */
        initQuery() {
            this.query =  {
                workName : '',
                deviceIds : this.$route.query.deviceIds,
                tenantName: '',
            };
            return this.query;
        },
        /**
         * 查询列表
         * @returns {Promise<void>}
         */
        async doQuery() {
            this.$refs.table.load("stockDeviceService", "queryDeviceStockSummaryDetailPage", this.query);
        },
        download(){
            this.$refs.table.downloadExcelFile('库存明细列表');
        },
    },
}
