import commonSectionQuote from "@/page/pt/res/sectionQuote/commonSectionQuote.js"
import enumData from "@/page/pt/enum.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";

export default {
    name: 'updateSectionQuote',
    mixins: [commonSectionQuote],
    data()
    {
        return {
            enumData: enumData,
            id: this.$route.query.id,
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        myElDatePicker,
    },
    methods: {
        async initData()
        {
            await this.initStaticData(false);
            this.$nextTick(async () => {
                await this.loadSectionQuoteById(this.id);
            });
        },
        async loadSectionQuoteById(id)
        {
            let data = await this.common.postUrl("sectionQuoteService", "loadSectionQuoteById", {id}, null, null, '', true);
            this.order = data.info;
            let predictDistance = data.info.predictDistance;
            let predictTime = data.info.predictTime;
            this.order.smsFlag = data.info.smsFlag==1?true:false;
            if (data.info.tenantId)
            {
                await this.changeTenant(data.info.tenantId);
            }
            else
            {
                if (this.common.isNotBlank(data.info.tenantName))
                    this.order.tenantId = data.info.tenantName;
            }
            if (data.info.routeId)
            {
                this.goodsGroupData[1].goodsData = await this.loadGoodsListByRouteId(data.info.routeId);
            }
            else
            {
                if (this.common.isNotBlank(data.info.routeName))
                    this.order.routeId = data.info.routeName;
            }
            if (this.order.goodsId)
            {
                this.order.goodsId = this.order.goodsId.split(",");
                await this.changeGoods();
            }
            if (this.order.serviceAreas)
                this.order.serviceAreas = this.order.serviceAreas.split(",");
            if (this.order.supplierTenantId)
            {
                this.order.supplierTenantId = this.order.supplierTenantId.split(",").map(Number);
                if (this.order.supplierTenantId.length == this.supplierData.length)
                {
                    // this.order.supplierTenantId = [];
                    // this.order.supplierTenantId.push(0);
                }
                await this.changeSupplier();
            }
            this.quoteLevelDisabled = data.info.rfqQuoteType == enumData.rfqQuoteType.WMS;
            this.showDistance = this.common.isNotBlank(predictDistance);
            this.order.validDate = [data.info.effectDate, data.info.expireDate];
            this.$forceUpdate();
            /************************ workList ************************/
            this.workList = data.workList;
            this.changeWorkListName();
            if (data.info.quoteLevel == enumData.quoteLevel.PRESS_REGION)
            {
                this.$nextTick(() => {
                    for (let i = 0; i < this.workList.length; i++)
                    {
                        let item = this.workList[i];
                        let refs = this.getRef(i);
                        if (refs && refs[0])
                            refs[0].initData(item.provinceId, item.cityId, item.districtId, null);
                    }
                });
            }
            if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
            {
                this.begin.workId = Number(data.workList[0].workId);
                this.begin.workAddressStr = data.workList[0].workAddressStr;
                await this.changeBeginWork(this.begin);
                this.end.workId = data.workList[1].workId;
                this.end.workAddressStr = data.workList[1].workAddressStr;
                await this.loadBillingTypeData('BILLING_TYPE_WMS');
            }
            else if (this.order.rfqQuoteType == enumData.rfqQuoteType.LD)
            {
                await this.loadBillingTypeData('QUOTE_BILLING_TYPE');
            }
            this.$nextTick(() => {
                this.order.predictDistance = predictDistance;
                this.order.predictTime = predictTime;
            })
            this.requirementList = data.requirementList;
            /************************ quoteList ************************/
            this.$nextTick(() => {
                for (let i = 0; i < data.quoteList.length; i++)
                {
                    let item = data.quoteList[i];
                    if (item.quoteVehicleType)
                        item.quoteVehicleType = item.quoteVehicleType.split(",");
                    if (item.vehicleLength)
                        item.vehicleLength = item.vehicleLength.split(",");
                    item.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                    item.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
                    item.feeTypeData = this.common.copyObj(this.feeTypeData);
                    item.rangeUnitData = this.common.copyObj(this.rangeUnitData);
                    item.billingTypeDisabled = false;
                    item.vehicleLengthDisabled = false;
                    item.vehicleCountDisabled = false;
                    if (this.order.rfqQuoteType == enumData.rfqQuoteType.LD)
                    {
                        item.billingTypeDisabled = (item.feeType == 1 || item.feeType == 3);
                    }
                    else if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
                    {
                        //按躺的才能选择车长
                        item.vehicleLengthDisabled = item.billingType != 1;
                        //按月的才能填车辆数
                        item.vehicleCountDisabled = item.billingType != 3;
                    }
                }
                this.quoteList = data.quoteList;
                this.$forceUpdate();
            });
            this.$forceUpdate();
        },
        async updateSectionQuote()
        {
            if (this.checkOrderData())
            {
                this.order.effectDate = this.order.validDate[0];
                this.order.expireDate = this.order.validDate[1];
                let workList = this.workList;
                if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
                {
                    workList = [];
                    workList.push(this.begin);
                    workList.push(this.end);
                }
                this.order.workList = workList;
                this.order.requirementList = this.requirementList;
                this.order.quoteList = this.quoteList;
                await this.common.postUrl("sectionQuoteService", "saveOrUpdateSectionQuote", this.order, null, null, '', true);
                this.$message.success("保存成功！");
                this.closePage();
            }
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
