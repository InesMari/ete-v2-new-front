import quoteSheetCommon from "../wms/quoteSheet/quoteSheetCommon.js";
export default {
    name: 'addStoreHouseSale',
    mixins:[quoteSheetCommon],
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    taxRate:6,
                    leaseType:'1',
                    leaseAreaTotal:0,
                    chargeArea:0
                },
                details:[],
            },
            head: [
                {"name": "费用项目名称", "code":"itemName", "width": "145"},
                {"name": "计费单位", "code": "unit", "width": "110","type":"select"},
                // {"name": "标准成本（含税）", "code": "costWithTax", "width": "100","type":"text"},
                {"name": "起始地", "parent":"delivery", "code": "beginWorkId", "width": "160","type":"beginWork"},
                {"name": "起始地", "parent":"purchase", "code": "endWorkId", "width": "160","type":"endWork"},
                {"name": "目的地", "parent":"delivery", "code": "endWorkId", "width": "160","type":"endWork"},
                {"name": "报价车型", "parent":"delivery", "code": "quoteVehicleType", "width": "80","type":"quoteVehicleType"},
                {"name": "报价车长", "parent":"delivery", "code": "vehicleLength", "width": "80","type":"vehicleLength"},
                {"name": "未税单价", "code": "price", "width": "80","type":"input"},
                {"name": "增值税率", "code": "tax", "width": "60","type":"input"},
                {"name": "价税合计", "code": "priceWithTax", "width": "80","type":"input"},
                {"name": "费用项目备注", "code": "remark", "width": "160","type":"inputText"},
                {"name": "数量", "parent":"zusou", "code": "nums", "width": "80","type":"nums"},
                {"name": "含税金额", "parent":"zusou","code": "totalPriceWithTax", "width": "80","type":"totalPriceWithTax"},
                {"name": "计费节点", "code": "relOperation", "width": "160","type":"relOperation"},
                {"name": "是否默认", "code": "isDefault", "width": "100","type":"isDefault"},
            ],
            customerData:[],
            quoteSheets:[],
            leaseTypeList:[],
            relOperationList:[],
            allStorageConditionList:[],
            storageConditionList:[],
            contractList:[],
            storageConditionView:false,

            settleType:[],  //结算类型 - 原始数据
            settleType2:[], //结算类型 - 保留2，3
            hasOrder:false, //是否选择报价单
            edit:false, //是否编辑
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initDataSale();
    },
    /**
     * 组件
     */
    components: {

    },
    /**
     * 绑定函数
     */
    methods: {

        // 初始化数据
        async initDataSale() {
            // 客户
            this.customerData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            let custTenantId =Number(this.$route.query.custTenantId);
            this.info.baseInfo.custTenantId = custTenantId?custTenantId:'';
            //租赁类型
            this.leaseTypeList = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"LEASE_TYPE"});
            this.allStorageConditionList = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STORAGE_CONDITION"});
            this.settleType = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"SETTLE_TYPE"});
            this.info.baseInfo.settleType = this.settleType[0].codeValue;
            //计费节点
            this.relOperationList = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"FEE_OPERATION"});
            // this.relOperationList.splice(4,1);
            // 判断查询还是修改
            let id = this.$route.query.id;
            if(this.common.isNotBlank(id)){
                this.edit = true;
                this.info.baseInfo.id = id;
                await this.queryDetail();
            }else{
                this.initAddData();
            }
            await this.changeCustomer(this.info.baseInfo.custTenantId);
            if(this.common.isNotBlank(this.$route.query.quoteId)){
                this.info.baseInfo.quoteId = Number(this.$route.query.quoteId);
                this.changeQuote(this.info.baseInfo.quoteId);
            }
            this.$forceUpdate();
        },
        // 新增
        async initAddData() {
            let {custTenantId,workStoreId} = this.info.baseInfo;
            this.info.details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems',{custTenantId,workId:workStoreId});
            // 默认勾选
            this.info.details.forEach(item => {
                item.display = 1;
                for(let el of item.items){
                    el.isDefault = 1;//默认是
                    el.relOperation = [];
                    if(item.codeId==101){
                        el.relOperation.push(2);
                    }else if(item.codeId==102||item.codeId==103){
                        el.relOperation.push(2);
                    }else if(item.codeId==104||item.codeId==105||item.codeId==14){
                        el.relOperation.push(5);
                    }else if(item.codeId==106){
                        el.relOperation.push(3);
                    }else if(item.codeId==107){
                        if(el.unit=='元/个/次'){
                            el.relOperation.push(4);
                        }else{
                            el.relOperation="";
                        }
                    }else{
                        el.relOperation.push(2);
                    }
                }
                if(item.codeId == 1){
                    item.items.forEach(el => {
                        el.display = 1;
                    })
                }
                // 配送服务、器具回收自行生成ID
                if(item.codeId == 104 || item.codeId == 106){
                    item.items.forEach((el,index) => {
                        el.itemIdLog = el.itemId;
                        el.itemId = String(el.itemId) + index;
                    });
                }
            })
            // 仓储费对象
            this.firstTableItem = this.info.details[0];
            this.firstTableItem0 = [];
            this.firstTableItem1 = [];
            this.firstTableItem.items.forEach(item => {
                if(item.itemCode == "monthFee"){ //"定量仓储面积计费"
                    item.shareRate = 30;
                    item.storageCondition = '1';
                    this.firstTableItem0.push(item)
                }else if(item.itemCode == "tmpMonthFee"){    //"按件仓储计费"
                    item.storageCondition = '1';
                    item.countRule='1';
                    this.firstTableItem1.push(item)
                }
            })
            //我方信息
            let {billId,userName,email} = JSON.parse(localStorage.getItem("userInfo"));
            this.info.baseInfo.ourLinkman = userName;
            this.info.baseInfo.ourBillId = billId;
            this.info.baseInfo.ourEmail = email;
            this.info.baseInfo.quoteDate = this.common.formatDate.getDate();
            this.info.baseInfo.remark = `1）计费吨托（MT)：按每托重量、体积最大值计算，最小计费单位为一托；
2）有以上相关价格外的业务则双方重新议价；   
3）如因报价条件发生变更则重新调整相关报价；   
4）费用为30天结算，我司开具增值税发票，贵司在次月30 日前付款到敝司指定账户；
5）其他未尽事宜，双方互相沟通协商后再行确认。`;
            this.$forceUpdate();
            this.setTableWidthDrag();
        },
        // 修改
        async initUpdateData() {
            let {custTenantId,workStoreId} = this.info.baseInfo;
            this.info.details.forEach(item => {
                item.items.forEach(el => {
                    if(this.common.isNotBlank(el.relOperation)) el.relOperation = el.relOperation.split(',').map(Number);
                    if(this.common.isNotBlank(el.endWorkId)) el.endWorkId = el.endWorkId.split(',').map(Number);
                })
            })
            let details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems',{custTenantId,workId:workStoreId});
            details.forEach(item => {
                this.info.details.forEach(el => {
                    if(item.codeId == el.codeId && item.title == el.title){
                        item.display = 1;
                        item.items = this.common.copyObj(el.items);
                    }
                });
            })
            this.info.details = details;
            // 仓储费对象
            this.firstTableItem = this.info.details[0];
            this.firstTableItem.items.forEach(item => {
                if(item.itemCode == "monthFee"){ //"定量仓储面积计费"
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    item.display = 1;
                    this.firstTableItem0.push(item)
                }else if(item.itemCode == "tmpMonthFee"){    //"按件仓储计费"
                    item.countRule = item.countRule?String(item.countRule):'';
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    item.display = 1;
                    this.firstTableItem1.push(item)
                }
            })
            if(this.firstTableItem0.length == 0){
               let details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems');
               this.firstTableItem0.push(details[0].items[0]);
            }
            if(this.firstTableItem1.length == 0){
               let details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems');
               this.firstTableItem1.push(details[0].items[1]);
            }
            // 查询目的地数据
            await this.searchEndWorks(true);
            // 遍历处理数据
            for(let el of this.info.details){
                if(this.common.isBlank(el.display)) el.display = 0;
                // elmentUI需要置换数据类型
                // 配送服务和器具回收逻辑
                if(el.codeId == 104 || el.codeId == 106){
                    for(let item of el.items){
                        if(this.common.isNotBlank(item.endWorkId)) item.endWorkId = item.endWorkId.map(String);
                        if(el.codeId == 104){
                            if(this.common.isNotBlank(item.quoteVehicleType)) item.quoteVehicleType += '';
                            if(this.common.isNotBlank(item.vehicleLength)) item.vehicleLength += '';
                            // 赋值起始地
                            item.beginWorkId = this.info.baseInfo.workStoreId;
                        }
                        // id置换
                        item.itemIdLog = item.itemId;
                        if(this.common.isNotBlank(item.subItemId)){
                            item.itemId = item.subItemId;
                        }else{
                            item.subItemId = item.itemId;
                        }
                    }
                }
            }
            this.$forceUpdate();
            this.setTableWidthDrag();
        },
        // 查询详情
        async queryDetail(){
            let id = this.$route.query.id;
            let info = await this.common.postUrl("storeHouseBizTF", "queryCmStoreHouseSaleRelById", {id});
            info.baseInfo.workStoreId = info.baseInfo.workId;
            info.baseInfo.leaseType = info.baseInfo.leaseType + '';
            info.baseInfo.storageCondition = info.baseInfo.storageCondition + '';
            info.baseInfo.settleType = info.baseInfo.settleType + '';
            this.info.baseInfo = info.baseInfo;
            this.info.baseInfo.leaseType = info.baseInfo.leaseType + '';
            let quoteId = info.baseInfo.quoteId;
            if(this.common.isNotBlank(quoteId)){
                await this.changeQuote(quoteId,true);
                this.info.details.forEach(item => {
                    item.items.forEach(el => {
                        for (let i = 0; i < info.details.length; i++) {
                            let newItem = info.details[i];
                            for (let j = 0; j < newItem.items.length; j++) {
                                if(el.itemId==newItem.items[j].itemId){
                                    el.isDefault = newItem.items[j].isDefault;
                                    el.relOperation = newItem.items[j].relOperation.split(",").map(Number);
                                    if(newItem.items[j].nums>0){
                                        el.nums = newItem.items[j].nums;
                                        this.changeNums(el);
                                        this.$forceUpdate();
                                    }
                                    break;
                                }
                            }
                        }
                    })
                });
                this.info.baseInfo.id = id;
                this.info.baseInfo.storageCondition = info.baseInfo.storageCondition+"";
                this.initStorageConditionList(false,quoteId);
            }else{
                this.info = info;
                this.initUpdateData();
            }
        },

        async initStorageConditionList(flag,id) {
            let info = await this.common.postUrl("wmsQuoteSheetTF", "queryQuoteSheetDetailById", {quoteId: id});
            if(flag){
                if(info.details[0].items[0].storageCondition){
                    this.info.baseInfo.storageCondition = info.details[0].items[0].storageCondition+"";
                }
            }
            let conditionSet = new Set();
            this.storageConditionList = [];
            for (let i = 0; i < info.details.length; i++) {
                if (info.details[i] && info.details[i].items) {
                    for (let j = 0; j < info.details[i].items.length; j++) {
                        if (info.details[i].items[j].storageCondition) {
                            for (let k = 0; k < this.allStorageConditionList.length; k++) {
                                if (this.allStorageConditionList[k].codeValue == info.details[i].items[j].storageCondition.toString() && !conditionSet.has(this.allStorageConditionList[k].codeValue)) {
                                    this.storageConditionList.push(this.allStorageConditionList[k]);
                                    conditionSet.add(this.allStorageConditionList[k].codeValue);
                                }
                            }
                            if (this.info.baseInfo.storageCondition != info.details[i].items[j].storageCondition) {
                                info.details[i].items.splice(j, 1);
                                j--;
                                continue;
                            }
                        }
                        if(flag){
                            let item = info.details[i].items[j];
                            item.isDefault = 1;//默认是
                            item.relOperation = [];
                            if(item.itemType==101){
                                item.relOperation.push(2);
                            }else if(item.itemType==102||item.itemType==103){
                                item.relOperation.push(2);
                            }else if(item.itemType==104||item.itemType==105||item.itemType==14){
                                item.relOperation.push(5);
                            }else if(item.itemType==106){
                                item.relOperation.push(3);
                            }else if(item.itemType==107){
                                if(item.unit=='元/个/次'){
                                    item.relOperation.push(4);
                                }else{
                                    item.relOperation = '';
                                }
                            }else{
                                item.relOperation.push(2);
                            }
                        }
                    }
                }
            }
            if (this.storageConditionList.length > 1) {
                this.storageConditionView = true;
            } else {
                this.storageConditionView = false;
            }
            if(this.storageConditionList.length==0){
                this.storageConditionList = this.allStorageConditionList;
                if(!this.info.baseInfo.storageCondition){
                    this.info.baseInfo.storageCondition=this.storageConditionList[0].codeValue;
                }
            }
            if(flag){
                // 保留是否默认的值
                info.details.forEach((detail,index) => {
                    detail.items.forEach((item,itemIndex) => {
                        this.info.details.forEach(infoDetail => {
                            infoDetail.items.forEach(infoItem => {
                                if(infoItem.itemId == item.itemId){
                                    item.isDefault = infoItem.isDefault;
                                    item.relOperation = infoItem.relOperation;
                                }
                            })
                        })
                    })
                })
                this.info.details = info.details;
            }
            this.$forceUpdate();
        },
        // 更新视图
        forceUpdate(){
            this.$forceUpdate();
        },
        // 选择客户
        async changeCustomer(id){
            // 查报价单
            this.quoteSheets = await this.common.postUrl("wmsQuoteSheetTF", "queryAllQuoteSheets", {custTenantId:id});
            this.contractList = await this.common.postUrl("contractService", "queryCustomerContractList", {tenantId:id});
            this.$forceUpdate();
        },
        // 选择物流中心
        async changeWorker(){
            // 查询初始化费用项目
            if(this.common.isNotBlank(this.info.baseInfo.custTenantId) && !this.isCopy) await this.initAddData();
            // 配送项目起始地赋值
            this.info.details.forEach(item => {
                if(item.codeId == 104){
                    item.items.forEach(el => {
                        el.beginWorkId = this.info.baseInfo.workStoreId;
                    })
                }
            })
            // 查询目的地
            this.searchEndWorks()
        },
        changeContract(id){
            if(id){
                this.contractList.forEach(item => {
                    if(item.id == id){
                        this.info.baseInfo.leaseBeginDate = item.beginDate;
                        this.info.baseInfo.leaseEndDate = item.endDate;
                    }
                });
            }else{
                this.info.baseInfo.leaseBeginDate = '';
                this.info.baseInfo.leaseEndDate = '';
            }
            this.$forceUpdate();
        },
        // 选择报价单
        async changeQuote(id,notInit){
            if(this.common.isBlank(id)){
                this.clearWorkAndHouse();
                this.initAddData();
                return;
            }
            this.hasOrder = true;
            if(!notInit){
                this.info.baseInfo.quoteId = id;
                this.info.baseInfo.taxRate = 6;
                this.info.baseInfo.leaseType = '2';
                this.info.baseInfo.leaseAreaTotal = 0;
                this.info.baseInfo.chargeArea = 0;
                this.quoteSheets.forEach(item => {
                    if(item.quoteId == id){
                        this.info.baseInfo.workId = item.workId;    //获取仓库Id
                        this.info.baseInfo.workName = item.workName;
                        this.info.baseInfo.workAddressStr = item.workAddressStr;
                        this.info.baseInfo.storehouseHeight = item.storehouseHeight;
                        this.info.baseInfo.storehouseArea = item.storehouseArea;
                        this.info.baseInfo.storehouseTypeName = item.storehouseTypeName;
                        this.info.baseInfo.firecontrolType = item.firecontrolType;
                        this.info.baseInfo.firecontrolTypeName = item.firecontrolTypeName;
                    }
                })
            }
            this.initStorageConditionList(true,id);
            await this.setBaseinfo();
            this.caclFee();
            this.$forceUpdate();
        },
        async setBaseinfo() {
            let info = await this.common.postUrl("wmsQuoteSheetTF", "queryQuoteSheetDetailById", {quoteId: this.info.baseInfo.quoteId});
            for (let i = 0; i < info.details.length; i++) {
                if (info.details[i] && info.details[i].items) {
                    let detail = info.details[i];
                    for (let j = 0; j < detail.items.length; j++) {
                        let item = detail.items[j];
                        if(item.storageCondition) {
                            if (item.storageCondition.toString() == this.info.baseInfo.storageCondition && item.itemCode == 'monthFee') {
                                this.info.baseInfo.taxRate = item.tax;
                                this.info.baseInfo.unitPrice = item.priceWithTax;
                                this.info.baseInfo.unitPriceNoTax = item.price;
                                // this.info.baseInfo.leaseAreaTotal = item.leaseArea;
                                // this.info.baseInfo.shareRate = item.shareRate;
                                // this.info.baseInfo.chargeArea = item.chargeArea;
                            }
                            if (this.info.baseInfo.storageCondition != info.details[i].items[j].storageCondition) {
                                info.details[i].items.splice(j, 1);
                                j--;
                                continue;
                            }
                        }
                        item.isDefault = 1;//默认是
                        item.relOperation = [];
                        if(item.itemType==101){
                            item.relOperation.push(2);
                        }else if(item.itemType==102||item.itemType==103){
                            item.relOperation.push(2);
                        }else if(item.itemType==104||item.itemType==105||item.itemType==14){
                            item.relOperation.push(5);
                        }else if(item.itemType==106){
                            item.relOperation.push(3);
                        }else if(item.itemType==107){
                            if(item.unit=='元/个/次'){
                                item.relOperation.push(4);
                            }else{
                                item.relOperation = '';
                            }
                        }else{
                            item.relOperation.push(2);
                        }
                    }
                }
            }
            // 保留是否默认的值
            info.details.forEach((detail,index) => {
                detail.items.forEach((item,itemIndex) => {
                    this.info.details.forEach(infoDetail => {
                        infoDetail.items.forEach(infoItem => {
                            if(infoItem.itemId == item.itemId){
                                item.isDefault = infoItem.isDefault;
                                item.relOperation = infoItem.relOperation;
                            }
                        })
                    })
                })
            })
            this.info.details = info.details;
            this.caclFee();
            this.$forceUpdate();
        },

        // 清空仓库和费用
        clearWorkAndHouse(){
            this.hasOrder = false;
            this.info.baseInfo.workId = '';
            this.info.baseInfo.workName = '';
            this.info.baseInfo.workAddressStr = '';
            this.info.baseInfo.storehouseHeight = '';
            this.info.baseInfo.storehouseArea = '';
            this.info.baseInfo.storehouseTypeName = '';
            this.info.baseInfo.firecontrolType = '';
            this.info.baseInfo.leaseFeeArea = '';
            this.info.baseInfo.leaseFeeAreaNoTax = '';
            this.info.baseInfo.unitPrice = '';
            this.info.baseInfo.unitPriceNoTax = '';
            this.info.details = [];
        },
        changeLeaseArea()
        {
            /*if (this.common.isNotBlank(this.info.baseInfo.leaseAreaTotal))
            {
                // this.info.baseInfo.maxPalletNums = Math.ceil(this.common.accDiv(this.info.baseInfo.leaseAreaTotal, 1.86));
                if(this.common.isNotBlank(this.info.baseInfo.shareRate)){
                    let shareRate = this.common.accAdd(100,this.info.baseInfo.shareRate);
                    shareRate = this.common.accDiv(shareRate,100);
                    this.info.baseInfo.chargeArea = Math.round(this.common.accMul(this.info.baseInfo.leaseAreaTotal, shareRate));
                }else{
                    this.info.baseInfo.chargeArea = this.info.baseInfo.leaseAreaTotal;
                }
            }*/

            this.leaseAreaIptSale(this.info.baseInfo);
        },

        setBaseInfoForMonthFee(item){
            this.info.baseInfo.taxRate = item.tax;
            this.info.baseInfo.unitPrice = item.priceWithTax;
            this.info.baseInfo.unitPriceNoTax = item.price;
            this.caclFee();
            this.forceUpdate();
        },

        /*
        * 根据实际面积计算计费面积
        * 计费面积 = 租赁面积/(1-公摊)
        */
        leaseAreaIptSale(item){
            let {shareRate,leaseAreaTotal} = item
            if(this.common.isBlank(shareRate)) return;
            let sub = this.common.accSub(100,shareRate);
            let div = this.common.accDiv(leaseAreaTotal, sub);
            item.chargeArea = this.common.accMul(div, 100).myToFixed(2);
            this.caclFee();
            this.forceUpdate();
        },
        /**
         * 根据计费面积计算实际面积
         * 租赁面积=计费面积*（1-公摊）
         */
        chargeAreaIptSale(item){
            let {shareRate,chargeArea} = item;
            if(this.common.isBlank(shareRate)) return;
            let sub = this.common.accSub(100, shareRate);
            let mul = this.common.accMul(chargeArea, sub);
            item.leaseAreaTotal = this.common.accDiv(mul, 100).myToFixed(2);
            this.caclFee();
            this.forceUpdate();
        },

        changeSwitch(item) {
            this.$forceUpdate();
        },
        changeNums(item){
            item.totalPriceWithTax = this.common.accMul(item.priceWithTax,item.nums);
            this.$forceUpdate();
        },
        // 结算合计
        caclFee(list){
            if(this.common.isBlank(this.info.baseInfo.chargeArea)) return;
            // 含税
            this.info.baseInfo.leaseFeeArea = this.common.accMul(this.info.baseInfo.unitPrice,this.info.baseInfo.chargeArea);
            // 未税
            this.info.baseInfo.leaseFeeAreaNoTax = this.common.accMul(this.info.baseInfo.unitPriceNoTax,this.info.baseInfo.chargeArea);
        },
        unitChange2(item,codeId){
            if(codeId == 107){
                if(item.unit == '元/个/次'){
                    item.relOperation = [];
                    item.relOperation.push(4);
                }else{
                    item.relOperation = '';
                }
            }
        },
        // 保存费用项目的更改
        saveChange(){
            let data = this.$refs.table.getRightData();
            this.info.details.forEach(item => {
                if(item.codeId == this.currentCodeId){
                    item.items = this.common.copyObj(data);
                    // 器具回收id处理，器具回收没有默认单位时，默认元/个/次
                    if(item.codeId == 106){
                        this.generateDeliveryId(item.items);
                        item.items.forEach(el => {
                            if(this.common.isBlank(el.unit)){
                                el.unit = "元/个/次";
                            }
                        })
                    }
                    if(data.length>0){
                        item.display = 1;
                    }else{
                        item.display = 0;
                    }
                    // 配送服务特殊逻辑
                    if(item.codeId == 104){
                        this.generateDeliveryId(item.items);
                        item.items.forEach((el,index) => {
                            // 赋值目的地
                            el.beginWorkId = this.info.baseInfo.workStoreId;
                        });
                    }

                    item.items.forEach(el => {
                        if(this.common.isBlank(el.relOperation)){
                            el.isDefault = 1;//默认是
                            el.relOperation = [];
                            if(item.codeId==101){
                                el.relOperation.push(2);
                            }else if(item.codeId==102||item.codeId==103){
                                el.relOperation.push(2);
                            }else if(item.codeId==104||item.codeId==105||item.codeId==14){
                                el.relOperation.push(5);
                            }else if(item.codeId==106){
                                el.relOperation.push(3);
                            }else if(item.codeId==107){
                                if(el.unit=='元/个/次'){
                                    el.relOperation.push(4);
                                }else{
                                    el.relOperation = '';
                                }
                            }else{
                                el.relOperation.push(2);
                            }
                        }
                    })

                }
            })
            this.isShowDialog = false;
            this.currentCodeId = null;
            this.$forceUpdate();
        },
        // 检测第一页内容是否填写完整
        checkPageOne(){
            let {custTenantId,workStoreId} = this.info.baseInfo;
            if(this.common.isBlank(custTenantId)){
                this.$message.error("请先选择客户");
                return false;
            }
            if(this.common.isBlank(workStoreId)){
                this.$message.error("请先选择仓库");
                return false;
            }
            // 插入仓储费，判断仓储费是否选择，存放条件是否重复
            let storgeFeeDisplayNum = 0;
            this.info.details[0].items = [];
            let storageCondition0 = [];
            this.firstTableItem0.forEach(item => {
                if(item.display == 1){
                    this.info.details[0].items.push(item);
                    storgeFeeDisplayNum++;
                    storageCondition0.push(item.storageCondition);
                }
            })
            if(storageCondition0.length!== new Set(storageCondition0).size){   //判断存放条件是否重复
                this.$message.error("仓储费-定量仓储面积计费-存放条件不能相同");
                return false;
            }
            let storageCondition1 = [];
            this.firstTableItem1.forEach(item => {
                if(item.display == 1){
                    this.info.details[0].items.push(item);
                    storgeFeeDisplayNum++;
                    storageCondition1.push(item.storageCondition);
                }
            })
            if(storageCondition1.length!== new Set(storageCondition1).size){   //判断存放条件是否重复
                this.$message.error("仓储费-按件仓储计费-存放条件不能相同");
                return false;
            }
            // if(storgeFeeDisplayNum==0){
            //     this.$message.error("仓储费至少选择一个");
            //     return false;
            // }
            // 配送服务数据检查
            let flag = true;
            for(let el of this.info.details){
                if(el.codeId != 1 && el.display == 1){
                    for(let item of el.items){
                        if(this.common.isBlank(item.unit)){
                            this.$message.error("计费单位不能为空");
                            flag = false;
                            break;
                        }
                    }
                    if(!flag) break;
                }
                // 配送服务逻辑处理
                if(el.display == 1 && el.codeId == 104){
                    for(let item of el.items){
                        // 起始地目的地必选
                        if(this.common.isBlank(item.endWorkId) || item.endWorkId.length == 0){
                            this.$message.error("配送服务请选择目的地");
                            flag = false;
                            break;
                        }
                        // 计费单位是元/车次时，车型车长必选
                        if(item.unit == '元/车次'){
                            if(this.common.isBlank(item.quoteVehicleType)){
                                this.$message.error("配送服务请选择车型");
                                flag = false;
                                break;
                            }
                            if(this.common.isBlank(item.vehicleLength)){
                                this.$message.error("配送服务请选择车长");
                                flag = false;
                                break;
                            }
                        }
                        // 生成匹配条件
                        this.endWorkSel(item);
                        item.matchCondition = `到${item.endWorkName}`;
                        if(item.quoteVehicleTypeName){
                            item.matchCondition += ' | ' +item.quoteVehicleTypeName
                        }
                        if(item.vehicleLengthName){
                            item.matchCondition += ' | ' +item.vehicleLengthName
                        }
                    }
                    if(!flag) break;
                }
                // 器具回收逻辑处理
                if(el.display == 1 && el.codeId == 106){
                    for(let item of el.items){
                        // 生成匹配条件
                        this.endWorkSel(item);
                        item.matchCondition = `到${item.endWorkName}`;
                    }
                }
            }
            return flag;
        },
        async submit(){
            let info = this.common.copyObj(this.info);
            let {custTenantId,quoteId,leaseType,leaseBeginDate,leaseEndDate} = this.info.baseInfo;
            if(this.common.isBlank(custTenantId)){
                this.$message.error("请选择客户");
                return;
            }
            let flg = false;
            this.quoteSheets.forEach(item=>{
                if(item.quoteId==quoteId){
                    flg = true;
                }
            })
            if(this.common.isBlank(leaseType)){
                this.$message.error("请输入租赁类型");
                return;
            }
            if(this.common.isBlank(leaseBeginDate)){
                this.$message.error("请选择租赁开始日期");
                return;
            }
            if(this.common.isBlank(leaseEndDate)){
                this.$message.error("请选择租赁结束日期");
                return;
            }
            if(this.common.isNotBlank(this.info.details[0].items[0].chargeArea)&&this.common.isBlank(this.info.baseInfo.maxPalletNums)){
                this.$message.error("请输入最大流量");
                return;
            }

            if(!this.hasOrder){
                if(!this.checkPageOne()) return;
                // 置空不选择项目
                info.details.forEach(item => {
                    if(item.display != 1){
                        item.items = [];
                    }
                    item.items.forEach((innerItem,index) => {
                        // 仓储费的计费单位需要保存codeValue
                        this.unitList.forEach(el => {
                            if(el.codeName == innerItem.unit){
                                innerItem.unitValue = el.codeValue;
                            }
                        })
                    });
                })
                // 提交前配置好itemId和subItemId
                info.details.forEach(el => {
                    if(el.codeId == 104 || el.codeId == 106){
                        el.items.forEach(item => {
                            item.subItemId = item.itemId;
                            item.itemId = item.itemIdLog;
                        })
                    }
                })
            }

            if(this.common.isBlank(info.baseInfo.workId)) info.baseInfo.workId = info.baseInfo.workStoreId;
            info.baseInfo.settleType = this.settleType[0].codeValue;    // 旧数据修改时默认保存普通结算
            await this.common.postUrl('storeHouseBizTF','saveCmStoreHouseSaleRel',info,null,null,null,true);
            this.$message.success("保存成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
