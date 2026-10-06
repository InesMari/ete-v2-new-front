import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'vehicleRepairCostInfo',
    data()
    {
        return {
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 3,
            type: this.$route.query.type,//0 查看 1 新增 2 修改 3 审核
            info: this.initInfo(),
            vehicleData: [],
            fileList: [this.initFileItem()],
            receiptsList: [this.initFileItem()],
            verifyRemark: null,
            repairTypeData:[],
            payModeData:[],
            maintenanceShow: false,
        }
    },
    mounted()
    {
        this.initStaticData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadVehicleRepairCostInfoById(this.$route.query.id);
    },
    components: {
        myFileModel,
        tableCommon,
        searchList,
    },
    methods: {
        async initStaticData()
        {
            this.vehicleData = await this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {vehicleAttribution: 2});
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "REPAIR_TYPE,VEHICLE_REPAIR_PAY_MODE"});
            this.repairTypeData = data.REPAIR_TYPE;
            this.payModeData = data.VEHICLE_REPAIR_PAY_MODE;
            this.$forceUpdate();
        },
        async loadVehicleRepairCostInfoById(id)
        {
            let data = await this.common.postUrl("vehicleRepairCostService", 'queryVehicleRepairCostInfoById', {id});
            this.info = data.info;
            if (data.info.repairType)
            {
                this.info.repairType = data.info.repairType+'';
                if(this.info.repairType == 1 || this.info.repairType == 3){
                    this.maintenanceShow = false;
                }else{
                    this.maintenanceShow = true;
                }
            }
            if (data.info.payMode)
            {
                this.info.payMode = data.info.payMode+'';
            }
            this.fileList = data.fileList;
            if (this.type == 2 && this.fileList.length < 5)
                this.fileList.push(this.initFileItem());
            if (this.fileList.length == 0)
                this.fileList.push(this.initFileItem());
            this.initListComponentId();
            this.initImg();


            this.receiptsList = data.receiptsList;
            if (this.type == 2 && this.receiptsList.length < 5)
                this.receiptsList.push(this.initFileItem());
            if (this.receiptsList.length == 0)
                this.receiptsList.push(this.initFileItem());
            this.initReceiptsListComponentId();
            this.initReceiptsImg();
            this.$forceUpdate();
        },
        initInfo()
        {
            return this.info = {
                vehicleId: null,
                feeDate: null,
                remark: null,
                repairType:'1',
                payMode:null,
                fee: null,
                nextMaintenanceDate: null,
                nextMaintenanceMileage: null,
                feeProject: null,
                supplierName: null,
            }
        },
        initFileItem()
        {
            return {
                flowId: null,
                storePath: null,
            }
        },
        changeFee(item)
        {
            if (this.common.isNotBlank(item.num) && this.common.isNotBlank(item.price)
                && !isNaN(item.num) && !isNaN(item.price))
            {
                let fee = this.common.accMul(item.num, item.price);
                item.fee = parseFloat(fee).toFixed(2);
            }
            else
                item.fee = 0;
            this.$forceUpdate();
        },
        successCallback(imgData)
        {
            this.fileList[imgData.componentId].flowId = imgData.flowId;
            this.fileList[imgData.componentId].storePath = imgData.storePath;
            if (this.fileList.length < 5 && !imgData.isInit)
                this.fileList.push(this.initFileItem());
            //设置下componentId
            this.initListComponentId();
        },
        delCallback(index)
        {
            this.fileList.splice(index,1);
            let flag = true;//不存在空的
            for (let i = 0; i < this.fileList.length; i++)
            {
                if (this.common.isBlank(this.fileList[i].flowId))
                    flag = false;
            }
            if(this.fileList.length < 5 && flag){
                this.fileList.push(this.initFileItem());
            }
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.fileList.length; i++)
                this.fileList[i].componentId = i;
            this.$forceUpdate();
        },
        initImg(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.fileList.length; i++) {
                    if (that.fileList[i].flowId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.fileList[i].flowId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },


        successReceiptsCallback(imgData)
        {
            this.receiptsList[imgData.componentId].flowId = imgData.flowId;
            this.receiptsList[imgData.componentId].storePath = imgData.storePath;
            let that = this;
            const loading = this.$loading({
                lock: true,
                text: '正在识别支付凭证，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                customClass: 'customElLoadingStyle'
            });
            this.common.postUrl("vehicleRepairCostService", "recognizeReceiptNumber", {fileId: imgData.storePath}, function (data) {
                loading.close();
                let flag = true;
                for (let i = 0; i < that.receiptsList.length-1; i++){
                    if(!that.checkInvoiceNums(that.receiptsList[i].receiptNumber,data)){
                        flag = false;
                    }
                }
                that.receiptsList[imgData.componentId].receiptNumber = data;
                if(!flag){
                    that.delReceiptsCallback(imgData.componentId);
                    eval("that.$refs.receipts" + imgData.componentId + "[0].clean()");
                }else{
                    if (that.receiptsList.length < 5 && !imgData.isInit)
                        that.receiptsList.push(that.initFileItem());
                    //设置下componentId
                    that.initReceiptsListComponentId();
                }
            },function(){
                that.delReceiptsCallback(imgData.componentId);
                eval("that.$refs.receipts" + imgData.componentId + "[0].clean()");
                loading.close();
            });

        },
        checkInvoiceNums(invoiceNums1, invoiceNums2)
        {
            if (invoiceNums1 !== null && invoiceNums1 !== undefined && invoiceNums1.length != 0
                && invoiceNums2 !== null && invoiceNums2 !== undefined && invoiceNums2.length != 0)
            {
                for (let i = 0; i < invoiceNums1.length; i++)
                {
                    for (let j = 0; j < invoiceNums2.length; j++)
                    {
                        if (invoiceNums1[i] == invoiceNums2[j])
                        {
                            this.$message.error("支付凭证使用！");
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        delReceiptsCallback(index)
        {
            this.receiptsList.splice(index,1);
            let flag = true;//不存在空的
            for (let i = 0; i < this.receiptsList.length; i++)
            {
                if (this.common.isBlank(this.receiptsList[i].flowId))
                    flag = false;
            }
            if(this.receiptsList.length < 5 && flag){
                this.receiptsList.push(this.initFileItem());
            }
            this.initReceiptsListComponentId();
        },
        initReceiptsListComponentId()
        {
            for (let i = 0; i < this.receiptsList.length; i++)
                this.receiptsList[i].componentId = i;
            this.$forceUpdate();
        },
        initReceiptsImg(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.receiptsList.length; i++) {
                    if (that.receiptsList[i].flowId) {
                        eval("that.$refs.receipts" + i + "[0].initDate(" + that.receiptsList[i].flowId + ",false)");
                    } else {
                        eval("that.$refs.receipts" + i + "[0].clean()");
                    }
                }
            });
        },
        repairTypeChange(){
            if(this.info.repairType == 1 || this.info.repairType == 3){
                this.info.nextMaintenanceDate = null;
                this.info.nextMaintenanceMileage = '';
                this.maintenanceShow = false;
            }else{
                this.info.feeProject = null;
                this.info.supplierName = null;
                this.maintenanceShow = true;
            }
            this.$forceUpdate();
        },
        async saveOrUpdateVehicleRepairCost()
        {
            if (this.common.isBlank(this.info.vehicleId))
            {
                this.$message.error("请选择车牌号！");
                return false;
            }
            if (this.common.isBlank(this.info.feeDate))
            {
                this.$message.error("请选择日期！");
                return false;
            }
            if (this.common.isBlank(this.info.repairType))
            {
                this.$message.error("请选择费用类型！");
                return false;
            }
            if (this.common.isBlank(this.info.payMode))
            {
                this.$message.error("请选择结算方式！");
                return false;
            }
            if (this.common.isBlank(this.info.fee))
            {
                this.$message.error("请输入金额！");
                return false;
            }
            if (this.info.repairType == 2)
            {
                if (this.common.isBlank(this.info.nextMaintenanceDate))
                {
                    this.$message.error("请选择下次保养日期！");
                    return false;
                }
                if (this.common.isBlank(this.info.nextMaintenanceMileage))
                {
                    this.$message.error("请输入下次保养里程！");
                    return false;
                }
            }
            else
            {
                if (this.common.isBlank(this.info.feeProject))
                {
                    this.$message.error("请选择费用项目！");
                    return false;
                }
            }
            if (this.common.isBlank(this.info.supplierName))
            {
                this.$message.error("请输入供应商名称！");
                return false;
            }
            if (this.common.isBlank(this.info.linkMan))
            {
                this.$message.error("请输入维修联系人！");
                return false;
            }
            if (this.common.isBlank(this.info.linkPhone))
            {
                this.$message.error("请输入维修联系电话！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(this.info);
            param.fileList = this.common.copyObj(this.fileList);
            param.receiptsList = this.common.copyObj(this.receiptsList);
            await this.common.postUrl("vehicleRepairCostService", 'saveOrUpdateVehicleRepairCost', param, null, null, '', true);
            if (this.common.isNotBlank(this.$route.query.id))
            {
                this.$message.success("修改成功！");
                this.closePage();
            }
            else
            {
                this.$confirm("新增成功，是否需要继续新增？", "温馨提示", {
                    confirmButtonText: '关闭界面(/回车)',
                    cancelButtonText: '继续新增',
                    center:true
                }).then(async () =>{
                    that.closePage();
                }).catch(() =>{
                    that.initInfo();
                });
            }
        },
        async verifyVehicleRepairCost(verifyState)
        {
            let param = {verifyState};
            param.id = this.$route.query.id;
            if (verifyState == 2 && this.common.isBlank(this.verifyRemark))
            {
                this.$message.error("审核不通过的审核备注不能为空！");
                return false;
            }
            param.verifyRemark = this.verifyRemark;
            await this.common.postUrl("vehicleRepairCostService", 'verifyVehicleRepairCostById', param, null, null, '', true);
            this.$message.success("审核成功！");
            this.closePage();
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
