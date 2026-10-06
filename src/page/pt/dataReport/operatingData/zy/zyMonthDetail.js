import operatingDataMonthDetailMixin from '../operatingDataMonthDetailMixin.js'

export default {
    name: 'zyMonthDetail',
    mixins: [operatingDataMonthDetailMixin],
    data() {
        return {
            analysisType: 3, // 中源
        }
    },
}