<template>
    <div id="inspectStatisticsManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import inspectStatisticsManageByMonth from './inspectStatisticsManageByMonth.vue'
import inspectStatisticsManageByYear from './inspectStatisticsManageByYear.vue'

export default {
    name: 'inspectStatisticsManageMain',
    props: [],
    data() {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
      this.initComponent();
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
        openTab(item)
        {
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
                if (item == 1005284 && !set.has("按月份")) {
                    this.tabs.push({name: "按月份", active: false, router: 'inspectStatisticsManageByMonth'});
                    set.add("按月份");
                }
                if (item == 1005285 && !set.has("按年份")) {
                    this.tabs.push({name: "按年份", active: false, router: 'inspectStatisticsManageByYear'});
                    set.add("按年份");
                }
            })
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
            //审核跳转展示
            if (this.$route.query.openTab > 1)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'inspectStatisticsManageByYear')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                }
            }
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
        inspectStatisticsManageByMonth,
        inspectStatisticsManageByYear,
        notFindPage,
        innerTab
    }
}
</script>
