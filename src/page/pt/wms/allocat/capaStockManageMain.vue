<template>
    <div id="capaStockManageMain">
      <select-work v-show="showSelWork"></select-work>
      <innerTab :tabs="tabs" @selectCallback="selectCallback" v-show="!showSelWork"></innerTab>
      <keep-alive>
        <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)" v-show="!showSelWork"></component>
      </keep-alive>
    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import stockMaterialManage from './stockMaterialManage.vue'
import stockStorageManage from './stockStorageManage.vue'
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'capaStockManageMain',
    props: [],
    data()
    {
        return {
            tabs: this.initTabs(),
            componentName: this.initComponent(),
            showSelWork:false,
        }
    },
    mounted() {
      this.initSelWork();
	    let path = this.$route.query.path;
      if(this.common.isNotBlank(path)){
        this.componentName = path;
      }
      if(path=="stockMaterialManage"){
        this.tabs[0].active = true;
        this.tabs[1].active = false;
      }
      if(path=="stockStorageManage"){
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
                if (item == 1005032 && !set.has("按物料"))
                {
                    this.tabs.push({name: "按物料", active: false, router: 'stockMaterialManage'});
                    set.add("按物料");
                }
                if (item == 1005033 && !set.has("按库位"))
                {
                    this.tabs.push({name: "按库位", active: false, router: 'stockStorageManage'});
                    set.add("按库位");
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
      stockMaterialManage,
      stockStorageManage,
        notFindPage,
        innerTab,
      selectWork
    }
}
</script>
