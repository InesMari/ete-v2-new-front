<template>
    <div id="areaMatch">
        <el-cascader
        placeholder="试试搜索：指南"
        :options="options"
        filterable
        @active-item-change="handleItemChange"
        :props="props"
        ></el-cascader>
    </div>
</template>


<script>
    import areaMatch from './areaMatch.js'
    export default areaMatch
</script>
<style lang="scss">

</style>