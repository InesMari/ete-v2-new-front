import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'collaborativeWarehousing',
    data() {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
                {"name": "货物下单件数", "code": "goodsCountSum", "width": "100", "type": "text"},
                {"name": "货物下单重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text"},
                {"name": "货物下单体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text"},
                {"name": "协同区域", "code": "cdtRegionName", "width": "90", "type": "text",},
                {"name": "协同费用", "code": "cdtFee", "width": "90", "type": "text",},
                {"name": "操作人", "code": "cdtUserName", "width": "100", "type": "text"},
                {"name": "操作时间", "code": "cdtDate", "width": "150", "type": "text"},
            ],
            orderStateData: [],//订单状态
            query: this.initQuery(),
            enumData: enumData,
        }
    },
    async mounted()
    {
        await this.init();
        this.doQuery().then(r => {});
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
            this.orderStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_STATE"});
            for (let i = 0; i < this.orderStateData.length; i++)
            {
                let item = this.orderStateData[i];
                if (!(item.codeValue == enumData.orderState.PREP_DISPATCH
                        || item.codeValue == enumData.orderState.IN_OPERATION
                        || item.codeValue == enumData.orderState.FINISHED
                        || item.codeValue == enumData.orderState.ABORT))
                {
                    this.orderStateData.splice(i, 1);
                    i--;
                }
            }
        },
       
        /**
         * 初始化查询条件
         */
        initQuery()
        {
            return this.query = {
                tenantName: '',
                orderNum: '',
                orderState: '',
            };
        },
        /**
         * 查询列表
         */
		async doQuery()
        {
			await this.$refs.table.load("orderCdtRegionServiceImpl", "queryCdtRegionOrderToMySelfInfoList", this.query);
        },
        /**
         * 订单调度
         */
        toDispatch(){
            let item = {
                urlName: "订单调度",
                urlId: '1003003',
                urlPathName: "/dispatch",
                urlPath: "/pt/ord/dispatch/dispatch.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    dispatchType:1,
                    pId: 1003003,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 零担调度
         */
        toDispatchLD(){
            let item = {
                urlName: "零担调度",
                urlId: '1003004',
                urlPathName: "/dispatch",
                urlPath: "/pt/ord/dispatch/dispatch.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    dispatchType:4,
                    pId: 1003004,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 打开详情
         * @param data
         */
        dblclickItem(data)
        {
            this.$emit("openTab",{
                urlId: 'orderDetail' + data.orderId,
                query: {orderId: data.orderId, pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
    },
}
