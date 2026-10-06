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
import fcBudgetSalesManage from "@/page/pt/dataReport/sales/budget/fcBudgetSalesManage.vue";
import fcActualSalesManage from "@/page/pt/dataReport/sales/actual/fcActualSalesManage.vue";
import budgetAchievement from "@/page/pt/dataReport/sales/budgetAchievement/budgetAchievement.vue";

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
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (item == 1007058 && !set.has("预算营收"))
                {
                    this.tabs.push({name: "预算营收", active: false, router: 'fcBudgetSalesManage'});
                    set.add("预算营收");
                }
                if (item == 1007059 && !set.has("实际营收"))
                {
                    this.tabs.push({name: "实际营收", active: false, router: 'fcActualSalesManage'});
                    set.add("实际营收");
                }
              if (item == 1007060 && !set.has("预算达成"))
              {
                this.tabs.push({name: "预算达成", active: false, router: 'budgetAchievement'});
                set.add("预算达成");
              }
            })
            if(this.tabs.length==0){
              this.componentName='notFindPage';
            }
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
      fcBudgetSalesManage,
      fcActualSalesManage,
      budgetAchievement,
      notFindPage,
      innerTab
    }
}
</script>
