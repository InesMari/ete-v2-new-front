import myFileModel from '@/components/myFileModel/myFileModel.vue'
import commonPurchaseApply from '../commonPurchaseApply.js'
import enumData from "@/page/pt/enum.js"

export default {
    mixins: [commonPurchaseApply],
    name: 'purchaseApplyDetail',
    data()
    {
        return {
            enumData: enumData,
        }
    },
    async mounted()
    {
        setTimeout((async () =>{
            await this.loadPurchaseApplyById();
        }),500);
    },
    methods: {
    },
    components: {
        myFileModel
    },
}
