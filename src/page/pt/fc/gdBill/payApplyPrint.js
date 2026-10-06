
import lodopUtil from "@/utils/lodop/lodop-business.js"
export default {
    name: 'payApplyPrint',
    data() {
        return {
            userName:this.common.userInfo().userName,
            orgName:this.common.userInfo().orgName,
            printDate:this.common.formatDate.getDateTime(),
            payFee:this.$route.query.payFee,
            totalShareFee:0,
            printData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadPrintData();
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
        async loadPrintData() {
            this.printData = await this.common.postUrl("fcThirdPayFeeTF", "queryFcThirdPayFeeInfoForPrint", this.$route.query);
            for (let i = 0; i < this.printData.length; i++) {
                this.totalShareFee = this.common.accAdd(this.totalShareFee,this.printData[i].shareTotalFee);
            }
        },
        print(){
            lodopUtil.printTableInfo("printTable", "G7付款申请单");
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
