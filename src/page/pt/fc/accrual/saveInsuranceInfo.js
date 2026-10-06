import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
    name: 'saveInsuranceInfo',
    data() {
        return {
            info: {
                //基础信息
                id:'',
                insuranceNum:'',
                reviewContractId:'',
                contractId:'',
                contractContentName:'',
                tenantId:'',
                tenantName:'',
                beginDate:'',
                endDate:'',
                billingStartDate:'',
                billingEndDate:'',
                insuranceRemark:'',
                feeDetails:[{}],
            },
            contractData:[],
            orgData:[],
            settleBodyData:[],
            totalInfo:{},
            type:this.$route.query.type,// 1 新增  2修改  3查看 4审核
            disabled:false,
        }
    },
    computed:{
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
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        async init() {
            this.contractData = await this.common.postUrl("contractService", "queryInsuranceContractList", {});
            this.orgData = await this.common.postUrl("regionOrgTF", "queryOrgDataList", {});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            if(this.type==3||this.type==4){
                this.disabled=true;
            }
            if(this.$route.query.id){
                await this.getInfo(this.$route.query.id);
            }
        },
        changeContract(){
            let that = this;
            if(this.common.isBlank(that.info.contractId)){
                that.info.reviewContractId = '';
                that.info.contractContentName = '';
                that.info.tenantId = '';
                that.info.tenantName = '';
                that.info.beginDate = '';
                that.info.endDate = '';
            }else {
                this.contractData.forEach(el=>{
                    if(that.info.contractId==el.contractId){
                        that.info.reviewContractId = el.reviewContractId;
                        that.info.contractContentName = el.contractContentName;
                        that.info.tenantId = el.tenantId;
                        that.info.tenantName = el.tenantName;
                        that.info.beginDate = el.beginDate.substring(0,10);
                        that.info.endDate = el.endDate.substring(0,10);
                    }
                });
            }
            this.forceUpdate();
        },
        calBillingMonths(){
            this.info.billingMonths = '';
            if(this.common.isNotBlank(this.info.billingStartDate)&&this.common.isNotBlank(this.info.billingEndDate)){
                //初始化年月日数值
                var startYear= Number.parseInt(this.info.billingStartDate.substring(0,4));
                var endYear= Number.parseInt(this.info.billingEndDate.substring(0,4));
                var startMonth= Number.parseInt(this.info.billingStartDate.substring(5,7));
                var endMonth= Number.parseInt(this.info.billingEndDate.substring(5,7));
                let billingMonths = (endYear-startYear)*12+(endMonth-startMonth)+1;
                if(billingMonths<=0){
                    this.$message.error("计费结束月份必须大于等于计费开始月份");
                    return;
                }
                this.info.billingMonths = billingMonths;
            }
            this.forceUpdate();
        },
        addFee(){
            this.info.feeDetails.push({});
        },
        delFee(idx){
            this.info.feeDetails.splice(idx, 1);
            this.calTotalInfoFee(false);
            this.$forceUpdate();
        },
        calFee(item){
            if(item.totalFeeWithTax&&item.taxRate){
                let totalFee = this.common.accMul(item.totalFeeWithTax,100);
                let taxRate = this.common.accAdd(item.taxRate,100);
                item.totalFee = this.common.accDiv(totalFee,taxRate).myToFixed(2);
                item.totalTax = this.common.accSub(item.totalFeeWithTax,item.totalFee);
                item.monthFeeWithTax = this.common.accDiv(item.totalFeeWithTax,this.info.billingMonths).myToFixed(2);
                item.monthFee = this.common.accDiv(item.totalFee,this.info.billingMonths).myToFixed(2);

                this.calTotalInfoFee(false);
                this.forceUpdate();
            }
        },
        calTotalInfoFee(initFlag){
            this.totalInfo = {
                totalFeeWithTax:'',
                taxRate:'',
                totalFee:'',
                totalTax:'',
                monthFeeWithTax:'',
                monthFee:'',

            };
            if(this.info.feeDetails.length>0){
                let totalFee = 0;
                let totalTax = 0;
                let monthFeeWithTax = 0;
                let monthFee = 0;

                for (let i = 0; i < this.info.feeDetails.length; i++) {
                    let item = this.info.feeDetails[i];
                    this.totalInfo.totalFeeWithTax = this.common.accAdd(item.totalFeeWithTax,this.totalInfo.totalFeeWithTax);
                    totalFee = this.common.accAdd(item.totalFee,totalFee);
                    totalTax = this.common.accAdd(item.totalTax,totalTax);
                    monthFeeWithTax = this.common.accAdd(item.monthFeeWithTax,monthFeeWithTax);
                    monthFee = this.common.accAdd(item.monthFee,monthFee);
                }
                this.totalInfo.taxRate = this.info.feeDetails[0].taxRate;
                if(this.totalInfo.taxRate){
                    let totalFee = this.common.accMul(this.totalInfo.totalFeeWithTax,100);
                    let taxRate = this.common.accAdd(this.totalInfo.taxRate,100);

                    this.totalInfo.totalFee = this.common.accDiv(totalFee,taxRate).myToFixed(2);
                    this.totalInfo.totalTax = this.common.accSub(this.totalInfo.totalFeeWithTax,this.totalInfo.totalFee);
                    this.totalInfo.monthFeeWithTax = this.common.accDiv(this.totalInfo.totalFeeWithTax,this.info.billingMonths).myToFixed(2);
                    this.totalInfo.monthFee = this.common.accDiv(this.totalInfo.totalFee,this.info.billingMonths).myToFixed(2);
                }

                if(!initFlag){
                    this.addRemainder(this.info.feeDetails[this.info.feeDetails.length-1],this.totalInfo, 'totalFee',totalFee);
                    this.addRemainder(this.info.feeDetails[this.info.feeDetails.length-1],this.totalInfo, 'totalTax',totalTax);
                    this.addRemainder(this.info.feeDetails[this.info.feeDetails.length-1],this.totalInfo, 'monthFeeWithTax',monthFeeWithTax);
                    this.addRemainder(this.info.feeDetails[this.info.feeDetails.length-1],this.totalInfo, 'monthFee',monthFee);
                }
                this.forceUpdate();
            }

        },
        addRemainder(item,total,field,totalFee){
            let itemTotalFee = item[field];
            let remainTotalFee = this.common.accSub(total[field],totalFee);
            item[field] = this.common.accAdd(itemTotalFee,remainTotalFee);
            this.forceUpdate();
        },
        changeOrg(item){
            this.orgData.forEach(el=>{
                if(item.insuranceOrgId==el.id){
                    item.insuranceAddress = el.workAddress;
                }
            });
            this.forceUpdate();
        },
        async getInfo(id) {
            this.info = await this.common.postUrl("fcInsuranceTF", "getInsuranceInfo", {id});
            for (let i = 0; i < this.info.feeDetails.length; i++) {
                this.info.feeDetails[i].settleBody = this.info.feeDetails[i].settleBody+'';
            }
            this.calTotalInfoFee(true);
            this.forceUpdate();
        },

        forceUpdate() {
            this.$forceUpdate();
        },
        saveInsuranceInfo(){
            let that  = this;
            that.common.postUrl("fcInsuranceTF", "saveInsuranceInfo", this.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.close();
                    that.$message.success("保存成功！");
                }
            },null,'',true);
        },

        verify(){
            let param = {
                id:this.info.id,
                contractNum:this.info.contractNum,
            };
            let that = this;
            this.$prompt("你将审核保险费用编号："+this.info.insuranceNum+"，是否继续？", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核意见',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.verifyState = 1;
                        await this.common.postUrl("fcInsuranceTF", "verifyInsuranceInfo", param);
                        this.$message.success("操作成功！")
                        that.close();
                    }
                    else if (action === 'cancel')
                    {
                        param.verifyState = 2;
                        await this.common.postUrl("fcInsuranceTF", "verifyInsuranceInfo", param);
                        this.$message.success("操作成功！")
                        that.close();
                    }
                    done();
                }
            });
        },
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
