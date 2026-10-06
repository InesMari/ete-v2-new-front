<template>
    <div id="sporadicIncomeMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import insuranceRebateIncomeManage from './insuranceRebateIncomeManage.vue'
import insuranceIncomeSummaryManage from './insuranceIncomeSummaryManage.vue'
import wasteDisposalIncomeManage from './wasteDisposalIncomeManage.vue'
import wasteIncomeSummaryManage from './wasteIncomeSummaryManage.vue'
import scrapManage from './scrapManage.vue'

export default {
    components: {
        insuranceRebateIncomeManage,
        insuranceIncomeSummaryManage,
        wasteDisposalIncomeManage,
        wasteIncomeSummaryManage,
        scrapManage,
        notFindPage,
        innerTab
    },
    name: 'sporadicIncomeMain',
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
                if (item == 1006207 && !set.has(1006207)) {
                    this.tabs.push({name: "保险返点收入", active: false, router: 'insuranceRebateIncomeManage'});
                    set.add(1006207);
                }
                else if (item == 1006208 && !set.has(1006208)) {
                    this.tabs.push({name: "保险收入汇总", active: false, router: 'insuranceIncomeSummaryManage'});
                    set.add(1006208);
                }
                else if (item == 1006209 && !set.has(1006209)) {
                    this.tabs.push({name: "废品处理收入", active: false, router: 'wasteDisposalIncomeManage'});
                    set.add(1006209);
                }
                else if (item == 1006210 && !set.has(1006210)) {
                    this.tabs.push({name: "废品收入汇总", active: false, router: 'wasteIncomeSummaryManage'});
                    set.add(1006210);
                }
                else if (item == 1006211 && !set.has(1006211)) {
                    this.tabs.push({name: "价格维护", active: false, router: 'scrapManage'});
                    set.add(1006211);
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'insuranceIncomeSummaryManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 3 && this.tabs[i].router == 'wasteDisposalIncomeManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 4 && this.tabs[i].router == 'wasteIncomeSummaryManage') {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 5 && this.tabs[i].router == 'scrapManage') {
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
