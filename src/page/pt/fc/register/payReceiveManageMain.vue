<template>
    <div id="payReceiveManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
          <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px) !important;"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import receiveAdvance from './receiveAdvanceManage.vue'
import payAdvance from './payAdvanceManage.vue'

export default {
    name: 'payReceiveManageMain',
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
      initTabs()
      {
        this.tabs = [];
        let entityIds = localStorage.getItem("entityIds").split(",");
        let set = new Set();
        entityIds.forEach(item =>
        {
          if (item == 1006087 && !set.has("1006087"))
          {
            this.tabs.push({name: "预收管理", active: false, router: 'receiveAdvance'});
            set.add("1006087");
          }
          if (item == 1006088 && !set.has("1006088"))
          {
            this.tabs.push({name: "预付管理", active: false, router: 'payAdvance'});
            set.add("1006088");
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
        if (this.tabs.length > 0)
          this.tabs[0].active = true;
        return this.tabs[0].router;
      },
        openTab(item) {
            this.$emit('openTab', item);
        },
    },
    components: {
        receiveAdvance,
        payAdvance,
        innerTab
    }
}
</script>
