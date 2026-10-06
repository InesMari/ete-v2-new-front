import printJS from 'print-js'
export default {
    name: 'ownVehicleBenefitAccountingPrint',
    data() {
        return {
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
            info:{},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadOrderInfo();
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
        /**
         * 加载订单数据
         */
        async loadOrderInfo()
        {
            this.info = await this.common.postUrl("vehicleBenefitAccountingService", "getOwnVehicleBenefitAccountingInfo",
                {id: this.$route.query.id},
                null, null, null, true);
            if(!this.info.driverAssessment){
                this.info.driverAssessment={};
            }
        },

        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/ownVehicleBenefitAccountingPrint.css',  //真实路径/public//static/css/ownVehicleBenefitAccountingPrint.css
                scanStyles: false,
            })
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id)
        },
    },
}
