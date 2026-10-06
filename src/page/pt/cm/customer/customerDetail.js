import authRoleTree from "@/components/auth/authRoleTree.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'customerDetail',
    data() {
        return {
            query: {tenantId : this.$route.query.tenantId},
            collect: {
                creditLevel: 5,
                adminUser: null,
            },
            tenantName: this.$route.query.tenantName,
            showEntityPage: false,
            sumDayData:{
                waitAppointCount: 0,//待出车包含待派车和待出车
                inWayCount: 0,//运作中的派车单
                finishedCount: 0,//完成包含已完成和异常终止
            },
            weeks:[],
            month: this.common.formatDate.getMonth(),//默认当前月份
            selectIndex: 0,//选择天数在本周的数组索引
            enumData: enumData,
            weekDataMap: enumData.weekDataMap,//周几的数据
            currentDate:new Date().getDate(),//当前日期

            colors:['#99A9BF', '#F7BA2A', '#FF9900'],
            texts:['逾期超90天付款', '逾期超60天付款', '逾期超30天付款', '逾期30天内付款', '守信客户'],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initWeek();
    },
    /**
     * 组件
     */
    components: {
        authRoleTree,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化日历
         * e Date格式，月份 不传是默认的
         */
        async initWeek(e)
        {
            this.weeks = [];
            let date = this.common.isBlank(e) ? new Date() : this.getMyDate(e);
            let week = date.getDay();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            this.selectIndex = week;
            this.currentDate = day;//当前天
            for (let i = 0; i < 7; i++)
            {
                let el = {};
                let monthMaxDay = new Date(date.getFullYear(), month, 0).getDate();//month月份最后一天天数
                let actualMonth = month;//日期实际月份
                el.date = day - week + i;//默认本月份的天数
                if (el.date < 1)//上个月日期处理
                {
                    el.date = new Date(date.getFullYear(), month - 1, 0).getDate() + el.date;//month - 1月最后一天天数减去obj.date
                    actualMonth = month - 1;
                }
                else if (el.date > monthMaxDay)//下个月日期处理
                {
                    el.date = el.date - monthMaxDay;//下个月的天数
                    actualMonth = month + 1;
                }
                el.time = new Date(date.getFullYear(), actualMonth - 1, el.date);//天时间对象
                el.week = this.weekDataMap.get(i);//显示周几数据

                let month_ = el.time.getFullYear() + "-" + (actualMonth < 10 ? '0' + actualMonth : actualMonth);//加载数据的年月条件
                let sumDayData = await this.doQueryByTenantId(month_ + "-" + (el.date < 10?'0'+el.date:el.date));
                this.initSumDayData(el, sumDayData);
                //赋值当天展示派车单数据
                if (this.selectIndex === i) this.initSumDayData(this.sumDayData, sumDayData);
                this.weeks.push(el);
            }
            await this.doQuery();
        },
        /**
         * 获取时间
         * @param date
         */
        getMyDate(date)
        {
            let maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();//date月份最后一天天数
            if (this.currentDate <= maxDay)
                return new Date(date.getFullYear(), date.getMonth(), this.currentDate);
            else
                return date;
        },
        /**
         * 上周
         */
        async preWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date - 7;
                if (day > 0)//当前月份
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                else
                {
                    let lastMonthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth(), 0);//上个月最后一天
                    el.date = lastMonthMaxDate.getDate() + day;
                    el.time = new Date(lastMonthMaxDate.getFullYear(), lastMonthMaxDate.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.doQueryByTenantId(month_ + "-" + (el.date < 10?'0'+el.date:el.date));
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 下周
         */
        async nextWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date + 7;
                let monthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth() + 1, 0);
                if (day > monthMaxDate.getDate())//下个月
                {
                    el.date = day - monthMaxDate.getDate();
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth() + 1, el.date);
                }
                else
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.doQueryByTenantId(month_ + "-"  + (el.date < 10?'0'+el.date:el.date));
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 改变天数
         * @param data
         * @param index
         */
        async changeDay(data, index)
        {
            this.selectIndex = index;
            this.currentDate = data.date;
            let month = data.time.getMonth() + 1;
            this.month = data.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
            this.initSumDayData(this.sumDayData, data);
        },
        /**
         * 初始化当日的 待出车、运作中、已完成数据
         * @param target
         * @param source
         */
        initSumDayData(target, source)
        {
            target.waitAppointCount = source.waitAppointCount;
            target.inWayCount = source.inWayCount;
            target.finishedCount = source.finishedCount;
            this.$forceUpdate();
        },
        /** 初始化统计数据 */
        doQuery() {
            let that = this;
            this.common.postUrl("customerTF", "queryCustomerCollect", this.query, function (data) {
                that.collect = data;
            });
        },
        async doQueryByTenantId(day) {
            this.query.date = day;
            return await this.common.postUrl("customerTF", "queryCustomerCollect", this.query, null, null, null, true);
        },
        /**
         * 是否展示权限页
         * @param flag 开关展示
         */
        isShowEntityPage(flag)
        {
            this.showEntityPage = flag;
        },
        /**
         * 加载权限实体树
         */
        loadEntityTree()
        {
            if(!this.$route.query.roleId){
                this.$message.error("客户登录账号为空，不能设置权限！");
                return;
            }
            this.$refs.authRoleTree.loadEntityTree({roleId: this.$route.query.roleId,isPT: 1}, false, 2);
            this.isShowEntityPage(true);
        },
        /** 收支预算配置 */
        toBudgetManage(){
            let item = {
                urlName: "收支预算配置",
                urlId: 'budgetManage' + this.$route.query.tenantId,
                urlPathName: "/base",
                urlPath: "/pt/rpt/base/budgetManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001008,
                },
            }
            this.$emit('openTab', item);
        },
        /** 子公司 */
        toSubCustomerManage(){
            let item = {
                urlName: "子公司",
                urlId: 'customerSubCompany' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/customerSubCompany.vue",
                query:{
                    parentId:this.$route.query.tenantId,
                    pId: 1001013,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 运作时间配置 */
        toCustomerTimeManage(){
            let item = {
                urlName: "运作时间配置",
                urlId: 'cmCustTimeLimitManage' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/cmCustTimeLimitManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId: 1001019,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 应用管理
         */
        applicationManage()
        {
            if(this.common.isBlank(this.collect.adminUser) || this.collect.adminUser < 0){
                this.$message.error("客户登录账号为空，不能管理应用！");
                return;
            }
            let item = {
                urlName: "应用管理",
                urlId: 'applicationManage' + this.$route.query.tenantId,
                urlPathName: "/cm",
                urlPath: "/pt/cm/customer/applicationManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    tenantId:this.$route.query.tenantId,
                },
            }
            this.$emit('openTab', item);
        },
        interfaceManage()
        {
            if(this.common.isBlank(this.collect.adminUser) || this.collect.adminUser < 0){
                this.$message.error("客户登录账号为空，不能管理应用！");
                return;
            }
            let item = {
                urlName: "接口管理",
                urlId: 'interfaceManage' + this.$route.query.tenantId,
                urlPathName: "/cm",
                urlPath: "/pt/cm/customer/interfaceManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    tenantId:this.$route.query.tenantId,
                },
            }
            this.$emit('openTab', item);
        },
        /** 待调度 */
        toWaybillAppoint(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            let bo = false;
            for (let i = 0; i < entityIds.length; i++) {
                if(entityIds[i]=='1001070'){//订单管理权限
                    bo = true;
                    break;
                }
            }
            if(!bo){
                this.$message.error("没有权限，无法查看！");
                return;
            }
            let item = {
                urlName: "订单管理",
                urlId: 'orderManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    orderState:0,
                    currentDate: this.month + '-' + this.currentDate,
                    pId: 1001070,
                },
            }
            this.$emit('openTab', item);
        },
        /** 运作中 */
        toWaybillInway(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            let bo = false;
            for (let i = 0; i < entityIds.length; i++) {
                if(entityIds[i]=='1001070'){//订单管理权限
                    bo = true;
                    break;
                }
            }
            if(!bo){
                this.$message.error("没有权限，无法查看！");
                return;
            }
            let item = {
                urlName: "订单管理",
                urlId: 'orderManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    orderState:1,
                    currentDate: this.month + '-' + this.currentDate,
                    pId: 1001070,
                },
            }
            this.$emit('openTab', item);
        },
        /** 已完成 */
        toWaybillFinished(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            let bo = false;
            for (let i = 0; i < entityIds.length; i++) {
                if(entityIds[i]=='1001070'){//订单管理权限
                    bo = true;
                    break;
                }
            }
            if(!bo){
                this.$message.error("没有权限，无法查看！");
                return;
            }
            let item = {
                urlName: "订单管理",
                urlId: 'orderManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    orderState:2,
                    currentDate: this.month + '-' + this.currentDate,
                    pId: 1001070,
                },
            }
            this.$emit('openTab', item);
        },
        /** 基础信息 */
        toCustomerDetail(){
            let item = {
                urlName: "基础信息",
                urlId: 'addCustomer' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/addCustomer.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    isLock:1,
                    pId: 1001023,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 货物信息 */
        toCustomerGoods(){
            let item = {
                urlName: "货物信息",
                urlId: 'goodsInfoManage' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/goodsInfoManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001024,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 作业信息 */
        toCustomerWork(){
            let item = {
                urlName: "作业信息",
                urlId: 'workInfoManage' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/workInfoManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001029,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 线路信息 */
        toCustomerRoute(){
            let item = {
                urlName: "线路信息",
                urlId: 'routeManage' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/route/routeManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001035,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 整车报价*/
        toCustomerQuoteZC(){
            let item = {
                urlName: "客户整车报价",
                urlId: 'customerZCQuoteManage' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/quote/customerZCQuoteManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001041,
                },
            }
            this.$emit('openTab', item);
        },
        /** 零担报价*/
        toCustomerQuoteLD(){
            let item = {
                urlName: "客户零担报价",
                urlId: 'quoteManageLD' + this.$route.query.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/quote/quoteManageLD.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001047,
                },
            }
            this.$emit('openTab', item);
        },
        /** 仓储合同 */
        toCustomerStorehouse(){
            let item = {
                urlName: "仓储合同",
                urlId: 'storeHouseSaleManage' + this.$route.query.tenantId,
                urlPathName: "/res",
                urlPath: "/pt/res/storeHouseSaleManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001053,
                },
            }
            this.$emit('openTab', item);
        },

        toCustomerPkg(){
            let item = {
                urlName: "器具合同",
                urlId: 'deviceContractManage' + this.$route.query.tenantId,
                urlPathName: "/contract",
                urlPath: "/pt/device/contract/deviceContractManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId: 1001058,
                },
            }
            this.$emit('openTab', item);
        },
        /** 新增订单 */
        toAddOrder(){
            let item = {
                urlName: "新增订单",
                urlId: 'addOrder' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/addOrder.vue",
                query:{
                    tenantId:this.$route.query.tenantId
                },
            }
            this.$emit('openTab', item);
        },
        /** 新增订单包 */
        toAddOrderPlan(){
            let item = {
                urlName: "新增计划",
                urlId: 'addPlan' + this.$route.query.tenantId,
                urlPathName: "/plan",
                urlPath: "/pt/ord/plan/addPlan.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                },
            }
            this.$emit('openTab', item);
        },
        /** 订单调度 */
        toDispatch(){
            let item = {
                urlName: "订单调度",
                urlId: 'dispatch' + this.$route.query.tenantId,
                urlPathName: "/dispatch",
                urlPath: "/pt/ord/dispatch/dispatch.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    dispatchType:1,
                },
            }
            this.$emit('openTab', item);
        },
        /** 零担调度 */
        toDispatchLD(){
            let item = {
                urlName: "零担调度",
                urlId: 'dispatchLD' + this.$route.query.tenantId,
                urlPathName: "/dispatch",
                urlPath: "/pt/ord/dispatch/dispatch.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    dispatchType:4,
                },
            }
            this.$emit('openTab', item);
        },
        /** 上传单据 */
        toAddReceipt(){
            let item = {
                urlName: "上传单据",
                urlId: 'addReceipt' + this.$route.query.tenantId,
                urlPathName: "/receipts",
                urlPath: "/pt/ord/receipts/addReceipt.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 费用异动*/
        toIncomeFee(){
            let item = {
                urlName: "费用异动",
                urlId: 'incomeChangeNew' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/incomeChangeCustomer.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 订单管理 */
        toOrderManage(){
            let item = {
                urlName: "订单管理",
                urlId: 'orderManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 库存管理 */
        toStockManage(){
            let item = {
                urlName: "库存管理",
                urlId: 'ordStockManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/ordStockManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 订单包管理 */
        toPlanManage(){
            let item = {
                urlName: "订单包管理",
                urlId: 'ordPlanManage' + this.$route.query.tenantId,
                urlPathName: "/plan",
                urlPath: "/pt/ord/plan/ordPlanManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 派车单管理 */
        toWaybillManage(){
            let item = {
                urlName: "派车单管理",
                urlId: 'waybillManage' + this.$route.query.tenantId,
                urlPathName: "/waybill",
                urlPath: "/pt/ord/waybill/waybillManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 中转管理 */
        toTransitManage(){
            let item = {
                urlName: "中转管理",
                urlId: 'transitManage' + this.$route.query.tenantId,
                urlPathName: "/transit",
                urlPath: "/pt/ord/transit/transitList.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 单据管理 */
        toReceiptManage(){
            let item = {
                urlName: "单据管理",
                urlId: 'receiptsManage' + this.$route.query.tenantId,
                urlPathName: "/receipts",
                urlPath: "/pt/ord/receipts/receiptsManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 异动管理 */
        toIncomeFeeManage(){
            let item = {
                urlName: "异动管理",
                urlId: 'incomeFeeStatementManage' + this.$route.query.tenantId,
                urlPathName: "/order",
                urlPath: "/pt/ord/order/incomeFeeStatementManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                },
            }
            this.$emit('openTab', item);
        },
        /** 采购管理 */
        toPackPurchaseManage(){
            let item = {
                urlName: "采购管理",
                urlId: 'packPurchaseManage' + this.$route.query.tenantId,
                urlPathName: "/pkg",
                urlPath: "/pt/pkg/packPurchaseManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId:1004002,
                },
            }
            this.$emit('openTab', item);
        },
        /** 租赁管理 */
        toPackBusinessManage(){
            let item = {
                urlName: "租赁管理",
                urlId: 'packBusinessManage' + this.$route.query.tenantId,
                urlPathName: "/business",
                urlPath: "/pt/pkg/business/packBusinessManage.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId:1004004,
                },
            }
            this.$emit('openTab', item);
        },
        /** 费用汇总 */
        toPackIncomeManage(){
            let item = {
                urlName: "费用汇总",
                urlId: 'packIncomeManage' + this.$route.query.tenantId,
                urlPathName: "/fc",
                urlPath: "/pt/pkg/fc/packIncomeManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId:1004005,
                },
            }
            this.$emit('openTab', item);
        },
        /** 新增账单 */
        toAddCustBill(){
            let item = {
                urlName: "新增大客户账单",
                urlId: 'addCustomerBillMain' + this.$route.query.tenantId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/add/addCustomerBillMain.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    tenantId:this.$route.query.tenantId,
                    pId: 1001132,
                },
            }
            this.$emit('openTab', item);
        },
        /** 其他费用 */
        toPrjSundryFeeManage(){
            let item = {
                urlName: "其他费用",
                urlId: 'prjSundryFeeManage' + this.$route.query.tenantId,
                urlPathName: "/sundry",
                urlPath: "/pt/fc/sundry/prjSundryFeeManage.vue",
                query:{
                    custId:this.$route.query.custId,
                    t:2,
                    pId: 1001133,
                },
            }
            this.$emit('openTab', item);
        },
        /** 仓储费用 */
        toStoreHouseShareManage(){
            let item = {
                urlName: "仓储费用",
                urlId: 'wmsFeeIncomeManage' + this.$route.query.tenantId,
                urlPathName: "/storehouse",
                urlPath: "/pt/fc/storehouse/wmsFeeIncomeManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    t:2,
                    pId: 1001137,
                },
            }
            this.$emit('openTab', item);
        },
        /** 账单管理 */
        toCustBillManage(){
            let item = {
                urlName: "账单管理",
                urlId: 'customerBillManageMain' + this.$route.query.tenantId,
                urlPathName: "/custBill",
                urlPath: "/pt/fc/custBill/customerBillManageMain.vue",
                query:{
                    tenantId:this.$route.query.tenantId,
                    pId: 1001142,
                },
            }
            this.$emit('openTab', item);
        },
        /** 费用补录 */
        toBillMakeupManage(){
            let item = {
                urlName: "客户费用补录",
                urlId: 'billMakeupFeeList' + this.$route.query.tenantId,
                urlPathName: "/billMakeup",
                urlPath: "/pt/fc/billMakeup/billMakeupFeeList.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId: 1001148,
                },
            }
            this.$emit('openTab', item);
        },
        /** 发票管理 */
        toApplyInvoiceManage(){
            let item = {
                urlName: "发票管理",
                urlId: 'applyInvoiceManage' + this.$route.query.tenantId,
                urlPathName: "/invoice",
                urlPath: "/pt/fc/invoice/applyInvoiceManage.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId: 1001152,
                },
            }
            this.$emit('openTab', item);
        },
        /** 收款登记 */
        toCollectionRegistration(){
            let item = {
                urlName: "收款登记",
                urlId: 'collectionRegistration' + this.$route.query.tenantId,
                urlPathName: "/register",
                urlPath: "/pt/fc/register/collectionRegistration.vue",
                query:{
                    tenantName:this.$route.query.tenantName,
                    pId: 1001158,
                },
            }
            this.$emit('openTab', item);
        },
    },
}
