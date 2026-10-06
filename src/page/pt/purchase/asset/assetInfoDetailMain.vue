<template>
    <div id="assetInfoDetailMain" class="assetInfoDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import detail from './saveAssetInfo.vue'
  import assetConsumingDetail from './assetConsumingDetail.vue'
	import operateLog from './assetInfoOpLog.vue'

	export default {
		name: 'assetInfoDetailMain',
		props: [],
		data()
		{
			return {
				tabs: [{
					name: "资产详情",
					active: true,
					router: 'detail',},
          {
            name: "领用详情",
            router: 'assetConsumingDetail',},
					{
						name: "操作日志",
						router: 'operateLog'
					},
				],
				componentName: detail
			}
		},
		mounted(){},
		methods: {
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
      detail,
      assetConsumingDetail,
			operateLog,
			innerTab
		}
	}
</script>

<style lang="scss">
</style>
