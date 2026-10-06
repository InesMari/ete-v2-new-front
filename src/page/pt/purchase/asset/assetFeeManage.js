import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import cosole from "decimal.js";

export default {
    name: 'assetFeeManage',
    data() {
        return {
            head: [
                {"name": "资产名称", "code": "assetName", "width": "150", "type": "text"},
                {"name": "费用月份", "code": "billMonth", "width": "100", "type": "text"},
                {"name": "当前期数", "code": "periods", "width": "100", "type": "text"},
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "diy"},
                {"name": "合同起始日期", "code": "beginDate", "width": "120", "type": "text"},
                {"name": "合同截止日期", "code": "endDate", "width": "120", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "100", "type": "text"},
                {"name": "资产类别", "code": "assetClassName", "width": "100", "type": "text"},
                {"name": "所在地", "code": "locationWorkName", "width": "200", "type": "text"},
                {"name": "供应商名称", "code": "supplierTenantName", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "部门", "code": "settleOrgName", "width": "150", "type": "text"},
                {"name": "计费数量", "code": "billingNum", "width": "100", "type": "text"},
                {"name": "总期数", "code": "billingPeriods", "width": "100", "type": "text"},
                {"name": "含税单价", "code": "priceWithTax", "width": "100", "type": "text"},
                {"name": "未税月费用", "code": "amount", "width": "100", "type": "text"},
                {"name": "含税月费用", "code": "amountWithTax", "width": "100", "type": "text"},
                {"name": "是否入账", "code": "isEntryAcctName", "width": "80", "type": "text"},
                {"name": "是否支付", "code": "isPayName", "width": "80", "type": "text"},
            ],
            loadParam: {
                workId:this.common.isNotBlank(this.$route.query.locationId)?Number(this.$route.query.locationId):'',
                supplierTenantId:this.common.isNotBlank(this.$route.query.supplierTenantId)?Number(this.$route.query.supplierTenantId):'',
                payType:this.common.isNotBlank(this.$route.query.payType)?this.$route.query.payType:'',
                assetName:'',
                settleBody:'',
                settleOrgId:'',
                billingMonth:this.common.isNotBlank(this.$route.query.billMonth)?[this.$route.query.billMonth,this.$route.query.billMonth]:[],
                isEntryAcct:'',
                isPay:'',
                assetClass:this.common.isNotBlank(this.$route.query.assetClass)?this.$route.query.assetClass:'',
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
            await this.$refs.table.load("assetTF", "queryAssetFeeDetailPage", this.loadParam);
        },
        dblclickAssetFeeInfo(item){
            this.open({
                query:{id:item.id,assetId:item.assetId},
                urlId: 'assetFeeDetail' + item.id,
                urlName: '资产费用详情',
                urlPathName: '/assetFeeDetail',
                urlPath: "/pt/purchase/asset/assetFeeDetail.vue",
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
        toContract(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }else if(item.contractType==6){
                baseTitle = "供应商-其他";
            }
            let title = "查看"+baseTitle+"合同";
            this.open({
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
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
                {"name":"资产名称","model":"assetName","type":"input","placeholder":"资产名称","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"部门","model":"settleOrgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"组织","method":"doQuery","isshow":true},
                {"name":"是否入账","model":"isEntryAcct","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
                {"name":"是否支付","model":"isPay","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否支付","method":"doQuery","isshow":true},
                {"name":"资产类别","model":"assetClass","type":"select","options":this.assetClassData,"label":"codeName","value":"codeValue","placeholder":"资产类别","method":"doQuery","isshow":true},
            ]
        }
    },
}
