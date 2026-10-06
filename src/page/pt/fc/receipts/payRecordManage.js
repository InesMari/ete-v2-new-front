import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'payRecordManage',
    data()
    {
        return {
            head: [
                {"name": "收款方全称", "code": "bankAccountName", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "payTitleName", "width": "200", "type": "text"},
                {"name": "类型", "code": "payTypeName", "width": "120", "type": "text"},
                {"name": "单号", "code": "payNum", "width": "200", "type": "diy"},
                {"name": "本次付款金额", "code": "fee", "width": "150", "type": "text"},
                {"name": "实际付款日期", "code": "payDate", "width": "100", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "100", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            typeData: [],
            payTitleData:[],
        }
    },
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async initData()
        {
            this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TYPE"});
            this.payTitleData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
        },
        initQuery()
        {
            this.query = {
                payNum: "",
                bankAccountName: "",
                payDate: null,
                type:'',
            };
            return this.query;
        },
        async enterDoQuery(query)
        {
            this.doQuery(query);
        },
        async doQuery(query=this.query)
        {
            this.query=query;
            if(this.common.isNotBlank(this.query.payDate) && this.query.payDate.length==2){
                this.query.startPayDate = this.query.payDate[0];
                this.query.endPayDate = this.query.payDate[1];
            }else{
                this.query.startPayDate = '';
                this.query.endPayDate = '';
            }
            let {items} = await this.$refs.table.load("requestServiceImpl", "loadPayRecordPage", this.query);
        },
        async toDetail(data)
        {
            if (data.payType == 1)
            {
                this.$emit("openTab",{
                    urlId: "requestFeeDetail" + data.payId,
                    urlName: '查看请款单',
                    urlPathName: '/requestFeeDetail',
                    query: {id: data.payId,type:0},
                    urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: "payOrderDetail" + data.payId,
                    urlName: '查看付款单',
                    urlPathName: '/payOrderDetail',
                    query: {id: data.payId,type:0},
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                });
            }
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"单号","model":"payNum","type":"input","isshow":true},
                {"name":"收款方全称","model":"bankAccountName","type":"input","isshow":true},
                {"name":"结算主体","model":"payTitle","type":"select","options":this.payTitleData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"类型","model":"type","type":"select","options":this.typeData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"实际付款日期","model":"payDate","type":"daterange","isshow":true},
            ]
        }
    },
}
