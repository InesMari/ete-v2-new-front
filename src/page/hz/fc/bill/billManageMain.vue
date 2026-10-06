<template>
    <div id="billManageMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import unconfirmedBill from './unconfirmedBill.vue'
import confirmedBill from './confirmedBill.vue'

export default {
    name: 'billManageMain',
    props: [],
    data() {
        return {
            tabs: [
                {
                    name: "未确认",
					active: true,
                    router: 'unconfirmedBill'
                },
                {
                    name: "已确认",
                    router: 'confirmedBill'
                },
            ],
            componentName: unconfirmedBill
        }
    },
    mounted() {
        this.$refs.ref.doQuery(query);
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
        unconfirmedBill,
        confirmedBill,
        innerTab
    }
}
</script>
