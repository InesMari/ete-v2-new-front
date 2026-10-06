<template>
    <div id="contractReviewManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px) !important;"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import customerContractReviewManage from './customerContractReviewManage.vue'
import supplierContractReviewManage from './supplierContractReviewManage.vue'

export default {
    name: 'contractReviewManageMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
        }
    },
    mounted() {
        this.initComponent();
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery();
        });
    },
    methods: {
        selectCallback(data)
        {
            this.tab = data;
            this.componentName = data.router;
            this.openFlg = 0;
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
            entityIds.forEach(item =>
            {
                if (item == 1011046 && !set.has("customerContractReviewManage"))
                {
                    this.tabs.push({name: "客户合同评审", active: false, router: 'customerContractReviewManage'});
                    set.add("customerContractReviewManage");
                }
                else if (item == 1011047 && !set.has("supplierContractReviewManage"))
                {
                    this.tabs.push({name: "供应商合同评审", active: false, router: 'supplierContractReviewManage'});
                    set.add("supplierContractReviewManage");
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
            if (this.$route.query.openTab > 1)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'supplierContractReviewManage')
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
        customerContractReviewManage,
        supplierContractReviewManage,
        notFindPage,
        innerTab
    }
}
</script>
