<template>
    <div id="bizManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import purchaseApplyManage from './purchase/purchaseApplyManage.vue'
import itemClaimApplyManage from './claim/itemClaimApplyManage.vue'
import assetsAllocatManage from './allocat/assetsAllocatManage.vue'

export default {
    name: 'bizManageMain',
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
    methods: {
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router
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
                if (item == 1009003 && !set.has("采购费用申请")) {
                    this.tabs.push({name: "采购费用申请", active: false, router: 'purchaseApplyManage'});
                    set.add("采购费用申请");
                }
                if (item == 1009004 && !set.has("物品领用申请")) {
                    this.tabs.push({name: "物品领用申请", active: false, router: 'itemClaimApplyManage'});
                    set.add("物品领用申请");
                }
                if (item == 1009005 && !set.has("固定资产调拨")) {
                    this.tabs.push({name: "固定资产调拨", active: false, router: 'assetsAllocatManage'});
                    set.add("固定资产调拨");
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
                    if (this.$route.query.openTab == 2 && this.tabs[i].router == 'itemClaimApplyManage')
                    {
                        this.tabs[i].active = true;
                        return this.tabs[i].router;
                    }
                    if (this.$route.query.openTab == 3 && this.tabs[i].router == 'assetsAllocatManage')
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
        purchaseApplyManage,
        itemClaimApplyManage,
        assetsAllocatManage,
        notFindPage,
        innerTab
    }
}
</script>
