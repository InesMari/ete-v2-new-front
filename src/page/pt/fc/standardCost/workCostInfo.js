import dbTable from "@/components/dbTable/dbTable.vue"

export default {
    name: 'entityButton',
    data()
    {
        return {
            type: this.$route.query.type,
            info: {
                operateId: null,
                deliveryForm: null,
                operateAmount: 0,
                assistPrice: null,
                equipmentDepreciation: null,
                officeDepreciation: null,
                damage: null,
                entertain: null,
                managePercent: null,
                monthPlate: null,
                assistAmount: null,
                remark: null,
                amount: 0,
            },
            operateFeeData: [],
            details: [],
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
        }
        
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.$route.query.id)
        {
            this.loadDataById(this.$route.query.id);
        }
    },
    /**
     * 组件
     */
    components: {
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData()
        {
            this.operateFeeData = await this.common.postUrl("standardCostOperateFeeService", "queryStandardCostOperateFeeList", {});
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('standardCostWorkService', 'loadStandardCostWorkById', {id});
            this.info = data.info;
            this.details = data.details;
            
            this.$forceUpdate();
        },
        async changeOperate()
        {
            this.details = [];
            this.info.operateAmount = 0;
            if (this.common.isNotBlank(this.info.operateId))
            {
                this.details = await this.common.postUrl("standardCostOperateFeeService", "loadStandardCostOperateFeeDetailListById", {id: this.info.operateId});
                this.details.forEach(item => {
                    this.info.operateAmount = this.common.accAdd(this.info.operateAmount, item.amount);
                });
                this.operateFeeData.forEach(item => {
                    if (item.id == this.info.operateId)
                    {
                        this.info.deliveryForm = item.deliveryForm;
                        this.info.operateName = item.name;
                    }
                });
                this.$forceUpdate();
            }
            this.changeAmount();
        },
        changeAssist()
        {
            let sum = 0;
            sum = this.calc(sum, this.info.assistPrice);
            sum = this.calc(sum, this.info.equipmentDepreciation);
            sum = this.calc(sum, this.info.officeDepreciation);
            sum = this.calc(sum, this.info.damage);
            sum = this.calc(sum, this.info.entertain);
            this.info.assistAmount = sum;
            this.changeAmount();
        },
        calc(sum, item)
        {
            if (this.common.isNotBlank(item) && !isNaN(item))
            {
                sum = this.common.accAdd(sum, item);
            }
            return sum;
        },
        changeAmount()
        {
            this.info.amount =  0;
            let amount = 0;
            if (this.common.isNotBlank(this.info.managePercent) && !isNaN(this.info.managePercent) && this.info.managePercent >= 0)
            {
                if (this.common.isNotBlank(this.info.operateAmount) && !isNaN(this.info.operateAmount))
                {
                    amount = this.common.accAdd(amount, this.info.operateAmount);
                }
                if (this.common.isNotBlank(this.info.assistAmount) && !isNaN(this.info.assistAmount))
                {
                    amount = this.common.accAdd(amount, this.info.assistAmount);
                }
                let percent = this.common.accAdd(1 ,this.common.accDiv(this.info.managePercent, 100));
                amount = this.common.accMul(amount, percent);
            }
            this.info.amount = amount;
            this.$forceUpdate();
        },
        async save()
        {
            if (this.common.isBlank(this.info.operateId)) {
                this.$message.error("请选择操作费！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.details = this.common.copyObj(this.details);
            await this.common.postUrl("standardCostWorkService", "saveOrUpdateStandardCostWork", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
