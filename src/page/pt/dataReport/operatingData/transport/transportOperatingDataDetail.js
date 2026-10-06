import operatingDataDetailMixin from '../operatingDataDetailMixin.js';

export default {
    name: 'transportOperatingDataDetail',
    mixins: [operatingDataDetailMixin],
    methods: {
        getDetailConfig() {
            return {
                analysisType: 1,
                urlIdPrefix: 'transportMonthDetail',
                urlName: "ETE运输中心营收实际数据详情",
                urlPathName: "/transportMonthDetail",
                urlPath: "/pt/dataReport/operatingData/transport/transportMonthDetail.vue",
                financeUrlIdPrefix: 'transportMonthFinanceDetail',
                financeUrlName: "ETE运输中心营收实际数据财务调整",
                financeUrlPathName: "/transportMonthFinanceDetail",
                financeUrlPath: "/pt/dataReport/operatingData/transport/transportMonthFinanceDetail.vue",
                exportFileName: 'transportOperatingDataDetail'
            }
        }
    },
}
