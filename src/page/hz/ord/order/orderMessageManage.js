import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum.js"

export default {
    name: 'orderMessageManage',
    data()
    {
        return {
            head: [
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "diy"},
                {"name": "我的单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "250", "type": "text"},
                {"name": "消息内容", "code": "messageContent", "width": "250", "type": "text"},
                {"name": "消息状态", "code": "isReadName", "width": "100", "type": "text"},
                {"name": "消息时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            readStateData: [],//
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        async init()
        {
            this.readStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "IS_READ"});
        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery()
        {
            this.query = {
                custOrderNum: '',
                routeName: '',
                orderNum: '',
                isRead: '',
            };
            return this.query;
        },
        /**
         *
         */
        async doQuery()
        {
            await this.$refs.table.load("orderTF", "loadOrderMessagePageHZ", this.query);
        },
        /**
         * 打开详情
         * @param data
         */
        toDetail(item, code)
        {
            //已读
            this.batchReadMessage(item);
            this.$emit("openTab",{
                urlId: 'hzOrderDetail' + item.orderId,
                query: {orderId: item.orderId},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/hz/ord/order/orderDetail/orderDetailMain.vue"});
        },
        /**
         * 批量已读
         * @returns {boolean}
         */
        batchReadMessage(data)
        {
            let selectData = this.$refs.table.getSelectItem();
            let tipFlag = true;
            if (this.common.isNotBlank(data))
            {
                tipFlag = false;
                selectData.push(data);
            }
            if (selectData.length < 1)
            {
                this.$message.error("请至少选择一条需要已读的订单消息！");
                return false;
            }
            let mIds = [];
            for (let i = 0; i < selectData.length; i++)
            {
                if (selectData[i].isRead == enumData.STS.VALID)
                {
                    if (i > 0)
                        this.$message.error("您选择的订单消息包含已读的订单,请确认！");
                    else
                        this.$message.error("请选择未读的消息处理！");
                    return false;
                }
                mIds.push(selectData[i].mId);
            }
            let that = this;
            that.common.postUrl("orderTF", "batchReadMessage", {"mIds": mIds}, function (data) {
                that.doQuery();
                that.$parent.loadTodoData();
                if (tipFlag)
                    that.$message.success("批量已读成功！");
                else
                    that.$message.success("消息已读！");
            }, null, '', true).then(() => {});
        },
        /**
         * 批量删除
         * @returns {boolean}
         */
        batchDeleteMessage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1)
            {
                this.$message.error("请至少选择一条需要删除的订单消息！");
                return false;
            }
            let flag = false;
            let mIds = [];
            for (let i = 0; i < selectData.length; i++)
            {
                if (selectData[i].isRead == enumData.STS.NULLITY)
                    flag = true;
                mIds.push(selectData[i].mId);
            }
            
            let that = this;
            let tip = flag ? "您选择的消息包含未读的,是否确认批量删除订单消息？" : "是否确认批量删除订单消息？";
            that.$confirm(tip, "批量删除消息").then(() =>{
                that.common.postUrl("orderTF", "batchDeleteMessage", {"mIds": mIds}, function (data) {
                    that.doQuery();
                    that.$parent.loadTodoData();
                    that.$message.success("批量删除成功！");
                }, null, '', true).then(() => {});
            }).catch(() =>{})
        },
    },
}
