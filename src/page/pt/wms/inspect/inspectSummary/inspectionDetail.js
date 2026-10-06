import printJS from 'print-js'
export default {
    name: 'inspectionDetail',
    data() {
        return {
            head:[
                {name:"点检项目",code:"inspectItem",width:100},
                {name:"检查基准",code:"content",width:200},
                {name:"方法",code:"inspectMethodName",width:80},
            ],
            info:{},
            tableData:[],
            days:30,//每月天数
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initHead();
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
        initHead(){
            this.days = this.common.getDaysInMonthByString(this.$route.query.inspectMonth);
            for (let i = 1; i <= this.days; i++) {
                this.head.push({name:i,code:"day"+i,width:30});
            }
        },
        /**
         * 加载订单数据
         */
        async doQuery()
        {
            this.info = await this.common.postUrl("wmsInspectionTaskService", "queryWmsInspectionTaskStatisticsDtl",this.$route.query,null, null, null, true);
            this.tableData = this.info.list;
        },
        // 打印条码
        print(){
            printJS({
                printable: inspectionDetailPrint,
                type: 'html',
                css: './static/css/printInspectionDetail.css',  //真实路径/public//static/css/printInspectionDetail.css
                scanStyles: false,
            })  
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id);
            this.$parent.$emit("closeTab",this.$route.meta.id);
        },
    },
}
