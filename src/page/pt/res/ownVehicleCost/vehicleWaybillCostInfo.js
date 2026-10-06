import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'vehicleWaybillCostInfo',
    data()
    {
        return {
            //0 查看 1 新增 2 修改 3 审核
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 3,
            type: this.$route.query.type,
            info: this.initInfo(),
            vehicleData: [],
            feeTypeData:[],
            costPayTypeData:[],
            fileList: [this.initFileItem()],
            receiptsList: [this.initFileItem()],
            verifyRemark: null,
            tip:{
                1: '升',
                2: '次',
                3: '克',
                4: '次',
                5: '次',
            },
            costPayTypeShow: false,
            isDisable2: this.$route.query.type == 0 || this.$route.query.type == 3,
        }
    },
    mounted()
    {
        this.initStaticData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadVehicleWaybillCostInfoById(this.$route.query.id);
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
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "VEHICLE_WAYBILL_COST_VEHICLE_TYPE,COST_PAY_TYPE"});
            this.feeTypeData = data.VEHICLE_WAYBILL_COST_VEHICLE_TYPE;
            this.costPayTypeData = data.COST_PAY_TYPE;
            this.$forceUpdate();
        },
        async loadVehicleWaybillCostInfoById(id)
        {
            let data = await this.common.postUrl("vehicleWaybillCostService", 'queryVehicleWaybillCostInfoById', {id});
            this.info = data.info;
            if (data.info.feeType)
                this.info.feeType = data.info.feeType + "";
            if (data.info.feeType == 1 || data.info.feeType == 6 || data.info.feeType == 7)
            {
                if (this.$route.query.type == 3)
                    this.isDisable2 = false;
                if (data.info.costPayType)
                    this.info.costPayType = data.info.costPayType + "";
                this.costPayTypeShow = true;
            }
            else
            {
                this.costPayTypeShow = false;
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
                feeType: null,
                costPayType: null,
                mileage: null,
                num: null,
                fee: null,
                unit: null,
            }
        },
        initFileItem()
        {
            return {
                flowId: null,
                storePath: null,
            }
        },
        changeFeeType()
        {
            let info = this.info;
            if (info.feeType)
            {
                info.unit = this.tip[info.feeType];
                //选择（油费 燃气费 电费的时候）下面多出来一个项目（支付类型：垫付，补能）枚举 COST_PAY_TYPE
                if (info.feeType == 1 || info.feeType == 6 || info.feeType == 7)
                {
                    info.costPayType = '1';
                    info.mileage = null;
                    this.costPayTypeShow = true;
                }
                else
                {
                    info.costPayType = null;
                    info.mileage = null;
                    this.costPayTypeShow = false;
                }
            }
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
            this.common.postUrl("vehicleWaybillCostService", "recognizeReceiptNumber", {fileId: imgData.storePath}, function (data) {
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
        async saveOrUpdateVehicleWaybillCost()
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
            if (this.common.isBlank(this.info.feeType))
            {
                this.$message.error("请选择费用类型！");
                return false;
            }
            if (this.costPayTypeShow)
            {
                if (this.common.isBlank(this.info.costPayType))
                {
                    this.$message.error("请选择支付类型！");
                    return false;
                }
                if (this.common.isBlank(this.info.mileage))
                {
                    this.$message.error("请输入里程数！");
                    return false;
                }
            }
            if (this.common.isBlank(this.info.num))
            {
                this.$message.error("请选择数量！");
                return false;
            }
            if (this.common.isBlank(this.info.fee))
            {
                this.$message.error("请选择金额！");
                return false;
            }
            if (this.common.isBlank(this.fileList) || this.fileList.length == 0)
            {
                this.$message.error("附件必须上传！");
                return false;
            }
            let noFile = true;
            for (let i = 0; i < this.fileList.length; i++)
            {
                if (this.common.isNotBlank(this.fileList[i].flowId))
                {
                    noFile = false;
                    break;
                }
            }
            if (noFile)
            {
                this.$message.error("请上传附件！");
                return false;
            }
            
            let that = this;
            let param = this.common.copyObj(this.info);
            param.fileList = this.common.copyObj(this.fileList);
            param.receiptsList = this.common.copyObj(this.receiptsList);
            await this.common.postUrl("vehicleWaybillCostService", 'saveOrUpdateVehicleWaybillCost', param, null, null, '', true);
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
                    that.costPayTypeShow = false;
                    that.$forceUpdate();
                });
            }
        },
        async verifyVehicleWaybillCost(verifyState)
        {
            let param = {verifyState};
            param.id = this.$route.query.id;
            if (verifyState == 2 && this.common.isBlank(this.verifyRemark))
            {
                this.$message.error("审核不通过的审核备注不能为空！");
                return false;
            }
            if (this.costPayTypeShow)
            {
                if (this.common.isBlank(this.info.mileage))
                {
                    this.$message.error("请输入里程数！");
                    return false;
                }
            }
            param.verifyRemark = this.verifyRemark;
            param.mileage = this.info.mileage;
            await this.common.postUrl("vehicleWaybillCostService", 'verifyVehicleWaybillCostById', param, null, null, '', true);
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
