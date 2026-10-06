import myFileModel from '@/components/myFileModel/myFileModel.vue';
import addSupplier from "@/page/pt/sp/addSupplier.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'updateSupplier',
    mixins: [addSupplier],
    data()
    {
        return {
            enumData: enumData,
            supplier: {
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
                accountPeriod: '',
                taxRate: '',
                loadTaxRate: '',
                remark: '',
                businessLicenseImg: '',
                businessLicenseImgPath: '',
                settleBody:'',
                isStorehouseSupplier:'0',
            },
            type:this.$route.query.type,
            disabled:false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.$nextTick(() => this.loadSupplier());
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
        loadSupplier()
        {
            let that = this;
            this.common.postUrl("supplierTF", 'getSupplierDetailInfo', {tenantId: this.$route.query.supplierId}, function (data) {
                if(data){
                    that.supplier = data;
                    that.supplier.supplierType = that.supplier.supplierType+'';
                    if (that.common.isNotBlank(that.supplier.mainBusiness))
                        that.supplier.mainBusiness = that.supplier.mainBusiness+'';
                    else
                        that.supplier.mainBusiness = '';
                    if(that.supplier.supplierType=='-1'){
                        that.supplier.supplierType='';
                    }
                    if(that.supplier.supplierType== enumData.SUPPLIER_TYPE.individual) {
                        that.linkmanDisabled = true;
                        that.supplier.linkman = that.supplier.supplierName;
                        that.supplier.credentialNumberTitle = '身份证号';
                    }else{
                        that.supplier.credentialNumberTitle = '纳税人识别号';
                    }
                    that.supplier.invoiceFlg = that.supplier.invoiceFlg+'';
                    if(that.supplier.invoiceFlg=='-1'){
                        that.supplier.invoiceFlg='';
                    }
                    if(that.supplier.businessLicenseImg){
                        that.$refs.businessLicense.initDate(that.supplier.businessLicenseImg);
                    }
                    if(that.supplier.settleBody){
                        that.supplier.settleBody = that.supplier.settleBody+'';
                    }
                    if (that.supplier.serviceAreas)
                    {
                        let serviceAreas = that.supplier.serviceAreas;
                        that.supplier.serviceAreas = [];
                        let arr = serviceAreas.split(",");
                        for (let i = 0; i < arr.length; i++)
                        {
                            that.supplier.serviceAreas.push(arr[i]);
                        }
                    }
                    if (that.supplier.workIds)
                    {
                        let workIds = that.supplier.workIds;
                        that.supplier.workIds = [];
                        let arr = workIds.split(",");
                        for (let i = 0; i < arr.length; i++)
                        {
                            that.supplier.workIds.push(parseInt(arr[i]));
                        }
                    }
                    that.supplier.isStorehouseSupplier = that.supplier.isStorehouseSupplier+'';
                }
                that.$forceUpdate();
            });
            this.disabled = this.type==2;
            this.$forceUpdate();
        },

        /**
         * 审核
         * @param type 1通过  2不通过
         * @returns {Promise<boolean>}
         */
        async verifySupplier(type) {
            if(this.supplier.verifyState!=0){
                this.$message.error("只有未审核的数据才可以审核！");
                return false;
            }
            this.supplier.type = type;
            this.$prompt('您正在操作供应商审核，请输入审核意见，并确认是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                if (this.common.isBlank(value)&&type===2)
                {
                    this.$message.error("请输入审核意见！");
                    return false;
                }
                this.supplier.verifyRemark = value;
                await this.verifyById();
            }).catch(() => {});
        },
        async verifyById(){
            let that = this;
            await this.common.postUrl("supplierTF", "verifySupplier", this.supplier, function (data)
            {
                that.$message.success("审核成功！");
                that.close();
            }, null, '', true);
        },
    },
}
