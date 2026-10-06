import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'orderReturnManage',
    data()
    {
        return {
            head: [
                {"name": "回程单号", "code": "orderReturnNum", "width": "180", "type": "text"},
                {"name": "回程单状态", "code": "orderStateName", "width": "150", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "diy"},
                {"name": "订单下单人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "180", "type": "diy"},
                {"name": "车牌号码", "code": "plateNumbers", "width": "160", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "装货点", "code": "beginWorkName", "width": "250", "type": "text"},
                {"name": "卸货点", "code": "endWorkName", "width": "250", "type": "text"},
                {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
                {"name": "装货日期", "code": "loadingTime", "width": "150", "type": "text"},
                {"name": "客户下单日期", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "是否回单", "code": "haveReceiptName", "width": "90", "type": "text"},
                {"name": "货物名称", "code": "goodsName", "width": "150", "type": "text"},
                {"name": "货物重量(吨)", "code": "goodsWeight", "width": "120", "type": "text"},
                {"name": "货物体积(立方)", "code": "goodsVolume", "width": "120", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "90", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
                {"name": "货主出价(元)", "code": "freight", "width": "100", "type": "text",isSum:true},
                {"name": "实际金额(元)", "code": "totalFee", "width": "100", "type": "text",isSum:true},
                {"name": "已收金额(元)", "code": "receiveFee", "width": "100", "type": "text",isSum:true},
                {"name": "未收金额(元)", "code": "noReceiveFee", "width": "100", "type": "text",isSum:true},
                {"name": "最后收款金额(元)", "code": "lastReceiveFee", "width": "100", "type": "text",isSum:true},
                {"name": "最后收款日期", "code": "lastReceiveDate", "width": "150", "type": "text"},
                {"name": "最后收款备注", "code": "lastReceiveFeeRemark", "width": "150", "type": "text"},
                {"name": "收款状态", "code": "payStateName", "width": "100", "type": "text",isSum:true},
            ],

            //收款记录的标题
            receiveRecordHead: [
                {"name": "回程单号", "code": "orderReturnNum", "width": "180", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "订单下单人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "180", "type": "text"},
                {"name": "车牌号码", "code": "plateNumbers", "width": "160", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "装货点", "code": "beginWorkName", "width": "250", "type": "text"},
                {"name": "卸货点", "code": "endWorkName", "width": "250", "type": "text"},
                {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
                {"name": "装货日期", "code": "loadingTime", "width": "150", "type": "text"},
                {"name": "客户下单日期", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "90", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "收款金额(元)", "code": "receiveFee", "width": "100", "type": "text",isSum:true},
                {"name": "收款日期", "code": "receiveDate", "width": "150", "type": "text"},
                {"name": "收款备注", "code": "receiveFeeRemark", "width": "150", "type": "text"},
                {"name": "操作", "code": "receivedOp", "width": "80", "type": "diy"},
            ],
            query: this.initQuery(),
            orderStateData: [],//订单状态
            bizTypeData: [],//业务类型
            payStateData:[],

            receiveShow:false,
            info:{
                ids:[],
                remark:'',
                receiveFee:'',
                receiveDate:'',
                confirmRemark:'',
            },
            receiveRecord: false,//是否展示收款记录
            bill: {},//账单数据
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
        async init()
        {
            let orderStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"ORDER_STATE"});
            this.payStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"RECEIVE_STATE"});
            let bizTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BIZ_TYPE"});
            for (let i = 0; i < orderStateData.length; i++)
            {
                let item = orderStateData[i];
                if (item.codeValue == 0)
                {
                    item.codeName = "已接单";
                    continue;
                }
                // if (!(item.codeValue == 10 || item.codeValue == 11))
                // {
                //     orderStateData.splice(i, 1);
                //     i--;
                // }
            }
            this.orderStateData = orderStateData;
            for (let i = 0; i < bizTypeData.length; i++)
            {
                let item = bizTypeData[i];
                if (!(item.codeValue == 1 || item.codeValue == 2))
                {
                    bizTypeData.splice(i, 1);
                    i--;
                }
            }
            this.bizTypeData = bizTypeData;
            this.$forceUpdate();
        },
        initQuery()
        {
            this.query = {
                orderReturnNum: '',
                orderState: [],
                bizType: '',
                customerOrderDate: '',
                confirmDate:'',
                payState:'',
            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
                this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
                this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
            }else{
                this.query.startCustomerOrderDate = '';
                this.query.endCustomerOrderDate = '';
            }
            if(this.common.isNotBlank(this.query.confirmDate) && this.query.confirmDate.length === 2){
                this.query.startConfirmDate = this.query.confirmDate[0];
                this.query.endConfirmDate = this.query.confirmDate[1];
            }else{
                this.query.startConfirmDate = '';
                this.query.endConfirmDate = '';
            }
            let {items} = await this.$refs.table.load("orderService", "queryOrderInfoListForReceive", this.query);
            items.forEach((el)=>{

            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        /**
         * 双击查看详情
         * @param data
         */
        dblclickItem(data)
        {
            this.openDetail(data, 0);
        },
        toOrderDetail(type)
        {
            let tip = "接单";
            if (type == 2)
            {
                tip = "拒单";
            }
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要" + tip + "的回程单！");
                return false;
            }
            if (type == 1)
            {
                if (selectData[0].receiveUserId > 0)
                {
                    this.$message.error("已经接单，无需继续接单！");
                    return false;
                }
                if (selectData[0].refuseUserId > 0)
                {
                    this.$message.error("已经拒单，无需重复操作！");
                    return false;
                }
            }
            if (type == 2)
            {
                if (selectData[0].refuseUserId > 0)
                {
                    this.$message.error("已经拒单，无需继续拒单！");
                    return false;
                }
                if (selectData[0].receiveUserId > 0)
                {
                    this.$message.error("已经接单，无需重复操作！");
                    return false;
                }
            }
            this.openDetail(selectData[0], type);
        },
        openDetail(data, type)
        {
            this.$emit("openTab",{
                urlId: 'orderInfo' + data.orderId,
                query: {orderId: data.orderId, type,
                    logId: data.id,
                    logType: enumData.LOG_TYPE.ORDER_EXT,
                },
                urlName: type == 1 ? "接单订单详情" : "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderInfoMain.vue"});
        },
        /**
         * 派车单详情/中转详情
         */
        toDetail(item, code,index)
        {
            if (code == 'waybillNum')
            {
                let waybillId = item.waybillIdArray[index];
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + waybillId,
                    query: {waybillId: waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
            else if (code == 'orderNum')
            {
                this.$emit("openTab",{
                    urlId: 'orderDetail' + item.orderId,
                    query: {orderId: item.orderId},
                    urlName: "订单详情",
                    urlPathName: "/order",
                    urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
            }else if(code == 'receiptsFileName'){
                if(!item.imgPathUrl){
                    this.$message.error("没有图片~");
                    return;
                }
                this.showViewer = true;
                this.srcList=[];
                this.srcList.push(item.imgPathUrl);
            }
        },
        /**
         * 收款登记
         */
        showReceive(flag)
        {
            if(flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length === 0) {
                    this.$message.error("请至少选择一个需要操作的订单！");
                    return false;
                }
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].orderState != enumData.orderState.FINISHED) {
                        this.$message.error("订单: " + selectData[i].orderReturnNum + "未完成，不能操作！");
                        return false;
                    }
                    if (selectData[i].totalFee <= 0) {
                        this.$message.error("订单: " + selectData[i].orderReturnNum + "金额小于0，请先费用异动并审核！");
                        return false;
                    }
                    if(selectData[i].noReceiveFee<=0){
                        this.$message.error("订单: " + selectData[i].orderReturnNum + "未收金额小于0，不能操作！");
                        return false;
                    }
                    if (selectData[i].payState == 2) {
                        this.$message.error("订单: " + selectData[i].orderReturnNum + "已全部登记，不能操作！");
                        return false;
                    }
                }
                let ids = [];
                let orderNums = '';
                selectData.forEach(item => {
                    if (this.common.isNotBlank(item.id)) {
                        ids.push(item.id);
                        orderNums += item.orderReturnNum + ",";
                    }
                });
                orderNums = orderNums.substring(0, orderNums.length - 1)
                this.info = {};
                this.info.ids = ids;
                if(this.info.ids.length ==1){
                    this.info.receiveFee = selectData[0].noReceiveFee;
                }
                this.receiveDate = this.common.formatDate.getDate();
                this.info.orderNums = orderNums;
            }
            this.receiveShow = flag;
        },
        receive(){
            let that = this;
            if(this.info.ids.length == 1){
                if(this.info.receiveFee <= 0){
                    this.$message.error("请先填写收款金额");
                    return false;
                }
            }
            this.common.postUrl("orderService", "receiveFeeByOrderIds", this.info, function (data)
            {
                that.doQuery();
                that.$message.success("收款登记成功！");
                that.showReceive(false);
            },null,'',true);
        },
        /**
         * 打开收款记录
         * @param flag
         */
        showReceiveRecord(flag)
        {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length !== 1)
                {
                    this.$message.error("请选择一个需要查看收款记录的数据！");
                    return false;
                }
                this.receiveRecord = flag;
                this.bill = this.common.copyObj(selectData[0]);
                this.$nextTick(() => {
                    this.doQueryReceiveRecord(this.bill.orderId);
                })
            }
            else
            {
                this.receiveRecord = flag;
                this.doQuery();
            }
        },
        /**
         *
         */
        async doQueryReceiveRecord(orderId)
        {
            await this.$refs.receiveRecordTable.load("orderService", "queryOrderInfoListForReceiveFee", {orderId});
        },
        /**
         * 撤销收款
         */
        cancleReceiveFee(item)
        {
            let that = this;
            that.$confirm("是否撤销该收款登记？", "提示").then(() =>{
                that.common.postUrl("orderService", "cancelReceiveFeeByOrderId", item, function (data)
                {
                    that.doQueryReceiveRecord(that.bill.orderId);
                    that.$message.success("收款登记撤销成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        downloadExcel()
        {
            this.$refs.table.downloadExcelFile();
        },

    },
    computed:{
        formData(){
            return [
                {"name":"回程单号","model":"orderReturnNum","type":"input","placeholder":"回程单号","isshow":true},
                {"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
                {"name":"回程单状态","model":"orderState","type":"select","options":this.orderStateData,"label":"codeName","value":"codeValue","placeholder":"回程单状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"业务类型","model":"bizType","type":"select","options":this.bizTypeData,"label":"codeName","value":"codeValue","placeholder":"业务类型","method":"doQuery","isshow":true},
                {"name":"客户下单日期","model":"customerOrderDate","type":"daterange","isshow":true},
                {"name":"收款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","placeholder":"收款状态","method":"doQuery","isshow":true},
                {"name":"客户","model":"tenantName","type":"input","placeholder":"客户","isshow":true},
            ]
        }
    },
}
