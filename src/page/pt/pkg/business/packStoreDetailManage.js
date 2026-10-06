import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'packBusinessManage',
    data() {
        return {
            head: [
                {"name": "使用客户", "code": "tenantName", "width": "130", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "110", "type": "text"},
                {"name": "包装名称", "code": "pkgName", "width": "110", "type": "text"},
                {"name": "包装类型", "code": "packTypeName", "width": "110", "type": "text"},
                {"name": "包装数量", "code": "totalNums", "width": "110", "type": "text"},
            ],
            query: this.initQuery(),
            packingTypeData: [],//所有货物包装类型
            tenantData: [],//归属客户
            showModify: false,
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        await this.initData();
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
         * 初始化数据
         * @returns {Promise<void>}
         */
        async initData() {
            //包装类型
            this.packingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"});
            //归属客户
            this.tenantData = await this.common.postUrl("pkgBusinessTF", "queryPkgCustomerList", {});
        },
        /**
         * 初始化查询对象
         * @returns {*}
         */
        initQuery() {
            this.query =  {
                pkgId : this.$route.query.pkgId,
                custTenantId : '',
                packType : '',
                workName : '',
            };
            return this.query;
        },
        /**
         * 查询列表
         * @returns {Promise<void>}
         */
        async doQuery() {
            this.$refs.table.load("pkgBusinessTF", "queryPackStoreDetailPage", this.query);
        },
    },
}
