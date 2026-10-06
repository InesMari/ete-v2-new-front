import printJS from 'print-js'

export default {
    name: 'printWaybill',
    data()
    {
        return {
            info:{
                waybillInfo:{},
                list:[]
            },            
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
        }
    },
    mounted()
    {
        this.doQuery();
    },
    methods: {
        async doQuery(item)
        {
            this.info = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillInfoByWmsWaybillId", {id:this.$route.query.id});
        },
        /**
         * 打印
         */
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/printWaybill.css',  //真实路径/public/static/css/printWaybill.css
                scanStyles: false
            })
        },
    },
}
