<template>
    <div id="capacityManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import vehicleManage from './vehicleManage.vue'
import driverManage from './driverManage.vue'

export default {
    name: 'capacityManageMain',
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
                if (item == 1002017 && !set.has("车辆管理"))
                {
                    this.tabs.push({name: "车辆管理", active: false, router: 'vehicleManage'});
                    set.add("车辆管理");
                }
                if (item == 1002018 && !set.has("司机管理"))
                {
                    this.tabs.push({name: "司机管理", active: false, router: 'driverManage'});
                    set.add("司机管理");
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
        vehicleManage,
        driverManage,
        notFindPage,
        innerTab
    }
}
</script>
