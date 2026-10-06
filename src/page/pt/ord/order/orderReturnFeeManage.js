import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'orderReturnFeeManage',
    data()
    {
        return {
            head: [
                {"name": "回程单号", "code": "orderReturnNum", "width": "180", "type": "text"},
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
                {"name": "车型", "code": "vehicleTypeName", "width": "90", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "收款金额(元)", "code": "receiveFee", "width": "100", "type": "text",isSum:true},
                {"name": "收款日期", "code": "receiveDate", "width": "150", "type": "text"},
                {"name": "收款备注", "code": "receiveFeeRemark", "width": "150", "type": "text"},
            ],


            query: this.initQuery(),
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
            this.$forceUpdate();
        },
        initQuery()
        {
            this.query = {
                orderReturnNum: '',
                orderNum:'',
                receiveFeeRemark: '',
                receiveDate: '',
            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.receiveDate) && this.query.receiveDate.length === 2){
                this.query.startReceiveDate = this.query.receiveDate[0];
                this.query.endReceiveDate = this.query.receiveDate[1];
            }else{
                this.query.startReceiveDate = '';
                this.query.endReceiveDate = '';
            }

            let {items} = await this.$refs.table.load("orderService", "queryOrderInfoListForReceiveFee", this.query);
            items.forEach((el)=>{
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
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
         * 撤销收款
         */
        cancleReceiveFee()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0) {
                this.$message.error("请至少选择一个需要操作的收款记录！");
                return false;
            }

            let ids = [];
            let orderReturnNum = '';
            selectData.forEach(item => {
                if (this.common.isNotBlank(item.id)) {
                    ids.push(item.id);
                    orderReturnNum += item.orderReturnNum + ",";
                }
            });
            orderReturnNum = orderReturnNum.substring(0, orderReturnNum.length - 1)
            let info = {};
            info.ids = ids;
            info.orderReturnNum = orderReturnNum;
            let that = this;
            that.$confirm("是否撤销该收款登记？", "提示").then(() =>{
                that.common.postUrl("orderService", "cancelReceiveFeeByOrderIds", info, function (data)
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
                {"name":"收款备注","model":"receiveFeeRemark","type":"input","placeholder":"收款备注","isshow":true},
                {"name":"收款日期","model":"receiveDate","type":"daterange","isshow":true},
            ]
        }
    },
}
