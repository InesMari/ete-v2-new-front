<template>
    <div id="cdtRegionOrderMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px) !important;"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import coInitiated from './coInitiated.vue'
import collaborativeWarehousing from './collaborativeWarehousing.vue'

export default {
    name: 'cdtRegionOrderMain',
    props: [],
    data() {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent()
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
        openTab(item) {
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
                if (item == 1003014 && !set.has("协同发起"))
                {
                    this.tabs.push({name: "协同发起", active: false, router: 'coInitiated'});
                    set.add("协同发起");
                }
                if (item == 1003015 && !set.has("协同入仓"))
                {
                    this.tabs.push({name: "协同入仓", active: false, router: 'collaborativeWarehousing'});
                    set.add("协同入仓");
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
        coInitiated,
        collaborativeWarehousing,
        innerTab
    }
}
</script>

