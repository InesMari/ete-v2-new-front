<template>
    <div id="ownVehicleCapacityManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import ownVehicleManage from './ownVehicle/ownVehicleManage.vue'
import ownTrailerManage from './ownVehicle/ownTrailerManage.vue'
import ownDriverManage from './ownVehicle/ownDriverManage.vue'
import supercargoManage from './ownVehicle/supercargoManage.vue'
import driverAssessmentManage from './ownVehicle/driverAssessmentManage.vue'

export default {
    name: 'ownVehicleCapacityManageMain',
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
                if (item == 1002111 && !set.has(1002111))
                {
                    this.tabs.push({name: "车辆管理", active: false, router: 'ownVehicleManage'});
                    set.add(1002111);
                }
                if (item == 1002222 && !set.has(1002222))
                {
                    this.tabs.push({name: "挂车管理", active: false, router: 'ownTrailerManage'});
                    set.add(1002222);
                }
                else if (item == 1002112 && !set.has(1002112))
                {
                    this.tabs.push({name: "司机管理", active: false, router: 'ownDriverManage'});
                    set.add(1002112);
                }
                else if (item == 1002113 && !set.has(1002113))
                {
                    this.tabs.push({name: "押运员管理", active: false, router: 'supercargoManage'});
                    set.add(1002113);
                }
                else if (item == 1002114 && !set.has(1002114))
                {
                    this.tabs.push({name: "司机考评管理", active: false, router: 'driverAssessmentManage'});
                    set.add(1002114);
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
            //跳转展示
            if (this.$route.query.openTab > 1)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.$route.query.openTab == 3 && this.tabs[i].router == 'ownDriverManage')
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
        ownVehicleManage,
        ownTrailerManage,
        ownDriverManage,
        supercargoManage,
        driverAssessmentManage,
        notFindPage,
        innerTab
    }
}
</script>
