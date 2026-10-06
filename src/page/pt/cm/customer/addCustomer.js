import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'addCustomer',
    data() {
        return {
            customer:{
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                regionIds:'',
                orgIds:'',
                custManage:'',
                logisticsMode:'',
                belongingIndustry:'',
                invoiceType:'',
                taxNumber:'',
                regAddress:'',
                regPhone:'',
                regBank:'',
                accountName:'',
                regAccount:'',
                accountPeriod:'',
                businessLicenseImg:'',
                businessLicenseImgPath:'',
                invoiceInfoImg:'',
                invoiceInfoImgPath:'',
                taxRate:'9',
                loadTaxRate:'6',
                isAcct:0,
                commissionRelList:[],
                smsRemindDriverDeliver:false,
            },
            belongingIndustryData:[],//所属行业
            logisticsModeData:[],//物流模式
            invoiceTypeData:[],//发票资质类型
            regionData:[],//所有区域数据
            orgData:[],//所有部门数据
            staffData:[],//平台所有员工的信息
            regionOrgData:[],//选择区域对应的部门数据
            orgStaffData:[],//选择组织对应的员工
            customerData:[],
            custTypeData:[],
            settleBodyData:[],
            isLock: false,
            isUpdate: false,
            commissionModifyFlag:false,
        }
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
    },
    /**
     * 绑定函数
     */
    methods: {
        init() {
            //加载静态枚举
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'INVOICE_TYPE,LOGISTICS_MODE,PAY_TITLE,BELONGING_INDUSTRY,CUST_TYPE'}, function (data) {
                that.invoiceTypeData = data.INVOICE_TYPE;
                that.logisticsModeData = data.LOGISTICS_MODE;
                that.settleBodyData = data.PAY_TITLE;
                that.belongingIndustryData = data.BELONGING_INDUSTRY;
                that.custTypeData = data.CUST_TYPE;
            });
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getRegionInfoList", {}, function (data) {
                that.regionData = data;
                for (let i = 0; i < that.regionData.length; i++) {
                    that.regionData[i].id = that.regionData[i].id+'';
                }
            });
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.orgData = data;
                for (let i = 0; i < that.orgData.length; i++) {
                    let item = that.orgData[i];
                    item.id = item.id+'';
                    if (item.orgName == '运输中心')
                    {
                        //删除运输中心
                        that.orgData.splice(i,1);
                        i--;
                    }
                }
            });
            //加载所有的人员
            this.common.postUrl("regionOrgTF", "getStaffInfoList", {}, function (data) {
                const map = new Map()
                const newArr = []
                data.forEach(item => {
                    if (!map.has(item.userId)) { // has()用于判断map是否包为item的属性值
                        map.set(item.userId, true) // 使用set()将item设置到map中，并设置其属性值为true
                        newArr.push(item)
                    }
                })
                that.staffData = newArr;
                that.orgStaffData =newArr;
            });
            //查询当前所有组织的客户
            that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID,isAll:1}, function (data)
            {
                that.customerData = data;
                if(that.common.isNotBlank(that.$route.query.tenantId)) {
                    let tenantId = that.$route.query.tenantId;
                    that.customerData = that.customerData.filter(item => {
                        return item.tenantId != tenantId
                    });
                }
            });
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                let tenantId = this.$route.query.tenantId;
                this.common.postUrl("customerTF", 'getCustomerDetailInfo', {tenantId}, function (data) {
                    if(data){
                        //触发部门以及人员联动
                        // that.regionChange(data.regionId);
                        // that.orgChange(data.orgId);
                        that.customer = data;
                        if(that.customer.settleBody){
                            that.customer.settleBody = that.customer.settleBody+'';
                        }
                        if(that.common.isNotBlank(data.regionIds)){
                            that.customer.regionIds = data.regionIds.split(',');
                        }
                        if(that.common.isNotBlank(data.orgIds)){
                            that.customer.orgIds = data.orgIds.split(',');
                        }
                        if(that.common.isNotBlank(data.acctCustIds)){
                            that.customer.acctCustIds = data.acctCustIds.split(',');
                        }
                        that.customer.invoiceType = that.customer.invoiceType+'';
                        if(that.customer.invoiceType=='-1'){
                            that.customer.invoiceType='';
                        }
                        that.customer.logisticsMode = that.customer.logisticsMode+'';
                        if(that.customer.logisticsMode=='-1' || that.customer.logisticsMode=="null"){
                            that.customer.logisticsMode='';
                        }
                        that.customer.belongingIndustry = that.customer.belongingIndustry+'';
                        if(that.customer.belongingIndustry=='-1' || that.customer.belongingIndustry=="null"){
                            that.customer.belongingIndustry='';
                        }
                        if(that.customer.businessLicenseImg){
                            that.$refs.businessLicense.initDate(that.customer.businessLicenseImg);
                        }
                        if(that.customer.invoiceInfoImg){
                            that.$refs.invoiceInfo.initDate(that.customer.invoiceInfoImg);
                        }
                        if(that.customer.smsRemindDriverDeliver==1){
                            that.customer.smsRemindDriverDeliver = true;
                        }else{
                            that.customer.smsRemindDriverDeliver = false;
                        }
                        that.customer.commissionRelList.forEach(item => {
                            item.orgId = item.orgId+'';
                            item.custType = item.custType+'';
                        })
                    }
                });
                this.isUpdate = true;
            }
            if(this.common.isNotBlank(this.$route.query.isLock)){
                this.isLock = true;
            }

            let entityIds = localStorage.getItem("entityIds").split(",");
            entityIds.forEach(item => {
                if (item == 1001092) {
                    that.commissionModifyFlag = true;
                }
            });
        },
        orgChange(val){

        },
        successCallback(imgData){
            let that = this;
            this.common.postUrl("supplierTF", 'getBusinessLicenseInfo', {fileId:imgData.storePath}, function (data) {
                if(data){
                    that.$message.success("营业执照识别成功，请仔细核对识别是否有误！");
                    if(!that.customer.custName){
                        that.customer.custName = data.companyName;
                    }
                    if(!that.customer.address){
                        that.customer.address = data.companyAddress;
                    }
                    if(!that.customer.linkman){
                        that.customer.linkman = data.artificialPerson;
                    }
                    if(!that.customer.taxNumber){
                        that.customer.taxNumber = data.credit;
                    }
                    if(!that.customer.regAddress){
                        that.customer.regAddress = data.companyAddress;
                    }
                    if(!that.customer.accountName){
                        that.customer.accountName = data.companyName;
                    }
                }
            });
        },
        checkBillId(){
            let that = this;
            if(this.isAdd){
                this.common.postUrl("userTF", "getUserName", {billId:that.customer.linkPhone}, function (data) {
                    if(data.userName){
                        that.$message.warning("登录账号："+that.customer.linkPhone+"对应的用户已经存在，名称为："+data.userName+"，请确认是否添加他为管理员");
                    }
                });
            }
        },
        /**
         * 关闭新增客户
         */
        closeAddCustomer(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        changeInfoSwitch() {
            this.customer.isAcct = this.customer.isAcct == 1 ? 0 : 1;
            // if(this.customer.isAcct==0){
            //     this.customer.acctCustIds=[];
            // }
            this.$forceUpdate();
        },
        /**
         * 保存客户信息
         */
        addCustomer(){
            if(!this.customer.custName){
                this.$message.error("公司名称不能为空");
                return;
            }
            if(this.customer.custName.length<2){
                this.$message.error("公司名称长度不对");
                return;
            }
            if(this.common.checkNum(this.customer.custName)){
                this.$message.error("公司名称不能全部为数字");
                return;
            }
            if(!this.customer.abbreviationName){
                this.$message.error("公司简称不能为空");
                return;
            }
            if(!this.customer.address){
                this.$message.error("公司地址不能为空");
                return;
            }
            if(this.common.checkNum(this.customer.address)){
                this.$message.error("公司地址不能全部为数字");
                return;
            }
            if(!this.customer.linkman){
                this.$message.error("客户联系人不能为空");
                return;
            }
            if(this.customer.linkman.length<2){
                this.$message.error("客户联系人长度不对");
                return;
            }
            if(this.common.isBlank(this.customer.custManage)){
                this.$message.error("客户代表不能为空");
                return;
            }
            if(!this.customer.logisticsMode){
                this.$message.error("物流模式不能为空");
                return;
            }
            if(!this.customer.belongingIndustry){
                this.$message.error("所属行业不能为空");
                return;
            }
            if(!this.customer.accountPeriod){
                this.$message.error("账期不能为空");
                return;
            }
            if(this.customer.accountPeriod&&this.customer.accountPeriod>365){
                this.$message.error("账期不能超过365天");
                return;
            }
            let that = this;
            let method = 'addCustomerInfo';
            let dialogTitle = '新增客户';
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                method = 'updateCustomerInfo';
                dialogTitle = '修改客户';
            }
            let param = this.common.copyObj(this.customer);
            param.businessLicenseImg = this.$refs.businessLicense.getImageData().flowId;
            param.businessLicenseImgPath = this.$refs.businessLicense.getImageData().storePath;
            param.invoiceInfoImg = this.$refs.invoiceInfo.getImageData().flowId;
            param.invoiceInfoImgPath = this.$refs.invoiceInfo.getImageData().storePath;
            param.smsRemindDriverDeliver = this.customer.smsRemindDriverDeliver?1:0;
            this.common.postUrl("customerTF", method, param, function (data) {
                if(data){
                    that.showAddCustomer = false;
                    that.$message.success(dialogTitle + "成功！");
                    that.closeAddCustomer();
                }
            },null,'',true);
        },

        addItem(){
            this.customer.commissionRelList.push({});
        },
        removeItem(index){
            this.customer.commissionRelList.splice(index,1);
        },
    },
}
