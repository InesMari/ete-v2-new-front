import myFileModel from '@/components/myFileModel/myFileModel.vue'
import dbTable from "@/components/dbTable/dbTable.vue";
import innerTab from "@/components/innerTab/innerTab.vue"
import tagTable from './tagTable.vue'

export default {
    name: 'outOrderConfirm',
    data() {
        return {
            info: {},
            materialList:[],//物料列表
            packMaterialList:[],//包材列表
            tacticsId:'',
            tacticsData:[],
            dealMaterialData:[],
            batchNumList:[],
            type: this.$route.query.type,// 1 确认分配 2 确认分拣 3 确认出库
            show1: this.$route.query.type > 1,//2 确认分拣 3 确认出库
            show2: this.$route.query.type > 2,
            outOrderId: this.$route.query.outOrderId,
            totalInfo: {
                nums:0,
                boxNums:0,
                palletNums:0,

                nums2:0,
                planNums: 0,
                planBoxNums: 0,
                planPalletNums: 0,

                stockNums:0,
                stockBoxNums:0,
                stockPalletNums:0,
            },
            reservoirList:[],//库区
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
            isLiKu: 1,

            disableIds:[],//下次不展示的
            ableIds:[],//下次展示的

            feeList:[],
            feeListSrc:[],
            feeListDest:[],

            costList: [],
            costListSrc:[],

            specsTypeMap:new Map(),
            noUsedSpecsTypeSet:new Set(),

            showType: 1,            
            hasNewQrcode:false,
            tabs: [
                {name: "出库详情", active: true,type:1,},
                // {name: "标签列表",type:2,},
                // {name: "客户码详情",type:3,},
            ],
            materialCodeList:[],

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

            timeoutReasonData:[],//超时原因枚举
            timeoutReason:'',//超时原因
            timeoutReasonSelect:'',//选中的超时原因
            // 添加dialog控制变量
            showOutOrderDialog: false, // 控制确认出库对话框显示
            isTimeout: false, // 是否超时
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initReservoirSelectData();
        this.loadInOrderInfo();
        this.common.tableStretch(this.$refs.orderDetail);
        this.common.tableStretch(this.$refs.feeDetail);
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        dbTable,
        innerTab,
        tagTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        async selectCallback(data)
        {
            this.tab = data;
            this.showType = data.type;
        },
        async initReservoirSelectData(){
            //加载库区列表
            this.reservoirList = await this.common.postUrl("wmsReservoirTF", "getReservoirDataSel", {});
        },
        /**
         * 加载出库单数据
         */
        async loadInOrderInfo()
        {
            let data = await this.common.postUrl("wmsOutOrderTF", "queryWmsOutOrderInfoForView",
                {outOrderId: this.outOrderId}, null, null, null, true);
            this.info = data.info;
            this.materialList = data.materialList;
            this.isLiKu = data.isLiKu;
            this.packMaterialList = data.packMaterialList;

            let materialIds = [];
            for (let i = 0; i < this.materialList.length; i++) {
                this.materialList[i].original = true;
                materialIds.push(this.materialList[i].materialId);
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
            }
            //根据物料的批次查询
            if (this.type == 2)//2 确认分拣
            {
                let that = this;
                let map = new Map();
                that.baseBatchNumList =  await that.common.postUrl("wmsAllocatTF", "queryMaterialListForOutOrder", {
                    materialIds,
                    srcTenantId: data.info.srcTenantId,
                });
                that.baseBatchNumList.forEach(item => {
                    for(let i in that.materialList)
                    {
                        let material = that.materialList[i];
                        if (item.materialId == material.materialId
                            && item.materialSpecsId == material.materialSpecsId
                            && item.fromTenantId == material.fromTenantId) {
                            item.workDetailName = material.workDetailName;
                        }
                    }
                })
                //批次去重
                for (let i = 0; i < that.baseBatchNumList.length; i++) {
                    let item = that.baseBatchNumList[i];
                    if (!map.get(item.batchNum)) {
                        that.batchNumList.push(that.common.copyObj(item));
                        map.set(item.batchNum, 1);
                    }
                }
                // //查询策略
                // this.tacticsData = await that.common.postUrl("wmsOutOrderTF", "queryAllTactics",{});
                // //选择策略
                // for (let i = 0; i < this.tacticsData.length; i++) {
                //     if(this.tacticsData[i].isDefault){
                //         this.tacticsId=this.tacticsData[i].id;
                //         break;
                //     }
                // }
                if(this.isLiKu==1) {
                    this.dealMaterialData=[];
                    this.dealMaterialData.push({materialDesc: '', unitName: '', workDetailName: '',});
                }else{
                    await this.doTactics();
                }
            }
            if (this.type == 3)// 3 确认出库
            {
                //查询加载分拣的数据回显
                let data2 = await this.common.postUrl("wmsOutOrderTF", "loadOutOrderSortingMaterialData", {outOrderId: this.outOrderId});
                this.tacticsId = data2.tacticsId > 0 ? data2.tacticsId : '';
                this.tacticsData = data2.tacticsData;
                this.batchNumList = data2.batchNumList;
                this.dealMaterialData = data2.dealMaterialData;
                if(this.info.orderType==2){
                    this.feeHead.splice(0, 0, {"name": "货主", "code": "srcTenantName", "width": "110", "type": "text"});
                }
                //确认出库自动赋值实际出库件数
                for (let index = 0; index < this.dealMaterialData.length; index++)
                {
                    if(this.common.isBlank(this.dealMaterialData[index].realNums)){
                        if(this.info.newScanQrcode == 1){   //新扫码
                            this.dealMaterialData[index].realNums = 0;
                        }else{  //旧逻辑
                            this.dealMaterialData[index].realNums = this.dealMaterialData[index].planNums;
                        }
                    }
                    // await this.loadStorageListByReservoirId(this.dealMaterialData[index], index);
                    this.calNums(index);
                }
                for (let i = 0; i < this.packMaterialList.length; i++) {
                    if(this.common.isBlank(this.packMaterialList[i].realNums)){
                        this.packMaterialList[i].realNums = this.packMaterialList[i].nums;
                    }
                }
                let feeList = await this.common.postUrl("wmsOutOrderTF", "getOutSaleFeeList", {srcTenantId: this.info.srcTenantId,outOrderId: this.outOrderId});
                this.feeListSrc = this.common.copyObj(feeList);
                for (let i = 0; i < feeList.length; i++)
                {
                    let item = feeList[i];
                    if (item.isDefault == 1)
                    {
                        this.ableIds.push(item.onlyId);
                        this.feeList.push(item);
                    }
                    else
                    {
                        this.disableIds.push(item.onlyId);
                    }
                }
                this.feeListDest = this.common.copyObj(this.feeList);

                let costList = await this.common.postUrl("wmsOutOrderTF", "getOutCostList", {outOrderId: this.outOrderId});
                this.costListSrc = this.common.copyObj(costList);

                await this.dealCostData();

                await this.calcFee();

                this.$forceUpdate();
            }
            // 查询条码详情
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {outOrderId: this.$route.query.outOrderId,isLoadAllOut:1});
            if(this.materialCodeList.length<1){
                this.hasNewQrcode = false
            }else{
                this.hasNewQrcode = true
            }
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {outOrderId: this.$route.query.outOrderId});
            this.hasNewQrcode = this.custQrcodeList.length>0||this.hasNewQrcode;

            if(this.custQrcodeList && this.custQrcodeList.length>0){
                this.tabs.splice(1,0,{name: "客户码详情",type:3});
            }
            if(this.materialCodeList && this.materialCodeList.length>0){
                this.tabs.splice(1,0,{name: "标签详情",type:2});
            }

            let datas = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'TIMEOUT_REASON2'});
            this.timeoutReasonData = datas.TIMEOUT_REASON2;//超时原因
        },
        async dealCostData()
        {
            this.costList = [];
            // let custTenantId = this.info.custTenantId;//客户
            //遍历收入数据，相同的费用项目的成本保持一致，成本又针对客户的优先，没有则用默认的
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];//收入项目
                let custTenantId = item.custTenantId;
                let cost = null;//成本
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.costListSrc[j];
                    if (item.itemId == costItem.itemId)//项目一样
                    {
                        if (this.common.isNotBlank(costItem.custTenantId) && costItem.custTenantId != custTenantId)//客户不相同
                        {
                            continue;
                        }
                        if (this.common.isBlank(cost))
                        {
                            cost = this.common.copyObj(costItem);//信息使用第一条
                            cost.srcTenantId = item.srcTenantId;
                            cost.srcTenantName = item.srcTenantName;
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
                        srcTenantId:item.srcTenantId,
                        srcTenantName:item.srcTenantName,
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
        //按照计费规格计算数量
        calcSpecsTypeNums(){
            this.specsTypeMap=new Map();
            this.noUsedSpecsTypeSet=new Set();
            for (let i = 0; i < this.dealMaterialData.length; i++) {
                let specsType = this.dealMaterialData[i].specsType;
                let srcTenantId = this.dealMaterialData[i].srcTenantId;//存在多货主的情况，把货主也当做key的一部分
                let keyPrefix = srcTenantId+'_'+specsType;
                if(this.noUsedSpecsTypeSet.has(keyPrefix)){
                    let realNums = this.specsTypeMap.get(keyPrefix+"realNums");
                    let realBoxNums = this.specsTypeMap.get(keyPrefix+"realBoxNums");
                    let realPalletNums = this.specsTypeMap.get(keyPrefix+"realPalletNums");
                    this.specsTypeMap.set(keyPrefix+"realNums",this.common.accAdd(realNums,this.dealMaterialData[i].realNums));
                    this.specsTypeMap.set(keyPrefix+"realBoxNums",this.common.accAdd(realBoxNums,this.dealMaterialData[i].boxNums));
                    this.specsTypeMap.set(keyPrefix+"realPalletNums",this.common.accAdd(realPalletNums,this.dealMaterialData[i].palletNums));
                }else{
                    this.specsTypeMap.set(keyPrefix+"realNums",this.dealMaterialData[i].realNums);
                    this.specsTypeMap.set(keyPrefix+"realBoxNums",this.dealMaterialData[i].boxNums);
                    this.specsTypeMap.set(keyPrefix+"realPalletNums",this.dealMaterialData[i].palletNums);
                    this.noUsedSpecsTypeSet.add(keyPrefix);
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
                let srcTenantId = item.srcTenantId;
                let keyPrefix = srcTenantId+'_'+specsType;
                if (String(item.unit).indexOf('托') >= 0)
                {
                    item.num = this.specsTypeMap.get(keyPrefix+"realPalletNums");
                    // item.num = this.totalInfo.stockPalletNums;
                }
                else if (String(item.unit).indexOf('箱') >= 0)
                {
                    item.num = this.specsTypeMap.get(keyPrefix+"realBoxNums");
                    // item.num = this.totalInfo.stockBoxNums;
                }
                else
                {
                    if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('吨')>=0){
                        let realNums = 0;
                        for (let i = 0; i < this.dealMaterialData.length; i++) {
                            let materialSpecsType = this.dealMaterialData[i].specsType;
                            let srcTenantId = this.dealMaterialData[i].srcTenantId;
                            let materialSpecsTypePrefix = srcTenantId+'_'+materialSpecsType;
                            if(materialSpecsTypePrefix==keyPrefix){
                                if(this.dealMaterialData[i].unit!=6&&this.dealMaterialData[i].unit!=3){
                                    this.$message.error("物料:"+this.dealMaterialData[i].materialNum+"对应的管理单位不一致");
                                    return;
                                }
                                if(this.dealMaterialData[i].unit==6){
                                    realNums = this.common.accAdd(realNums,this.dealMaterialData[i].realNums);
                                }else{
                                    let tRealNums =this.common.accDiv(this.dealMaterialData[i].realNums,1000);
                                    realNums = this.common.accAdd(realNums,tRealNums);
                                }
                            }
                        }
                        item.num = realNums;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('件')>=0){
                        let itemNum = this.getItemNum(keyPrefix,5);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('平方')>=0){
                        let itemNum = this.getItemNum(keyPrefix,2);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else if(this.common.isNotBlank(item.unit)&&String(item.unit).indexOf('个')>=0){
                        let itemNum = this.getItemNum(keyPrefix,1);
                        if(itemNum==-1){
                            return;
                        }
                        item.num = itemNum;
                    }else{
                        item.num = this.specsTypeMap.get(keyPrefix+"realNums");
                    }
                    // item.num = this.totalInfo.stockNums;
                }
                this.noUsedSpecsTypeSet.delete(keyPrefix);
                this.calcFeeTotal(item);
            }
            if(this.noUsedSpecsTypeSet.size>0&&this.feeList.length>0){
                let str = ",";
                for (let i = 0; i < this.materialList.length; i++) {
                    if(this.noUsedSpecsTypeSet.has(this.dealMaterialData[i].srcTenantId+'_'+this.materialList[i].specsType)){
                        str += this.materialList[i].materialNum;
                    }
                }
                this.$message.error("物料:"+str.substring(1)+"对应的计费项目不存在，请手工调整费用数量");
                return;
            }
        },

        getItemNum(keyPrefix,unit){
            let realNums = 0;
            for (let i = 0; i < this.dealMaterialData.length; i++) {
                let materialSpecsType = this.dealMaterialData[i].specsType;
                let srcTenantId = this.dealMaterialData[i].srcTenantId;
                let materialSpecsTypePrefix = srcTenantId+'_'+materialSpecsType;
                if(materialSpecsTypePrefix==keyPrefix){
                    if(this.dealMaterialData[i].unit!=unit){
                        this.$message.error("物料:"+this.dealMaterialData[i].materialNum+"对应的管理单位不一致");
                        return -1;
                    }
                    if(this.dealMaterialData[i].unit==unit){
                        realNums = this.common.accAdd(realNums,this.dealMaterialData[i].realNums);
                    }
                }
            }
            return realNums;
        },

        async doTactics(){
            let data = await this.common.postUrl("wmsOutOrderTF", "queryStockListForTactics", {
                srcTenantId: this.info.srcTenantId,
                outOrderId: this.outOrderId,
                tacticsId:this.tacticsId
            });
            if(data){
                this.dealMaterialData=[];
                for (let i = 0; i < data.length; i++) {
                    this.dealMaterialData.push({materialDesc: '', unitName: '', workDetailName: '',});
                    this.dealMaterialData[i].batchNum=data[i].batchNum;
                    this.dealMaterialData[i].planNums=data[i].realNums;
                    this.changeBatchNum(i);
                    this.initSupplierBatchNumList(i);
                    this.dealMaterialData[i].supplierBatchNum=data[i].supplierBatchNum;
                    this.initAsnList(i);
                    this.dealMaterialData[i].asn=data[i].asn;

                    this.initFromTenantList(i);
                    this.dealMaterialData[i].fromTenantId=data[i].fromTenantId;
                    this.initMaterialList(i);
                    this.dealMaterialData[i].materialId=data[i].materialId;
                    this.initMaterialSpecsList(i);
                    this.dealMaterialData[i].materialSpecsId=data[i].materialSpecsId;
                    if(this.isLiKu==1){
                        this.initProduceDateList(i);
                        this.dealMaterialData[i].produceDate=data[i].produceDate;
                        // this.initInDateList(i);
                        // this.dealMaterialData[i].inDate=data[i].inDate;
                        this.initReservoirList(i);
                        this.dealMaterialData[i].reservoirId=data[i].reservoirId;
                        this.initStorageList(i);
                        this.dealMaterialData[i].storageId=data[i].storageId;
                    }
                    this.selMaterial(i);
                }
                this.calStockNums();
            }
        },
        changeBatchNum(index){
            if(!this.dealMaterialData[index].batchNum){
                this.dealMaterialData[index].supplierBatchNumList = [];
                this.dealMaterialData[index].supplierBatchNum = '';
                this.dealMaterialData[index].asnList = [];
                this.dealMaterialData[index].asn = '';
                this.dealMaterialData[index].fromTenantList = [];
                this.dealMaterialData[index].fromTenantId = '';
                this.dealMaterialData[index].materialList=[];
                this.dealMaterialData[index].materialId='';
                this.dealMaterialData[index].materialDesc='';
                this.dealMaterialData[index].unitName='';
                this.dealMaterialData[index].materialSpecsList=[];
                this.dealMaterialData[index].materialSpecsId='';
                if(this.isLiKu==1) {
                    this.dealMaterialData[index].produceDateList=[];
                    this.dealMaterialData[index].produceDate='';
                    // this.dealMaterialData[index].inDateList=[];
                    // this.dealMaterialData[index].inDate='';
                    this.dealMaterialData[index].reservoirList=[];
                    this.dealMaterialData[index].reservoirId='';
                    this.dealMaterialData[index].storageList=[];
                    this.dealMaterialData[index].storageId='';
                    this.dealMaterialData[index].dId = '';
                    this.dealMaterialData[index].dIds = [];
                }
                this.dealMaterialData[index].nums='';
                this.dealMaterialData[index].workDetailName = '';
                this.$forceUpdate();
                return;
            }

            this.batchNumList.forEach(data => {
                if (data.batchNum == this.dealMaterialData[index].batchNum){
                    //分配各个List
                    this.initSupplierBatchNumList(index);
                }
            });
            this.$forceUpdate();
        },
        initSupplierBatchNumList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.supplierBatchNumList = [];
            data.supplierBatchNum = '';
            data.asnList = [];
            data.asn = '';
            data.fromTenantList = [];
            data.fromTenantId = '';
            data.materialList = [];
            data.materialId='';
            data.materialDesc='';
            data.unitName='';
            data.materialSpecsList=[];
            data.materialSpecsId='';
            data.produceDateList=[];
            data.produceDate='';
            if(this.isLiKu==1) {
                // data.inDateList=[];
                // data.inDate='';
                data.reservoirList=[];
                data.reservoirId='';
                data.storageList=[];
                data.storageId='';
                data.dId = '';
                data.dIds = [];
            }
            data.nums='';
            data.workDetailName = '';
            if(!data.batchNum){
                return;
            }
            //去重
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum){
                    if(!map.get(item.supplierBatchNum)){
                        data.supplierBatchNumList.push(this.common.copyObj(item));
                        map.set(item.supplierBatchNum,1);
                    }
                }
            }
            if(data.supplierBatchNumList.length==1){
                data.supplierBatchNum = data.supplierBatchNumList[0].supplierBatchNum;
                this.initAsnList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initAsnList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.asnList = [];
            data.asn = '';
            data.fromTenantList = [];
            data.fromTenantId = '';
            data.materialList = [];
            data.materialId='';
            data.materialDesc='';
            data.unitName='';
            data.materialSpecsList=[];
            data.materialSpecsId='';
            data.produceDateList=[];
            data.produceDate='';
            if(this.isLiKu==1) {
                // data.inDateList=[];
                // data.inDate='';
                data.reservoirList=[];
                data.reservoirId='';
                data.storageList=[];
                data.storageId='';
                data.dId = '';
                data.dIds = [];
            }
            data.nums='';
            data.workDetailName = '';
            if(!data.batchNum){
                return;//没有选择批次号返回
            }
            //去重
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    && item.supplierBatchNum == data.supplierBatchNum){
                    if(!map.get(item.asn)){
                        data.asnList.push(this.common.copyObj(item));
                        map.set(item.asn,1);
                    }
                }
            }
            if(data.asnList.length==1){
                data.asn = data.asnList[0].asn;
                this.initFromTenantList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initFromTenantList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.fromTenantList = [];
            data.fromTenantId = '';
            data.materialList = [];
            data.materialId='';
            data.materialDesc='';
            data.unitName='';
            data.materialSpecsList=[];
            data.materialSpecsId='';
            data.produceDateList=[];
            data.produceDate='';
            if(this.isLiKu==1) {
                // data.inDateList=[];
                // data.inDate='';
                data.reservoirList=[];
                data.reservoirId='';
                data.storageList=[];
                data.storageId='';
                data.dId = '';
                data.dIds = [];
            }
            data.nums='';
            data.workDetailName = '';
            if(!data.batchNum){
                return;//没有选择批次号返回
            }
            //去重
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn){
                    if(!map.get(item.fromTenantId)){
                        data.fromTenantList.push(this.common.copyObj(item));
                        map.set(item.fromTenantId,1);
                    }
                }
            }
            if(data.fromTenantList.length==1){
                data.fromTenantId = data.fromTenantList[0].fromTenantId;
                this.initMaterialList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initMaterialList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.materialList = [];
            data.materialId='';
            data.materialDesc='';
            data.unitName='';
            data.materialSpecsList=[];
            data.materialSpecsId='';
            data.produceDateList=[];
            data.produceDate='';
            if(this.isLiKu==1) {
                // data.inDateList=[];
                // data.inDate='';
                data.reservoirList=[];
                data.reservoirId='';
                data.storageList=[];
                data.storageId='';
                data.dId = '';
                data.dIds = [];
            }
            data.nums='';
            data.workDetailName = '';
            if(!data.fromTenantId){
                return;
            }
            //去重
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId){
                    if(!map.get(item.materialId)){
                        data.materialList.push(this.common.copyObj(item));
                        map.set(item.materialId,1);
                    }
                }
            }
            if(data.materialList.length==1){
                data.materialId = data.materialList[0].materialId;
                data.materialDesc = data.materialList[0].materialDesc;
                data.unitName = data.materialList[0].unitName;
                this.initMaterialSpecsList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initMaterialSpecsList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.materialSpecsList=[];
            data.materialSpecsId='';
            data.produceDateList=[];
            data.produceDate='';
            if(this.isLiKu==1) {
                // data.inDateList=[];
                // data.inDate='';
                data.reservoirList=[];
                data.reservoirId='';
                data.storageList=[];
                data.storageId='';
                data.dId = '';
                data.dIds = [];
            }
            data.nums='';
            data.workDetailName = '';
            if(!data.materialId){
                return;
            }

            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId
                    &&item.materialId==data.materialId){
                    if(!map.get(item.materialSpecsId)){
                        data.materialSpecsList.push(this.common.copyObj(item));
                        map.set(item.materialSpecsId,1);
                    }
                }
            }
            if(data.materialSpecsList.length==1){
                data.materialSpecsId = data.materialSpecsList[0].materialSpecsId;
                if(this.isLiKu==1) {
                    this.initProduceDateList(index);
                }else{
                    this.selMaterial(index);
                }
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initProduceDateList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.produceDateList=[];
            data.produceDate='';
            // data.inDateList=[];
            // data.inDate='';
            data.reservoirList=[];
            data.reservoirId='';
            data.storageList=[];
            data.storageId='';
            data.nums='';
            data.dId = '';
            data.dIds = [];
            data.workDetailName = '';
            if(!data.materialSpecsId){
                return;
            }

            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId
                    &&item.materialId==data.materialId
                    &&item.materialSpecsId==data.materialSpecsId){
                    if(!map.get(item.produceDate)){
                        data.produceDateList.push(this.common.copyObj(item));
                        map.set(item.produceDate,1);
                    }
                }
            }
            if(data.produceDateList.length==1){
                data.produceDate = data.produceDateList[0].produceDate;
                // this.initInDateList(index);
                this.initReservoirList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        // initInDateList(index){
        //     let map = new Map();
        //     let data = this.dealMaterialData[index];
        //     data.inDateList=[];
        //     data.inDate='';
        //     data.reservoirList=[];
        //     data.reservoirId='';
        //     data.storageList=[];
        //     data.storageId='';
        //     data.nums='';
        //     data.dId = '';
        //     data.workDetailName = '';
        //     if(!data.produceDate){
        //         // return;
        //     }
        //     for (let i = 0; i < this.baseBatchNumList.length; i++) {
        //         let item = this.baseBatchNumList[i];
        //         if(item.batchNum==data.batchNum
        //             &&item.supplierBatchNum==data.supplierBatchNum
        //             && item.asn == data.asn
        //             &&item.fromTenantId==data.fromTenantId
        //             &&item.materialId==data.materialId
        //             &&item.materialSpecsId==data.materialSpecsId
        //             &&item.produceDate==data.produceDate){
        //             if(!map.get(item.inDate)){
        //                 data.inDateList.push(this.common.copyObj(item));
        //                 map.set(item.inDate,1);
        //             }
        //         }
        //     }
        //     if(data.inDateList.length==1){
        //         data.inDate = data.inDateList[0].inDate;
        //         this.initReservoirList(index);
        //     }
        //     this.calStockNums();
        //     this.$forceUpdate();
        // },
        initReservoirList(index){
let map = new Map();
            let data = this.dealMaterialData[index];
            data.reservoirList=[];
            data.reservoirId='';
            data.storageList=[];
            data.storageId='';
            data.nums='';
            data.dId = '';
            data.dIds = [];
            data.workDetailName = '';
            // if(!data.inDate){
            //     return;
            // }
            if(!data.produceDate){
                // return;
            }
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId
                    &&item.materialId==data.materialId
                    &&item.materialSpecsId==data.materialSpecsId
                    &&item.produceDate==data.produceDate){
                    if(!map.get(item.reservoirId)){
                        data.reservoirList.push(this.common.copyObj(item));
                        map.set(item.reservoirId,1);
                    }
                }
            }
            if(data.reservoirList.length==1){
                data.reservoirId = data.reservoirList[0].reservoirId;
                this.initStorageList(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        initStorageList(index){
            let map = new Map();
            let data = this.dealMaterialData[index];
            data.storageList=[];
            data.storageId='';
            data.nums='';
            data.dId = '';
            data.dIds = [];
            data.workDetailName = '';
            if(!data.reservoirId){
                return;
            }
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                if(item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId
                    &&item.materialId==data.materialId
                    &&item.materialSpecsId==data.materialSpecsId
                    &&item.produceDate==data.produceDate
                    // &&item.inDate==data.inDate
                    &&item.reservoirId==data.reservoirId){
                    if(!map.get(item.storageId)){
                        if(this.isLiKu==1){
                            item.storageCodeLabel = item.storageCode+'(数量:'+item.nums+')';
                        }else{
                            item.storageCodeLabel = item.storageCode;
                        }
                        data.storageList.push(this.common.copyObj(item));
                        map.set(item.storageId,1);
                    }
                }
            }
            if(data.storageList.length==1){
                if(this.isLiKu==1){
                    data.storageId.push(data.storageList[0].storageId);
                    data.dIds.push(data.storageList[0].dId);
                }else{
                    data.storageId = data.storageList[0].storageId;
                    data.dId = data.storageList[0].dId;
                }
                data.nums = data.storageList[0].nums;
                this.selMaterial(index);
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        selMaterial(index){
            let data = this.dealMaterialData[index];
            data.nums='';
            if(this.isLiKu==1) {
                data.dId = '';
                data.dIds = [];
                data.nums = 0;
            }
            data.workDetailName = '';
            if(!data.materialSpecsId){
                return;
            }
            for (let i = 0; i < this.baseBatchNumList.length; i++) {
                let item = this.baseBatchNumList[i];
                var flag = item.batchNum==data.batchNum
                    &&item.supplierBatchNum==data.supplierBatchNum
                    && item.asn == data.asn
                    &&item.fromTenantId==data.fromTenantId
                    &&item.materialId==data.materialId
                    &&item.materialSpecsId==data.materialSpecsId;
                if(this.isLiKu==1){
                    flag = flag && item.produceDate==data.produceDate
                    &&item.reservoirId==data.reservoirId
                    &&data.storageId.includes(item.storageId);
                }

                if(flag){
                    data.materialDesc = item.materialDesc;
                    data.unitName = item.unitName;
                    data.workDetailName = item.workDetailName;
                    if(this.isLiKu==1) {
                        data.dId = item.dId;
                        data.nums += item.nums;
                        data.dIds.push(item.dId);
                        data.planNums = data.nums;
                    }else{
                        data.nums = item.nums;
                        if (item.nums < data.planNums){
                            data.planNums = item.nums;
                        }
                        break;
                    }
                }
            }
            this.calStockNums();
            this.$forceUpdate();
        },
        /**
         * 计算计划/实际出库数量合计
         */
        calStockNums(){
            this.totalInfo.nums2 = 0;
            this.totalInfo.planNums = 0;
            this.totalInfo.stockNums = 0;
            this.totalInfo.stockBoxNums = 0;
            this.totalInfo.stockPalletNums = 0;
            for (let i = 0; i < this.dealMaterialData.length; i++) {
                this.totalInfo.nums2=this.common.accAdd(this.totalInfo.nums2,this.dealMaterialData[i].nums);
                this.totalInfo.planNums=this.common.accAdd(this.totalInfo.planNums,this.dealMaterialData[i].planNums);
                this.totalInfo.stockNums=this.common.accAdd(this.totalInfo.stockNums,this.dealMaterialData[i].realNums);
                this.totalInfo.stockBoxNums=this.common.accAdd(this.totalInfo.stockBoxNums,this.dealMaterialData[i].boxNums);
                this.totalInfo.stockPalletNums=this.common.accAdd(this.totalInfo.stockPalletNums,this.dealMaterialData[i].palletNums);
            }
            this.$forceUpdate();
        },

        /**
         * 实际出库数量 改变
         * @param index
         */
        calNums(index){
            if(this.dealMaterialData[index].realNums){
                let perBoxNums = this.dealMaterialData[index].perBoxNums;
                let perPalletNums = this.dealMaterialData[index].perPalletNums;
                if(perBoxNums){
                    let tmp = this.common.accDiv(this.dealMaterialData[index].realNums,perBoxNums);
                    this.dealMaterialData[index].boxNums = Math.ceil(tmp);
                }
                if(perPalletNums){
                    let tmp = this.common.accDiv(this.dealMaterialData[index].realNums,perPalletNums);
                    this.dealMaterialData[index].palletNums = Math.ceil(tmp);
                }
            }
            this.calStockNums();
            this.calcFee();
            this.$forceUpdate();
        },
        /**
         * 箱数/托数 改变
         * @param index
         */
        calcNums(index, type){
            if(this.dealMaterialData[index].materialSpecsId){
                let perBoxNums = this.dealMaterialData[index].perBoxNums;
                let perPalletNums = this.dealMaterialData[index].perPalletNums;
                let boxNums = this.dealMaterialData[index].boxNums;
                let palletNums = this.dealMaterialData[index].palletNums;
                if (type === 1)//箱数
                {
                    if (boxNums && perBoxNums)
                    {
                        let tmp = this.common.accMul(boxNums, perBoxNums);
                        this.dealMaterialData[index].nums = Math.round(tmp);
                        if(perPalletNums){
                            let tmp = this.common.accDiv(this.dealMaterialData[index].realNums,perPalletNums);
                            this.dealMaterialData[index].palletNums = Math.ceil(tmp);
                        }
                    }
                }
                else if (type === 2)//托数
                {
                    if (palletNums && perPalletNums)
                    {
                        let tmp = this.common.accMul(palletNums, perPalletNums);
                        this.dealMaterialData[index].realNums = Math.round(tmp);
                        if(perBoxNums){
                            let tmp = this.common.accDiv(this.dealMaterialData[index].realNums,perBoxNums);
                            this.dealMaterialData[index].boxNums = Math.ceil(tmp);
                        }
                    }
                }
            }
            this.calStockNums();
            this.calcFee();
            this.$forceUpdate();
        },
        /**
         * 统计成本合计
         */
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

        /**
         * 确定分配
         * @returns {Promise<void>}
         */
        async sureAllocat()
        {
            await this.common.postUrl("wmsOutOrderTF", "sureAllocat", {outOrderId: this.outOrderId},null,null,'',true);
            this.$message.success('确认分配成功');
            this.close();
        },
        /**
         * 确认分拣
         * @returns {boolean}
         */
        async outOrderAllocat(){
            let param = {outOrderId: this.outOrderId, materialList: this.common.copyObj(this.dealMaterialData),tacticsId: this.tacticsId};
            //追加重复判断处理
            const m = new Map();
            for (let i = 0; i < param.materialList.length; i++) {
                let item = param.materialList[i];
                let key = item.batchNum+'_'+item.supplierBatchNum+'_'+item.asn+'_'+item.fromTenantId+'_'+item.materialId+'_'+item.produceDate+'_'+item.inDate+'_'+item.reservoirId+'_'+item.storageId;
                if(m.get(key)){
                    this.$message.error("第" + m.get(key) + "行数据跟第"+ (i + 1) +"数据重复");
                    return false;
                }
                m.set(key,i+1)
            }
            let totalPlanNum = 0;
            for (let i = 0; i < param.materialList.length; i++) {
                if (this.common.isBlank(param.materialList[i].planNums))
                {
                    this.$message.error("第" + (i + 1) + "行计划出库数量为空！");
                    return false;
                }
                if(this.common.isBlank(param.materialList[i].batchNum)){
                    this.$message.error("第" + (i + 1) + "行批次号为空！");
                    return false;
                }
                // if(this.common.isBlank(param.materialList[i].supplierBatchNum)){
                //     this.$message.error("第" + (i + 1) + "行供应商批次号为空！");
                //     return false;
                // }
                // if(this.common.isBlank(param.materialList[i].asn)){
                //     this.$message.error("第" + (i + 1) + "行ASN为空！");
                //     return false;
                // }
                if (this.common.isNotBlank(param.materialList[i].dId))
                {
                    // this.$message.error("请先选择第" + (i + 1) + "行的所有可选项确认库存！");
                    // return false;
                    if (this.common.isBlank(param.materialList[i].nums) || param.materialList[i].nums == 0)
                    {
                        this.$message.error("第" + (i + 1) + "行没有库存可以出库！");
                        return false;
                    }
                    if (param.materialList[i].nums < param.materialList[i].planNums)
                    {
                        this.$message.error("第" + (i + 1) + "行计划出库数量大于库存数量！");
                        return false;
                    }
                }
                totalPlanNum = this.common.accAdd(totalPlanNum, param.materialList[i].planNums);
            }
            let totalNums = 0;
            this.materialList.forEach(item => {
                if (this.common.isNotBlank(item.nums)) {
                    totalNums = this.common.accAdd(totalNums, item.nums);
                }
            })
            if (totalNums != totalPlanNum)
            {
                this.$message.error("要求发货总出库数量必须和总计划出库数量相等！");
                return false;
            }
            await this.common.postUrl("wmsOutOrderTF", "outOrderAllocat", param,null,null,'',true);
            this.$message.success('确定分拣成功!');
            this.close();
        },
        /**
         * 确认出库
         */
        async outOrderDeal() {
            // 数据验证逻辑保持不变
            for (let i = 0; i < this.dealMaterialData.length; i++) {
                if (this.common.isBlank(this.dealMaterialData[i].realNums)) {
                    this.$message.error("第" + (i + 1) + "行实际出库数量为空！");
                    return;
                }
                if (this.dealMaterialData[i].realNums <= 0) {
                    this.$message.error("第" + (i + 1) + "行实际出库数量小于等于0！");
                    return;
                }
                if (this.common.isBlank(this.dealMaterialData[i].boxNums)) {
                    this.$message.error("第" + (i + 1) + "行实际出库箱数为空！");
                    return;
                }
                if (this.common.isBlank(this.dealMaterialData[i].palletNums)) {
                    this.$message.error("第" + (i + 1) + "行实际出库拖数为空！");
                    return;
                }
                if (this.dealMaterialData[i].palletNums <= 0) {
                    this.$message.error("第" + (i + 1) + "行实际出库拖数小于等于0！");
                    return;
                }
                if (this.dealMaterialData[i].planNums < this.dealMaterialData[i].realNums) {
                    this.$message.error("第" + (i + 1) + "行实际出库数量大于计划出库数量！");
                    return;
                }
            }
            for (let i = 0; i < this.feeList.length; i++) {
                if (this.common.isBlank(this.feeList[i].num)) {
                    this.$message.error("第" + (i + 1) + "行费用项目明细数量为空！");
                    return;
                }
            }

            // 检查是否超时
            this.isTimeout = await this.common.postUrl("wmsTimeLimitTF", "isTimeout", {
                outOrderId: this.outOrderId,
                opType: 2,
                isOutDeal: true
            });

            // 重置超时原因选择
            this.timeoutReasonSelect = '';
            
            // 显示对话框
            this.showOutOrderDialog = true;
        },

        /**
         * 确认出库操作
         */
        async confirmOutOrder() {
            // 验证超时原因
            if (this.isTimeout && !this.timeoutReasonSelect) {
                this.$message.error('请选择超时原因');
                return;
            }

            // 准备参数
            let param = {};
            param.receiptsImgId = this.$refs.receiptsImg.getImageData().flowId;
            param.receiptsImgPath = this.$refs.receiptsImg.getImageData().storePath;
            param.outOrderId = this.outOrderId;
            param.materialList = this.dealMaterialData;
            param.packMaterialList = this.packMaterialList;
            param.feeList = this.feeList;
            param.costList = this.costList;
            param.disableIds = this.disableIds;
            param.ableIds = this.ableIds;
            param.timeoutReason = this.timeoutReasonSelect;

            // 调用出库接口
            let that = this;
            this.common.postUrl("wmsOutOrderTF", "outOrderDeal", param, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.$message.success('确认出库成功');
                    that.showOutOrderDialog = false;
                    that.close();
                }
            }, null, '', true);
        },
        /**
         * 费用计算
         */
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
            this.$forceUpdate();
        },
        /**
         *
         * @returns {Promise<*[]>}
         */
        async loadStorageListByReservoirId(item, index){
            let data = [];
            if (this.common.isNotBlank(item.reservoirId))
                data = await this.common.postUrl("wmsReservoirTF", "queryStorageListByReservoirId", {reservoirId: item.reservoirId});
            this.dealMaterialData[index].storageList = data;
            this.$forceUpdate();
        },
        /** 添加入库物料 */
        addDealMaterial(index) {
            let data = index >= 0 ? this.common.copyObj(this.dealMaterialData[index]) : {};
            data.original=false;
            this.dealMaterialData.push(data);
            this.calStockNums();
            this.$forceUpdate();
        },
        /** 删除入库物料 */
        removeDealMaterial(index) {
            if(this.dealMaterialData.length>=1){
                this.dealMaterialData.splice(index, 1);
            }
            this.calStockNums();
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
                    this.disableIds.push(this.feeListSrc[i].onlyId);
            }
            this.isShowDialog = false;
            await this.dealCostData();
            this.$forceUpdate();

            await this.calcFee();
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        }
    },
}