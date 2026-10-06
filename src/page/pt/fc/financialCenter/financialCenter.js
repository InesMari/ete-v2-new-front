import seasonPicker from "@/components/seasonPicker/seasonPicker.vue";

export default {
    name: 'financialCenter',
    data() {
        return {

            info:{},
            dateType:1,
            dateOptions:[{
                label:'按月份',
                value:1
            },{
                label:'按季度',
                value:2
            },{
                label:'按年度',
                value:3
            }],
            qryDate:new Date(),
            uiType:'month',
            valueFormat:'yyyy-MM',
            startDate:'',
            endDate:'',
        }
    },
    /**
     * 初始化
     */
    mounted(){
        this.dateTypeChange();
    },
    /**
     * 组件
     */
    components: {
        seasonPicker
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(param){
            let that = this;
            //默认查询当月
            this.common.postUrl("fcTF", "queryStatisticsInfo", param, function (data) {
                if(data){
                    that.info = data;
                }
            },null,'',true);
        },
        //选择日期类型
        dateTypeChange(){
            let now = new Date();
            //查询某个月数据
            if(this.dateType==1){
                this.uiType='month';
                this.valueFormat='yyyy-MM';
                this.qryDate=this.common.formatTime(now,this.valueFormat)
                this.dateSel();
            }else if(this.dateType==2){

            }else{
                this.uiType='year';
                this.valueFormat='yyyy';
                this.qryDate=this.common.formatTime(now,this.valueFormat);
                this.dateSel();
            }
            this.$forceUpdate();
        },
        //选择日期
        dateSel(){
            let param = {};
            param.dateType=this.dateType;
            param.dateStr = this.qryDate;
            if(this.dateType==1){
                let dataArray = this.qryDate.split("-");
                let end = new Date(dataArray[0],dataArray[1],0);
                let start = new Date(end)
                // start.setMonth(end.getMonth() - 1)
                start.setDate(1)
                this.startDate = this.common.formatTime(start,'yyyy-MM-dd');
                this.endDate = this.common.formatTime(end,'yyyy-MM-dd');
            }else{
                this.startDate = this.qryDate+'-01-01';
                this.endDate = this.qryDate+'-12-31';
            }
            this.doQuery(param);
        },
        //选择季度
        seasonSel(value){
            let param = {};
            param.dateType=this.dateType;
            param.dateStr = value;
            //转换日期
            let dataArray = value.split("-");
            this.startDate = dataArray[0].slice(0,4)+'-'+dataArray[0].slice(4)+'-01'
            let end = new Date(dataArray[1].slice(0,4),dataArray[1].slice(4),0);
            this.endDate = this.common.formatTime(end,'yyyy-MM-dd');
            this.doQuery(param);
        },

        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        go(path, pId, urlName, urlId) {
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            let query = { pId: pId};
            this.$emit("openTab",{
                urlId: urlId + pId,
                query: query,
                urlName: urlName,
                urlPathName: "/"+urlId,
                urlPath: path});
        },
        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        goByParam(path, urlName, urlId,param) {
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            let that = this;
            let query = {};
            if(param){
                query = param;
            }
            query.startDate=that.startDate;
            query.endDate=that.endDate;
            //处理时间
            this.$emit("openTab",{
                urlId: urlId,
                query: query,
                urlName: urlName,
                urlPathName: "/"+urlId,
                urlPath: path});
        },

    }
}
