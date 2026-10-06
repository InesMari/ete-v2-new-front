import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker";
import enumData from "@/page/pt/enum.js"
import dbTable from "@/components/dbTable/dbTable.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'wmsPackMaterialRegister',
    data()
    {
        return {
            record: this.initRecord(),//默认 回收入VMI仓 下面默认展示来源地
            dealTypeData: [],//登记类型
            tipName: '来源地',//默认来源地
            deviceData: [],//器具数据
            tenantData: [],//所属人
            tenantData2: [],//使用客户
            workData: [],//来源地/交付地
            supplierData: [],//供应商
            useTenantData: [],//到货厂商
            detailList: [this.initDetailItem()],//器具登记明细
            totalInfo: {
                num: 0,
                totalFee: 0,
                totalFeeWithTax: 0,

                costNum: 0,
                costTotalFee: 0,
                costTotalFeeWithTax: 0,
            },
            //费用项设置展示不展示相关
            isShowDialog: false,//费用设置
            feeHead: [
                {"name": "费用类型", "code": "itemTypeName", "width": "110"},
                {"name": "费用项目名称", "code": "itemName", "width": "200"},
                {"name": "客户名称", "code": "srcTenantName", "width": "200"},
                {"name": "单位", "code": "unit", "width": "110"},
                {"name": "不含税单价", "code": "price", "width": "110"},
                {"name": "税率", "code": "tax", "width": "110"},
                {"name": "含税价", "code": "priceWithTax", "width": "110"},
            ],
            feeList: [],//收入相关
            feeListSrc: [],
            costList: [],//成本数据
            costListSrc: [],
            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,//日期快捷方式
        }
    },
    mounted()
    {
        this.initData();
        this.common.tableStretch(this.$refs.feeDetail);
        this.common.tableStretch(this.$refs.costDetail);
    },
    components: {
        tableCommon,
        myElDatePicker,
        enumData,
        dbTable,
        myFileModel
    },
    methods: {
        async initData()
        {
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
            this.tenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1});
            this.tenantData2 = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.costListSrc = await this.common.postUrl("deviceRecordService", "getDeviceRecoveryCostList", {});
            let dealTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEV_DEVICE_OP_TYPE"});
            for (let i = 0; i < dealTypeData.length; i++)
            {
                let item = dealTypeData[i];
                if (item.codeValue != 3 && item.codeValue != 4 && item.codeValue != 5)
                {
                    dealTypeData.splice(i, 1);
                    i--;
                }
            }
            this.dealTypeData = dealTypeData;
            //默认加载来源地
            await this.loadWorkData(1, 1, 1);
        },
        async loadWorkData(isWmsWork, isLoadStoreHouse, isLoadSrcTenantWork, useTenantId)
        {
            this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect",
                {isWmsWork, isLoadStoreHouse, isLoadSrcTenantWork, useTenantId});
            if (this.workData && this.workData.length == 1)
            {
                this.record.workId = this.workData[0].workId;
            }
            this.$forceUpdate();
        },
        initRecord()
        {
            return this.record = {
                dealType: '3',//默认回收入VMI仓
                actualDate: '',
                workId: '',
                remark: '',
            };
        },
        initDetailItem()
        {
            return {
                deviceId: '',
                spec: null,
                useTenantId: null,
				srcTenantId: null,
                dealNum: null,
                fee: null,
                useTenantDisable: true,
            }
        },
        /**
         * 添加器具登记明细行
         */
        addDetailItem()
        {
            this.detailList.push(this.initDetailItem());
        },
        /**
         * 移除器具登记明细行
         * @param item
         * @param index
         * @returns {boolean}
         */
        removeDetailItem(item, index)
        {
            if (this.detailList.length <= 1)
            {
                this.$message.error("至少需要保留一条器具登记明细！");
                return false;
            }
            this.detailList.splice(index, 1);
            this.forceUpdate();
        },
        /**
         * 移除收入费用行
         * @param item
         * @param index
         * @returns {boolean}
         */
        removeFeeItem(item, index)
        {
            this.feeList.splice(index, 1);
            this.forceUpdate();
        },
        //改变登记类型
        async changeDealType()
        {
            this.tipName = this.record.dealType == 4 ? "交付地" : "来源地";
            this.record.workId = null;
            this.workData = [];
            this.feeList = [];//置空费用  改变了登记类型意味重新选择所有东西
            this.costList = [];//置空成本
            if (this.record.dealType == 4)//返回到货厂商
            {
                let set = new Set();
                for (let i = 0; i < this.detailList.length; i++)
                {
                    let item = this.detailList[i];
                    if (this.common.isNotBlank(item.useTenantId))
                    {
                        set.add(item.useTenantId);
                    }
                }
                if (set.size > 1)
                {
                    this.$message.error("一次返回到货厂商登记只能选择一个使用客户的器具！");
                    return false;
                }
                else if (set.size == 1)
                {
                    let tenantId = set.values().next().value;
                    if(tenantId!=1){
                        await this.loadWorkData(0, 0, 1, tenantId);
                    }else{
                        await this.loadWorkData(1, 0, 1);
                    }
                }else{
                    await this.loadWorkData(1, 0, 1);
                }
            }
            else
            {
                await this.loadWorkData(1, 1, 1);
            }
            this.$forceUpdate()
        },
        async openSelectDialog(flag)
        {
            //追加是否已经选择使用客户校验
            if (flag)
            {
                if (this.common.isBlank(this.record.dealType))
                {
                    this.$message.error("请先选择登记类型！");
                    return false;
                }
                await this.getDeviceRecoveryFeeList();
                this.isShowDialog = true;
                await this.open();
            }
            else
            {
                this.isShowDialog = false;
            }
            this.$forceUpdate();
        },
        async open()
        {
            this.$nextTick(async () =>
            {
                this.$refs.dbTable.setRightData(this.common.copyObj(this.feeList));
                this.$refs.dbTable.setLeftData(this.common.copyObj(this.feeListSrc));
            });
        },
        /**
         * 改变器具登记明细的数量
         */
        changeDealNum()
        {
            let totalDealNum = 0;
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                if (this.common.isNotBlank(item.dealNum) && !isNaN(item.dealNum))
                {
                    totalDealNum = this.common.accAdd(totalDealNum, item.dealNum);
                }

                //处理数据
                if(item.useTenantId&&item.deviceId){
                    for (let j = 0; j < this.tenantData2.length; j++) {
                        if(item.useTenantId==this.tenantData2[j].wId){
                            let parentId = this.tenantData2[j].parentId;
                            for (let k = 0; k < this.feeList.length; k++) {
                                if(this.feeList[k].deviceId==item.deviceId&&this.feeList[k].srcTenantId==parentId){
                                    this.feeList[k].num = item.dealNum;
                                }
                            }
                        }
                    }
                }
            }
            this.calItemFee();
            this.dealCostData();
            this.$forceUpdate();

        },
        calcTotalFee()
        {
            let totalFee = 0;
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                if (this.common.isNotBlank(item.fee) && !isNaN(item.fee))
                {
                    totalFee = this.common.accAdd(item.fee, totalFee);
                }
            }
            this.$forceUpdate();
        },
        /**
         * 改变器具
         * @param data
         */
        changeDevice(data)
        {
            data.spec = null;
            for (let i = 0; i < this.deviceData.length; i++)
            {
                let item = this.deviceData[i];
                if (item.id == data.deviceId)
                {
                    data.spec = item.spec;
                }
            }
            this.getDeviceRecoveryFeeList();
            this.$forceUpdate();
        },
        /**
         * 查询货主对应的客户对应操作类型的仓储合同收入明细
         * @returns {Promise<void>}
         */
        async getDeviceRecoveryFeeList()
        {
            let tenantMap = new Map();
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                if (this.common.isNotBlank(item.useTenantId))
                {
                    if (!tenantMap.has(item.useTenantId))
                    {
                        tenantMap.set(item.useTenantId, [item.deviceId]);
                    }else{
                        tenantMap.get(item.useTenantId).push(item.deviceId);
                    }
                }
            }
            if (tenantMap.size > 0)
            {
                let tenantIds = [];
                let deviceIds = [];
                tenantMap.forEach((value, key) =>
                {
                    tenantIds.push(key);
                    deviceIds.push(value);
                });
                let feeList = await this.common.postUrl("deviceRecordService", "getDeviceRecoveryFeeList", {
                    tenantIds,deviceIds,workId:this.record.workId,
                    relOperation: this.record.dealType
                }, null, null, '', true);
                //这里处理
                this.feeList=[];
                for (let i = 0; i < feeList.length; i++) {
                    if(feeList[i].isDefault){
                        this.feeList.push(feeList[i]);
                    }
                }
                this.feeListSrc = this.common.copyObj(feeList);
                this.changeDealNum();
                this.dealCostData();
            }
        },
        calItemFee()
        {
            this.totalInfo.num = 0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                item.totalFee = this.common.accMul(item.price, item.num);
                item.totalFeeWithTax = this.common.accMul(item.priceWithTax, item.num);

                this.totalInfo.num = this.common.accAdd(this.totalInfo.num, item.num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee, item.num);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax, item.totalFeeWithTax);
            }
        },
        /**
         * 确认选择的收入
         * @returns {Promise<void>}
         */
        async saveChangeFeeItem()
        {
            let selectItem = this.$refs.dbTable.getRightData();
            this.feeList = [];
            for (let i = 0; i < this.feeListSrc.length; i++)
            {
                let srcItem = this.feeListSrc[i];
                for (let j = 0; j < selectItem.length; j++)
                {
                    let item = selectItem[j];
                    if (item.onlyId == srcItem.onlyId)
                    {
                        this.feeList.push(item);
                    }
                }
            }
            await this.openSelectDialog(false);
            // //查询收入的客户下拉相关
            // await this.dealFeeCustTenant();
            //处理成本
            this.changeDealNum();
            this.dealCostData();
            //一个器具登记的优化一下
            // this.autoDevice();
            this.$forceUpdate();
        },
        autoDevice()
        {
            //只有一个器具自动选择
            this.$nextTick(()=> {
                let deviceSet = new Set();
                for (let i = 0; i < this.detailList.length; i++)
                {
                    let item = this.detailList[i];
                    //只有一个器具自动选择
                    if (this.common.isNotBlank(item.deviceId) && !deviceSet.has(item.deviceId))
                    {
                        deviceSet.add(item.deviceId);
                    }
                }
                if (deviceSet.size == 1)
                {
                    let deviceId = deviceSet.values().next().value;
                    for (let i = 0; i < this.feeList.length; i++)
                    {
                        let item = this.feeList[i];
                        //只有一个器具自动选择
                        item.deviceId = deviceId;
                        this.changeDevice(item);

                        let costItem = this.costList[i];
                        costItem.deviceId = deviceId;
                        this.changeDevice(costItem);
                    }
                    this.$forceUpdate();
                }
            })
        },
        dealCostData()
        {
            this.costList = [];
            let feeList = this.feeList;
            let costListSrc = this.costListSrc;
            //遍历收入数据，相同的费用项目的成本保持一致，成本有针对客户的优先，没有则用默认的
            for (let i = 0; i < feeList.length; i++)
            {
                let item = feeList[i];//收入项目
                let cost = null;//成本
                let customerCost = null;
                let defaultCost = null;
                let supplierData = [];
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
                            }
                        }
                        //去重放进去供应商
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
                if (this.common.isNotBlank(customerCost))
                {
                    cost = this.common.copyObj(customerCost);//有客户的优先
                    cost.isWorkOrder = 1;
                    cost.disabled = false;
                    cost.optionalFlag = false;//是否作业一直都可选
                    cost.supplierData = supplierData;
                }
                if (cost == null && this.common.isNotBlank(defaultCost))
                {
                    cost = this.common.copyObj(defaultCost);//无客户
                    cost.isWorkOrder = 1;
                    cost.disabled = false;
                    cost.optionalFlag = false;//是否作业一直都可选
                    cost.supplierData = supplierData;
                }
                if (cost == null)
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
                        disabled: true,
                        optionalFlag: true,
                    }
                }
                cost.num = item.num;
                cost.deviceId = item.deviceId;
                cost.custTenantId = item.custTenantId;
                cost.srcTenantName = item.srcTenantName;
                this.costList.push(cost);
            }
            this.calcCostTotal();
            this.$forceUpdate();
        },
        calcCostTotal()
        {
            this.totalInfo.costNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                item.totalFee = this.common.accMul(item.price,item.num);
                item.totalFeeWithTax = this.common.accMul(item.priceWithTax,item.num);
                if (this.common.isNotBlank(item.num))
                {
                    this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum, item.num);
                }
                if (this.common.isNotBlank(item.totalFee))
                {
                    this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee, item.totalFee);
                }
                if (this.common.isNotBlank(item.totalFeeWithTax))
                {
                    this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax, item.totalFeeWithTax);
                }
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
                this.dealCostPriceFee(item, index, 1);
            })
        },
        changeCostSwitch(item, index) {
            //处理按钮改变
            item.isWorkOrder = item.isWorkOrder == 1 ? 0 : 1;
            this.$forceUpdate();
            this.dealCostPriceFee(item, index, 0);
        },
        /**
         * 处理成本的价格、费用等
         * @param data
         * @param index
         * @param isFromChangeTenant
         */
        dealCostPriceFee(data, index, isFromChangeTenant)
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
                        if (i == index)//成本是根据收入来的 相同索引是相同的
                        {
                            break;
                        }
                    }
                }
                //收入有A客户a项目的数据  成本如果存在A客户a项目优先
                let customerCost = null;
                let defaultCost = null;
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
                        }
                        else//有客户的数据
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
                        }
                    }
                }
                let flag = false;
                if (this.common.isNotBlank(customerCost))
                {
                    data.price = customerCost.price;
                    data.tax = customerCost.tax;
                    data.priceWithTax = customerCost.priceWithTax;
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
                    if (isFromChangeTenant == 0)
                    {
                        data.tenantId = defaultCost.tenantId;
                    }
                }
                data.disabled = false;
                data.num = feeData.num;//读取收入的数量
            }
            this.calcCostTotal();//换价格重新计算合计
            this.$forceUpdate();
        },
        /**
         * 改变货主
         * @param data
         */
        async changeSrcTenant(data)
        {
            if (data.srcTenantId == 1)
            {
                data.useTenantDisable = false;
                data.useTenantId = null;
            }
            else
            {
                data.useTenantDisable = true;
                data.useTenantId = data.srcTenantId;
                await this.changeUseTenant(data);
            }
            this.getDeviceRecoveryFeeList();
        },
        async changeUseTenant(data)
        {
            this.workData = [];
            this.feeList = [];
            let set = new Set();
            let useTenantIds = [];
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                if (this.common.isNotBlank(item.useTenantId))
                {
                    set.add(item.useTenantId);
                    useTenantIds.push(item.useTenantId);
                }
            }
            if (this.record.dealType == 4)
            {
                if (set.size > 1)
                {
                    this.$message.error("一次返回到货厂商登记只能选择一个使用客户的器具！");
                    return false;
                }
                if (set.size == 1)
                {
                    this.record.workId = null;
                    let tenantId = set.values().next().value;
                    if(tenantId!=1){
                        await this.loadWorkData(0, 0, 1, tenantId);
                    }else{
                        await this.loadWorkData(1, 0, 1);
                    }
                } else {
                    await this.loadWorkData(1, 0, 1);
                }
            } else{
                await this.loadWorkData(1, 1, 1);
            }
            this.getDeviceRecoveryFeeList();
        },
        async dealFeeCustTenant()
        {
            let data = [];//只有一个货主自动选择
            let set = new Set();
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                for (let j = 0; j < this.tenantData2.length; j++)
                {
                    let item2 = this.tenantData2[j];
                    if (item.useTenantId == item2.wId && this.common.isNotBlank(item2.wId) && !set.has(item2.wId))
                    {
                        data.push(item2);
                        set.add(item2.wId);
                    }
                }
            }
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                if (this.common.isNotBlank(item.useTenantId) && !set.has(item.useTenantId))
                {
                    item.useTenantId = null;
                }
                if (data.length == 1)
                {
                    item.useTenantId = data[0].wId;
                }
            }
            this.useTenantData = data;
            this.$forceUpdate();
        },
        /**
         * 器具登记
         */
        async sureRecord()
        {
            if (this.common.isBlank(this.record.dealType))
            {
                this.$message.error("请选择登记类型！");
                return false;
            }
            if (this.common.isBlank(this.record.workId))
            {
                this.$message.error("请选择" + this.tipName + "！");
                return false;
            }
            if (this.common.isBlank(this.record.actualDate))
            {
                this.$message.error("请选择实际日期！");
                return false;
            }
            if (this.common.isBlank(this.detailList) || this.detailList.length === 0)
            {
                this.$message.error("器具登记明细不能为空！");
                return false;
            }

            let set = new Set();
            for (let i = 0; i < this.detailList.length; i++)
            {
                let item = this.detailList[i];
                if (this.common.isBlank(item.deviceId))
                {
                    this.$message.error("请选择器具登记明细第" + (i + 1) + "条器具名称！");
                    return false;
                }
                if (this.common.isBlank(item.srcTenantId))
                {
                    this.$message.error("请选择器具登记明细第" + (i + 1) + "条所属人！");
                    return false;
                }
                if (this.common.isBlank(item.useTenantId))
                {
                    this.$message.error("请选择器具登记明细第" + (i + 1) + "条使用客户！");
                    return false;
                }
                if (this.common.isBlank(item.dealNum))
                {
                    this.$message.error("请输入器具登记明细第" + (i + 1) + "条数量！");
                    return false;
                }
                set.add(item.useTenantId);
                if (this.record.dealType == 4 && set.size > 1)
                {
                    this.$message.error("一次返回到货厂商登记只能选择一个使用客户处理！");
                    return false;
                }
            }
            //收入校验
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                // if (this.common.isBlank(item.deviceId))
                // {
                //     this.$message.error("请选择收入信息第" + (i + 1) + "条器具名称！");
                //     return false;
                // }
                if (this.common.isBlank(item.srcTenantId))
                {
                    this.$message.error("请选择收入信息第" + (i + 1) + "条使用客户！");
                    return false;
                }
                if (this.common.isBlank(item.num))
                {
                    this.$message.error("请输入收入信息第" + (i + 1) + "条数量！");
                    return false;
                }
            }
            //成本校验
            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                // if (this.common.isBlank(item.deviceId))
                // {
                //     this.$message.error("请选择成本信息第" + (i + 1) + "条器具名称！");
                //     return false;
                // }
                if (this.common.isBlank(item.isWorkOrder))
                {
                    this.$message.error("请选择成本信息第" + (i + 1) + "条外包作业！");
                    return false;
                }
                if (item.isWorkOrder == 1)
                {
                    if (this.common.isBlank(item.tenantId))
                    {
                        this.$message.error("请选择成本信息第" + (i + 1) + "条外包供应商！");
                        return false;
                    }
                    if (this.common.isBlank(item.num))
                    {
                        this.$message.error("请输入成本信息第" + (i + 1) + "条数量！");
                        return false;
                    }
                }
            }

            let param = this.common.copyObj(this.record);
            if (param.dealType == 4)
            {
                param.destWorkId = param.workId;
            }
            else
            {
                param.srcWorkId = param.workId;
            }
            param.detailList = this.common.copyObj(this.detailList);
            param.feeList = this.common.copyObj(this.feeList);
            param.costList = this.common.copyObj(this.costList);
            param.fileId = this.$refs.devImg.getImageData().flowId;
            param.filePath = this.$refs.devImg.getImageData().storePath;
            await this.common.postUrl("deviceRecordService", "saveOrUpdateDevRecord", param, null, null, '', true);
            this.$message.success("登记成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
