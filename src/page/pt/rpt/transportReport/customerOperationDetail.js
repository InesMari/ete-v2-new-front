import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'customerOperationDetail',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "作业点", "code": "workName", "width": "150", "type": "text"},
                {"name": "作业点类型", "code": "workTypeName", "width": "100", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "要求运作时间", "code": "workDate", "width": "120", "type": "text"},
                {"name": "实际到达时间", "code": "actualArrivedDate", "width": "120", "type": "text"},
                {"name": "限定时间/分钟", "code": "limitTypeTime", "width": "100", "type": "text"},
                {"name": "准时/延误", "code": "onTimeOrDelay", "width": "100", "type": "text"},
                {"name": "到达操作方式", "code": "opTypeName", "width": "100", "type": "text"},
                {"name": "操作人", "code": "opUserName", "width": "100", "type": "text"},
                {"name": "操作时间", "code": "opDate", "width": "130", "type": "text"}
            ],
            query: this.initQuery(),
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
            symbolOptions: enumData.compareText,
        }
    },
    mounted()
    {
        this.init();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods:
    {
        /**
         * 初始化静态数据
         */
        init()
        {

        },
        /**
         * 初始化查询条件
         * @returns {{orderType: string, tenantName: string, orderNum: string, orderState: string}}
         */
        initQuery()
        {
            this.query = {
                tenantName: '',
                orderNum: '',
                workDate: '',
                workName: '',
            };
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query=query;
            if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
                this.query.startWorkDate = this.query.workDate[0];
                this.query.endWorkDate = this.query.workDate[1];
            }else{
                this.query.startWorkDate = '';
                this.query.endWorkDate = '';
            }
            if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
                this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
                this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
            }else{
                this.query.startCustomerOrderDate = '';
                this.query.endCustomerOrderDate = '';
            }
            await this.$refs.table.load("transportReportTF", "loadCustomerOperationDetailPage", this.query);
        },
        /**
         * 导出
         */
        exportDownload()
        {
            if (this.common.isBlank(this.query.workDate))
            {
                this.$message.error("请输入一个不超过90天的要求到达时间再导出！");
                return false;
            }
            if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
                this.query.startWorkDate = this.query.workDate[0];
                this.query.endWorkDate = this.query.workDate[1];
            }else{
                this.query.startWorkDate = '';
                this.query.endWorkDate = '';
            }
            if (this.common.isNotBlank(this.query.workDate))
            {
                let start = new Date(this.query.startWorkDate);
                let end = new Date(this.query.endWorkDate);
                start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 90);
                if (start.getTime() < end.getTime())
                {
                    this.$message.error("导出的创建开始时间:" + this.query.startWorkDate + " 和创建结束时间：" + this.query.endWorkDate + "相差不能超过90天！");
                    return false;
                }
            }
            this.$refs.table.downloadExcelFile('客户运作明细列表');
        },
        /**
         * 双击查看详情
         * @param data
         */
        dblclickItem(data)
        {
            this.openDetail(data);
        },
        /**
         * 打开详情
         * @param data
         */
        openDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'orderDetail' + data.orderId,
                query: {orderId: data.orderId,pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"客户：","placeholder":"客户","model":"tenantName","type":"input","isshow":true},
                {"name":"订单号：","placeholder":"订单号","model":"orderNum","type":"input","isshow":true},
                {"name":"客户下单时间：","model":"customerOrderDate","type":"daterange","isshow":true},
                {"name":"要求运作时间：","model":"workDate","type":"daterange","isshow":true},
                {"name":"作业点：","placeholder":"作业点","model":"workName","type":"input","isshow":true},
            ]
        }
    },
}
