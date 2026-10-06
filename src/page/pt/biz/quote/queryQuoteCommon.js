import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'queryQuoteCommon',
    data()
    {
        return {
            query: this.initQuery(),//查询条件
            vehicleLengthData:[],//车长
            quoteVehicleTypeData:[],//车型
            verifyStateData:[],//审核状态
            validStateData:[],//生失效状态
            tenantData:[],
            supplierData: [],
        }
    },
    mounted()
    {
        this.init();
    },
    components:
    {
        tableCommon,
        myImport,
        searchList,
    },
    methods:
    {
        initQuery()
        {
            return this.query = {
                tenantId: '',
                tenantName: '',
                workName: '',
                specifyTenantName: '',
                beginIndexSearchStr: '',
                endIndexSearchStr: '',
                quoteVehicleType: null,
                vehicleLength: null,
                validState:null,
                quoteType: null,
                quoteSubType: null,
            };
        },
        async init()
        {
            this.tenantData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.validStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VALID_STATE"});
        },
        async call()
        {
            let {items} = await this.$refs.table.load("ZCQuoteNewTF", "queryQuotePage", this.query);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        dblclickItem(data){},
    },
}
