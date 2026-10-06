import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'vehicleFixedCostInfo',
    data()
    {
        return {
            isDisable: this.$route.query.type == 0 || this.$route.query.type == 3,
            type: this.$route.query.type,
            info: {},
            vehicleData: [],
            feeTypeData:[],
            feeList: [this.initItem()],
            fileList: [this.initFileItem()],
            verifyRemark: null,
        }
    },
    mounted()
    {
        this.initStaticData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadVehicleFixedCostInfoById(this.$route.query.id);
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
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_FIXED_COST_VEHICLE_TYPE"});
            this.$forceUpdate();
        },
        async loadVehicleFixedCostInfoById(id)
        {
            let data = await this.common.postUrl("vehicleFixedCostService", 'queryVehicleFixedCostInfoById', {id});
            this.info = data.info;
            this.feeList = data.feeList;
            this.fileList = data.fileList;
            if (this.type == 2 && this.fileList.length < 5)
                this.fileList.push(this.initFileItem());
            if (this.fileList.length == 0)
                this.fileList.push(this.initFileItem());
            this.initListComponentId();
            this.initImg();
            this.$forceUpdate();
        },
        addItem()
        {
            if (this.feeList.length > 20)
            {
                this.$message.error("不允许一次性保存20条以上！");
                return false;
            }
            this.feeList.push(this.initItem());
        },
        removeItem(item, index)
        {
            this.feeList.splice(index, 1);
        },
        initItem()
        {
            return {
                feeType: null,
                startDate: null,
                endDate: null,
                purchaseCompany: null,
                fee: null,
                month: 0,
                monthFee: 0,
            }
        },
        initFileItem()
        {
            return {
                flowId: null,
                storePath: null,
            }
        },
        changeStartDate(item)
        {
            item.month = 0;
            item.monthFee = 0;
            if (this.common.isNotBlank(item.startDate))
            {
                if (this.common.isNotBlank(item.endDate))
                {
                    if (new Date(item.startDate).getTime() > new Date(item.endDate).getTime())
                    {
                        this.$message.error("开始日期不能大于结束日期！");
                        return false;
                    }
                }
                let start = new Date(item.startDate);
                let month = start.getMonth();
                let day = start.getDate();
                if (month == 1 && day == 29)
                    day = 28;
                let end = new Date(start.getFullYear() + 1, month, day - 1);
                item.endDate = this.common.formatDate.getDate(end);
                this.dealFeeealFee(item);
            }
        },
        changeEndDate(item)
        {
            item.month = 0;
            item.monthFee = 0;
            if (this.common.isNotBlank(item.startDate) && this.common.isNotBlank(item.endDate))
            {
                let start = new Date(item.startDate);
                let end = new Date(item.endDate);
                if (start.getTime() > end.getTime())
                {
                    this.$message.error("开始日期不能大于结束日期！");
                    return false;
                }
            }
            this.dealFeeealFee(item);
        },
        changeFee(item)
        {
            item.monthFee = 0;
            if (this.common.isNotBlank(item.fee))
                this.dealFeeealFee(item);
        },
        dealFeeealFee(item)
        {
            if (this.common.isBlank(item)
                    || this.common.isBlank(item.startDate)
                    || this.common.isBlank(item.endDate))
                return;

            let start = new Date(item.startDate);
            let end = new Date(item.endDate);
            const startMonth = (start.getFullYear()) * 12 + (start.getMonth() + 1);
            const endMonth = (end.getFullYear()) * 12 + (end.getMonth() + 1);
            item.month = Math.abs(endMonth - startMonth);
            if (this.common.isNotBlank(item.fee))
            {
                let monthFee = this.common.accDiv(item.fee, item.month) + "";
                let index = monthFee.indexOf(".");
                if (index > 0)
                    item.monthFee = monthFee.substring(0, index + 3 > monthFee.length ? monthFee.length : index + 3);
                else
                    item.monthFee = monthFee;
            }
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
        async saveOrUpdateVehicleFixedCost()
        {
            if (this.common.isBlank(this.info.vehicleId))
            {
                this.$message.error("请选择车牌号！");
                return false;
            }
            if (this.common.isBlank(this.feeList) || this.feeList.length === 0)
            {
                this.$message.error("车辆月度固定费用信息不能为空！");
                return false;
            }
            for (let i = 0; i < this.feeList.length; i++)
            {
                let item = this.feeList[i];
                if (this.common.isBlank(item.feeType))
                {
                    this.$message.error("请选择" + (i + 1) + "条车辆月度固定费用的费用类型！");
                    return false;
                }
                if (this.common.isBlank(item.startDate))
                {
                    this.$message.error("请选择" + (i + 1) + "条车辆月度固定费用的开始日期！");
                    return false;
                }
                if (this.common.isBlank(item.endDate))
                {
                    this.$message.error("请选择" + (i + 1) + "条车辆月度固定费用的结束日期！");
                    return false;
                }
                if (this.common.isBlank(item.fee))
                {
                    this.$message.error("请填写" + (i + 1) + "条车辆月度固定费用的金额！");
                    return false;
                }
            }

            let param = this.common.copyObj(this.info);
            param.feeList = this.common.copyObj(this.feeList);
            param.fileList = this.common.copyObj(this.fileList);
            await this.common.postUrl("vehicleFixedCostService", 'saveOrUpdateVehicleFixedCost', param, null, null, '', true);
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.closePage();
        },
        async verifyVehicleFixedCost(verifyState)
        {
            let param = {verifyState};
            param.id = this.$route.query.id;
            if (verifyState == 2 && this.common.isBlank(this.verifyRemark))
            {
                this.$message.error("审核不通过的审核备注不能为空！");
                return false;
            }
            param.verifyRemark = this.verifyRemark;
            await this.common.postUrl("vehicleFixedCostService", 'verifyVehicleFixedCostById', param, null, null, '', true);
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
