<template>
    <div id="quoteManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import completeVehicleIncomeQuote from './completeVehicleIncomeQuote.vue'
import completeVehicleCostQuote from './completeVehicleCostQuote.vue'
import lessThanTruckloadVehicleIncomeQuote from './lessThanTruckloadVehicleIncomeQuote.vue'
import lessThanTruckloadVehicleCostQuote from './lessThanTruckloadVehicleCostQuote.vue'

export default {
    name: 'quoteManageMain',
    props: [],
    data() {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
        this.initComponent();
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery(this.$route.query);
        });
    },
    methods: {
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router
        },
        openTab(item) {
            this.$emit('openTab', item);
        },
        initTabs() {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (!set.has("整车收入报价")) {
                    this.tabs.push({name: "整车收入报价", active: false, router: 'completeVehicleIncomeQuote'});
                    set.add("整车收入报价");
                }
                if (!set.has("整车成本报价")) {
                    this.tabs.push({name: "整车成本报价", active: false, router: 'completeVehicleCostQuote'});
                    set.add("整车成本报价");
                }
                if (!set.has("零担收入报价")) {
                    this.tabs.push({name: "零担收入报价", active: false, router: 'lessThanTruckloadVehicleIncomeQuote'});
                    set.add("零担收入报价");
                }
                if (!set.has("零担成本报价")) {
                    this.tabs.push({name: "零担成本报价", active: false, router: 'lessThanTruckloadVehicleCostQuote'});
                    set.add("零担成本报价");
                }
            })
            if (this.tabs.length === 0)
                this.componentName = 'notFindPage';
            return this.tabs;
        },
        initComponent()
        {
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
        completeVehicleIncomeQuote,
        completeVehicleCostQuote,
        lessThanTruckloadVehicleIncomeQuote,
        lessThanTruckloadVehicleCostQuote,
        notFindPage,
        innerTab
    }
}
</script>
