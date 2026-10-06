import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'ARManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "180", "type": "text"},
                {"name": "未收金额", "code": "noReceiveFee", "width": "110", "type": "text"},
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
                tenantName: this.$route.query.tenantName,//客户详情收款登记跳转
                billMonth:'',
            };
            return this.query;
        },
        /**
         *
         */
        async doQuery(query=this.query) {
            this.query=query;
            await this.$refs.table.load("fcCollectionRegistrationTF", "loadBillNoReceiveData", this.query);
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'collectionRegistration' + data.custTenantId,
                query: {tenantName: data.tenantName},
                urlName: "收款登记列表",
                urlPathName: "/collectionRegistration",
                urlPath: "/pt/fc/register/collectionRegistration.vue"});
        }

    },
    computed:{
        formData(){
            return [
                {"name":"客户","placeholder":"客户","model":"tenantName","type":"input","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"month","isshow":true},
            ]
        }
    },
}
