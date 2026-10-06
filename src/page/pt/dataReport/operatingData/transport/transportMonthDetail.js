import operatingDataMonthDetailMixin from '../operatingDataMonthDetailMixin.js'

export default {
    name: 'transportMonthDetail',
    mixins: [operatingDataMonthDetailMixin],
    data() {
        return {
            analysisType: 1, // 运输
        }
    },
}