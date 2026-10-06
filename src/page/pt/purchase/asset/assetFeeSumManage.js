import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'assetFeeSumManage',
    data() {
        return {
            head: [
                {"name": "所在地", "code": "locationWorkName", "width": "200", "type": "text"},
                {"name": "供应商名称", "code": "supplierTenantName", "width": "200", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "100", "type": "text"},
                {"name": "资产类别", "code": "assetClassName", "width": "100", "type": "text"},
                {"name": "费用月份", "code": "billMonth", "width": "100", "type": "text"},
                {"name": "未税月费用", "code": "amount", "width": "100", "type": "text"},
                {"name": "含税月费用", "code": "amountWithTax", "width": "100", "type": "text"},
            ],
            loadParam: {
                workId:'',
                supplierTenantId:'',
                payType:'',
                billingMonth:[],
                assetClass:'',
            },
            locationData:[],
            supplierTenantData:[],
            payTypeData:[],
            assetClassData:[],
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
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'ASSET_PAY_TYPE,ASSET_CLASS'});
            this.payTypeData = data.ASSET_PAY_TYPE;
            this.assetClassData = data.ASSET_CLASS;
            this.locationData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            this.supplierTenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
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
            await this.$refs.table.load("assetTF", "queryAssetFeeSumPage", this.loadParam);
        },
        dblclickAssetFeeInfo(item){
            this.open({
                query:{locationId:item.locationId,supplierTenantId:item.supplierTenantId,payType:item.payType,assetClass:item.assetClass,billMonth:item.billMonth},
                urlId: 'assetFeeManage' + new Date().getTime(),
                urlName: '资产费用详情',
                urlPathName: '/assetFeeManage',
                urlPath: "/pt/purchase/asset/assetFeeManage.vue",
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
                {"name":"所在地","model":"workId","type":"select","options":this.locationData,"label":"workName","value":"workId","placeholder":"所在地","method":"doQuery","isshow":true},
                {"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierTenantData,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true},
                {"name":"付款类型","model":"payType","type":"select","options":this.payTypeData,"label":"codeName","value":"codeValue","placeholder":"付款类型","method":"doQuery","isshow":true},
                {"name":"费用月份","model":"billingMonth","type":"monthrange","isshow":true},
                {"name":"资产类别","model":"assetClass","type":"select","options":this.assetClassData,"label":"codeName","value":"codeValue","placeholder":"资产类别","method":"doQuery","isshow":true},
            ]
        }
    },
}
