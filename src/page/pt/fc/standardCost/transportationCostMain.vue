<template>
    <div id="transportationCostMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import transportationCostOwnManage from './transportationCostOwnManage.vue'
import transportationCostOutManage from './transportationCostOutManage.vue'

export default {
    components: {
        transportationCostOwnManage,
        transportationCostOutManage,
        notFindPage,
        innerTab
    },
    name: 'transportationCostMain',
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
        doQuery()
        {
            try {
                this.$refs.ref.doQuery();
            } catch (e) {
                setTimeout(() => {
                    this.$refs.ref.doQuery();
                }, 3000)
            }
        },
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
                if (item == 1006240 && !set.has(1006240)) {
                    this.tabs.push({name: "自有车", active: false, router: 'transportationCostOwnManage'});
                    set.add(1006240);
                }
                else if (item == 1006241 && !set.has(1006241)) {
                    this.tabs.push({name: "外包", active: false, router: 'transportationCostOutManage'});
                    set.add(1006241);
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
        initComponent() {
            //跳转展示
            if (this.$route.query.openTab > 1) {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'transportationCostOutManage') {
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

}
</script>
