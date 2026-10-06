<template>
    <div id="deviceFeeMain" >
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import deviceIncomeManage from "@/page/pt/device/deviceFeeMain/deviceIncomeManage.vue";
import deviceCostManage from "@/page/pt/device/deviceFeeMain/deviceCostManage.vue";

export default {
    name: 'deviceFeeMain',
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted()
    {
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery(this.$route.query);
        });
    },
    components: {
        notFindPage,
        innerTab,
        deviceIncomeManage,
        deviceCostManage
    },
    methods:{
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
                if (item == 1012023 && !set.has("收入"))
                {
                    this.tabs.push({name: "收入", active: false, router: 'deviceIncomeManage'});
                    set.add("收入");
                }
                if (item == 1012024 && !set.has("成本"))
                {
                    this.tabs.push({name: "成本", active: false, router: 'deviceCostManage'});
                    set.add("成本");
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
            if (this.$route.query.type == 1)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.tabs[i].router == 'deviceCostManage')
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
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },

}
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>
