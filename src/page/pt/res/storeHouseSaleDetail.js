export default {
    name: 'storeHouseSaleDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{},
                details:[]
            },
            customerData:[],
            quoteSheets:[],
            leaseTypeList:[],
            relOperationList:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();    
    },
    /**
     * 组件
     */
    components: {

    },
    /**
     * 绑定函数
     */
    methods: {
        // 初始化数据
        async initData() {
            let id = this.$route.query.id;
            this.info = await this.common.postUrl("storeHouseBizTF", "queryCmStoreHouseSaleRelById", {id});
            this.leaseTypeList = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"LEASE_TYPE"});
            this.quoteSheets = await this.common.postUrl("wmsQuoteSheetTF", "queryAllQuoteSheets", {custTenantId:this.info.baseInfo.custTenantId});
            this.$forceUpdate();
        },
    },
}
