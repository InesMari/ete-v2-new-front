import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue"
import dbTable from "@/components/dbTable/dbTable.vue"
import mySelect from "@/components/mySelect/mySelect.vue"
import tagTable from './tagTable.vue'

export default {
    name: 'inOrderConfirm',
    data() {
        return {
            info:{},
            workId:this.common.userInfo().workId,
            totalInfo:{
                nums:0,
                boxNums:0,
                palletNums:0,
                stockNums:0,
            },
            materialList:[],
            packMaterialList:[],
            reservoirList:[],
            storageListShow:[],
            storageItemList:[],
            storageIdsItem:'',

            showType: 1,            
            hasNewQrcode:false,
            tabs: [
                {name: "入库详情", active: true,type:1,},
                // {name: "标签列表",type:2,},
                // {name: "客户码详情",type:3,},
            ],
            materialCodeList:[],
            isShowDialog:false,
            feeHead: [
                {"name": "费用类型", "code": "itemTypeName", "width": "110"},
                {"name": "费用项目名称", "code": "itemName", "width": "110"},
                {"name": "单位", "code": "unit", "width": "110"},
                {"name": "不含税单价", "code": "price", "width": "110"},
                {"name": "税率", "code": "tax", "width": "110"},
                {"name": "含税价", "code": "priceWithTax", "width": "110"},
                {"name": "不含税金额", "code": "totalFee", "width": "110"},
                {"name": "含税金额", "code": "totalFeeWithTax", "width": "110"}
            ],
            disableIds:[],//下次不展示的
            ableIds:[],//下次展示的

            feeList:[],
            feeListSrc:[],
            feeListDest:[],

            costList:[],
            costListSrc:[],
            initLoadQrcodePageFlag:false,

            specsTypeMap:new Map(),
            noUsedSpecsTypeSet:new Set(),
            storageLoading:false,

            custQrcodeList:[],
            custQrcodeHead:[
                { "name": "客户码ID", "code": "codeNum", "width": "150", "type": "text" },
                { "name": "父标签ID", "code": "parentCodeNum", "width": "150", "type": "text" },
                { "name": "客户码类型", "code": "relCustQrcodeTypeName", "width": "150", "type": "text" },
                { "name": "库位", "code": "reservoirCode", "width": "100", "type": "text" },
                { "name": "库位", "code": "storageCode", "width": "100", "type": "text" },
                { "name": "物料编码", "code": "materialNum", "width": "150", "type": "text" },
                { "name": "物料描述", "code": "materialDesc", "width": "180", "type": "text" },
                { "name": "批次号", "code": "batchNum", "width": "120", "type": "text" },
                { "name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text" },
                { "name": "ASN", "code": "asn", "width": "120", "type": "text" },
                { "name": "客户码状态", "code": "stsName", "width": "80", "type": "text" },
                { "name": "上架人", "code": "onShelvesUserName", "width": "100", "type": "text" },
                { "name": "上架时间", "code": "onShelvesDate", "width": "150", "type": "text" },
                { "name": "下架人", "code": "offShelvesUserName", "width": "100", "type": "text" },
                { "name": "下架时间", "code": "offShelvesDate", "width": "150", "type": "text" },
            ],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.loadInOrderInfo();

        this.common.tableStretch(this.$refs.orderDetail);
        this.common.tableStretch(this.$refs.feeDetail);
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        innerTab,
        tableCommon,
        dbTable,
        mySelect,
        tagTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 页面选择回调
         * @param data
         */
        async selectCallback(data)
        {
            this.tab = data;
            this.showType = data.type;
        },
        /**
         * 初始化加载数据
         * @returns {Promise<void>}
         */
        async init(){
            //加载库区列表
            this.reservoirList  = await this.common.postUrl("wmsReservoirTF", "getReservoirDataSel", {});
            //加载库位列表
            this.storageList = await this.common.postUrl("wmsReservoirTF", "queryBlankStorageList", {inOrderId:this.$route.query.inOrderId});
            console.log(this.storageList[0])
            this.storageListShow = this.storageList.slice(0,20);
            this.storagePageAll = 1;
            this.materialList.forEach(item => {
                item.storageList = this.common.copyObj(this.storageList);
                item.storageListShow = this.common.copyObj(this.storageListShow);
            })
        },
        /**
         * 加载入库单数据
         */
        async loadInOrderInfo()
        {
            let data = await this.common.postUrl("wmsInOrderTF", "queryWmsInOrderInfoForConfirm",
                {inOrderId: this.$route.query.inOrderId}, null, null, null, true);

            this.info = data.info;
            this.hasNewQrcode = data.hasNewQrcode;
            let flag = data.info.state == 4;//是否小程序已经操作
            this.materialList = data.allMaterialList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.materialList[i].original=true;
                if (!flag)//小程序已经操作的使用小程序的
                {
                    this.materialList[i].freezeState=0;
                    this.materialList[i].realNums=this.materialList[i].nums;
                    this.materialList[i].realBoxNums=this.materialList[i].boxNums;
                    this.materialList[i].realPalletNums=this.materialList[i].palletNums;
                    this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                    this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                    this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
                }else{
                    this.totalInfo.nums = data.info.nums;
                    this.totalInfo.boxNums = data.info.boxNums;
                    this.totalInfo.palletNums = data.info.palletNums;
                }
                // this.loadStorageListByReservoirId(this.materialList[i],i,this.$route.query.inOrderId);
                this.materialList[i].show = flag;
                if(flag){
                    this.materialList[i].storageId = [this.materialList[i].storageId];
                }

                this.totalInfo.realNums = this.common.accAdd(this.totalInfo.realNums,this.materialList[i].realNums);
                this.totalInfo.realBoxNums = this.common.accAdd(this.totalInfo.realBoxNums,this.materialList[i].realBoxNums);
                this.totalInfo.realPalletNums = this.common.accAdd(this.totalInfo.realPalletNums,this.materialList[i].realPalletNums);
            }
            this.packMaterialList = data.packMaterialList;
            for (let i = 0; i < this.packMaterialList.length; i++) {
                if(this.common.isBlank(this.packMaterialList[i].realNums)) {
                    this.packMaterialList[i].realNums = this.packMaterialList[i].nums;
                }
            }
            this.feeListSrc = this.common.copyObj(data.feeList);
            for (let i = 0; i < this.feeListSrc.length; i++)
            {
                let item = this.feeListSrc[i];
                if (item.isDefault == 1)
                {
                    this.ableIds.push(item.onlyId);
                    this.feeList.push(item);//放入收入信息
                }
                else
                {
                    this.disableIds.push(item.onlyId);
                }
            }
            this.feeListDest = this.common.copyObj(this.feeList);

            //缓存成本原始数据
            this.costListSrc = this.common.copyObj(data.costList);

            await this.dealCostData();

            await this.calcFee();
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {inOrderId: this.$route.query.inOrderId});
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {inOrderId: this.$route.query.inOrderId});
            if(this.custQrcodeList && this.custQrcodeList.length>0){
                this.tabs.splice(1,0,{name: "客户码详情",type:3});
            }
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.splice(1,0,{name: "标签详情",type:2});
            }
            this.$forceUpdate();
        },
        async dealCostData()
        {
            this.costList = [];
            let custTenantId = this.info.custTenantId;//客户
            //遍历收入数据，相同的费用项目的成本保持一致，成本又针对客户的优先，没有则用默认的
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];//收入项目
                let cost = null;//成本
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.costListSrc[j];
                    if (item.itemId == costItem.itemId)//项目一样
                    {
                        if (this.common.isBlank(cost))
                        {
                            cost = this.common.copyObj(costItem);//信息使用第一条
                            cost.isWorkOrder = 1;
                            cost.disabled = false;
                            cost.flag = false;//是否作业一直都可选
                        }
                        let supplierData = cost.supplierData;
                        if (this.common.isBlank(supplierData))
                        {
                            supplierData = [];
                        }
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
                        else
                        {
                            //当前供应商已经在可选下拉
                            //如果当前数据的是有指定客户的，优先
                            if (this.common.isNotBlank(costItem.custTenantId))
                            {
                                for (let k = 0; k < supplierData.length; k++)
                                {
                                    let tenantItem = supplierData[k];
                                    if (tenantItem.tenantId == costItem.tenantId)
                                    {
                                        tenantItem.price = costItem.price;
                                        tenantItem.tax = costItem.tax;
                                        tenantItem.priceWithTax = costItem.priceWithTax;
                                        break;
                                    }
                                }
                            }
                        }
                        if (custTenantId == costItem.custTenantId)
                        {
                            cost = this.common.copyObj(costItem);//有客户的优先
                            cost.isWorkOrder = 1;
                            cost.disabled = false;
                            cost.flag = false;//是否作业一直都可选
                        }
                        cost.supplierData = supplierData;
                    }
                }
                if (this.common.isBlank(cost))
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
                        flag: true,
                    }
                }
                this.costList.push(cost);
            }
            this.calcCostTotal();
            this.$forceUpdate();
        },
        calcNums(idx){
            this.totalInfo.realNums = 0;
            this.totalInfo.realBoxNums = 0;
            this.totalInfo.realPalletNums = 0;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.realNums = this.common.accAdd(this.totalInfo.realNums,this.materialList[i].realNums);
                //计算箱数 托数
                let perBoxNums = this.materialList[i].perBoxNums;
                let perPalletNums = this.materialList[i].perPalletNums;
                if(perBoxNums){
                    let tmp = this.common.accDiv(this.materialList[i].realNums,perBoxNums);
                    this.materialList[i].realBoxNums = Math.ceil(tmp);
                }
                if(perPalletNums){
                    let tmp = this.common.accDiv(this.materialList[i].realNums,perPalletNums);
                    this.materialList[i].realPalletNums = Math.ceil(tmp);
                }
                this.totalInfo.realBoxNums = this.common.accAdd(this.totalInfo.realBoxNums,this.materialList[i].realBoxNums);
                this.totalInfo.realPalletNums = this.common.accAdd(this.totalInfo.realPalletNums,this.materialList[i].realPalletNums);
            }
            this.changeStorage();
            this.calcFee();
            this.$forceUpdate();
        },
        calcRealNums(type,idx){
            this.totalInfo.realBoxNums = 0;
            this.totalInfo.realPalletNums = 0;
            this.totalInfo.realNums = 0;
            let perBoxNums = this.materialList[idx].perBoxNums;
            let perPalletNums = this.materialList[idx].perPalletNums;
            let boxNums = this.materialList[idx].realBoxNums;
            let palletNums = this.materialList[idx].realPalletNums;

            if(type==1){
                if (boxNums && perBoxNums){
                    let tmp = this.common.accMul(boxNums, perBoxNums);
                    this.materialList[idx].realNums = Math.round(tmp);
                    if(perPalletNums){
                        let tmp = this.common.accDiv(this.materialList[idx].realNums,perPalletNums);
                        this.materialList[idx].realPalletNums = Math.ceil(tmp);
                    }
                }
            }else if(type==2){
                if (palletNums && perPalletNums){
                    let tmp = this.common.accMul(palletNums, perPalletNums);
                    this.materialList[idx].realNums = Math.round(tmp);
                    if(perBoxNums){
                        let tmp = this.common.accDiv(this.materialList[idx].realNums,perBoxNums);
                        this.materialList[idx].realBoxNums = Math.ceil(tmp);
                    }
                }
            }
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.realNums = this.common.accAdd(this.totalInfo.realNums,this.materialList[i].realNums);
                this.totalInfo.realBoxNums = this.common.accAdd(this.totalInfo.realBoxNums,this.materialList[i].realBoxNums);
                this.totalInfo.realPalletNums = this.common.accAdd(this.totalInfo.realPalletNums,this.materialList[i].realPalletNums);
            }
            this.changeStorage();
            this.calcFee();
            this.$forceUpdate();
        },
        //按照计费规格计算数量
        calcSpecsTypeNums(){
            this.specsTypeMap=new Map();
            this.noUsedSpecsTypeSet=new Set();
            for (let i = 0; i < this.materialList.length; i++) {
                let specsType = this.materialList[i].specsType;
                if(this.noUsedSpecsTypeSet.has(specsType)){
                    let realNums = this.specsTypeMap.get(specsType+"realNums");
                    let realBoxNums = this.specsTypeMap.get(specsType+"realBoxNums");
                    let realPalletNums = this.specsTypeMap.get(specsType+"realPalletNums");
                    this.specsTypeMap.set(specsType+"realNums",this.common.accAdd(realNums,this.materialList[i].realNums));
                    this.specsTypeMap.set(specsType+"realBoxNums",this.common.accAdd(realBoxNums,this.materialList[i].realBoxNums));
                    this.specsTypeMap.set(specsType+"realPalletNums",this.common.accAdd(realPalletNums,this.materialList[i].realPalletNums));
                }else{
                    this.specsTypeMap.set(specsType+"realNums",this.materialList[i].realNums);
                    this.specsTypeMap.set(specsType+"realBoxNums",this.materialList[i].realBoxNums);
                    this.specsTypeMap.set(specsType+"realPalletNums",this.materialList[i].realPalletNums);
                    this.noUsedSpecsTypeSet.add(specsType);
                }
            }
        },

        async calcFee()
        {
            this.calcSpecsTypeNums();
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                let specsType = item.specsType;
                this.noUsedSpecsTypeSet.delete(specsType);
                if (String(item.unit).indexOf('托') >= 0)
                {
                    item.num = this.specsTypeMap.get(specsType+"realPalletNums");
                    // item.num = this.totalInfo.realPalletNums;
                }
                else if (String(item.unit).indexOf('箱') >= 0)
                {
                    item.num = this.specsTypeMap.get(specsType+"realBoxNums");
                    // item.num = this.totalInfo.realBoxNums;
                }
                else
                {
                    if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('吨')>=0){
                        let realNums = 0;
                        for (let i = 0; i < this.materialList.length; i++) {
                            let materialSpecsType = this.materialList[i].specsType;
                            if(materialSpecsType==specsType){
                                if(this.materialList[i].unit!=6&&this.materialList[i].unit!=3){
                                    this.$message.error("物料:"+this.materialList[i].materialNum+"对应的管理单位不一致");
                                    return;
                                }
                                if(this.materialList[i].unit==6){
                                    realNums = this.common.accAdd(realNums,this.materialList[i].realNums);
                                }else{
                                    let tRealNums =this.common.accDiv(this.materialList[i].realNums,1000);
                                    realNums = this.common.accAdd(realNums,tRealNums);
                                }
                            }
                        }
                        item.num = realNums;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('件')>=0){
                        let itemNum = this.getItemNum(specsType,5);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('平方')>=0){
                        let itemNum = this.getItemNum(specsType,2);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('个')>=0){
                        let itemNum = this.getItemNum(specsType,1);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else{
                        item.num = this.specsTypeMap.get(specsType+"realNums");
                    }
                    // item.num = this.totalInfo.realNums;
                }
                this.calcFeeTotal(item);
            }
            if(this.noUsedSpecsTypeSet.size>0&&this.feeList.length>0){
                let str = ",";
                for (let i = 0; i < this.materialList.length; i++) {
                    if(this.noUsedSpecsTypeSet.has(this.materialList[i].specsType)){
                        str += this.materialList[i].materialNum;
                    }
                }
                this.$message.error("物料:"+str.substring(1)+"对应的计费项目不存在，请手工调整费用数量");
                return;
            }
        },

        getItemNum(specsType,unit){
            let realNums = 0;
            for (let i = 0; i < this.materialList.length; i++) {
                let materialSpecsType = this.materialList[i].specsType;
                if(materialSpecsType==specsType){
                    if(this.materialList[i].unit!=unit){
                        this.$message.error("物料:"+this.materialList[i].materialNum+"对应的管理单位不一致");
                        return -1;
                    }
                    if(this.materialList[i].unit==unit){
                        realNums = this.common.accAdd(realNums,this.materialList[i].realNums);
                    }
                }
            }
            return realNums;
        },

        judgeIsNeedCalcCostTotal(param)
        {
            let flag = false;
            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                if (item.isWorkOrder == 0) continue;
                if (item.itemId == param.itemId)
                {
                    item.num = param.num;
                    flag = true;
                }
            }
            if (flag)
            {
                this.calcCostTotal();
            }
        },
        calcFeeTotal(item){
            this.totalInfo.num = 0;
            this.totalInfo.totalFee = 0;
            this.totalInfo.totalFeeWithTax = 0;
            for (let i = 0; i < this.feeList.length; i++) {
                this.feeList[i].totalFeeWithTax= this.common.accMul(this.feeList[i].priceWithTax,this.feeList[i].num);
                let tax = this.common.accDiv(this.feeList[i].tax,100);
                tax = this.common.accAdd(1,tax);
                this.feeList[i].totalFee= this.common.accDiv(this.feeList[i].totalFeeWithTax,tax).myToFixed(2);

                this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            }
            //判断是否需要重新计算成本合计
            this.judgeIsNeedCalcCostTotal(item);
            this.$forceUpdate();
        },
        calcCostTotal(){
            this.totalInfo.costNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;

            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];
                item.totalFeeWithTax= this.common.accMul(item.priceWithTax, item.num);
                let tax = this.common.accDiv(item.tax,100);
                tax = this.common.accAdd(1,tax);
                item.totalFee= this.common.accDiv(item.totalFeeWithTax,tax).myToFixed(2);

                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum, item.num);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee, item.totalFee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax, item.totalFeeWithTax);
            }
            this.$forceUpdate();
        },
        async loadStorageListByReservoirId(item, index){
            let data = [];
            // if (this.common.isNotBlank(item.reservoirId))
            data = await this.common.postUrl("wmsReservoirTF", "queryBlankStorageList", {reservoirId: item.reservoirId,inOrderId:this.$route.query.inOrderId,materialId:item.materialId,batchNum:item.batchNum});
            for (let i = 0; i < data.length; i++) {
                data[i].disable = false;
            }
            this.materialList[index].storageList = data;
            this.materialList[index].storageId=[];
            this.changeStorage(this.materialList[index],index);
            this.$forceUpdate();
        },

        async loadStorageListByReservoirId2({$event,value},item, index){
            if(!$event) return;
            this.storageLoading = true;
            item.storageId = value;
            let data = [];
            // if (this.common.isNotBlank(item.reservoirId))
            data = await this.common.postUrl("wmsReservoirTF", "queryBlankStorageList", {reservoirId: item.reservoirId,inOrderId: this.$route.query.inOrderId,materialId:item.materialId,batchNum:item.batchNum});
            for (let i = 0; i < data.length; i++) {
                data[i].disable = false;
            }
            this.materialList[index].storageList = data;
            // this.materialList[index].storageId=[];
            this.changeStorage(this.materialList[index],index);
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.storageLoading = false;
            })
        },

        /**
         * 选择改变供应商
         * @param item
         * @param index
         */
        changeSupplier(item, index) {
            for (let i = 0; i < item.supplierData.length; i++)
            {
                let data = item.supplierData[i];
                if (data.tenantId == item.tenantId)
                {
                    item.price = data.price;
                    item.tax = data.tax;
                    item.priceWithTax = data.priceWithTax;
                }
            }
            this.calcCostTotal();//换价格重新计算合计
        },
        initRemainPalletNums(){
            let map = new Map();
            for(let j=0;j<this.materialList.length;j++){
                if(this.materialList[j].storageList!=undefined&&this.materialList[j].storageList.length>0){
                    for (let i = 0; i < this.materialList[j].storageList.length; i++) {
                        let data = this.materialList[j].storageList[i];
                        data.disable = false;
                        if(data.storageType==1){
                            if(data.maxPalletNums!=undefined&&data.maxPalletNums>0){
                                if(!data.remainPalletNums){
                                    data.remainPalletNums = data.maxPalletNums;
                                }
                            }
                        }
                    }
                }
            }
            return map;
        },
        // 选择库位回调方法
        changeStorageBack({value},dataItem){
            dataItem.storageId = value.map(Number);
            this.changeStorage(dataItem);
        },
        // 批量选择库位筛选
        filterStorageListAll(query){
            clearTimeout(this.filterStorageListAllTimer);
            this.filterStorageListAllTimer = setTimeout(()=>{
                if(this.common.isBlank(query)){
                    this.storageListShow = this.storageList.slice(0,20);
                    this.disabledLoadMoreAll = false;
                }else{
                    this.storageListShow = this.storageList.filter(item => (item.storageCode.toLowerCase().indexOf(query.toLowerCase()) >= 0));
                    this.disabledLoadMoreAll = true;
                }
            },500);
        },
        refreshStorageListAll(){
            if(this.common.isBlank(this.storageIdsItem)){
                this.storageListShow = this.storageList.slice(0,20);
                this.disabledLoadMoreAll = false;
                this.storagePageAll = 1;
            }
        },
        // 批量选择库位滚动加载
        loadMoreAll(){
            if(this.disabledLoadMoreAll) return;
            this.storagePageAll++;
            this.storageListShow = this.storageList.slice(0,this.storagePageAll*20);
        },
        // 选择库位筛选
        filterStorageList({query,index}){
            let item = this.materialList[index];
            if(this.common.isBlank(query)){
                item.storageListShow = item.storageList.slice(0,20);
            }else{
                item.storageListShow = item.storageList.filter(el => (el.storageCode.toLowerCase().indexOf(query.toLowerCase()) >= 0));
            }
            this.$forceUpdate();
        },
        // 选择库位滚动加载
        loadMore(index){
            let item = this.materialList[index];
            item.storagePage++;
            item.storageListShow = item.storageList.slice(0,item.storagePage*20);
            this.$forceUpdate();
        },
        // 批量选择库位
        async selectStorageIds(){
            if(this.common.isBlank(this.storageIdsItem)){
                this.storageListShow = this.storageList.slice(0,20);
                this.$forceUpdate();
                return
            }
            //重新赋值库位列表
            this.materialList.forEach(item => {
                item.storageId = [this.storageIdsItem.storageId];
                item.reservoirId = this.storageIdsItem.reservoirId;
                this.changeStorage(item);
                let hasShow = false; //展示列表是否有该条数据
                item.storageListShow.forEach(el => {
                    if(el.storageId == this.storageIdsItem.storageId) hasShow = true;
                })
                if(!hasShow){   //没有则插入
                    item.storageListShow.push(this.storageListShow.find(el => el.storageId == this.storageIdsItem.storageId));
                }
            })
        },
        /**
         * 改变选择库位
         */
        async changeStorage(dataItem) {
            let that = this;
            let map2 = new Map();
            //判断
            if (!dataItem.reservoirId && dataItem.storageId.length > 0) {
                for (const storageId of dataItem.storageId) {
                    let data = dataItem.storageList.find(t => t.storageId == storageId);
                    dataItem.reservoirId = data.reservoirId;
                    data = await this.common.postUrl("wmsReservoirTF", "queryBlankStorageList", {
                        reservoirId: dataItem.reservoirId,
                        inOrderId:this.$route.query.inOrderId,
                        materialId: dataItem.materialId,
                        batchNum: dataItem.batchNum
                    });
                    dataItem.storageList = data;
                    this.$forceUpdate();
                }
            }
            this.initRemainPalletNums();
            let maxError = false;
            // for (let i = 0; i < this.materialList.length; i++) {
                for (let j = 0; j < this.materialList.length; j++) {
                    if (this.materialList[j].storageList == undefined || this.materialList[j].storageList.length == 0) {
                        continue;
                    }
                    // if(i==j){
                    //     continue;
                    // }
                    this.materialList[j].storageList.forEach(item => {
                        if (map2.get(item.storageId)) {
                            item.disable = true;
                        }
                    });
                    let storageIds = that.materialList[j].storageId;
                    if(Array.isArray(storageIds)){
                        for(let s = 0; s < storageIds.length; s++){
                            let storageId = storageIds[s];
                            let data = this.materialList[j].storageList.find(t => t.storageId == storageId);
                            if(this.common.isNotBlank(data)){
                                if (data.storageType == 1) { //平库逻辑
                                    if (data.maxPalletNums != undefined && data.maxPalletNums > 0) {
                                        let remainPalletNums = data.remainPalletNums;
                                        if (remainPalletNums < dataItem.realPalletNums) {
                                            maxError = true;
                                            continue;
                                        } else if (remainPalletNums == dataItem.realPalletNums) {
                                            map2.set(storageId, 1);
                                        } else {
                                            data.remainPalletNums = remainPalletNums - dataItem.realPalletNums;
                                        }
                                    }
                                } else {//立库逻辑
                                    if (data.isRepeat == 0) {
                                        map2.set(storageId, 1);
                                    }
                                }
                            }
                        }
                    }
                // }
            }
            // if(maxError) this.$message.error("超过最大的托数");
            
            dataItem.storagePage = 1;
            dataItem.storageListShow = dataItem.storageList.slice(0, 20);
        },
        /** 添加入库物料 */
        addDealMaterial(index) {
            let data = this.common.copyObj(this.materialList[index]);
            data.original=false;
            data.storageId = [];
            // this.materialList.push(data);
            this.materialList.splice(index+1,0,data);
            let id = data.id;
            this.calRealNums(id);
            this.calcNums();
        },
        calRealNums(id){
            //分摊金额
            //先找出来有多少同样入库的物料
            //再分摊
            let size = 0;
            for (let i = 0; i < this.materialList.length; i++) {
                let item = this.materialList[i];
                if(id==item.id){
                    size++;
                }
            }
            let j = 0;
            let totalNums = 0;
            for (let i = 0; i < this.materialList.length; i++) {
                let item = this.materialList[i];
                if(id==item.id){
                    j++
                    let nums = item.nums;
                    let tmp = this.common.accDiv(nums,size);
                    let realNums = Math.ceil(tmp);
                    let perPalletNums = item.perPalletNums;
                    if(perPalletNums){
                        if(realNums<perPalletNums){
                            realNums = perPalletNums;
                        }
                    }
                    if(j==size){
                        realNums = this.common.accSub(nums,totalNums);
                    }
                    if(realNums<0){
                        realNums=0;
                    }
                    totalNums = this.common.accAdd(totalNums,realNums);
                    if(totalNums>nums){
                        realNums=this.common.accSub(realNums,this.common.accSub(totalNums,nums));
                        totalNums=nums;
                    }
                    this.materialList[i].realNums = realNums;
                }
            }
        },
        /** 删除入库物料 */
        removeDealMaterial(index) {
            if(this.materialList.length>=1){
                let id = this.materialList[index].id;
                this.materialList.splice(index, 1);
                this.calRealNums(id);
                this.calcNums();
            }
        },
        /**
         * 确认入库
         */
        inOrderDeal(){
            for (let i = 0; i < this.materialList.length; i++) {
                if(this.common.isBlank(this.materialList[i].reservoirId)){
                    this.$message.error("请选择第"+(i+1)+"行的库区！");
                    return;
                }
                if(this.common.isBlank(this.materialList[i].storageId)){
                    this.$message.error("请选择第"+(i+1)+"行的库位！");
                    return;
                }
                // if(this.common.isBlank(this.materialList[i].perNum)){
                //     this.$message.error("请输入第"+(i+1)+"行的每张条码数量！");
                //     return;
                // }
                if(this.common.isBlank(this.materialList[i].realNums)){
                    this.$message.error("请输入第"+(i+1)+"行的实际入库数量！");
                    return;
                }
                if(this.materialList[i].realNums<=0){
                    this.$message.error("第"+(i+1)+"行的实际入库数量不能小于等于0！");
                    return;
                }
                if(this.common.isBlank(this.materialList[i].realBoxNums)){
                    this.$message.error("请输入第"+(i+1)+"行的实际入库箱数！");
                    return;
                }
                if(this.common.isBlank(this.materialList[i].realPalletNums)){
                    this.$message.error("请输入第"+(i+1)+"行的实际入库托数！");
                    return;
                }
                if(this.materialList[i].realPalletNums<=0){
                    this.$message.error("第"+(i+1)+"行的实际入库托数不能小于等于0！");
                    return;
                }
            }
            for (let i = 0; i < this.feeList.length; i++) {
                if(this.common.isBlank(this.feeList[i].num)){
                    this.$message.error("请输入第"+(i+1)+"行收入信息的数量！");
                    return;
                }
            }
            for (let i = 0; i < this.costList.length; i++) {
                if(this.costList[i].isWorkOrder == 1 && this.common.isBlank(this.costList[i].num)){
                    this.$message.error("请输入第"+(i+1)+"行成本信息的数量！");
                    return;
                }
            }
            let param = {};
            param.receiptsImgId = this.$refs.receiptsImg.getImageData().flowId;
            param.receiptsImgPath = this.$refs.receiptsImg.getImageData().storePath;
            param.inOrderId=this.$route.query.inOrderId;
            param.materialList = this.common.copyObj(this.materialList);
            for (let i = 0; i < param.materialList.length; i++) {
                param.materialList[i].storageList=[];
            }
            param.packMaterialList = this.packMaterialList;
            param.feeList = this.feeList;
            param.costList = this.costList;
            let msg = '';
            if(this.totalInfo.realNums != this.totalInfo.nums){
                msg = `
                    <p style="text-align:center;">入库单号：${this.info.inOrderNum}</p>
                    <p style="text-align:center;">计划入库：${this.totalInfo.nums},实际入库：${this.totalInfo.realNums}</p>
                    <p style="text-align:center;">计划入库数量与实际入库数量不一致!</p>
                    <p style="text-align:center;">是否继续？</p>
                    <p style="text-align:center;margin-top:10px;color:red;">注：确认入库后，在库数量=原在库数量+本次实际入库数量</p>
                    `;
            }else{
                msg = `
                    <p style="text-align:center;">入库单号：${this.info.inOrderNum}</p>
                    <p style="text-align:center;">计划入库：${this.totalInfo.nums},实际入库：${this.totalInfo.realNums}</p>
                    <p style="text-align:center;margin-top:10px;color:red;">注：确认入库后，在库数量=原在库数量+本次实际入库数量</p>
                    `;
            }
            let that = this;
            this.$confirm(msg, "确认入库提示" ,{
                confirmButtonText: '确认入库',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                param.ableIds = this.ableIds;
                param.disableIds = this.disableIds;
                that.common.postUrl("wmsInOrderTF", "inOrderDeal", param, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('确认入库成功');
                        that.closePage();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        /** 切换是否冻结 */
        changeSwitch(item) {
            item.freezeState = item.freezeState == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        changeCostSwitch(item) {
            item.isWorkOrder = item.isWorkOrder == 1 ? 0 : 1;
            if (item.isWorkOrder == 0)
            {
                item.tenantId = null;
                item.price = null;
                item.tax = null;
                item.priceWithTax = null;
                item.num = null;
                item.totalFee = null;
                item.totalFeeWithTax = null;
                item.disabled = true;
            }
            else
            {
                let data = item.supplierData[0];
                for (let i = 0; i < item.supplierData.length; i++)
                {
                    if (item.supplierData[i].custTenantId == this.info.custTenantId)
                    {
                        data = item.supplierData[i];//客户的优先
                        break;
                    }
                }
                item.tenantId = data.tenantId;
                item.price = data.price;
                item.tax = data.tax;
                item.priceWithTax = data.priceWithTax;
                item.num = null;
                item.totalFee = null;
                item.totalFeeWithTax = null;
                item.disabled = false;

                for (let i = 0; i < this.feeList.length; i++)
                {
                    let data = this.feeList[i];
                    if (item.itemId == data.itemId)
                    {
                        item.num = data.num;//读取收入的数量
                        break;
                    }
                }

            }
            this.calcCostTotal();//换价格重新计算合计
            this.$forceUpdate();
        },
        /**
         * 费用是否默认
         * @param item
         * @param index
         */
        changeDefaultSwitch(item, index) {
            let msg = `
                    <p style="text-align:center;">您即将选择：<em>否</em></p>
                    <p style="text-align:center;">选择后出库系统不会自动带出该费用</p>
                    <p style="text-align:center;">如果需要系统自动带出请在《选择收入》选择该费用参与保存即可，是否继续?</p>
                    `;
            this.$confirm( msg, "提示",{
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                dangerouslyUseHTMLString: true,
            }).then(async () =>{
                this.feeList.splice(index, 1);
                this.feeListDest = this.common.copyObj(this.feeList);
                this.disableIds.push(item.onlyId);
                for (let j = 0; j < this.ableIds.length; j++)
                {
                    let onlyId = this.ableIds[j];
                    if (onlyId == item.onlyId)
                    {
                        this.ableIds.splice(j, 1);
                        j--;
                    }
                }
                this.totalInfo.num = 0;
                this.totalInfo.totalFee = 0;
                this.totalInfo.totalFeeWithTax = 0;

                await this.dealCostData();

                await this.calcFee();

                this.$forceUpdate();
            }).catch();
        },
        open(){
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.dbTable.setRightData(this.common.copyObj(this.feeListDest));
                this.$refs.dbTable.setLeftData(this.common.copyObj(this.feeListSrc));
            })
        },
        async saveChangeFeeItem()
        {
            let selectItem = this.$refs.dbTable.getRightData();
            this.feeList = [];
            this.ableIds = [];
            this.disableIds = [];
            let set = new Set();
            for (let i = 0; i < selectItem.length; i++)
            {
                let item = selectItem[i];
                item.isDefault = 1;
                this.feeList.push(item);
                set.add(item.onlyId);
            }
            this.feeListDest = this.common.copyObj(this.feeList);
            set.forEach(item => this.ableIds.push(item));
            for (let i = 0; i < this.feeListSrc.length; i++)
            {
                if (!set.has(this.feeListSrc[i].onlyId))
                {
                    this.disableIds.push(this.feeListSrc[i].onlyId);
                }
            }
            this.isShowDialog = false;
            await this.dealCostData();
            this.$forceUpdate();

            await this.calcFee();

            this.$forceUpdate();
        },
        closePage(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        }
    },
    directives: {
        'el-select-loadmore': {
            bind(el, binding, vnode) {
                // 下拉框下拉的框
                const SELECTWRAP_DOM = el.querySelector(
                    '.el-select-dropdown .el-select-dropdown__wrap'
                );
                // 增加滚动监听，
                SELECTWRAP_DOM.addEventListener('scroll', function() {
                    const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                    // 当滚动条滚动到最底下的时候执行接口加载下一页
                    if (condition) {
                        binding.value(vnode.data.attrs.index);
                    }
                });
            }
        }
    },
}
