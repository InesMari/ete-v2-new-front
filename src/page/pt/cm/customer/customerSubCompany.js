import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'customerSubCompany',
    data()
    {
        return {
            head: [
                {"name": "公司名称", "code": "name", "width": "150", "type": "text"},
                {"name": "所属区域", "code": "regionIdsName", "width": "120", "type": "text"},
                // {"name": "所属部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "是否启用", "code": "stsName", "width": "50", "type": "text"},
                {"name": "客户联系人", "code": "adminUser", "width": "80", "type": "text"},
                {"name": "登录账号", "code": "linkPhone", "width": "80", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "80", "type": "text"},
                {"name": "附件", "code": "", "width": "120", "type": "diy"}
            ],
            query:{
                custName: '',
                sts:'',
                parentId:'',
            },
            showCommitButton: true,
            showAddCustomer: false,
            srcList: [],
            dialogTitle:'',
            customer:{
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                regionIds:'',
                // orgId:'',
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
            },
            invoiceTypeData:[],
            logisticsModeData:[],
            belongingIndustryData:[],
            stsData:[],
            regionData:[],//所有区域数据
            orgData:[],//所有部门数据
            staffData:[],//平台所有员工的信息
            regionOrgData:[],//选择区域对应的部门数据
            orgStaffData:[],//选择组织对应的员工
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.query.parentId = this.$route.query.parentId;
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel,
        fileViewer,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         *
         */
        doQuery()
        {
            this.$refs.table.load("customerTF", "queryCustomerList", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STS"}, function (data) {
                that.stsData = data;
                // that.stsData.unshift({codeValue:'',codeName:''});
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"INVOICE_TYPE"}, function (data) {
                that.invoiceTypeData = data;
                // that.invoiceTypeData.unshift({codeValue:'',codeName:''});
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"LOGISTICS_MODE"}, function (data) {
                that.logisticsModeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BELONGING_INDUSTRY"}, function (data) {
                that.belongingIndustryData = data;
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
            });
            //加载所有的人员
            this.common.postUrl("regionOrgTF", "getStaffInfoList", {}, function (data) {
                that.staffData = data;
                that.orgStaffData = data;
            });
        },
        regionChange(val){
            this.regionOrgData=[];
            // this.customer.orgId = '';
            this.customer.custManage = '';
            for (let i = 0; i < this.orgData.length; i++) {
                if(this.orgData[i].regionId == val){
                    this.regionOrgData.push(this.orgData[i]);
                }
            }
        },
        orgChange(val){
            this.orgStaffData=[];
            this.customer.custManage = '';
            for (let i = 0; i < this.staffData.length; i++) {
                if(this.staffData[i].orgId == val){
                    this.orgStaffData.push(this.staffData[i]);
                }
            }
        },
        /**
         * 显示营业资料
         * @param data
         */
        showBusinessLicense(data){
            if(!data.businessLicenseImgUrl){
                this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(data.businessLicenseImgUrl);
            this.$refs.viewer.show();

        },
        /**
         * 显示开票资料
         * @param data
         */
        showInvoiceInfo(data){
            if(!data.invoiceInfoImgUrl){
                this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(data.invoiceInfoImgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 清空
         */
        clear(){
            this.query.custName='';
            this.query.sts='';
        },
        /**
         * 显示新增客户弹出框
         * type 1 新增  2 查看  3 修改
         */
        displayAddCustomer(type){
            this.customer={
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                regionIds:'',
                // orgId:'',
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
            };
            this.showCommitButton = true;
            this.dialogTitle = '新增子公司';
            if(type==2||type==3){
                this.dialogTitle = '查看子公司';
                let array = this.$refs.table.getSelectItem();
                if (array.length !== 1) {
                    this.$message.error("请选择一条子公司信息");
                    return false;
                }
                let tenantId = array[0].tenantId;
                let that = this;
                this.common.postUrl("customerTF", 'getCustomerDetailInfo', {tenantId,parentId:this.query.parentId}, function (data) {
                    if(data){
                        //触发部门以及人员联动
                        // that.regionChange(data.regionId);
                        // that.orgChange(data.orgId);
                        that.customer = data;
                        that.customer.regionIds = data.regionIds.split(',');
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
                    }
                });
                if(type==3){
                    this.dialogTitle = '修改子公司';
                }else{
                    this.showCommitButton = false;
                }
            }
            this.showAddCustomer = true;
        },
        /**
         * 关闭新增客户弹出框
         */
        closeAddCustomer(){
            this.showAddCustomer = false;
            this.$refs.businessLicense.clean();
            this.$refs.invoiceInfo.clean();
        },
        updateCustomerState(state){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length == 0) {
                this.$message.error("请至少选择一条子公司信息");
                return false;
            }
            let tenantIds = '';
            let names = '';
            for (let i = 0; i < array.length; i++) {
                tenantIds+=','+array[i].tenantId;
                names+=','+array[i].name;
                if(array[i].sts==state){
                    this.$message.error("子公司状态不对");
                    return false;
                }
            }

            tenantIds = tenantIds.substr(1);
            names = names.substr(1);
            let info = '';
            if(state==0){
                info = '禁用';
            }else if(state==1){
                info = '启用';
            }
            this.common.postUrl("customerTF", 'updateCustomerState', {tenantIds,names,state,parentId:this.query.parentId}, function (data) {
                if(data){
                    that.doQuery();
                    that.$msgbox(info+"成功！");
                }
            },null,'',true);
        },
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
            if(this.common.checkNum(this.customer.linkman)){
                this.$message.error("客户联系人不能全部为数字");
                return;
            }
            // if(!this.customer.linkPhone){
            //     this.$message.error("手机号码不能为空");
            //     return;
            // }
            // if(this.customer.linkPhone.length!=11){
            //     this.$message.error("联系电话格式不对！");
            //     return;
            // }
            if(!this.customer.regionIds){
                this.$message.error("所属区域不能为空");
                return;
            }
            // this.customer.regionIds = [this.customer.regionIds];
            // if(!this.customer.orgId){
            //     this.$message.error("所属部门不能为空");
            //     return;
            // }
            if(!this.customer.logisticsMode){
                this.$message.error("物流模式不能为空");
                return;
            }
            if(!this.customer.belongingIndustry){
                this.$message.error("所属行业不能为空");
                return;
            }
            if(this.customer.accountPeriod&&this.customer.accountPeriod>365){
                this.$message.error("账期不能超过365天");
                return;
            }
            let that = this;
            let method = 'addCustomerInfo';
            if(this.customer.tenantId){
                method = 'updateCustomerInfo';
            }
            this.customer.parentId = this.query.parentId;
            this.customer.businessLicenseImg = this.$refs.businessLicense.getImageData().flowId;
            this.customer.businessLicenseImgPath = this.$refs.businessLicense.getImageData().storePath;
            this.customer.invoiceInfoImg = this.$refs.invoiceInfo.getImageData().flowId;
            this.customer.invoiceInfoImgPath = this.$refs.invoiceInfo.getImageData().storePath;
            this.common.postUrl("customerTF", method, this.customer, function (data) {
                if(data){
                    that.showAddCustomer = false;
                    that.doQuery();
                    that.$msgbox(that.dialogTitle + "成功！");
                }
            },null,'',true);
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
    },
}
