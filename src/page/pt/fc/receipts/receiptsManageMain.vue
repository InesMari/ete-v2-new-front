<template>
    <div id="receiptsManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import fcPayManage from './fcPayManage.vue'
import requestFeeManage from './requestFeeManage.vue'
import payRecordManage from './payRecordManage.vue'

export default {
    name: 'receiptsManageMain',
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
            this.$refs.ref && this.$refs.ref.enterDoQuery(this.$route.query);
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
                if (item == 1006115 && !set.has("请款单"))
                {
                    this.tabs.push({name: "请款单", active: false, router: 'requestFeeManage'});
                    set.add("请款单");
                }
                if (item == 1006116 && !set.has("付款单"))
                {
                    this.tabs.push({name: "付款单", active: false, router: 'fcPayManage'});
                    set.add("付款单");
                }
                if (item == 1006184 && !set.has("付款记录"))
                {
                    this.tabs.push({name: "付款记录", active: false, router: 'payRecordManage'});
                    set.add("付款记录");
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
            if (this.$route.query.type == 2)
            {
                for (let i = 0; i < this.tabs.length; i++)
                {
                    if (this.tabs[i].router == 'fcPayManage')
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
        fcPayManage,
        requestFeeManage,
        payRecordManage,
        notFindPage,
        innerTab
    }
}
</script>
