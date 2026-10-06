<template>
  <div id="ordWaybillVehicleManageMain">
    <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
    <keep-alive>
      <!-- 通过 :key 强制区分两个"实例" -->
      <component
          ref="ref"
          :is="componentName"
          :key="currentType"
          @openTab="openTab"
          style="height: calc(100% - 41px)"></component>
    </keep-alive>
  </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import ordWaybillVehicleManage from './ordWaybillVehicleManage.vue'

export default {
  name: 'ordWaybillVehicleManageMain',
  props: [],
  data() {
    return {
      tabs: this.initTabs(),
      componentName: this.initComponent(),
      currentType: 1,
    }
  },
  mounted() {
    this.$nextTick(() => {
      const queryType = this.$route.query.type ? parseInt(this.$route.query.type) : this.currentType;
      this.currentType = queryType;
      if(this.$refs.ref){
        this.$refs.ref.initQuery(queryType);
        this.$refs.ref.doQuery();
      }
    });
  },
  methods: {
    selectCallback(data) {
      this.tab = data;
      this.componentName = data.router;
      this.currentType = data.type;  // 更新当前 type
      this.$nextTick(() => {
        this.$refs.ref && this.$refs.ref.doQuery();
      });
    },
    openTab(item) {
      this.$emit('openTab', item);
    },
    initTabs() {
      this.tabs = [];
      let entityIds = localStorage.getItem("entityIds").split(",");
      let set = new Set();
      entityIds.forEach(item => {
        if (item == 1003118 && !set.has("按客户")) {
          this.tabs.push({name: "按客户", active: false, router: 'ordWaybillVehicleManage', type: 1});
          set.add("按客户");
        }
        if (item == 1003119 && !set.has("按集团")) {
          this.tabs.push({name: "按集团", active: false, router: 'ordWaybillVehicleManage', type: 2});
          set.add("按集团");
        }
      })
      if (this.tabs.length === 0)
        this.componentName = 'notFindPage';
      return this.tabs;
    },
    initComponent() {
      if (this.tabs.length > 0) {
        this.tabs[0].active = true;
        this.currentType = this.tabs[0].type;
      }
      return this.tabs[0].router;
    },
  },
  components: {
    ordWaybillVehicleManage,
    notFindPage,
    innerTab
  }
}
</script>
