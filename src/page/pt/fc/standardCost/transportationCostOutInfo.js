
export default {
    name: 'transportationCostOutInfo',
    data()
    {
        return {
            info: this.initInfo(),
            id: this.$route.query.id,
            type: this.$route.query.type,
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
        }
    },
    mounted()
    {
        if (this.$route.query.id)
        {
            this.loadDataById(this.$route.query.id);
        }
    },
    components: {
    },
    methods: {
        initInfo()
        {
            return this.info = {
                manageCost: null,
                cost: null,
                transportationCost: null,
            };
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('standardCostTransportationService', 'loadStandardCostTransportationById', {id});
            this.info = data.info;
            this.$forceUpdate();
        },
        changeCost()
        {
            this.calcTransportationCost();
        },
        changeManageCost()
        {
            this.calcTransportationCost();
        },
        calcTransportationCost()
        {
            let value = 0;
            if (this.common.isNotBlank(this.info.cost) && this.common.isNotBlank(this.info.manageCost))
            {
                let value2 = this.common.accAdd(this.info.manageCost, 100);
                value = this.common.accMul(this.info.cost, value2);
                value = this.common.accDiv(value, 100);
                value = value.toFixed(2);
                value = parseFloat(value);
            }
            this.info.transportationCost = value;
            this.$forceUpdate();
        },
        async save()
        {
            if (this.common.isBlank(this.info.cost)) {
                this.$message.error("请输入单趟成本！");
                return false;
            }
            if (this.common.isBlank(this.info.manageCost)) {
                this.$message.error("请输入管理成本！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.type = 2;
            await this.common.postUrl("standardCostTransportationService", "saveOrUpdateStandardCostTransportation", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}