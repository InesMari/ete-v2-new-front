import addSupplierZCQuote from "@/page/pt/res/quote/addSupplierZCQuote";
import enumData from "@/page/pt/enum";

export default {
    name: 'updateSupplierZCQuote',
    mixins: [addSupplierZCQuote],
    data() {
        return {
            modifyType:this.$route.query.modifyType,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.loadQuoteData();
    },
    /**
     * 绑定函数
     */
    methods:
    {
        async loadQuoteData()
        {
            await this.initData(true);
            this.$nextTick(async () => {
                this.quote = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", this.$route.query);
                this.quote.quoteLevel = this.quote.quoteLevel + "";
                if (this.common.isNotBlank(this.quote.specifyTenantId))
                {
                    await this.loadWorkData();
                    this.goodsGroupData[1].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                    this.goodsGroupData[2].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
                }
                else
                    await this.loadStoreHouse();
                this.sectionData = this.common.copyObj(this.quote.sectionData);
                this.sectionData.forEach(item => {
                    if (this.common.isNotBlank(this.quote.specifyTenantId))
                        item.workId = item.workId + "";
                })
                await this.resetWorkName();
                await this.resetRegion();
    
                this.quoteList = this.common.copyObj(this.quote.quoteList);
                this.quoteList.forEach(item => {
                    item.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
                    item.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                    item.goodsGroupData = this.common.copyObj(this.goodsGroupData);
                    item.billingType = item.billingType + "";
                    item.quoteVehicleType = this.splitStrToArray(item.quoteVehicleType + "");
                    this.changeQuoteVehicleType(item);
                    item.vehicleLength = this.splitStrToArray(item.vehicleLength + "");
                    this.changeVehicleLength(item);
                    item.goodsId = this.splitStrToArray(item.goodsId + "");
                    this.changeGoodsId(item);
                });
                this.quote.sectionData = null;
                this.quote.quoteList = null;

                this.loadContractData(this.quote.tenantId);

                this.$forceUpdate();
            })
        },
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
