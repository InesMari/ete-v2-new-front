<template>
  <div id="seasonPicker">
    <mark
        style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
        v-show="showSeason"
        @click.stop="showSeason=false"
    ></mark>
    <el-input placeholder="请选择季度" v-model="showValue" style="width:138px;" @focus="showSeason=true">
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
    </el-input>
    <el-card
        class="box-card"
        style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
        v-show="showSeason"
    >
      <div slot="header" class="clearfix" style="text-align:center;padding:0">
        <button
            style="margin-top: 5px;"
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="prev"
        ></button>
        <span role="button" class="el-date-picker__header-label">{{year}}年</span>
        <button
            style="margin-top: 5px;"
            type="button"
            aria-label="后一年"
            @click="next"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
        ></button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
            type="text"
            size="medium"
            style="width:40%;color: #606266;float:left;"
            @click="selectSeason(0)"
        >第一季度</el-button>
        <el-button
            type="text"
            size="medium"
            style="float:right;width:40%;color: #606266;"
            @click="selectSeason(1)"
        >第二季度</el-button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
            type="text"
            size="medium"
            style="width:40%;color: #606266;float:left;"
            @click="selectSeason(2)"
        >第三季度</el-button>
        <el-button
            type="text"
            size="medium"
            style="float:right;width:40%;color: #606266;"
            @click="selectSeason(3)"
        >第四季度</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import seasonPicker from './seasonPicker.js'
export default seasonPicker
</script>

<style scoped>

</style>