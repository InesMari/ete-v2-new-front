import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'wmsSysLogInfoManage',
    data()
    {
        return {
            head: [
                {"name": "模块", "code": "module", "width": "180", "type": "text"},
                {"name": "请求渠道", "code": "channel", "width": "100", "type": "text"},
                {"name": "请求类型", "code": "opType", "width": "120", "type": "text"},
                {"name": "日志内容", "code": "content", "width": "340", "type": "text"},
                {"name": "开始时间", "code": "reqDate", "width": "150", "type": "text"},
                {"name": "结束时间", "code": "respDate", "width": "150", "type": "text"},
                {"name": "操作人员", "code": "reqUser", "width": "100", "type": "text"},
            ],
            stateData:[],
            channelTypeData:[],
            loadParam: {
                center:'仓储中心',
                module:'',
                state:'1',
                reqDate:this.initReqDate(),
                respDate:'',
                content:'',
                reqUserName:'',
                channel:'',
                reqParamStr:'',
                opType:'',
            },
        }
    },
    async mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        clearFn(){
            this.loadParam={
                center:'仓储中心',
                module:'',
                state:'1',
                reqDate:this.initReqDate(),
                respDate:'',
                content:'',
                reqUserName:'',
                channel:'',
                reqParamStr:'',
                opType:'',
            };
        },
        initReqDate(){
            const start = new Date();
            const end = new Date();
            start.setDate(start.getDate()-7);
            let time1 = this.common.formatTime(start, "yyyy-MM-dd HH:mm:ss");
            let time2 = this.common.formatTime(end, "yyyy-MM-dd 23:59:59");
            return [time1,time2];
        },
        /**
         * 初始化数据
         */
        async initData(){
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"CHANNEL_TYPE"}, function (data) {
                that.channelTypeData = data;
            });
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.reqDate) && this.loadParam.reqDate.length==2){
                this.loadParam.startReqDate = this.loadParam.reqDate[0];
                this.loadParam.endReqDate = this.loadParam.reqDate[1];
            }else{
                this.loadParam.startReqDate = '';
                this.loadParam.endReqDate = '';
            }
            if(this.common.isNotBlank(this.loadParam.respDate) && this.loadParam.respDate.length==2){
                this.loadParam.startRespDate = this.loadParam.respDate[0];
                this.loadParam.endRespDate = this.loadParam.respDate[1];
            }else{
                this.loadParam.startRespDate = '';
                this.loadParam.endRespDate = '';
            }
            await this.$refs.table.load("sysLogTF", "querySysLogPage", this.loadParam);
        },
        doCopy(value){
            let that = this;
            let msg = value;
            this.$copyText(msg).then(function () {
                that.$message.success("复制成功！");
            });
        },
    },
    computed:{
        formData(){
            return [
                {"name":"模块","placeholder":"模块","model":"module","type":"input","isshow":true},
                {"name":"开始时间","model":"reqDate","type":"datetimerange","isshow":true},
                {"name":"结束时间","model":"respDate","type":"datetimerange","isshow":true},
                {"name":"日志内容","placeholder":"日志内容","model":"content","type":"input","isshow":true},
                {"name":"请求人员","placeholder":"请求人员","model":"reqUserName","type":"input","isshow":true},
                {"name":"请求渠道","model":"channel","type":"select","options":this.channelTypeData,"label":"codeName","value":"codeName","clearable":true,"method":"doQuery","isshow":true},
                {"name":"请求类型","placeholder":"请求类型","model":"opType","type":"input","isshow":true},
            ]
        }
    },
}
