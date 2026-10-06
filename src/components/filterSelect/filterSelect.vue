<template>
    <div id="filterSelect" class="filterSelectComponents">
        <el-select v-model="value" @change="selectValue" :value-key="fullName" filterable :filter-method="dataFilter" :placeholder="placeholder?placeholder:'请选择'">
            <el-option
            v-for="(item,index) in listData"
            :key="index"
            :label="item[fullName]"
            :value="item"
            >
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import filterSelect from './filterSelect.js'
    export default filterSelect;
</script>
<style lang="scss" src="./filterSelect.scss"></style>