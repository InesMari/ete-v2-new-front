import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'uninventoryStockStorageManage',
    data()
    {
        return {
            head: [
                {"name": "物流中心", "code": "workStoreName", "width": "250", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "110", "type": "text"},
                {"name": "库区", "code": "reservoirName", "width": "110", "type": "text"},
                {"name": "库位", "code": "storageCode", "width": "110", "type": "text"},
                {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "110", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "110", "type": "text"},
            ],
            loadParam: {
              workStoreId: null,
              backupMonth: null,
              reservoirName: null,
              storageCode: null,
              materialNum: null,
            },
            workData: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        // 处理路由参数
        let workStoreId = this.$route.query.workStoreId;
        if (this.common.isNotBlank(workStoreId)) {
            this.loadParam.workStoreId = parseInt(workStoreId);
        }
        this.loadParam.backupMonth = this.$route.query.backupMonth;

        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData()
        {
          this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        /**
         * 查询列表
         */
        doQuery(query = this.loadParam)
        {
            this.loadParam = query;
            this.$refs.table.load("wmsDataReportService", "queryWmsUninventoryStockDtlPage", this.loadParam);
        },
        download()
        {
            this.$refs.table.downloadExcelFile('未盘点明细列表');
        },
    },
    computed: {
        formData()
        {
          return [
            {"name":"物流中心","model":"workStoreId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"物流中心","method":"doQuery","isshow":true},
            {"name":"查询月份","model":"backupMonth","type":"month","isshow":true},
            {"name":"库区","model":"reservoirName","type":"input","placeholder":"搜索库区","isshow":true},
            {"name":"库位","model":"storageCode","type":"input","placeholder":"搜索库位","isshow":true},
            {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
          ]
        }
    },
}
