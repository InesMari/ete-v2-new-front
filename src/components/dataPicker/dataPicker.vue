<template>
    <div id="dataPickerComponent" class="filterSelectComponents">
        <el-date-picker 
            v-model="model" 
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            :default-time="['00:00:00','23:59:59']" 
            @change="callback"
            :start-placeholder="startPlaceholder?startPlaceholder:'选择日期'"
            :end-placeholder="endPlaceholder?endPlaceholder:'选择日期'">
        </el-date-picker>
    </div>
</template>

<script>
    import dataPicker from './dataPicker.js'
    export default dataPicker;
</script>
<style lang="scss" src="./dataPicker.scss"></style>