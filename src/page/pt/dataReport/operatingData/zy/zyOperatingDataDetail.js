import operatingDataDetailMixin from '../operatingDataDetailMixin.js';

export default {
    name: 'zyOperatingDataDetail',
    mixins: [operatingDataDetailMixin],
    methods: {
        getDetailConfig() {
            return {
                analysisType: 3,
                urlIdPrefix: 'zyMonthDetail',
                urlName: "中源运输中心营收实际数据详情",
                urlPathName: "/zyMonthDetail",
                urlPath: "/pt/dataReport/operatingData/zy/zyMonthDetail.vue",
                financeUrlIdPrefix: 'zyMonthFinanceDetail',
                financeUrlName: "中源运输中心营收实际数据财务调整",
                financeUrlPathName: "/zyMonthFinanceDetail",
                financeUrlPath: "/pt/dataReport/operatingData/zy/zyMonthFinanceDetail.vue",
                exportFileName: 'zyOperatingDataDetail'
            }
        }
    },
}
