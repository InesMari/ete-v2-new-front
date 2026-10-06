<template>
    <div id="assetsAllocatDetailMain" class="requestFeeDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import detail from './assetsAllocatDetail.vue'
	import log from './assetsAllocatOpLog.vue'

	export default {
		name: 'assetsAllocatDetailMain',
		props: [],
		data()
		{
			return {
				tabs: [{
					name: "固定资产调拨详情",
					active: true,
					router: 'detail',
				    },
					{
						name: "操作日志",
						router: 'log'
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
            log,
			innerTab
		}
	}
</script>

<style lang="scss">
</style>
