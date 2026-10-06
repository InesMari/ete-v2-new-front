import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'saveStorehouseFee',
    data() {
        return {
            info: {
                payCycle:'1',
                billingMethod:'1',
                feeType:'1',
                details:[],
            },
            workData:[],
            contractData:[],
            allSupplierData:[],
            payCycleData:[],
            feeTypeData:[],
            billingMethodData:[],
            disabled:false,
            totalFeeDisabled:false,
            type:this.$route.query.type,// 1 新增  2修改  3查看 4审核
            hisId:-1,   //版本号，最新版本是-1
            currentHisId:-1,
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
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        async init() {
            // 仓库
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.allSupplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STOREHOUSE_FEE_TYPE"});
            this.payCycleData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_CYCLE"});
            this.billingMethodData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BILLING_METHOD"});
            if(this.type==3||this.type==4){
                this.disabled=true;
            }
            if(this.$route.query.id){
                this.getInfo(this.$route.query.id)
            }
        },
        async getInfo(id, hisId) {
            this.info = await this.common.postUrl("wmsStorehouseTF", "getStorehouseFee", {id, hisId});
            this.initContractData(this.info.workId);
            this.info.billingDate = [this.info.billingStartDate, this.info.billingEndDate];
            this.info.payCycle = this.info.payCycle + "";
            this.info.feeType = this.info.feeType + "";
            this.totalFeeDisabled=false;
            if(this.info.billingMethod==2||this.info.billingMethod==4){
                this.info.totalFeeNoTax="";
                this.info.totalFee="";
                this.totalFeeDisabled=true;
            }
            this.info.billingMethod = this.info.billingMethod + "";
            this.info.details.forEach(item=>{
                if(item.billingStartDate){
                    item.billingStartDate=item.billingStartDate.substr(0,10);
                }
                if(item.billingEndDate){
                    item.billingEndDate=item.billingEndDate.substr(0,10);
                }
            });
            this.forceUpdate();
        },
        async changeWork() {
            this.contractData = [];
            if (this.info.workId) {
                let that  = this
                let orgId = '';
                for (let i = 0; i < this.workData.length; i++) {
                    if(that.workData[i].workId == this.info.workId){
                        orgId = that.workData[i].orgId;
                    }
                }
                await this.initContractData(this.info.workId,orgId);
            }
            this.forceUpdate();
        },
        async initContractData(workId,orgId) {
            this.contractData = await this.common.postUrl("contractService", "queryStorageEquipmentContractList", {workId,orgId,isLoadAll:1});
        },
        async changeContract() {
            if(this.common.isBlank(this.info.contractId)){
                this.info.supplierTenantId = null;
                this.info.leaseStartDate='';
                this.info.leaseEndDate='';
                this.info.leaseMonth='';
            }else {
                this.contractData.forEach(item => {
                    if (this.info.contractId == item.id) {
                        this.info.supplierTenantId = item.tenantId;
                        this.info.leaseStartDate=item.beginDate.substring(0,10);
                        this.info.leaseEndDate=item.endDate.substring(0,10);
                        this.info.leaseMonth=this.getBetweenMonth(item.beginDate,item.endDate)+"个月";
                    }
                });
            }
            this.forceUpdate();
        },
        calFee(){
            if(this.info.billingMethod==1||this.info.billingMethod==3){
                let leaseFeeNoTax = this.common.accMul(this.info.storehouseArea,this.info.leaseFeePriceNoTax).myToFixed(2);
                let manageFeeNoTax = this.common.accMul(this.info.storehouseArea,this.info.manageFeePriceNoTax).myToFixed(2);
                let fee = this.common.accAdd(leaseFeeNoTax,manageFeeNoTax);
                this.info.totalFeeNoTax=this.common.accAdd(fee,this.info.otherFeeNoTax).myToFixed(2);

                let leaseFee = this.common.accMul(this.info.storehouseArea,this.info.leaseFeePrice).myToFixed(2);
                let manageFee = this.common.accMul(this.info.storehouseArea,this.info.manageFeePrice).myToFixed(2);
                fee = this.common.accAdd(leaseFee,manageFee);
                this.info.totalFee=this.common.accAdd(fee,this.info.otherFee).myToFixed(2);
            }
            this.calFeeList();
            this.forceUpdate();
        },
        async calFeeList() {
            if(this.common.isNotBlank(this.info.billingDate) && this.info.billingDate.length === 2){
                this.info.billingStartDate = this.info.billingDate[0];
                this.info.billingEndDate = this.info.billingDate[1];
            }else{
                return;
            }
            this.info.details = await this.common.postUrl("wmsStorehouseTF", "autoGenerateStorehouseFeeDetails", this.info);
            this.$forceUpdate();
        },
        changeBillingMethod(){
            this.totalFeeDisabled=false;
            if(this.info.billingMethod==2||this.info.billingMethod==4){
                this.info.totalFeeNoTax="";
                this.info.totalFee="";
                this.totalFeeDisabled=true;
            }
            this.calFee();
            this.forceUpdate();
        },
        getBetweenMonth(startDate, endDate){
            let date1 = new Date(startDate);
            let date2 = new Date(endDate);
            let betweenYear = date2.getFullYear()-date1.getFullYear();
            return betweenYear*12 + (date2.getMonth()-date1.getMonth())+1;
        },
        //  切换历史版本
        changeHisVer(hisId){
            this.hisId = hisId;
            this.currentHisId = hisId;
            // 重新查询
            this.getInfo(this.$route.query.id, hisId);
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        saveStorehouseFee(){
            let that  = this;
            if(this.type==1){
                this.info.id = '';
                this.info.details.forEach(item => {item.id=''});
            }
            if(this.common.isNotBlank(this.info.billingDate) && this.info.billingDate.length === 2){
                this.info.billingStartDate = this.info.billingDate[0];
                this.info.billingEndDate = this.info.billingDate[1];
            }else{
                this.info.billingStartDate = '';
                this.info.billingEndDate = '';
            }
            that.common.postUrl("wmsStorehouseTF", "saveStorehouseFee", this.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.close();
                    that.$message.success("保存成功！");
                }
            },null,'',true);
        },

        verify(){
            let param = {
                id:this.info.id
            };
            let that = this;
            this.$prompt("你将审核费用编号："+this.info.workFeeExtNum+"，审核后部分数据将不允许修改，是否继续？", "提示",{
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
                        await this.common.postUrl("wmsStorehouseTF", "verifyStorehouseFee", param);
                        this.$message.success("操作成功！")
                    }
                    else if (action === 'cancel')
                    {
                        param.verifyState = 2;
                        await this.common.postUrl("wmsStorehouseTF", "verifyStorehouseFee", param);
                        this.$message.success("操作成功！")
                    }
                    that.close();
                    done();
                }
            });
        },
        open(){
            console.log(this.info)
          let title = "查看供应商-仓储运作合同";
          this.$emit('openTab', {
            urlName: title,
            urlId: 'contractDetail'+new Date().getTime(),
            urlPathName: "/contractDetail",
            urlPath: "/pt/cm/contract/contractDetail.vue",
            query: {type:3,contractType:3,id:this.info.contractId},
          });
        },
        /**
         * 关闭新增客户
         */
        close(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
