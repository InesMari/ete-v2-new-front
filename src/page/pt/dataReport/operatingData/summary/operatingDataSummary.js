import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'operatingDataSummary',
    data() {
        return {
            head: [
                {"name": "年份", "code": "year", "width": "100", "type": "text"},
                {"name": "总收入预算", "code": "budgetTotalIncome", "width": "100", "type": "text"},
                {"name": "总收入实际", "code": "actualTotalIncome", "width": "100", "type": "text"},
                {"name": "总营收入达成率(%)", "code": "totalIncomeAchievementRate", "width": "120", "type": "text"},
                {"name": "总营收入达成率(%)","width": "1200", children:[]},
            ],
            loadParam: {},
        }
    },
    computed:{
        formData(){
            return [
                {"name":"年份","model":"years","type":"years","isshow":true},
            ]
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
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        // 查询数据
        async doQuery(query = this.loadParam) {
            this.$refs.table.load("fcAnalysisTF", "queryFcAnalysisSummaryInfoPage", query);
        },
        
        // 初始化
        init() {
            this.initHead();
            this.doQuery();
        },
        initHead(){
            let childrens = this.head[4].children;
            for(let i=1;i<=12;i++){
                childrens.push({"name": i+"月", "code": "dtlIncomeAchievementRate"+i, "width": "100", "type": "text"});
            }
            this.$refs.table.initHead();
        },

        // 双击表格行
        dblclickItem(data) {
            this.$emit("openTab", {
                urlId: 'operatingDataSummaryDetail' + data.year,
                query: {
                    year: data.year,
                },
                urlName: "数据汇总表",
                urlPathName: "/operatingDataSummaryDetail",
                urlPath: "/pt/dataReport/operatingData/summary/operatingDataSummaryDetail.vue"
            });
        },
    },
}
