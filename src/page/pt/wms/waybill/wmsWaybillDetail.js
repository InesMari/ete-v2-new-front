import enumData from "@/page/pt/enum.js"

export default {
    name: 'wmsWaybill',
    data()
    {
        return {
            id: this.$route.query.id,
            waybillInfo: {
                requireDate: '',
                isUrgentName: '',
                isReturnName: '',
                haveReceiptName: '',
                vehicleTypeName: '',
                vehicleLengthName: '',
            },
            costInfo:{},
            list: [],
            feeList: [],
            costList: [],
            totalInfo: {
                nums:0,
                boxNums:0,
                palletNums:0,

                deliveryNums:0,
                deliveryBoxNums:0,
                deliveryPalletNums:0,

                num:0,
                totalFee:0,
                totalFeeWithTax:0,

                costNum:0,
                costTotalFee:0,
                costTotalFeeWithTax:0,
                actualCost:0,
            },
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
    },
    methods: {
        async initData()
        {
            let data = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillInfoByWmsWaybillId", {id: this.id});

            this.waybillInfo = data.waybillInfo;
            this.costInfo = data.costInfo;
            this.list = data.list;
            this.feeList = data.feeList;
            this.costList = data.costList;

            for (let i = 0; i < data.list.length; i++)
            {
                let item = data.list[i];
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums, item.nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums, item.boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums, item.palletNums);

                this.totalInfo.deliveryNums = this.common.accAdd(this.totalInfo.deliveryNums, item.deliveryNums);
                this.totalInfo.deliveryBoxNums = this.common.accAdd(this.totalInfo.deliveryBoxNums, item.deliveryBoxNums);
                this.totalInfo.deliveryPalletNums = this.common.accAdd(this.totalInfo.deliveryPalletNums, item.deliveryPalletNums);
            }
            for (let i = 0; i < data.feeList.length; i++) {
                let item = data.feeList[i];
                this.totalInfo.num = this.common.accAdd(this.totalInfo.num, item.num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee, item.totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax, item.totalFeeWithTax);
            }
            for (let i = 0; i < data.costList.length; i++) {
                let item = data.costList[i];
                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum, item.num);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee, item.totalFee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax, item.totalFeeWithTax);
                this.totalInfo.actualCost = this.common.accAdd(this.totalInfo.actualCost, item.actualCost);
            }
            this.$forceUpdate();
        },
        toOrderDetail(item)
        {
            if (item.outOrderNum.startsWith("IW"))
            {
                this.$emit("openTab",{
                    urlId: "inOrderDetail"+item.outOrderId,
                    query: {inOrderId:item.outOrderId,
                        logId: item.outOrderId,
                        logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                    },
                    urlName: '入库单详情',
                    urlPathName: "/inOrderDetail",
                    urlPath: '/pt/wms/ord/inOrderDetail.vue'});
            }
            else
            {
                this.$emit("openTab",{
                    urlId: "urlId"+item.outOrderId,
                    query: {outOrderId:item.outOrderId,
                        logId: item.outOrderId,
                        logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
                    },
                    urlName: '出库单详情',
                    urlPathName: "/outOrderDetail",
                    urlPath: '/pt/wms/ord/outOrderDetail.vue'});
            }
        },
        closePage()
        {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
        }
    },
}
