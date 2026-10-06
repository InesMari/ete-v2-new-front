<template>
    <div id="orderDetailMain" class="orderDetailMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import orderDetail from './orderDetail.vue'
	import modifyRecord from './modifyRecord.vue'
	import operateLog from './operateLog.vue'

	export default {
		name: 'orderDetailMain',
		props: [],
		data()
		{
			return {
				tabs: [{
					name: "订单详情",
					active: true,
					router: 'orderDetail',
				    },
					{
						name: "修改记录",
						router: 'modifyRecord'
					},
					{
						name: "操作日志",
						router: 'operateLog'
					},
				],
				componentName: orderDetail
			}
		},
		mounted()
		{

		},
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
			orderDetail,
			modifyRecord,
			operateLog,
			innerTab
		}
	}
</script>

<style lang="scss">

</style>
