import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";

export default {
    name: 'addSupplier',
    data()
    {
        return {
            supplierTypeData: [],//供应商类型
            invoiceFlgData: [],//是否开票
            mainBusinessData: [],//主营业务
            supplier: {},//供应商
            uploadOpen: false,//上传
            linkmanDisabled: false,//联系人是否禁用
            enumData: enumData,
            serviceAreasData: [],//
            settleBodyData:[],
            whetherOptions:[],//是否
            workList:[],
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();
        if (this.common.isBlank(this.$route.query.supplierId))
            this.initSupplier();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        tableCommon,
        myImport,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化供应商
         */
        initSupplier()
        {
            this.supplier = {
                supplierName: '',
                address: '',
                supplierType: '',
                mainBusiness: '',
                credentialNumberTitle: '纳税人识别号',
                credentialNumber: '',
                invoiceFlg: '',
                linkman: '',
                linkPhone: '',
                email:'',
                accountPeriod: '30',
                taxRate: '9',
                loadTaxRate: '6',
                remark: '',
                businessLicenseImg: '',
                businessLicenseImgPath: '',
                settleBody:'',
                isStorehouseSupplier:'0',
            }
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            this.supplierTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SUPPLIER_TYPE"});
            this.invoiceFlgData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICE_FLG"});
            this.mainBusinessData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "MAIN_BUSINESS"});
            this.serviceAreasData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SERVICE_AREAS"});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            this.whetherOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            // 仓库
            this.workList = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        /**
         * 关闭新增客户弹出框
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /**
         * 新增供应商
         * @returns {boolean}
         */
        addSupplier()
        {
            if (!this.supplier.supplierName)
            {
                this.$message.error("供应商名称不能为空");
                return false;
            }
            if (this.supplier.supplierName.length < 2)
            {
                this.$message.error("供应商名称至少两个字");
                return false;
            }
            if (this.common.checkNum(this.supplier.supplierName))
            {
                this.$message.error("供应商名称不能全部为数字");
                return false;
            }
            if(!this.supplier.abbreviationName){
                this.$message.error("供应商简称不能为空");
                return;
            }
            if (!this.supplier.linkman)
            {
                this.$message.error("供应商联系人(管理员)不能为空");
                return false;
            }
            if (this.supplier.linkman.length < 2)
            {
                this.$message.error("供应商联系人(管理员)至少两个字");
                return false;
            }
            if (this.common.checkNum(this.supplier.linkman))
            {
                this.$message.error("供应商联系人(管理员)不能全部为数字");
                return false;
            }
            // if (!this.supplier.linkPhone)
            // {
            //     this.$message.error("登录手机号不能为空");
            //     return false;
            // }
            // if (this.supplier.linkPhone.length != 11)
            // {
            //     this.$message.error("登录手机号格式不对(长度不为11)！");
            //     return false;
            // }
            if (!this.supplier.invoiceFlg)
            {
                this.$message.error("是否开票不能为空");
                return false;
            }
            if (!this.supplier.mainBusiness)
            {
                this.$message.error("主营业务不能为空");
                return false;
            }
            if (this.common.isBlank(this.supplier.serviceAreas) || this.supplier.serviceAreas.length == 0)
            {
                this.$message.error("可服务区域不能为空！");
                return false;
            }
            if (this.supplier.accountPeriod && this.supplier.accountPeriod > 365)
            {
                this.$message.error("账期不能超过365天");
                return false;
            }
            if (!this.supplier.credentialNumber)
            {
                this.$message.error(this.supplier.credentialNumberTitle + "不能为空");
                return false;
            }
            if (this.common.isBlank(this.supplier.supplierType))
            {
                this.$message.error("供应商类型不能为空");
                return false;
            }
            let that = this;
            let method = 'addSupplierInfo';
            if(this.supplier.tenantId){
                method = 'updateSupplierInfo';
            }
            if (!this.supplier.isStorehouseSupplier)
            {
                this.$message.error("是否仓储供应商不能为空");
                return false;
            }
            this.supplier.businessLicenseImg = this.$refs.businessLicense.getImageData().flowId;
            this.supplier.businessLicenseImgPath = this.$refs.businessLicense.getImageData().storePath;
            this.common.postUrl("supplierTF", method, this.supplier, function (data)
            {
                that.$message.success(that.common.isBlank(that.$route.query.supplierId) ? "新增成功！" : "修改成功！");
                that.close();
            }, null, '', true);
        },
        /**
         * 上传回调
         * @param imgData
         */
        successCallback(imgData)
        {
            let that = this;
            this.common.postUrl("supplierTF", 'getBusinessLicenseInfo', {fileId: imgData.storePath}, function (data)
            {
                if (data)
                {
                    if (!that.supplier.supplierName)
                        that.supplier.supplierName = data.companyName;
                    if (!that.supplier.linkman)
                        that.supplier.linkman = data.artificialPerson;
                    if (!that.supplier.address)
                        that.supplier.address = data.companyAddress;
                    if(!that.supplier.credentialNumber){
                        that.supplier.credentialNumber = data.credit;
                    }
                }
            });
        },
        /**
         * 校验手机号码
         */
        checkBillId()
        {
            if (this.common.isBlank(this.supplier.linkPhone))
                return;
            let that = this;
            this.common.postUrl("userTF", "getUserName", {billId: that.supplier.linkPhone}, function (data)
            {
                if (data.userName){
                    that.$message.warning("手机号码：" + that.supplier.linkPhone + "对应的用户已经存在，名称为：" + data.userName + "，请确认是否添加他为管理员");
                    that.linkmanDisabled = true;
                }
            });
        },
        /**
         * 更新供应商类型
         */
        supplierTypeChange()
        {
            if (this.supplier.supplierType == enumData.SUPPLIER_TYPE.individual)
            {
                this.linkmanDisabled = true;
                this.supplier.linkman = this.supplier.supplierName;
                this.supplier.credentialNumberTitle = '身份证号';
            }
            else
            {
                this.linkmanDisabled = false;
                this.supplier.credentialNumberTitle = '纳税人识别号';
            }
        },
        /**
         * 更新供应商联系人
         */
        supplierNameChange()
        {
            this.supplier.linkman = this.supplier.supplierName;
            this.$forceUpdate();
        },
    },
}
