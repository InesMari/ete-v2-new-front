import operatingDataMonthDetailMixin from '../operatingDataMonthDetailMixin.js'

export default {
    name: 'zyMonthFinanceDetail',
    mixins: [operatingDataMonthDetailMixin],
    data() {
        return {
            analysisType: 3, // 运输
        }
    },
}