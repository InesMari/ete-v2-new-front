import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'coInitiated',
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
    /**
     * 组件
     */
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
			let {items} = await this.$refs.table.load("orderCdtRegionServiceImpl", "queryCdtRegionOrderInfoList", this.query);
			this.$refs.table.resetData(items);
        },
        /**
         * 取消协同
         * @returns {Promise<boolean>}
         */
        async cancelCdtRegionOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要取消协同的订单！");
                return false;
            }
            if (selectData[0].orderState == enumData.orderState.IN_OPERATION)
            {
                this.$message.error("已经开始运作的订单无法取消协同！");
                return false;
            }
            if (selectData[0].orderState == enumData.orderState.FINISHED)
            {
                this.$message.error("已完成的订单无法取消协同！");
                return false;
            }
            if (selectData[0].orderState == enumData.orderState.ABORT)
            {
                this.$message.error("异常中止的订单无法取消协同！");
                return false;
            }
            let that = this;
            this.$confirm("确认需要取消该订单协同？", "提示").then(() =>{
                this.common.postUrl("orderCdtRegionServiceImpl", "cancelCdtRegionOrder", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("取消成功！");
                });
            }).catch(() =>{});
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
