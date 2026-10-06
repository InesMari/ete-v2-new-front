import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'dispatchManage',
    data() {
        return {
            head: [
                {"name": "调度单号", "code": "dispatchNum", "width": "130", "type": "text"},
                {"name": "调度类型", "code": "dispatchTypeName", "width": "110", "type": "text"},
                {"name": "订单数", "code": "orderNums", "width": "110", "type": "text"},
                {"name": "调度件数(件)", "code": "totalGoodsCount", "width": "80", "type": "text"},
                {"name": "调度重量(KG)", "code": "totalGoodsWeight", "width": "80", "type": "text"},
                {"name": "调度体积(㎡)", "code": "totalGoodsVolume", "width": "80", "type": "text"},
                {"name": "调度人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "调度时间", "code": "createDate", "width": "110", "type": "text"},
            ],
            loadParam: {},
            pickerOptions: {
                shortcuts: [{
                    text: '最近一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-3);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            if(this.common.isNotBlank(this.loadParam.daterange) && this.loadParam.daterange.length==2){
                this.loadParam.startCreateDate = this.loadParam.daterange[0];
                this.loadParam.endCreateDate = this.loadParam.daterange[1];
            }else{
                this.loadParam.startCreateDate = '';
                this.loadParam.endCreateDate = '';
            }
            this.$refs.table.load("ordDispatchTF", "queryOrdDispatchPage", this.loadParam);
        },
        init() {
        },
        async dispatch(dispatchType) {
            let dispatchName = await this.common.postUrl("ordDispatchTF", "getDispatchTypeName", {dispatchType});
            let item = {
                urlName: dispatchName,
                urlId: 'dispatch',
                urlPathName: "/dispatch",
                urlPath: "/pt/ord/dispatch/add/dispatch.vue",
                query: {dispatchType},
            }
            this.$emit('openTab', item);
        },
        clear() {
            this.loadParam = {};
        },
    },
}
