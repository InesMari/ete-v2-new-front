import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import rankChart from "@/components/rankChart/rankChart.vue";


export default {
    name: 'paymentPlanSummaryWork',
    data() {
        return {
            head: [
                {"name": "月份", "code": "billMonth", "width": "150", "type": "text"},
                {"name": "部门名称", "code": "orgName", "width": "300", "type": "text"},
                {"name": "金额", "code": "fee", "width": "150", "type": "text"},
            ],
            query: {
                billMonth:[],
                orgIds:[],
            },
            orgData: [],

            showType:1, //1列表，2图表
            chartData:{},
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        rankChart,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        async doQuery(query = this.query) {
            this.query = query;
            if (this.common.isNotBlank(this.query.billMonth) && this.query.billMonth.length == 2) {
                this.query.startMonth = this.query.billMonth[0];
                this.query.endMonth = this.query.billMonth[1];
            } else {
                this.query.startMonth = '';
                this.query.endMonth = '';
            }
            await this.$refs.table.load("purPayPlanTF", "queryPurPayPlanInfoGroupOrgPage", this.query);
            this.chartData = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanInfoGroupOrg", this.query);
        },
        /**
         * 导出
         */
        download() {
            this.$refs.table.downloadExcelFile();
        },
        /**
         * 切换视图
         * @param {1是列表，2是图表} type 
         */
        changeShow(type){
            
        },
    },
    computed:{
        formData(){
            return [
                {"name":"申请时间","model":"billMonth","type":"monthrange","isshow":true},
                {"name":"申请部门","model":"orgIds","type":"select","multiple":true,"options":this.orgData,"label":"orgName","value":"id","method":"doQuery","isshow":true},
            ]
        }
    },
}
