import operatingDataMixin from '../operatingDataMixin.js';
export default {
    name: 'vehicleOperatingData',
    mixins: [operatingDataMixin],
    data() {
        return {
            loadParam: {
                analysisType: 2,
                year: []
            },
            budgetInfo: {
                analysisType: 2,
            },
            actualInfo: {
                analysisType: 2,
            },
        }
    },
    methods: {
        // 双击表格行
        dblclickItem(data) {
            this.$emit("openTab", {
                urlId: 'vehicleOperatingDataDetail' + data.analysisId,
                query: {
                    id: data.analysisId,
                },
                urlName: "车辆中心详情",
                urlPathName: "/vehicleOperatingDataDetail",
                urlPath: "/pt/dataReport/operatingData/vehicle/vehicleOperatingDataDetail.vue"
            });
        },
    },
}
