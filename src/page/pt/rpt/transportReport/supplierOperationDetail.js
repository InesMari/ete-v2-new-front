import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'supplierOperationDetail',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "supplierName", "width": "120", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                {"name": "作业点", "code": "workName", "width": "110", "type": "text"},
                {"name": "作业点类型", "code": "workTypeName", "width": "80", "type": "text"},
                {"name": "要求到达时间", "code": "workDate", "width": "110", "type": "text"},
                {"name": "实际到达时间", "code": "actualArrivedDate", "width": "110", "type": "text"},
                {"name": "实际离开时间", "code": "leaveDate", "width": "110", "type": "text"},
                {"name": "限定时间/分钟", "code": "limitTypeTime", "width": "80", "type": "text"},
                {"name": "准时/延误", "code": "onTimeOrDelay", "width": "80", "type": "text"},
                {"name": "到达操作方式", "code": "opTypeName", "width": "80", "type": "text"},
                {"name": "操作人", "code": "opUserName", "width": "80", "type": "text"},
                {"name": "操作时间", "code": "opDate", "width": "110", "type": "text"}
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
                this.loadParam.startDate = this.loadParam.createDaterange[0];
                this.loadParam.endDate = this.loadParam.createDaterange[1];
            }else{
                this.loadParam.startDate = '';
                this.loadParam.endDate = '';
            }
            this.$refs.table.load("transportReportTF", "loadSupplierOperationDetailPage", this.loadParam);
        },
        init() {

        },
        clear() {
            this.loadParam = {};
        },
        /** 导出Excel */
        download(){
            this.$refs.table.downloadExcelFile('供应商运作明细列表');
        },
    },
}
