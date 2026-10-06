export default {
    name: 'planDetail',
    data() {
        return {
            orderPlan: {},//订单包基本信息
            workData: [],//订单包作业点信息
            goodsData: [],//订单包货物信息
            incomeFee: {},//订单包收入费用信息
            costFee: {},//订单包成本费用信息
            supplierData: [],//订单包供应商信息
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadPlanInfoByPlanId();
    },
    /**
     * 组件
     */
    components: {},
    methods: {
        /** 加载订单包 */
        loadPlanInfoByPlanId() {
            //加载订单包信息
            let that = this;
            this.common.postUrl("ordPlanTF", "loadPlanInfoByPlanId", {planId:this.$route.query.planId}, function (data) {
                if(that.common.isNotBlank(data)){
                    that.orderPlan = data.orderPlan;
                    that.workData = data.workData;
                    that.goodsData = data.goodsData;
                    that.incomeFee = data.incomeFee;
                    that.costFee = data.costFee;
                    that.supplierData = data.supplierData;
                }
            });
        },
        /** 关闭页面 */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}