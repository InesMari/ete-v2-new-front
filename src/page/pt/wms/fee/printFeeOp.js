import printJS from 'print-js'
export default {
    name: 'printFeeOp',
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
            this.info = await this.common.postUrl("wmsCostService", "queryWmsFeeCostOperateById",
                {id: this.$route.query.id},
                null, null, null, true);
        },

        print(){
            // lodopUtil.printHTMLInfo("printTable", "打印出库单");
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/print.css',  //真实路径/public//static/css/print.css
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
