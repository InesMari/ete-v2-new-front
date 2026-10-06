import myFileModel from '@/components/myFileModel/myFileModel.vue'
import printJS from "print-js";
import enumData from "@/page/pt/enum";
export default {
    name: 'supplierContractInfo',
    data() {
        return {
            info:{
                id:this.$route.query.id,
                type:2,
                createDate:this.common.formatDate.getDate(),
                tenantName:'',
                fromDate:'2023-01-03',
                contractType:[],
                contractClass:[],
                reviewUserList:[],
                createUserName: this.common.userInfo().userName,
                orgName:this.common.userInfo().orgName.split('-')[1],
                remark:'',
                transitAreas:[],
                certificate:[],
                qualification:[],
                establishmentDate:'',
                registeredCapital:'',
                registeredAddress:'',
                provideLoans:[],
                prods:[],
                systemCertification:[],
                certificateOfTitle:[],
                insurance:[],
                riskPlan:[],
                riskPlanRemark:'',
                keepDate:null,//
                disputeCourt:'',
                payMode:[],
                reconciliationDate:'',
                invoiceDate:'',
                invoiceType:[],
                taxRate:[],
                accountPeriod:[],
                accountPeriodValue:null,
                deposit:[],
                returnDate:'',
                fileList:[{}],
                reviewRemark:'',
                //仓储租赁
                relOrgId:null,
                leaseArea:null,
                leasePrice:null,
                storeHouseArea:null,
                manageFee:null,
                otherFee:null,
                monthFee:null,
                storeHouseFireGrade:[],
                customerContractDateRange:null,
                businessLicenseFileId:null,
                businessLicenseFilePath:null,
                fireInspectionCertificateFileId:null,
                fireInspectionCertificateFilePath:null,
                propertyOwnershipCertificateFileId:null,
                propertyOwnershipCertificateFilePath:null,
                //仓储业务
                //monthFee:null,
                businessLicense2FileId:null,
                businessLicense2FilePath:null,
                //保险
                contractContent:[],
                contractContentValue:null,
                businessLicense3FileId:null,
                businessLicense3FilePath:null,
                idCardFrontFileId: null,
                idCardFrontFilePath: null,
                idCardBackFileId: null,
                idCardBackFilePath: null,
                certificateEmploymentFileId: null,
                certificateEmploymentFilePath: null,

                businessLicense9FileId:null,
                businessLicense9FilePath:null,
                legalRepresentative: null,
                businessScope: null,
                dateEstablishment: null,
                insuranceRegisteredAddress: null,

                agentName: null,
                agentBill: null,
                agentLegalRepresentative: null,
                agentBusinessScope: null,
                agentDateEstablishment: null,
                agentRegisteredAddress: null,

                payCondition: [],
                payConditionValue: null,
                isNew: 0,
                isOld: false,
                contractParentType: null,
            },
            contractTypeDate:[],
            contractClassData:[],
            contractClassDataAll:[],
            contractContentData:[],
            transitAreasData:[],
            certificateData:[],
            qualificationData:[],
            qualificationDataAll:[],
            provideLoansData:[],
            haveOrNotData:[],
            payModeData:[],
            invoiceTypeData:[],
            taxRateData:[],
            accountPeriodData:[],
            payTitleOptions:[],
            payConditionData:[],
            storeHouseData:[],
            orgData:[],
            storeHouseFireGradeData:[],

            type:this.$route.query.type,//1 新增 2 修改 3 评审 4 打印 5 查看 6 复制
            disabled:this.$route.query.type>2 ? this.$route.query.type != 6:false,
            contractParentTypeData:[],
            map: new Map(),
            orgId:'',
        }
    },
    mounted() {
        this.init();
        //1普通运输,2危险品运输,3仓储服务,4劳务服务,5销售,6租赁,7工程类,8保险,9仓储租赁,10人力劳务
        this.map.set("1", 1);
        this.map.set("2", 1);
        this.map.set("3", 2);
        this.map.set("4", 2);
        this.map.set("5", 3);
        this.map.set("6", 3);
        this.map.set("7", 2);
        this.map.set("8", 4);
        this.map.set("9", 2);
        this.map.set("10", 5);
        this.map.set("11", 2);
        this.map.set("12", 5);
    },
    components: {
        myFileModel,
    },
    methods: {
        async init() {
            this.contractTypeDate = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_TYPE"});
            this.contractParentTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_PARENT_TYPE"});
            this.contractContentData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"INSURANCE_CONTENT"});
            this.transitAreasData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"TRANSIT_AREA"});
            this.certificateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CERTIFICATE"});
            this.qualificationDataAll = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"QUALIFICATION"});
            for (let i = 0; i < this.qualificationDataAll.length; i++) {
                this.qualificationData.push(this.qualificationDataAll[i]);
            }
            this.provideLoansData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PROVIDE_LOANS"});
            this.haveOrNotData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"HAVE_OR_NOT"});
            this.payModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_PAY_MODE"});
            this.invoiceTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_INVOICE_TYPE"});
            this.taxRateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"TAX_RATE"});
            this.accountPeriodData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"ACCOUNT_PERIOD"});
            this.payTitleOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
            this.storeHouseFireGradeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STORE_HOUSE_FIRE_GRADE"});
            this.payConditionData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_CONDITION"});
            this.contractClassDataAll = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_CLASS"});
            for (let i = 0; i < this.contractClassDataAll.length; i++)
            {
                let item = this.contractClassDataAll[i];
                if (item.codeValue <= 20)
                {
                    this.contractClassData.push(item);
                }
            }
            //orgFLg 1 代表只查询自己部门审核相关的，其余情况查询所有的审核人，因为需要最多的显示
            // this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {parentFlag: 1});//仓库数据
            this.storeHouseData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});

            if(this.info.id>0){
                await this.initContractInfo();
                if(this.info.fileList.length==0){
                    this.info.fileList.push({});
                }
                if(this.type==6){//复制
                    //清空部门
                    let workId = this.info.workId;
                    this.info.workId = null;
                    let that = this;
                    this.storeHouseData.forEach(el=>{
                        if(el.workId == workId){
                            that.info.relOrgId = el.orgId;
                        }
                    });
                    this.info.createDate=this.common.formatDate.getDate();
                    this.info.createUserName=this.common.userInfo().userName;
                    this.info.orgName=this.common.userInfo().orgName.split('-')[1];
                    // let userId = this.info.reviewUserList[0].userId;
                    await this.changeStoreHouseBase();
                    // this.info.reviewUserList[0].userId = userId;
                }
            }else{
                this.info.reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {type: 2,orgFlg:1});
                // this.initWorkInfo();
            }
        },

        async initContractInfo() {
            let info = await this.common.postUrl("contractReviewTF", "getContractReviewInfo", {id:this.info.id});
            this.info.contractType = info.contractType;
            this.info.isOld = info.isOld;
            await this.changeContractType(info.contractType);

            if(this.common.isNotBlank(info.settleBody)){
                info.settleBody = info.settleBody+'';
            }
            if (this.common.isNotBlank(info.contractType))
            {
                info.contractType = (info.contractType+'').split(',');
            }
            else
            {
                info.contractType = [];
            }
            if (this.common.isNotBlank(info.contractClass))
            {
                info.contractClass = (info.contractClass+'').split(',');
            }
            else
            {
                info.contractClass = [];
            }
            if (this.common.isNotBlank(info.transitAreas))
            {
                info.transitAreas = (info.transitAreas+'').split(',');
            }
            else
            {
                info.transitAreas = [];
            }
            if (this.common.isNotBlank(info.certificate))
            {
                info.certificate = (info.certificate+'').split(',');
            }
            else
            {
                info.certificate = [];
            }
            if (this.common.isNotBlank(info.qualification))
            {
                info.qualification = (info.qualification+'').split(',');
            }
            else
            {
                info.qualification = [];
            }
            if (this.common.isNotBlank(info.provideLoans))
            {
                info.provideLoans = (info.provideLoans+'').split(',');
            }
            else
            {
                info.provideLoans = [];
            }
            if (this.common.isNotBlank(info.prods))
            {
                info.prods = (info.prods+'').split(',');
            }
            else
            {
                info.prods = [];
            }
            if (this.common.isNotBlank(info.systemCertification))
            {
                info.systemCertification = (info.systemCertification+'').split(',');
            }
            else
            {
                info.systemCertification = [];
            }
            if (this.common.isNotBlank(info.certificateOfTitle))
            {
                info.certificateOfTitle = (info.certificateOfTitle+'').split(',');
            }
            else
            {
                info.certificateOfTitle = [];
            }
            if (this.common.isNotBlank(info.insurance))
            {
                info.insurance = (info.insurance+'').split(',');
            }
            else
            {
                info.insurance = [];
            }
            if (this.common.isNotBlank(info.riskPlan))
            {
                info.riskPlan = (info.riskPlan+'').split(',');
            }
            else
            {
                info.riskPlan = [];
            }
            if (this.common.isNotBlank(info.payMode))
            {
                info.payMode = (info.payMode+'').split(',');
            }
            else
            {
                info.payMode = [];
            }
            if (this.common.isNotBlank(info.invoiceType))
            {
                info.invoiceType = (info.invoiceType+'').split(',');
            }
            else
            {
                info.invoiceType = [];
            }
            if (this.common.isNotBlank(info.taxRate))
            {
                info.taxRate = (info.taxRate+'').split(',');
            }
            else
            {
                info.taxRate = [];
            }
            if (this.common.isNotBlank(info.accountPeriod))
            {
                info.accountPeriod = (info.accountPeriod+'').split(',');
            }
            else
            {
                info.accountPeriod = [];
            }
            if (this.common.isNotBlank(info.deposit))
            {
                info.deposit = (info.deposit+'').split(',');
            }
            else
            {
                info.deposit = [];
            }
            if (this.common.isNotBlank(info.storeHouseFireGrade))
            {
                info.storeHouseFireGrade = (info.storeHouseFireGrade+'').split(',');
            }
            else
            {
                info.storeHouseFireGrade = [];
            }
            if (this.common.isNotBlank(info.payCondition))
            {
                info.payCondition = (info.payCondition+'').split(',');
            }
            else
            {
                info.payCondition = [];
            }
            if (this.common.isNotBlank(info.contractContent))
            {
                info.contractContent = (info.contractContent+'').split(',');
            }
            else
            {
                info.contractContent = [];
            }

            info.keepDate=[info.keepStartDate,info.keepEndDate];
            if (this.common.isNotBlank(info.customerContractDateBegin) && this.common.isNotBlank(info.customerContractDateEnd))
            {
                info.customerContractDateRange=[info.customerContractDateBegin,info.customerContractDateEnd];
            }
            if (info.contractType == 9 && this.type != 4)
            {
                if (this.common.isNotBlank(info.businessLicenseFileId))
                {
                    this.$refs.businessLicense.initDate(info.businessLicenseFileId);
                }
                if (this.common.isNotBlank(info.fireInspectionCertificateFileId))
                {
                    this.$refs.fireInspectionCertificate.initDate(info.fireInspectionCertificateFileId);
                }
                if (this.common.isNotBlank(info.propertyOwnershipCertificateFileId))
                {
                    this.$refs.propertyOwnershipCertificate.initDate(info.propertyOwnershipCertificateFileId);
                }
                if (this.common.isNotBlank(info.deliveryMaterielListFileId))
                {
                    this.$refs.deliveryMaterielList.initDate(info.deliveryMaterielListFileId);
                }
                if (this.common.isNotBlank(info.idCardFrontFileId))
                {
                    this.$refs.idCardFront.initDate(info.idCardFrontFileId);
                }
                if (this.common.isNotBlank(info.idCardBackFileId))
                {
                    this.$refs.idCardBack.initDate(info.idCardBackFileId);
                }
                if (this.common.isNotBlank(info.housePlanFileId))
                {
                    this.$refs.housePlan.initDate(info.housePlanFileId);
                }
            }
            if ((info.contractType >= 3 && info.contractType <= 7) && !info.isOld && this.type != 4)
            {
                if (this.common.isNotBlank(info.businessLicenseFileId))
                {
                    this.$refs.businessLicense2.initDate(info.businessLicenseFileId);
                }
            }
            if (info.contractType == 8 && !info.isOld && this.type != 4)
            {
                if (this.common.isNotBlank(info.businessLicense9FileId))
                {
                    this.$refs.businessLicense9.initDate(info.businessLicense9FileId);
                }
                if (this.common.isNotBlank(info.businessLicenseFileId))
                {
                    this.$refs.businessLicense3.initDate(info.businessLicenseFileId);
                }
                if (this.common.isNotBlank(info.idCardFrontFileId))
                {
                    this.$refs.idCardFront.initDate(info.idCardFrontFileId);
                }
                if (this.common.isNotBlank(info.idCardBackFileId))
                {
                    this.$refs.idCardBack.initDate(info.idCardBackFileId);
                }
                if (this.common.isNotBlank(info.certificateEmploymentFileId))
                {
                    this.$refs.certificateEmployment.initDate(info.certificateEmploymentFileId);
                }
            }

            if (this.$route.query.type == 6)
            {
                info.createDate = this.common.formatDate.getDate();
            }
            this.info=info;
            this.info.contractParentType = info.contractParentType+'';
            this.$forceUpdate();

            //处理合并单元格
            for (let i = 0; i < this.info.reviewUserList.length; i++) {
                let item = this.info.reviewUserList[i];
                this.info.reviewUserList[i].rowspan = 1;
                this.info.reviewUserList[i].show = true;
            }
            for (let i = 0; i < this.info.reviewUserList.length; i++) {
                let item = this.info.reviewUserList[i];
                this.info.reviewUserList[i].displayOrgName = this.info.reviewUserList[i].orgName;
                if(i==0){
                    continue;
                }
                if((i+1)<this.info.reviewUserList.length&&item.orgId==this.info.reviewUserList[i+1].orgId){
                    this.info.reviewUserList[i].rowspan=2;
                    this.info.reviewUserList[i].show=true;
                    this.info.reviewUserList[i].displayOrgName = this.info.reviewUserList[i+1].orgName;
                    this.info.reviewUserList[i+1].show=false;
                }
            }
            this.imgDisplay();
        },
        async saveContractReviewInfo(saveType){
            if(this.info.contractType.length==0){
                this.$message.error("合同评审类型必须选择");
                return false;
            }
            if (this.common.isBlank(this.info.tenantName)) {
                this.$message.error(this.info.contractType != 8 ? "供应商名称不能为空" : "保险公司名称不能为空");
                return false;
            }
            if (this.common.isBlank(this.info.settleBody)) {
                this.$message.error("结算主体不能为空");
                return false;
            }
            if (this.common.isBlank(this.info.fromDate)) {
                this.$message.error("表单启用日期不能为空");
                return false;
            }
            let contractType = this.info.contractType[0];

            let noSearchUser = this.info.reviewUserList.filter(item => !item.userId);
            if(noSearchUser.length>0){
                this.$message.error("请补全评审人员。");
                return false;
            }
            if(saveType!=1) {
                if (this.common.isBlank(this.info.remark)) {
                    this.$message.error("申请事由不能为空");
                    return false;
                }
                if (contractType == 8) {
                    this.info.relOrgId = '';
                } else {
                    if (this.common.isBlank(this.info.relOrgId)) {
                        this.$message.error("关联部门不能为空");
                        return false;
                    }
                    this.info.relOrgIds = [];
                }

                if (contractType != 8) {
                    if (this.info.contractClass.length == 0) {
                        this.$message.error("合同类别必须选择");
                        return false;
                    }
                    if (!(contractType >= 3 && contractType <= 7) && contractType != 9) {
                        if (this.info.transitAreas.length == 0 && contractType != 12) {
                            this.$message.error("运输区域必须选择");
                            return false;
                        }
                        if (this.info.certificate.length == 0) {
                            this.$message.error("相关证照必须选择");
                            return false;
                        }
                        if (this.info.qualification.length == 0) {
                            this.$message.error("相关资质必须选择");
                            return false;
                        }
                        if (this.common.isBlank(this.info.establishmentDate)) {
                            this.$message.error("成立日期不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.registeredCapital)) {
                            this.$message.error("注册资本不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.registeredAddress)) {
                            this.$message.error("注册地址不能为空");
                            return false;
                        }
                        if (this.info.provideLoans.length == 0 && contractType != 12) {
                            this.$message.error("垫资能力必须选择");
                            return false;
                        }

                        if (contractType != 12) {
                            if (this.info.prods.length == 0) {
                                this.$message.error("产品类：生产许可、产品检测报告、质量认证必须选择");
                                return false;
                            }
                            if (this.info.systemCertification.length == 0) {
                                this.$message.error("体系认证及安全：ISO 质量认证体系、安全、消防资质必须选择");
                                return false;
                            }
                            if (this.info.certificateOfTitle.length == 0) {
                                this.$message.error("场地（厂房）房屋产权证必须选择");
                                return false;
                            }
                            if (this.info.insurance.length == 0) {
                                this.$message.error("是否相关保险（车辆险、运输险、货物险、财产险）必须选择");
                                return false;
                            }
                            if (this.info.riskPlan.length == 0) {
                                this.$message.error("合作风险防范措施/方案必须选择");
                                return false;
                            }
                        }
                        if (this.common.isBlank(this.info.keepDate) || this.info.keepDate.length != 2) {
                            this.$message.error("履约期限不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.disputeCourt)) {
                            this.$message.error("履约纠纷法院不能为空");
                            return false;
                        }
                    } else if (contractType == 9) {
                        if (this.info.storeHouseFireGrade.length == 0) {
                            this.$message.error("仓库消防等级必须选择");
                            return false;
                        }
                        if (this.common.isBlank(this.info.keepDate) || this.info.keepDate.length != 2) {
                            this.$message.error("租赁合同期限不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.customerContractDateRange) || this.info.customerContractDateRange.length != 2) {
                            this.$message.error("客户合同期限不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.leaseArea)) {
                            this.$message.error("租赁面积不能为空");
                            return false;
                        }
                        if (this.common.isBlank(this.info.leasePrice)) {
                            this.$message.error("租赁单价不能为空");
                            return false;
                        }
                        this.info.businessLicenseFileId = this.$refs.businessLicense.getImageData().flowId;
                        this.info.businessLicenseFilePath = this.$refs.businessLicense.getImageData().storePath;
                        if (this.common.isBlank(this.info.businessLicenseFileId)) {
                            this.$message.error("营业执照不能为空");
                            return false;
                        }
                        this.info.fireInspectionCertificateFileId = this.$refs.fireInspectionCertificate.getImageData().flowId;
                        this.info.fireInspectionCertificateFilePath = this.$refs.fireInspectionCertificate.getImageData().storePath;
                        if (this.common.isBlank(this.info.fireInspectionCertificateFileId)) {
                            this.$message.error("消防验收证明不能为空");
                            return false;
                        }
                        this.info.propertyOwnershipCertificateFileId = this.$refs.propertyOwnershipCertificate.getImageData().flowId;
                        this.info.propertyOwnershipCertificateFilePath = this.$refs.propertyOwnershipCertificate.getImageData().storePath;
                        if (this.common.isBlank(this.info.propertyOwnershipCertificateFileId)) {
                            this.$message.error("房产证不能为空");
                            return false;
                        }
                        this.info.deliveryMaterielListFileId = this.$refs.deliveryMaterielList.getImageData().flowId;
                        this.info.deliveryMaterielListFilePath = this.$refs.deliveryMaterielList.getImageData().storePath;
                        if (this.common.isBlank(this.info.deliveryMaterielListFileId)) {
                            this.$message.error("物品移交表不能为空");
                            return false;
                        }
                        // this.info.idCardFrontFileId = this.$refs.idCardFront.getImageData().flowId;
                        // this.info.idCardFrontFilePath = this.$refs.idCardFront.getImageData().storePath;
                        if (this.common.isBlank(this.info.idCardFrontFileId)) {
                            this.$message.error("房东身份证复制件正面不能为空");
                            return false;
                        }
                        // this.info.idCardBackFileId = this.$refs.idCardBack.getImageData().flowId;
                        // this.info.idCardBackFilePath = this.$refs.idCardBack.getImageData().storePath;
                        if (this.common.isBlank(this.info.idCardBackFileId)) {
                            this.$message.error("房东身份证复制件反面不能为空");
                            return false;
                        }
                        this.info.housePlanFileId = this.$refs.housePlan.getImageData().flowId;
                        this.info.housePlanFilePath = this.$refs.housePlan.getImageData().storePath;
                        if (this.common.isBlank(this.info.housePlanFileId)) {
                            this.$message.error("房屋布局图不能为空");
                            return false;
                        }


                    } else if ((contractType >= 3 && contractType <= 7)) {
                        // if (!this.info.contractClass.includes("34"))
                        // {
                        // if (this.common.isBlank(this.info.workId)) {
                        //     this.$message.error("仓库名称不能为空");
                        //     return false;
                        // }
                        if (this.common.isBlank(this.info.relOrgId)) {
                            this.$message.error("关联部门不能为空");
                            return false;
                        }
                        // }
                        if (this.common.isBlank(this.info.keepDate) || this.info.keepDate.length != 2) {
                            this.$message.error("合同期限不能为空");
                            return false;
                        }
                        this.info.businessLicenseFileId = this.$refs.businessLicense2.getImageData().flowId;
                        this.info.businessLicenseFilePath = this.$refs.businessLicense2.getImageData().storePath;
                        if (this.common.isBlank(this.info.businessLicenseFileId)) {
                            this.$message.error("营业执照不能为空");
                            return false;
                        }
                    }
                    if (this.info.payMode.length == 0) {
                        this.$message.error("付款方式必须选择");
                        return false;
                    }
                    // if (this.common.isBlank(this.info.reconciliationDate)) {
                    //     this.$message.error("对账日不能为空");
                    //     return false;
                    // }
                    // if (this.common.isBlank(this.info.invoiceDate)) {
                    //     this.$message.error("开票日不能为空");
                    //     return false;
                    // }
                    if (this.info.invoiceType.length == 0) {
                        this.$message.error("发票类型必须选择");
                        return false;
                    }
                    if (this.info.taxRate.length == 0) {
                        this.$message.error("发票税率必须选择");
                        return false;
                    }
                    if (this.info.accountPeriod.length == 0) {
                        this.$message.error("账期必须选择");
                        return false;
                    }
                    let flag = false;
                    for (let i = 0; i < this.info.accountPeriod.length; i++) {
                        if (this.info.accountPeriod[i] == 7) {
                            flag = true;//选了其他
                        }
                    }
                    if (flag && this.common.isBlank(this.info.accountPeriodValue)) {
                        this.$message.error("账期见票结：天数不能为空");
                        return false;
                    }
                    if (this.info.deposit.length == 0) {
                        this.$message.error("押金必须选择");
                        return false;
                    }
                    flag = false;
                    for (let i = 0; i < this.info.deposit.length; i++) {
                        if (this.info.deposit[i] == 1) {
                            flag = true;//选了有
                        }
                    }
                    if (flag && this.common.isBlank(this.info.returnDate)) {
                        this.$message.error("押金：支付/退回期限不能为空");
                        return false;
                    }
                } else//保险
                {
                    if (this.info.contractContent.length == 0) {
                        this.$message.error("保险种类必须选择");
                        return false;
                    }
                    let flag = false;
                    for (let i = 0; i < this.info.contractContent.length; i++) {
                        if (this.info.contractContent[i] == 7) {
                            flag = true;//选了其他
                        }
                    }
                    if (flag && this.common.isBlank(this.info.contractContentValue)) {
                        this.$message.error("保险种类：其他的请列出");
                        return false;
                    }
                    // if (this.info.workIds == null || this.info.workIds.length == 0) {
                    //     this.$message.error("保险对象中心不能为空");
                    //     return false;
                    // }
                    if (this.info.relOrgIds == null || this.info.relOrgIds.length == 0) {
                        this.$message.error("保险对象部门不能为空");
                        return false;
                    }
                    if (this.common.isBlank(this.info.keepDate) || this.info.keepDate.length != 2) {
                        this.$message.error("保险期限不能为空");
                        return false;
                    }
                    let aaa = this.info;
                    this.info.businessLicense9FileId = this.$refs.businessLicense9.getImageData().flowId;
                    this.info.businessLicense9FilePath = this.$refs.businessLicense9.getImageData().storePath;
                    if (this.common.isBlank(this.info.businessLicense9FileId)) {
                        this.$message.error("保险公司信息营业执照不能为空");
                        return false;
                    }

                    this.info.businessLicenseFileId = this.$refs.businessLicense3.getImageData().flowId;
                    this.info.businessLicenseFilePath = this.$refs.businessLicense3.getImageData().storePath;
                    if (this.common.isBlank(this.info.businessLicenseFileId)) {
                        this.$message.error("保险代理机构信息营业执照不能为空");
                        return false;
                    }

                    // this.info.idCardFrontFileId = this.$refs.idCardFront.getImageData().flowId;
                    // this.info.idCardFrontFilePath = this.$refs.idCardFront.getImageData().storePath;
                    // if (this.common.isBlank(this.info.idCardFrontFileId)) {
                    //     this.$message.error("身份证正面不能为空");
                    //     return false;
                    // }
                    // this.info.idCardBackFileId = this.$refs.idCardBack.getImageData().flowId;
                    // this.info.idCardBackFilePath = this.$refs.idCardBack.getImageData().storePath;
                    // if (this.common.isBlank(this.info.idCardBackFileId)) {
                    //     this.$message.error("身份证反面不能为空");
                    //     return false;
                    // }
                    // this.info.certificateEmploymentFileId = this.$refs.certificateEmployment.getImageData().flowId;
                    // this.info.certificateEmploymentFilePath = this.$refs.certificateEmployment.getImageData().storePath;
                    // if (this.common.isBlank(this.info.certificateEmploymentFileId)) {
                    //     this.$message.error("单位在职证明不能为空");
                    //     return false;
                    // }
                    // if (this.common.isBlank(this.info.agentName)) {
                    //     this.$message.error("代理机构姓名不能为空");
                    //     return false;
                    // }
                    // if (this.common.isBlank(this.info.agentBill)) {
                    //     this.$message.error("代理机构电话不能为空");
                    //     return false;
                    // }
                    if (this.info.payMode.length == 0) {
                        this.$message.error("付款方式必须选择");
                        return false;
                    }
                    if (this.info.payCondition.length == 0) {
                        this.$message.error("付款条件必须选择");
                        return false;
                    }
                    flag = false;
                    for (let i = 0; i < this.info.payCondition.length; i++) {
                        if (this.info.payCondition[i] == 2) {
                            flag = true;//选了其他
                        }
                    }
                    if (flag && this.common.isBlank(this.info.payConditionValue)) {
                        this.$message.error("付款条件：其他请列出");
                        return false;
                    }
                    if (this.info.invoiceType.length == 0) {
                        this.$message.error("发票类型必须选择");
                        return false;
                    }
                    if (this.info.taxRate.length == 0) {
                        this.$message.error("发票税率必须选择");
                        return false;
                    }
                }
            }
            this.info.keepStartDate = this.info.keepDate?this.info.keepDate[0]:null;
            this.info.keepEndDate = this.info.keepDate?this.info.keepDate[1]:null;
            if (this.common.isNotBlank(this.info.customerContractDateRange)&&this.info.customerContractDateRange.length==2)
            {
                this.info.customerContractDateBegin = this.info.customerContractDateRange[0];
                this.info.customerContractDateEnd = this.info.customerContractDateRange[1];
            }
            else
            {
                this.info.customerContractDateBegin = null;
                this.info.customerContractDateEnd = null;
            }
            let param = this.common.copyObj(this.info);
            param.contractType = param.contractType.join(',');
            if (param.contractClass && param.contractClass.length > 0)
            {
                param.contractClass = param.contractClass.join(',');
            }
            else
            {
                param.contractClass = null;
            }
            if (param.transitAreas && param.transitAreas.length > 0)
            {
                param.transitAreas = param.transitAreas.join(',');
            }
            else
            {
                param.transitAreas = null;
            }
            if (param.certificate && param.certificate.length > 0)
            {
                param.certificate = param.certificate.join(',');
            }
            else
            {
                param.certificate = null;
            }
            if (param.qualification && param.qualification.length > 0)
            {
                param.qualification = param.qualification.join(',');
            }
            else
            {
                param.qualification = null;
            }
            if (param.provideLoans && param.provideLoans.length > 0)
            {
                param.provideLoans = param.provideLoans.join(',');
            }
            else
            {
                param.provideLoans = null;
            }
            if (param.prods && param.prods.length > 0)
            {
                param.prods = param.prods.join(',');
            }
            else
            {
                param.prods = null;
            }
            if (param.systemCertification && param.systemCertification.length > 0)
            {
                param.systemCertification = param.systemCertification.join(',');
            }
            else
            {
                param.systemCertification = null;
            }
            if (param.certificateOfTitle && param.certificateOfTitle.length > 0)
            {
                param.certificateOfTitle = param.certificateOfTitle.join(',');
            }
            else
            {
                param.certificateOfTitle = null;
            }
            if (param.insurance && param.insurance.length > 0)
            {
                param.insurance = param.insurance.join(',');
            }
            else
            {
                param.insurance = null;
            }
            if (param.riskPlan && param.riskPlan.length > 0)
            {
                param.riskPlan = param.riskPlan.join(',');
            }
            else
            {
                param.riskPlan = null;
            }
            if (param.payMode && param.payMode.length > 0)
            {
                param.payMode = param.payMode.join(',');
            }
            else
            {
                param.payMode = null;
            }
            if (param.invoiceType && param.invoiceType.length > 0)
            {
                param.invoiceType = param.invoiceType.join(',');
            }
            else
            {
                param.invoiceType = null;
            }
            if (param.taxRate && param.taxRate.length > 0)
            {
                param.taxRate = param.taxRate.join(',');
            }
            else
            {
                param.taxRate = null;
            }
            if (param.accountPeriod && param.accountPeriod.length > 0)
            {
                param.accountPeriod = param.accountPeriod.join(',');
            }
            else
            {
                param.accountPeriod = null;
            }
            if (param.deposit && param.deposit.length > 0)
            {
                param.deposit = param.deposit.join(',');
            }
            else
            {
                param.deposit = null;
            }

            if (param.storeHouseFireGrade && param.storeHouseFireGrade.length > 0)
            {
                param.storeHouseFireGrade = param.storeHouseFireGrade.join(',');
            }
            else
            {
                param.storeHouseFireGrade = null;
            }
            if (param.contractContent && param.contractContent.length > 0)
            {
                param.contractContent = param.contractContent.join(',');
            }
            else
            {
                param.contractContent = null;
            }
            if (param.payCondition && param.payCondition.length > 0)
            {
                param.payCondition = param.payCondition.join(',');
            }
            else
            {
                param.payCondition = null;
            }
            param.type = 2;//供应商的
            param.saveType = saveType;
            if (this.$route.query.type == 6){ param.id = null; }//复制的

            let that = this;
            await this.common.postUrl("contractReviewTF", 'saveContractReviewInfo', param);
            this.$message.success((this.common.isNotBlank(this.$route.query.id) ? (this.$route.query.type == 6? "复制" : "合同评审修改") :"合同评审保存") +"成功！");
            setTimeout(() => {
                that.closePage();
            }, 500);
        },

        /**
         * 审核
         * @param type 1通过  2不通过
         * @returns {Promise<boolean>}
         */
        async review(type) {
            if(this.info.sts!=1&&this.info.sts!=2){
                this.$message.error("只有未评审或者评审中的合同才能评审！");
                return false;
            }
            this.info.type = type;
            this.$prompt('您正在操作评审确认，请输入评审意见，并确认是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                if (this.common.isBlank(value)&&type===2)
                {
                    this.$message.error("请输入评审意见！");
                    return false;
                }
                this.info.reviewRemark = value;
                await this.reviewById();
            }).catch(() => {});
        },
        async reviewById(){
            await this.common.postUrl("contractReviewTF", "reviewContractInfo", this.info);
            this.$message.success("评审成功！");
            this.$parent.loadTodoData();
            let that = this;
            setTimeout(() => {
                that.closePage();
            }, 500);
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/contract.css', //真实路径/public//static/css/contract.css
                scanStyles: false
            })
            let that =  this;
            that.common.postUrl("contractReviewTF", "addPrintTimes", that.info,function (){
              that.initContractInfo();
            });
        },
        async changeContractType(value)
        {
            this.contractClassData = [];
            for (let i = 0; i < this.contractClassDataAll.length; i++)
            {
                let item = this.contractClassDataAll[i];
                if (value == 9 && !this.info.isOld)
                {
                    if (item.codeValue > 20 && item.codeValue <= 30)
                    {
                        this.contractClassData.push(item);
                    }
                }
                else if (((value >= 3 && value <= 7)||value==12) && !this.info.isOld)
                {
                    if (item.codeValue > 30 && item.codeValue <= 40)
                    {
                        this.contractClassData.push(item);
                    }
                }
                else
                {
                    if (item.codeValue <= 20)
                    {
                        this.contractClassData.push(item);
                    }
                }
            }
            this.info.contractParentType = this.map.get(value)+"";

            this.qualificationData=[];
            if(value==12){
                this.qualificationData.push(this.qualificationDataAll[2]);
            }else{
                for (let i = 0; i < this.qualificationDataAll.length; i++) {
                    this.qualificationData.push(this.qualificationDataAll[i]);
                }
            }


            //置空下看不到的字段
            if (value != 8 && !this.info.isOld)
            {
                if (value == 9)
                {
                    this.info.contractClass = [];
                    this.info.transitAreas = [];
                    this.info.certificate = [];
                    this.info.qualification = [];
                    this.info.establishmentDate = '';
                    this.info.registeredCapital = '';
                    this.info.registeredAddress = '';
                    this.info.provideLoans = [];
                    this.info.prods = [];
                    this.info.systemCertification = [];
                    this.info.certificateOfTitle = [];
                    this.info.insurance = [];
                    this.info.riskPlan = [];
                    this.info.riskPlanRemark = '';
                    this.info.keepDate = null;//
                    this.info.disputeCourt = '';
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //仓储租赁
                    this.info.contractClass = [];
                    this.info.workId = null;
                    this.info.leaseArea = null;
                    this.info.leasePrice = null;
                    this.info.storeHouseArea = null;
                    this.info.manageFee = null;
                    this.info.otherFee = null;
                    this.info.monthFee = null;
                    this.info.storeHouseFireGrade = [];
                    this.info.keepDate = null;
                    this.info.customerContractDateRange = null;
                    if (this.$refs.businessLicense)
                    {
                        this.$refs.businessLicense.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.fireInspectionCertificate)
                    {
                        this.$refs.fireInspectionCertificate.clean();
                    }
                    this.info.fireInspectionCertificateFileId = null;
                    this.info.fireInspectionCertificateFilePath = null;
                    if (this.$refs.propertyOwnershipCertificate)
                    {
                        this.$refs.propertyOwnershipCertificate.clean();
                    }
                    this.info.propertyOwnershipCertificateFileId = null;
                    this.info.propertyOwnershipCertificateFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //仓储业务
                    this.info.contractClass = [];
                    this.info.relOrgId = null;
                    this.info.monthFee = null;
                    this.info.keepDate = null;
                    if (this.$refs.businessLicense2)
                    {
                        this.$refs.businessLicense2.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //保险
                    this.info.contractContent = [];
                    this.info.contractContentValue = null;
                    this.info.relOrgIds = [];
                    this.info.keepDate = null;
                    if (this.$refs.businessLicense9)
                    {
                        this.$refs.businessLicense9.clean();
                    }
                    if (this.$refs.businessLicense3)
                    {
                        this.$refs.businessLicense3.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.idCardFront)
                    {
                        this.$refs.idCardFront.clean();
                    }
                    this.info.idCardFrontFileId = null;
                    this.info.idCardFrontFilePath = null;
                    if (this.$refs.idCardBack)
                    {
                        this.$refs.idCardBack.clean();
                    }
                    this.info.idCardBackFileId = null;
                    this.info.idCardBackFilePath = null;
                    if (this.$refs.certificateEmployment)
                    {
                        this.$refs.certificateEmployment.clean();
                    }
                    this.info.certificateEmploymentFileId = null;
                    this.info.certificateEmploymentFilePath = null;
                    this.info.agentName = null;
                    this.info.agentBill = null;
                    this.info.payMode = [];
                    this.info.payCondition = [];
                    this.info.payConditionValue = null;
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                }
                else if(value >= 3 && value <= 7)
                {
                    this.info.contractClass = [];
                    this.info.transitAreas = [];
                    this.info.certificate = [];
                    this.info.qualification = [];
                    this.info.establishmentDate = '';
                    this.info.registeredCapital = '';
                    this.info.registeredAddress = '';
                    this.info.provideLoans = [];
                    this.info.prods = [];
                    this.info.systemCertification = [];
                    this.info.certificateOfTitle = [];
                    this.info.insurance = [];
                    this.info.riskPlan = [];
                    this.info.riskPlanRemark = '';
                    this.info.keepDate = null;//
                    this.info.disputeCourt = '';
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //仓储租赁
                    this.info.contractClass = [];
                    this.info.relOrgId = null;
                    this.info.leaseArea = null;
                    this.info.leasePrice = null;
                    this.info.storeHouseArea = null;
                    this.info.manageFee = null;
                    this.info.otherFee = null;
                    this.info.monthFee = null;
                    this.info.storeHouseFireGrade = [];
                    this.info.keepDate = null;
                    this.info.customerContractDateRange = null;
                    if (this.$refs.businessLicense)
                    {
                        this.$refs.businessLicense.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.fireInspectionCertificate)
                    {
                        this.$refs.fireInspectionCertificate.clean();
                    }
                    this.info.fireInspectionCertificateFileId = null;
                    this.info.fireInspectionCertificateFilePath = null;
                    if (this.$refs.propertyOwnershipCertificate)
                    {
                        this.$refs.propertyOwnershipCertificate.clean();
                    }
                    this.info.propertyOwnershipCertificateFileId = null;
                    this.info.propertyOwnershipCertificateFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //仓储业务
                    this.info.contractClass = [];
                    this.info.relOrgId = null;
                    this.info.monthFee = null;
                    this.info.keepDate = null;
                    if (this.$refs.businessLicense2)
                    {
                        this.$refs.businessLicense2.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //保险
                    this.info.contractContent = [];
                    this.info.contractContentValue = null;
                    this.info.relOrgIds = [];
                    this.info.keepDate = null;
                    if (this.$refs.businessLicense9)
                    {
                        this.$refs.businessLicense9.clean();
                    }
                    if (this.$refs.businessLicense3)
                    {
                        this.$refs.businessLicense3.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.idCardFront)
                    {
                        this.$refs.idCardFront.clean();
                    }
                    this.info.idCardFrontFileId = null;
                    this.info.idCardFrontFilePath = null;
                    if (this.$refs.idCardBack)
                    {
                        this.$refs.idCardBack.clean();
                    }
                    this.info.idCardBackFileId = null;
                    this.info.idCardBackFilePath = null;
                    if (this.$refs.certificateEmployment)
                    {
                        this.$refs.certificateEmployment.clean();
                    }
                    this.info.certificateEmploymentFileId = null;
                    this.info.certificateEmploymentFilePath = null;
                    this.info.agentName = null;
                    this.info.agentBill = null;
                    this.info.payMode = [];
                    this.info.payCondition = [];
                    this.info.payConditionValue = null;
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                }
                else
                {
                    // this.info.contractClass = [];
                    // this.info.transitAreas = [];
                    // this.info.certificate = [];
                    // this.info.qualification = [];
                    // this.info.establishmentDate = '';
                    // this.info.registeredCapital = '';
                    // this.info.registeredAddress = '';
                    // this.info.provideLoans = [];
                    // this.info.prods = [];
                    // this.info.systemCertification = [];
                    // this.info.certificateOfTitle = [];
                    // this.info.insurance = [];
                    // this.info.riskPlan = [];
                    // this.info.riskPlanRemark = '';
                    // this.info.keepDate = null;//
                    // this.info.disputeCourt = '';
                    // this.info.payMode = [];
                    // this.info.reconciliationDate = '';
                    // this.info.invoiceDate = '';
                    // this.info.invoiceType = [];
                    // this.info.taxRate = [];
                    // this.info.accountPeriod = [];
                    // this.info.accountPeriodValue = null;
                    // this.info.deposit = [];
                    // this.info.returnDate = '';

                    //仓储租赁
                    this.info.contractClass = [];
                    this.info.relOrgId = null;
                    this.info.leaseArea = null;
                    this.info.leasePrice = null;
                    this.info.storeHouseArea = null;
                    this.info.manageFee = null;
                    this.info.otherFee = null;
                    this.info.monthFee = null;
                    this.info.storeHouseFireGrade = [];
                    this.info.keepDate = null;//
                    this.info.customerContractDateRange = null;
                    if (this.$refs.businessLicense)
                    {
                        this.$refs.businessLicense.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.fireInspectionCertificate)
                    {
                        this.$refs.fireInspectionCertificate.clean();
                    }
                    this.info.fireInspectionCertificateFileId = null;
                    this.info.fireInspectionCertificateFilePath = null;
                    if (this.$refs.propertyOwnershipCertificate)
                    {
                        this.$refs.propertyOwnershipCertificate.clean();
                    }
                    this.info.propertyOwnershipCertificateFileId = null;
                    this.info.propertyOwnershipCertificateFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //仓储业务
                    this.info.contractClass = [];
                    this.info.relOrgId = null;
                    this.info.monthFee = null;
                    this.info.keepDate = null;//
                    if (this.$refs.businessLicense2)
                    {
                        this.$refs.businessLicense2.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    this.info.payMode = [];
                    this.info.reconciliationDate = '';
                    this.info.invoiceDate = '';
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                    this.info.accountPeriod = [];
                    this.info.accountPeriodValue = null;
                    this.info.deposit = [];
                    this.info.returnDate = '';

                    //保险
                    this.info.contractContent = [];
                    this.info.contractContentValue = null;
                    this.info.relOrgIds = [];
                    this.info.keepDate = null;//
                    if (this.$refs.businessLicense9)
                    {
                        this.$refs.businessLicense9.clean();
                    }
                    if (this.$refs.businessLicense3)
                    {
                        this.$refs.businessLicense3.clean();
                    }
                    this.info.businessLicenseFileId = null;
                    this.info.businessLicenseFilePath = null;
                    if (this.$refs.idCardFront)
                    {
                        this.$refs.idCardFront.clean();
                    }
                    this.info.idCardFrontFileId = null;
                    this.info.idCardFrontFilePath = null;
                    if (this.$refs.idCardBack)
                    {
                        this.$refs.idCardBack.clean();
                    }
                    this.info.idCardBackFileId = null;
                    this.info.idCardBackFilePath = null;
                    if (this.$refs.certificateEmployment)
                    {
                        this.$refs.certificateEmployment.clean();
                    }
                    this.info.certificateEmploymentFileId = null;
                    this.info.certificateEmploymentFilePath = null;
                    this.info.agentName = null;
                    this.info.agentBill = null;
                    this.info.payMode = [];
                    this.info.payCondition = [];
                    this.info.payConditionValue = null;
                    this.info.invoiceType = [];
                    this.info.taxRate = [];
                }
            }
            else //保险 新的
            {
                this.info.contractClass = [];
                this.info.transitAreas = [];
                this.info.certificate = [];
                this.info.qualification = [];
                this.info.establishmentDate = '';
                this.info.registeredCapital = '';
                this.info.registeredAddress = '';
                this.info.provideLoans = [];
                this.info.prods = [];
                this.info.systemCertification = [];
                this.info.certificateOfTitle = [];
                this.info.insurance = [];
                this.info.riskPlan = [];
                this.info.riskPlanRemark = '';
                this.info.keepDate = null;//
                this.info.disputeCourt = '';
                this.info.payMode = [];
                this.info.reconciliationDate = '';
                this.info.invoiceDate = '';
                this.info.invoiceType = [];
                this.info.taxRate = [];
                this.info.accountPeriod = [];
                this.info.accountPeriodValue = null;
                this.info.deposit = [];
                this.info.returnDate = '';

                //仓储租赁
                this.info.contractClass = [];
                this.info.relOrgId = null;
                this.info.leaseArea = null;
                this.info.leasePrice = null;
                this.info.storeHouseArea = null;
                this.info.manageFee = null;
                this.info.otherFee = null;
                this.info.monthFee = null;
                this.info.storeHouseFireGrade = [];
                this.info.keepDate = null;
                this.info.customerContractDateRange = null;
                if (this.$refs.businessLicense)
                {
                    this.$refs.businessLicense.clean();
                }
                this.info.businessLicenseFileId = null;
                this.info.businessLicenseFilePath = null;
                if (this.$refs.fireInspectionCertificate)
                {
                    this.$refs.fireInspectionCertificate.clean();
                }
                this.info.fireInspectionCertificateFileId = null;
                this.info.fireInspectionCertificateFilePath = null;
                if (this.$refs.propertyOwnershipCertificate)
                {
                    this.$refs.propertyOwnershipCertificate.clean();
                }
                this.info.propertyOwnershipCertificateFileId = null;
                this.info.propertyOwnershipCertificateFilePath = null;
                this.info.payMode = [];
                this.info.reconciliationDate = '';
                this.info.invoiceDate = '';
                this.info.invoiceType = [];
                this.info.taxRate = [];
                this.info.accountPeriod = [];
                this.info.accountPeriodValue = null;
                this.info.deposit = [];
                this.info.returnDate = '';

                //仓储业务
                this.info.contractClass = [];
                this.info.relOrgId = null;
                this.info.monthFee = null;
                this.info.keepDate = null;
                if (this.$refs.businessLicense2)
                {
                    this.$refs.businessLicense2.clean();
                }
                this.info.businessLicenseFileId = null;
                this.info.businessLicenseFilePath = null;
                this.info.payMode = [];
                this.info.reconciliationDate = '';
                this.info.invoiceDate = '';
                this.info.invoiceType = [];
                this.info.taxRate = [];
                this.info.accountPeriod = [];
                this.info.accountPeriodValue = null;
                this.info.deposit = [];
                this.info.returnDate = '';

                //保险
                this.info.contractContent = [];
                this.info.contractContentValue = null;
                this.info.relOrgIds = [];
                this.info.keepDate = null;
                if (this.$refs.businessLicense9)
                {
                    this.$refs.businessLicense9.clean();
                }
                if (this.$refs.businessLicense3)
                {
                    this.$refs.businessLicense3.clean();
                }
                this.info.businessLicenseFileId = null;
                this.info.businessLicenseFilePath = null;
                if (this.$refs.idCardFront)
                {
                    this.$refs.idCardFront.clean();
                }
                this.info.idCardFrontFileId = null;
                this.info.idCardFrontFilePath = null;
                if (this.$refs.idCardBack)
                {
                    this.$refs.idCardBack.clean();
                }
                this.info.idCardBackFileId = null;
                this.info.idCardBackFilePath = null;
                if (this.$refs.certificateEmployment)
                {
                    this.$refs.certificateEmployment.clean();
                }
                this.info.certificateEmploymentFileId = null;
                this.info.certificateEmploymentFilePath = null;
                this.info.agentName = null;
                this.info.agentBill = null;
                this.info.payMode = [];
                this.info.payCondition = [];
                this.info.payConditionValue = null;
                this.info.invoiceType = [];
                this.info.taxRate = [];
            }
            // this.initWorkInfo();
            await this.checkbox('contractType', value);
        },
        initWorkInfo(){
            let userInfo = this.common.userInfo();
            if(this.common.isNotBlank(userInfo.workId)){
                this.info.workId = userInfo.workId;
                this.info.workIds = [userInfo.workId];
            }else{
                if(userInfo.orgId!=131){
                    this.storeHouseData.forEach(item=>{
                        if(item.workId == 100){
                            this.info.workId = item.workId;
                            this.info.workIds = [item.workId];
                        }
                    })
                }
            }
            this.changeStoreHouse();
        },
        async checkbox(items, value) {
            if(items != 'payMode'){
                this.info[items] = this.info[items].includes(value) ? [value] : [];
                if (items == 'invoiceType' && value == '0')
                {
                    this.info.taxRate = ['0'];
                }
            }

            // if (this.info.workId)
            //     this.info.workIds = [this.info.workId];
            // //合同类型
            // if (items == 'contractType') {
            //     if (this.info[items].includes('10')) {//人力服务
            //         this.info.reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {
            //             type: 2,
            //             orgFlg: 1,
            //             orgId:this.orgId,
            //             isHr: true,
            //             workIds: this.info.workIds
            //         });//orgFLg 1 代表只查询自己部门审核相关的，其余情况查询所有的审核人，因为需要最多的显示
            //     }else{
            //         this.info.reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {
            //             type: 2,
            //             orgFlg: 1,
            //             orgId:this.orgId,
            //             workIds: this.info.workIds
            //         });//orgFLg 1 代表只查询自己部门审核相关的，其余情况查询所有的审核人，因为需要最多的显示
            //     }
            // }
        },
        async changeStoreHouse() {
            this.info.leaseArea = null;
            this.info.leasePrice = null;
            this.info.reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {
                type: 2,
                orgFlg: 1,
                orgId: this.info.relOrgId
            });
            this.$forceUpdate();
        },
        async changeStoreHouseBase() {
            this.info.reviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {
                type: 2,
                orgFlg: 1,
                orgId: this.info.relOrgId
            });
            this.$forceUpdate();
        },
        successCallback(fileData)
        {
            this.info[fileData.componentId + 'FileId'] = fileData.flowId;
            this.info[fileData.componentId + 'FilePath'] = fileData.storePath;
        },
        deleteCallback(componentId)
        {

        },
        fileCallback(fileData){
            fileData.fileId = fileData.flowId;
            fileData.filePath = fileData.storePath;
            let flag = true;
            if (this.info.fileList.length <= 5)
                this.info.fileList[fileData.componentId] = fileData;
            for (let i = 0; i < this.info.fileList.length; i++)
                if (this.common.isBlank(this.info.fileList[i].fileId)) flag = false;//存在空的
            if (this.info.fileList.length < 5&&!this.disabled&&flag)
                this.info.fileList.push({});
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.info.fileList.length; i++)
                this.info.fileList[i].componentId = i;
            this.$forceUpdate();
        },
        delCallback(index){
            this.info.fileList.splice(index,1);
            let flag = true;
            for (let i = 0; i < this.info.fileList.length; i++)
                if (this.common.isBlank(this.info.fileList[i].fileId)) flag = false;//存在空的

            if(this.info.fileList.length === 4 && flag){
                this.info.fileList.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        imgDisplay(){
            if (this.$route.query.type == 4)
            {
                return;
            }
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.info.fileList.length; i++) {
                    if (that.info.fileList[i].fileId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.info.fileList[i].fileId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
