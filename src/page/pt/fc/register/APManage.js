import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'APManage',
    data()
    {
        return {
            head: [
                {"name": "供应商名称", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "180", "type": "text"},
                {"name": "未付金额", "code": "noPayFee", "width": "110", "type": "text"}
            ],
            query: this.initQuery(),

        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        tableCommon,
        scrollTable,
        searchList,
    },
    methods:
    {
        /**
         * 初始化查询条件
         */
        initQuery()
        {
            this.query = {
                supplierName: this.$route.query.supplierName,//客户详情收款登记跳转
                billMonth:'',
            };
            return this.query;
        },
        /**
         *
         */
        async doQuery(query=this.query) {
            this.query=query;
            await this.$refs.table.load("fcSupplierBillTF", "queryNoPayFcSupplierBillInfo", this.query);
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'expenditureRegisterManage' + data.supplierTenantId,
                query: {supplierName: data.supplierName},
                urlName: "付款登记列表",
                urlPathName: "/expenditureRegisterManage",
                urlPath: "/pt/fc/register/expenditureRegisterManage.vue"});
        }

    },
    computed:{
        formData(){
            return [
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"month","isshow":true},
            ]
        }
    },
}
