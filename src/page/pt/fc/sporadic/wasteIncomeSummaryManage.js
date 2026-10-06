import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'wasteIncomeSummaryManage',
    data()
    {
        return {
            head: [
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "月份", "code": "month", "width": "150", "type": "text"},
                {"name": "金额", "code": "amount", "width": "120", "type": "text"},
                {"name": "入账金额", "code": "postedAmount", "width": "120", "type": "text"},
            ],
            query: {},
            settleBodyData: [],
            confirmStateData: [],
            workData: [],
            scrapTypeData: [],
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
            await this.$refs.table.load("wasteDisposalIncomeService", "queryWasteDisposalIncomeSummaryPage", this.query);
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'PAY_TITLE,CONFIRM_STATE,SCRAP_TYPE'});
            this.settleBodyData = data.PAY_TITLE;
            this.confirmStateData = data.CONFIRM_STATE;
            for (let i = 0; i < this.confirmStateData.length; i++) {
                if(this.confirmStateData[i].codeValue=='2'){
                    this.confirmStateData.splice(i,1);
                    i--;
                }
            }
            this.scrapTypeData = data.SCRAP_TYPE;
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
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
                urlName: "废品收入汇总详情",
                urlId: 'wasteDisposalSummary' + data.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/wasteDisposalSummary.vue",
                query: {
                    workId: data.workId,
                    month: data.month,
                    settleBody: data.settleBody,
                },
            });
        },
        download(){
          this.$refs.table.downloadExcelFile('废品收入汇总列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"物流基地","model":"workId","type":"select","options":this.workData, "label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"月份","model":"month","type":"month","isshow":true},
                {"name":"废品名称","model":"scrapType","type":"select","options":this.scrapTypeData,"label":"codeName","value":"codeValue","placeholder":"废品名称","method":"doQuery","isshow":true},
            ]
        }
    },
}
