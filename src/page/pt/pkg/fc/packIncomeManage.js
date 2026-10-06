import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'packIncomeManage',
    data() {
        return {
            head: [
                {"name": "客户名称", "code": "custName", "width": "250", "type": "text"},
                {"name": "费用日期", "code": "billDate", "width": "90", "type": "text"},
                {"name": "费用类型", "code": "feeTypeName", "width": "90", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "200", "type": "text"},
                {"name": "包装数量", "code": "chargeNums", "width": "80", "type": "text"},
                {"name": "单价", "code": "price", "width": "80", "type": "text"},
                {"name": "含税价", "code": "totalFeeWithTax", "width": "120", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "80", "type": "text"},
                {"name": "不含税价", "code": "totalFee", "width": "120", "type": "text"},
                {"name": "是否入账", "code": "billFlag", "width": "80", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "text"},
            ],
            loadParam: {
                custName:this.$route.query.tenantName,//客户详情订单包管理跳转
                billDate:this.common.isBlank(this.$route.query.startDate) ? '' :[this.$route.query.startDate,this.$route.query.endDate],
            },
            whetherData:[],
            feeTypeData: [],
            custTenantData:[],
            dialogShow:false,
            feeInfo:{
                taxRate:0,
                taxRateStr:'0%'
            },
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(loadParam = this.loadParam) {
            this.loadParam = loadParam;
            if(this.common.isNotBlank(this.loadParam.billDate) && this.loadParam.billDate.length === 2){
                this.loadParam.startBillDate = this.loadParam.billDate[0];
                this.loadParam.endBillDate = this.loadParam.billDate[1];
            }else{
                this.loadParam.startBillDate = '';
                this.loadParam.endBillDate = '';
            }
            this.$refs.table.load("pkgFeeTF", "queryPackIncomePage", this.loadParam);
        },
        init() {
            this.initStaticData();
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'PACK_FEE_TYPE'},function (data) {
                that.feeTypeData = data;
            });
            //是否
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WHETHER"}, function (data) {
                that.whetherData = data;
            });
            this.initCustTenantData();
        },
        initCustTenantData(){
            let that = this;
            this.common.postUrl("pkgFeeTF", "getPackContractCust", {}, function (data) {
                that.custTenantData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        downloadExcel(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条收入数据！");
                return false;
            }

            let fileName = selectData[0].custName+'_'+selectData[0].billDate+'_'+selectData[0].packName+'_'+selectData[0].feeTypeName;
            let param = selectData[0];
            param.selfCreateUrl = 'pkgFeeTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'packIncomeManageTable');
        },
        addFeeInfo(){
            if (!this.feeInfo.custTenantId){
                this.$message.error("请选择客户！");
                return false;
            }
            if (!this.feeInfo.feeType){
                this.$message.error("请选择费用类型！");
                return false;
            }
            if (!this.feeInfo.totalFeeWithTax){
                this.$message.error("请输入含税价！");
                return false;
            }
            if (!this.feeInfo.billDate){
                this.$message.error("请选择费用日期！");
                return false;
            }
            let that = this;
            that.feeInfo.custName = this.custTenantData.find(item=>item.custTenantId==that.feeInfo.custTenantId).custName;
            this.common.postUrl("pkgFeeTF", "addPackIncome", this.feeInfo, function (data) {
                that.doQuery();
                that.$message.success("新增成功！");
                that.showDialog(false);
            },null,'',true);

        },
        changeCustTenant(){
            if(!this.feeInfo.custTenantId){
                this.feeInfo.contractId = '';
                this.feeInfo.taxRate = 0;
                this.feeInfo.taxRateStr = '0%';
            }
            for (let i = 0; i < this.custTenantData.length; i++) {
                if(this.feeInfo.custTenantId==this.custTenantData[i].custTenantId){
                    this.feeInfo.contractId = this.custTenantData[i].contractId;
                    if(this.custTenantData[i].taxRate){
                        this.feeInfo.taxRate = this.custTenantData[i].taxRate;
                        this.feeInfo.taxRateStr = this.custTenantData[i].taxRate+'%';
                    }
                }
            }
            this.$forceUpdate();
        },
        changeFee(){
            let totalFeeWithTax = this.common.accMul(this.feeInfo.totalFeeWithTax,100);
            let taxRate = this.common.accAdd(this.feeInfo.taxRate,100);
            let totalFee = this.common.accDiv(totalFeeWithTax,taxRate);
            this.feeInfo.totalFee = totalFee.toFixed(2);
            this.$forceUpdate();
        },
        showDialog(flag){
            this.feeInfo={};
            this.dialogShow = flag;
        },
    },
    computed: {
        formData() {
            return [
                {"name":"客户名称","model":"custName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"包装名称","model":"packName","type":"input","placeholder":"包装名称","isshow":true},
                {"name":"费用类型","model":"feeType","type":"select","options":this.feeTypeData,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
                {"name":"是否入账","model":"billFlag","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
                {"name":"费用日期","model":"billDate","type":"daterange","isshow":true},
            ]
        }
    },
}
