export default {
    name: 'wmsFeeIncomeRentStatement',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{},
                details1:[],
                details2:[]
            },
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
            let feeId = this.$route.query.id;
            this.info = await this.common.postUrl("wmsFeeIncomeTF", 'queryWmsFeeIncomeRentStatementById', {feeId}, null, null, '', true);
            this.$forceUpdate();
        },
        // 查看详情
        toQuoteDetail(item){
            let quoteId = item.quoteId;
            this.$emit('openTab', {
                urlName: '报价单详情',
                urlId: 'detail'+quoteId,
                urlPathName: "/quoteSheetDetail",
                urlPath: "/pt/wms/quoteSheet/quoteSheetDetail.vue",
                query:{quoteId}
            });
        },
        toDetail(item){
            let feeStatementId = item.feeStatementId;
            this.$emit('openTab', {
                urlName: '仓储收入明细列表',
                urlId: 'detail'+new Date().getTime(),
                urlPathName: "/wmsFeeIncomeRentDtlManage",
                urlPath: "/pt/fc/storehouse/wmsFeeIncomeRentDtlManage.vue",
                query:{feeStatementId}
            });
        },
    },
}
