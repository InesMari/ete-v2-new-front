<template>
  <div id="scancodeManageMain">
    <select-work v-show="showSelWork"></select-work>
    <innerTab :tabs="tabs" @selectCallback="selectCallback" v-show="!showSelWork"></innerTab>
    <keep-alive :include="includeArr" >
      <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)" v-show="!showSelWork"></component>
    </keep-alive>
  </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import orderScanQrcodeManage from './orderScanQrcodeManage.vue'
import allocatScanQrcodeManage from './allocatScanQrcodeManage.vue'
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
  name: 'scancodeManageMain',
  props: [],
  data()
  {
    return {
      tabs: this.initTabs(),
      componentName: this.initComponent(),
      showSelWork:false,
      includeArr: []
    }
  },
  mounted() {
    this.initSelWork();
    this.includeArr = ["orderScanQrcodeManage","allocatScanQrcodeManage"];
    let path = this.$route.query.path;
    if(this.common.isNotBlank(path)){
      this.componentName = path;
    }
    if(path=="orderScanQrcodeManage"){
      this.tabs[0].active = true;
      this.tabs[1].active = false;
    }
    if(path=="allocatScanQrcodeManage"){
      this.tabs[0].active = false;
      this.tabs[1].active = true;
    }
  },
  methods: {
    initSelWork(){
      this.userInfo = this.common.userInfo();
      if(!this.userInfo.workId){
        this.showSelWork = true;
      }else{
        this.firstIn = false;
        this.$nextTick(()=>{
          this.common.isNotBlank(this.$refs.ref)
          {
            this.$refs.ref.doQuery();
          }
        });
      }
    },
    selWork(){
      this.showSelWork = false;
      this.$forceUpdate();
      if(!this.firstIn){
        this.$emit('closeOthers', {});
      }
      this.userInfo = this.common.userInfo();
      this.firstIn = false;
      this.$nextTick(()=>{
        this.common.isNotBlank(this.$refs.ref)
        {
          this.$refs.ref.doQuery();
        }
      });
    },
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
        if (item == 1005256 && !set.has("出入库扫码明细"))
        {
          this.tabs.push({name: "出入库扫码明细", active: false, router: 'orderScanQrcodeManage'});
          set.add("出入库扫码明细");
        }
        if (item == 1005257 && !set.has("移库扫码明细"))
        {
          this.tabs.push({name: "移库扫码明细", active: false, router: 'allocatScanQrcodeManage'});
          set.add("移库扫码明细");
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
  },
  components: {
    orderScanQrcodeManage,
    allocatScanQrcodeManage,
    notFindPage,
    innerTab,
    selectWork
  }
}
</script>
