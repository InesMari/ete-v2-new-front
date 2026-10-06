import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'costSumDetailManage',
    data() {
        return {
            head: [
                {"name": "成本发生月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "成本发生部门", "code": "orgName", "width": "250", "type": "text"},
                {"name": "费用类型", "code": "feeNames", "width": "150", "type": "text"},
                {"name": "品名/项目", "code": "projectName", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "150", "type": "text"},
                {"name": "数量", "code": "nums", "width": "150", "type": "text"},
                {"name": "单价", "code": "price", "width": "150", "type": "text"},
                {"name": "含税金额", "code": "fee", "width": "120", "type": "text"},
                {"name": "已付金额", "code": "payFee", "width": "120", "type": "text"},
            ],
            loadParam: {
                billMonth:this.$route.query.billMonth,
                orgId:parseInt(this.$route.query.orgId),
                feeType:'',
                feeTypeData:[],
                feeSubType:'',
            },
            feeTypeData:[],
            feeSubTypeData:[],
            orgData:[],
            enumData: enumData,
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
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
        async initStaticData() {
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
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
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            let feeTypeData = this.loadParam.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.loadParam.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.loadParam.feeSubType = feeTypeData[1];
                }else{
                    this.loadParam.feeSubType = '';
                }
            }else{
                this.loadParam.feeType = '';
                this.loadParam.feeSubType = '';
            }
            await this.$refs.table.load("purPayPlanTF", "queryPurPayPlanInfoCostSumDetailPage", this.loadParam);
        },
        /**
         * 导出
         */
        download() {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"成本发生月份","model":"billMonth","type":"month","isshow":true},
                {"name":"成本发生部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","method":"doQuery","isshow":true},
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"费用类型","method":"doQuery","isshow":true},
            ]
        }
    },
}
