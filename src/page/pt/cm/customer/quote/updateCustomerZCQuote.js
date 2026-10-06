import addCustomerZCQuote from "@/page/pt/cm/customer/quote/addCustomerZCQuote";
import enumData from "@/page/pt/enum";

export default {
    name: 'updateCustomerZCQuote',
    mixins: [addCustomerZCQuote],
    data() {
        return {
            modifyType:this.$route.query.modifyType,
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData(true);
        await this.loadQuoteData();
    },
    /**
     * 绑定函数
     */
    methods:
    {
        async loadQuoteData()
        {
            this.quote = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", this.$route.query);
            this.quote.quoteLevel = this.quote.quoteLevel + "";
            this.quote.tenantId = parseInt(this.quote.tenantId);
            await this.loadWorkData();
            this.goodsGroupData[1].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
            this.goodsGroupData[2].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);

            this.sectionData = this.common.copyObj(this.quote.sectionData);
            this.sectionData.forEach(item => {
                item.workId = item.workId + "";
            })
            await this.resetWorkName();
            await this.resetRegion();
            this.quoteList = this.common.copyObj(this.quote.quoteList);

            this.quoteList.forEach(item => {
                item.vehicleLengthData = this.vehicleLengthData;
                item.quoteVehicleTypeData = this.quoteVehicleTypeData;
                item.goodsGroupData = this.common.copyObj(this.goodsGroupData);
                item.billingType = item.billingType + "";
                item.quoteVehicleType = this.splitStrToArray(item.quoteVehicleType + "");
                item.vehicleLength = this.splitStrToArray(item.vehicleLength + "");
                item.goodsId = this.splitStrToArray(item.goodsId + "");
                this.changeGoodsId(item);
            });
            this.quote.sectionData = null;
            this.quote.quoteList = null;
            this.$forceUpdate();
        },
        /**
         * 数据切割处理
         * @param str
         * @returns {*[]}
         */
        splitStrToArray(str)
        {
            let array = [];
            if (this.common.isNotBlank(str))
            {
                let strArr = str.split(",");
                strArr.forEach(item => {
                    array.push(item);
                });
            }
            return array;
        },
    },
}
