import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'deviceStoreDetailHisManage',
    data() {
        return {
            head: [
                {"name": "记录日期", "code": "hisDate", "width": "120", "type": "text"},
                {"name": "客户", "code": "tenantName", "width": "220", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "180", "type": "text"},
                {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
                {"name": "器具规格", "code": "spec", "width": "100", "type": "text"},
                {"name": "数量", "code": "nums", "width": "80", "type": "text"},
            ],
            query: this.initQuery(),
            pickerOptions: {
                // onPick：选中日期时的回调函数，在这里对选中的日期进行处理{maxDate：后选中日期；minDate：第一个选中的日期}
                onPick: ({ maxDate, minDate }) => {
                    this.startDate = minDate && minDate.getTime()
                    if (maxDate) {
                        // 选中后一个时，要把第一个的赋值清空
                        this.startDate = ''
                    }
                },
                disabledDate: (time) => {
                    // 选中第一个后，后一个前后3个月可选，超出的不可选，超出当前天也不可选，这里的月份按需求设定
                    const minTime = new Date(this.startDate).setMonth(new Date(this.startDate).getMonth() - 3)
                    const maxTime = new Date(this.startDate).setMonth(new Date(this.startDate).getMonth() + 3)
                    return time.getTime() > Date.now() || (this.startDate ? (time.getTime() < minTime || time.getTime() > maxTime) : false)
                }
            }
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        // 默认当前的前一个月
        this.query.hisDate = [
            new Date(new Date().setDate(1)),
            new Date(Date.now())
        ]
        await this.doQuery();
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
        /**
         * 初始化查询对象
         * @returns {*}
         */
        initQuery() {
            this.query =  {
                workName : '',
                tenantName: '',
                hisDate:'',
            };
            return this.query;
        },
        /**
         * 查询列表
         * @returns {Promise<void>}
         */
        async doQuery() {
            if(this.common.isNotBlank(this.query.hisDate) && this.query.hisDate.length === 2){
                this.query.startHisDate = this.query.hisDate[0];
                this.query.endHisDate = this.query.hisDate[1];
            }else{
                this.$message.error("请先选择日期再查询!");
                return false;
                // this.query.startHisDate = '';
                // this.query.endHisDate = '';
            }
            //判断
            this.$refs.table.load("stockDeviceService", "queryDeviceStockSummaryDetailHisPage", this.query);
        },
        download(){
            this.$refs.table.downloadExcelFile('历史库存明细列表');
        },
    },
}
