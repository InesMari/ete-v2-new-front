import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'packObjectManage',
    data() {
        return {
            head: [
                {"name": "包装编号", "code": "packObjectNum", "width": "110", "type": "text"},
                {"name": "累计计费天数", "code": "totalChargeDay", "width": "110", "type": "text"},
                {"name": "开始计费时间", "code": "chargeDate", "width": "110", "type": "text"},
                {"name": "周转次数", "code": "turnoverTimes", "width": "110", "type": "text"},
                {"name": "所在仓库", "code": "workName", "width": "110", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "110", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "110", "type": "text"}
            ],
            loadParam: {packId : this.$route.query.pkgId,custTenantId : this.$route.query.custTenantId},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
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
        doQuery() {
            this.$refs.table.load("pkgBusinessTF", "queryPkgObjectPage", this.loadParam);
        },
        init() {

        },
        clear() {
            this.loadParam = {};
        },
        /**
         * 导出
         */
        downExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
}
