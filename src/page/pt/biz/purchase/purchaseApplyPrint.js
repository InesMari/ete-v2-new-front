import myFileModel from '@/components/myFileModel/myFileModel.vue'
import commonPurchaseApply from './commonPurchaseApply.js'
import printJS from 'print-js'

export default {
    mixins: [commonPurchaseApply],
    name: 'purchaseApplyPrint',
    data()
    {
        return {
            
        }
    },
    async mounted()
    {
        setTimeout((async () =>{
            await this.loadPurchaseApplyById();
        }),500);
    },
    methods: {        
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                scanStyles: false,
            })
        },
    },
    components: {
        myFileModel
    },
}
