import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'wasteDisposalSummary',
    data()
    {
        return {
            month: this.$route.query.month,
            workId: this.$route.query.workId,
            settleBody: this.$route.query.settleBody,
            info: this.initInfo(),
        }
    },
    mounted()
    {
        if (this.common.isNotBlank(this.month) && this.common.isNotBlank(this.settleBody) && this.common.isNotBlank(this.workId))
        {
            this.loadData(this.month, this.settleBody, this.workId);
        }
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                workName: null,
                settleBodyName: null,
                month: null,
                confirmStateName_0: null,
                confirmStateName_1: null,
                amount_0: null,
                amount_1: null,
                postedAmount_0: null,
                postedAmount_1: null,
            };
        },
        async loadData(month, settleBody, workId)
        {
            let data = await this.common.postUrl('wasteDisposalIncomeService', 'loadWasteDisposalIncomeSummary', {month, settleBody, workId});
            this.info = data.info;
            this.$forceUpdate();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}