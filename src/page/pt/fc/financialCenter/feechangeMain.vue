<template>
    <div id="feechangeMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import billMakeupFeeList from '@/page/pt/fc/billMakeup/billMakeupFeeList.vue'
import feeChangeManage from '@/page/pt/fc/supplierBill/feeChangeManage.vue'

export default {
    name: 'feechangeMain',
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
                if (item == 1006065 && !set.has("客户"))
                {
                    this.tabs.push({name: "客户", active: false, router: 'billMakeupFeeList'});
                    set.add("客户");
                }
                if (item == 1006066 && !set.has("供应商"))
                {
                    this.tabs.push({name: "供应商", active: false, router: 'feeChangeManage'});
                    set.add("供应商");
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
          //审核跳转展示
            if (this.$route.query.openTab > 1)
            {
              this.tabs[this.$route.query.openTab-1].active = true;
              return this.tabs[this.$route.query.openTab-1].router;
            }
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
      billMakeupFeeList,
      feeChangeManage,
      notFindPage,
      innerTab
    }
}
</script>
