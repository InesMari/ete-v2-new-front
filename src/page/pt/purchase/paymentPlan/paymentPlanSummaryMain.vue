<template>
    <div id="paymentPlanSummaryMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import paymentPlanSummaryWork from './paymentPlanSummaryWork.vue'
import paymentPlanSummaryFee from './paymentPlanSummaryFee.vue'

export default {
    name: 'paymentPlanSummaryMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: "",
        }
    },
    mounted() {
        this.initComponent();
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery(this.$route.query);
        });
    },
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.componentName = data.router;
        },
      /**
       * 初始化tabs
       * @returns {*}
       */
      initTabs()
      {
        this.tabs = [];
        let entityIds = localStorage.getItem("entityIds").split(",");
        let set = new Set();
        entityIds.forEach(item => {
          if (item == 1014048 && !set.has("按部门"))
          {
            this.tabs.push({name: "按部门", active: false, router: 'paymentPlanSummaryWork'});
            set.add("按部门");
          }
          if (item == 1014049 && !set.has("按费用类型"))
          {
            this.tabs.push({name: "按费用类型", active: false, router: 'paymentPlanSummaryFee'});
            set.add("按费用类型");
          }
        })
        if (this.tabs.length === 0)
          this.componentName = 'notFindPage';
        return this.tabs;
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
         * 初始化组件
         * @returns {*}
         */
        initComponent()
        {
            if (this.tabs.length > 0){
                this.tabs[0].active = true;
                this.componentName = this.tabs[0].router;
                this.queryPageData();
            }
        },
    },
    components: {
        paymentPlanSummaryWork,
        paymentPlanSummaryFee,
        innerTab
    }
}
</script>
