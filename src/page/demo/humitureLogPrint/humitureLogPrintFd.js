import printJS from 'print-js'

export default {
    name: 'humitureLogPrintFd',
    data()
    {
        return {
            info:{
                title:'2025年8月温湿度记录表',
                list:[]
            },            
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
        }
    },
    mounted()
    {
        this.initData();
    },
    methods: {
        initData(){
            for(let i=0;i<=31;i++){
                this.info.list.push({})
            }
        },
        async doQuery(item)
        {
            // this.info = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillInfoByWmsWaybillId", {id:this.$route.query.id});
        },
        /**
         * 打印
         */
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/humitureLogPrintFd.css',  //真实路径/public/static/css/humitureLogPrintFd.css
                scanStyles: false
            })
        },
    },
}
