import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";
import mycity from '@/components/mycity/mycity.vue';
import enumData from "@/page/pt/enum";
import axios from 'axios';
import scrollSelect from "@/components/scrollSelect/scrollSelect.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";

export default {
    name: 'addOrder',
    mixins: [commonOrder],
    /**
     * 组件
     */
    components: {
        scrollSelect,
        myElDatePicker,
        mapDialog,
        mycity
    },
    data()
    {
        return {
            showSuccessDialog: false,//下单成功提示窗口窗口
            cdtRegionData: [],
            policyStartCity:"广州", //防疫政策出发地
            policyEndCity:"宁德", //防疫政策目的地
        }
    },
    async mounted()
    {
        let tenantId = this.$route.query.tenantId;
        if (this.common.isNotBlank(tenantId)) this.queryTenant(tenantId);
        this.cdtRegionArray = await this.loadCdtRegion();//加载协同区域   协同已经取消了
    },
    methods:{
        async queryTenant(tenantId){
            this.order.tenantId = tenantId;
            await this.loadCustomerData();//加载客户数据
            this.routeData = await this.loadRouteDataByTenantId(this.order.tenantId);
            this.workData = await this.loadWorkDataByTenantId(this.order.tenantId);
            this.goodsGroupData[1].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
            this.goodsGroupData[2].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.PACK_GOODS);
            this.changeCdtRegionSelect(this.order.tenantId);

            this.$nextTick(() => {
                let routeId = this.$route.query.routeId;
                if (this.common.isNotBlank(routeId))
                {
                    this.order.routeId = routeId;
                    this.changeRouteSelect(routeId);
                }
                let vehicleLength = this.$route.query.vehicleLength;
                if (this.common.isNotBlank(vehicleLength))
                    this.fee.vehicleLength = vehicleLength;
                let custOrderNum = this.$route.query.custOrderNum;
                if (this.common.isNotBlank(custOrderNum))
                    this.order.custOrderNum = custOrderNum;
            });
        },
        /**
         * 改变客户/租户
         * 初始化页面的字段再加载客户相关的数据
         * @param tenantId
         */
       async changeTenant(tenantId)
        {
            let isReturnTrip = this.order.isReturnTrip;
            this.initOrder(tenantId);
            this.order.isReturnTrip = isReturnTrip;
            this.initRoute();
            this.initWork();
            this.initGoodsGroupData();
            this.initOrderWork();
            this.initOrderGoods();
            this.initBeginWork();
            this.initEndWork();
            this.initFee();
            await this.loadCustomerDataByTenantId(tenantId);
            await this.changeCdtRegionSelect(tenantId);//协同已经取消了
            await this.syncOrderDistance(false);
        },
        /**
         * 改变线路
         * 加载线路相关发作业点、常用货物等
         */
        async changeRouteSelect(routeId)
        {
            if(!routeId){
                return this.changeTenant(this.order.tenantId);//取消线路根据客户初始化数据
            }
            await this.loadRouteDataByRouteId(routeId);//
        },
        /**
         * 订单录入
         */
        sureOrder()
        {
            if (this.checkOrderData())//校验通过
            {
                if (this.common.isNotBlank(this.$route.query.scheduleId))
                    this.order.scheduleId = this.$route.query.scheduleId;
                this.order.workList = this.workList;
                this.order.goodsList = this.goodsList;
                this.order.fee = this.fee;
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
            this.successData.pId = 1001070;
            this.$emit("openTab",{
                urlId: 'orderDetail' + this.successData.orderId,
                query: this.successData,
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        /**
         * @param flag
         */
        changeSuccessDialog(flag)
        {
            this.showSuccessDialog = flag;
        },
        changeWorkDate(index, work)
        {
            if (index == 0 && this.common.isNotBlank(work)
                && (work.workDate).endsWith("00:00"))
            {
                this.$confirm("时分为 00:00, 是否按客户需求输入具体时间点？", "提示", {
                    center: true,
                    confirmButtonText:"是",
                    cancelButtonText:"否",
                }).then(() =>{
                
                }).catch(() =>{
                    work.workDate = null;
                    
                })
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.changeSuccessDialog(false);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
