import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'PDAOpLogDetail',
    data()
    {
        return {
            head:[],
            head1: [
                {"name": "客户名称", "code": "custName", "width": "200", "type": "text"},
                {"name": "包装编号", "code": "packObjectNum", "width": "150", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "150", "type": "text"},
                {"name": "包装类型", "code": "packTypeName", "width": "120", "type": "text"},
            ],
            head2: [
                {"name": "客户名称", "code": "custName", "width": "200", "type": "text"},
                {"name": "交付地", "code": "workName", "width": "200", "type": "text"},
                {"name": "包装编号", "code": "packObjectNum", "width": "150", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "150", "type": "text"},
                {"name": "包装类型", "code": "packTypeName", "width": "120", "type": "text"},
            ],
            head3: [
                {"name": "客户名称", "code": "custName", "width": "200", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "150", "type": "text"},
                {"name": "包装编号", "code": "packObjectNum", "width": "150", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "150", "type": "text"},
                {"name": "包装类型", "code": "packTypeName", "width": "120", "type": "text"},
            ],
            packInfoData: [],
            tenantData: [],
            query: this.initQuery(),
            dealType:this.$route.query.dealType,
        }
    },
    async mounted()
    {
        await this.init();
        this.initHead();
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
            let that = this;
            //归属客户
            this.common.postUrl("pkgBusinessTF", "queryPkgCustomerList", {}, function (data) {
                that.tenantData = data;
            });
        },
        /** 选中客户 */
        changeCust() {
            let that = this;
            if(this.query.custTenantId){
                //查询客户归属包装名称
                this.common.postUrl("pkgBusinessTF", "queryAllPkgNameNoPage", {tenantId:this.query.custTenantId}, function (data) {
                    that.packInfoData = data;
                });
            }else{
                that.packInfoData = [];
            }

            this.doQuery();
        },
        initHead(){
            if(this.dealType==200){
                this.head=this.head2;
            }else if(this.dealType==201){
                this.head=this.head3;
            }else {
                this.head=this.head1;
            }
        },
        /**
         * 初始化查询条件
         * @returns {*}
         */
        initQuery()
        {
            this.query = {
                packObjectNum: '',
                custTenantId: '',
                packId: '',
                logId:this.$route.query.logId,
            };
            this.$forceUpdate();
            return this.query;
        },
        /**
         * 查询列表
         */
        async doQuery()
        {
            await this.$refs.table.load("pkgLogTF", "queryPkgLogRel", this.query);
        },
    },
}
