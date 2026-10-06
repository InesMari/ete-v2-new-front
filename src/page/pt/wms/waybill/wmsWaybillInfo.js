import enumData from "@/page/pt/enum.js"
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'wmsWaybillInfo',
    data()
    {
        return {
            id: this.$route.query.id,
            waybillInfo: {
                waybillNum: null,
                palletNums: null,
                requireDate: null,
                remark: null,
                tenantName: null,
                linkman: null,
                linkPhone: null,
                isUrgentName: null,
                haveReceiptName: null,
                plateNumber: null,
                vehicleTypeName: null,
                vehicleLengthName: null,
                driverName: null,
                driverLinkPhone: null,
                deliveryDate: null,
                isReturn: null,
            },
            costInfo:{
                returnNums:0,
            },
            list: [],
            feeListSrc: [],
            feeList: [],
            costListSrc: [],
            costList: [],
            totalInfo: this.initTotalInfo(),
            isShowDialog:false,
            feeHead: [
                {"name": "货主", "code": "srcTenantName", "width": "200"},
                {"name": "费用项目名称", "code": "itemName", "width": "150"},
                {"name": "单位", "code": "unit", "width": "120"},
                {"name": "不含税单价", "code": "price", "width": "120"},
                {"name": "税率", "code": "tax", "width": "100"},
                {"name": "含税价", "code": "priceWithTax", "width": "100"},
                {"name": "不含税金额", "code": "totalFee", "width": "100"},
                {"name": "含税金额", "code": "totalFeeWithTax", "width": "130"}
            ],
            feeMap: new Map(),
            costMap: new Map(),
            customerAreaMap: new Map(),
            customerItemAreaMap: new Map(),
            isReturnSrc: 0,
            income: 0,
            actualCost: 0,
            profitRate: 0,

            customerItemMap: new Map(),//
            feeListOld: [],
            costListOld: [],

            selOrderStockTotalInfo: {
                nums: 0,
                boxNums: 0,
                palletNums: 0,
                nums2: 0,
                boxNums2: 0,
                palletNums2: 0,
            },
        }
    },
    mounted()
    {
        this.loadWmsWaybillInfoByWmsWaybillId();
    },
    components: {
        dbTable
    },
    methods: {
        initTotalInfo()
        {
            return this.totalInfo = {
                num:0,
                returnNums:0,
                totalNum:0,
                totalFee:0,
                totalFeeWithTax:0,
                costNum:0,
                costReturnNums:0,
                costTotalNum:0,
                costTotalFee:0,
                costTotalFeeWithTax:0,
                palletNumsSum:0,
                actualCost:0,
            };
        },
        initTotalCostNum()
        {
            this.totalInfo.costNum = 0;
            this.totalInfo.costReturnNums = 0;
            this.totalInfo.costTotalNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            this.totalInfo.palletNumsSum = 0;
            this.totalInfo.actualCost = 0;
        },
        async loadWmsWaybillInfoByWmsWaybillId()
        {
            let data = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillInfoByWmsWaybillId", {id: this.id});
            this.waybillInfo = data.waybillInfo;
            this.isReturnSrc = data.waybillInfo.isReturn;
            this.costInfo = data.costInfo;
            this.list = data.list;
            this.feeList = data.feeList;
            this.costList = data.costList;
            this.feeListOld = this.common.copyObj(data.feeList);
            this.costListOld = this.common.copyObj(data.costList);

            let srcTenantIds = [];
            let materialIds = [];
            let workIds = [];
            data.list.forEach(item => {
                srcTenantIds.push(item.srcTenantId);
                materialIds.push(item.materialId);
                workIds.push(item.workId);

                let temp = this.customerAreaMap.get(item.srcTenantId);
                let area = this.common.accMul(item.palletNums2, item.perArea);
                let sumArea = this.common.accAdd(temp, area);
                this.customerAreaMap.set(item.srcTenantId, sumArea);

                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums, item.nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums, item.boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums, item.palletNums);
                this.totalInfo.nums2 = this.common.accAdd(this.totalInfo.nums2, item.nums2);
                this.totalInfo.boxNums2 = this.common.accAdd(this.totalInfo.boxNums2, item.boxNums2);
                this.totalInfo.palletNums2 = this.common.accAdd(this.totalInfo.palletNums2, item.palletNums2);
            })
            let feeList = await this.common.postUrl("wmsWaybillService", "getDeliverySaleFeeList", {srcTenantIds,materialIds,workIds});
            this.feeListSrc = this.common.copyObj(feeList);
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];
                this.customerItemAreaMap.set(item.itemId, this.customerAreaMap.get(item.srcTenantId));
            }
            let maxOnlyId = 0;
            for (let i = 0; i < this.feeList.length; i++) {
                let item = this.feeList[i];
                this.feeMap.set(item.srcTenantId + "_" + item.itemId, item.num);
                if (item.itemType == 104)
                {
                    this.customerItemMap.set(item.srcTenantId, item.num);
                }
                if (this.common.isBlank(item.returnNums))
                {
                    item.returnNums = 0;
                }
                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                for (let j = 0; j < this.feeListSrc.length; j++) {
                    let itemSrc = this.feeListSrc[j];
                    if (item.srcTenantId == itemSrc.srcTenantId && item.itemId == itemSrc.itemId)
                    {
                        item.onlyId = itemSrc.onlyId;
                    }
                    if (itemSrc.onlyId > maxOnlyId)
                    {
                        maxOnlyId = itemSrc.onlyId;
                    }
                }
                if (item.onlyId > 0) {}
                else
                {
                    item.onlyId = maxOnlyId;
                    maxOnlyId++;
                }
            }
            let costList = await this.common.postUrl("wmsWaybillService", "getWmsWaybillAbleCostList", {});
            this.costListSrc = this.common.copyObj(costList);
            for (let i = 0; i < costList.length; i++)
            {
                let item = costList[i];
                this.costMap.set(item.tenantId + "_" + item.itemId, item.num);
            }
            for (let i = 0; i < this.costList.length; i++) {
                let item = this.costList[i];
                item.supplierData = [];
                item.supplierData.push({
                    tenantId:item.tenantId,
                    tenantName:item.tenantName,
                });
                if (this.common.isBlank(item.returnNums))
                {
                    item.returnNums = 0;
                }
                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                item.disabled = item.isWorkOrder == 0;
                item.flag = item.isWorkOrder == 0;
                item.unitDisabled = item.itemType == 104 && item.unit == "元/车次";
            }
            this.calcFeeTotal(true);
            this.calcCostTotal(true);
            this.$forceUpdate();
        },
        calcFeeTotal(isInit)
        {
            this.totalInfo.num = 0;
            this.totalInfo.returnNums = 0;
            this.totalInfo.totalNum = 0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;
            for (let i = 0; i < this.feeList.length; i++) {
                let item = this.feeList[i];
                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                let num = item.totalNum;
                if (item.unit == "元/车次")
                {
                    num = 1;
                    item.disabled=true;
                }
                item.totalFee = this.common.accMul(num, item.price);
                item.totalFeeWithTax = this.common.accMul(num, item.priceWithTax);

                this.totalInfo.num = this.common.accAdd(this.totalInfo.num, item.num);
                this.totalInfo.returnNums = this.common.accAdd(this.totalInfo.returnNums, item.returnNums);
                this.totalInfo.totalNum = this.common.accAdd(this.totalInfo.totalNum, item.totalNum);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee, item.totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax, item.totalFeeWithTax);
            }
            this.$forceUpdate();
        },
        calcCostTotal(isInit)
        {
            this.totalInfo.costNum = 0;
            this.totalInfo.costReturnNums = 0;
            this.totalInfo.costTotalNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            this.totalInfo.palletNumsSum = 0;
            this.totalInfo.actualCost = 0;

            let sum = 0;
            for (let i = 0; i < this.costList.length; i++) {
                let item = this.costList[i];
                item.totalNum = this.common.accAdd(item.num, item.returnNums);
                let num = item.totalNum;
                if (item.unit == "元/车次")
                {
                    num = 1;
                }
                item.totalFee = this.common.accMul(num, item.price);
                item.totalFeeWithTax = this.common.accMul(num, item.priceWithTax);
                if (item.itemType == 104)
                {
                    sum = this.common.accAdd(sum, item.palletNumsSum);
                }
            }
            let sumPercent = 100;
            for (let i = 0; i < this.costList.length; i++) {
                let item = this.costList[i];
                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum, item.num);
                this.totalInfo.costReturnNums = this.common.accAdd(this.totalInfo.costReturnNums, item.returnNums);
                this.totalInfo.costTotalNum = this.common.accAdd(this.totalInfo.costTotalNum, item.totalNum);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee, item.totalFee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax, item.totalFeeWithTax);
                let palletNumsSum = item.palletNumsSum;
                if (isNaN(palletNumsSum))
                {
                    palletNumsSum = 0;
                }
                this.totalInfo.palletNumsSum = this.common.accAdd(this.totalInfo.palletNumsSum, palletNumsSum);
                if (!isInit && item.itemType == 104)
                {
                    if (sum == 0)
                    {
                        item.palletNumsPercent = 0;
                    }
                    else
                    {
                        item.palletNumsPercent = this.common.accDiv(palletNumsSum, sum);
                    }
                    item.palletNumsPercent = this.common.accMul(item.palletNumsPercent, 100);
                    sumPercent = this.common.accSub(sumPercent, item.palletNumsPercent);
                    if (i == this.costList.length - 1 && sumPercent > 0)
                    {
                        item.palletNumsPercent = this.common.accAdd(item.palletNumsPercent, sumPercent);
                    }
                    item.actualCost = this.common.accMul(item.totalFeeWithTax, item.palletNumsPercent);
                    item.actualCost = this.common.accDiv(item.actualCost, 100);
                }
                this.totalInfo.actualCost = this.common.accAdd(this.totalInfo.actualCost, item.actualCost);
            }

            this.income = this.totalInfo.totalFeeWithTax;
            this.actualCost = this.totalInfo.actualCost;
            if (this.actualCost > 0)
            {
                this.profitRate = this.common.accDiv(this.income, this.actualCost);
                this.profitRate = this.common.accMul(this.profitRate, 100).toFixed(2);
            }
            else
            {
                this.profitRate = 0;
            }
            this.$forceUpdate();
        },
        changeReturnNums()
        {
            let num = 0;
            if (!isNaN(this.costInfo.returnNums))
            {
                num = this.costInfo.returnNums;
            }
            for (let i = 0; i < this.feeList.length; i++) {
                let item = this.feeList[i];
                if (item.itemType == 104)//产品说配送的才有返程数量、最终之类的没有
                {
                    item.returnNums = num;
                }
                else
                {
                    item.returnNums = 0;
                }
            }
            for (let i = 0; i < this.costList.length; i++) {
                let item = this.costList[i];
                if (item.itemType == 104)//产品说配送的才有返程数量、最终之类的没有
                {
                    item.returnNums = num;
                    item.totalNum = this.common.accAdd(item.num, item.returnNums);
                    item.palletNumsSum = this.customerItemAreaMap.get(item.itemId);
                }
                else
                {
                    item.returnNums = 0;
                }
            }

            this.initTotalInfo();
            this.calcFeeTotal(false);
            this.calcCostTotal(false);
            this.$forceUpdate();
        },
        changeFeeItemReturnNums(item, index)
        {
            let returnNums = 0;
            if (item.returnNums)
            {
                returnNums = item.returnNums;
            }
            item.totalNum = this.common.accAdd(returnNums, item.num);
            item.totalFee = this.common.accMul(item.totalNum, item.price);
            item.totalFeeWithTax = this.common.accMul(item.totalNum, item.priceWithTax);
            this.$forceUpdate();
            this.calcFeeTotal(false);
            this.calcCostTotal(false);
        },
        changeCostItemReturnNums(item, index)
        {
            let returnNums = 0;
            if (item.returnNums)
            {
                returnNums = item.returnNums;
            }
            item.totalNum = this.common.accAdd(returnNums, item.num);
            item.totalFee = this.common.accMul(item.totalNum, item.price);
            item.totalFeeWithTax = this.common.accMul(item.totalNum, item.priceWithTax);
            this.$forceUpdate();
            this.calcFeeTotal(false);
            this.$nextTick(()=>{
                this.changeNum(item, index);
            })
        },
        open(){
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.dbTable.setRightData(this.common.copyObj(this.feeList));
                this.$refs.dbTable.setLeftData(this.common.copyObj(this.feeListSrc));
            })
        },
        saveChangeFeeItem()
        {
            let selectItem = this.$refs.dbTable.getRightData();
            this.feeList = [];
            for (let i = 0; i < selectItem.length; i++)
            {
                let item = selectItem[i];
                this.feeList.push(item);
            }
            this.isShowDialog = false;
            let specsTypeMap=new Map();
            let noUsedSpecsTypeSet=new Set();
            for (let i = 0; i < this.list.length; i++) {
                let item = this.list[i];
                let specsType = item.srcTenantId+"_"+item.specsType;
                if(noUsedSpecsTypeSet.has(specsType)){
                    let realNums = specsTypeMap.get(specsType+"nums");
                    let realBoxNums = specsTypeMap.get(specsType+"boxNums");
                    let realPalletNums = specsTypeMap.get(specsType+"palletNums");
                    specsTypeMap.set(specsType+"nums",this.common.accAdd(realNums,item.nums));
                    specsTypeMap.set(specsType+"boxNums",this.common.accAdd(realBoxNums,item.boxNums));
                    specsTypeMap.set(specsType+"palletNums",this.common.accAdd(realPalletNums,item.palletNums));
                }else{
                    specsTypeMap.set(specsType+"nums",item.nums);
                    specsTypeMap.set(specsType+"boxNums",item.boxNums);
                    specsTypeMap.set(specsType+"palletNums",item.palletNums);
                    noUsedSpecsTypeSet.add(specsType);
                }
            }
            //处理收入数量
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                let specsType = item.srcTenantId+"_"+item.specsType;
                noUsedSpecsTypeSet.delete(specsType);
                if (!item.returnNums && item.itemType == 104)
                {
                    item.returnNums = this.costInfo.returnNums;
                }
                let num = this.feeMap.get(item.srcTenantId + "_" + item.itemId);
                if (num > 0)
                {
                    item.num = num;//有配送原先数量的用原来的
                }
                else
                {
                    if (String(item.unit).indexOf('托') >= 0)
                    {
                        item.num = specsTypeMap.get(specsType+"palletNums");
                    }
                    else if (String(item.unit).indexOf('箱') >= 0)
                    {
                        item.num = specsTypeMap.get(specsType+"boxNums");
                    }
                    else if (String(item.unit).indexOf('车') >= 0)
                    {
                        item.num = 1;
                    }
                    else
                    {
                        if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('吨')>=0){
                            let realNums = 0;
                            for (let i = 0; i < this.list.length; i++) {
                                let materialSpecsType = this.list[i].srcTenantId+"_"+this.list[i].specsType;
                                if(materialSpecsType==specsType){
                                    if(this.list[i].unit!=6&&this.list[i].unit!=3){
                                        this.$message.error("物料:"+this.list[i].materialNum+"对应的管理单位不一致");
                                        return;
                                    }
                                    if(this.list[i].unit==6){
                                        realNums = this.common.accAdd(realNums,this.list[i].nums);
                                    }else{
                                        let tRealNums =this.common.accDiv(this.list[i].nums,1000);
                                        realNums = this.common.accAdd(realNums,tRealNums);
                                    }
                                }
                            }
                            item.num = realNums;
                        }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('件')>=0){
                            let itemNum = this.getItemNum(specsType,5,this.list);
                            if(itemNum==-1){
                                return;
                            }
                            item.num = itemNum;
                        }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('平方')>=0){
                            let itemNum = this.getItemNum(specsType,2,this.list);
                            if(itemNum==-1){
                                return;
                            }
                            item.num = itemNum;
                        }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('个')>=0){
                            let itemNum = this.getItemNum(specsType,1,this.list);
                            if(itemNum==-1){
                                return;
                            }
                            item.num = itemNum;
                        }else{
                            item.num = specsTypeMap.get(specsType+"nums");
                        }
                    }
                }
            }
            this.initTotalInfo();
            this.calcFeeTotal(false);
            //处理成本
            this.dealCostData(true);
            this.calcCostTotal(false);
            this.$forceUpdate();
        },
        getItemNum(specsType,unit,data){
            let realNums = 0;
            for (let i = 0; i < data.length; i++) {
                let materialSpecsType =  data[i].srcTenantId+"_"+data[i].specsType;
                if(materialSpecsType==specsType){
                    if(data[i].unit!=unit){
                        this.$message.error("物料:"+data[i].materialNum+"对应的管理单位不一致");
                        return -1;
                    }
                    if(data[i].unit==unit){
                        realNums = this.common.accAdd(realNums,data[i].nums);
                    }
                }
            }
            return realNums;
        },
        /**
         * 是否初始化所有成本
         * @param isClearAllCost
         */
        dealCostData(isClearAllCost)
        {
            if (isClearAllCost)
            {
                this.costList = [];
            }
            else
            {
                for (let i = 0; i < this.costList.length; i++)
                {
                    let item = this.costList[i];

                    if (item.itemType == 104)
                    {
                        this.costList.splice(i, 1);
                        i--;
                    }
                }
            }
            //遍历收入数据，相同的费用项目的成本保持一致，成本有针对客户的优先，没有则用默认的
            let feeList = this.feeList;
            let costListSrc = this.costListSrc;
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];//收入项目
                let cost = null;//成本
                let customerCost = null;
                let defaultCost = null;
                let supplierData = [];
                let isMatchWaybillCost = false;
                for (let j = 0; j < costListSrc.length; j++)
                {
                    let costItem = costListSrc[j];
                    if (item.itemId == costItem.itemId)//项目一样
                    {
                        if (this.common.isBlank(costItem.custTenantId))
                        {
                            if (this.common.isBlank(defaultCost))
                            {
                                defaultCost = this.common.copyObj(costItem);
                            }
                            else
                            {
                                if (costItem.price < defaultCost.price)
                                {
                                    defaultCost = this.common.copyObj(costItem);//成本去最低价
                                }
                            }

                            //短驳配送的报价特殊处理
                            if (costItem.itemType == 104)
                            {
                                defaultCost = null;
                                let detailList = costItem.detailList;//短驳仓配报价明细
                                if (detailList)
                                {
                                    for (let k = 0; k < detailList.length; k++)
                                    {
                                        let detailItem = detailList[k];
                                        if (item.endWorkId == detailItem.endWorkId
                                            && costItem.tenantId == this.waybillInfo.supplierTenantId
                                            && this.matchData(this.waybillInfo.quoteVehicleType ,detailItem.quoteVehicleType)
                                            && this.matchData(this.waybillInfo.vehicleLength ,detailItem.vehicleLength))
                                        {
                                            //匹配范围
                                            if (detailItem.unit == "元/车次")
                                            {
                                                defaultCost = this.common.copyObj(costItem);
                                                defaultCost.price = detailItem.price;
                                                defaultCost.priceWithTax = detailItem.priceWithTax;
                                                defaultCost.unit = detailItem.unit;
                                                defaultCost.contractDetailDetailId = detailItem.id;
                                                isMatchWaybillCost = true;
                                                break;
                                            }
                                            else
                                            {
                                                if (detailItem.beginRange <= item.num && item.num <= detailItem.endRange)
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
                            }

                        }
                        else
                        {
                            if (item.custTenantId == costItem.custTenantId)//有客户且客户和收入一致的才取
                            {
                                if (this.common.isBlank(customerCost))
                                {
                                    customerCost = this.common.copyObj(costItem);
                                }
                                else if(costItem.price < customerCost.price)
                                {
                                    customerCost = this.common.copyObj(costItem);
                                }

                                //短驳配送的报价特殊处理
                                if (costItem.itemType == 104)//短驳配送的报价特殊处理
                                {
                                    customerCost = null;
                                    let detailList = costItem.detailList;
                                    if (detailList)
                                    {
                                        for (let k = 0; k < detailList.length; k++)
                                        {
                                            let detailItem = detailList[k];
                                            if (item.endWorkId == detailItem.endWorkId
                                                && costItem.tenantId == this.waybillInfo.supplierTenantId
                                                && this.matchData(this.waybillInfo.quoteVehicleType ,detailItem.quoteVehicleType)
                                                && this.matchData(this.waybillInfo.vehicleLength ,detailItem.vehicleLength))
                                            {
                                                //匹配范围
                                                if (detailItem.unit == "元/车次")
                                                {
                                                    customerCost = this.common.copyObj(costItem);
                                                    customerCost.price = detailItem.price;
                                                    customerCost.priceWithTax = detailItem.priceWithTax;
                                                    customerCost.unit = detailItem.unit;
                                                    customerCost.contractDetailDetailId = detailItem.id;
                                                    isMatchWaybillCost = true;
                                                    break;
                                                }
                                                else
                                                {
                                                    if (detailItem.beginRange <= item.num && item.num <= detailItem.endRange)
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
                                }
                                //短驳配送的报价特殊处理

                            }
                        }
                        //去重放进去供应商
                        let isExist = false;
                        for (let k = 0; k < supplierData.length; k++)
                        {
                            let tenantItem = supplierData[k];
                            if (tenantItem.tenantId == costItem.tenantId)
                            {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist)
                        {
                            if (costItem.itemType == 104)//短驳的
                            {
                                if (isMatchWaybillCost)
                                {
                                    supplierData.push(costItem);
                                }
                            }
                            else
                            {
                                supplierData.push(costItem);
                            }
                        }
                    }
                }
                if (this.common.isNotBlank(customerCost))
                {
                    cost = this.common.copyObj(customerCost);//有客户的优先
                    cost.isWorkOrder = 1;
                    cost.disabled = false;
                    cost.flag = false;//是否作业一直都可选
                    cost.supplierData = supplierData;
                    cost.contractDetailDetailId = customerCost.contractDetailDetailId;
                }
                if (cost == null && this.common.isNotBlank(defaultCost))
                {
                    cost = this.common.copyObj(defaultCost);//无客户
                    cost.isWorkOrder = 1;
                    cost.disabled = false;
                    cost.flag = false;//是否作业一直都可选
                    cost.supplierData = supplierData;
                    cost.contractDetailDetailId = defaultCost.contractDetailDetailId;
                }
                if (cost == null)
                {
                    if (item.itemType != 104)// 短驳的匹配不出来不处理 后台报错
                    {
                        cost = {
                            itemId: item.itemId,
                            itemType: item.itemType,
                            itemTypeName: item.itemTypeName,
                            itemName: item.itemName,
                            unit: item.unit,
                            isWorkOrder: 0,
                            tenantId:null,
                            price:null,
                            tax:null,
                            priceWithTax:null,
                            num:null,
                            contractDetailDetailId:null,
                            disabled: true,
                            flag: true,
                        }
                    }
                }
                else
                {
                    cost.num = item.num;
                    cost.returnNums = item.returnNums;
                    cost.unitDisabled = false;
                    if (isMatchWaybillCost && '元/车次' == cost.unit)
                    {
                        cost.num = 1;
                        cost.unitDisabled = true;
                    }

                    let value = this.customerAreaMap.get(item.srcTenantId);//客户总托面积
                    if (item.itemType == 104)
                    {
                        cost.palletNumsSum = value;
                        cost.palletNumsPercent = null;
                        cost.actualCost = null;
                    }
                    else
                    {
                        cost.palletNumsSum = '-';
                        cost.palletNumsPercent = '-';
                        cost.actualCost = null;
                    }
                }
                if (this.common.isNotBlank(cost))
                {
                    if (isClearAllCost)
                    {
                        this.costList.push(cost);
                    }
                    else
                    {
                        if (cost.itemType == 104)
                        {
                            this.costList.push(cost);
                        }
                    }
                }
            }
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
        changeSupplier(item, index) {
            this.$nextTick(()=>{
                this.dealPriceTaxFee(item, index, 1);
            })
        },
        changeSwitch()
        {
            this.waybillInfo.isReturn = this.waybillInfo.isReturn == 1 ? 0 : 1;
            this.initTotalInfo();
            if (this.waybillInfo.isReturn == 1)
            {
                for (let i = 0; i < this.feeList.length; i++)
                {
                    let item = this.feeList[i];//收入项目
                    if (item.itemType == 104)
                    {
                        this.feeList.splice(i, 1);
                        i--;
                    }
                }
                for (let i = 0; i < this.costList.length; i++)
                {
                    let item = this.costList[i];//收入项目
                    if (item.itemType == 104)
                    {
                        this.costList.splice(i, 1);
                        i--;
                    }
                }
                //重新匹配往返的
                for (let i = 0; i < this.feeListSrc.length; i++)
                {
                    let item = this.feeListSrc[i];
                    if(item.itemType != 104){
                        if (this.common.isBlank(item.returnNums))
                        {
                            item.returnNums = 0;
                        }
                        continue;
                    }
                    if((this.common.isBlank(item.quoteVehicleType)||item.quoteVehicleType==this.waybillInfo.quoteVehicleType)
                        &&(this.common.isBlank(item.vehicleLength)||item.vehicleLength==this.waybillInfo.vehicleLength)
                        && item.subItemType && this.waybillInfo.isReturn==item.subItemType-9
                        && this.waybillInfo.isUrgent == item.urgent){//往返判断

                        let num = this.customerItemMap.get(item.srcTenantId);
                        if (this.common.isBlank(item.num))
                        {
                            item.num = num;
                        }
                        if (this.common.isBlank(item.returnNums))
                        {
                            item.returnNums = this.costInfo.returnNums;
                        }
                        let flag = true;
                        for (let j = 0; j < this.feeList.length; j++) {
                            if(this.feeList[j].onlyId==item.onlyId){
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            this.feeList.push(item);
                        }
                    }
                }
                this.calcFeeTotal(false);
                //处理成本
                this.dealCostData(false);//
                this.calcCostTotal(false);
                this.$forceUpdate();
            }
            else
            {
                this.feeList = this.common.copyObj(this.feeListOld);
                this.costList = this.common.copyObj(this.costListOld);
                if (this.common.isNotBlank(this.costInfo.returnNums))
                {
                    for (let i = 0; i < this.feeList.length; i++)
                    {
                        let item = this.feeList[i];//收入项目
                        if (item.itemType == 104)
                        {
                            item.returnNums = this.costInfo.returnNums;
                        }
                        else
                        {
                            if (this.common.isBlank(item.returnNums))
                            {
                                // item.returnNums = this.costInfo.returnNums;
                                item.returnNums = 0;
                            }
                        }
                    }
                    for (let i = 0; i < this.costList.length; i++)
                    {
                        let item = this.costList[i];//收入项目
                        if (item.itemType == 104)
                        {
                            item.returnNums = this.costInfo.returnNums;
                        }
                        else
                        {
                            if (this.common.isBlank(item.returnNums))
                            {
                                // item.returnNums = this.costInfo.returnNums;
                                item.returnNums = 0;
                            }
                        }
                    }
                }
                this.calcFeeTotal(false);
                this.calcCostTotal(false);
                this.$forceUpdate();
            }
            this.$forceUpdate();
        },
        changeCostSwitch(item, index) {
            item.isWorkOrder = item.isWorkOrder == 1 ? 0 : 1;
            item.disabled = item.isWorkOrder == 0;
            this.$forceUpdate();
            this.dealPriceTaxFee(item, index, 0);
        },
        async changeNum(item, index)
        {
            this.$forceUpdate();
            if (item.returnNums > 0)
            {
                await this.dealPriceTaxFee(item, index, 0);
            }
            await this.calcCostTotal(false);
        },
        dealPriceTaxFee(data, index, isFromChangeTenant)
        {
            this.initTotalCostNum();
            if (data.isWorkOrder == 0)
            {
                data.tenantId = null;
                data.price = null;
                data.tax = null;
                data.priceWithTax = null;
                data.returnNums = null;
                data.totalFee = null;
                data.contractDetailDetailId = null;
                data.totalFeeWithTax = null;
                data.disabled = true;
            }
            else
            {
                let feeList = this.feeList;
                let feeData = {};//相同itemId的费用数据
                for (let i = 0; i < feeList.length; i++)
                {
                    let fee = feeList[i];
                    if (fee.itemId == data.itemId)
                    {
                        feeData = fee;
                        if (i == index)
                        {
                            break;
                        }
                    }
                }
                //收入有A客户a项目的数据  成本如果存在A客户a项目优先
                let customerCost = null;
                let defaultCost = null;
                let waybillInfo = this.waybillInfo;
                data.unitDisabled = false;
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.costListSrc[j];
                    if (data.itemId == costItem.itemId)//项目一样
                    {
                        if (this.common.isBlank(costItem.custTenantId))
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
                            else //有其他客户的匹配过
                            {
                                if (isFromChangeTenant == 1)//选择改变供应商触发的说明有供应商存在
                                {
                                    if (data.tenantId == costItem.tenantId)
                                    {
                                        defaultCost = this.common.copyObj(costItem);//成本去最低价
                                    }
                                }
                                else if (costItem.price < defaultCost.price)
                                {
                                    defaultCost = this.common.copyObj(costItem);//成本去最低价
                                }
                            }

                            //短驳的重新匹配
                            if (costItem.itemType == 104)//短驳配送的报价特殊处理
                            {
                                defaultCost = null;
                                let detailList = costItem.detailList;//短驳仓配报价明细
                                if (detailList)
                                {
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
                                                    defaultCost.contractDetailDetailId = detailItem.id;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        else
                        {
                            if (isFromChangeTenant == 1)
                            {
                                if (data.tenantId == costItem.tenantId && feeData.custTenantId == costItem.custTenantId)
                                {
                                    customerCost = this.common.copyObj(costItem);
                                }
                            }
                            else
                            {
                                if (feeData.custTenantId == costItem.custTenantId)//有客户且客户和收入一致的才取
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
                            if (costItem.itemType == 104)
                            {
                                customerCost = null;
                                let detailList = costItem.detailList;
                                if (detailList)
                                {
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
                                                    customerCost.contractDetailDetailId = detailItem.id;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //短驳配送的报价特殊处理
                        }
                    }
                }
                let flag = false;
                if (this.common.isNotBlank(customerCost))
                {
                    data.price = customerCost.price;
                    data.tax = customerCost.tax;
                    data.priceWithTax = customerCost.priceWithTax;
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
                    data.contractDetailDetailId = defaultCost.contractDetailDetailId;
                    if (isFromChangeTenant == 0)
                    {
                        data.tenantId = defaultCost.tenantId;
                    }
                }
                if (!data.returnNums)
                {
                    data.returnNums = feeData.returnNums;
                }
            }
            this.calcCostTotal(false);//换价格重新计算合计
            this.$forceUpdate();
        },
        async sureWaybill()
        {
            if (this.waybillInfo.isReturn == 1)
            {
                if (this.common.isBlank(this.costInfo.returnNums) || this.costInfo.returnNums <= 0)
                {
                    this.$message.error("返程配送单的返程数量不能为空！");
                    return;
                }
            }
            let param = {
                id: this.$route.query.id,
                isReturn: this.waybillInfo.isReturn,
                returnNums: this.costInfo.returnNums,
                feeList: this.feeList,
                costList: this.costList,
                income:this.income,
                actualCost:this.actualCost,
                profitRate:this.profitRate,
            };
            let hasNoRerurn = false;
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];//收入项目
                for (let j = 0; j < this.feeListSrc.length; j++)
                {
                    let itemSrc = this.feeListSrc[j];
                    if (item.itemId == itemSrc.itemId && itemSrc.subItemType == 9)//单程
                    {
                        hasNoRerurn = true;
                    }
                }
            }
            let that = this;
            if (this.isReturnSrc != this.waybillInfo.isReturn)
            {
                //如果选择了返程，但费用项目为单程，
                // 提示：已变更为返程配送，而费用项目为： 短驳配送-单程-标准规格，是否继续？
                if (this.waybillInfo.isReturn == 1 && hasNoRerurn)
                {
                    this.$confirm("已变更为返程配送，费用选择包含单程项目，是否继续?", "提示", {
                        center: true
                    }).then(() =>{
                        that.doSure(param);
                    }).catch(() =>{})
                }
                else
                {
                    that.doSure(param);
                }
            }
            else
            {
                that.doSure(param);
            }
        },
        doSure(param)
        {
            let that = this;
            this.common.postUrl("wmsWaybillService", "sureWmsWaybillInfoById", param, function (data)
            {
                that.$message.success("确认成功!");
                that.closePage();
            });
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
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
        }
    },
}
