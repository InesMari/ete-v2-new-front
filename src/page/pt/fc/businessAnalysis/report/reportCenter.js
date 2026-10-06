import enumData from "@/page/pt/enum";

export default {
    name: 'reportCenter',
    data() {
        return {
            info:[
                {entityId:1007121,name:'经营结果分析表',path:'/pt/fc/businessAnalysis/report/allBaseAnalysisSummary.vue',introduce:'各物流基地预算与实绩经营结果分析表，全年度各月份数据能全部展示，横向对比数据差异点（针对总部汇总输出)'},
                {entityId:1007122,name:'基地达成汇总表',path:'/pt/fc/businessAnalysis/report/specificBaseAnalysisSummary.vue',introduce:'单独基地查看全年度各月份数据展示，横向对比数据差异点(针对单独基地输出）'},
                {entityId:1007123,name:'简要汇总表',path:'/pt/fc/businessAnalysis/report/monthlySummaryReport.vue',introduce:'各物流基地汇总查看预算与实绩的成本、收入、毛利、管理费金额，可以单独月份/季度/半年度/年度，自行选择对应月份'},
                {entityId:1007124,name:'累计分析表',path:'/pt/fc/businessAnalysis/report/cumulativeAnalysisReport.vue',introduce:'各物流基地汇总查看预算与实绩收入与成本对比数据，条形图方式展示，数据形象化'},
                {entityId:1007125,name:'净利达成表',path:'/pt/fc/businessAnalysis/report/netProfitAchievementReport.vue',introduce:'净利润达成表，是基于年度预算给各物流基地设定了目标，累计月份查看各物流基地距离目标还差多少未达成，有利于促进各基地经理向目标奋斗'},
                {entityId:1007126,name:'同环比分析表',path:'/pt/fc/businessAnalysis/report/compareAnalysisSummary.vue',introduce:'单独物流基地实绩的成本/收入同比、环比分析表，利于仓经理分析数据的差异点'},
                {entityId:1007127,name:'业务收入成本分析表',path:'/pt/fc/businessAnalysis/report/incomeCostReport.vue',introduce:'单独物流基地实绩的成本/收入业务类型的金额占比，以图形方式直观展示'},
            ],
            param:{
                monthRange: [],
            },
            orgData:[],
            typeData:[
                {value: 1, name: '预算'},
                {value: 2, name: '实绩'},
            ],
        }
    },
    /**
     * 初始化
     */
    mounted(){
        this.init();
    },
    /**
     * 组件
     */
    components: {

    },
    /**
     * 绑定函数
     */
    methods: {
        async init(){
            this.orgData = await this.common.postUrl("fcBudgetTF", "queryWorkOrgList", {});
        },
        async doQuery(){
        },
        /**
         *
         */
        go(item) {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(el =>
            {
                if (el == item.entityId)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看"+item.name+"的权限,请联系上级授权！");
                return false;
            }
            let urlId = item.path.substring(item.path.lastIndexOf("/") + 1, item.path.lastIndexOf(".vue"));

            this.param.pId = item.entityId;
            if (item.entityId == 1007122 || item.entityId == 1007126 || item.entityId == 1007127)
            {
                if (this.common.isBlank(this.param.orgId) || this.param.orgId <= 0)
                {
                    this.$message.error("请选择基地！");
                    return;
                }
            }
            if (item.entityId == 1007126 || item.entityId == 1007127)
            {
                if (this.common.isBlank(this.param.type) || this.param.type <= 0)
                {
                    this.$message.error("请选择数据来源！");
                    return;
                }
            }
            if (this.common.isNotBlank(this.param.monthRange) && this.param.monthRange.length == 2) {
                this.param.beginMonth = this.param.monthRange[0];
                this.param.endMonth = this.param.monthRange[1];
            }
            let beginMonth = "开始月份";
            let endMonth = "开始月份";
            if (item.entityId == 1007126)
            {
                beginMonth = "基础月份";
                endMonth = "对比月份";
            }
            if(this.common.isBlank(this.param.beginMonth)){
                this.$message.error("请选择" + beginMonth + "！");
                return;
            }
            if(this.common.isBlank(this.param.endMonth)){
                this.$message.error("请选择" + endMonth + "！");
                return;
            }
            if(item.entityId==1007125){
                if(this.param.beginMonth.substring(0,4)!=this.param.endMonth.substring(0,4)){
                    this.$message.error("请选择同一年的月份数据！");
                    return;
                }
            }

            item.visible = false;
            this.$emit("openTab",{
                urlId: urlId + item.entityId+(new Date()).getTime(),
                query: this.param,
                urlName: item.name,
                urlPathName: "/"+item.entityId,
                urlPath: item.path});
        },

        clear(){
            this.param={};
        }
    }
}
