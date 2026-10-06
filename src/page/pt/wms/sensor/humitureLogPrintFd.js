import printJS from 'print-js'

export default {
    name: 'humitureLogPrintFd',
    data()
    {
        return {
            head:[
                {code:"time",name:"时间"},
                {code:"temperature",name:"温度"},
                {code:"humidity",name:"湿度"},
            ],
            title:'温湿度记录表',
            info:{
                list:[]
            },
            param:{
                id:this.$route.query.id,
                month:this.$route.query.month,
                deviceAddress:this.$route.query.deviceAddress,
                location:this.$route.query.location,
                reportType:1,
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
        async doQuery()
        {
            let param = this.param;
            const month = param.month.slice(0, 4) + '-' + param.month.slice(4);
            let date = new Date(month);
            this.title = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + param.location + "（编号：" + param.deviceAddress + "）" + "温湿度记录表";
            this.info = await this.common.postUrl("sensorTF", "getSensorDataReport", param);
            console.log(this.info)
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id);
        },
        /**
         * 打印
         */
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/humitureLogPrint.css',  //真实路径/public/static/css/humitureLogPrint.css
                scanStyles: false
            })
        },
    },
}
