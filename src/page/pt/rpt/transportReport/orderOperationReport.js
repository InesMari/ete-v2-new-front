import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'orderOperationReport',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "350", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "要求到达时间", "code": "workDate", "width": "120", "type": "text"},
                {"name": "完成时间", "code": "finishDate", "width": "130", "type": "text"},
                {"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "100", "type": "text"},
                {"name": "结算方式", "code": "payModeName", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "100", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
                {"name": "下单货物件数", "code": "goodsCountSum", "width": "100", "type": "text"},
                {"name": "下单货物重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text"},
                {"name": "下单货物体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text"},
                {"name": "货物净重/kg", "code": "netWeight", "width": "80", "type": "text"},
                {"name": "货物毛重/kg", "code": "grossWeight", "width": "80", "type": "text"},
                {"name": "货物体积/m³", "code": "volume", "width": "80", "type": "text"},
                {"name": "计费单价/件", "code": "freightPrice", "width": "80", "type": "text"},
                {"name": "中途点数", "code": "midwayPointCount", "width": "80", "type": "text"},
                {"name": "点位费", "code": "pointFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "点位费合计", "code": "totalPointFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "运费", "code": "freight", "width": "80", "type": "text","currencyFlag":true},
                {"name": "保险费", "code": "premiumFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "提货费", "code": "pickupFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "送货费", "code": "deliveryFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "装货费", "code": "loadingFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "卸货费", "code": "dischargeFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "其他费", "code": "otherFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text","currencyFlag":true},
                {"name": "订单收入合计", "code": "income", "width": "80", "type": "text","currencyFlag":true},
                {"name": "订单成本合计", "code": "cost", "width": "80", "type": "text","currencyFlag":true},
                {"name": "毛利额", "code": "grossProfit", "width": "80", "type": "text","currencyFlag":true},
                {"name": "毛利率", "code": "grossProfitRate", "width": "80", "type": "text"},
                {"name": "下单人员", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"}
            ],
            query: this.initQuery(),
            orderTypeData: [],//订单类型
            orderStateData: [],//订单状态
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
            symbolOptions: enumData.compareText,
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
        searchList
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        init()
        {
            let that = this;
            //订单类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_TYPE"}, function (data)
            {
                that.orderTypeData = data;
            });
            //订单状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_STATE"}, function (data)
            {
                that.orderStateData = data;
            });
        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery()
        {
            this.query = {
                tenantName: '',
                routeName: '',
                orderNum: '',
                orderType: '',
                orderState: '',
                createDate: '',
                workDate: '',
                finishDate: '',
                grossProfit: '',
                grossProfitRate: '',
                supplierName: '',
                grossProfitSymbol: '=',
                grossProfitRateSymbol: '=',

            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query=query;
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
            let {items} = await this.$refs.table.load("transportReportTF", "loadOrderOperationReportPage", this.query);
            items.forEach((el)=>{
                if(el.orderState == 3){
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
            // if (this.common.isBlank(this.query.startCreateDate)
            //         && this.common.isBlank(this.query.startFinishDate)
            //         && this.common.isBlank(this.query.startWorkDate)
            //         && this.common.isBlank(this.query.startCustomerOrderDate))
            // {
            //     this.$message.error("请输入一个不超过90天的创建时间/完成时间/要求运作时间/客户下单时间再导出！");
            //     return false;
            // }
            // if (this.common.isNotBlank(this.query.startCreateDate))
            // {
            //     let start = new Date(this.query.startCreateDate);
            //     let end = new Date(this.query.endCreateDate);
            //     start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
            //     if (start.getTime() < end.getTime())
            //     {
            //         this.$message.error("导出的创建开始时间:" + this.query.startCreateDate + " 和创建结束时间：" + this.query.endCreateDate + "相差不能超过90天！");
            //         return false;
            //     }
            // }
            // if (this.common.isNotBlank(this.query.startFinishDate))
            // {
            //     let start = new Date(this.query.startFinishDate);
            //     let end = new Date(this.query.endFinishDate);
            //     start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
            //     if (start.getTime() < end.getTime())
            //     {
            //         this.$message.error("导出的完成开始时间:" + this.query.startFinishDate + " 和完成结束时间：" + this.query.endFinishDate + "相差不能超过90天！");
            //         return false;
            //     }
            // }
            // if (this.common.isNotBlank(this.query.startWorkDate))
            // {
            //     let start = new Date(this.query.startWorkDate);
            //     let end = new Date(this.query.endWorkDate);
            //     start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
            //     if (start.getTime() < end.getTime())
            //     {
            //         this.$message.error("导出的要求运作开始时间:" + this.query.startWorkDate + " 和要求运作结束时间：" + this.query.endWorkDate + "相差不能超过90天！");
            //         return false;
            //     }
            // }
            // if (this.common.isNotBlank(this.query.startCustomerOrderDate))
            // {
            //     let start = new Date(this.query.startCustomerOrderDate);
            //     let end = new Date(this.query.endCustomerOrderDate);
            //     start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
            //     if (start.getTime() < end.getTime())
            //     {
            //         this.$message.error("导出的客户下单开始时间:" + this.query.startCustomerOrderDate + " 和客户下单结束时间：" + this.query.endCustomerOrderDate + "相差不能超过90天！");
            //         return false;
            //     }
            // }
            this.$refs.table.downloadExcelFile('订单运作报表列表');
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
                query: {orderId: data.orderId,pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"客户","placeholder":"客户","model":"tenantName","type":"input","isshow":true},
                {"name":"线路名称","placeholder":"线路名称","model":"routeName","type":"input","isshow":true},
                {"name":"订单号","placeholder":"订单号","model":"orderNum","type":"input","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"毛利额","model":"grossProfitSymbolItem","isshow":true,
                    children:[
                        {"model":"grossProfitSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true,"method":"doQuery"},
                        {"model":"grossProfit"}]
                },
                {"name":"毛利率","model":"grossProfitRateSymbolItem","isshow":true,
                    children:[
                        {"model":"grossProfitRateSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true,"method":"doQuery"},
                        {"model":"grossProfitRate"}]
                },
                {"name":"订单类型","model":"orderType","type":"select","options":this.orderTypeData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"订单状态","model":"orderState","type":"select","options":this.orderStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
                {"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
                {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
            ]
        }
    },
}
