import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'supplierOperationSummary',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "总票数", "code": "waybillCount", "width": "110", "type": "text"},
                {"name": "准时/票", "code": "puncual", "width": "110", "type": "text"},
                {"name": "延误/票", "code": "delayed", "width": "110", "type": "text"},
                {"name": "准时率", "code": "puncualRate", "width": "90", "type": "text"},
                {"name": "延误率", "code": "delayedRate", "width": "90", "type": "text"},
                {"name": "提货准时率", "code": "puncualInRate", "width": "90", "type": "text"},
                {"name": "提货延误率", "code": "delayedInRate", "width": "90", "type": "text"},
                {"name": "卸货准时率", "code": "puncualUnRate", "width": "90", "type": "text"},
                {"name": "卸货延误率", "code": "delayedUnRate", "width": "90", "type": "text"},
                {"name": "操作票数", "code": "operateCount", "width": "90", "type": "text"},
                {"name": "未操作票数", "code": "noOperateCount", "width": "90", "type": "text"},
                {"name": "操作率", "code": "waitVehicleRate", "width": "110", "type": "text"}
            ],
            loadParam: {},
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
            //派车时间 调度时间
            if(this.common.isNotBlank(this.loadParam.createDaterange) && this.loadParam.createDaterange.length==2){
                this.loadParam.startCreateDate = this.loadParam.createDaterange[0];
                this.loadParam.endCreateDate = this.loadParam.createDaterange[1];
            }else{
                this.loadParam.startCreateDate = '';
                this.loadParam.endCreateDate = '';
            }
            this.$refs.table.load("transportReportTF", "loadSupplierOperationSummaryPage", this.loadParam);
        },
        init() {

        },
        clear() {
            this.loadParam = {};
        },
        /** 导出Excel */
        download(){
            this.$refs.table.downloadExcelFile('供应商运作汇总列表');
        },
    },
}
