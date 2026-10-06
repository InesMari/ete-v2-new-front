import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'accrualInfoManage',
    props: [],
    data() {
        return {
            head: [
                {"name": "部门", "code": "orgName", "width": "180", "type": "text"},
                {"name": "费用月份", "code": "accrualMonth", "width": "120", "type": "text"},
                {"name": "成本类别", "code": "accrualCostTypeName", "width": "150", "type": "text"},
                {"name": "成本费目", "code": "accrualCostSubTypeName", "width": "150", "type": "text"},
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
                month:'',
                startMonth:'',
                endMonth:'',
                accrualCostTypeData:[],
                accrualCostType:'',
                accrualCostSubType:'',
            },
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            orgData:[],
            accrualCostTypeData:[],
            accrualCostSubTypeData:[],
            accrualCostTypeTreeData:[],
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
            let accrualCostTypeData = this.query.accrualCostTypeData;
            if(this.common.isNotBlank(accrualCostTypeData) && accrualCostTypeData.length > 0) {
                this.query.accrualCostType = accrualCostTypeData[0];
                if (accrualCostTypeData.length > 1) {
                    this.query.accrualCostSubType = accrualCostTypeData[1];
                }else{
                    this.query.accrualCostSubType = '';
                }
            }else{
                this.query.accrualCostType = '';
                this.query.accrualCostSubType = '';
            }
            this.$refs.table.load("fcAccrualTF", "queryFcAccrualInfoPage", this.query);
        },
        /**
         * 初始化数据
         */
        async initData() {
            this.orgData = await this.common.postUrl("regionOrgTF", "queryAllWorkOrgData", {});
            this.accrualCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_TYPE"});
            this.accrualCostSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_SUB_TYPE"});
            this.accrualCostTypeTreeData = [];
            this.accrualCostTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.accrualCostSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue) {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.accrualCostTypeTreeData.push(data);
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
                    accrualCostTypeData:[],
                    accrualCostType:'',
                    accrualCostSubType:'',
                };
        },
        /**
         * 导出EXCEL
         */
        download() {
            this.$refs.table.downloadExcelFile("仓储成本计提明细列表");
        },
    },
    computed: {
        formData() {
            return [
                {"name":"部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"部门","method":"doQuery","isshow":true},
                {"name":"费用月份","model":"month","type":"monthrange","isshow":true},
                {"name":"成本类型","model":"accrualCostTypeData","type":"cascader","options":this.accrualCostTypeTreeData,"props":this.props,"placeholder":"成本类型","method":"doQuery","isshow":true},
            ]
        }
    },
}
