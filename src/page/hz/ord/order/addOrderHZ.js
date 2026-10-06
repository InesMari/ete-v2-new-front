import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum";

export default {
    name: 'addOrderHZ',
    mixins: [commonOrder],
    /**
     * 组件
     */
    components: {
        myFileModel,
        myElDatePicker
    },
    data()
    {
        return {
            showSuccessDialog: false,//下单成功提示窗口窗口
        }
    },
    async mounted()
    {
        if (this.common.isNotBlank(this.order.tenantId))
        {
            this.loadCustomerData();//加载客户数据
            this.routeData = await this.loadRouteDataByTenantId(this.order.tenantId);
            this.workData = await this.loadWorkDataByTenantId(this.order.tenantId);
            this.goodsGroupData[1].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
        }
        this.initTenantData(this.common.userInfo().tenantId);
    },
    methods:{
        /**
         * 初始化页面的字段再加载客户相关的数据
         * @param tenantId
         */
        initTenantData(tenantId)
        {
            this.initOrder(tenantId);
            this.initRoute();
            this.initWork();
            this.initGoodsGroupData();
            this.initOrderWork();
            this.initOrderGoods();
            this.initBeginWork();
            this.initEndWork();
            this.initFee();
            this.loadCustomerDataByTenantId(tenantId);
            this.$forceUpdate();
        },
        /**
         * 改变线路
         * 加载线路相关发作业点、常用货物等
         */
        async changeRouteSelect(routeId)
        {
            if(!routeId){
                return this.initTenantData(this.order.tenantId);
            }
            await this.loadRouteDataByRouteId(routeId);//
        },
        /**
         * 订单录入
         */
        sureOrder()
        {
            if (this.checkOrderDataHZ())//校验通过
            {
                this.order.workList = this.workList;
                this.order.goodsList = this.goodsList;
                this.fee.freightPrice = '';
                this.fee.pointFee = '';
                this.fee.totalPointFee = '';
                this.fee.premiumFee = '';
                this.fee.pickupFee = '';
                this.fee.deliveryFee = '';
                this.fee.loadingFee = '';
                this.fee.dischargeFee = '';
                this.fee.otherFee = '';
                this.fee.totalFee = '';
                this.order.fee = this.fee;
                this.order.tenantType = enumData.TENANT_TYPE.HZ;//货主下单
                let that = this;
                this.common.postUrl("orderTF", "saveOrUpdateOrder", this.order, function (data)
                {
                    that.successData = data;
                    that.changeSuccessDialog(true);
                },null,'',true);
            }
        },
        /**
         * 订单详情
         */
        toOrderDetail()
        {
            this.changeSuccessDialog(false);
            this.toOrderDetailHZ(this.successData);
        },
        /**
         * @param flag
         */
        changeSuccessDialog(flag)
        {
            this.showSuccessDialog = flag;
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.changeSuccessDialog(false);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
