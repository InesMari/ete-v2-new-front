import commonRoute from "@/page/pt/cm/customer/route/commonRoute.js";

export default {
    name: 'showRoute',
    mixins: [commonRoute],
    data() {
        return {
            isShowReturn: this.$route.query.orderType == 1,
            form:{routeName: '',orderType: this.$route.query.orderType, isReturn:this.$route.query.isReturn,remark: '',transportTimeliness: '',tenantId :this.$route.query.tenantId},
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        /**
         * 初始化
         */
        init()
        {
            let that = this;
            this.common.postUrl("routeTF","loadRouteById", this.$route.query, function (data)
            {
                that.form = data.routeInfo;
                that.form.bizType = data.routeInfo.bizType + "";
                that.routeList = data.routeList;
                if (data.goodsData){ that.tableData = data.goodsData; }
                that.calcWidth();
            });
        },
    }
}
