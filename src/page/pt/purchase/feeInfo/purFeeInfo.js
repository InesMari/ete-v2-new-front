import myFileModel from '@/components/myFileModel/myFileModel.vue';
import multiFileUpload from '@/mixins/multiFileUpload.js';

export default {
    name: "purFeeInfo",
    mixins: [multiFileUpload],
    components: {
        myFileModel,
    },
    data() {
        return {
            info: {
                feeType:'',
                feeSubType:'',
                purchaseType:1,
                projectName:'',
                specification:'',
                unit:'',
                payType:'',
                rate:'',
                depreciationMonthCount:'',
                floor:'',
                up:'',
                remark:'',
                stockingCycle:'',
                isPurchase:1,
                isAsset:0,
                contractId:'',
                contractBeginDate:'',
                contractEndDate:'',
                tenantId:'',
                payCondition:'',
                bankCard:'',
                linkman:'',
                linkPhone:'',

                accrualCostTypeData:[],
                accrualCostType:'',
                accrualCostSubType:'',
            },
            fileList:[{}],
            type: this.$route.query.type,//0 查看 1 新增 2 修改 3 复制
            feeTypeData:[],
            feeSubTypeData:[],
            purchaseTypeData: [],
            allPayTypeData:[],
            payTypeData:[],
            contractData:[],
            supplierData:[],
            deviceData:[],
            bankCardData:[],
            props: { value: 'codeValue',label: 'codeName' },
            treeData:[],
            onlySee: false,
            disabledEdit: false,
            disabledDel: false,
            showFlag:false,//展示红点必填标志
            showDevice:false,//展示器具

            accrualCostTypeData:[],
            accrualCostSubTypeData:[],
            accrualCostTypeTreeData:[],
            isPurchaseDisable:false,
        };
    },
    async mounted() {
        await this.initData();
        if (this.$route.query.id) {
            this.loadPurFeeById(this.$route.query.id);
            if (this.$route.query.type == 0) {
                this.onlySee = true;
            }
        }
    },
    methods: {
        async loadPurFeeById()
        {
            let data = await this.common.postUrl('purFeeBaseService','loadPurFeeById',{id:this.$route.query.id});
            this.info = data.info;
            this.info.feeType = String(data.info.feeType);
            this.info.payType = String(data.info.payType);
            this.info.feeTypeData = [data.info.feeType];
            this.showDevice = data.info.feeType == 26;
            this.isPurchaseDisable = false;
            if (this.common.isNotBlank(data.info.feeSubType))
            {
                this.info.feeSubType = String(data.info.feeSubType);
                this.info.feeTypeData.push(data.info.feeSubType);
                let deviceType = null;
                let feeSubType = Number(data.info.feeSubType);
                if (feeSubType == 80)//周转箱
                {
                    deviceType = 1;
                }else if (feeSubType == 81){
                    deviceType = 2;
                }else if (feeSubType == 108){
                    deviceType = 3;
                }else if (feeSubType == 109){
                    deviceType = 4;
                }else if (feeSubType == 110){
                    deviceType = 5;
                }else if (feeSubType == 128){
                    deviceType = 6;
                }else if (feeSubType == 129){
                    deviceType = 7;
                }else if (feeSubType == 130){
                    this.showDevice = false;
                    this.deviceData = [];
                }
                if(deviceType!=null){
                    await this.initDevice(deviceType);
                }

                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeValue == data.info.feeSubType) {
                        let data2 = this.common.copyObj(item2);
                        if (data2.codeDesc == 3) {
                            this.isPurchaseDisable = true;
                        }
                        this.info.codeTip = data2.codeTip;
                    }
                });
            }
            if (this.common.isBlank(data.fileList) || data.fileList.length === 0)
            {
                data.fileList = [{}];
            }
            this.info.accrualCostType = String(data.info.accrualCostType);
            this.info.accrualCostTypeData = [this.info.accrualCostType];
            if (this.common.isNotBlank(data.info.accrualCostSubType)){
                this.info.accrualCostSubType = String(data.info.accrualCostSubType);
                this.info.accrualCostTypeData.push(this.info.accrualCostSubType);
            }
            this.fileList = data.fileList;
            this.disabledEdit = this.type == 0;
            this.disabledDel = this.type == 0;
            this.imgDisplay();
            this.$forceUpdate();
        },
        async initData()
        {
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.payTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PAY_TYPE"});
            // this.feeTypeData = await this.common.postUrl("purFeeBaseService", "getSysStaticDataForSpecify", {codeType: "PURCHASE_TYPE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PURCHASE_TYPE"});
            this.treeData = [];
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                // data.disabled = true;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = item2;
                        if (data2.codeDesc == 1)
                        {
                            data2.codeTip = "固定资产";
                        }
                        else if (data2.codeDesc == 2)
                        {
                            data2.codeTip = "易耗品";
                        }
                        else if (data2.codeDesc == 3)
                        {
                            data2.codeTip = "服务类";
                        }
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            });
            this.accrualCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_TYPE"});
            this.accrualCostSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_SUB_TYPE"});
            this.accrualCostTypeTreeData = [];

            this.accrualCostTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.accrualCostSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue) {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.accrualCostTypeTreeData.push(data);
            });

            await this.initContract();
            await this.initSupplier();
            //await this.initDevice();
            this.$forceUpdate();
        },
        async initContract()
        {
            this.contractData = await this.common.postUrl("contractService", "queryContractList", {isloadSupplier: 1});
        },
        async initSupplier()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async initDevice(deviceType)
        {
            //deviceType//器具类型 1周转箱 2 托盘
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {deviceType});
            this.$forceUpdate();
        },
        async initBankCard(tenantId)
        {
            this.bankCardData = await this.common.postUrl("bankTF", "queryBankInfoBytenantId", {tenantId});
            return this.bankCardData;
        },
        async changeContract(contractId)
        {
            this.info.tenantId = null;
            this.info.contractBeginDate = null;
            this.info.contractEndDate = null;
            this.contractData.forEach(item => {
                if (contractId == item.id)
                {
                    this.info.tenantId = item.tenantId;
                    if (this.common.isNotBlank(item.beginDate))
                    {
                        this.info.contractBeginDate = String(item.beginDate).substring(0, 10);
                    }
                    if (this.common.isNotBlank(item.beginDate))
                    {
                        this.info.contractEndDate = String(item.endDate).substring(0, 10);
                    }
                }
            })
            await this.changeSupplier(this.info.tenantId);
            this.$forceUpdate();
        },
        async changeSupplier(tenantId)
        {
            this.info.bankCard = null;
            this.info.linkman = null;
            this.info.linkPhone = null;
            this.supplierData.forEach(item => {
                if (tenantId == item.tenantId)
                {
                    this.info.linkman = item.linkman;
                    this.info.linkPhone = item.linkPhone;
                }
            })
            if (this.common.isNotBlank(tenantId))
            {
                let data = await this.initBankCard(tenantId);
                if (data.length === 1)
                {
                    this.info.bankCard = data[0].bankCard;
                }
            }
            this.$forceUpdate();
        },
        purchaseChange(){
            if(this.info.isPurchase==0){
                this.info.isAsset=0;
            }
            this.$forceUpdate();
        },
        /**
         * 保存
         * @returns {Promise<void>}
         */
        async save()
        {
            let data = this.info.feeTypeData;
            if(this.common.isBlank(data) || data.length === 0)
            {
                this.$message.error("费用类型不能为空!");
                return;
            }
            this.info.feeType = data[0];
            if (data.length > 1)
            {
                this.info.feeSubType = data[1];
            }
            else
            {
                this.$message.error("费用子类型不能为空!");
                return;
            }
            let accrualCostTypeData = this.info.accrualCostTypeData;
            if(this.common.isNotBlank(accrualCostTypeData) && accrualCostTypeData.length > 0)
            {
                this.info.accrualCostType = accrualCostTypeData[0];
                if (accrualCostTypeData.length > 1)
                {
                    this.info.accrualCostSubType = accrualCostTypeData[1];
                }
            }

            // if(this.common.isBlank(this.info.purchaseType))
            // {
            //     this.$message.error("采购类型不能为空!");
            //     return;
            // }
            if (this.info.feeType == 26&&this.info.feeSubType!=130)
            {
                if(this.common.isBlank(this.info.projectId))
                {
                    this.$message.error("器具名称不能为空!");
                    return;
                }
                for (let i = 0; i < this.deviceData.length; i++)
                {
                    let item = this.deviceData[i];
                    if (item.id == this.info.projectId)
                    {
                        this.info.projectName = item.name;
                    }
                }
            }
            if(this.common.isBlank(this.info.projectName))
            {
                this.$message.error("品名/项目不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.unit))
            {
                this.$message.error("数量单位不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.payType))
            {
                this.$message.error("付款类型不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.rate))
            {
                this.$message.error("税率不能为空");
                return;
            }
            let param = this.common.copyObj(this.info)
            param.fileList = this.fileList;
            debugger
            if (this.$route.query.type == 3)
            {
                param.id = "";
            }
            await this.common.postUrl('purFeeBaseService', 'saveOrUpdatePurFee', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        async feeTypeChange(){
            let data = this.info.feeTypeData;
            this.showFlag = false;
            //器具类处理
            if (this.common.isNotBlank(data) && data.length > 0)
            {
                this.showDevice = data[0] == 26;
                this.$forceUpdate();
                if (this.showDevice)//选择是器具的
                {
                    this.info.projectName = null;
                    //重新查询器具
                    let deviceType = null;
                    if (data.length > 1)
                    {
                        let feeSubType = data[1];
                        if (feeSubType == 80)//周转箱
                        {
                            deviceType = 1;
                        }else if (feeSubType == 81){
                            deviceType = 2;
                        }else if (feeSubType == 108){
                            deviceType = 3;
                        }else if (feeSubType == 109){
                            deviceType = 4;
                        }else if (feeSubType == 110){
                            deviceType = 5;
                        }else if (feeSubType == 128){
                            deviceType = 6;
                        }else if (feeSubType == 129){
                            deviceType = 7;
                        }else if (feeSubType == 130){
                            this.showDevice = false;
                            this.deviceData = [];
                        }
                        if(deviceType!=null){
                            await this.initDevice(deviceType);
                        }
                    }
                    // await this.initDevice(deviceType);
                }
                else
                {
                    this.info.projectId = null;
                    this.info.projectName = null;
                }


                if (data.length > 1)
                {
                    let feeSubType = data[1];
                    this.info.isPurchase=1;
                    this.isPurchaseDisable = false;
                    this.feeSubTypeData.forEach(item2 => {
                        if (item2.codeValue == feeSubType) {
                            let data2 = this.common.copyObj(item2);
                            if (data2.codeDesc == 3) {
                                this.info.isPurchase=0;
                                this.isPurchaseDisable = true;
                            }
                            this.info.codeTip=data2.codeTip;
                        }
                    });
                }else{
                    this.info.isPurchase=1;
                    this.isPurchaseDisable = false;
                }
            }
            else
            {
                this.info.projectId = null;
                this.info.projectName = null;
                this.info.isPurchase=1;
            }
            //固定资产特殊处理
            if (this.common.isNotBlank(data) && data.length > 1)
            {
                let feeSubType = data[1];
                this.feeSubTypeData.forEach(item => {
                    if (item.codeValue == feeSubType)
                    {
                        this.info.isAsset=0;
                        if (item.codeDesc == 1)//固定资产必填供应商
                        {
                            this.showFlag = true;
                            this.info.isAsset=1;
                        }else if (item.codeDesc == 2)
                        {
                            this.showFlag = true;
                        }
                    }
                })
            }
            this.purchaseChange();
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        forceUpdate(){
            this.$forceUpdate();
        }
    },
};