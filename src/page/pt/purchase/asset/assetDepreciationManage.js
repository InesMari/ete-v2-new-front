import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'assetDepreciationManage',
    data() {
        return {
            head: [
                {"name": "资产名称", "code": "assetName", "width": "150", "type": "text"},
                {"name": "费用月份", "code": "depreciationMonth", "width": "100", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "100", "type": "text"},
                {"name": "资产类别", "code": "assetClassName", "width": "100", "type": "text"},
                // {"name": "所在地", "code": "locationWorkName", "width": "200", "type": "text"},
                {"name": "供应商名称", "code": "supplierTenantName", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "部门", "code": "settleOrgName", "width": "150", "type": "text"},
                {"name": "计费数量", "code": "billingNum", "width": "100", "type": "text"},
                {"name": "总期数", "code": "depreciationMonths", "width": "100", "type": "text"},
                {"name": "折旧月费用", "code": "depreciatedCost", "width": "100", "type": "text"},
            ],
            loadParam: {
                workId:'',
                supplierTenantId:'',
                payType:'',
                assetName:'',
                settleBody:'',
                settleOrgId:'',
                billingMonth:[],
                isEntryAcct:'',
                isPay:'',
                assetClass:'',
            },
            locationData:[],
            supplierTenantData:[],
            payTypeData:[],
            settleBodyData:[],
            assetClassData:[],
            whetherData:[],
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
        myImport,
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData() {
            if(this.loadParam.billingMonth.length==0){
                let month = this.common.getYearMonths()[0].codeValue;
                this.loadParam.billingMonth = [month,month];
            }
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'ASSET_PAY_TYPE,PAY_TITLE,ASSET_CLASS,WHETHER'});
            this.payTypeData = data.ASSET_PAY_TYPE;
            this.settleBodyData = data.PAY_TITLE;
            this.assetClassData = data.ASSET_CLASS;
            this.whetherData = data.WHETHER;
            this.locationData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.supplierTenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.billingMonth) && this.loadParam.billingMonth.length == 2) {
                this.loadParam.billingStartMonth = this.loadParam.billingMonth[0];
                this.loadParam.billingEndMonth = this.loadParam.billingMonth[1];
            } else {
                this.loadParam.billingStartMonth = '';
                this.loadParam.billingEndMonth = '';
            }
            await this.$refs.table.load("assetTF", "queryAssetDepreciationDetailPage", this.loadParam);
        },
        dblclickAssetDepreciationInfo(item){
            this.open({
                query:{id:item.id,assetId:item.assetId},
                urlId: 'assetDepreciationDetail' + item.id,
                urlName: '资产折旧详情',
                urlPathName: '/assetDepreciationDetail',
                urlPath: "/pt/purchase/asset/assetDepreciationDetail.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        downloadExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                // {"name":"所在地","model":"workId","type":"select","options":this.locationData,"label":"workName","value":"workId","placeholder":"所在地","method":"doQuery","isshow":true},
                {"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierTenantData,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true},
                {"name":"付款类型","model":"payType","type":"select","options":this.payTypeData,"label":"codeName","value":"codeValue","placeholder":"付款类型","method":"doQuery","isshow":true},
                {"name":"费用月份","model":"billingMonth","type":"monthrange","isshow":true},
                {"name":"资产名称","model":"assetName","type":"input","placeholder":"资产名称","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"部门","model":"settleOrgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"组织","method":"doQuery","isshow":true},
                {"name":"资产类别","model":"assetClass","type":"select","options":this.assetClassData,"label":"codeName","value":"codeValue","placeholder":"资产类别","method":"doQuery","isshow":true},
            ]
        }
    },
}
