import selStock from "@/page/pt/wms/waybill/selStock.vue";
import orderStock from "@/page/pt/wms/waybill/subpage/orderStock.vue";
import waybillInfo from "@/page/pt/wms/waybill/subpage/waybillInfo.vue";
import feeInfo from "@/page/pt/wms/waybill/subpage/feeInfo.vue";
import costInfo from "@/page/pt/wms/waybill/subpage/costInfo.vue";
import costList from "@/page/pt/wms/waybill/subpage/costList.vue";

export default {
    name: 'wmsWaybill',
    data()
    {
        return {
            isShowMain: this.common.isBlank(this.$route.query.id),//是否展示配送单数据主界面，新增默认是打开出入库选择单界面的
            id: this.$route.query.id,
            isMatchOrderFee: true,
            income: 0,
            actualCost: 0,
            profitRate: 0,
            type:1,//默认是1就是新增修改，2是新版的确认送达
            isReturn: 0,
            modifyFlag: false,
            // 添加超时相关字段
            showDispatchDialog: false, // 控制配送对话框显示
            isTimeout: false, // 是否超时
            timeoutReasonData: [], // 超时原因枚举
            timeoutReasonSelect: '', // 选中的超时原因
            dispatchParam: null, // 保存配送参数
        }
    },
    mounted()
    {
        if (this.common.isNotBlank(this.$route.query.type))//类型
        {
            this.type= Number.parseInt(this.$route.query.type);
        }
        if (this.common.isNotBlank(this.$route.query.id))//修改加载数据
        {
            this.modifyFlag = true;
            this.initLoadWaybillData(this.$route.query.id).then(() => {});
        }
    },
    components: {
        feeInfo,
        orderStock,
        waybillInfo,
        selStock,
        costInfo,
        costList,
    },
    methods: {
        async initLoadWaybillData(id)
        {
            this.isMatchOrderFee = false;//不匹配报价
            let that = this;
            let data = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillInfoByWmsWaybillId", {id});
            that.actualCost = data.costInfo.actualCost;
            that.income = data.costInfo.income;
            that.profitRate = data.costInfo.profitRate;

            await this.$refs.costList.initCostSrcData(data.list);
            this.$nextTick(async () => {
                //初始化其他数据
                this.$refs.selStock.initData(data.list);//设置右边已选
                this.$refs.waybillInfo.initData(data.waybillInfo);
                this.$refs.orderStock.initData({selectItem: data.list}, false);
                if(this.type==1){
                    this.$refs.feeInfo.initData(data.feeList, data.list);
                    this.$refs.costList.initCostList(data.costList, true);
                }else{
                    this.isReturn = Number.parseInt(data.waybillInfo.isReturn);
                    await this.$refs.feeInfo.changeFeeList(data.waybillInfo);
                    this.$nextTick(()=> {
                        that.dealCostData()
                    });
                }
                this.$forceUpdate();
                setTimeout(() => {
                    that.calcProfit();
                    that.isMatchOrderFee = true;//3秒后自动放开
                }, 3000)
            })
        },
        back()
        {
            this.isShowMain = true;
        },
        /**
         * 下一步
         * @returns {Promise<boolean>}
         */
        async next()
        {
            let selectItem = this.$refs.selStock.getSelectItem();
            if (selectItem.length <= 0) {
                this.$message.error("请至少选择一个出库物料!");
                return false;
            }
            let set = new Set();
            for (let i in selectItem) {
                set.add(selectItem[i].type);
                if (set.size > 1) {
                    this.$message.error("出库单和入库单不能同时配送！");
                    return false;
                }
            }
            this.isShowMain = false;
            //填充组成配送单的出入库数据
            await this.$refs.orderStock.initData({selectItem}, true);
            //新增的时候 获取当前仓库的默认供应商
            if (this.common.isBlank(this.id)){
                // let data = await this.common.postUrl("wmsWaybillService", "getTenantIdByWorkId", {});
                // this.$nextTick(() => {
                //     this.$refs.waybillInfo.initTenantId(data.transportTenantId);
                // })
            }
            //处理运输成本
            let count = 0;
            let nums = 0;
            for (let i in selectItem) {
                let item = selectItem[i];
                let palletNums = item.palletNums;
                let palletNums2 = item.palletNums2;
                let perPalletNums = item.perPalletNums;
                count = this.common.accAdd(count, palletNums2);
                //计算吨数
                if (this.common.isBlank(perPalletNums))
                {
                    perPalletNums = 1;
                }
                let pre = this.common.accMul(palletNums2, perPalletNums);
                nums = this.common.accAdd(nums, pre);//总吨数
            }
            await this.$refs.feeInfo.init(selectItem);
            await this.$refs.costList.initCostSrcData(selectItem);
            //初始化费用项目收入数据
            //初始化成本可选下拉数据
            this.$nextTick(()=>{
                this.dealCostData();
            })
            this.$forceUpdate();
        },
        getAllOrderStock()
        {
            return this.$refs.orderStock.getData();
        },
        getWaybillInfo()
        {
            return this.$refs.waybillInfo.getData();
        },
        getFeeInfoFeeList()
        {
            return this.$refs.feeInfo.getData();
        },
        /**
         * 改变可配送数量
         */
        changeNums()
        {
            let that = this;
            this.$nextTick(async() => {
                await that.$refs.feeInfo.initFeeNum(that.$refs.orderStock.getData());
                await that.$refs.feeInfo.calFeeTotal();
                that.dealCostData();
            })
        },
        changeReturnNums()
        {
            let waybillInfo = this.$refs.waybillInfo.getData();

            let num = 0;
            if (!isNaN(waybillInfo.returnNums))
            {
                num = waybillInfo.returnNums;
            }
            let that = this;
            this.$nextTick(async() => {
                await that.$refs.feeInfo.initFeeNum(that.$refs.orderStock.getData(),num);
                await that.$refs.feeInfo.calFeeTotal();
                that.dealCostData(num);
            })
            this.$forceUpdate();
        },

        setFeeInfoNum(num)
        {
            this.$refs.feeInfo.setNum(num);
        },
        dealCostData(num=0)
        {
            this.$refs.costList.costList = [];
            //遍历收入数据，相同的费用项目的成本保持一致，成本有针对客户的优先，没有则用默认的
            let feeList = this.getFeeInfoFeeList();
            let costListSrc = this.$refs.costList.getCostListSrcData();
            let waybillInfo = this.$refs.waybillInfo.getData();
            let selectItem = this.getAllOrderStock();
            let customerAreaMap = new Map();
            for (let i = 0; i < selectItem.length; i++)
            {
                let item2 = selectItem[i];
                if (customerAreaMap.has(item2.srcTenantId))
                {
                    //Jimmy 2024年6-27号提出  上面物料有托数下面的成本就要有  如果物料托装容数是0的按托数算占比
                    let tmp = customerAreaMap.get(item2.srcTenantId);
                    let area = this.common.accMul(item2.palletNums2, item2.perArea);
                    let sum = this.common.accAdd(tmp, area);
                    customerAreaMap.set(item2.srcTenantId, sum);
                }
                else
                {
                    let area = this.common.accMul(item2.palletNums2, item2.perArea);
                    customerAreaMap.set(item2.srcTenantId, area);
                }
            }
            //根据收入匹配成本数据
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];//收入项目
                let cost = null;//成本
                let customerCost = null;//有指定客户的成本
                let defaultCost = null;//无客户成本
                let supplierData = [];//对应的供应商下拉数据
                let isMatchWaybillCost = false;
                for (let j = 0; j < costListSrc.length; j++)
                {
                    let costItem = this.common.copyObj(costListSrc[j]);
                    if (item.itemId == costItem.itemId)//收入成本项目一样的
                    {
                        //没有客户的成本数据
                        if (this.common.isBlank(costItem.custTenantId))
                        {
                            //短驳配送的报价特殊处理
                            if (costItem.itemType == 104)
                            {
                                if (!isMatchWaybillCost)
                                {
                                    defaultCost = null;
                                }
                                let detailList = costItem.detailList;//短驳仓配报价明细
                                if (this.common.isBlank(detailList) || detailList.length == 0)
                                    continue;

                                let isContinue = false;
                                for (let k = 0; k < detailList.length; k++)
                                {
                                    let detailItem = detailList[k];
                                    if (item.endWorkId == detailItem.endWorkId
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
                                            defaultCost.unit = detailItem.unit;
                                            defaultCost.contractDetailDetailId = detailItem.id;
                                            isMatchWaybillCost = true;
                                            isContinue = true;
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
                                                isContinue = true;
                                            }
                                        }
                                    }
                                }
                                if (!isContinue)
                                {
                                    continue;
                                }
                            }
                            else
                            {
                                if (this.common.isBlank(defaultCost))
                                {
                                    defaultCost = this.common.copyObj(costItem);
                                }
                                else
                                {
                                    if (costItem.price < defaultCost.price)//成本去最低价
                                    {
                                        defaultCost = this.common.copyObj(costItem);
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (item.custTenantId == costItem.custTenantId)//有客户且客户和收入一致的才取
                            {
                                if (costItem.itemType == 104)//短驳配送的报价特殊处理
                                {
                                    if (!isMatchWaybillCost)
                                    {
                                        customerCost = null;
                                    }
                                    let detailList = costItem.detailList;
                                    if (this.common.isBlank(detailList) || detailList.length == 0)
                                        continue;

                                    let isContinue = false;
                                    for (let k = 0; k < detailList.length; k++)
                                    {
                                        let detailItem = detailList[k];
                                        if (item.endWorkId == detailItem.endWorkId
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
                                                customerCost.unit = detailItem.unit;
                                                customerCost.contractDetailDetailId = detailItem.id;
                                                isMatchWaybillCost = true;
                                                isContinue = true;
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
                                                    isContinue = true;
                                                }
                                            }
                                        }
                                    }
                                    if (!isContinue)
                                    {
                                        continue;
                                    }
                                }
                                else
                                {
                                    if (this.common.isBlank(customerCost))
                                    {
                                        customerCost = this.common.copyObj(costItem);
                                    }
                                    else if(costItem.price < customerCost.price)
                                    {
                                        customerCost = this.common.copyObj(costItem);
                                    }
                                }
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
                    cost.unit = customerCost.unit;
                    cost.isWorkOrder = 1;
                    cost.disabled = false;
                    cost.flag = false;//是否作业一直都可选
                    cost.supplierData = supplierData;
                    cost.contractDetailDetailId = customerCost.contractDetailDetailId;
                }
                if (cost == null && this.common.isNotBlank(defaultCost))
                {
                    cost = this.common.copyObj(defaultCost);//无客户
                    cost.unit = defaultCost.unit;
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
                    cost.unitDisabled = false;
                    if (isMatchWaybillCost && '元/车次' == cost.unit)
                    {
                        cost.num = 1;
                        cost.actualCost = cost.priceWithTax;
                        cost.unitDisabled = true;
                    }
                    let value = customerAreaMap.get(item.srcTenantId);//客户总托面积
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
                    this.$refs.costList.costList.push(cost);
                }
            }
            this.$refs.costList.calcCostTotal(false,num);
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
        calcProfit()
        {
            this.$nextTick(()=>{
                this.income = this.$refs.feeInfo.totalInfo.totalFeeWithTax;
                this.actualCost = this.$refs.costList.total.actualCost;
                if (this.income > 0)
                {
                    let profit = this.common.accSub(this.income, this.actualCost);
                    this.profitRate = this.common.accDiv(profit, this.income);
                    this.profitRate = this.common.accMul(this.profitRate, 100).toFixed(2);
                }
                else
                {
                    this.profitRate = 0;
                }
            })
        },
        /**
         * 获取报价
         */
        async matchOrderFee()
        {
            if (!this.isMatchOrderFee)
            {
                return;
            }
            let waybillInfo = this.$refs.waybillInfo.getData();
            this.isReturn = Number.parseInt(waybillInfo.isReturn);
            await this.$refs.feeInfo.changeFeeList(waybillInfo);
            this.$nextTick(()=> {
                this.dealCostData()
            });
            this.$forceUpdate();


            //2024 后面的成本不从这里匹配报价了
            if (true)
            {
                return;
            }
            if (this.common.isBlank(waybillInfo.supplierTenantId))
                return;
            let costInfo = this.$refs.costInfo.getData();
            if (costInfo && (this.common.isBlank(costInfo.billingType) || this.common.isBlank(costInfo.quoteVehicleType)))
                return;
            if (costInfo && costInfo.billingType == 1 && this.common.isBlank(waybillInfo.vehicleLength))
                return;

            let workList = this.getAllOrderStock();
            let count = 0;

            let actualWorkList = [];
            let set = new Set();
            for (let i = 0; i < workList.length; i++)
            {
                let workId = workList[i].workId;
                // let type = workList[i].type;
                // if (type == 1)
                // {
                // }
                // else
                // {
                    if (this.common.isNotBlank(workId))
                    {
                        count++;
                        set.add(workId);
                        actualWorkList.push(workList[i]);
                    }
                // }
            }
            if (costInfo && set.size > 1 && costInfo.quoteVehicleType == 2)
            {
                this.$message.warning("出库单库存在多条不同的作业点,计费方式只能选按趟才能匹配报价！");
                return;
            }
            if (costInfo && count >= 1)//至少选择两个有效点才去匹配
            {
                let param =
                    {
                        tenantId: waybillInfo.supplierTenantId,
                        billingType: costInfo.billingType,
                        quoteVehicleType: costInfo.quoteVehicleType,
                        vehicleLength: waybillInfo.vehicleLength,
                        workList: actualWorkList,
                        isReturn: waybillInfo.isReturn,//是否返程
                    }
                let that = this;
                that.common.postUrl("quoteService", "matchCost", param, async function (data)
                {
                    if (that.$refs.costInfo)
                    {
                        that.$refs.costInfo.setFreightPrice(data.feePrice, workList);
                    }
                });
            }
        },
        async dispatch()
        {
            let param = this.$refs.waybillInfo.getData();
            if (this.common.isBlank(param.supplierTenantId))
            {
                this.$message.error("请选择供应商!");
                return;
            }
            if (this.common.isBlank(param.vehicleId))
            {
                this.$message.error("请选择车辆!");
                return;
            }
            if (this.common.isBlank(param.driverUserId))
            {
                this.$message.error("请选择司机!");
                return;
            }
            param.list = this.$refs.orderStock.getData();
            let toNext = true;
            for(let i = 0; i < param.list.length; i++)
            {
                let item = param.list[i];
                if (this.common.isBlank(item.palletNums2))
                {
                    this.$message.error("请输入出库物料信息第" + (i + 1) + "行的配送托数!");
                    return;
                }
                if (item.palletNums2<=0)
                {
                    this.$message.error("出库物料信息第" + (i + 1) + "行的配送托数小于等于0!");
                    return;
                }
                if(item.nums != item.nums2 || item.boxNums != item.boxNums2 || item.palletNums2 != item.palletNums2){
                    toNext = false;
                }
            }

            // 检查是否超时
            this.isTimeout = await this.common.postUrl("wmsTimeLimitTF", "isTimeout", {
                opType: 3, // 配送操作类型
                outOrderInfo:param.list,
            });

            // 保存参数
            this.dispatchParam = param;
            this.dispatchToNext = toNext;

            // 如果超时，加载超时原因数据
            if (this.isTimeout) {
                this.timeoutReasonData = await this.common.postUrl("commonTF", "getSysStaticData", {
                    codeType: "TIMEOUT_REASON3"
                });
                this.timeoutReasonSelect = '';
                // 显示对话框
                this.showDispatchDialog = true;
            }else{
                this.confirmDispatch();
            }
        },

        /**
         * 确认配送操作
         */
        async confirmDispatch() {
            // 验证超时原因
            if (this.isTimeout && !this.timeoutReasonSelect) {
                this.$message.error('请选择超时原因');
                return;
            }

            // 关闭对话框
            this.showDispatchDialog = false;

            // 处理配送逻辑
            if(!this.dispatchToNext){
                this.$confirm("出/入库数据与配送数据不对应，是否确认继续配送", "提示", {
                    center: true
                }).then(() =>{
                    this.sureDispatch(this.dispatchParam);
                }).catch(() =>{})
            }else{
                this.sureDispatch(this.dispatchParam);
            }
        },
        // 确认配送
        async sureDispatch(param){
            // 添加超时原因参数
            if (this.isTimeout) {
                param.timeoutReason = this.timeoutReasonSelect;
            }

            // let costInfo = this.$refs.costInfo.getData();
            // if (this.common.isBlank(costInfo.billingType))
            // {
            //     this.$message.error("请选择计费方式!");
            //     return;
            // }
            // if (this.common.isBlank(costInfo.quoteVehicleType))
            // {
            //     this.$message.error("请选择报价车型!");
            //     return;
            // }
            // if (this.common.isBlank(costInfo.freight) && costInfo.billingType != 3)
            // {
            //     this.$message.error("请输入运费金额!");
            //     return;
            // }
            // param = this.common.mergeObj(param, costInfo);
            let id = param.id;
            param.feeList = this.$refs.feeInfo.getData();
            for(let i = 0; i < param.feeList.length; i++)
            {
                let item = param.feeList[i];
                if (this.common.isBlank(item.num)||item.num<=0)
                {
                    this.$message.error("请输入短驳配送收入第" + (i + 1) + "行的数量!");
                    return;
                }
            }
            param.costList = this.$refs.costList.getData();
            for(let i = 0; i < param.costList.length; i++)
            {
                let item = param.costList[i];
                if (item.isWorkOrder == 1 && (this.common.isBlank(item.num)||item.num<=0))
                {
                    this.$message.error("请输入短驳配送成本第" + (i + 1) + "行的数量!");
                    return;
                }
            }

            let waybillInfo = this.$refs.waybillInfo.getData();
            param.id = id;
            param.disableIds = this.$refs.feeInfo.getDisableIds();
            param.ableIds = this.$refs.feeInfo.getAbleIds();
            param.isReturn = waybillInfo.isReturn;
            param.returnNums = waybillInfo.returnNums;
            param.type = this.type;
            param.income = this.income;
            param.actualCost = this.actualCost;
            param.profitRate = this.profitRate;

            await this.common.postUrl("wmsWaybillService", "saveOrUpdateWmsWaybill", param);
            if(this.type==2){
                this.$message.success("确认成功");
            }else{
                this.$message.success("配送成功");
            }
            this.quit();
        },
        quit()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        }
    },
}