import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import multiFileUpload from '@/mixins/multiFileUpload.js';

export default {
    name: 'saveAssetInfo',
    mixins: [multiFileUpload],
    data() {
        return {
            info: {
                //基础信息
                baseId:'',
                assetName:'',
                model:'',
                assetPurchaseType:'1',
                assetType:'',
                assetClass:'',
                assetSubClass:'',
                isCentralPurchase:'0',
                locationId:'',
                supplierTenantId:'',
                contractId:'',
                custTenantId:'',
                devContractId:'',
                settleOrgId:'',
                settleBody:'',
                storageLocation:'',
                purchaseOrderId:'',
                stockNum:'',
                remark:'',
                //费用信息
                payType:'',
                billingCycle:'',
                billingNum:'',
                billingPeriods:'',
                paydBillingPeriods:'0',
                tax:'',
                price:'',
                priceWithTax:'',
                deposit:'',
                totalFee:'',
                totalFeeWithTax:'',
                liquidatedDamages:'',
                //折旧信息
                inStockDate:'',
                depreciationStartDate:'',
                depreciationEndDate:'',
                totalCost:'',
                depreciationMonths:'',
                monthDepreciation:'',
                depreciatedMonths:'',
                depreciatedCost:'',
                residualCost:'',

                files:[{}],
                feeDetails:[],
            },
            feeData:[],
            assetPurchaseTypeData:[],
            assetTypeData:[],
            allAssetClassData:[],
            assetClassData:[],
            allAssetSubClassData:[],
            assetSubClassData:[],
            whetherData:[],
            locationData:[],
            supplierTenantData:[],
            allContractData:[],
            contractData:[],
            customerData:[],
            deviceContractData:[],
            orgData:[],
            settleBodyData:[],
            allPayTypeData:[],
            payTypeData:[],
            billingCycleData:[],
            purchaseOrderData:[],

            disabled:false,
            numsDisabled:false,
            showDepreciation:false,

            type:this.$route.query.type,// 1 新增  2修改  3查看 4审核 5复制

            showDiscontinueAssetInfoDlg:false,
        }
    },
    computed:{
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        async init() {
            this.feeData = await this.common.postUrl("purFeeBaseService", "queryAllPurFeeList", {isPurchase:1});
            this.assetPurchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_PURCHASE_TYPE"});
            this.assetTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_TYPE"});
            this.allAssetClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_CLASS"});
            this.allAssetSubClassData = await this.common.postUrl("assetTF", "getAssetSubClassData", {});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.locationData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.supplierTenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.allContractData = await this.common.postUrl("contractService", "queryContractList", {isloadSupplier: 1});
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
            this.deviceContractData = await this.common.postUrl("deviceContractService", "queryDeviceContractList", {});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            this.allPayTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_PAY_TYPE"});
            this.billingCycleData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_BILLING_CYCLE"});
            this.purchaseOrderData = await this.common.postUrl("purPurchaseService", "queryPurPurchaseList", {isAll:1});

            this.changeAssetPurchaseType(true);

            if(this.type==3||this.type==4||this.type==6){
                this.disabled=true;
            }
            if(this.$route.query.id){
                await this.getInfo(this.$route.query.id);
                this.purchaseOrderData.push({id:this.info.purchaseOrderId, purchaseNum:this.info.purchaseNum});
                if(this.type==5){
                    this.info.id='';
                    this.info.src='';
                    this.info.files.forEach(el=>el.id='');
                    this.info.feeDetails.forEach(el=>el.id='');
                }else if(this.type==6){
                    if(this.info.files.length  ==0){
                        this.info.files.push({});
                    }
                }
            }
        },
        changeFeeBase(){
            let that = this;
            if(this.common.isBlank(that.info.baseId)){
                that.info.assetName = '';
                that.info.model = '';
                that.info.assetType = '';
                that.info.assetClass = '';
                that.info.assetSubClass = '';
            }else {
                this.feeData.forEach(el=>{
                    if(that.info.baseId==el.baseId){
                        that.info.assetName = el.projectName;
                        that.info.model = el.specification;
                        that.info.assetType = el.assetType + '';
                        if(el.feeType==26){
                            that.info.assetType = '2';
                            that.info.assetClass = '4';
                            that.info.assetSubClass = el.deviceType +'';
                        }
                        that.changeAssetType(true);
                    }
                });
            }
            this.forceUpdate();
        },
        changeAssetPurchaseType(init){
            let that = this;
            if(!init){
                this.info.payType = '';
                this.info.billingStartDate = '';
                this.info.billingEndDate = '';
            }
            if(this.info.assetPurchaseType){
                this.payTypeData = this.allPayTypeData.filter(el=>el.codeId==that.info.assetPurchaseType);
            }else{
                this.payTypeData = [];
            }
            if(this.info.assetPurchaseType=='1'){
                this.info.billingCycle = '';
            }
            this.getAssetDepreciation(init);
            this.forceUpdate();
        },
        changeAssetType(init){
            let that = this;
            if(this.info.assetType=='1'||this.info.assetType==1){
                this.numsDisabled = true;
                this.info.stockNum = 1;
                this.info.billingNum = 1;
            }else{
                this.numsDisabled = false;
            }
            if(!init){
                this.info.assetClass = '';
                if(this.info.assetType!='1'&&this.info.assetType!=1){
                    this.info.stockNum = '';
                    this.info.billingNum = '';
                }
            }
            if(this.info.assetType){
                this.assetClassData = this.allAssetClassData.filter(el=>el.codeId==that.info.assetType);
            }else{
                this.assetClassData = [];
            }
            this.changeAssetClass(init);
            this.forceUpdate();
        },
        changeAssetClass(init){
            let that = this;
            if(!init){
                this.info.assetSubClass = '';
            }
            if(this.info.assetClass){
                this.assetSubClassData = [];
                this.allAssetSubClassData.forEach(el=>{
                        let array = el.codeValue.split('#');
                        if(array[0]==that.info.assetClass){
                            let item = that.common.copyObj(el);
                            item.codeValue = array[1];
                            that.assetSubClassData.push(item);
                        }
                    }
                );
            }else{
                this.assetSubClassData = [];
            }
            if(this.info.assetClass!='4'){
                this.info.custTenantId = '';
                this.info.devContractId = '';
            }
            this.getAssetDepreciation(init);
            this.forceUpdate();
        },
        changeDevContract(){
            let that = this;
            if(this.info.devContractId){
                let devContract = this.deviceContractData.filter(el=>el.id==that.info.devContractId);
                this.info.custTenantId = devContract[0].tenantId;
            }else{
                this.info.custTenantId = '';
            }
            this.forceUpdate();
        },
        changeSupplier(init){
            let that = this;
            if(!init){
                this.info.contractId = '';
            }
            if(this.info.supplierTenantId){
                this.contractData = this.allContractData.filter(el=>el.tenantId==that.info.supplierTenantId);
            }else{
                this.contractData = [];
            }
            this.forceUpdate();
        },
        changePayType(){
            if(this.info.payType=='1'){
                this.info.billingEndDate = '';
            }
            this.calFeeList();
            this.forceUpdate();
        },
        async calFeeList() {
            if(!this.info.payType){
                this.info.feeDetails = [];
                return;
            }
            if(this.common.isBlank(this.info.billingStartDate)&&this.common.isBlank(this.info.billingEndDate)){
                this.info.feeDetails = [];
                return;
            }
            if(!this.info.billingNum){
                this.info.feeDetails = [];
                return;
            }
            if(!this.info.tax){
                this.info.feeDetails = [];
                return;
            }
            if(!this.info.priceWithTax){
                this.info.feeDetails = [];
                return;
            }
            this.info.feeDetails = await this.common.postUrl("assetTF", "autoGenerateAssetFeeDetails", this.info);
            //循环计算总数
            this.info.billingPeriods = this.info.feeDetails.length;
            if(this.info.paydBillingPeriods>this.info.billingPeriods){
                this.info.paydBillingPeriods = this.info.billingPeriods;
                return;
            }
            let that = this;
            this.info.totalFee = 0;
            this.info.totalFeeWithTax = 0;
            let workInfo = this.locationData.find(el=>el.workId===that.info.locationId);
            this.info.feeDetails.forEach(el=>{
                if(!el.locationWorkName){
                    el.locationWorkName = workInfo.workName;
                }
                that.info.totalFee = that.common.accAdd(that.info.totalFee,el.amount);
                that.info.totalFeeWithTax = that.common.accAdd(that.info.totalFeeWithTax,el.amountWithTax);
            })
            this.getAssetDepreciation(false);

            this.$forceUpdate();
        },
        async getAssetDepreciation(init){
            if(this.info.assetPurchaseType=='1'){
                if(this.info.assetClass=='1'||this.info.assetClass=='2'||this.info.assetClass=='3'||this.info.assetClass=='4'||this.info.assetClass=='9'){
                    this.showDepreciation=true;
                    if(!init){
                        let depreciation = await this.common.postUrl("assetTF", "getAssetDepreciation", this.info);
                        this.info = this.common.mergeObj(this.info, depreciation);
                    }
                }
            }else{
                this.showDepreciation=false;
                this.info.depreciationStartDate='';
                this.info.depreciationEndDate='';
                this.info.depreciationMonths='';
                this.info.residualRatio='';
                this.info.monthDepreciation='';
                this.info.depreciatedMonths='';
                this.info.depreciatedCost='';
                this.info.residualCost='';
                this.info.totalCost='';
            }
            this.forceUpdate();
        },

        async getInfo(id) {
            this.info = await this.common.postUrl("assetTF", "getAssetInfo", {id});
            this.info.assetPurchaseType = this.info.assetPurchaseType+'';
            this.changeAssetPurchaseType(true);
            this.info.assetType = this.info.assetType+'';
            this.changeAssetType(true);
            this.info.assetClass = this.info.assetClass+'';
            this.changeAssetClass(true);
            if(this.common.isNotBlank(this.info.assetSubClass)){
                this.info.assetSubClass = this.info.assetSubClass+'';
            }
            this.info.isCentralPurchase = this.info.isCentralPurchase+'';
            this.changeSupplier(true);
            this.info.settleBody = this.info.settleBody+'';
            this.info.payType = this.info.payType+'';
            if(this.common.isNotBlank(this.info.billingCycle)){
                this.info.billingCycle = this.info.billingCycle+'';
            }
            if(this.info.files.length  ==0 && !this.disabled){
                this.info.files.push({});
            }
            this.imgDisplay();
            this.forceUpdate();
        },

        forceUpdate() {
            this.$forceUpdate();
        },
        saveAssetInfo(){
            let that  = this;
            if(this.type==1){
                this.info.id = '';
                this.info.feeDetails.forEach(item => {item.id=''});
            }
            that.common.postUrl("assetTF", "saveAssetInfo", this.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.close();
                    that.$message.success("保存成功！");
                }
            },null,'',true);
        },

        verify(){
            let param = {
                id:this.info.id
            };
            let that = this;
            this.$prompt("你将审核资产编号："+this.info.assetNum+"，审核后数据将只允许修改部分数据，是否继续？", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核意见',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.verifyState = 1;
                        await this.common.postUrl("assetTF", "verifyAssetInfo", param);
                        this.$message.success("操作成功！")
                        that.close();
                    }
                    else if (action === 'cancel')
                    {
                        param.verifyState = 2;
                        await this.common.postUrl("assetTF", "verifyAssetInfo", param);
                        this.$message.success("操作成功！")
                        that.close();
                    }
                    done();
                }
            });
        },

        /**
         * 覆盖 mixin 配置，适配本页面的文件数据结构
         */
        _multiFileConfig() {
            return {
                getFileList: () => this.info.files,
                idField: 'fileId',
                pathField: 'filePath',
                maxCount: 5,
                refPrefix: 'file',
            };
        },
        /**
         * 关闭新增客户
         */
        close(){
            if(this.type==3){
                this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            }else{
                this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            }
        },
        closeDiscontinueAssetInfoDlg(){
            this.info.newBillingEndDate = '';
            this.showDiscontinueAssetInfoDlg = false;
        },
        discontinueAssetInfo(){
            let that = this;
            that.common.postUrl("assetTF", "discontinueAssetInfo", this.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.closeDiscontinueAssetInfoDlg();
                    that.getInfo(that.info.id);
                    that.$message.success("中止成功！");
                }
            },null,'',true);
        }
    },
}
