import myFileModel from '@/components/myFileModel/myFileModel.vue'
import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import dbTable from "@/components/dbTable/dbTable.vue";
import tagTable from './tagTable.vue'

export default {
    name: 'outOrderFeeConfirm',
    data() {
        return {
            info:{},
            totalInfo:{
                nums:0,
                boxNums:0,
                palletNums:0,

                nums2:0,
                stockPlanNums: 0,
                stockNums:0,
                stockBoxNums:0,
                stockPalletNums:0,

                num:0,
                totalFee:0,
                totalFeeWithTax:0,

                costNum:0,
                costTotalFee:0,
                costTotalFeeWithTax:0,
            },
            materialList:[],
            packMaterialList:[],
            outMaterialList:[],
            feeList:[],
            costList:[],
            tabs: [
                {name: "出库详情", active: true,type:1,},
                {name: "条码详情",type:2,},
            ],
            hasNewQrcode:false,
            showType: 1,
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
            feeListSrc:[],
            costListSrc:[],

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
        this.loadOrderInfo();
        this.common.tableStretch(this.$refs.orderDetail);
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        myFileModel,
        innerTab,
        tableCommon,
        tagTable
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
        /**
         * 加载订单数据
         */
        async loadOrderInfo()
        {
            let data = await this.common.postUrl("wmsOutOrderTF", "queryWmsOutOrderInfoForView",
                {outOrderId: this.$route.query.outOrderId},
                null, null, null, true);
            this.info = data.info;
            this.hasNewQrcode = data.hasNewQrcode;
            // 		public static final int WAIT_OUT = 1;待出库
            // 		public static final int ALLOCAT = 2;已分配
            // 		public static final int SORTING = 4;已分拣
            // 		public static final int OUT = 5;已出库
            if (this.info.receiptsImgId)
                this.$refs.receiptsImg.initDate(this.info.receiptsImgId);

            this.materialList = data.materialList;
            this.packMaterialList = data.packMaterialList;
            this.outMaterialList = data.outMaterialList;
            this.feeList = data.feeList;
            for (let i = 0; i < this.materialList.length; i++) {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums,this.materialList[i].nums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,this.materialList[i].boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,this.materialList[i].palletNums);
            }
            for (let i = 0; i < this.outMaterialList.length; i++) {
                this.totalInfo.nums2=this.common.accAdd(this.totalInfo.nums2,this.outMaterialList[i].storeNums);
                this.totalInfo.stockPlanNums = this.common.accAdd(this.totalInfo.stockPlanNums,this.outMaterialList[i].planNums);
                this.totalInfo.stockPlanBoxNums = this.common.accAdd(this.totalInfo.stockPlanBoxNums,this.outMaterialList[i].planBoxNums);
                this.totalInfo.stockPlanPalletNums = this.common.accAdd(this.totalInfo.stockPlanPalletNums,this.outMaterialList[i].planPalletNums);
                this.totalInfo.stockNums = this.common.accAdd(this.totalInfo.stockNums,this.outMaterialList[i].nums);
                this.totalInfo.stockBoxNums = this.common.accAdd(this.totalInfo.stockBoxNums,this.outMaterialList[i].boxNums);
                this.totalInfo.stockPalletNums = this.common.accAdd(this.totalInfo.stockPalletNums,this.outMaterialList[i].palletNums);
            }
            for (let i = 0; i < this.feeList.length; i++) {
                this.totalInfo.num = this.common.accAdd(this.totalInfo.num,this.feeList[i].num);
                this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,this.feeList[i].totalFee);
                this.totalInfo.totalFeeWithTax = this.common.accAdd(this.totalInfo.totalFeeWithTax,this.feeList[i].totalFeeWithTax);
            }

            this.costList = data.costList;
            this.totalInfo.costNum = 0;
            this.totalInfo.costTotalFee = 0;
            this.totalInfo.costTotalFeeWithTax = 0;
            for (let i = 0; i < this.costList.length; i++) {
                this.totalInfo.costNum = this.common.accAdd(this.totalInfo.costNum,this.costList[i].num);
                this.totalInfo.costTotalFee = this.common.accAdd(this.totalInfo.costTotalFee,this.costList[i].fee);
                this.totalInfo.costTotalFeeWithTax = this.common.accAdd(this.totalInfo.costTotalFeeWithTax,this.costList[i].feeWithTax);
            }

            let feeList = await this.common.postUrl("wmsOutOrderTF", "getOutSaleFeeList", {srcTenantId: this.info.srcTenantId,outOrderId: this.$route.query.outOrderId});
            this.feeListSrc = this.common.copyObj(feeList);
            let costList = await this.common.postUrl("wmsOutOrderTF", "getOutCostList", {outOrderId: this.$route.query.outOrderId});
            this.costListSrc = this.common.copyObj(costList);

            this.initCostData();

            
            // 查询条码详情
            this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "queryStockQrcodeList", {outOrderId: this.$route.query.outOrderId,isLoadAllOut:1});
            if(this.materialCodeList.length<1){
                this.hasNewQrcode = false
            }else{
                this.hasNewQrcode = true
            }
            this.custQrcodeList = await this.common.postUrl("wmsInOrderTF", "queryCustQrcodeList", {outOrderId: this.$route.query.outOrderId});
            this.hasNewQrcode = this.custQrcodeList.length>0||this.hasNewQrcode;
            this.$forceUpdate();
        },
        open(){
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.dbTable.setRightData(this.common.copyObj(this.feeList));
                this.$refs.dbTable.setLeftData(this.common.copyObj(this.feeListSrc));
            })
        },
        async saveChangeFeeItem()
        {
            let selectItem = this.$refs.dbTable.getRightData();
            this.feeList = this.common.copyObj(selectItem);
            this.isShowDialog = false;
            await this.dealCostData();
            this.$forceUpdate();
            await this.calcFee();
            this.$forceUpdate();
        },
        initCostData(){
            //遍历收入数据，相同的费用项目的成本保持一致，成本又针对客户的优先，没有则用默认的
            for (let i = 0; i < this.costList.length; i++)
            {
                let item = this.costList[i];//收入项目
                if(item.isWorkOrder==0){
                    item.tenantId = null;
                    item.price = null;
                    item.tax = null;
                    item.priceWithTax = null;
                    item.num = null;
                    item.totalFee = null;
                    item.totalFeeWithTax = null;
                    item.disabled = true;
                }
                for (let j = 0; j < this.costListSrc.length; j++)
                {
                    let costItem = this.costListSrc[j];
                    if (item.itemId == costItem.itemId)//项目一样
                    {
                        let supplierData = item.supplierData;
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
                        item.supplierData=supplierData;
                    }
                }

            }
            this.calcCostTotal();
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
        feeConfirm(){
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
            param.outOrderId = this.$route.query.outOrderId;
            param.materialList = this.materialList;
            param.packMaterialList = this.packMaterialList;
            param.feeList = this.feeList;
            param.costList = this.costList;
            let msg = '确定修改费用？';
            let that = this;
            this.$confirm(msg, "费用确认提示" ,{
                confirmButtonText: '确定',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsOutOrderTF", "feeConfirm", param, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('费用确认成功');
                        that.close();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         * 关闭当前页面
         */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        }
    },
}
