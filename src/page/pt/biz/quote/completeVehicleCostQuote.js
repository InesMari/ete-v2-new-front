import enumData from "@/page/pt/enum";
import queryQuoteCommon from "./queryQuoteCommon";

export default {
    name: 'completeVehicleCostQuote',
    mixins: [queryQuoteCommon],
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "180", "type": "text"},
                {"name": "报价级别", "code": "quoteLevelName", "width": "180", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "150", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "150", "type": "text"},
                {"name": "运输时效/小时", "code": "transportTimeliness", "width": "150", "type": "text"},
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "150", "type": "text"},
                {"name": "报价车型", "code": "quoteVehicleTypeName", "width": "150", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "150", "type": "text"},
                {"name": "货物", "code": "goodsName", "width": "150", "type": "text"},
                {"name": "单程运费单价/元(含税)", "code": "feePrice", "width": "150", "type": "text"},
                {"name": "往返运费单价/元(含税)", "code": "returnPrice", "width": "150", "type": "text"},
                {"name": "点位费单价/元(含税)", "code": "pointFee", "width": "150", "type": "text"},
                {"name": "中途点个数", "code": "midwayPointCount", "width": "100", "type": "text"},
                {"name": "作业线路", "code": "workName", "width": "350", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "生失效状态", "code": "validStateName", "width": "90", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"}
            ],
        }
    },
    mounted()
    {
        this.doQuery();
    },
    methods:
    {
        async doQuery(query=this.query)
        {
            this.query = query;
            this.query.quoteType = enumData.quoteType.SUPLIER;
            this.query.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;
            await this.call();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"起始地","model":"beginIndexSearchStr","type":"input","placeholder":"起始地","isshow":true},
                {"name":"目的地","model":"endIndexSearchStr","type":"input","placeholder":"目的地","isshow":true},
                {"name":"作业点","model":"workName","type":"input","placeholder":"作业点","isshow":true},
                {"name":"报价单号","model":"quoteNum","type":"input","placeholder":"报价单号","isshow":true},
                {"name":"供应商","model":"tenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
                {"name":"指定客户","model":"specifyTenantName","type":"input","placeholder":"指定客户","isshow":true},
                {"name":"报价车型","model":"quoteVehicleType","type":"select","options":this.quoteVehicleTypeData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"报价车型","method":"doQuery","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"生失效状态","model":"validState","type":"select","options":this.validStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
