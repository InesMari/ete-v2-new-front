<template>
    <div id="ownVehicleCostCapacityManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"

import vehicleFixedCostManage from './ownVehicleCost/vehicleFixedCostManage.vue'
import vehicleWaybillCostManage from './ownVehicleCost/vehicleWaybillCostManage.vue'
import vehicleRepairCostManage from './ownVehicleCost/vehicleRepairCostManage.vue'
import staffCostManage from './ownVehicleCost/staffCostManage.vue'
import vehicleAnnualInspectionManage from './ownVehicleCost/vehicleAnnualInspectionManage.vue'

export default {
	beforeRouteEnter(to, from, next)
	{
        next(async that => {
            //从自有车运力统计跳转需要带参查询
            if(from.path.indexOf('ownVehicleStatistics') > -1){
                let query = that.$route.query;
                if(query && query.expirationStatus){
                    query.expirationStatus = query.expirationStatus.split(',').map(String);
                }
                try
                {
                    that.$refs.ref.doQuery(query);
                }
                catch (e)
                {
                    const timer = setTimeout(() => {
                        that.$refs.ref.doQuery(query);
                        clearTimeout(timer);
                    }, 3000)
                }
            }else{
                try
                {
                    that.$refs.ref.doQuery();
                }
                catch (e)
                {
                    const timer = setTimeout(() => {
                        that.$refs.ref.doQuery();
                        clearTimeout(timer);
                    }, 3000)
                }
            }
        });
	},
    name: 'ownVehicleCostCapacityManageMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
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
                if (item == 1002129 && !set.has(1002129))
                {
                    this.tabs.push({name: "车辆月度固定成本", active: false, router: 'vehicleFixedCostManage'});
                    set.add(1002129);
                }
                else if (item == 1002130 && !set.has(1002130))
                {
                    this.tabs.push({name: "车辆变动成本", active: false, router: 'vehicleWaybillCostManage'});
                    set.add(1002130);
                }
                else if (item == 1002131 && !set.has(1002131))
                {
                    this.tabs.push({name: "车辆修理成本", active: false, router: 'vehicleRepairCostManage'});
                    set.add(1002131);
                }
                else if (item == 1002132 && !set.has(1002132))
                {
                    this.tabs.push({name: "人员成本", active: false, router: 'staffCostManage'});
                    set.add(1002132);
                }
                else if (item == 1002201 && !set.has(1002201))
                {
                    this.tabs.push({name: "年检记录", active: false, router: 'vehicleAnnualInspectionManage'});
                    set.add(1002201);
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'vehicleRepairCostManage')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 4 && this.tabs[i].router == 'vehicleAnnualInspectionManage')
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
        vehicleFixedCostManage,
        vehicleWaybillCostManage,
        vehicleRepairCostManage,
        staffCostManage,
        vehicleAnnualInspectionManage,
        notFindPage,
        innerTab
    }
}
</script>
