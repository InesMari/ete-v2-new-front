import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'commissionDtlManage',
    data()
    {
        return {
            head: [
                {"name": "提成年月", "code": "month", "width": "150", "type": "text"},
                {"name": "季度", "code": "quarterName", "width": "120", "type": "text"},
                {"name": "部门", "code": "orgName", "width": "280", "type": "text"},
                {"name": "人员", "code": "userName", "width": "150", "type": "text"},
                {"name": "客户", "code": "tenantName", "width": "280", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "130", "type": "diy"},
                {"name": "账单部门", "code": "billOrgName", "width": "150", "type": "text"},
                {"name": "客户系数(%)", "code": "coefficient", "width": "120", "type": "text"},
                {"name": "回款日期", "code": "receiveDate", "width": "150", "type": "text"},
                {"name": "回款金额", "code": "receiveFee", "width": "120", "type": "text"},
                {"name": "人员发放比例(%)", "code": "userProportion", "width": "120", "type": "text"},
                {"name": "计提金额", "code": "commission", "width": "120", "type": "text"},
                {"name": "逾期天数", "code": "overDays", "width": "120", "type": "text"},
                {"name": "发放比例(%)", "code": "payProportion", "width": "120", "type": "text"},
                {"name": "发放金额", "code": "payCommission", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
            quarterData: [],//
            payStateData:[],
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods:
    {
        async init()
        {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'QUARTER,PAY_STATE'}, function (data)
            {
                that.quarterData = data.QUARTER;
                that.payStateData = data.PAY_STATE;
            });
        },
        initQuery()
        {
            return this.query = {
                mainId:this.$route.query.mainId
            };
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query) {
            this.query=query;
            await this.$refs.table.load("commissionService", "queryCommissionDtlPage", this.query);
        },
        download(){
            this.$refs.table.downloadExcelFile('提成明细列表');
        },
        /**
         * 确认账单的明细
         */
        toCustomerConfirmedBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '确认账单明细',
                urlId: 'confirmBillDetail',
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                query: {billId: data.billId,tabId: enumData.FC_CUST_BILL_ITEM_TYPE.RECEIVE, flag: 1},
            });
        },
    },
    computed:{
        formData(){
            return [
                {"name":"提成年月","model":"month","type":"month","method":"doQuery","isshow":true},
                {"name":"季度","model":"quarter","type":"select","options":this.quarterData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"部门","model":"orgName","type":"input","placeholder":"部门","isshow":true},
                {"name":"人员","model":"userName","type":"input","placeholder":"人员","isshow":true},
                {"name":"客户","model":"tenantName","type":"input","placeholder":"客户","isshow":true},
            ]
        }
    },
}
