<template>
    <div id="packOpLogMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
          <component ref="ref" :is="componentName" @openTab="openTab"  style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import PDAOpLogBase from './PDAOpLogBase.vue'
import artificialOp from './artificialOp.vue'
import notFindPage from "@/page/notFindPage/notFindPage.vue"

export default {
    name: 'packOpLogMain',
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
        entityIds.forEach(item => {
          if (item == 1004023 && !set.has("PDA操作"))
          {
            this.tabs.push({name: "PDA操作", active: false, router: 'PDAOpLogBase'});
            set.add("PDA操作");
          }
          if (item == 1004024 && !set.has("人工操作"))
          {
            this.tabs.push({name: "人工操作", active: false, router: 'artificialOp'});
            set.add("人工操作");
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
        PDAOpLogBase,
        artificialOp,
        notFindPage,
        innerTab
    }
}
</script>

