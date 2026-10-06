import enumData from "@/page/pt/enum";

export default {
    name: 'feeInfo',
    data()
    {
        return {
            feeInfo: {
                waybillId: '',
                transitOtherFee: '',
                remark: '',
                totalTransitFee: '',
            },
            feeMoveTotalInfo: this.initTotalFee(),
            statementList: [],
        }
    },
    mounted()
    {
    
    },
    components: {},
    methods: {
        /**
         * 运单费用异动合计自动计算
         */
        updateFeeMoveTotal()
        {
            this.feeInfo.totalTransitFee = this.feeInfo.transitOtherFee;
            this.$forceUpdate();
        },
        initTotalFee(transitOtherFeeSum, totalFeeSum)
        {
            this.feeMoveTotalInfo = {
                transitOtherFeeSum: this.common.isBlank(transitOtherFeeSum) ? 0 : transitOtherFeeSum,
                totalFeeSum: this.common.isBlank(totalFeeSum) ? 0 : totalFeeSum,
            }
            return this.feeMoveTotalInfo;
        },
        /**
         * 获取中转费用异动列表数据
         * @param wayBillId
         * @param dispatchId
         */
        loadWaybillStatementList(wayBillId) {
            let that = this;
            this.common.postUrl("transitManageTF", "loadWaybillStatementList", {wayBillId: wayBillId}, function (data) {
                if (data) {
                    that.statementList = data.waybillStatementList;
                    that.initTotalFee(data.transitOtherFeeSum, data.totalFeeSum);
                }
            });
        },
    
    },
}
