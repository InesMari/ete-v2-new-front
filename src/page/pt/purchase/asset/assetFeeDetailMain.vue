<template>
    <div id="assetFeeDetailMain" class="assetFeeDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import assetFeeManage from './assetFeeManage.vue'
	import assetDepreciationManage from './assetDepreciationManage.vue'

	export default {
		name: 'assetFeeDetailMain',
		props: [],
		data()
		{
			return {
        tabs: this.initTabs(),
        componentName: this.initComponent(),
			}
		},
		mounted(){},
		methods: {
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
          if (item == 1014061 && !set.has("资产费用列表"))
          {
            this.tabs.push({name: "资产费用列表", active: false, router: 'assetFeeManage'});
            set.add("资产费用列表");
          }
          if (item == 1014062 && !set.has("资产折旧列表"))
          {
            this.tabs.push({name: "资产折旧列表", active: false, router: 'assetDepreciationManage'});
            set.add("资产折旧列表");
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
      initComponent() {
        if (this.tabs.length > 0)
          this.tabs[0].active = true;
        return this.tabs[0].router;
      },
			selectCallback(data)
			{
				this.tab = data;
				this.componentName = data.router;
			},
			openTab(item)
			{
				this.$emit('openTab', item);
			},
		},
		components: {
      assetFeeManage,
      assetDepreciationManage,
			innerTab
		}
	}
</script>

<style lang="scss">
</style>
