import myFileModel from '@/components/myFileModel/myFileModel.vue';
import addSupplier from "@/page/pt/sp/addSupplier.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'showSupplier',
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

            }
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
        },
    },
}
