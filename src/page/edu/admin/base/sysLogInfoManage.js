import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'sysLogInfoManage',
    data()
    {
        return {
            head: [
                {"name": "操作人员", "code": "reqUser", "width": "100", "type": "text"},
                {"name": "联系电话", "code": "billId", "width": "100", "type": "text"},
                {"name": "操作时间", "code": "reqDate", "width": "150", "type": "text"},
                {"name": "操作模块", "code": "module", "width": "180", "type": "text"},
                {"name": "操作类型", "code": "opType", "width": "120", "type": "text"},
                {"name": "操作内容", "code": "content", "width": "340", "type": "text"},
            ],
            loadParam: {
                reqDate:this.initReqDate(),
                content:'',
                reqUserName:'',
            },
        }
    },
    async mounted()
    {
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        clearFn(){
            this.loadParam={
                reqDate:this.initReqDate(),
                content:'',
                reqUserName:'',
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
            await this.$refs.table.load("sysLogTF", "queryEduSysLogPage", this.loadParam);
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
                {"name":"开始时间","model":"reqDate","type":"datetimerange","isshow":true},
                {"name":"日志内容","placeholder":"日志内容","model":"content","type":"input","isshow":true},
                {"name":"请求人员","placeholder":"请求人员","model":"reqUserName","type":"input","isshow":true},
            ]
        }
    },
}
