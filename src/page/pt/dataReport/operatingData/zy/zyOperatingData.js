import operatingDataMixin from '../operatingDataMixin.js';
export default {
    name: 'zyOperatingData',
    mixins: [operatingDataMixin],
    data() {
        return {
            loadParam: {
                analysisType: 3,
                year: []
            },
            budgetInfo: {
                analysisType: 3,
            },
            actualInfo: {
                analysisType: 3,
            },
        }
    },
    methods: {
        // 双击表格行
        dblclickItem(data) {
            this.$emit("openTab", {
                urlId: 'zyOperatingDataDetail' + data.analysisId,
                query: {
                    id: data.analysisId,
                },
                urlName: "中源运输详情",
                urlPathName: "/zyOperatingDataDetail",
                urlPath: "/pt/dataReport/operatingData/zy/zyOperatingDataDetail.vue"
            });
        },
    },
}
