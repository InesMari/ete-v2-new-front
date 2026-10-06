import operatingDataMonthDetailMixin from '../operatingDataMonthDetailMixin.js'

export default {
    name: 'transportMonthFinanceDetail',
    mixins: [operatingDataMonthDetailMixin],
    data() {
        return {
            analysisType: 1, // 运输
        }
    },
}