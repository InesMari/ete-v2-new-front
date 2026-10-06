<template>
    <div id="reportMain">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
            <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
        </keep-alive>
    </div>
</template>

<script>
import innerTab from "@/components/innerTab/innerTab.vue"
import answerSheetManager from './answerSheetManager.vue'
import answerSheetStatistics from './answerSheetStatistics.vue'
import answerSheetStatisticsByCustomerService from './answerSheetStatisticsByCustomerService.vue'

export default {
    name: 'reportMain',
    props: [],
    data()
    {
        return {
            tabs: [
                {name: "答卷明细", active: false, router: 'answerSheetManager'},
                {name: "数据统计-按问卷", active: false, router: 'answerSheetStatistics'},
                {name: "数据统计-按客服", active: false, router: 'answerSheetStatisticsByCustomerService'}
            ],
            componentName: "",
        }
    },
    mounted() {
        this.doComponentQuery()
        this.initComponent();
    },
    methods: {
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
         * 初始化组件
         * @returns {*}
         */
        initComponent()
        {
            if (this.tabs.length > 0){
                this.tabs[0].active = true;
                this.componentName = this.tabs[0].router;
            }
        },
        doComponentQuery(){
            if(this.$refs.ref) this.$refs.ref.doQuery();
        },
    },
    components: {
        answerSheetManager,
        answerSheetStatistics,
        answerSheetStatisticsByCustomerService,
        innerTab
    }
}
</script>
