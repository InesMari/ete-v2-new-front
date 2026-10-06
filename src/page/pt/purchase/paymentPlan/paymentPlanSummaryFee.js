import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import rankChart from "@/components/rankChart/rankChart.vue";

export default {
    name: 'paymentPlanSummaryFee',
    data() {
        return {
            head: [
                {"name": "月份", "code": "billMonth", "width": "150", "type": "text"},
                {"name": "部门名称", "code": "orgName", "width": "300", "type": "text"},
                {"name": "费用类型", "code": "feeSubTypeName", "width": "300", "type": "text"},
                {"name": "金额", "code": "fee", "width": "150", "type": "text"},
            ],
            query: {
                billMonth:[],
                orgIds:[],
                feeTypeData:[],
                feeType:'',
                feeSubType:'',
            },
            orgData: [],
            feeTypeData: [],
            feeSubTypeData: [],
            treeData:[],
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
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.treeData = [];
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })
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
            let feeTypeData = this.query.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.query.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.query.feeSubType = feeTypeData[1];
                }else{
                    this.query.feeSubType = '';
                }
            }else{
                this.query.feeType = '';
                this.query.feeSubType = '';
            }
            await this.$refs.table.load("purPayPlanTF", "queryPurPayPlanInfoGroupFeeTypePage", this.query);
            this.chartData = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanInfoGroupFeeType", this.query);
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
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":{ checkStrictly: true,value: 'codeValue',label: 'codeName' },"placeholder":"费用类型","method":"doQuery","isshow":true},

            ]
        }
    },
}
