import myFileModel from '@/components/myFileModel/myFileModel.vue'
import printJS from "print-js";
import enumData from "@/page/pt/enum";
export default {
    name: 'customerContractInfo',
    data() {
        return {
            info:{
                id:this.$route.query.id,
                type:1,
                createDate:this.common.formatDate.getDate(),
                settleBody:null,
                tenantName:'',
                fromDate:'2023-01-03',
                contractType:[],
                contractClass:[],
                projectType:[],
                saveReviewUserList:[],
                reviewUserList:[],
                createUserName: this.common.userInfo().userName,
                orgName:this.common.userInfo().orgName.split('-')[1],
                remark:'',

                transitAreas:[],
                workAreas:[],
                certificate:[],
                // qualification:[],
                establishmentDate:'',
                registeredCapital:'',
                registeredAddress:'',

                // provideLoans:[],
                // prods:[],
                // systemCertification:[],
                // certificateOfTitle:[],
                // insurance:[],
                // riskPlan:[],
                // riskPlanRemark:'',
                transport:[],
                transportName:null,
                storage:[],
                storageName:null,
                packing:[],
                otherService:null,
                serviceProducts:null,
                otherItem:null,
                keepDate:'',
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
            },
            contractTypeDate:[],
            contractClassData:[],
            projectTypeData:[],
            transitAreasData:[],
            certificateData:[],
            qualificationData:[],
            provideLoansData:[],
            haveOrNotData:[],
            payModeData:[],
            invoiceTypeData:[],
            taxRateData:[],
            accountPeriodData:[],
            payTitleOptions:[],
            workData:[],
            transportData:[],
            storageData:[],
            packingData:[],
            customerData: [],//客户

            type:this.$route.query.type,        //6 复制
            disabled:this.$route.query.type>2 ? this.$route.query.type != 6:false,
            taxRate:[],
            //1到5星,自动计算并显示，新客户5星，1次逾期付款4星，逾期一个月付款3星，逾期两个月付款2星，逾期三个月付款1星，1星为风险客户
            colors:['#99A9BF', '#F7BA2A', '#FF9900'],
            texts:['逾期超90天付款', '逾期超60天付款', '逾期超30天付款', '逾期超30天内付款', '守信客户'],
        }
    },
    mounted() {
        this.init();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            this.contractTypeDate = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_TYPE"});
            this.contractClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_CLASS"});
            this.projectTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PROJECT_TYPE"});
            this.transitAreasData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"TRANSIT_AREA"});
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.certificateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CERTIFICATE"});
            // this.qualificationData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"QUALIFICATION"});
            // this.provideLoansData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PROVIDE_LOANS"});
            this.haveOrNotData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"HAVE_OR_NOT"});
            this.payModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_PAY_MODE"});
            this.invoiceTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CONTRACT_INVOICE_TYPE"});
            this.taxRateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"TAX_RATE"});
            this.accountPeriodData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_ACCOUNT_PERIOD"});
            this.payTitleOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});

            this.transportData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_TRANSPORT"});
            this.storageData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_STORAGE"});
            this.packingData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CUSTOMER_CONTRACT_PACKING"});
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            if(this.info.id>0){
                this.initContractInfo();
            }else{
                this.info.saveReviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {type: 1});
            }
        },

        selTenant(){
            let that = this;
            that.info.creditLevel=null;
            that.info.tenantName = null;
          this.customerData.forEach(function (item) {
              if(item.tenantId == that.info.tenantId){
                  that.info.creditLevel = item.creditLevel;
                  that.info.tenantName = item.name;
              }
          });
          this.$forceUpdate();
        },

        async initContractInfo() {
            let info = await this.common.postUrl("contractReviewTF", "getContractReviewInfo", {id:this.info.id});
            if(this.common.isNotBlank(info.settleBody)){
                info.settleBody = info.settleBody+'';
            }
            info.contractType = (info.contractType+'').split(',');
            info.contractClass = (info.contractClass+'').split(',');
            if(info.projectType){
                info.projectType = (info.projectType+'').split(',');
            }else{
                info.projectType = [];
            }
            info.transitAreas = (info.transitAreas+'').split(',');
            let workAreas = [];
            if (this.common.isNotBlank(info.workAreas))
            {
                let data = (info.workAreas+'').split(',');
                for (let i = 0; i < data.length; i++)
                {
                    let item = data[i];
                    if (this.common.isNotBlank(item))
                    {
                        workAreas.push(parseInt(item));
                    }
                }
            }
            info.workAreas = workAreas;
            info.certificate = (info.certificate + '').split(',');

            // info.qualification = (info.qualification+'').split(',');
            // info.provideLoans = (info.provideLoans+'').split(',');
            // info.prods = (info.prods+'').split(',');
            // info.systemCertification = (info.systemCertification+'').split(',');
            // info.certificateOfTitle = (info.certificateOfTitle+'').split(',');
            // info.insurance = (info.insurance+'').split(',');
            // info.riskPlan = (info.riskPlan+'').split(',');

            info.transport = (info.transport+'').split(',');
            info.storage = (info.storage+'').split(',');
            info.packing = (info.packing+'').split(',');

            info.payMode = (info.payMode+'').split(',');
            info.invoiceType = (info.invoiceType+'').split(',');
            info.taxRate = (info.taxRate+'').split(',');
            this.taxRate = this.common.copyObj(info.taxRate);
            info.accountPeriod = (info.accountPeriod+'').split(',');
            info.deposit = (info.deposit+'').split(',');
            info.keepDate=[info.keepStartDate,info.keepEndDate];

            // if (this.common.isNotBlank(info.fileList)) {
            //     let that = this;
            //     that.$nextTick(() => {
            //         for (let i = 0; i < info.fileList.length; i++) {
            //             eval("that.$refs.file" + i + "[0].initDate(" + info.fileList[i].fileId + ")");
            //         }
            //     });
            // }
            if (this.$route.query.type == 6)
            {
                info.createDate = this.common.formatDate.getDate();
            }
            this.info=info;
            if (this.type == 6)//复制的查询最新的审核流程人员
                await this.getReviewUserList();

            //处理合并单元格
            for (let i = 0; i < this.info.reviewUserList.length; i++) {
                let item = this.info.reviewUserList[i];
                this.info.reviewUserList[i].rowspan = 1;
                this.info.reviewUserList[i].show = true;
            }
            let idx = 1;
            for (let i = 0; i < this.info.reviewUserList.length; i++) {
                let item = this.info.reviewUserList[i];
                this.info.reviewUserList[i].displayOrgName = this.info.reviewUserList[i].orgName;
                if(i==0){
                    continue;
                }
                if(item.isWork==1){
                    this.info.reviewUserList[i].userName = this.info.reviewUserList[i].displayOrgName + "-" + this.info.reviewUserList[i].userName;
                    this.info.reviewUserList[i].displayOrgName = "物流中心";
                    this.info.reviewUserList[i-idx+1].rowspan=idx;
                    this.info.reviewUserList[i].show=idx==1;
                    idx++;
                }else{
                    if((i+1)<this.info.reviewUserList.length&&item.orgId==this.info.reviewUserList[i+1].orgId){
                        this.info.reviewUserList[i].rowspan++;
                        this.info.reviewUserList[i].show = true;
                        this.info.reviewUserList[i].displayOrgName = this.info.reviewUserList[i+1].orgName;
                        this.info.reviewUserList[i+1].show=false;
                    }
                }
            }
            this.imgDisplay();
            if(info.tenantId){
                this.info.tenantId = info.tenantId+'';
                this.$nextTick(()=>{
                  this.selTenant();
                });
            }
        },
        async getReviewUserList() {
            this.info.saveReviewUserList= [];
            this.$nextTick(async()=> {
                if (this.info.projectType) {
                    this.info.saveReviewUserList = await this.common.postUrl("contractReviewTF", "queryAllReviewUsersTemp", {
                        type: 1,
                        projectType: this.info.projectType.join(','),
                        workIds: this.info.workAreas,
                        settleBody:this.info.settleBody
                    });
                }
                this.$forceUpdate();
            });
        },
        /**
         * 保存
         * @returns {Promise<boolean>}
         */
        async saveContractReviewInfo(){
            if (this.saveFlag)
            {
                this.$message.error("请勿重复保存！");
                return false;
            }
            if (this.common.isBlank(this.info.tenantName)) {
                this.$message.error("客户名称不能为空");
                return false;
            }
            if (this.common.isBlank(this.info.fromDate)) {
                this.$message.error("表单启用日期不能为空");
                return false;
            }
            if(this.info.contractType.length==0){
                this.$message.error("合同类型必须选择");
                return false;
            }
            if(this.info.contractClass.length==0){
                this.$message.error("合同类别必须选择");
                return false;
            }
            if(this.info.projectType.length==0){
                this.$message.error("项目类别必须选择");
                return false;
            }
            if(this.info.projectType.includes('1')&&this.info.workAreas.length==0){
                this.$message.error("项目类别包含仓配项目时，运输区域必须选择");
                return false;
            }
            if (this.common.isBlank(this.info.remark)) {
                this.$message.error("申请事由不能为空");
                return false;
            }
            // if(this.info.transitAreas.length==0){
            //     this.$message.error("运输区域必须选择");
            //     return false;
            // }
            // if(this.info.workAreas.length==0){
            //     this.$message.error("仓储区域必须选择");
            //     return false;
            // }
            if(this.info.certificate.length==0){
                this.$message.error("相关证照必须选择");
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
            // if(this.info.transport.length==0){
            //     this.$message.error("运输类：必须选择");
            //     return false;
            // }
            let flag = false;
            for (let i = 0; i < this.info.transport.length; i++)
            {
                if (this.info.transport[i] == 5)
                {
                    flag = true;//选了其他
                }
            }
            if(flag && this.common.isBlank(this.info.transportName)){
                this.$message.error("运输类：其他名称不能为空");
                return false;
            }
            // if(this.info.storage.length==0){
            //     this.$message.error("仓库类：必须选择");
            //     return false;
            // }
            flag = false;
            for (let i = 0; i < this.info.storage.length; i++)
            {
                if (this.info.storage[i] == 4)
                {
                    flag = true;//选了其他
                }
            }
            if(flag && this.common.isBlank(this.info.storageName)){
                this.$message.error("仓库类：其他名称不能为空");
                return false;
            }
            // if(this.info.packing.length==0){
            //     this.$message.error("包装类：必须选择");
            //     return false;
            // }
            if(this.common.isBlank(this.info.otherService)){
                this.$message.error("其他服务不能为空");
                return false;
            }
            if(this.common.isBlank(this.info.serviceProducts)){
                this.$message.error("服务的物料产品不能为空");
                return false;
            }
            if(this.common.isBlank(this.info.otherItem)){
                this.$message.error("其他注意事项不能为空");
                return false;
            }
            if (this.common.isBlank(this.info.keepDate)||this.info.keepDate.length!=2) {
                this.$message.error("履约期限不能为空");
                return false;
            }
            this.info.keepStartDate = this.info.keepDate[0];
            this.info.keepEndDate = this.info.keepDate[1];
            if (this.common.isBlank(this.info.disputeCourt)) {
                this.$message.error("履约纠纷法院不能为空");
                return false;
            }
            if(this.info.payMode.length==0){
                this.$message.error("付款方式必须选择");
                return false;
            }
            if (this.common.isBlank(this.info.reconciliationDate)) {
                this.$message.error("对账日不能为空");
                return false;
            }
            if (this.common.isBlank(this.info.invoiceDate)) {
                this.$message.error("开票日不能为空");
                return false;
            }
            if(this.info.invoiceType.length==0){
                this.$message.error("发票类型必须选择");
                return false;
            }
            if(this.taxRate.length==0){
                this.$message.error("发票税率必须选择");
                return false;
            }
            this.info.taxRate = this.common.copyObj(this.taxRate);
            if(this.info.accountPeriod.length==0){
                this.$message.error("账期必须选择");
                return false;
            }
            flag = false;
            for (let i = 0; i < this.info.accountPeriod.length; i++)
            {
                if (this.info.accountPeriod[i] == 7)
                {
                    flag = true;//选了其他
                }
            }
            if(flag && this.common.isBlank(this.info.accountPeriodValue)){
                this.$message.error("账期见票结：天数不能为空");
                return false;
            }
            let that = this;
            if(this.info.deposit.length==0){
                this.$message.error("押金必须选择");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.contractType = param.contractType.join(',');
            param.contractClass = param.contractClass.join(',');
            param.projectType = param.projectType.join(',');
            param.transitAreas = param.transitAreas.join(',');
            param.workAreas = param.workAreas.join(',');
            param.certificate = param.certificate.join(',');

            // param.qualification = param.qualification.join(',');
            // param.provideLoans = param.provideLoans.join(',');
            // param.prods = param.prods.join(',');
            // param.systemCertification = param.systemCertification.join(',');
            // param.certificateOfTitle = param.certificateOfTitle.join(',');
            // param.insurance = param.insurance.join(',');
            // param.riskPlan = param.riskPlan.join(',');

            if (this.info.transport.length > 0)
            {
                param.transport = param.transport.join(',');
            }
            else
            {
                param.transport = null;
            }
            if (this.info.storage.length > 0)
            {
                param.storage = param.storage.join(',');
            }
            else
            {
                param.storage = null;
            }
            if (this.info.packing.length > 0)
            {
                param.packing = param.packing.join(',');
            }
            else
            {
                param.packing = null;
            }
            param.payMode = param.payMode.join(',');
            param.invoiceType = param.invoiceType.join(',');
            param.taxRate = param.taxRate.join(',');
            param.accountPeriod = param.accountPeriod.join(',');
            param.deposit = param.deposit.join(',');
            param.type = 1;//客户的
            if (this.$route.query.type == 6){ param.id = null; }//复制的
            await this.common.postUrl("contractReviewTF", 'saveContractReviewInfo', param);
            this.$message.success((this.common.isNotBlank(this.$route.query.id) ? (this.$route.query.type == 6? "复制" : "合同评审修改") :"合同评审保存") +"成功！");
            this.saveFlag = true;
            setTimeout(() => {
                that.saveFlag = false;
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

        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        checkbox(items,value){
            this.info[items] = this.info[items].includes(value) ? [value] : [];
        },

        /**
         * 上传图片回调
         * @param flag
         */
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
    },
}
