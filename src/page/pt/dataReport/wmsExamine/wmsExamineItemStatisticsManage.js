import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'wmsExamineItemStatisticsManage',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    examineNum:'',
                    examineName:'',
                },
                items:[]
            },
            head:[
                {"name": "核查项目名称", "code": "itemName", "width": "100", "type": "text"},
                {"name": "使用场景", "code": "relOperationName", "width": "180", "type": "text"},
                {"name": "正常数", "code": "sts1", "width": "100", "type": "diy"},
                {"name": "异常数", "code": "sts2", "width": "100", "type": "diy"},
                {"name": "未操作", "code": "sts0", "width": "100", "type": "diy"},
            ],
            id:this.$route.query.id,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsExamineTF", "queryWmsExamineItemStatisticsPage", {id:this.id}, function (data) {
                that.info = data;
            });
        },
        goto(value,code){
            let sts = 0;
            if('sts0'==code){
                sts = 0;
            }else if('sts1'==code){
                sts=1;
            }else{
                sts=2;
            }
            let item = {
                urlName: '核查明细',
                urlId: 'wmsExamineDTLStatisticsManage-itemId'+value.itemId,
                urlPathName: "/wmsExamineDTLStatisticsManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineDTLStatisticsManage.vue",
                query: {examineId:this.info.baseInfo.id,sts,itemId:value.itemId},
            }
            this.$emit('openTab', item);
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
