<template>
    <div id="purchaseOrderMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import purchaseOrderManage from './purchaseOrderManage.vue'
import purchaseOrderDtlManage from './purchaseOrderDtlManage.vue'

export default {
    name: 'purchaseOrderMain',
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
                if (item == 1014072 && !set.has("汇总表"))
                {
                    this.tabs.push({name: "汇总表", active: false, router: 'purchaseOrderManage'});
                    set.add("汇总表");
                }
                if (item == 1014073 && !set.has("明细表"))
                {
                    this.tabs.push({name: "明细表", active: false, router: 'purchaseOrderDtlManage'});
                    set.add("明细表");
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
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
      purchaseOrderManage,
      purchaseOrderDtlManage,
      notFindPage,
      innerTab
    }
}
</script>
