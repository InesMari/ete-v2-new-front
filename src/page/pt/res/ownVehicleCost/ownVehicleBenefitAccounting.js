import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js"

export default {
    name: 'ownVehicleBenefitAccounting',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "能源类型", "code": "energyTypeName", "width": "120", "type": "text"},
                {"name": "所属公司", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "购买时间", "code": "buyDate", "width": "150", "type": "text"},
                {"name": "品牌", "code": "brand", "width": "150", "type": "text"},
                {"name": "发动机号", "code": "engineNumber", "width": "150", "type": "text"},
                {"name": "车架号", "code": "vin", "width": "150", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "150", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "100", "type": "text"},
                {"name": "核定载质量", "code": "loadWeight", "width": "100", "type": "text"},
                {"name": "司机姓名", "code": "driverName", "width": "120", "type": "text"},
                {"name": "押运员姓名", "code": "supercargoName", "width": "120", "type": "text"},
                {"name": "核算月份", "code": "billMonth", "width": "150", "type": "text"},
                {"name": "公里数(km)", "code": "totalMileage", "width": "150", "type": "text"},
                {"name": "运作次数", "code": "opTimes", "width": "150", "type": "text"},
                {"name": "月度车辆折旧", "code": "depreciation", "width": "150", "type": "text"},
                {"name": "月度交强险", "code": "heavyTrafficInsurance", "width": "150", "type": "text"},
                {"name": "月度商业险", "code": "commercialInsurance", "width": "150", "type": "text"},
                {"name": "月度车船税", "code": "vehicleVesselTax", "width": "150", "type": "text"},
                {"name": "月度GPS服务费", "code": "gpsServiceCharge", "width": "150", "type": "text"},
                {"name": "月度电池租金", "code": "batteryRent", "width": "150", "type": "text"},
                {"name": "司机工资", "code": "driverSalary", "width": "150", "type": "text"},
                {"name": "司机社保", "code": "driverSocialSecurityTax", "width": "150", "type": "text"},
                {"name": "押运员工资", "code": "supercargoSalary", "width": "150", "type": "text"},
                {"name": "押运员社保", "code": "supercargoSocialSecurityTax", "width": "150", "type": "text"},
                {"name": "年审费", "code": "inspectionFee", "width": "150", "type": "text"},
                {"name": "固定成本", "code": "fixedCost", "width": "150", "type": "text"},
                {"name": "油费", "code": "oilFee", "width": "150", "type": "text"},
                {"name": "路桥费", "code": "roadBridgeFee", "width": "150", "type": "text"},
                {"name": "电费", "code": "electricFee", "width": "150", "type": "text"},
                {"name": "燃气费", "code": "gasFee", "width": "150", "type": "text"},
                {"name": "尿素", "code": "ureaFee", "width": "150", "type": "text"},
                {"name": "维修费", "code": "repairFee", "width": "150", "type": "text"},
                {"name": "保养费", "code": "maintenanceFee", "width": "150", "type": "text"},
                {"name": "轮胎费", "code": "tireFee", "width": "150", "type": "text"},
                {"name": "违章罚款", "code": "trafficViolationTicket", "width": "150", "type": "text"},
                {"name": "装卸费", "code": "loadingUnloadingFee", "width": "150", "type": "text"},
                {"name": "劳保用品", "code": "personalProtectiveEquipment", "width": "150", "type": "text"},
                {"name": "其他费", "code": "otherFee", "width": "150", "type": "text"},
                {"name": "变动成本", "code": "changeCost", "width": "150", "type": "text"},
                {"name": "订单收入", "code": "contractOrderIncomeFee", "width": "150", "type": "text"},
                {"name": "外接收入", "code": "tempOrderIncomeFee", "width": "150", "type": "text"},
                {"name": "收入合计", "code": "orderIncomeFee", "width": "150", "type": "text"},
                {"name": "毛利", "code": "gross", "width": "150", "type": "text"},
            ],
            query: {},
            supplierData: [],
        }
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
        enumData,
        myFileModel,
    },
    methods: {
        async initStaticData()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            this.$refs.table.load("vehicleBenefitAccountingService", "queryVehicleBenefitAccountingPage", this.query);
        },
        downloadExcel()
        {
            let selecctData = this.$refs.table.getSelectItem();
            if (selecctData.length == 0)
            {
                this.$message.error("请选择一条数据");
                return false;
            }

            let param = {};
            if(selecctData.length > 1){
                this.$refs.table.downloadExcelFile('单车收益核算列表');
            }
            param.id = selecctData[0].id;
            param.selfCreateUrl = 'vehicleBenefitAccountingService|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', '', 'ownVehicleBenefitAccountingTable');
        },
        print(){            
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'ownVehicleBenefitAccountingPrint' + data.id,
                query: {
                    id: data.id,
                    deviceAddress:data.deviceAddress,
                    location:data.location,
                },
                urlName: "打印单车收益表",
                urlPathName: "/ownVehicleBenefitAccountingPrint",
                urlPath: "/pt/res/ownVehicleCost/ownVehicleBenefitAccountingPrint.vue"});
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"核算月份","model":"billMonth","type":"month","isshow":true},
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "所属公司", "model": "tenantId", "type": "select", "options": this.supplierData, "label": "supplierName", "value": "tenantId", "method": "doQuery", "isshow": true},
            ]
        }
    },
}
