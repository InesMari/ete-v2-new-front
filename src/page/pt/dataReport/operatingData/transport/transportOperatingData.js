import operatingDataMixin from '../operatingDataMixin.js';
export default {
    name: 'transportOperatingData',
    mixins: [operatingDataMixin],
    data() {
        return {
            loadParam: {
                analysisType: 1,
                year: []
            },
            budgetInfo: {
                analysisType: 1,
            },
            actualInfo: {
                analysisType: 1,
            },
        }
    },
    methods: {
        // 双击表格行
        dblclickItem(data) {
            this.$emit("openTab", {
                urlId: 'transportOperatingDataDetail' + data.analysisId,
                query: {
                    id: data.analysisId,
                },
                urlName: "运输中心详情",
                urlPathName: "/transportOperatingDataDetail",
                urlPath: "/pt/dataReport/operatingData/transport/transportOperatingDataDetail.vue"
            });
        },
    },
}
