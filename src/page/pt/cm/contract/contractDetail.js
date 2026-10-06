import myFileModel from "@/components/myFileModel/myFileModel.vue";
import contract from "@/page/pt/cm/contract/contract";
import enumData from "@/page/pt/enum";

export default {
    name: 'contractDetail',
    mixins: [contract],
    components: {
        myFileModel
    },
    data()
    {
        return{
            customerData: [],
            id: this.$route.query.id,
            type: this.$route.query.type,
            contractType:this.$route.query.contractType,
            vehicleInsuranceTypeData:[],
            vehicleData:[],
        }
    },
    async mounted() {
        this.initSelf();
    },
    methods: {
        async initSelf() {
            let that = this;
            await this.init();
            that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data)
            {
                that.customerData = data;
            });
            if(this.contractType==1){
                this.contractReviewType=1;
                this.baseTitle="客户";
                this.tenantName="客户";
            }else if (this.contractType==2){
                this.contractReviewType=2;
                this.baseTitle="供应商";
                this.tenantName="供应商";
            }else if (this.contractType==3){
                this.contractReviewType=2;
                this.baseTitle="仓储设备";
                this.tenantName="供应商";
            }else if (this.contractType==4){
                this.contractReviewType=2;
                this.baseTitle="器具容器";
                this.tenantName="供应商";
            }else if (this.contractType==5){
                this.contractReviewType=2;
                this.baseTitle="保险";
                this.tenantName="供应商";
            }
            else if (this.contractType==6){
                this.contractReviewType=2;
                this.baseTitle="其他";
                this.tenantName="供应商";
            }
            else if (this.contractType==7){
                this.contractReviewType=2;
                this.baseTitle="内部结转";
                this.tenantName="供应商";
            }
            if(this.type==1){//新增
                this.disabled = false;
                this.disabledEdit = false;
                this.disabledDel = false;
            }else if(this.type==2){//修改
                this.disabled = false;
                this.disabledEdit = false;
                this.disabledDel = false;
            }else{
                this.disabled = true;
                this.disabledEdit = true;
                this.disabledDel = true;
            }
            this.$nextTick(() => {
                this.doQueryInfo();
            })

            this.vehicleInsuranceTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_INSURANCE_TYPE"});
            this.vehicleData = await this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {vehicleAttribution: 2});
        },
        doQueryInfo() {
            let that = this;
            if(this.type!=1){
                this.common.postUrl("contractService", "getContractDetail", {id: this.id}, function (data)
                {
                    that.contract = data;
                    that.contract.isPostpone = that.contract.isPostpone+"";
                    that.contract.tenantId = that.contract.tenantId+'';
                    if(that.common.isNotBlank(that.contract.workIds)){
                        that.contract.workIds= that.contract.workIds.split(",").map(Number);
                    }
                    else {
                        that.contract.workIds = [];
                    }
                    if(that.common.isNotBlank(that.contract.orgIds)){
                        that.contract.orgIds= that.contract.orgIds.split(",").map(Number);
                    }
                    else {
                        that.contract.orgIds = [];
                    }
                    if (that.common.isNotBlank(that.contract.imgId))
                    {
                        that.$refs.img.initDate(that.contract.imgId);
                    }
                    for (let i = 0; i < that.contract.subContractList.length; i++) {
                        let subContract = that.contract.subContractList[i];
                        if (that.common.isNotBlank(subContract.imgId))
                        {
                            that.$nextTick(() => {
                                that.$refs['img'+i][0].initDate(subContract.imgId);
                            });
                        }
                    }
                    if(!data.isVehicleInsurance){
                        that.contract.isVehicleInsurance = '0';
                    }else{
                        that.contract.isVehicleInsurance = '1';
                        if(that.common.isNotBlank(data.vehicleInsuranceType)){
                            that.contract.vehicleInsuranceType = data.vehicleInsuranceType.split(",");
                        }
                    }

                    that.$forceUpdate();
                });

            }else{
                this.initContract();
            }
        },
        changeSubContractReview(item){
            if(item.reviewContractId){
                this.contractData.forEach(el=>{
                    if(el.contractId===item.reviewContractId){
                        item.beginDate = el.keepStartDate;
                        item.endDate = el.keepEndDate;
                    }
                })
            }else{
                item.beginDate = '';
                item.endDate = '';
            }
            this.$forceUpdate();
        },
        // 图片上传成功回调
        fileCallback(data,item){
            item.imgId = data.flowId;
            item.imgPath = data.storePath;
            this.$forceUpdate();
        },
        delCallback(item){
            item.imgId = '';
            item.imgPath = '';
            this.$forceUpdate();
        },
        removeSubItem(index)
        {
            if (this.contract.subContractList.length >= 1)
                this.contract.subContractList.splice(index, 1);
            this.$forceUpdate();
        },
        addSubItem(){
            if(!this.contract.subContractList){
                this.contract.subContractList=[];
            }
            let contract = {
                contractNum:'',
                reviewContractId:'',
                contractName:'',
                beginDate:'',
                endDate:'',
                parentId: this.contract.id,
                contractType: this.contract.contractType,
                tenantId:this.contract.tenantId,
                workIds:this.contract.workIds,
            }
            this.contract.subContractList.push(contract);
            this.$forceUpdate();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        // 将选中的 ids 转换为 labels
        getSelectedLabels(ids,dataList,key,name) {
            if (!ids || !dataList) {
                return '';
            }
            return ids.map(id =>
                dataList.find(item => item[key] === id)?.[name] || '未知'
            ).join(', ');
        },
        vehicleInsuranceChange(){
            if(this.contract.isVehicleInsurance=='0'){
                this.contract.vehicleInsuranceType = [];
                this.contract.vehicleId = '';
            }
        }

    },
}
