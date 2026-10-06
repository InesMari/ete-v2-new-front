import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'addTemporaryCustomer',
    data() {
        return {
            customer:{
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                remark:'',
            },
            isLock: false,
            isUpdate: false,
            initFlag: false,
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
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'INVOICE_TYPE,CUST_TYPE'}, function (data) {
                that.invoiceTypeData = data.INVOICE_TYPE;
            });
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                let tenantId = this.$route.query.tenantId;
                this.common.postUrl("customerTF", 'getCustomerDetailInfo', {tenantId}, function (data) {
                    if(data){
                        that.customer = data;
                        if(that.customer.businessLicenseImg){
                            that.$refs.businessLicense.initDate(that.customer.businessLicenseImg);
                            that.initFlag = true;
                        }
                    }
                });
                this.isUpdate = true;
            }
            if(this.common.isNotBlank(this.$route.query.isLock)){
                this.isLock = true;
            }
        },
        successCallback(imgData){
            if (this.initFlag)
            {
                this.initFlag = false;//修改初始化不识别
                return;
            }
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
                    // if(!that.customer.taxNumber){
                    //     that.customer.taxNumber = data.credit;
                    // }
                    // if(!that.customer.regAddress){
                    //     that.customer.regAddress = data.companyAddress;
                    // }
                    // if(!that.customer.accountName){
                    //     that.customer.accountName = data.companyName;
                    // }
                }
            });
        },
        checkBillId(){
            let that = this;
            if(this.isAdd){
                this.common.postUrl("userTF", "getUserName", {billId:that.customer.linkPhone}, function (data) {
                    if(data.userName){
                        that.$message.warning("联系电话："+that.customer.linkPhone+"对应的用户已经存在，名称为："+data.userName);
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
        /**
         * 保存客户信息
         */
        addCustomer(){
            if(!this.customer.custName){
                this.$message.error("客户名称不能为空");
                return;
            }
            // if(this.customer.custName.length<2){
            //     this.$message.error("客户名称长度不对");
            //     return;
            // }
            // if(this.common.checkNum(this.customer.custName)){
            //     this.$message.error("客户名称不能全部为数字");
            //     return;
            // }
            if(!this.customer.linkman){
                this.$message.error("客户联系人不能为空");
                return;
            }
            // if(this.customer.linkman.length<2){
            //     this.$message.error("客户联系人长度不对");
            //     return;
            // }
            // if(this.common.checkNum(this.customer.linkman)){
            //     this.$message.error("客户联系人不能全部为数字");
            //     return;
            // }
            if(!this.customer.linkPhone){
                this.$message.error("联系电话不能为空");
                return;
            }
            // if(!this.customer.address){
            //     this.$message.error("客户地址不能为空");
            //     return;
            // }
            // if(this.customer.address.length<2){
            //     this.$message.error("客户地址不能为空");
            //     return;
            // }
            // if(this.common.checkNum(this.customer.address)){
            //     this.$message.error("客户地址不能全部为数字");
            //     return;
            // }
            let that = this;
            let method = 'addCustomerInfo';
            let dialogTitle = '新增客户';
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                method = 'updateCustomerInfo';
                dialogTitle = '修改客户';
            }
            this.customer.isTemporaryCustomer = 1;
            this.customer.businessLicenseImg = this.$refs.businessLicense.getImageData().flowId;
            this.customer.businessLicenseImgPath = this.$refs.businessLicense.getImageData().storePath;
            this.common.postUrl("customerTF", method, this.customer, function (data) {
                if(data){
                    that.$message.success(dialogTitle + "成功！");
                    that.closeAddCustomer();
                }
            },null,'',true);
        },
    },
}
