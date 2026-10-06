import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'insuranceIncomeSummaryManage',
    data()
    {
        return {
            head: [
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "月份", "code": "month", "width": "150", "type": "text"},
                {"name": "金额", "code": "sumInsured", "width": "120", "type": "text"},
                {"name": "入账金额", "code": "postedAmount", "width": "120", "type": "text"},
            ],
            query: {},
            settleBodyData: [],
            confirmStateData: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
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
        async doQuery(query = this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.postedMonth) && this.query.postedMonth.length === 2){
                this.query.postedBeginMonth = this.query.postedMonth[0];
                this.query.postedEndMonth = this.query.postedMonth[1];
            }else{
                this.query.postedBeginMonth = '';
                this.query.postedEndMonth = '';
            }
            await this.$refs.table.load("insuranceRebateIncomeService", "queryInsuranceRebateIncomeSummaryPage", this.query);
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'PAY_TITLE,CONFIRM_STATE'});
            this.settleBodyData = data.PAY_TITLE;
            this.confirmStateData = data.CONFIRM_STATE;
            for (let i = 0; i < this.confirmStateData.length; i++) {
                if(this.confirmStateData[i].codeValue=='2'){
                    this.confirmStateData.splice(i,1);
                    i--;
                }
            }
        },
        detailIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看详情的数据~");
                return false;
            }
            this.dblclickItem(selectData[0]);
        },
        dblclickItem(data)
        {
            this.$emit('openTab', {
                urlName: "保险收入汇总详情",
                urlId: 'insuranceRebateSummary' + data.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/insuranceRebateSummary.vue",
                query: {
                    month: data.month,
                    settleBody: data.settleBody,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('保险收入汇总列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"入账月份","model":"postedMonth","type":"monthrange","isshow":true},
            ]
        }
    },
}
