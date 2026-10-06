import dbTable from "@/components/dbTable/dbTable.vue";
import vuedraggable from 'vuedraggable';
export default {
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    custTenantId:'',
                    custName:'',
                    linkman:'',
                    billId:'',
                    ourLinkman:'',
                    ourBillId:'',
                    email:'',
                    ourEmail:'',
                    remark:'',
                    workStoreId:'',
                    quoteDate:''
                },
                details:[],
            },
            head: [
                {"name": "费用项目名称", "code":"itemName", "width": "145"},
                {"name": "计费单位", "code": "unit", "width": "110","type":"select"},
                {"name": "标准成本（含税）", "code": "costWithTax", "width": "100","type":"text"},
                {"name": "起始地", "parent":"delivery", "code": "beginWorkId", "width": "110","type":"beginWork"},
                {"name": "起始地", "parent":"purchase", "code": "endWorkId", "width": "110","type":"endWork"},
                {"name": "目的地", "parent":"delivery", "code": "endWorkId", "width": "200","type":"endWork"},
                {"name": "报价车型", "parent":"delivery", "code": "quoteVehicleType", "width": "80","type":"quoteVehicleType"},
                {"name": "报价车长", "parent":"delivery", "code": "vehicleLength", "width": "80","type":"vehicleLength"},
                {"name": "未税单价", "code": "price", "width": "80","type":"input"},
                {"name": "增值税率", "code": "tax", "width": "60","type":"input"},
                {"name": "价税合计", "code": "priceWithTax", "width": "80","type":"input"},
                {"name": "费用项目备注", "code": "remark", "width": "160","type":"inputText"}
            ],
            head2: [
                {"name": "费用项目名称", "code":"itemName", "width": "110"},
                {"name": "计费单位", "code": "unit", "width": "110"},
                {"name": "标准成本（含税）", "code": "costWithTax", "width": "110"},
                {"name": "未税单价", "code": "price", "width": "110"},
                {"name": "增值税率", "code": "tax", "width": "110"},
                {"name": "价税合计", "code": "priceWithTax", "width": "110"},
                {"name": "费用项目备注", "code": "remark", "width": "220"},
                {"name": "匹配条件", "code": "matchCondition", "width": "220"}
            ],
            operateHead: [
                // {"name": "子类类别", "code": "itemName", "width": "110"},
                {"name": "费用项目", "code": "itemName", "width": "250"},
                {"name": "计费单位", "code": "unit", "width": "110"},
                {"name": "未税单价", "code": "price", "width": "70"},
                {"name": "税率", "code": "tax", "width": "70"},
            ],
            mergeList:[],
            mergeListCache:[],
            mergeArr:this.initMergeData(),
            rebuildDetails:[], //预览数据
            firstTableItem:[],
            firstTableItem0:[],
            firstTableItem1:[],
            unitList:[],
            unitList2:[],
            unitList3:[],
            unitList4:[],
            unitList5:[],
            conditionList:[],
            countRuleList:[],
            currentCodeId:null, //存储当前操作的codeId
            isShowDialog:false,
            isShowMergeDialog:false,
            customerData:[],
            workList:[],
            payTitle:[],//结算主体
            mergeFees:[],   //存储合并费用项Id
            priceTotal:0,   //合计未税价
            priceWithTaxTotal:0, //合计含税价
            settleBodyData:[],
            rebuildTypeList:[], //合并/分类项
            step:1, //页码
            feeItem:{
                filterText:"",
                subItemType:"",
                specsType:"",
                feeType:"",
                deviceId:"",
            },
            subItemTypeData:[],
            specsTypeData:[],
            feeTypeData:[],
            deviceData:[],
            endWork:[],
            selectNoOnly:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();        
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        vuedraggable
    },
    /**
     * 绑定函数
     */
    methods: {
        // 初始化数据
        async initData() {
            let that = this;
            // 仓库
            this.workList = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            // 客户
            this.common.postUrl("customerTF", "loadCustomerList", {}, function (data) {
                that.customerData = data;
            });
            // 计费单位
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_PRICE_UNIT_TYPE"}, function (data){
                that.unitList = data;
                // 按仓储计费计费单位只能选择 5 13 21 29
                let arr = [5,13,21,29,31];
                that.unitList2 = [];
                data.forEach(el => {
                    if(arr.includes(Number(el.codeValue))) that.unitList2.push(el);
                })
                let arr2 = [9,10];
                that.unitList3 = [];
                data.forEach(el => {
                    if(arr2.includes(Number(el.codeValue))) that.unitList3.push(el);
                })
                let arr3 = [8,9,10];
                that.unitList4 = [];
                data.forEach(el => {
                    if(arr3.includes(Number(el.codeValue))) that.unitList4.push(el);
                })
                let arr4 = [1,3,4,8];
                that.unitList5 = [];
                data.forEach(el => {
                    if(arr4.includes(Number(el.codeValue))) that.unitList5.push(el);
                })
            });

            // 器具
            this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {}, function (data) {
                that.deviceData = data;
            });
            // 静态数据
            this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {
                codeType: "PAY_TITLE,COUNT_RULE,STORAGE_CONDITION,REBUILD_TYPE,WMS_FEE_SUB_ITEM_TYPE,SPECS_TYPE,WMS_FEE_TYPE,DEVICE_TYPE,VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH"
            }, function (data){
                that.payTitle = data.PAY_TITLE;     // 结算主体
                that.countRuleList = data.COUNT_RULE;     // 取数规则
                that.conditionList = data.STORAGE_CONDITION;     // 存放条件
                that.rebuildTypeList = data.REBUILD_TYPE;     // 合并/分类项
                that.allSubItemTypeData = data.WMS_FEE_SUB_ITEM_TYPE;     // 费用项目全部类型
                that.specsTypeData = data.SPECS_TYPE;     // 规格类型
                that.allFeeTypeData = data.WMS_FEE_TYPE;     // 费用类型全部子类型
                that.deviceTypeData = data.DEVICE_TYPE;     // 器具子类型
                that.vehicleTypeQuote = data.VEHICLE_TYPE_QUOTE;     // 车型
                that.vehicleLength = data.VEHICLE_LENGTH;     // 车长
            });
        },
        initMergeData(){
            return [{
                titleName:"",
                rebuildType:"1",
                merge:[{
                    items:[{
                        
                    }]
                }]
            }]
        },
        // 配送服务表格拖动,表格禁止拖拽
        setTableWidthDrag(){
            this.$nextTick(()=>{
                let table = this.$refs.simpleTable104[0];
                this.common.tableStretch(table);

                // 禁用子元素的自定义拖拽功能  
                let tables = document.getElementsByClassName("dragDisable");
                tables.forEach(el => {
                    ['dragstart', 'dragover', 'drop','mousedown','mouseup','mousemove','touchstart','touchend','touchmove'].forEach(function(eventName) {  
                        el.addEventListener(eventName, function(event) {  
                            event.preventDefault(); // 阻止默认行为  
                            event.stopPropagation(); // 阻止事件冒泡  
                        });  
                    });
                })
            })
        },
        // 更新视图
        forceUpdate(){
            this.$forceUpdate();
        },
        /**
         * 根据取数规则，自动生成备注
         * 1. 取数规则，如果选择：当天入库结存，后面备注自动填写： 临时仓储计费托数=前⼀天结存+当天⼊库
         * 2. 取数规则，如果选择：前天结存，后面备注自动填写： 临时仓储计费托数=前⼀天的结存
         * 3. 取数规则，如果选择：当天结存，后面备注自动填写： 临时仓储计费托数=前⼀天的结存+当天⼊库-当天出库
         * 4. 取数规则，如果选择：平均结存，后面备注自动填写： 临时仓储计费托数=当月每天结存合计/当⽉天数
         * @param item
         */
        changeCountRule(item){
            if(item.countRule == 1){
                item.remark = "临时仓储计费托数=前⼀天结存+当天⼊库";
            }else if(item.countRule == 2){
                item.remark = "临时仓储计费托数=前⼀天的结存";
            }else if(item.countRule == 3){
                item.remark = "临时仓储计费托数=前⼀天的结存+当天⼊库-当天出库";
            }else if(item.countRule == 4){
                item.remark = "临时仓储计费托数=当月每天结存合计/当⽉天数";
            }
            this.$forceUpdate();
        },
        /* 
        * 根据实际面积计算计费面积 
        * 计费面积 = 实际面积/(1-公摊)
        */
        leaseAreaIpt(item){
            let {shareRate,leaseArea} = item
            if(this.common.isBlank(shareRate)) return;
            item.chargeArea = (leaseArea/(100-Number(shareRate))*100).myToFixed(2);
            this.forceUpdate();
        },
        /**
         * 根据计费面积计算实际面积
         * 实际面积 = 计费面积/(1+公摊)
         */
        chargeAreaIpt(item){
            let {shareRate,chargeArea} = item;
            if(this.common.isBlank(shareRate)) return;
            item.leaseArea = (chargeArea*(100-Number(shareRate))/100).myToFixed(2);
            this.forceUpdate();
        },
        /*
        * 计费单位改变,计费单位是元/车次时，配送服务不选择车型车长
        * @param {} item
        * */
        unitChange(item,codeId){
            if(codeId == 104 && item.unit != '元/车次'){
                item.quoteVehicleType = "";
                item.vehicleLength = "";
                this.$forceUpdate();
            }
        },
        /**
         * 异步函数，查询目的地
         * @param {boolean} onlySearch - 是否只查询不填充
         */
        async searchEndWorks(onlySearch){
            this.endWork = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork: 1,storeId: this.info.baseInfo.workStoreId});
            if(onlySearch) return;
            this.info.details.forEach(item => {
                if(item.codeId == 104 || item.codeId == 106){
                    item.items.forEach(el => {
                        el.endWorkId = "";
                        // 只有一个目的地的时候默认选上
                        if(this.endWork.length == 1){
                            el.endWorkId = [this.endWork[0].workId];
                            el.endWorkName = this.endWork[0].workName;
                            if(item.codeId == 104){  //配送服务需要调度选择目的地方法查询标准成本
                                this.queryDeliveryCost(el);
                            }
                        }
                    })
                }
            })
        },
        /*
        * 查询配送服务标准成本
        */
        async queryDeliveryCost(item){
            let {custTenantId,workStoreId:workId} = this.info.baseInfo;
            let {itemIdLog:itemId,beginWorkId,endWorkId,unit,quoteVehicleType,vehicleLength} = item;
            endWorkId = endWorkId.map(Number);
            let costWithTax =  await this.common.postUrl("wmsQuoteSheetTF", "getCostWithTax", {workId,custTenantId,itemId,beginWorkId,endWorkId,unit,quoteVehicleType,vehicleLength});
            item.costWithTax = costWithTax;
        },
        // 选择目的地
        endWorkSel(item,codeId){
            item.endWorkName = "";
            this.endWork.forEach(el =>{
                if(item.endWorkId.includes(el.workId)){
                    item.endWorkName = item.endWorkName + el.workName + "，";
                }
            })
            item.endWorkName = item.endWorkName.substring(0,item.endWorkName.length-1);
            // 查询配送服务标准成本
            if(codeId == 104 && item.endWorkId.length>0){
                this.queryDeliveryCost(item);
            }
            this.$forceUpdate();
        },
        // 选择车型
        vehicleTypeSel(item,codeId){
            this.vehicleTypeQuote.forEach(el =>{
                if(item.quoteVehicleType == el.codeValue){
                    item.quoteVehicleTypeName = el.codeName;
                }
            })
            // 查询配送服务标准成本
            if(codeId == 104 && item.endWorkId.length>0){
                this.queryDeliveryCost(item);
            }
            this.$forceUpdate();
        },
        // 选择车长
        vehicleLengthSel(item,codeId){
            this.vehicleLength.forEach(el =>{
                if(item.vehicleLength == el.codeValue){
                    item.vehicleLengthName = el.codeName;
                }
            })
            // 查询配送服务标准成本
            if(codeId == 104 && item.endWorkId.length>0){
                this.queryDeliveryCost(item);
            }
            this.$forceUpdate();
        },
        // 新增定量仓储面积计费
        addFirstTableItem0(){
            let item = this.firstTableItem0[0];
            this.firstTableItem0.push({
                display:1,
                itemCode:item.itemCode,
                itemName:item.itemName,
                itemType:1,
                shareRate:item.shareRate,
                tax:item.tax,
                unit:item.unit
            })
        },
        // 删除定量仓储面积计费
        delFirstTableItem0(index){
            this.firstTableItem0.splice(index,1);
        },
        // 新增按件仓储计费
        addFirstTableItem1(){
            let item = this.firstTableItem1[0];
            this.firstTableItem1.push({
                display:1,
                itemCode:item.itemCode,
                itemName:item.itemName,
                itemType:1,
                countRule:'1',
                remark:'临时仓储计费托数=前⼀天结存+当天⼊库',
                tax:item.tax,
                unit:item.unit,
                unitValue:item.unitValue
            })
        },
        // 删除按件仓储计费
        delFirstTableItem1(index){
            this.firstTableItem1.splice(index,1);
        },
        
        /**
         * 操作
         * @param {费用id} codeId 
         * @param {列表数据} items 
         */
        async operation({codeId,items}){
            // 配送服务和器具回收可以复选
            this.selectNoOnly = (codeId == 104 || codeId == 106);

            this.feeItem = {};
            this.isShowDialog = true;
            this.currentCodeId = codeId;
            // 筛选费用项目对应的子类型
            this.subItemTypeData = [];
            if(codeId=='106' || codeId=='107'){
                this.subItemTypeData = this.deviceTypeData;
            }else{
                this.allSubItemTypeData.forEach(item => {
                    if(item.codeId == codeId){
                        this.subItemTypeData.push(item);
                    }
                })
            }
            // 筛选对应的费用类型
            this.feeTypeData = [];
            this.allFeeTypeData.forEach(item => {
                if(item.codeId == codeId){
                    this.feeTypeData.push(item);
                }
            })
            this.$nextTick(async ()=>{
                this.$refs.table.setRightData(this.common.copyObj(items));
                let {custTenantId,workStoreId} = this.info.baseInfo;
                this.tableData = await this.common.postUrl("wmsQuoteSheetTF", "queryFeeItems", {codeId,custTenantId,workId:workStoreId});
                this.$refs.table.setLeftData(this.common.copyObj(this.tableData));
            })
        },
        // 费用筛选数据变动监听
        tableDataChange(tableData,tableDataRight){
            this.filterTableData();
        },
        // 筛选费用项目
        filterTableData(){
            let feeItem = this.feeItem;
            let tableData = [];
            this.tableData.forEach(item=>{
                let ispush = true;
                for (let key in feeItem) {
                    if(!(feeItem.hasOwnProperty(key) && feeItem[key])){
                        // 不为空
                    }else if(key == 'filterText' && item.itemName.indexOf(feeItem.filterText)>-1){
                        // 筛选费用项目
                    }else if(key != 'filterText' && item[key]==feeItem[key]){
                        // 匹配其他值
                    }else{
                        ispush = false;
                    }
                }
                if(ispush){
                    tableData.push(item);
                }
            })
            this.$refs.table.setLeftData(this.common.copyObj(tableData));
        },
        // 清空筛选条件
        clearFilter(){
            this.feeItem = {
                filterText:"",
                subItemType:"",
                specsType:"",
                feeType:"",
                deviceId:"",
            };
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
                }
            })
            this.isShowDialog = false;
            this.currentCodeId = null;
            this.$forceUpdate();
        },
        /**
         *  生成配送服务的Id
         *  @param {} data
         * */
        generateDeliveryId(items){
            let ids = items.map(item => {
                if(this.common.isNotBlank(item.itemIdLog)){
                    let itemIdLog = String(item.itemIdLog);
                    let itemId = String(item.itemId);
                    let index = Number(itemId.replace(itemIdLog,''));
                    return index;
                }else{
                    return 0;
                }
            });
            let max = Math.max(...ids);
            items.forEach(item => {
                if(this.common.isBlank(item.itemIdLog)){
                    item.itemIdLog = item.itemId;
                    max++;
                    item.itemId = String(item.itemId) + max;
                }
            })
        },
        /**
         * 合并明细
         * @param {费用id} codeId 
         * @param {列表数据} items 
         */
        async mergeFee(){
            this.isShowMergeDialog = true;
            let mergeFees = [];
            let storageList;
            this.info.details.forEach(item => {
                // 更新仓储数据
                if(item.codeId == 11){
                    storageList = item.items;
                }
            })
            this.$nextTick(async ()=>{
                storageList.forEach(item => { //遍历更新合并数据
                    if(item.merge == 1){
                        mergeFees.push(item);
                    }
                })
                this.$refs.mergeTable.setRightData(mergeFees);
                this.$refs.mergeTable.setLeftData(this.common.copyObj(storageList));
                this.mergeTableDataChange(null,mergeFees)
            })
        },
        // 费用变动统计
        mergeTableDataChange(tableData,tableDataRight){
            this.priceTotal = 0;
            this.priceWithTaxTotal = 0;
            tableDataRight.forEach(el => {
                let price = isNaN(Number(el.price))?0:Number(el.price);
                let priceWithTax = isNaN(Number(el.priceWithTax))?0:Number(el.priceWithTax);
                this.priceTotal += price;
                this.priceWithTaxTotal += priceWithTax;
            })
            this.priceTotal = this.priceTotal.toFixed(2);
            this.priceWithTaxTotal = this.priceWithTaxTotal.toFixed(2);
        },
        // 保存费用项目的更改
        saveMerge(){
            let leftData = this.$refs.mergeTable.getLeftData();
            leftData.forEach(item => {
                item.merge = undefined;
            })
            let rightData = this.$refs.mergeTable.getRightData();
            rightData.forEach(item => {
                item.merge = 1;
            })            
            this.info.details.forEach(item => {
                // 更新仓储数据
                if(item.codeId == 11){
                    item.items = [...leftData,...rightData];
                }
            })
            this.isShowMergeDialog = false;
            this.$forceUpdate();
        },
        // 选择客户
        async changeCustomer(id){
            this.customerData.forEach(item => {
                if(item.tenantId == id){
                    this.info.baseInfo.custName = item.name;
                }
            });
            // 带出客户信息
            let list = await this.common.postUrl("wmsQuoteSheetTF", "queryQuoteSheetCustomerHisByTenantId", {tenantId: id});
            if(list.length>0){
                list.forEach(item => {
                    if(item.tenantId == id){
                        if (this.common.isBlank(this.info.baseInfo.linkman))
                            this.info.baseInfo.linkman = item.linkman;
                        if (this.common.isBlank(this.info.baseInfo.billId))
                            this.info.baseInfo.billId = item.linkPhone;
                        if (this.common.isBlank(this.info.baseInfo.email))
                            this.info.baseInfo.email = item.email;
                    }
                })
            }else{
                this.info.baseInfo.linkman = '';
                this.info.baseInfo.billId = '';
                this.info.baseInfo.email = '';
            }
            // 查询初始化费用项目
            if(this.common.isNotBlank(this.info.baseInfo.workStoreId) && !this.isCopy){
                await this.initAddData();
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
            }
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
        // 增加费用
        addFee(list){
            let obj = {
                itemName:'', 
                tax:'', 
                unit:'', 
                price:'',
                priceWithTax:'',
                remark:'',
            }
            list.items.push(obj)
        },
        /**
         * 删除费用列表
         * list 当前遍历列表
         * index 删除行的下标
         */
         delFee(list,item,index){
            if(list.length == 1){
                this.$message.error("至少保留一条数据");
                return
            }
            if(item.merge == 1){
                this.$message.error("已合并费用不能删除，请移除合并费用后再操作。");
                return
            }
            list.splice(index,1);
         },
         /**
          * 计算费用
          * @param {当前行} item 
          * @param {当前字段} code 
          * @returns 
          */
         calcFee(item,code){
             if(code == "price"){    //算价税合计
                item.priceWithTax = this.common.accMul(item.price,(1 + this.common.accDiv(item.tax,100))).myToFixed(2);
             }else if(code == "priceWithTax"){  //算未税单价
                item.price = this.common.accDiv(item.priceWithTax,(1 + this.common.accDiv(item.tax,100))).myToFixed(2);
             }else if(code == 'tax'){
                if(this.common.isNotBlank(item.price)){
                    item.priceWithTax = this.common.accMul(item.price,(1 + this.common.accDiv(item.tax,100))).myToFixed(2);
                }
             }
             this.$forceUpdate();
         },
        //  下一步
        toNext(){
            let mergeList = [];
            if(!this.checkPageOne()) return;
            this.info.details.forEach(el => {
                // 遍历取需要的费用项目
                if(el.display == 1 && el.codeId!=1){
                    el.items.forEach(item => {
                        mergeList.push(item);                        
                    })
                }
            })
            // 新增的项目
            let addItems = mergeList.filter(obj => !this.mergeListCache.some(obj2 => obj2.itemId === obj.itemId));            
            this.mergeListCache = [...this.mergeListCache,...addItems];
            // 新增项目赋值到备选区
            this.mergeList = [...this.mergeList,...addItems];
            // 更新被选取数据
            this.mergeList = mergeList.filter(obj => this.mergeList.some(obj2 => obj2.itemId === obj.itemId));
            // 被删减的项目
            let delItems = this.mergeListCache.filter(obj => !mergeList.some(obj2 => obj2.itemId === obj.itemId));
            // 从缓存区删除
            this.mergeListCache = this.mergeListCache.filter(obj => !delItems.find(idObj => idObj.itemId === obj.itemId));
            if(delItems.length>0){
                //从备选区删除
                this.mergeList = this.mergeList.filter(obj => !delItems.find(idObj => idObj.itemId === obj.itemId));
            }
            this.mergeArr.forEach(el => {
                el.merge.forEach(merge => {
                    // 从合并区删除
                    if(delItems.length>0){
                        merge.items = merge.items.filter(obj => !delItems.find(idObj => idObj.itemId === obj.itemId));
                        if(merge.items.length==1 && el.rebuildType==1){  //子类不存在只剩空的合并类时,只保留合并名称和备注
                            merge.items[0] = {
                                itemName:merge.items[0].itemName,
                                remark:merge.items[0].remark,
                            }
                        }
                    }
                    // 更新合并区数据
                    let items = mergeList.filter(obj => merge.items.some(obj2 => obj2.itemId === obj.itemId));
                    if(el.rebuildType == 1){
                        merge.items = [merge.items[0],...items]
                    }
                    if(el.rebuildType == 2){
                        merge.items = items;
                    }
                })
            })
            this.updateMerge();
            this.step = 2;
         },
        //  上一步
         toPre(){
             this.step = 1;
         },
        //  新增合并大类
         addMerge(){
            this.mergeArr.push({
                rebuildType:"1",
                merge:[{
                    items:[{}]
                }]
            });
         },
         /**
          * 
          * @param {合并数组} arr 
          * @param {删除数据的下标} index 
          */
         delMerge(arr,index,type){
            arr[index].merge.forEach(merge => {
                merge.items.forEach((item,index) => {
                    if(index>0 || type==2){
                        this.mergeList.push(item);
                    }
                })            
            })
            arr.splice(index,1);
         },
        //  选择合并/分类项
         changeRebuildType(merges){
            let type = merges.rebuildType;
            merges.merge.forEach(merge => {
                merge.items.forEach((item,index) => {
                    if(type == 1){  //分类项改成合并项
                        this.mergeList.push(item);
                    }
                    if(type == 2 && index>0){   //合并项改成分类项
                        this.mergeList.push(item);
                    }
                })            
            })
            if(type == 1){    //合并项
                merges.merge = [{items:[{}]}];
            }
            if(type == 2){    //分类项
                merges.merge = [{items:[]}];
            }
            this.$forceUpdate();
         },
         /**
          * 新增合并小类
          * @param {*} merge 
          * @param {合并项/分类项} type 
          */
         addMergeItem(merge,type){
            if(type == 1){
                merge.push(    //合并项
                    {
                        items:[{}]
                    }
                );
            }
            if(type == 2){    //分类项
                merge.push(
                    {
                        items:[]
                    }
                );
            }
         },
         //删除合并小类
         delMergeItem(merges,index,type){
            // 把删除的小类放回去备选区
            merges[index].items.forEach((item,index) => {
                if(index>0 || type==2){
                    this.mergeList.push(item);
                }
            })
            merges.splice(index,1);
         },
        //  更新合并信息
        updateMerge(){
            // 遍历全体更新
            this.mergeArr.forEach(el => {
                let type = el.rebuildType;
                el.merge.forEach((merge,i) => {
                    if(merge.items.length>1){
                        if(type == 2){  //分类项
                            
                        }else{
                            let defaultUnit = merge.items[1].unit;  //第一行计费单位，用于赋值和判断和其他计费单位是否相同
                            let defaultTax = merge.items[1].tax;  //第一行计费单位，用于赋值和判断和其他计费单位是否相同
                            let price = 0,priceWithTax = 0,relIds = [];
                            merge.items.forEach((item,index) => {
                                if(index>0){
                                    price += Number(item.price);
                                    priceWithTax += Number(item.priceWithTax);
                                    relIds.push(Number(item.itemId));
                                }
                            })
                            // 价格合计与计费单位赋值
                            merge.items[0] = {
                                itemName:merge.items[0].itemName,
                                remark:merge.items[0].remark,
                                unit:defaultUnit,
                                tax:defaultTax,
                                price:price.myToFixed(2),
                                priceWithTax:priceWithTax.myToFixed(2),
                                relIds,
                            }

                            // 过滤不需要比较的数据然后做判断
                            let items = this.common.copyObj(merge.items);
                            items = items.filter((item,index) => {
                                if(this.common.isNotBlank(item.price) && item.price != 0 && index!=0) return item;
                            });
                            items.forEach((item,index) => {
                                if(items[0].unit != item.unit){
                                    this.$message.error("重组的费用项目计费单位需一致，请重新调整！")
                                }
                                if(items[0].tax != item.tax){
                                    this.$message.error("重组的费用项目增值税率需一致，请重新调整！")
                                }
                            })
                        }
                    }
                })
            })
            this.$forceUpdate();
        },
        // 预览
        toView(){
            this.step = 3;
            let rebuildDetails = [];
            this.mergeArr.forEach(el => {
                let items = [];
                el.merge.forEach(merge => {
                    if(el.rebuildType == 1){    //合并项
                        items.push(merge.items[0]);
                    }
                    if(el.rebuildType == 2){    //分类项
                        merge.items.forEach(item => {
                            items.push(item);
                        })
                    }
                })
                rebuildDetails.push({titleName:el.titleName,items});
            })
            this.rebuildDetails = rebuildDetails;
        },
        // 取消预览
        cancelView(){
            this.step = 2;
        },
        firstTableItemChange(){
             let allNoDisplay = true;
            for (let i = 0; i < this.firstTableItem0.length; i++) {
                if(this.firstTableItem0[i].display==1){
                    allNoDisplay = false;
                    break;
                }
            }
            for (let i = 0; i < this.firstTableItem1.length; i++) {
                if(this.firstTableItem1[i].display==1){
                    allNoDisplay = false;
                    break;
                }
            }
            if(allNoDisplay){
                this.firstTableItem.display = 0;
            }
            this.forceUpdate();
        },
        // 检测第一页内容是否填写完整
        checkPageOne(){
            let {custTenantId,workStoreId,settleBody,quoteDate} = this.info.baseInfo;
            if(this.common.isBlank(quoteDate)){
                this.$message.error("请选择报价时间");
                return false;
            }
            if(this.common.isBlank(custTenantId)){
                this.$message.error("请先选择客户");
                return false;
            }
            if(this.common.isBlank(workStoreId)){
                this.$message.error("请先选择仓库");
                return false;
            }
            if(this.common.isBlank(settleBody)){
                this.$message.error("请先选择结算主体");
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
        //  提交
        async submit(){
            if(!this.checkPageOne()) return;
            // 置空不选择项目
            this.info.details.forEach(item => {
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
            // 获取第一页relIds
            let relIdsOne = [];
            this.info.details.forEach(el => {
                if(el.display == 1 && el.codeId!=1){
                    el.items.forEach(item => {
                        relIdsOne.push(Number(item.itemId));
                    })
                }
            })
            // 获取第二页relIds
            let relIdsTwo = [];
            this.mergeArr.forEach(el => {
                if(el.rebuildType == 1){
                    el.merge.forEach(m => {
                        if (m.items[0] && m.items[0].relIds)
                        {
                            relIdsTwo = [...relIdsTwo,...m.items[0].relIds];
                        }
                    })
                }
                if(el.rebuildType == 2){
                    el.merge.forEach(m => {
                        m.items.forEach(item => {
                            relIdsTwo.push(item.itemId);
                        })
                    })
                }
            })
            relIdsTwo = relIdsTwo.map(Number);
            // 判断第一二页relIds是否一致，不一致需要重新合并
            console.log(relIdsOne,relIdsTwo)
            let areEqualOne = relIdsOne.every(value => relIdsTwo.includes(value));
            let areEqualTwo = relIdsTwo.every(value => relIdsOne.includes(value));
            if(relIdsTwo.length > 0 && (!areEqualOne || !areEqualTwo)){
                this.$message.error('费用类型有改动，请合并费用项目。');
                return
            }
            // 合并项目重组，没操作合并明细不做数据重组
            if(this.mergeListCache.length>1 && this.mergeListCache.length!=this.mergeList.length){
                if(this.mergeList.length>0){
                    this.$message.error('存在未合并费用项目，请合并！');
                    return
                }
                let rebuildDetails = [];
                let isEmpty,title,cIndex,titleEmpty=false,varyUnit=false,varyTax=false;
                if (this.mergeArr)
                {
                    this.mergeArr.forEach((el,pI) => {
                        let rebuildType = el.rebuildType;
                        if(rebuildType == 1){    //合并项
                            let items = []
                            el.merge.forEach((merge,cI) => {
                                items.push(merge.items[0]);   //插入合并项数据
                                // 标题是否为空
                                if(this.common.isBlank(merge.items[0].itemName) || this.common.isBlank(el.titleName)){
                                    titleEmpty = true;
                                }
                                if(merge.items.length == 1){    //存在空合并
                                    isEmpty = true;
                                    title = el.titleName;
                                    cIndex = cI;
                                }
                                let defaultUnit = merge.items[0].unit;  //第一行计费单位，用于判断和其他计费单位是否相同
                                let defaultTax = merge.items[0].tax;  //第一行计费单位，用于判断和其他计费单位是否相同
                                merge.items.forEach(item => {
                                    if(this.common.isNotBlank(item.price) && item.price != 0){
                                        if(defaultUnit!= item.unit) varyUnit=true;
                                        if(defaultTax!= item.tax) varyTax=true;
                                    }
                                })
                            })
                            rebuildDetails.push({titleName:el.titleName,rebuildType,items});
                        }else if(rebuildType == 2){  //分类项
                            let relIds = []
                            el.merge.forEach((merge,cI) => {
                                merge.items.forEach(item => {
                                    relIds.push(Number(item.itemId));
                                })
                                if(merge.items.length == 0){    //存在空合并
                                    isEmpty = true;
                                    title = el.titleName;
                                    cIndex = cI;
                                }
                            })
                            rebuildDetails.push({titleName:el.titleName,relIds,rebuildType});
                        }
                    })
                }
                if(titleEmpty){
                    this.$message.error('重组费用项目名称不能为空！');
                    return
                }
                if(isEmpty){
                    this.$message.error(`${title}的第${cIndex+1}个费用项目合并费用为空，请处理！`)
                    return
                }
                if(varyUnit){
                    this.$message.error('合并项的费用项目计费单位需一致！')
                    return
                }
                if(varyTax){
                    this.$message.error('合并项的费用项目增值税率需一致！')
                    return
                }
                this.info.rebuildDetails = rebuildDetails;
            }else{  //没合并则清空数组
                this.info.rebuildDetails = undefined;
            }
            let info = this.common.copyObj(this.info);
            // 提交前配置好itemId和subItemId
            info.details.forEach(el => {
                if(el.codeId == 104 || el.codeId == 106){
                    el.items.forEach(item => {
                        item.subItemId = item.itemId;
                        item.itemId = item.itemIdLog;
                    })
                }
            })
            console.log(info);
            if(this.type == 1 || this.isCopy == 1){     //新增、复制
                await this.common.postUrl('wmsQuoteSheetTF','addQuoteSheet',info,null,null,null,true);
            }else{      //修改
                await this.common.postUrl('wmsQuoteSheetTF','modifyQuoteSheet',info,null,null,null,true);
            }
            this.$message.success("提交成功")
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
    computed: {
        
    }
}