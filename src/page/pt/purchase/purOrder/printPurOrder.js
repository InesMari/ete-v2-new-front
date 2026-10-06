import printJS from 'print-js'
export default {
    name: 'printPurOrder',
    data() {
        return {
            info:{info:{}},
            purchaseNums:'',
            totalFees:'',
            totalFeeChiness:'',
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
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
         * 加载数据
         */
        async doQuery()
        {
            this.info = await this.common.postUrl("purPurchaseService", "loadPurPurchaseById",{id:this.$route.query.id},null, null, null, true);
            this.purchaseNums = 0;
            this.totalFees = 0;
            this.totalFeeNoTaxs = 0;
            this.info.dtlList.forEach(item => {
                this.purchaseNums = this.common.accAdd(item.purchaseNum,this.purchaseNums);
                this.totalFeeNoTaxs = this.common.accAdd(item.totalFeeNoTax,this.totalFeeNoTaxs);
                this.totalFees = this.common.accAdd(item.totalFee,this.totalFees);
            });
            this.purchaseNums.myToFixed(2);
            this.totalFees.myToFixed(2);
            this.totalFeeNoTaxs.myToFixed(2);
            this.info.info.purchaseDate = this.info.info.purchaseDate.substr(0,10);
            this.totalFeeChiness = this.common.numberToChinese(this.totalFees);
            this.$forceUpdate();
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/printPurOrder.css',  //真实路径/public//static/css/printPurOrder.css
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
