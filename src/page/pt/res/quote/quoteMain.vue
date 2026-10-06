<template>
    <div id="quoteMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import quoteManageLD from '@/page/pt/res/quote/quoteManageLD.vue'
import supplierZCQuoteManage from '@/page/pt/res/quote/supplierZCQuoteManage.vue'
import supplierWMSQuoteManage from '@/page/pt/res/quote/supplierWMSQuoteManage.vue'
import sectionQuoteManage from '@/page/pt/res/sectionQuote/sectionQuoteManage.vue'
export default {
    name: 'quoteMain',
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
                if (item == 1007003 && !set.has("整车成本库"))
                {
                    this.tabs.push({name: "整车成本库", active: false, router: 'supplierZCQuoteManage'});
                    set.add("整车成本库");
                }
                if (item == 1007004 && !set.has("零担成本库"))
                {
                    this.tabs.push({name: "零担成本库", active: false, router: 'quoteManageLD'});
                    set.add("零担成本库");
                }
                // if (item == 1007074 && !set.has("仓配成本库"))
                // {
                //     this.tabs.push({name: "仓配成本库", active: false, router: 'supplierWMSQuoteManage'});
                //     set.add("仓配成本库");
                // }
                if (item == 1007075 && !set.has("询价记录"))
                {
                    this.tabs.push({name: "询价记录", active: false, router: 'sectionQuoteManage'});
                    set.add("询价记录");
                }
            })
            if(this.tabs.length==0){
              this.componentName='notFindPage';
            }
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
      quoteManageLD,
      supplierZCQuoteManage,
        supplierWMSQuoteManage,
        sectionQuoteManage,
      notFindPage,
      innerTab
    }
}
</script>
