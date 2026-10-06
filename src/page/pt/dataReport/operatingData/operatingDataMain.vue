<template>
    <div id="fcSalesMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import transportOperatingData from "@/page/pt/dataReport/operatingData/transport/transportOperatingData.vue";
import vehicleOperatingData from "@/page/pt/dataReport/operatingData/vehicle/vehicleOperatingData.vue";
import zyOperatingData from "@/page/pt/dataReport/operatingData/zy/zyOperatingData.vue";
import operatingDataSummary from "@/page/pt/dataReport/operatingData/summary/operatingDataSummary.vue";

export default {
    name: 'fcSalesMain',
    props: [],
    data() {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
        
    },
    methods: {
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router;
        },
        /**
         * 往上层调用打开页面的
         * @returns {*}
         */
        openTab(item) {
            this.$emit('openTab', item);
        },
        /**
         * 初始化tabs
         * @returns {*}
         */
        initTabs() {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (item == 1007148 && !set.has("ETE运输中心")) {
                    this.tabs.push({ name: "ETE运输中心", active: false, router: 'transportOperatingData' });
                    set.add("ETE运输中心");
                }
                if (item == 1007149 && !set.has("ETF车辆中心")) {
                    this.tabs.push({ name: "ETF车辆中心", active: false, router: 'vehicleOperatingData' });
                    set.add("ETF车辆中心");
                }
                if (item == 1007150 && !set.has("中源运输中心")) {
                    this.tabs.push({ name: "中源运输中心", active: false, router: 'zyOperatingData' });
                    set.add("中源运输中心");
                }
                if (item == 1007151 && !set.has("数据汇总")) {
                    this.tabs.push({ name: "数据汇总", active: false, router: 'operatingDataSummary' });
                    set.add("数据汇总");
                }
            })
            if (this.tabs.length == 0) {
                this.componentName = 'notFindPage';
            }
            return this.tabs;
        },
        /**
         * 初始化组件
         * @returns {*}
         */
        initComponent() {
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
        transportOperatingData,
        vehicleOperatingData,
        zyOperatingData,
        operatingDataSummary,
        notFindPage,
        innerTab
    }
}
</script>
