import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'otherInfo',
    data()
    {
        return {
            info: this.initInfo(),
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                maintenanceAmount: null,
                repairAmount: null,
            };
        },
        async doQuery()
        {
            let data = await this.common.postUrl('standardCostBaseService', 'loadStandardCostBase', {});
            if (data.info1)
            {
                this.info.maintenanceId = data.info1.id;
                this.info.maintenanceAmount = data.info1.amount;
            }
            if (data.info2)
            {
                this.info.repairId = data.info2.id;
                this.info.repairAmount = data.info2.amount;
            }
            this.$forceUpdate();
        },
        
        async save()
        {
            if (this.common.isBlank(this.info.maintenanceAmount)) {
                this.$message.error("请输入每公里保养成本！");
                return false;
            }
            if (this.common.isBlank(this.info.repairAmount)) {
                this.$message.error("请输入每公里修理成本！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            await this.common.postUrl("standardCostBaseService", "saveOrUpdateStandardCostBase", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}