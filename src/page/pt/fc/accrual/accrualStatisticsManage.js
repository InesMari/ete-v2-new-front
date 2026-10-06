import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'accrualStatisticsManage',
    props: [],
    data() {
        return {
            head: [
                {"name": "部门", "code": "orgName", "width": "180", "type": "text"},
                {"name": "费用月份", "code": "accrualMonth", "width": "120", "type": "text"},
                {"name": "未税金额", "code": "totalFee", "width": "120", "type": "text"},
                {"name": "税金", "code": "totalTax", "width": "120", "type": "text"},
                {"name": "含税金额", "code": "totalFeeWithTax", "width": "120", "type": "text"},
                {"name": "未税月账单金额", "code": "amountNoTax", "width": "120", "type": "text"},
                {"name": "月账单金额", "code": "amount", "width": "120", "type": "text"},
                {"name": "差异", "code": "diff", "width": "120", "type": "text"},
                {"name": "请付款金额", "code": "payFee", "width": "120", "type": "text"},
                {"name": "差异", "code": "noPayFee", "width": "120", "type": "text"},
            ],
            query: {
                orgId: '',
                month:this.initMonth(),
                startMonth:'',
                endMonth:'',
            },
            orgData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.doQuery();
    },

    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },

    /**
     * 绑定函数
     */
    methods: {
        /**
         *
         */
        doQuery(query = this.query) {
            this.query = query;
            if(this.common.isNotBlank(this.query.month) && this.query.month.length === 2){
                this.query.startMonth = this.query.month[0];
                this.query.endMonth = this.query.month[1];
            }else{
                this.query.startMonth = '';
                this.query.endMonth = '';
            }
            this.$refs.table.load("fcAccrualTF", "queryFcAccrualStatisticsInfoPage", this.query);
        },
        initMonth(){
            const start = new Date();
            const end = new Date();
            start.setMonth(start.getMonth()-1);
            let time1 = this.common.formatTime(start, "yyyy-MM");
            let time2 = this.common.formatTime(end, "yyyy-MM");
            return [time1,time2];
        },
        /**
         * 初始化数据
         */
        async initData() {
            this.orgData = await this.common.postUrl("regionOrgTF", "queryAllWorkOrgData", {});
        },
        toAccrualInfo() {
            let title = "仓储成本计提明细";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'accrualInfoManage'+new Date().getTime(),
                urlPathName: "/accrualInfoManage",
                urlPath: "/pt/fc/accrual/accrualInfoManage.vue",
                query: {},
            });
        },
        /**
         * 清空
         */
        clear() {
            this.query =
                {
                    orgId: '',
                    month:'',
                    startMonth:'',
                    endMonth:'',
                };
        },
        dblclickItem(item){
            this.open({
                query:{orgId:item.orgId,accrualMonth:item.accrualMonth},
                urlId: 'detailInsuranceInfo' + item.orgId + item.accrualMonth,
                urlName: '仓库成本计提详情',
                urlPathName: '/accrualStatisticsInfo',
                urlPath: "/pt/fc/accrual/accrualStatisticsInfo.vue",
            });
        },
        /**
         * 导出EXCEL
         */
        download() {
            this.$refs.table.downloadExcelFile("仓储成本计提列表");
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },


    },
    computed: {
        formData() {
            return [
                {"name":"部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"部门","method":"doQuery","isshow":true},
                {"name":"费用月份","model":"month","type":"monthrange","isshow":true},
            ]
        }
    },
}
