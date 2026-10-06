<template>
    <div id="meetReportMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import meetDetailReport from './meetDetailReport.vue'
import meetTotalReport from './meetTotalReport.vue'
import meetOverdueFeeDetailReport from './meetOverdueFeeDetailReport.vue'



export default {
    name: 'meetReportMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery();
        });
    },
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.componentName = data.router;
        },
        /**
         * 往上层调用打开页面的
         * @returns {*}
         */
        openTab(item)
        {
            this.$emit('openTab', item);
        },
        /**
         * 初始化tabs
         * @returns {*}
         */
        initTabs()
        {
            this.tabs = [
              {name: "应付明细表", active: false, router: 'meetDetailReport'},
              {name: "应付汇总表", active: false, router: 'meetTotalReport'},
              {name: "逾期明细汇总表", active: false, router: 'meetOverdueFeeDetailReport'},
            ];
            // let entityIds = localStorage.getItem("entityIds").split(",");
            // let set = new Set();
            // entityIds.forEach(item => {
            //     if (item == 1002017 && !set.has("车辆管理"))
            //     {
            //         this.tabs.push({name: "车辆管理", active: false, router: 'vehicleManage'});
            //         set.add("车辆管理");
            //     }
            //     if (item == 1002018 && !set.has("司机管理"))
            //     {
            //         this.tabs.push({name: "司机管理", active: false, router: 'driverManage'});
            //         set.add("司机管理");
            //     }
            // })
            if (this.tabs.length === 0)
                this.componentName = 'notFindPage';
            return this.tabs;
        },
        /**
         * 初始化组件
         * @returns {*}
         */
        initComponent()
        {
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
      meetDetailReport,
      meetTotalReport,
      meetOverdueFeeDetailReport,
      notFindPage,
      innerTab
    }
}
</script>
