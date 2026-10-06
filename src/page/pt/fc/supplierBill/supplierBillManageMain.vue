<template>
    <div id="supplierBillManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import unconfirmedBill from './unconfirmedBill.vue'
import confirmedBill from './confirmedBill.vue'

export default {
    name: 'supplierBillManageMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted()
    {
    },
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.componentName = data.router;
        },
        openTab(item)
        {
            this.$emit('openTab', item);
        },
        initTabs()
        {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item =>
            {
                if (item == 1006047 && !set.has("1006047"))
                {
                    this.tabs.push({name: "未审核", active: false, router: 'unconfirmedBill'});
                    set.add("1006047");
                }
                if (item == 1006048 && !set.has("1006048"))
                {
                    this.tabs.push({name: "已审核", active: false, router: 'confirmedBill'});
                    set.add("1006048");
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'confirmedBill')
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
        unconfirmedBill,
        confirmedBill,
        innerTab
    }
}
</script>
