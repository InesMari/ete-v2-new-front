export default {
    name: 'driverAssessmentInfo',
    data()
    {
        return {
            isDisable: this.$route.query.type == 0,
            type: this.$route.query.type,
            info: this.initInfo(),
            driverData: [],
            title: this.$route.query.type == 1 ? '新增司机考评' : this.$route.query.type == 2 ? '修改司机考评' : '司机考评详情',
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadDriverAssessmentInfoById(this.$route.query.id);
    },
    /**
     * 组件
     */
    components: {
    },
    methods: {
        initInfo()
        {
            return this.info = {
                id: '',
                assessmentMonth: null,
                driverId: null,
                driverPhone: null,
                supplierName: null,
                operationalData: null,
                vehicleInspection: null,
                workAttitude: null,
                outlier: null,
            }
        },
        async initData()
        {
            this.driverData = await this.common.postUrl("driverTF", "queryAllDriverList", {isLoadSupplierName: 1,isOwn: 1});
            this.$forceUpdate();
        },
        async loadDriverAssessmentInfoById(id)
        {
            let data = await this.common.postUrl("driverAssessmentService", 'queryDriverAssessmentInfoById', {id});
            this.info = data;
            this.$forceUpdate();
        },
        changeDriver()
        {
            this.info.driverPhone = null;
            this.info.supplierName = null;
            let data = this.driverData.filter(item => item.id == this.info.driverId);
            if (data)
            {
                this.info.driverPhone = data[0].driverPhone;
                this.info.supplierName = data[0].supplierName;
            }
            this.$forceUpdate();
        },
        async saveOrUpdateDriverAssessment()
        {
            if (this.common.isBlank(this.info.assessmentMonth))
            {
                this.$message.error("请选择考评月份！");
                return false;
            }
            if (this.common.isBlank(this.info.driverId))
            {
                this.$message.error("请选择司机名称！");
                return false;
            }
            if (this.common.isBlank(this.info.operationalData))
            {
                this.$message.error("请填写运作数据！");
                return false;
            }
            if (this.common.isBlank(this.info.vehicleInspection))
            {
                this.$message.error("请填写车辆点检！");
                return false;
            }
            if (this.common.isBlank(this.info.workAttitude))
            {
                this.$message.error("请填写工作态度！");
                return false;
            }
            if (this.common.isBlank(this.info.outlier))
            {
                this.$message.error("请填写异常点！");
                return false;
            }
            await this.common.postUrl("driverAssessmentService", 'saveOrUpdateDriverAssessment', this.info, null, null, '', true);
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.closePage();
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
