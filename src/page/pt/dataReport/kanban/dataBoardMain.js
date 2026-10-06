export default {
    name: 'dataBoardMain',
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        go(type){
            switch(type){
                case 1:
                    this.$emit("openTab",{
                        urlId: 'warehouseCostIncome',
                        query: {},
                        urlName: "仓库成本收入",
                        urlPathName: "/warehouseCostIncome",
                        urlPath: "/pt/dataReport/kanban/warehouseCostIncome.vue"});
                    break;
                case 2:
                    this.$emit("openTab",{
                        urlId: 'inspectData',
                        query: {},
                        urlName: "巡检数据看板",
                        urlPathName: "/inspectData",
                        urlPath: "/pt/dataReport/kanban/inspectData.vue"});
                    break;
                case 3:
                    this.$emit("openTab",{
                        urlId: 'wmsOperate',
                        query: {},
                        urlName: "仓储运作数据看板",
                        urlPathName: "/wmsOperate",
                        urlPath: "/pt/dataReport/kanban/wmsOperate.vue"});
                    break;
                case 4:
                        let url = window.location.origin + '/orderBoard'
                        window.open(url,"_blank")
                    break;
            }
        },
    },
}
