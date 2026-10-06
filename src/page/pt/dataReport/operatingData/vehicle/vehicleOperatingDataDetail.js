import operatingDataDetailMixin from '../operatingDataDetailMixin.js';

export default {
    name: 'vehicleOperatingDataDetail',
    mixins: [operatingDataDetailMixin],
    methods: {
        getDetailConfig() {
            return {
                analysisType: 2,
                urlIdPrefix: 'vehicleMonthDetail',
                urlName: "ETE车辆中心营收实际数据详情",
                urlPathName: "/vehicleMonthDetail",
                urlPath: "/pt/dataReport/operatingData/vehicle/vehicleMonthDetail.vue",
                exportFileName: 'vehicleOperatingDataDetail'
            }
        }
    },
}
