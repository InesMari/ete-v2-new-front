<template>
    <div id="standardCostMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import transportationCostMain from './transportationCostMain.vue'
import warehousingCostManage from './warehousingCostManage.vue'
import workCostManage from './workCostManage.vue'
import operateFeeManage from './operateFeeManage.vue'
import oilManage from './oilManage.vue'
import otherInfo from './otherInfo.vue'

export default {
    components: {
        transportationCostMain,
        warehousingCostManage,
        workCostManage,
        operateFeeManage,
        oilManage,
        otherInfo,
        notFindPage,
        innerTab
    },
    name: 'standardCostMain',
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
                if (item == 1006234 && !set.has(1006234)) {
                    this.tabs.push({name: "运输成本估算", active: false, router: 'transportationCostMain'});
                    set.add(1006234);
                }
                else if (item == 1006235 && !set.has(1006235)) {
                    this.tabs.push({name: "仓储成本估算", active: false, router: 'warehousingCostManage'});
                    set.add(1006235);
                }
                else if (item == 1006236 && !set.has(1006236)) {
                    this.tabs.push({name: "作业成本估算", active: false, router: 'workCostManage'});
                    set.add(1006236);
                }
                else if (item == 1006237 && !set.has(1006237)) {
                    this.tabs.push({name: "操作费维护", active: false, router: 'operateFeeManage'});
                    set.add(1006237);
                }
                else if (item == 1006238 && !set.has(1006238)) {
                    this.tabs.push({name: "费用维护-油耗", active: false, router: 'oilManage'});
                    set.add(1006238);
                }
                else if (item == 1006239 && !set.has(1006239)) {
                    this.tabs.push({name: "费用维护-其他", active: false, router: 'otherInfo'});
                    set.add(1006239);
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'warehousingCostManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 3 && this.tabs[i].router == 'workCostManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 4 && this.tabs[i].router == 'operateFeeManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 5 && this.tabs[i].router == 'oilManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 6 && this.tabs[i].router == 'otherInfo') {
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
