<template>
    <div id="innerTab">
        <div class="innerTab clearfix">
            <div :class="{'active':tab.active}" class="innerItem" v-for="(tab,index) in tabList" :key="index"
                @click="selTab(tab)">
                <p class="inline">
                    {{tab.name}}
                    <el-tooltip class="item" effect="light" :content="tab.desc" placement="top-start">
                        <i class="el-icon-question" v-if="tab.desc"></i>
                    </el-tooltip>
                </p>
                <p class="inline" v-if="tab.num">
                    <span v-if="tab.num>9999">9999+</span>
                    <span v-if="tab.num<=9999">({{tab.num}})</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import innerTab from './innerTab.js'
    export default innerTab
</script>

<style lang="scss" scoped src="./innerTab.scss"></style>