<template>
    <div id="payOrderDetailMain" class="payOrderDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import detail from './payOrderDetail.vue'
	import operateLog from './payOrderOpLog.vue'

	export default {
		name: 'requestFeeDetailMain',
		props: [],
		data()
		{
			return {
				tabs: [{
					name: "付款单详情",
					active: true,
					router: 'detail',
				    },
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
			operateLog,
			innerTab
		}
	}
</script>

<style lang="scss">
</style>
