<template>
    <div id="businessAnalysisMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import budgetManage from './budget/budgetManage.vue'
import actualManage from './actual/actualManage.vue'
import reportCenter from './report/reportCenter.vue'

export default {
    name: 'businessAnalysisMain',
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
                if (item == 1007110 && !set.has("预算")) {
                    this.tabs.push({name: "预算", active: false, router: 'budgetManage'});
                    set.add("预算");
                }
                if (item == 1007111 && !set.has("实绩")) {
                    this.tabs.push({name: "实绩", active: false, router: 'actualManage'});
                    set.add("实绩");
                }
                if (item == 1007112 && !set.has("数据分析")) {
                    this.tabs.push({name: "数据分析", active: false, router: 'reportCenter'});
                    set.add("数据分析");
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'actualManage')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 3 && this.tabs[i].router == 'reportCenter')
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
      budgetManage,
      actualManage,
      reportCenter,
      notFindPage,
      innerTab
    }
}
</script>
