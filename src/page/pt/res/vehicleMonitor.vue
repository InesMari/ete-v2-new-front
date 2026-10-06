<template>
    <div id="vehicleMonitor" class="vehicleMonitorMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <component :is="componentName" @openTab="openTab"></component>
    </div>
</template>

<script>
	import innerTab from "@/components/innerTab/innerTab.vue"
	import vehicleMonitorPosition from './vehicleMonitorPosition.vue'
	import vehicleMonitorTrack from './vehicleMonitorTrack.vue'

	export default {
		name: 'vehicleMonitor',
		props: [],
		data()
		{
			return {
				tabs: [{
					    name: "车辆定位",
					    active: true,
					    router: 'vehicleMonitorPosition',
				    },
					{
						name: "车辆轨迹",
						router: 'vehicleMonitorTrack',
					},
				],
				componentName: vehicleMonitorPosition
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
            vehicleMonitorPosition,
			vehicleMonitorTrack,
			innerTab
		}
	}
</script>

<style lang="scss">

</style>
