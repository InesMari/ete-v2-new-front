<template>
    <div id="customerManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import customerManage from './customerManage.vue'
import temporaryCustomerManage from './temporaryCustomerManage.vue'

export default {
    name: 'customerManageMain',
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
    components: {
        customerManage,
        temporaryCustomerManage,
        notFindPage,
        innerTab
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
                if (item == 1001097 && !set.has(1001097)) {
                    this.tabs.push({name: "合同客户", active: false, router: 'customerManage'});
                    set.add(1001097);
                } else if (item == 1001098 && !set.has(1001098)) {
                    this.tabs.push({name: "临时客户", active: false, router: 'temporaryCustomerManage'});
                    set.add(1001098);
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'temporaryCustomerManage') {
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
