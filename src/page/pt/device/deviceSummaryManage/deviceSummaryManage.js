import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'deviceSummaryManage',
    data()
    {
        return {
            head: [
                {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "150", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "120", "type": "text"},
                {"name": "总数量", "code": "totalNums", "width": "100", "type": "text", "issum": "true"},
                {"name": "在库数量", "code": "innerNums", "width": "100", "type": "text", "issum": "true"},
                {"name": "客户处数量", "code": "outterNums", "width": "100", "type": "text", "issum": "true"},
                {"name": "使用客户数", "code": "totalCustomerCount", "width": "100", "type": "text"},
                {"name": "未回收数量", "code": "reoveryNums", "width": "100", "type": "text"},
            ],
            query: {
                deviceName: '',
            },
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 查询列表
         */
        async doQuery()
        {
            await this.$refs.table.load("stockDeviceService", "queryDeviceStockSummaryPage", this.query);
        },
        /**
         * 库存明细
         * @param isShow
         */
        toShowPkgBizDetail()
        {
            let array = this.$refs.table.getSelectItem();
            let data = {ids:''};
            if (array.length > 1)
            {
                this.$message.error("请选择一条数据!");
                return false;
            }else if(array.length==1){
                data = array[0];
            }
            let item = {
                urlName: '库存明细',
                urlId: 'deviceStoreDetailManage' + data.id+new Date().getTime(),
                urlPathName: "",
                urlPath: "/pt/device/deviceSummaryManage/deviceStoreDetailManage.vue",
                query: {deviceIds: data.ids},
            }
            this.$emit('openTab', item);
        },
        /**
         * 历史库存明细
         * @param isShow
         */
        toDeviceStoreDetailHis() {
            let item = {
                urlName: '历史库存明细',
                urlId: 'deviceStoreDetailHisManage' +new Date().getTime(),
                urlPathName: "",
                urlPath: "/pt/device/deviceSummaryManage/deviceStoreDetailHisManage.vue",
                query: {},
            }
            this.$emit('openTab', item);
        },
        /** 地图查看库存位置 */
        toPackMonitor()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条数据!");
                return false;
            }
            this.$emit("openTab", {
                urlId: 'packMonitor' + array[0].id,
                query: {deviceIds: array[0].ids},
                urlName: "查看库存位置",
                urlPathName: "/deviceSummaryManage",
                urlPath: "/pt/device/deviceSummaryManage/deviceMonitor.vue"
            });
        },
        download(){
            this.$refs.table.downloadExcelFile('器具汇总列表');
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {};
            this.showViewer = false;
            this.srcList = [];
        },

    },

}