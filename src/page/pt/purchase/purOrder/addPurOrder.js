import dbTable from "@/components/dbTable/dbTable.vue"
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer.vue";
import enumData from "@/page/pt/enum";
import multiFileUpload from '@/mixins/multiFileUpload.js';

export default {
	name: 'addPurOrder',
	mixins: [multiFileUpload],
	data()
	{
		return {
            head: [
                {"name": "费用申请单号", "code": "applyNum", "width": "150", "type": "text"},
                {"name": "费用类型", "code": "feeSubTypeName", "width": "250", "type": "text"},
                // {"name": "采购类型", "code": "purchaseTypeName", "width": "150", "type": "text"},
                {"name": "是否资产管理", "code": "isAssetName", "width": "120", "type": "text"},
                {"name": "申请部门", "code": "applyUserOrgName", "width": "150", "type": "text"},
                {"name": "申请人", "code": "applyUserName", "width": "120", "type": "text"},
                {"name": "品名/项目", "code": "projectName", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "150", "type": "text"},
                {"name": "数量单位", "code": "unit", "width": "120", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "在途数量", "code": "inTheRoadNums", "width": "120", "type": "text"},
                {"name": "现有库存数量", "code": "stockNums", "width": "120", "type": "text"},
                {"name": "上月使用数量", "code": "lastMonthUseNums", "width": "120", "type": "text"},
                {"name": "需求数量", "code": "demandNums", "width": "120", "type": "text"},
                {"name": "已采购数量", "code": "srcPurchaseNums", "width": "120", "type": "text"},
                {"name": "核销数量", "code": "writeOffNums", "width": "120", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "120", "type": "text"},
                {"name": "参考税率", "code": "referTax", "width": "120", "type": "text"},
                {"name": "参考含税单价", "code": "referPrice", "width": "120", "type": "text"},
                {"name": "参考含税金额", "code": "referTotalFee", "width": "120", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "紧急程度", "code": "urgentLevelName", "width": "120", "type": "text"},
                {"name": "期望完成时间", "code": "expectDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            step: 1,
            feeTypeData:[],
            payTypeData:[],
            feeSubTypeData:[],
            settleBodyData:[],
            userData:[],
            transportModeData:[],
            bankCardData:[],
            supplierData:[],
            customerData: [],
            deliveryWorkData:[],
            orgUserData:[],
            info:this.initInfo(this.$route.query.id),
            dtlList:[],
            fileList:[{}],
            purchaseTypeData: [],
            type: this.$route.query.type,
            isOnlySee: false,
            disabledEdit: false,
            disabledDel: false,
            srcList: [],
            id:this.$route.query.id,
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],
            isFilter: true,//是否过滤
            totalInfo:{
                demandNums:'',
                purchaseNum:'',
                totalFee:'',
            },
            userList:[],

            allContractDeviceData:[],

        }
	},
	components: {
        fileViewer,
		dbTable,
        searchList,
        myFileModel,
	},
	mounted() {
        this.initData();
        if (this.$route.query.type == 0 || this.$route.query.type == 3) {
            this.isOnlySee = true;
        }
        if (this.$route.query.id) {
            this.loadPurPurchaseById(this.$route.query.id);
            this.disabledEdit = this.type == 0 || this.type == 3;
            this.disabledDel = this.type == 0 || this.type == 3;
            this.step = 2;
        } else {
            this.doQuery();
        }
    },
	methods: {
        initQuery() {
            return this.query = {
                applyUserOrgName:'',
                applyNum:'',
                feeTypeData:[],
                feeType:'',
                feeSubType:'',
                purchaseType:'',
                projectName:'',
                tenantName:'',
                createDate:'',
                purchaseId: this.$route.query.id,
                flag: this.$route.query.flag,
            };
        },
        initInfo(id)
        {
            return this.info = {
                id: id,
                tenantId: null,
                tenantName: null,
                tenantAddress: null,
                tenantLinkman: null,
                tenantLinkPhone: null,
                tenantEmail: null,
                bankAccountName: null,
                bankDeposit: null,
                bankCard: null,

                settleBody: null,
                companyAddress: null,
                purchaseUserId: null,
                purchaseLinkman: null,
                purchaseBillId: null,
                purchaseEmail: null,
                isPrepay: 0,

                purchaseNum: null,
                purchaseType: null,
                purchaseTypeName: null,
                purchaseDate: null,

                transportMode: null,
                custTenantId: null,
                deliveryWorkId: null,
                deliveryWorkType: null,
                deliverInfo: null,
                receiptInfo: null,
                deliverDate: null,
                remark: null,
            };
        },
        async loadPurPurchaseById()
        {
            let data = await this.common.postUrl('purPurchaseService','loadPurPurchaseById',{id:this.$route.query.id});
            this.info = data.info;
            this.query.purchaseType = data.info.purchaseType + '';
            await this.initBankCard(data.info.tenantId);
            this.info.settleBody = String(data.info.settleBody);
            this.info.payType = String(data.info.payType);
            this.info.transportMode = String(data.info.transportMode);
            this.dtlList = data.dtlList;
            let that = this;
            this.dtlList.forEach(item => {
                item.payType = item.payType+'';
                if(item.feeType==26){
                    let contractDeviceData = that.allContractDeviceData.filter(el => el.custTenantId === that.info.custTenantId&&el.devDeviceId === item.projectId&&el.orgId === item.applyUserOrg);
                    item.contractDeviceData = contractDeviceData;
                }
            })
            this.userList = data.userList;
            if (data.fileList.length === 0)
            {
                data.fileList.push({});
            }
            this.fileList = data.fileList;
            this.imgDisplay();
            this.calTotalInfo();
            this.$forceUpdate();


            this.$nextTick(()=> {
                this.doQuery();
            })
        },
        async doQuery(query = this.query) {
            this.query = query;
            if (this.common.isNotBlank(this.query.createDate) && this.query.createDate.length == 2) {
                this.query.beginCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            } else {
                this.query.beginCreateDate = '';
                this.query.endCreateDate = '';
            }
            let feeTypeData = this.query.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.query.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.query.feeSubType = feeTypeData[1];
                }else{
                    this.query.feeSubType = '';
                }
            }else{
                this.query.feeType = '';
                this.query.feeSubType = '';
            }
            await this.$refs.table.load("purFeeApplyTF", "loadPurFeeApplyDtlData", this.query);
            this.common.tableStretch(document.getElementById('strechTable'));
            this.common.tableStretch(document.getElementById('strechFixTable'));
        },
        async initData()
        {
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.payTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PAY_TYPE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PURCHASE_TYPE"});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
            this.transportModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TRANSPORT_MODE"});
            this.userData = await this.common.postUrl("userTF", "loadAllUser");
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {entityId:1014015});
            if(this.orgUserData.length==1){
                this.info.currentApplyUser = this.orgUserData[0].userId;
            }
            await this.loadWorkData();
            this.allContractDeviceData = await this.common.postUrl("deviceContractService", "queryContractDeviceDtlList", {});
            this.$forceUpdate();
        },
        async loadWorkData()
        {
            this.deliveryWorkData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0,tenantId:this.info.custTenantId});
        },
        async changeCustTenant(){
            this.info.deliveryWorkId = null;
            let that = this;
            this.dtlList.forEach(el=>{
                el.devContractDeviceDtlId = '';
                el.devContractId = '';
                if(el.feeType==26){
                    let contractDeviceData = that.allContractDeviceData.filter(item => item.custTenantId === that.info.custTenantId&&item.devDeviceId === el.projectId&&(item.orgId === el.applyUserOrg||!item.orgId));
                    el.contractDeviceData = contractDeviceData;
                }
            });
            await this.changeDeliveryWork();
        },
        /**
         * 覆盖 mixin 配置，适配本页面的文件数据结构
         */
        _multiFileConfig() {
            return {
                getFileList: () => this.fileList,
                idField: 'imgId',
                pathField: 'imgPath',
                maxCount: 5,
                refPrefix: 'file', 
            };
        },
        changeDevContract(item){
            if(item.devContractDeviceDtlId){
                let devContract = item.contractDeviceData.filter(el=>el.devContractDeviceDtlId==item.devContractDeviceDtlId);
                item.devContractId = devContract[0].devContractId;
            }else{
                item.devContractId = '';
            }
            this.forceUpdate();
        },
        async changeDeliveryWork(){
            await this.loadWorkData();
            if(!this.info.deliveryWorkId){
                this.info.deliveryWorkType = '';
            }else{
                let deliveryWork = this.deliveryWorkData.find(item => item.workId === this.info.deliveryWorkId);
                this.info.deliveryWorkType = deliveryWork.workType;
            }
            this.$forceUpdate();
        },
        async initBankCard(tenantId)
        {
            this.bankCardData = await this.common.postUrl("bankTF", "queryBankInfoBytenantId", {tenantId});
            return this.bankCardData;
        },
        /**
         * 过滤function
         * @param data 选择的数据
         * @param index
         * @param isSelectAll 是否全选
         */
        filter(data, index, isSelectAll)
        {
            let purchaseType = '';
            if (isSelectAll)//全选
            {
                let set = new Set();
                let set2 = new Set();
                data.forEach(item => {
                    if (this.common.isNotBlank(item.purchaseType))
                    {
                        set.add(item.purchaseType);
                    }
                    if (this.common.isNotBlank(item.tenantId))
                    {
                        set2.add(item.tenantId);
                    }
                });
                if (set2.size > 1)
                {
                    this.$message.error("不能包含多个供应商一起采购,请重新选择！");
                    return false;
                }
                purchaseType = set.values().next().value;
            }
            else
            {
                purchaseType = data.purchaseType;
            }
            if (this.check(purchaseType))
            {
                //this.$message.error("已经选择了其他采购类型的数据,请重新选择");
                //return false;
            }
            this.isFilter = false;
            this.$nextTick(() => {
                this.$refs.table.toRightTable(data, index, isSelectAll ? 'all' : '');
                this.isFilter = true;//视图渲染完变回继续走过滤
            })
        },
        /**
         * 校验选择的数据的费用类型是否和已选择的费用类型一致
         * @param purchaseType
         * @returns {boolean}
         */
        check(purchaseType)
        {
            let selectItems = this.$refs.table.getRightData();
            let flag = false;
            selectItems.forEach(item => {
                if (!flag){ flag = purchaseType !== item.purchaseType; }
            });
            return flag;
        },
        /**
         * 选择数据到右边
         * @param left 左边表格数据
         * @param right 右边选择数据
         * @param isSelectAll 是否选择全部
         */
        dataChange(left, right, isSelectAll)
        {
            let selectItems = this.$refs.table.getRightData();
            let purchaseType = "";
            selectItems.forEach(item => {
                if (this.common.isNotBlank(item.purchaseType))
                {
                    purchaseType = item.purchaseType + '';
                }
            })
            this.query.purchaseType = purchaseType;
            //刷新列表
            if(right!=null&&right.length>1) return
            this.$nextTick(()=> {
                this.doQuery();
            })
        },

        back(){
            this.step = 1;
            this.$nextTick(() =>
            {
                this.$refs.table.setRightData(this.dtlList);
                this.$refs.table.filterLeftData();
            });
        },
        async next()
        {
            let selectData = this.$refs.table.getRightData();
            if (this.common.isBlank(selectData) || selectData.length === 0)
            {
                this.$message.error("请先选择费用申请明细数据，再生成！");
                return false;
            }
            // 保存已存在的数据的 applyDtlId，用于判断是否为新增数据
            let existIds = new Set();
            if (this.dtlList && this.dtlList.length > 0) {
                this.dtlList.forEach(item => {
                    if (item.applyDtlId) {
                        existIds.add(item.applyDtlId);
                    }
                });
            }
            //同种供应商 同种采购类型
            let tenantId = null;
            let purchaseType = null;
            let purchaseTypeName = null;
            let suppilerSet = new Set();
            let purchaseTypeSet = new Set();
            let receiptInfo = null;
            let receiptInfoSet = new Set();
            let applyIds = new Set();
            let feeType = new Set();
            for (let i = 0; i < selectData.length; i++)
            {
                let item = selectData[i];
                item.payType = item.payType+'';
                applyIds.add(item.applyId);
                suppilerSet.add(item.tenantId);
                purchaseTypeSet.add(item.purchaseType);
                tenantId = item.tenantId;
                purchaseType = item.purchaseType;
                feeType.add(item.feeType);
                purchaseTypeName = item.purchaseTypeName;
                if (receiptInfoSet.size === 0)
                {
                    receiptInfo = item.receiptInfo;
                }
                else
                {
                    if (!receiptInfoSet.has(item.receiptInfo))
                    {
                        receiptInfo = receiptInfo + "-" + item.receiptInfo;
                    }
                }
                // 只对新增的数据设置 addValueTax，保留已有数据的修改值
                if (!existIds.has(item.applyDtlId)) {
                    item.addValueTax = item.referTax;
                }
            }
            if (suppilerSet.size > 1)
            {
                this.$message.error("选择的数据包含多个供应商，请确保只有一个供应商生成一张采购单！");
                // return false;
            }
            // if (purchaseTypeSet.size > 1)
            // {
            //     this.$message.error("选择的数据包含多种采购类型，请确保只有一种采购类型生成一张采购单！");
            //     return false;
            // }

            // if(feeType.has(26)&&feeType.size>1){
            //     this.$message.error("器具类采购不能跟其他类采购一起！");
            //     return false;
            // }
            //如果是器具类 跳转
            // if(feeType.has(26)){
            //     this.$emit("closeTab", this.$route.meta.id);
            //     this.$nextTick(()=> {
            //         this.$emit('openTab',{
            //             urlId: 'addDevicePurchase',
            //             urlName: '新增器具采购单',
            //             urlPathName: '',
            //             query:{applyIds:[...applyIds]},
            //             urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'});
            //     });
            // }

            if (this.common.isBlank(this.$route.query.id))
            {
                this.initInfo();
                this.info.purchaseUserId = this.common.userInfo().userId;
                for (let i = 0; i < this.userData.length; i++)
                {
                    let item = this.userData[i];
                    if (this.info.purchaseUserId == item.userId)
                    {
                        this.info.purchaseLinkman = item.userName;
                        this.info.purchaseBillId = item.billId;
                        this.info.purchaseEmail = item.email;
                        break;
                    }
                }
                this.info.purchaseType = purchaseType;
                this.info.purchaseTypeName = purchaseTypeName;
                this.info.purchaseDate = this.common.formatDate.getDate();
                this.info.receiptInfo = receiptInfo;
            }
            for (let i = 0; i < this.supplierData.length; i++)
            {
                let item = this.supplierData[i];
                if (tenantId == item.tenantId)
                {
                    this.info.tenantId = item.tenantId;
                    this.info.tenantName = item.supplierName;
                    this.info.tenantAddress = item.address;
                    this.info.tenantLinkman = item.linkman;
                    this.info.tenantLinkPhone = item.linkPhone;
                    this.info.tenantEmail = item.email;
                    break;
                }
            }
            let bankCardData = await this.initBankCard(tenantId);
            if (bankCardData.length === 1)
            {
                this.info.bankCard = bankCardData[0].bankCard;
                this.info.bankAccountName = bankCardData[0].bankAccountName;
                this.info.bankDeposit = bankCardData[0].bankDepositName;
            }
            this.dtlList = selectData;
            this.calTotalInfo();
            this.step = 2;
        },
        async changeSupplier(tenantId)
        {
            this.info.tenantName = null;
            this.info.tenantAddress = null;
            this.info.tenantLinkman = null;
            this.info.tenantLinkPhone = null;
            this.info.tenantEmail = null;
            for (let i = 0; i < this.supplierData.length; i++)
            {
                let item = this.supplierData[i];
                if (tenantId == item.tenantId)
                {
                    this.info.tenantId = item.tenantId;
                    this.info.tenantName = item.supplierName;
                    this.info.tenantAddress = item.address;
                    this.info.tenantLinkman = item.linkman;
                    this.info.tenantLinkPhone = item.linkPhone;
                    this.info.tenantEmail = item.email;
                    break;
                }
            }
            let bankCardData = await this.initBankCard(tenantId);
            if (bankCardData.length === 1)
            {
                this.info.bankCard = bankCardData[0].bankCard;
                this.info.bankAccountName = bankCardData[0].bankAccountName;
                this.info.bankDeposit = bankCardData[0].bankDepositName;
            }else{
                this.info.bankCard = null;
                this.info.bankAccountName = null;
                this.info.bankDeposit = null;
            }
            this.$forceUpdate();
        },
        changeBankCard()
        {
            if (this.common.isNotBlank(this.info.bankCard))
            {
                for (let i = 0; i < this.bankCardData.length; i++)
                {
                    let item = this.bankCardData[i];
                    if (this.info.bankCard == item.bankCard)
                    {
                        this.info.bankAccountName = item.bankAccountName;
                        this.info.bankDeposit = item.bankDepositName;
                        break;
                    }
                }
            }
            else
            {
                this.info.bankAccountName = null;
                this.info.bankDeposit = null;
            }
        },
        changeSettleBody()
        {
            if (this.common.isNotBlank(this.info.settleBody))
            {
                for (let i = 0; i < this.settleBodyData.length; i++)
                {
                    let item = this.settleBodyData[i];
                    if (this.info.settleBody == item.codeValue)
                    {
                        this.info.companyAddress = item.codeDesc;
                        break;
                    }
                }
            }
            else
            {
                this.info.companyAddress = null;
            }
        },
        calcTotalFee(item)
        {
            let purchaseNum = this.common.isBlank(item.purchaseNum) ? 0 : item.purchaseNum;
            let actualPrice = this.common.isBlank(item.actualPrice) ? 0 : item.actualPrice;
            item.totalFee= this.common.accMul(purchaseNum, actualPrice);
            this.calTotalInfo();
            this.$forceUpdate();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        showBigImg(data){
            this.srcList=[];
            this.srcList.push(data);
            this.$refs.viewer.show();
        },
        toDetail(id){
            let data = {
                query:{id:id,viewType:1},
                urlId: 'feeApplyDetail'+id,
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
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
        changeInfoSwitch()
        {
            this.info.isPrepay = this.info.isPrepay == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        async save()
        {
            if(this.common.isBlank(this.info.tenantId))
            {
                this.$message.error("供应商不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.bankCard))
            {
                this.$message.error("供应商银行卡账号不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.settleBody))
            {
                this.$message.error("采购方名称不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.purchaseUserId))
            {
                this.$message.error("采购员不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.transportMode))
            {
                this.$message.error("运输方式为空!");
                return;
            }
            if(this.common.isBlank(this.info.deliveryWorkId))
            {
                this.$message.error("交付地为空!");
                return;
            }
            if(this.common.isBlank(this.dtlList) || this.dtlList.length === 0)
            {
                this.$message.error("采购单明细为空!");
                return;
            }
            for (let i = 0; i < this.dtlList.length; i++)
            {
                let item = this.dtlList[i];
                if(this.common.isBlank(item.applyDtlId))
                {
                    this.$message.error("第" + (i + 1) + "行数据错误!");
                    return;
                }
                if(this.common.isBlank(item.purchaseNum))
                {
                    this.$message.error("第" + (i + 1) + "行数据采购数量为空!");
                    return;
                }
                if(this.common.isBlank(item.addValueTax)||item.addValueTax==0)
                {
                    this.$message.error("第" + (i + 1) + "行数据增值税为空或者为0!");
                    return;
                }
                if(this.common.isBlank(item.actualPrice))
                {
                    this.$message.error("第" + (i + 1) + "行数据实际采购含税单价为空!");
                    return;
                }
                if(this.common.isBlank(item.totalFee))
                {
                    this.$message.error("第" + (i + 1) + "行数据含税金额为空!");
                    return;
                }
                if (item.purchaseNum > item.demandNums)
                {
                    this.$message.error("第" + (i + 1) + "行数据采购数量大于需求数量!");
                    return;
                }
                if(item.feeType==26&&this.common.isBlank(item.devContractDeviceDtlId)){
                    this.$message.error("第" + (i + 1) + "行数据器具合同不能为空!");
                    return;
                }
            }
            if(this.common.isBlank(this.info.currentApplyUser))
            {
                this.$message.error("部门审核人不能为空!");
                return;
            }
            let param = this.common.copyObj(this.info)
            param.fileList = this.fileList;
            param.dtlList = this.dtlList;
            await this.common.postUrl('purPurchaseService', 'saveOrUpdatePurPurchase', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        async verify(type)
        {
            if (this.common.isBlank(this.info.id))
            {
                this.$message.error("网络异常,关闭当前页面重新选择采购单审核!");
                return false;
            }
            if (0 != this.info.verifyState && 1 != this.info.verifyState)
            {
                this.$message.error("只有未审核和审核中的采购单才可以审核！");
                return false;
            }
            this.info.type = type;
            if (type === 2)
            {
                if (this.common.isBlank(this.info.verifyRemark))
                {
                    this.$message.error("请输入审核意见！");
                    return false;
                }
            }
            await this.common.postUrl("purPurchaseService", "verifyPurPurchase", this.info);
            this.$message.success("审核成功！");
            this.closePage();
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        calTotalInfo(){
            this.totalInfo.demandNums = 0;
            this.totalInfo.srcPurchaseNums = 0;
            this.totalInfo.writeOffNums = 0;
            this.totalInfo.purchaseNum = 0;
            this.totalInfo.totalFee = 0;
            for (let i = 0; i < this.dtlList.length; i++) {
                this.totalInfo.demandNums = this.common.accAdd(this.dtlList[i].demandNums,this.totalInfo.demandNums);
                this.totalInfo.srcPurchaseNums = this.common.accAdd(this.dtlList[i].srcPurchaseNums,this.totalInfo.srcPurchaseNums);
                this.totalInfo.writeOffNums = this.common.accAdd(this.dtlList[i].writeOffNums,this.totalInfo.writeOffNums);
                this.totalInfo.purchaseNum = this.common.accAdd(this.dtlList[i].purchaseNum,this.totalInfo.purchaseNum);
                this.totalInfo.totalFee = this.common.accAdd(this.dtlList[i].totalFee,this.totalInfo.totalFee);
            }
        }
	},
    computed:{
		formData(){
			return [
				{"name":"申请部门","model":"applyUserOrgName","type":"input","placeholder":"申请部门","isshow":true},
				{"name":"费用申请单号","model":"applyNum","type":"input","placeholder":"费用申请单号","isshow":true},
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"费用类型","method":"doQuery","isshow":true},
                // {"name":"采购类型","model":"purchaseType","type":"select","options":this.purchaseTypeData,"label":"codeName","value":"codeValue","placeholder":"采购类型","method":"doQuery","isshow":true},
                {"name":"品名/项目","model":"projectName","type":"input","placeholder":"品名/项目","isshow":true},
				{"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
            ]
		},
    }
}