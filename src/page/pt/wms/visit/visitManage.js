import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";

export default {
    name: 'visitManage',
    data()
    {
        return {
            head: [
                {"name": "基地", "code": "workName", "width": "100", "type": "text"},
                {"name": "来访人姓名", "code": "visitName", "width": "100", "type": "text"},
                {"name": "来访人联系方式", "code": "visitPhone", "width": "200", "type": "text"},
                {"name": "身份证编号", "code": "idCard", "width": "200", "type": "text"},
                {"name": "来访人车牌", "code": "plateNumber", "width": "200", "type": "text"},
                {"name": "来访所属客户/供应商", "code": "visitCustomer", "width": "180", "type": "text"},
                {"name": "来访事由", "code": "visitReason", "width": "100", "type": "text"},
                {"name": "来访时间", "code": "visitDate", "width": "100", "type": "text"},
            ],
            query: this.initQuery(),
            workList:[],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
    },
    methods: {
        initQuery() {
            return this.query = {
                visitName: '',
                plateNumber: '',
                visitCustomer: '',
                workStoreId: this.common.userInfo().workId,
            };
        },
        initData()
        {
            let that = this;
            this.common.postUrl('wmsBaseTF','getAllWorkStore',{isHZ: 1},function (data) {
                that.workList = data;
            });
        },
        async doQuery()
        {
            await this.$refs.table.load("wmsVisitService", "queryWmsVisitPage", this.query);
        },

        exportExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
}
