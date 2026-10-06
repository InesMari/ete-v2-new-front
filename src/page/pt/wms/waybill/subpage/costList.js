import enumData from "@/page/pt/enum";

export default {
    name: 'costList',
    props: {
        type: Number,//默认是1就是新增修改，2是新版的确认送达
        isReturn: Number,
    },
    data()
    {
        return {
            costListSrc: [],
            costList: [],
            wmsCostItemTypeData: [],
            supplierData: [],
            total: {
                costNum: 0,
                costTotalFee: 0,
                costTotalFeeWithTax: 0,
                palletNumsSum: 0,
                actualCost: 0,
            },
        }
    },
    mounted()
    {
        this.initStaticData();
    },
    components: {},
    methods: {
        /**
         * 主界面wmsWaybill 修改回显初始化调用
         * @param costList
         */
        async initCostList(costList, flag)
        {
            for (let i = 0; i < costList.length; i++)
            {
                let item = costList[i];
                let supplierData = [];
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.costListSrc[j];
                    if (item.itemId == costItem.itemId)//项目一样
                    {
                        let flag = false;
                        for (let k = 0; k < supplierData.length; k++)
                        {
                            let tenantItem = supplierData[k];
                            if (tenantItem.tenantId == costItem.tenantId)
                            {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag)
                        {
                            supplierData.push(costItem);
                        }
                    }
                }
                item.supplierData = supplierData;
                item.disabled = item.isWorkOrder == 0;
                item.unitDisabled = item.itemType == 104 && item.unit == "元/车次";
            }
            this.costList = costList;
            this.calcCostTotal(flag);
            this.$forceUpdate();
        },
        async initStaticData()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async initCostSrcData(selectItem)
        {
            let workIds = [];
            selectItem.forEach(item => {
                workIds.push(item.workId);
            })
            let costList = await this.common.postUrl("wmsWaybillService", "getWmsWaybillAbleCostList", {});
            for (let i = 0; i < costList.length; i++)
            {
                costList[i].unitDisabled = false;
            }
            this.costListSrc = this.common.copyObj(costList);
        },
        async changeNum(item, index)
        {
            this.$forceUpdate();
            if (item.num > 0)
            {
                await this.dealPriceTaxFee(item, index, 0);
            }
            await this.calcCostTotal();
        },
        calcCostTotal(flag,returnNums=0)
        {
            this.total.costNum = 0;
            this.total.costReturnNums = 0;
            this.total.costTotalNum = 0;
            this.total.costTotalFee = 0;
            this.total.costTotalFeeWithTax = 0;
            this.total.palletNumsSum = 0;
            this.total.actualCost = 0;

            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                if (item.itemType == 104)//产品说配送的才有返程数量、最终之类的没有
                {
                    item.returnNums = returnNums;
                }
                else
                {
                    item.returnNums = 0;
                }

                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                item.totalFee = this.common.accMul(item.price,item.totalNum);
                item.totalFeeWithTax = this.common.accMul(item.priceWithTax,item.totalNum);
                if (this.common.isNotBlank(item.num))
                {
                    this.total.costNum = this.common.accAdd(item.num, this.total.costNum);
                }
                this.total.costReturnNums = this.common.accAdd(this.total.costReturnNums, item.returnNums);
                this.total.costTotalNum = this.common.accAdd(this.total.costTotalNum, item.totalNum);
                if (this.common.isNotBlank(item.totalFee))
                {
                    this.total.costTotalFee = this.common.accAdd(item.totalFee, this.total.costTotalFee);
                }
                if (this.common.isNotBlank(item.totalFeeWithTax))
                {
                    this.total.costTotalFeeWithTax = this.common.accAdd(item.totalFeeWithTax, this.total.costTotalFeeWithTax);
                }
                if (item.itemType != 104)
                {
                    item.actualCost = item.totalFeeWithTax;
                    this.total.actualCost = this.common.accAdd(item.actualCost, this.total.actualCost);
                }
                else
                {
                    this.total.palletNumsSum = this.common.accAdd(item.palletNumsSum, this.total.palletNumsSum);
                }
            }

            let sum = 100;
            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                item.totalFee = this.common.accMul(item.price,item.num);
                item.totalFeeWithTax = this.common.accMul(item.priceWithTax,item.num);

                if (item.itemType == 104)
                {
                    if (item.palletNumsSum > 0 && this.total.palletNumsSum > 0)
                    {
                        item.palletNumsPercent = this.common.accDiv(item.palletNumsSum, this.total.palletNumsSum);
                        item.palletNumsPercent = this.common.accMul(item.palletNumsPercent, 100);
                        sum = this.common.accSub(sum, item.palletNumsPercent);
                        if (i == this.costList.length - 1 && sum > 0)
                        {
                            item.palletNumsPercent = this.common.accAdd(item.palletNumsPercent, sum);
                        }
                        let actualCost = this.common.accMul(item.totalFeeWithTax, item.palletNumsPercent);
                        item.actualCost = this.common.accDiv(actualCost, 100).myToFixed(2);
                    }
                    if (item.unit == "元/车次")
                    {
                        item.actualCost = item.priceWithTax;
                    }
                    this.total.actualCost = this.common.accAdd(item.actualCost, this.total.actualCost);
                }
            }
            if (!flag)
            {
                this.$parent.calcProfit(); 
            }
            this.$forceUpdate();
        },
        /**
         * 选择改变供应商
         * @param item
         * @param index
         */
        changeSupplier(item, index) {
            this.$nextTick(()=>{
                this.dealPriceTaxFee(item, index, 1);
            })
        },
        changeCostSwitch(item, index) {
            item.isWorkOrder = item.isWorkOrder == 1 ? 0 : 1;
            item.disabled = item.isWorkOrder == 0;
            this.$forceUpdate();
            this.dealPriceTaxFee(item, index, 0);
        },
        dealPriceTaxFee(data, index, isFromChangeTenant)
        {
            if (data.isWorkOrder == 0)
            {
                data.tenantId = null;
                data.price = null;
                data.tax = null;
                data.priceWithTax = null;
                data.num = null;
                data.totalFee = null;
                data.totalFeeWithTax = null;
                data.disabled = true;
                data.unitDisabled = true;
            }
            else
            {
                let feeList = this.$parent.getFeeInfoFeeList();
                let feeData = {};//相同itemId的费用数据
                for (let i = 0; i < feeList.length; i++)
                {
                    let fee = feeList[i];
                    if (fee.itemId == data.itemId)
                    {
                        feeData = fee;
                        if (i == index)
                        {
                            break;//
                        }
                    }
                }
                //收入有A客户a项目的数据  成本如果存在A客户a项目优先
                let customerCost = null;
                let defaultCost = null;
                let waybillInfo = this.$parent.getWaybillInfo();
                data.unitDisabled = false;
                let isMatchWaybillCost = false;
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.common.copyObj(this.costListSrc[j]);
                    if (data.itemId == costItem.itemId)//项目一样
                    {
                        if (this.common.isBlank(costItem.custTenantId))
                        {
                            //短驳的重新匹配
                            if (costItem.itemType == 104)//短驳配送的报价特殊处理
                            {
                                if (!isMatchWaybillCost)
                                {
                                    defaultCost = null;
                                }
                                let detailList = costItem.detailList;//短驳仓配报价明细
                                if (this.common.isBlank(detailList) || detailList.length == 0)
                                    continue;
                                for (let k = 0; k < detailList.length; k++)
                                {
                                    let detailItem = detailList[k];
                                    if (feeData.endWorkId == detailItem.endWorkId
                                        && costItem.tenantId == waybillInfo.supplierTenantId
                                        && this.matchData(waybillInfo.quoteVehicleType ,detailItem.quoteVehicleType)
                                        && this.matchData(waybillInfo.vehicleLength ,detailItem.vehicleLength))
                                    {
                                        //匹配范围
                                        if (detailItem.unit == "元/车次")
                                        {
                                            defaultCost = this.common.copyObj(costItem);
                                            defaultCost.price = detailItem.price;
                                            defaultCost.priceWithTax = detailItem.priceWithTax;
                                            defaultCost.contractDetailDetailId = detailItem.id;
                                            data.unitDisabled = true;
                                            data.num = 1;
                                            data.actualCost = detailItem.priceWithTax;
                                            defaultCost.unit = detailItem.unit;
                                            isMatchWaybillCost = true;
                                            break;
                                        }
                                        else
                                        {
                                            let num = data.num;
                                            if (!data.num)
                                            {
                                                num = feeData.num;
                                            }
                                            if (detailItem.beginRange <= num && num <= detailItem.endRange)
                                            {
                                                defaultCost = this.common.copyObj(costItem);
                                                defaultCost.price = detailItem.price;
                                                defaultCost.priceWithTax = detailItem.priceWithTax;
                                                defaultCost.unit = detailItem.unit;
                                                defaultCost.contractDetailDetailId = detailItem.id;
                                                isMatchWaybillCost = true;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if (this.common.isBlank(defaultCost))
                                {
                                    if (isFromChangeTenant == 1)//选择改变供应商触发的说明有供应商存在
                                    {
                                        if (data.tenantId == costItem.tenantId)
                                        {
                                            defaultCost = this.common.copyObj(costItem);
                                        }
                                    }
                                    else
                                    {
                                        defaultCost = this.common.copyObj(costItem);
                                    }
                                }
                                else //有其他客户的匹配存在，比较成本
                                {
                                    if (isFromChangeTenant == 1)//选择改变供应商触发的说明有供应商存在
                                    {
                                        if (data.tenantId == costItem.tenantId)
                                        {
                                            defaultCost = this.common.copyObj(costItem);
                                        }
                                    }
                                    else if (costItem.price < defaultCost.price)
                                    {
                                        defaultCost = this.common.copyObj(costItem);//成本去最低价
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (feeData.custTenantId == costItem.custTenantId)//有客户且客户和收入一致的才取
                            {
                                //短驳配送的报价特殊处理
                                if (costItem.itemType == 104)
                                {
                                    if (!isMatchWaybillCost)
                                    {
                                        customerCost = null;
                                    }
                                    let detailList = costItem.detailList;
                                    if (this.common.isBlank(detailList) || detailList.length == 0)
                                        continue;
                                    for (let k = 0; k < detailList.length; k++)
                                    {
                                        let detailItem = detailList[k];
                                        if (feeData.endWorkId == detailItem.endWorkId
                                            && costItem.tenantId == waybillInfo.supplierTenantId
                                            && this.matchData(waybillInfo.quoteVehicleType ,detailItem.quoteVehicleType)
                                            && this.matchData(waybillInfo.vehicleLength ,detailItem.vehicleLength))
                                        {
                                            //匹配范围
                                            if (detailItem.unit == "元/车次")
                                            {
                                                customerCost = this.common.copyObj(costItem);
                                                customerCost.price = detailItem.price;
                                                customerCost.priceWithTax = detailItem.priceWithTax;
                                                customerCost.contractDetailDetailId = detailItem.id;
                                                data.unitDisabled = true;
                                                data.num = 1;
                                                data.actualCost = detailItem.priceWithTax;
                                                customerCost.unit = detailItem.unit;
                                                isMatchWaybillCost = true;
                                                break;
                                            }
                                            else
                                            {
                                                let num = data.num;
                                                if (!data.num)
                                                {
                                                    num = feeData.num;
                                                }
                                                if (detailItem.beginRange <= num && num <= detailItem.endRange)
                                                {
                                                    customerCost = this.common.copyObj(costItem);
                                                    customerCost.price = detailItem.price;
                                                    customerCost.priceWithTax = detailItem.priceWithTax;
                                                    customerCost.unit = detailItem.unit;
                                                    customerCost.contractDetailDetailId = detailItem.id;
                                                    isMatchWaybillCost = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (isFromChangeTenant == 1)
                                    {
                                        if (data.tenantId == costItem.tenantId)
                                        {
                                            customerCost = this.common.copyObj(costItem);
                                        }
                                    }
                                    else
                                    {
                                        if (this.common.isBlank(customerCost))
                                        {
                                            customerCost = this.common.copyObj(costItem);
                                        }
                                        else if (costItem.price < defaultCost.price)
                                        {
                                            customerCost = this.common.copyObj(costItem);
                                        }
                                    }
                                }
                                //短驳配送的报价特殊处理
                            }
                        }
                    }
                }
                let flag = false;
                if (this.common.isNotBlank(customerCost))
                {
                    data.price = customerCost.price;
                    data.tax = customerCost.tax;
                    data.priceWithTax = customerCost.priceWithTax;
                    data.unit = customerCost.unit;
                    data.contractDetailDetailId = customerCost.contractDetailDetailId;
                    if (isFromChangeTenant == 0)
                    {
                        data.tenantId = customerCost.tenantId;
                    }
                    flag = true;
                }
                if (!flag && this.common.isNotBlank(defaultCost))
                {
                    data.price = defaultCost.price;
                    data.tax = defaultCost.tax;
                    data.priceWithTax = defaultCost.priceWithTax;
                    data.unit = defaultCost.unit;
                    data.contractDetailDetailId = defaultCost.contractDetailDetailId;
                    if (isFromChangeTenant == 0)
                    {
                        data.tenantId = defaultCost.tenantId;
                    }
                }
                if (!data.num)
                {
                    data.num = feeData.num;
                }
            }
            this.calcCostTotal();//换价格重新计算合计
            this.$forceUpdate();
        },
        matchData(src, arr)
        {
            if (this.common.isNotBlank(src) && this.common.isNotBlank(arr))
            {
                let array = arr.split(",");
                let set = new Set(array);
                if (set.has(src))
                {
                    return true;
                }
                if (set.has("0"))
                {
                    return true;
                }
            }
            return false;
        },
        getData()
        {
            return this.costList;
        },
        getCostListSrcData()
        {
            return this.costListSrc;
        },
    },
}
