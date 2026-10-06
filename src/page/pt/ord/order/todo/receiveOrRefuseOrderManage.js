import tableCommon from "@/components/table/tableCommon.vue"
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js"

export default {
    name: 'receiveOrRefuseOrderManage',
    data()
    {
        return {
            head: [
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "diy"},
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
                {"name": "是否回单", "code": "haveReceiptName", "width": "100", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
                {"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
                {"name": "货物件数", "code": "goodsCountSum", "width": "100", "type": "text"},
                {"name": "货物重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text"},
                {"name": "货物体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
                {"name": "下单时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
            ],
            query: this.initQuery(enumData.orderState.PREP_RECEIVE + ""),
            orderTypeData: [],//订单类型
            orderStateData: [],//订单状态
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
        myFileModel,
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        async init()
        {
            //订单类型
            this.orderTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_TYPE"});
            //订单状态
            this.orderStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_STATE"});
            
            for (let i = 0; i < this.orderStateData.length; i++)
            {
                let value = this.orderStateData[i].codeValue;
                if (!(value == enumData.orderState.PREP_RECEIVE || value == enumData.orderState.REFUSE))
                {
                    this.orderStateData.splice(i, 1);
                    i--;
                }
            }
        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery(orderState)
        {
            this.query = {
                tenantName: '',
                routeName: '',
                orderNum: '',
                orderType: '',
                orderState: this.common.isBlank(orderState) ? '' : orderState,
                createDate: '',
                workDate: '',
                isReceiveOrRefuseOrder: enumData.STS.VALID,
            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery()
        {
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            let {items} = await this.$refs.table.load("orderTF", "queryOrderInfoList", this.query);
            items.forEach((el)=>{
                el.disabled = el.orderState == enumData.orderState.CANCELLED;
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
            this.openDetail(data);
        },
        /**
         * 打开详情
         * @param data
         */
        openDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'receiveOrRefuseOrderDetail' + data.orderId,
                query: {orderId: data.orderId},
                urlName: "接单-订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/todo/detail/receiveOrRefuseOrderDetail.vue"});
        },
        /**
         * 接受订单
         * @returns {boolean}
         */
        receiveOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要接受的订单！");
                return false;
            }
            this.openDetail(selectData[0]);
            
            // for (let i = 0; i < selectData.length; i++)
            // {
            //     if (selectData[i].orderState != enumData.orderState.PREP_RECEIVE)
            //     {
            //         if (i > 0)
            //             this.$message.error("您选择的订单包含非待接单状态的订单，请确认！");
            //         else
            //             this.$message.error("只有待接单状态的订单可以接单！");
            //         return false;
            //     }
            // }
            //
            // let orderIds = [];
            // selectData.forEach(item => {
            //     orderIds.push(item.orderId);
            // });
            // let that = this;
            // this.$confirm("接受订单后不可回退,是否确认接受订单？", "接受订单").then(() =>{
            //     this.common.postUrl("orderTF", "receiveOrder", {"orderIds": orderIds}, function (data) {
            //         that.doQuery();
            //         that.$parent.loadTodoData();
            //         that.$message.success("接单成功！");
            //         that.$parent.loadTodoData();
            //     }, null, '', true).then(() => {});
            //  }).catch(() =>{})
        },
        /**
         * 拒接订单
         * @returns {boolean}
         */
        refuseOrder()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要拒接的订单！");
                return false;
            }
            if (selectData[0].orderState != enumData.orderState.PREP_RECEIVE)
            {
                if (selectData[0].orderState == enumData.orderState.REFUSE)
                    this.$message.error("订单已经拒接，请勿重复操作！");
                else
                    this.$message.error("只有待接单状态的订单可以拒接！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("<p style='color:red'>请谨慎操作,拒接订单后,客户可查看到拒单原因</p>", '拒接订单', {
                type: 'warning',
                center: true,
                dangerouslyUseHTMLString: true,
                inputPlaceholder: '请输入拒单原因',
                beforeClose: (action, instance, done) => {
                if (action === 'confirm')
                {
                    if (this.common.isNotBlank(instance.inputValue))
                        done();
                    else
                        this.$message.error("请输入拒单原因！");
                }
                else
                    done();
            }
            }).then(({ value }) => {
                param.refuseRemark = value;
                this.common.postUrl("orderTF", "refuseOrder", param, function (data) {
                    that.doQuery();
                    that.$parent.loadTodoData();
                    that.$message.success("拒单成功！");
                    that.$parent.loadTodoData();
                }, null, '', true).then(() => {});
            }).catch(() => {
                this.$message.info("取消拒单");
            });
        },
    },
}
