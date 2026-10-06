import enumData from "@/page/pt/enum";

export default {
    name: 'wmsCostInfo',
    data()
    {
        return {
            costInfo: {
                billingType: '1',
                quoteVehicleType: null,
                freightPrice: null,
                goodsCount: null,
                freight: 0,
            },
            goodsCount:'',
            goodsNums:'',
            billingTypeData: [],
            quoteVehicleTypeData: [],
            goodsCountDisabled: true,
        }
    },
    mounted()
    {
        this.initStaticData();
    },
    components: {},
    methods: {
        initData(costInfo)
        {
            this.costInfo = costInfo;
            this.costInfo.billingType = this.costInfo.billingType+'';
            this.costInfo.quoteVehicleType = this.costInfo.quoteVehicleType+'';

            this.costInfo.freightPrice = costInfo.freightPrice;
            this.costInfo.goodsCount = costInfo.goodsCount;
            this.$nextTick(()=>{
                this.costInfo.freight = costInfo.freight;
            })
            this.goodsCountDisabled = costInfo.billingType == 1;
            this.$forceUpdate();
        },
        //初始化页面的静态数据
        initStaticData()
        {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'BILLING_TYPE_WMS,VEHICLE_TYPE_QUOTE'}, function (data)
            {
                that.billingTypeData = data.BILLING_TYPE_WMS;
                that.quoteVehicleTypeData = data.VEHICLE_TYPE_QUOTE;
            });
        },
        changeBillingType(billingType)
        {
            this.goodsCountDisabled = billingType == 1 || billingType == 3;
            if (this.goodsCountDisabled)
            {
                this.costInfo.goodsCount = null;
            }
            else
            {
                this.costInfo.goodsCount = this.goodsCount;
                if (billingType == 4)
                {
                    this.costInfo.goodsCount = this.goodsNums;
                }
            }
            this.$parent.setFeeInfoNum(this.costInfo.goodsCount);
            this.$parent.matchOrderFee();
        },
        changeQuoteVehicleType(quoteVehicleType)
        {
            if (quoteVehicleType)
            {
                this.$parent.matchOrderFee();
            }
        },
        getData()
        {
            return this.costInfo;
        },
        setGoodsCount(value)
        {
            if (this.costInfo.billingType==2){
                this.costInfo.goodsCount = value;
            }
            this.goodsCount = value;
            this.$forceUpdate();
        },
        setGoodsNums(value)
        {
            this.goodsNums = value;
            if (this.costInfo.billingType == 4)
            {
                this.costInfo.goodsCount = value;
            }
            this.$forceUpdate();
        },
        setFreightPrice(value, workList)
        {
            this.costInfo.freightPrice = value;
            if (this.costInfo.billingType == 1)
                this.costInfo.freight = value;
            else if(this.costInfo.billingType == 2 || this.costInfo.billingType == 4)
            {
                let goodsCount = this.costInfo.goodsCount;
                if (this.common.isBlank(goodsCount))
                {
                    goodsCount = 0;
                    if (this.common.isNotBlank(workList) && workList.length > 0)
                    {
                        for(let i in workList)
                        {
                            goodsCount = this.common.accAdd(goodsCount, workList[i].palletNums);
                            if (this.costInfo.billingType == 4)
                            {
                                goodsCount = this.common.accAdd(goodsCount, workList[i].nums);
                            }
                        }
                    }
                    this.costInfo.goodsCount = goodsCount;
                }
                if (this.costInfo.billingType == 2)
                {
                    this.goodsCount = goodsCount;
                }
                if (this.costInfo.billingType == 4)
                {
                    this.goodsNums = goodsCount;
                }
                this.costInfo.freight = this.common.accMul(goodsCount, value);
            }
            else
            {
                this.costInfo.freight = 0;
                this.costInfo.freightPrice = null;
            }
            this.$forceUpdate();
        },
        calcCost(goodsCount)
        {
            this.costInfo.freight = 0;
            if (this.common.isNotBlank(goodsCount) && this.common.isNotBlank(this.costInfo.freightPrice))
                this.costInfo.freight = this.common.accMul(goodsCount, this.costInfo.freightPrice);
            this.$forceUpdate();
        }
    },
}
