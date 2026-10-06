<template>
    <div id="orderInfoMain" class="orderDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import orderInfo from './orderInfo.vue'
    import operateLog from '@/components/operateLog/operateLog.vue'

	export default {
		name: 'orderInfoMain',
		props: [],
		data()
		{
			return {
				tabs: [{
					    name: "详情",
					    active: true,
					    router: 'orderInfo',
				    },
					{
						name: "操作日志",
						router: 'operateLog',
					},
				],
				componentName: orderInfo
			}
		},
		mounted() {},
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
      orderInfo,
			operateLog,
			innerTab
		}
	}
</script>

<style lang="scss">

</style>
