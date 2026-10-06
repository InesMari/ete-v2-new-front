<template>
    <div id="customerBillManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px) !important;"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import inspectRegIncome from './inspectRegIncome.vue'
import inspectRegGoods from './inspectRegGoods.vue'

export default {
    name: 'customerBillManageMain',
    props: [],
    data() {
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
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router;
        },
        openTab(item) {
            this.$emit('openTab', item);
        },
        initTabs()
        {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (item == 1005180 && !set.has("仓库来料异常登记"))
                {
                    this.tabs.push({name: "仓库来料异常登记", active: false, router: 'inspectRegIncome'});
                    set.add("仓库来料异常登记");
                }
                if (item == 1005181 && !set.has("仓库异常品登记"))
                {
                    this.tabs.push({name: "仓库异常品登记", active: false, router: 'inspectRegGoods'});
                    set.add("仓库异常品登记");
                }
            })
            if (this.tabs.length === 0)
                this.componentName = 'notFindPage';
            return this.tabs;
        },
        initComponent()
        {
            if (this.$route.query.type == 2)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.tabs[i].router == 'inspectRegGoods')
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
        inspectRegIncome,
        inspectRegGoods,
        innerTab
    }
}
</script>
