import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'costSumManage',
    data() {
        return {
            head: [
                {"name": "成本发生月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "成本发生部门", "code": "orgName", "width": "250", "type": "text"},
                {"name": "含税金额", "code": "fee", "width": "120", "type": "text"},
                {"name": "已付金额", "code": "payFee", "width": "120", "type": "text"},
            ],
            loadParam: {
                billMonth:'',
                orgId:'',
            },
            orgData:[],
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
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            await this.$refs.table.load("purPayPlanTF", "queryPurPayPlanInfoCostSumPage", this.loadParam);
        },
        /**
         * 导出
         */
        download() {
            this.$refs.table.downloadExcelFile();
        },
        toDetail(){
            let selectData = this.$refs.table.getSelectItem();
            this.$emit("openTab",{
                query:selectData[0],
                urlId: 'costSumDetailManage'+new Date().getTime(),
                urlName: '实付汇总明细列表',
                urlPathName: '/costSumDetailManage',
                urlPath: "/pt/purchase/costSum/costSumDetailManage.vue",
            });
        }
    },
    computed:{
        formData(){
            return [
                {"name":"成本发生月份","model":"billMonth","type":"month","isshow":true},
                {"name":"成本发生部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","method":"doQuery","isshow":true},
            ]
        }
    },
}
