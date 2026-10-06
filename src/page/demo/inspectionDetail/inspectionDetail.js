import printJS from 'print-js'
export default {
    name: 'inspectionDetail',
    data() {
        return {
            head:[
                {name:"点检项目",code:"name",width:100},
                {name:"检查基准",code:"name",width:200},
                {name:"方法",code:"name",width:100},
            ],
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
            this.days = this.common.getDaysInMonthByString("2025-08")
            for (let i = 1; i <= this.days; i++) {
                this.head.push({name:i,code:"day"+(i+1),width:30});
            }
        },
        /**
         * 加载订单数据
         */
        async doQuery()
        {
            // 搞点假数据
            let data = [];
            for(let i = 0; i < 10; i++){
                let obj = {"name":"点检项目"+(i+1),"checkBase":"检查基准"+(i+1),"method":"方法"+(i+1)};
                for (let i = 1; i <= this.days; i++) {
                    obj['day'+(i+1)] = "OK";
                }
                data.push(obj);
            }
            this.tableData = data;
            return
            let {ids} = this.$route.query;
            this.codeList = await this.common.postUrl("wmsInOrderTF", "loadStockQrcodeByCondition",{ids},null, null, null, true);
            // 判断条码图片是否生成完毕
            let haveCodes = true;
            this.codeList.forEach(item => {
                if(this.common.isBlank(item.qrcodeFileUrl)){
                    haveCodes = false;
                }
            })
            this.haveCodes = haveCodes;
            // 重复请求查询标签是否生成完
            if(!haveCodes){
                const timer = setTimeout(() => {
                    this.doQuery();
                    clearTimeout(timer);
                }, 2000);
            }
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
