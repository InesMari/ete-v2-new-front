import printJS from 'print-js'
export default {
    name: 'humiturePrintCode',
    data() {
        return {
            info: {},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.info = this.$route.query;
        console.log(this.info)
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
        // 打印条码
        print() {
            printJS({
                printable: 'printable',
                type: 'html',
                css: './static/css/printInspectionCode.css',  //真实路径/public//static/css/printInspectionCode.css
                scanStyles: false,
            })
        },
        /**
         * 关闭当前页面
         */
        close() {
            this.$emit("closeTab", this.$route.meta.id);
            this.$parent.$emit("closeTab", this.$route.meta.id);
        },
    },
}
