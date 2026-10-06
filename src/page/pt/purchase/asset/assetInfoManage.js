import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
    name: 'assetInfoManage',
    data() {
        return {
            head: [
                {"name": "设备资源编码", "code": "assetNum", "width": "180", "type": "text"},
                {"name": "采购单号", "code": "purchaseNum", "width": "180", "type": "text"},
                {"name": "资产名称", "code": "assetName", "width": "150", "type": "text"},
                {"name": "资产采购类别", "code": "assetPurchaseTypeName", "width": "150", "type": "text"},
                {"name": "资产类型", "code": "assetTypeName", "width": "150", "type": "text"},
                {"name": "资产类别", "code": "assetClassName", "width": "150", "type": "text"},
                {"name": "资产子类别", "code": "assetSubClassName", "width": "150", "type": "text"},
                {"name": "是否集采", "code": "isCentralPurchaseName", "width": "120", "type": "text"},
                {"name": "所在地", "code": "locationWorkName", "width": "150", "type": "text"},
                {"name": "存放地点", "code": "storageLocation", "width": "150", "type": "text"},
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "diy"},
                {"name": "供应商名称", "code": "supplierTenantName", "width": "150", "type": "text"},
                {"name": "设备序列号", "code": "equipmentNum", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "model", "width": "150", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "150", "type": "text"},
                {"name": "部门", "code": "settleOrgName", "width": "150", "type": "text"},
                {"name": "库存数量", "code": "stockNum", "width": "150", "type": "text"},
                {"name": "开始借用时间","code":"borrowStartDate", "width": "120", "type":"text"},
                {"name": "结束借用时间","code":"borrowEndDate", "width": "120", "type":"text"},
                {"name": "付款类型", "code": "payTypeName", "width": "150", "type": "text"},
                {"name": "计费周期", "code": "billingCycleName", "width": "150", "type": "text"},
                {"name": "计费起始日", "code": "billingStartDate", "width": "150", "type": "text"},
                {"name": "计费结束日", "code": "billingEndDate", "width": "150", "type": "text"},
                {"name": "计费数量", "code": "billingNum", "width": "150", "type": "text"},
                {"name": "计费单位", "code": "unit", "width": "150", "type": "text"},
                {"name": "含税单价", "code": "priceWithTax", "width": "150", "type": "text"},
                {"name": "税率(%)", "code": "tax", "width": "150", "type": "text"},
                {"name": "总期数", "code": "billingPeriods", "width": "150", "type": "text"},
                {"name": "已付期数", "code": "paydBillingPeriods", "width": "150", "type": "text"},
                {"name": "含税应付总金额", "code": "amountWithTax", "width": "150", "type": "text"},
                {"name": "已付金额", "code": "payFee", "width": "150", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "150", "type": "text"},
                {"name": "折旧期数(月)", "code": "depreciationMonths", "width": "150", "type": "text"},
                {"name": "每期折旧金额", "code": "monthDepreciation", "width": "150", "type": "text"},
                {"name": "已折期数(月)", "code": "depreciatedMonths", "width": "150", "type": "text"},
                {"name": "残值", "code": "remainDepreciationCost", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "160", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "160", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核日期", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核意见", "code": "verifyRemark", "width": "200", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
            ],
            loadParam: {
                assetType:'',
                assetClass:'',
                qryAssetSubClass:'',
                equipmentNum:'',
                assetPurchaseType:'',
                assetName:'',
                locationId:'',
                supplierTenantId:'',
                settleBody:'',
                settleOrgId:'',
                verifyState:'',
                billingMonth:[],
                purchaseNum:'',
                payType:'',
                isCentralPurchase:'',
            },
            assetTypeData:[],
            assetClassData:[],
            assetSubClassData:[],
            assetPurchaseTypeData:[],
            locationData:[],
            supplierTenantData:[],
            settleBodyData:[],
            verifyStateData:[],
            payTypeData:[],
            whetherData:[],
            uploadOpen:false,

            allocateInfo:{},
            allocateDialogShow: false,
            feeApplyData:[],
            customerData: [],

            consumingDialogShow:false,
            consumingInfo:{},
            orgData:[],
            staffData:[],
            allStaffData:[],

            returnInfo:{borrowEndDate:''},
            showReturnAssetInfoDlg:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        myImport,
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData() {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'ASSET_TYPE,ASSET_CLASS,EQUIPMENT_PURCHASE_TYPE,PAY_TITLE,VERIFY_STATE,ASSET_PAY_TYPE,WHETHER'});
            this.assetTypeData = data.ASSET_TYPE;
            this.assetClassData = data.ASSET_CLASS;
            this.assetPurchaseTypeData = data.EQUIPMENT_PURCHASE_TYPE;
            this.settleBodyData = data.PAY_TITLE;
            this.verifyStateData = data.VERIFY_STATE;
            this.payTypeData = data.ASSET_PAY_TYPE;
            this.whetherData = data.WHETHER;

            this.assetSubClassData = await this.common.postUrl("assetTF", "getAssetSubClassData", {});
            this.locationData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.supplierTenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});

            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.allStaffData = await this.common.postUrl("regionOrgTF", "getStaffInfoList", {tenantId:1});
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.billingMonth) && this.loadParam.billingMonth.length == 2) {
                this.loadParam.billingStartMonth = this.loadParam.billingMonth[0];
                this.loadParam.billingEndMonth = this.loadParam.billingMonth[1];
            } else {
                this.loadParam.billingStartMonth = '';
                this.loadParam.billingEndMonth = '';
            }
            let assetSubClass = this.loadParam.qryAssetSubClass;
            if(this.common.isNotBlank(assetSubClass)) {
                let assetSubClassArray = assetSubClass.split('#');
                this.loadParam.assetClass = assetSubClassArray[0];
                this.loadParam.assetSubClass = assetSubClassArray[1];
            }else{
                // this.loadParam.assetClass = '';
                this.loadParam.assetSubClass = '';
            }
            let {items} = await this.$refs.table.load("assetTF", "queryAssetInfoPage", this.loadParam);
        },
        addAssetInfo() {
            this.open({
                query:{type: 1},
                urlId: 'saveAssetInfo' + new Date().getTime(),
                urlName: '新增资产信息',
                urlPathName: '/saveAssetInfo',
                urlPath: "/pt/purchase/asset/saveAssetInfo.vue",
            });
        },
        copyAddAssetInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据复制！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: 5},
                urlId: 'saveAssetInfo' + selectData[0].id + 5,
                urlName: '复制新增资产信息',
                urlPathName: '/saveAssetInfo',
                urlPath: "/pt/purchase/asset/saveAssetInfo.vue",
            });
        },
        updateAssetInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            let type = 2;//修改
            if(selectData[0].firstVerifyDate){
                this.$message.info("已审核数据只能修改部分数据！");
                type = 6;//部分修改
            }
            this.open({
                query:{id:selectData[0].id, type: type},
                urlId: 'saveAssetInfo' + selectData[0].id + 2,
                urlName: '修改资产信息',
                urlPathName: '/saveAssetInfo',
                urlPath: "/pt/purchase/asset/saveAssetInfo.vue",
            });
        },
        dblclickAssetInfo(item){
            this.open({
                query:{id:item.id,type:3},
                urlId: 'detailAssetInfo' + item.id + 3,
                urlName: '资产信息详情',
                urlPathName: '/detailAssetInfo',
                urlPath: "/pt/purchase/asset/assetInfoDetailMain.vue",
            });
        },
        verifyAssetInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据审核！");
                return;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("已审核数据不能审核！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: 4},
                urlId: 'verifyAssetInfo' + selectData[0].id + 4,
                urlName: '审核资产信息',
                urlPathName: '/verifyAssetInfo',
                urlPath: "/pt/purchase/asset/saveAssetInfo.vue",
            });
        },
        toContract(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }else if(item.contractType==6){
                baseTitle = "供应商-其他";
            }
            let title = "查看"+baseTitle+"合同";
            this.open({
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
        toPurOrder(item){
            this.open({
                query:{id:item.purchaseOrderId,type:0},
                urlId: 'detailPurOrder' + item.purchaseOrderId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        deleteAssetInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("已审核数据不能删除！");
                return;
            }
            this.$confirm("你将删除设备资源编号："+selectData[0].assetNum+"的资产，是否继续？", "提示").then(async () =>{
                await this.common.postUrl("assetTF", "deleteAssetInfo", selectData[0],
                        null, null, '', true);
                this.$message.success("删除资产信息成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        handleSuccess()
        {
            this.doQuery();
            this.uploadOpen = false;
        },
        importExcel()
        {
            this.uploadOpen = true;
        },
        changeOrg(){
            this.staffData=[];
            this.consumingInfo.userId = null;
            if(this.consumingInfo.orgId){
                for (let i = 0; i < this.allStaffData.length; i++) {
                    if(this.consumingInfo.orgId == this.allStaffData[i].orgId){
                        this.staffData.push(this.allStaffData[i]);
                    }
                }
            }
            this.$forceUpdate();
        },
        async allocate(flag)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要调拨的资产！");
                return false;
            }
            if(selectData[0].verifyState!=1){
                this.$message.error("未审核资产不能调拨！");
                return;
            }
            if(selectData[0].assetPurchaseType=='3'&&this.common.isNotBlank(selectData[0].borrowEndDate)){
                this.$message.error("已归还资产不能调拨！");
                return;
            }
            this.allocateInfo = this.common.copyObj(selectData[0]);
            this.allocateInfo.assetId = selectData[0].id;
            this.allocateInfo.id = '';
            if (this.common.isNotBlank(this.allocateInfo.settleBody))
            {
                this.allocateInfo.settleBody = this.allocateInfo.settleBody + "";
            }
            this.allocateInfo.allocateNum = selectData[0].nums;
            this.$forceUpdate();
            this.feeApplyData = await this.common.postUrl("purFeeApplyTF", "loadPurFeeApplyData", {});
            this.openAllocateDialogShow(flag);
        },
        openAllocateDialogShow(flag)
        {
            this.allocateDialogShow = flag;
            this.$forceUpdate();
        },
        changeApply()
        {
            if (this.common.isNotBlank(this.allocateInfo.applyDtlId))
            {
                this.feeApplyData.forEach(item => {
                    if (item.applyDtlId == this.allocateInfo.applyDtlId)
                    {
                        this.allocateInfo.allocateNum = this.common.accSub(item.demandNums, item.purchaseNums);
                        this.$forceUpdate();
                    }
                })
            }
        },
        changeAllocateWorkId()
        {
            if (this.allocateInfo.locationId > 0 &&
                this.allocateInfo.locationId == this.allocateInfo.allocateWorkId)
            {
                //Jimmy提交bug反馈的
                this.$message.error("调出库存地和调入的库存地不能是同一个地方！");
                this.allocateInfo.allocateWorkId = null;
                return false;
            }
            this.$forceUpdate();
        },
        async savePurAllocate()
        {
            let param = this.allocateInfo;
            if (this.common.isBlank(param.allocateNum))
            {
                this.$message.error("调拨数量为空！");
                return false;
            }
            if (this.common.isBlank(param.allocateWorkId))
            {
                this.$message.error("库存地为空！");
                return false;
            }
            if (this.common.isBlank(param.chargeDate))
            {
                this.$message.error("开始计费日期为空！");
                return false;
            }
            if (this.common.isBlank(param.settleBody))
            {
                this.$message.error("结算主体为空！");
                return false;
            }
            if (this.common.isBlank(param.orgId))
            {
                this.$message.error("调入部门为空！");
                return false;
            }
            await this.common.postUrl('purStockService', 'savePurAllocate', param, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            await this.openAllocateDialogShow(false);
        },

        async consuming(flag)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要领用的资产！");
                return false;
            }
            if(selectData[0].verifyState!=1){
                this.$message.error("未审核资产不能领用！");
                return;
            }
            if(selectData[0].assetPurchaseType=='3'&&this.common.isNotBlank(selectData[0].borrowEndDate)){
                this.$message.error("已归还资产不能领用！");
                return;
            }
            this.consumingInfo = this.common.copyObj(selectData[0]);
            this.consumingInfo.assetId = selectData[0].id;
            this.$forceUpdate();
            this.openConsumingDialogShow(flag);
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        openConsumingDialogShow(flag)
        {
            this.consumingDialogShow = flag;
            this.$forceUpdate();
        },
        async saveConsuming()
        {
            if (this.common.isBlank(this.consumingInfo.num))
            {
                this.$message.error("领用数量为空！");
                return false;
            }
            if (this.common.isBlank(this.consumingInfo.orgId))
            {
                this.$message.error("领用部门为空！");
                return false;
            }
            if (this.common.isBlank(this.consumingInfo.userId))
            {
                this.$message.error("领用人员为空！");
                return false;
            }
            await this.common.postUrl('purStockService', 'saveConsuming', this.consumingInfo, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            this.openConsumingDialogShow(false);
        },
        returnAssetInfoShow(flag){
            if(flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length === 0) {
                    this.$message.error("请至少选择一条需要归还的资产！");
                    return false;
                }

                let ids = [];
                let assetNames = [];
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].verifyState != 1) {
                        this.$message.error("未审核资产不能归还！");
                        return;
                    }
                    if (selectData[i].assetPurchaseType == '3' && this.common.isNotBlank(selectData[i].borrowEndDate)) {
                        this.$message.error("已归还资产不能归还！");
                        return;
                    }
                    ids.push(selectData[i].id);
                    assetNames.push(selectData[i].assetName);
                }
                this.returnInfo = {
                    ids: ids,
                    assetNames: assetNames,
                }
            }else{
                this.returnInfo = {};
            }
            this.showReturnAssetInfoDlg = flag;
            this.$forceUpdate();
        },
        async returnAssetInfo() {
            if (this.common.isBlank(this.returnInfo.borrowEndDate)) {
                this.$message.error("归还时间为空！");
                return false;
            }
            await this.common.postUrl('assetTF', 'returnBorrowAsset', this.returnInfo, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            this.returnAssetInfoShow(false);
        },

        downloadExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"资产类型","model":"assetType","type":"select","options":this.assetTypeData,"label":"codeName","value":"codeValue","placeholder":"资产类型","method":"doQuery","isshow":true},
                {"name":"资产类别","model":"assetClass","type":"select","options":this.assetClassData,"label":"codeName","value":"codeValue","placeholder":"资产类别","method":"doQuery","isshow":true},
                {"name":"资产子类别","model":"qryAssetSubClass","type":"select","options":this.assetSubClassData,"label":"codeName","value":"codeValue","placeholder":"资产子类别","method":"doQuery","isshow":true},
                {"name":"设备序列号","model":"equipmentNum","type":"input","placeholder":"设备序列号","isshow":true},
                {"name":"资产采购类型","model":"assetPurchaseType","type":"select","options":this.assetPurchaseTypeData,"label":"codeName","value":"codeValue","placeholder":"资产采购类型","method":"doQuery","isshow":true},
                {"name":"资产名称","model":"assetName","type":"input","placeholder":"资产名称","isshow":true},
                {"name":"所在地","model":"locationId","type":"select","options":this.locationData,"label":"workName","value":"workId","placeholder":"所在地","method":"doQuery","isshow":true},
                {"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierTenantData,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"部门","model":"settleOrgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"组织","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"计费月份","model":"billingMonth","type":"monthrange","isshow":true},
                {"name":"采购单号","model":"purchaseNum","type":"input","placeholder":"采购单号","isshow":true},
                {"name":"付款类型","model":"payType","type":"select","options":this.payTypeData,"label":"codeName","value":"codeValue","placeholder":"付款类型","method":"doQuery","isshow":true},
                {"name":"是否集采","model":"isCentralPurchase","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否集采","method":"doQuery","isshow":true},
            ]
        }
    },
}
