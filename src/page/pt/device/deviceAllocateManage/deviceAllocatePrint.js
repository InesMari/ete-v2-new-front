import printJS from 'print-js'
export default {
    name: 'deviceAllocatePrint',
    data() {
        return {
            info:{},
            purchaseNums:'',
            totalFees:'',
            totalFeeChiness:'',
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
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
        initData()
        {
            this.info = this.$route.query.data;
            this.$forceUpdate();
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/deviceAllocatePrint.css',  //真实路径/public//static/css/deviceAllocatePrint.css
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
