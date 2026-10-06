import tableCommon from "@/components/table/tableCommon.vue"
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport";

export default {
    name: 'orderManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "线路距离", "code": "farthestDistanceInfo", "width": "100", "type": "text"},
                {"name": "线路里程", "code": "routeMileage", "width": "100", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "180", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
                {"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "完成时间", "code": "finishDate", "width": "150", "type": "text"},
                {"name": "时效状态", "code": "timeLimitStateName", "width": "150", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
                {"name": "是否回单", "code": "haveReceiptName", "width": "100", "type": "text"},
                {"name": "派车单数", "code": "waybillNums", "width": "90", "type": "text"},
                {"name": "是否入账", "code": "entryBillFlagName", "width": "90", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "120", "type": "text"},
                {"name": "回单状态", "code": "receiptStateName", "width": "90", "type": "text"},
                {"name": "是否生成报表", "code": "generateReportFlagName", "width": "120", "type": "text"},
                {"name": "是否回程单", "code": "isReturnTripName", "width": "120", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
                {"name": "货物件数", "code": "goodsCountSum", "width": "100", "type": "text",isSum:true},
                {"name": "货物重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text",isSum:true},
                {"name": "货物体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text",isSum:true},
                {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
                {"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
                {"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text",isSum:true},
                {"name": "供应商", "code": "supplierTenantNames", "width": "160", "type": "text"},
                {"name": "车辆所有人", "code": "vehicleOwners", "width": "160", "type": "text"},
                {"name": "车牌号码", "code": "plateNumbers", "width": "160", "type": "text"},
                {"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text", "entityId": "1003029",},
                {"name": "中途点数", "code": "midwayPointCount", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "点位费", "code": "pointFee", "width": "90", "type": "text", "entityId": "1003029"},
                {"name": "点位费合计", "code": "totalPointFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "运费", "code": "freight", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                // {"name": "保险费", "code": "premiumFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                // {"name": "装货费", "code": "loadingFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                // {"name": "卸货费", "code": "dischargeFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                // {"name": "其他费", "code": "otherFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "订单收入合计", "code": "income", "width": "100", "type": "text", "entityId": "1003029",isSum:true},

                // {"name": "订单异常成本合计", "code": "income", "width": "100", "type": "text"},
                // {"name": "派车单成本合计", "code": "income", "width": "100", "type": "text"},

                {"name": "订单成本合计", "code": "pay", "width": "100", "type": "text", "entityId": "1003030",isSum:true},
                {"name": "下单人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "下单部门", "code": "orgName", "width": "100", "type": "text"},
                {"name": "下单区域", "code": "regionName", "width": "100", "type": "text"},
                {"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
                // {"name": "协同区域", "code": "cdtRegionName", "width": "90", "type": "text",},
                // {"name": "协同费用", "code": "cdtFee", "width": "90", "type": "text",},
            ],
            query: this.initQuery(),
            customerData: [],//客户
            orderTypeData: [],//订单类型
            orderStateData: [],//订单状态
            stockStateData: [],//库存状态
            billingTypeData: [],//计费方式
            payModeData: [],//结算方式
            stock: this.initStock(),
            stockQuery: this.initStockQuery(),
            seeRepertory: false,//查看库存
            orderStockData: this.initOrderStockData(),//订单库存
            selectData: [],//最后选择的订单
            showSetTable: true,
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
            whetherData:[],
            showReceipts: false,
            receipts: this.initReceipts(),
            waybillData: [],
            waybillWorkData: [],
            regionData:[],//区域数据
            orgIdData: [],
            receiptStateData: [],
            bizTypeData: [],
            verifyStateData:[{codeValue:0,codeName:'未审核'},{codeValue:1,codeName:'已审核'}],
            vehicleLengthData:[],

            list:[{}],

            uploadOpen:false,
            uploadOpen2:false,
            uploadOpen3:false,
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        myFileModel,
        searchList,
        myImport
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'ORDER_TYPE,ORDER_STATE,STOCK_STATE,BILLING_TYPE_ORDER,PAY_MODE,WHETHER,RECEIPT_STATE,VEHICLE_LENGTH,BIZ_TYPE'});
            this.orderTypeData = data.ORDER_TYPE;
            this.orderStateData = data.ORDER_STATE;
            for (let i = 0; i < data.STOCK_STATE.length; i++)
            {
                if (data.STOCK_STATE[i].codeValue == 98)
                {
                    data.STOCK_STATE.splice(i, 1);
                    i--;
                }
                if (data.STOCK_STATE[i].codeValue == 99)
                {
                    data.STOCK_STATE.splice(i, 1);
                    i--;
                }
            }
            this.stockStateData = data.STOCK_STATE;
            this.billingTypeData = data.BILLING_TYPE_ORDER;
            this.payModeData = data.PAY_MODE;
            this.whetherData = data.WHETHER;
            this.receiptStateData = data.RECEIPT_STATE;
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.bizTypeData = data.BIZ_TYPE;

            //客户下拉
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            this.regionData = await this.common.postUrl("regionOrgTF", "queryRegionSelect", {});
            this.orgIdData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            for (let i = 0; i < this.regionData.length; i++)
                if (this.regionData[i].id == 1){ this.regionData.splice(i, 1); }//移除已取消状态
        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery()
        {
            this.query = {
                tenantName: this.$route.query.tenantName,//客户详情订单管理跳转
                routeName: this.$route.query.routeName,
                orderNum: '',
                orderType: '',
                orderState: this.common.isBlank(this.$route.query.orderState) ? '' : this.$route.query.orderState.toString(),//客户详情待调度、运作中、已完成跳转
                createDate: this.common.isBlank(this.$route.query.currentDate) ? '' :[this.$route.query.currentDate,this.$route.query.currentDate],//客户详情待调度、运作中、已完成跳转
                finishDate: '',
                workDate: '',
                customerOrderDate: '',
                isEntryBill: '',
                isGenerateReport: '',
                waybillNum:'',
                regionId:'',
                planId:this.$route.query.planId,//订单计划ID，订单包跳转查询
                verifyState:'',
                custOrderNum:'',
                vehicleLength:'',
            };
            if(!this.common.isBlank(this.$route.query.startDate)){
                this.query.createDate=[this.$route.query.startDate,this.$route.query.endDate];
            }
            return this.query;
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {};
        },
        /**
         * 初始化库存
         * @returns {{orderCount: string, orderNum: string}}
         */
        initStock()
        {
            this.stock = {
                orderNum: '',
            };
            return this.stock;
        },
        /**
         * 初始化库存查询
         * @returns {{orderType: string, stockState: string, orderNum: string, stockRepertory: string}}
         */
        initStockQuery(orderId)
        {
            this.stockQuery = {
                stockRepertory: '',
                orderId: this.common.isBlank(orderId) ? '' : orderId,
                stockState: '',
            };
            return this.stockQuery;
        },
        /**
         * 初始化订单库存数据
         * @returns {[]|*[]}
         */
        initOrderStockData()
        {
            this.orderStockData = [];
            return this.orderStockData;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.uploadOpen=false;
            this.uploadOpen2=false;
            this.uploadOpen3=false;
            this.query = query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.common.isNotBlank(this.query.finishDate) && this.query.finishDate.length === 2){
                this.query.startFinishDate = this.query.finishDate[0];
                this.query.endFinishDate = this.query.finishDate[1];
            }else{
                this.query.startFinishDate = '';
                this.query.endFinishDate = '';
            }
            if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
                this.query.startWorkDate = this.query.workDate[0];
                this.query.endWorkDate = this.query.workDate[1];
            }else{
                this.query.startWorkDate = '';
                this.query.endWorkDate = '';
            }
            if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
                this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
                this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
            }else{
                this.query.startCustomerOrderDate = '';
                this.query.endCustomerOrderDate = '';
            }
            if (this.common.isNotBlank(this.$route.query.isFromSystemData))
            {
                this.query.isFromSystemData = this.$route.query.isFromSystemData;
                this.query.systemDataParam = this.$route.query.systemDataParam;
            }
            let {items} = await this.$refs.table.load("orderTF", "queryOrderInfoList", this.query);
            items.forEach((el)=>{
                if(el.orderState == enumData.orderState.CANCELLED){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        /**
         * 导出
         */
        exportDownload()
        {
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.common.isNotBlank(this.query.finishDate) && this.query.finishDate.length === 2){
                this.query.startFinishDate = this.query.finishDate[0];
                this.query.endFinishDate = this.query.finishDate[1];
            }else{
                this.query.startFinishDate = '';
                this.query.endFinishDate = '';
            }
            if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
                this.query.startWorkDate = this.query.workDate[0];
                this.query.endWorkDate = this.query.workDate[1];
            }else{
                this.query.startWorkDate = '';
                this.query.endWorkDate = '';
            }
            if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
                this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
                this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
            }else{
                this.query.startCustomerOrderDate = '';
                this.query.endCustomerOrderDate = '';
            }
            if (this.common.isBlank(this.query.startCreateDate)
                    && this.common.isBlank(this.query.startFinishDate)
                    && this.common.isBlank(this.query.startWorkDate)
                    && this.common.isBlank(this.query.startCustomerOrderDate))
            {
                this.$message.error("请输入一个不超过365天的创建时间或者完成时间或者要求运作时间或者客户下单时间再导出！");
                return false;
            }
            if (this.common.isNotBlank(this.query.startCreateDate))
            {
                let start = new Date(this.query.startCreateDate);
                let end = new Date(this.query.endCreateDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的创建开始时间:" + this.query.startCreateDate + " 和创建结束时间：" + this.query.endCreateDate + "相差不能超过365天！");
                    return false;
                }
            }
            if (this.common.isNotBlank(this.query.startFinishDate))
            {
                let start = new Date(this.query.startFinishDate);
                let end = new Date(this.query.endFinishDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的完成开始时间:" + this.query.startFinishDate + " 和完成结束时间：" + this.query.endFinishDate + "相差不能超过365天！");
                    return false;
                }
            }
            if (this.common.isNotBlank(this.query.startWorkDate))
            {
                let start = new Date(this.query.startWorkDate);
                let end = new Date(this.query.endWorkDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的要求运作开始时间:" + this.query.startWorkDate + " 和要求运作结束时间：" + this.query.endWorkDate + "相差不能超过365天！");
                    return false;
                }
            }
            if (this.common.isNotBlank(this.query.startCustomerOrderDate))
            {
                let start = new Date(this.query.startCustomerOrderDate);
                let end = new Date(this.query.endCustomerOrderDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的客户下单开始时间:" + this.query.startCustomerOrderDate + " 和客户下单结束时间：" + this.query.endCustomerOrderDate + "相差不能超过365天！");
                    return false;
                }
            }
            this.$refs.table.downloadExcelFile('订单列表');
        },
        /**
         * 查询订单库存
         * @returns {Promise<void>}
         */
        async queryOrderStock()
        {
            if (this.common.isNotBlank(this.stockQuery.orderId))
            {
                this.orderStockData = await this.common.postUrl("orderTF", "queryOrderStockData", this.stockQuery);
                this.$forceUpdate();
            }
        },
        /**
         * 修改订单
         * @returns {boolean}
         */
        toUpdateOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的订单！");
                return false;
            }
            if (selectData[0].orderState == enumData.orderState.CANCELLED)
            {
                this.$message.error("订单: " + selectData[0].orderNum + "已经取消，不允许修改！");
                return false;
            }
            if (selectData[0].entryBillFlag == 1) {
                this.$message.error("订单: " + selectData[0].orderNum + "已经进入账单，不允许修改！");
                return false;
            }
            
            let now = new Date();
            let customerOrderDate = new Date(selectData[0].customerOrderDate);
            let year = now.getFullYear();
            let month = now.getMonth();
            if(now.getDate() <= 12) {
                //如果是12号或者以前 不能选上上个月的
                let beginOfMonth = new Date(year, month - 1, 1);
                if(customerOrderDate.getTime() < beginOfMonth.getTime()){
                    this.$message.error("客户下单时间在上上个月或之前的不能修改！");
                    return false;
                }
            }else{
                //如果是12号以后  不能选上个月的
                let beginOfMonth = new Date(year, month, 1);
                if (customerOrderDate.getTime() < beginOfMonth.getTime())
                {
                    this.$message.error("12号以后，客户下单时间在上个月的不能修改！");
                    return false;
                }
            }
            
            this.$emit("openTab",{
                urlId: 'updateOrder' + selectData[0].orderId,
                query: {orderId: selectData[0].orderId,pId: 1001070,unShowCheck: 1,},
                urlName: "修改订单",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/updateOrder.vue"});
        },
        /**
         * 费用异动
         * @returns {boolean}
         */
        async toIncomeChange() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要费用异动的订单！");
                return false;
            }
            let order = selectData[0];
            if (order.orderState == 3) {
                this.$message.error("订单: " + order.orderNum + "已经取消，不允许费用异动！");
                return false;
            }
            if (order.verifyState == 1) {
                this.$message.error("订单: " + order.orderNum + "已审核，不允许费用异动！");
                return false;
            }
            if (order.payState >= 1) {
                this.$message.error("订单: " + order.orderNum + "是回程单并已登记收款，不允许费用异动！");
                return false;
            }
            if (order.entryBillFlag == 1) {
                this.$message.error("已经进入账单的订单无法修改费用，需要修改费用可以进行费用补录！");
                return false;
            }
            if (order.orderState == 2 || order.orderState == 4) {
                if (order.haveReceipt == 1) {
                    if (order.receiptState == 0 && order.generateReportFlag == 0)//有回单未进报表，回单没有确认不能异动
                    {
                        // this.$message.error("订单: " + order.orderNum + "有回单,需要回单确认或者是进入报表才能做费用异动！");
                        // return false;
                        //完成都走异动,完成订单不允许修改费用
                    }
                }
            } else {
                // this.$message.error("已完成/异常终止的订单才能做费用异动！");
                // return false;
            }
            await this.common.postUrl("commonTF", "checkDateLimit", {date:order.customerOrderDate});
            // if (order.generateReportFlag!=undefined&&order.generateReportFlag==1) {
            //     this.$message.error("订单: " + order.orderNum + "已经进入报表，不能异动！");
            //     return false;
            // }
            this.$emit("openTab", {
                urlId: 'incomeChange' + order.orderId,
                query: {orderId: order.orderId, unShowCheck: 1,},
                urlName: "费用异动",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/incomeChange.vue"
            });
        },
        /**
         * 订单库存开关
         *
         */
        changeSwitch(isOpen, data)
        {
            this.initOrderStockData();
            this.initStock();
            this.initStockQuery();
            if (isOpen)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length !== 1)//2020-11-20 14:54 产品执意要不需要选择订单就可以打开库存界面 界面信息展示空
                {
                    this.showSetTable = true;
                    this.$nextTick(() => {
                        this.$refs.table.initShow();
                        this.$refs.table.cancelSet();
                    })
                    this.seeRepertory = !isOpen;
                    this.$message.error("请选择一个订单再查看订单库存！");
                    return false;
                }
                else
                {
                    this.showSetTable = false;
                    this.$nextTick(() => {
                        this.$refs.table.initShow();
                    })
                }
                if(selectData.length >= 1)
                {
                    if (this.common.isBlank(data))//页面直接打开开关
                    {
                        if (this.selectData.length > 0){data = this.selectData[this.selectData.length - 1]; }
                    }
                    this.stock = data;
                    this.initStockQuery(data.orderId);
                    this.queryOrderStock();
                }
            }
            else
            {
                this.showSetTable = true;
                this.$nextTick(() => {
                    this.$refs.table.initShow();
                    this.$refs.table.cancelSet();
                })
            }
        },
        /**
         * 单击表格数据
         */
        clickItem(data)
        {
            if (data.isSelect)
            {
                this.selectData.push(data);
            }
            else
            {
                for (let i = 0; i < this.selectData.length; i++)
                {
                    if (this.selectData[i].orderId == data.orderId){ this.selectData.splice(i, 1); i--; }
                }
                data = this.selectData[this.selectData.length - 1];
            }
            let selectData = this.$refs.table.getSelectItem();
            if (this.seeRepertory)//已经打开库存页面
            {
                this.changeSwitch(this.seeRepertory, data);
            }
        },
        /**
         * 列表全选
         */
        selectAll(args)//全选
        {
            this.selectData = [];
            if (args.selectAll)
            {
               if (args.data.length > 0)
               {
                   for (let i = 0; i < args.data.length - 1; i++)//最后一个单选再加进去
                   {
                       this.selectData.push(args.data[i]);
                   }
                   this.clickItem(args.data[args.data.length - 1]);
               }
            }
            else
            {
                this.initStock();
                this.initOrderStockData();
            }
        },
        /**
         * 双击查看详情
         * @param data
         */
        dblclickItem(data)
        {
            this.openDetail(data);
        },
        /**
         * 订单详情
         */
        toOrderDetail()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要查看的订单！");
                return false;
            }
            this.openDetail(selectData[0]);
        },
        /**
         * 打开详情
         * @param data
         */
        openDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'orderDetail' + data.orderId,
                query: {orderId: data.orderId, pId: 1001070,unShowCheck: 1,},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        /**
         * 取消订单
         */
        toCancelOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
			{
				this.$message.error("请选择一个需要取消的订单！");
				return false;
			}
            for (let i = 0; i < selectData.length; i++)
            {
                if (selectData[i].orderState == enumData.orderState.CANCELLED)
                {
                    this.$message.error("订单: " + selectData[i].orderNum + "已经取消，请勿重复操作！");
                    return false;
                }
                if (selectData[i].orderState == enumData.orderState.FINISHED)
                {
                    this.$message.error("订单: " + selectData[i].orderNum + "已完成，不可取消！");
                    return false;
                }
                if (selectData[i].orderState == enumData.orderState.ABORT)
                {
                    this.$message.error("订单: " + selectData[i].orderNum + "异常中止，不可取消！");
                    return false;
                }
                if (selectData[i].entryBillFlag == 1) {
                    this.$message.error("订单: " + selectData[0].orderNum + "已经进入账单，不可取消！");
                    return false;
                }
            }
            
            let now = new Date();
            let customerOrderDate = new Date(selectData[0].customerOrderDate);
            let year = now.getFullYear();
            let month = now.getMonth();
            if(now.getDate() <= 12) {
                //如果是12号或者以前 不能选上上个月的
                let beginOfMonth = new Date(year, month - 1, 1);
                if(customerOrderDate.getTime() < beginOfMonth.getTime()){
                    this.$message.error("客户下单时间在上上个月或之前的不能取消！");
                    return false;
                }
            }else{
                //如果是12号以后  不能选上个月的
                let beginOfMonth = new Date(year, month, 1);
                if (customerOrderDate.getTime() < beginOfMonth.getTime())
                {
                    this.$message.error("12号以后，客户下单时间在上个月的不能取消！");
                    return false;
                }
            }
            
            let orderIds = [];
            let orderNums = '';
            selectData.forEach(item => {
                if (this.common.isNotBlank(item.orderId)){
                    orderIds.push(item.orderId);
                    orderNums += item.orderNum + ",";
                }
            });
            orderNums = orderNums.substring(0,orderNums.length-1)
            let that = this;
            this.$confirm("确认需要取消订单？", "提示").then(() =>{
                this.common.postUrl("orderTF", "cancelOrder", {orderIds: orderIds,orderNums}, function (data)
                {
                    that.doQuery();
                    that.$message.success("取消成功！");
                });
            }).catch(() =>{});
        },
        /**
         * 复制下单
         */
        toCopyNewOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的订单！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'copyOrder' + selectData[0].orderId,
                query: {orderId: selectData[0].orderId,unShowCheck: 1,},
                urlName: "复制订单",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/copyOrder.vue"});
        },
        /**
         * 新增订单
         */
        toAddOrder()
        {
            this.$emit("openTab",{
                urlId: '34',
                query: {},
                urlName: "新增订单",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/addOrder.vue"});
        },
        /*********************  回单  *******************/
        initReceipts()
        {
            this.receipts = {
                waybillId: '',
                dispatchId: '',
                waybillNum: '',
                orderId: '',
                orderNum: '',
                tenantName: '',
                waybillWorkId: '',
                workAddressStr: '',
                receiptsType: '1',
            };
            return this.receipts;
        },
        /**
         * 上传单据
         */
        async openReceipts()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要上传单据的订单！");
                return false;
            }
            let data = selectData[0];
            if (data.orderState == enumData.orderState.PREP_DISPATCH)
            {
                this.$message.error("待调度的订单无法上传单据！");
                return false;
            }
            if (data.orderState == enumData.orderState.CANCELLED)
            {
                this.$message.error("已取消的订单无法上传单据！");
                return false;
            }
            this.receipts = this.common.copyObj(data);
            this.receipts.receiptsType = '1';//默认回单
            this.waybillData = await this.common.postUrl("ordWaybillTF", "getWaybillDataByOrderId", {orderId: this.receipts.orderId});
            if (this.waybillData.length === 1)
            {
                this.receipts.waybillId = this.waybillData[0].waybillId;
                this.receipts.dispatchId = this.waybillData[0].dispatchId;
                this.receipts.waybillNum = this.waybillData[0].waybillNum;
                this.waybillWorkData = await this.loadWaybillWorkInfoByWaybillId(this.receipts.waybillId);
                if (this.waybillWorkData.length === 1)
                {
                    this.receipts.waybillWorkId = this.waybillWorkData[0].waybillWorkId;
                    this.receipts.workAddressStr = this.waybillWorkData[0].workAddressStr;
                }
            }
            else
                this.waybillWorkData = [];
            this.changeReceiptsShow(true);
            this.list=[{}];
        },
        /**
         * 加载运单作业点
         * @param waybillId
         * @returns {Promise<void>}
         */
        async loadWaybillWorkInfoByWaybillId(waybillId)
        {
            return await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: waybillId});
        },
        /**
         * 改变展示弹窗
         */
        changeReceiptsShow(flag)
        {
            this.showReceipts = flag;
            if (flag)
            {
                this.$nextTick(() =>
                {
                    if (this.common.isNotBlank(this.receipts.imgId))
                        this.$refs.receiptsImg.initDate(this.receipts.imgId);
                });
            }
            else
                this.$refs.receiptsImg.clean();
        },
        /**
         * 改变运单号
         */
        async changeWaybill(waybillId)
        {
            this.receipts.dispatchId = '';
            this.receipts.waybillWorkId = '';
            this.receipts.workAddressStr = '';
            if (this.common.isNotBlank(this.receipts.waybillId))
            {
                this.waybillData.forEach(item => {
                    if (item.waybillId == waybillId){ this.receipts.dispatchId = item.dispatchId; }
                });
                this.waybillWorkData = await this.loadWaybillWorkInfoByWaybillId(this.receipts.waybillId);
                if (this.waybillWorkData.length === 1)
                {
                    this.receipts.waybillWorkId = this.waybillWorkData[0].waybillWorkId;
                    this.receipts.workAddressStr = this.waybillWorkData[0].workAddressStr;
                }
            }
        },
        /**
         * 运单作业点改变
         */
        changeWaybillWork(waybillWorkId)
        {
            this.receipts.workAddressStr = '';
            if (this.common.isNotBlank(this.waybillWorkData) && this.waybillWorkData.length > 0)
            {
                this.waybillWorkData.forEach(item => {
                    if (item.waybillWorkId == waybillWorkId){ this.receipts.workAddressStr = item.workAddressStr; }
                });
            }
        },
        // /**
        //  * 回调获取图片的信息
        //  * @param imgData
        //  */
        // setImgData(imgData)
        // {
        //     this.receipts.imgId = imgData.flowId;
        //     this.receipts.fileName = imgData.fileName;
        //     this.receipts.imgPath = imgData.storePath;
        // },
        changeUpdate()
        {
            this.$forceUpdate();
        },
        /**
         * 新增单据
         */
        addReceipts()
        {
            if (this.common.isBlank(this.receipts.waybillId))
            {
                this.$message.error("请选择派车单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.orderId))
            {
                this.$message.error("请选择订单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.waybillWorkId))
            {
                this.$message.error("请选择作业点再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.receiptsType))
            {
                this.$message.error("请选择单据类型再提交！");
                return false;
            }
            // this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
            // this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
            // if (this.common.isBlank(this.receipts.imgId))
            // {
            //     this.$message.error("请上传图片信息再提交！");
            //     return false;
            // }
            // if (this.common.isBlank(this.receipts.imgPath))
            // {
            //     this.$message.error("请上传图片信息再提交！");
            //     return false;
            // }
            let list = this.common.copyObj(this.list);
            this.receipts.receiptsList=[];
            for (let i = 0; i < list.length; i++) {
                if(list[i].imgId){
                    this.receipts.receiptsList.push(list[i]);
                }
            }
            if (this.receipts.receiptsList.length==0)
            {
                this.$message.error("请上传图片信息再提交！");
                return false;
            }
            let that = this;
            that.common.postUrl("receiptsTF", "addReceipts", this.receipts, function (data)
            {
                that.doQuery();
                that.changeReceiptsShow(false);
                that.$message.success("单据上传成功");
            },null, null,true);
        },

        /**
         * 打印托运单
         */
        toOrderPrint()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要打印的订单！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'orderPrint' + selectData[0].orderId,
                query: {orderId: selectData[0].orderId},
                urlName: "打印托运单",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderPrint.vue"});
        },
        verifyOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <=0 )
            {
                this.$message.error("请至少选择一条需要审核的订单！");
                return false;
            }
            let orderIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].orderState != enumData.orderState.FINISHED)
                {
                    this.$message.error("只能选择已完成的订单！");
                    return false;
                }
                // if (selectData[i].verifyState == 1) {
                //     this.$message.error("只能选择未审核的订单！");
                //     return false;
                // }
                orderIds.push(selectData[i].orderId);
            }
            let that = this;
            that.$confirm('您正在操作取消已完成订单操作,是否确认取消？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                that.common.postUrl("orderTF", "verifyOrder", {orderIds}, function (data){
                    that.doQuery();
                    that.$message.success("审核成功");
                },null, null,true);
            }).catch(() => {
                // 取消
            });
        },
        recycleWaybill(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !==1 )
            {
                this.$message.error("请选择一个订单！");
                return false;
            }
            if(selectData[0].orderType != enumData.orderType.vehicleTwoWay){
                this.$message.error("订单类型必须是整车-双程！");
                return false;
            }
            this.$confirm('您正在操作回收派车操作,是否确认？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let that = this;
                let dispatchType = enumData.dispatchType.shareDispatch;
                let item = {
                    urlName: '回收派车',
                    urlId: 'dispatch'+dispatchType,
                    urlPathName: "/dispatch"+dispatchType,
                    urlPath: "/pt/ord/dispatch/dispatch.vue",
                    query: {dispatchType,recycleWaybill:1,orderId:selectData[0].orderId},
                }
                this.$emit('openTab', item);
            },null, null,true).catch(() => {});

        },

        /**
         * 上传图片回调
         * @param flag
         */
        fileCallback(imgData){
            imgData.imgId = imgData.flowId;
            imgData.imgPath = imgData.storePath;
            if (this.list.length <= 5)
                this.list[imgData.componentId] = imgData;
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
            if(this.list.length  < 5 && flag){
                this.list.push({});
            }
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.list.length; i++)
                this.list[i].componentId = i;
            this.$forceUpdate();
        },
        delCallback(index){
            this.list.splice(index,1);
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
            if(this.list.length === 4 && flag){
                this.list.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        imgDisplay(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.list.length; i++) {
                    if (that.list[i].imgId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.list[i].imgId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
    },
    computed:{
        formData(){
            return [
                {"name":"客户","model":"tenantIds","type":"select","options":this.customerData,"label":"name","value":"tenantId","placeholder":"客户","method":"doQuery","isshow":true,"filterable":true,"multiple":true},
                // {"name":"客户","model":"tenantName","type":"input","placeholder":"客户","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
                {"name":"订单号","model":"orderNums","type":"textarea","placeholder":"订单号","isshow":true},
                {"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
                {"name":"订单类型","model":"orderType","type":"select","options":this.orderTypeData,"label":"codeName","value":"codeValue","placeholder":"订单类型","method":"doQuery","isshow":true},
                {"name":"是否入账","model":"isEntryBill","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
                {"name":"是否生成报表","model":"isGenerateReport","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
                {"name":"订单状态","model":"orderStates","type":"select","options":this.orderStateData,"label":"codeName","multiple":true,"value":"codeValue","placeholder":"订单状态","method":"doQuery","isshow":true},
                {"name":"下单区域","model":"regionId","type":"select","options":this.regionData,"label":"regionName","value":"id","placeholder":"下单区域","method":"doQuery","isshow":true},
                {"name":"下单部门","model":"orgIds","type":"select","options":this.orgIdData,"label":"orgName","value":"id", "multiple":true,"placeholder":"下单部门","method":"doQuery","isshow":true},

                {"name":"系统录单时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
                {"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
                {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
                {"name":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"回单状态","model":"receiptState","type":"select","options":this.receiptStateData,"label":"codeName","value":"codeValue","placeholder":"回单状态","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"业务类型","model":"bizType","type":"select","options":this.bizTypeData,"label":"codeName","value":"codeValue","placeholder":"业务类型","method":"doQuery","isshow":true},
                {"name":"客户单号","model":"custOrderNum","type":"textarea","placeholder":"客户单号","isshow":true},
                {"name":"供应商","model":"supplierTenantName","type":"input","placeholder":"供应商","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"车辆所有人","model":"vehicleOwner","type":"input","placeholder":"车辆所有人","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"是否回程单","model":"isReturnTrip","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否回程单","method":"doQuery","isshow":true},

            ]
        }
    },
}
