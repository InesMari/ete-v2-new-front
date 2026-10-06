import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'feeChangeManage',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "80", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "80", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "160", "type": "diy"},
                {"name": "出车时间", "code": "startCarDate", "width": "150", "type": "text"},
                {"name": "收车时间", "code": "endCarDate", "width": "150", "type": "text"},
                {"name": "下单成本合计", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "已异动成本合计", "code": "statementFee", "width": "100", "type": "text"},
                {"name": "本次成本异动", "code": "applyFee", "width": "100", "type": "text"},
                {"name": "派车单费用合计", "code": "amount", "width": "100", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "80", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "80", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "140", "type": "text"},
                // {"name": "调度件数/件", "code": "dispatchGoodsCount", "width": "80", "type": "text"},
                // {"name": "调度重量/kg", "code": "dispatchGoodsWeight", "width": "80", "type": "text"},
                // {"name": "调度体积/m³", "code": "dispatchGoodsVolume", "width": "80", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "100", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "100", "type": "text"},
                {"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text"},
                {"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text"},
                {"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text"},
                {"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "140", "type": "text"},
            ],
            loadParam: {
                verifyState:this.$route.query.verifyState,tenantName: this.$route.query.supplierName
            },
            verifyStateOptions:[],
            feeChangeShow:false,
            waybillInfo:{},
            feeInfo:{},
            totalInfo: {
                goodsCount: 0,
                goodsWeight: 0,
                goodsVolume: 0,
                totalPointFee: 0,
                freight: 0,
                premiumFee: 0,
                pickupFee: 0,
                deliveryFee: 0,
                loadingFee: 0,
                dischargeFee: 0,
                emptyDrivingFee: 0,
                standbyFee: 0,
                otherFee: 0,
                totalFee: 0,
            },
            orderStockStatementList:[],
            statementList:[],
            type:0
        }
    },

    computed:{
        formData(){
            return [
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","isshow":true},
                {"name":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query = this.loadParam) {
            this.loadParam = query;
            this.$refs.table.load("ordWaybillTF", "queryOrdWaybillFeeCostApply", this.loadParam);
        },
        delOrdWaybillFeeCostApply(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要取消的成本费用异动申请单！");
                return false;
            }
            if (selectData[0].verifyState == 1)
            {
                this.$message.error("申请单已经审核通过，不能撤销！");
                return false;
            }
            let that = this;
            this.$confirm("确认是否需要撤销申请？", "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "delOrdWaybillFeeCostApply", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("取消成功！");
                },null,'',true);
            });
        },
        verifyOrdWaybillFeeCostApply(verifyState){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要审核的成本费用异动申请单！");
                return false;
            }
            if (selectData[0].verifyState == 1)
            {
                this.$message.error("申请单已经审核通过，不能再次操作！");
                return false;
            }
            let that = this;
            let msg = '';
            if(verifyState==1){
                msg='确认审核通过后不可回退，该笔费用会被计入下个月报表，是否确认？';
            }else{
                msg='确认审核不通过后不可回退，是否确认？';
            }
            let param = this.common.copyObj(selectData[0]);
            param.verifyState = verifyState;
            this.$confirm(msg, "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "verifyOrdWaybillFeeCostApply", param, function (data)
                {
                    that.doQuery();
                    that.$message.success("审核成功！");
                    that.$parent.loadTodoData();
                },null,'',true);
            });
        },

        toFeeChange(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个成本费用异动申请单！");
                return false;
            }
            if(selectData[0].verifyState == 1){
                this.$message.error("不能修改已经审核费用异动申请单！");
                return false;
            }
            this.type=1;// 1 修改  2 查看
            this.toViewFeeChange(selectData[0])
        },
        toViewFeeChangeDbClick(data){
            this.type=2;
            this.toViewFeeChange(data);
        },
        toViewFeeChange(data){
            let that = this;
            that.common.postUrl("ordWaybillTF", "getOrdWaybillFeeCostApplyDetail", data, function (data) {
                that.waybillInfo = data.waybillInfo;
                that.orderStockStatementList = data.ordOrderFeeCostShareApplyList;
                that.statementList = data.statementList;
                that.feeInfo = data.ordWaybillFeeCostApply;
                that.calculateStatementTotalGoods();
                that.calculateStatementTotalFee();
                if(that.waybillInfo.isTransit==1){
                    that.feeInfo.transitPickupFee = that.feeInfo.pickupFee;
                    that.feeInfo.transitDeliveryFee = that.feeInfo.deliveryFee;
                    that.feeInfo.totalTransitFee = that.feeInfo.totalFee;
                }
                that.feeChangeShow = true;
            },null,'',true);
        },
        closeFeeChangeDialog(){
            this.feeChangeShow = false;
        },

        /**
         * 订单详情
         */
        toOrderDetail(orderId)
        {
            this.closeFeeChangeDialog();
            this.$emit("openTab",{
                urlId: 'orderDetail' + orderId,
                query: {orderId: orderId,pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        changeFee(col){
            let shareCol = col;
            let freightPrice = this.feeInfo.freightPrice;
            if(this.waybillInfo.billingType==enumData.billingTypeOrder.byGrossweight&&(col=='grossWeight'||col=='freightPrice')){
                let grossWeight = this.common.accAdd(this.waybillInfo.grossWeight,this.feeInfo.grossWeight);
                let freight=this.common.accMul(grossWeight,freightPrice);
                this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
                shareCol = 'freight';
            }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byNetweight&&(col=='netWeight'||col=='freightPrice')){
                let netWeight = this.common.accAdd(this.waybillInfo.netWeight,this.feeInfo.netWeight);
                let freight=this.common.accMul(netWeight,freightPrice);
                this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
                shareCol = 'freight';
            }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byVolume&&(col=='volume'||col=='freightPrice')){
                this.waybillInfo.freight=this.common.accMul(this.waybillInfo.volume,this.waybillInfo.freightPrice);
                let volume = this.common.accAdd(this.waybillInfo.volume,this.feeInfo.volume);
                let freight=this.common.accMul(volume,freightPrice);
                this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
                shareCol = 'freight';
            }else if(col=='pointFee'){
                let pointFee = this.common.accAdd(this.waybillInfo.pointFee,this.feeInfo.pointFee);
                let totalPointFee=this.common.accMul(this.waybillInfo.midwayPointNum,pointFee);
                this.feeInfo.totalPointFee=this.common.accSub(totalPointFee,this.waybillInfo.totalPointFee);
                shareCol = 'totalPointFee';
            }
            this.calculateTotalFee();
            this.shareFee(shareCol,this.feeInfo[shareCol]);
        },
        //分摊金额  按照金额比重
        shareFee(col,value){
            let remainValue = value;
            //提货中转运费对应到提货费
            if(this.waybillInfo.dispatchType==enumData.dispatchType.pickTransitDispatch&&
                col=='freight'){
                col = 'pickupFee';
            }
            //如果只有一条数据的情况
            if(this.orderStockStatementList.length==1){
                this.orderStockStatementList[0][col]=value;
                this.calculateStatementTotalFee();
                this.$forceUpdate();
                return;
            }
            if(this.totalInfo.goodsWeight<=0){
                return;
            }
            for (let i = 0; i < this.orderStockStatementList.length; i++) {
                let item = this.orderStockStatementList[i];
                if(i!=this.orderStockStatementList.length-1){
                    let accMul = this.common.accMul(value,item.goodsWeight);
                    let realValue = this.common.accDiv(accMul,this.totalInfo.goodsWeight);
                    realValue = Math.round(realValue*100)/100;
                    this.orderStockStatementList[i][col]=realValue;
                    remainValue = this.common.accSub(remainValue,realValue);
                }else{
                    this.orderStockStatementList[i][col]=remainValue;
                }
            }
            this.calculateStatementTotalFee();
            this.$forceUpdate();
        },
        //计算货物合计
        calculateStatementTotalGoods(){
            this.totalInfo.goodsCount=0;
            this.totalInfo.goodsWeight=0;
            this.totalInfo.goodsVolume=0;
            for (let i = 0; i < this.orderStockStatementList.length; i++) {
                let item = this.orderStockStatementList[i];
                this.totalInfo.goodsCount = this.common.accAdd(this.totalInfo.goodsCount,item.goodsCount);
                this.totalInfo.goodsWeight = this.common.accAdd(this.totalInfo.goodsWeight,item.goodsWeight);
                this.totalInfo.goodsVolume = this.common.accAdd(this.totalInfo.goodsVolume,item.goodsVolume);
            }
            this.$forceUpdate();
        },
        //计算费用
        calculateStatementTotalFee(){
            this.totalInfo.totalPointFee=0;
            this.totalInfo.freight=0;
            this.totalInfo.premiumFee=0;
            this.totalInfo.pickupFee=0;
            this.totalInfo.deliveryFee=0;
            this.totalInfo.loadingFee=0;
            this.totalInfo.dischargeFee=0;
            this.totalInfo.emptyDrivingFee=0;
            this.totalInfo.standbyFee=0;
            this.totalInfo.otherFee=0;
            this.totalInfo.totalFee=0;

            for (let i = 0; i < this.orderStockStatementList.length; i++) {
                let item = this.orderStockStatementList[i];
                item.totalFee = 0;
                item.totalFee = this.common.accAdd(item.totalFee,item.totalPointFee);
                this.totalInfo.totalPointFee = this.common.accAdd(this.totalInfo.totalPointFee,item.totalPointFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.freight);
                this.totalInfo.freight = this.common.accAdd(this.totalInfo.freight,item.freight);

                item.totalFee = this.common.accAdd(item.totalFee,item.premiumFee);
                this.totalInfo.premiumFee = this.common.accAdd(this.totalInfo.premiumFee,item.premiumFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.pickupFee);
                this.totalInfo.pickupFee = this.common.accAdd(this.totalInfo.pickupFee,item.pickupFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.deliveryFee);
                this.totalInfo.deliveryFee = this.common.accAdd(this.totalInfo.deliveryFee,item.deliveryFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.loadingFee);
                this.totalInfo.loadingFee = this.common.accAdd(this.totalInfo.loadingFee,item.loadingFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.dischargeFee);
                this.totalInfo.dischargeFee = this.common.accAdd(this.totalInfo.dischargeFee,item.dischargeFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.emptyDrivingFee);
                this.totalInfo.emptyDrivingFee = this.common.accAdd(this.totalInfo.emptyDrivingFee,item.emptyDrivingFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.standbyFee);
                this.totalInfo.standbyFee = this.common.accAdd(this.totalInfo.standbyFee,item.standbyFee);

                item.totalFee = this.common.accAdd(item.totalFee,item.otherFee);
                this.totalInfo.otherFee = this.common.accAdd(this.totalInfo.otherFee,item.otherFee);

                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,item.totalFee);
            }
            this.$forceUpdate();
        },
        //计算总金额
        calculateTotalFee(){
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.freight,this.feeInfo.totalPointFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.premiumFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.loadingFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.dischargeFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.emptyDrivingFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.standbyFee);
            this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.otherFee);
            this.$forceUpdate();
        },
        calculateTotalTransitFee(){
            this.feeInfo.totalTransitFee = this.common.accAdd(this.feeInfo.transitFee,this.feeInfo.transitPickupFee);
            this.feeInfo.totalTransitFee = this.common.accAdd(this.feeInfo.totalTransitFee,this.feeInfo.transitDeliveryFee);
            this.feeInfo.totalTransitFee = this.common.accAdd(this.feeInfo.totalTransitFee,this.feeInfo.transitOtherFee);
            this.$forceUpdate();
        },
        sureChange(){
            this.feeInfo.waybillId = this.waybillInfo.waybillId;
            this.feeInfo.waybillNum = this.waybillInfo.waybillNum;
            let param = {
                feeInfo:this.feeInfo,
                orderStockStatementList:this.orderStockStatementList
            }
            let that = this;
            this.common.postUrl("ordWaybillTF", "updateOrdWaybillFeeCostApply", param,function (data){
                if(data){
                    that.$message.success("费用异动修改成功");
                    that.feeChangeShow = false;
                    that.doQuery();
                }
            },null,'',true);
        },
        init() {
            this.initStaticData();
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'VERIFY_STATE'},function (data) {
                that.verifyStateOptions = data;
            });

        },
        clear() {
            this.loadParam = {};
        },
        /**
         * 打开详情
         * @param data
         * @param isCallParent 是否调用父组件调用
         */
        toWaybillDetail(data)
        {
            if (data.isTransit == 1)
            {
                this.$emit('openTab', {
                    urlName: '查看中转',
                    urlId: 'transitManage' + data.waybillId,
                    urlPathName: "/order",
                    urlPath: "/pt/ord/transit/transitDetailMain",
                    query:{t:3,waybillNum: data.waybillNum, tansitWaybillId: data.waybillId},
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + data.waybillId,
                    query: {waybillId: data.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
    },
}
