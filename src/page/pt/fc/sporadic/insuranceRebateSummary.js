import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'insuranceRebateSummary',
    data()
    {
        return {
            month: this.$route.query.month,
            settleBody: this.$route.query.settleBody,
            info: this.initInfo(),
        }
    },
    mounted()
    {
        if (this.common.isNotBlank(this.month) && this.common.isNotBlank(this.settleBody))
        {
            this.loadData(this.month, parseInt(this.settleBody));
        }
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                settleBodyName: null,
                postedMonth: null,
                confirmStateName_0: null,
                confirmStateName_1: null,
                sumInsured_0: null,
                sumInsured_1: null,
                postedAmount_0: null,
                postedAmount_1: null,
            };
        },
        async loadData(month, settleBody)
        {
            let data = await this.common.postUrl('insuranceRebateIncomeService', 'loadInsuranceRebateIncomeSummary', {month, settleBody});
            this.info = data.info;
            this.$forceUpdate();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}