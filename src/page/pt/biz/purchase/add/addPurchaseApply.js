import myFileModel from '@/components/myFileModel/myFileModel.vue'
import commonPurchaseApply from '../commonPurchaseApply.js'

export default {
    mixins: [commonPurchaseApply],
    name: 'addPurchaseApply',
    data()
    {
        return {
            isUpdate: this.common.isNotBlank(this.$route.query.id),
        }
    },
    async mounted()
    {
        if (this.common.isNotBlank(this.$route.query.id))
        {
            setTimeout((async () =>{
                await this.loadPurchaseApplyById();
            }),500);
        }
    },
    methods: {
    },
    components: {
        myFileModel
    },
}
