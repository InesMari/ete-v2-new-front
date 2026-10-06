import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'PDAOpLogBase',
    data()
    {
        return {
            head: [
                {"name": "仓库", "code": "workName", "width": "200", "type": "text"},
                {"name": "操作类型", "code": "dealTypeName", "width": "100", "type": "text"},
                {"name": "包装数量", "code": "dealNum", "width": "130", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            dealTypeData: [],//供应商
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
            this.dealTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEAL_TYPE"});
        },
        /**
         * 初始化查询条件
         * @returns {*}
         */
        initQuery()
        {
            this.query = {
                workName: '',
                createUserName: '',
                dealType: '',
            };
            this.$forceUpdate();
            return this.query;
        },
        /**
         * 查询列表
         */
        async doQuery()
        {
            await this.$refs.table.load("pkgLogTF", "queryPkgLogBase", this.query);
        },
        toDetail(data){
            let urlName = '';
            if(data.dealType==200){
                urlName = '配送出库明细';
            }else if(data.dealType==201){
                urlName = '返空出库明细';
            }else if(data.dealType==900){
                urlName = 'PDA初始化明细';
            }else {
                urlName = '入库明细';
            }
            this.$emit("openTab",{
                urlId: 'logDetail' + data.logId,
                query: {logId: data.logId,dealType:data.dealType},
                urlName: urlName,
                urlPathName: "/logDetail",
                urlPath: "/pt/pkg/business/opLog/PDAOpLogDetail.vue"});
        }

    },
}
