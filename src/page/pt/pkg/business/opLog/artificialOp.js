import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'artificialOp',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "150", "type": "text"},
                {"name": "包装数量", "code": "packNums", "width": "100", "type": "text"},
                {"name": "交付地", "code": "workName", "width": "200", "type": "text"},
                {"name": "操作类型", "code": "opTypeName", "width": "100", "type": "text"},
                {"name": "开始计费时间", "code": "chargeDate", "width": "130", "type": "text"},
                {"name": "上传文件", "code": "fileName", "width": "150", "type": "diy"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            opTypeData: [],//供应商
            query: this.initQuery(),
        }
    },
    async mounted()
    {
        await this.init();
        await this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init()
        {
            this.opTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PACK_OBJECT_OP_TYPE"});
        },
        /**
         * 初始化查询条件
         * @returns {*}
         */
        initQuery()
        {
            this.query = {
                tenantName: '',
                workName: '',
                packName: '',
                opType: '',
            };
            this.$forceUpdate();
            return this.query;
        },
        /**
         * 查询列表
         */
        async doQuery()
        {
            await this.$refs.table.load("pkgBusinessTF", "queryOpLogPage", this.query);
        },
        /**
         * 下载文件
         * @param item
         * @returns {Promise<void>}
         */
        async download(item)
        {
            window.location.href = item.fileURL;
        }
    },
}
