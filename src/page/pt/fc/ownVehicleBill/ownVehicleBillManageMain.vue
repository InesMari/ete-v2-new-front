<template>
    <div id="ownVehicleBillManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import ownVehicleUnconfirmedBill from './ownVehicleUnconfirmedBill.vue'
import ownVehicleConfirmedBill from './ownVehicleConfirmedBill.vue'

export default {
    name: 'ownVehicleBillManageMain',
    props: [],
    data() {
        return {
            tabs: [
                {
                    name: "未确认",
					active: true,
                    router: 'ownVehicleUnconfirmedBill'
                },
                {
                    name: "已确认",
                    router: 'ownVehicleConfirmedBill'
                },
            ],
            componentName: ownVehicleUnconfirmedBill
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.ref && this.$refs.ref.doQuery();
        });
    },
    methods: {
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router;
        },
        openTab(item) {
            this.$emit('openTab', item);
        },
    },
    components: {
		ownVehicleUnconfirmedBill,
		ownVehicleConfirmedBill,
        innerTab
    }
}
</script>

