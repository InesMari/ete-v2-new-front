import operatingDataMonthDetailMixin from '../operatingDataMonthDetailMixin.js'

export default {
    name: 'vehicleMonthDetail',
    mixins: [operatingDataMonthDetailMixin],
    data() {
        return {
            analysisType: 2, // 车辆
        }
    },
}