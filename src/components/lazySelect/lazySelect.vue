<template>
  <div class="lazy-select-container">
    <el-select
      ref="lazySelect"
      :value="value"
      @input="handleChange"
      :placeholder="placeholder"
      filterable
      :clearable="clearable"
      remote
      reserve-keyword
      :remote-method="remoteSearchLazy"
      @focus="handleFocus"
      @visible-change="handleVisibleChange"
      :popper-class="`${popperClass} ${uniqueClass}`"
      :disabled="disabled"
      class="lazy-select"
    >
      <el-option
        v-for="item in showData"
        :key="item[valueKey]"
        :label="item[labelKey]"
        :value="item[valueKey]">
      </el-option>
      <el-option
        v-if="isSearching && showData.length === 0"
        disabled
        value=""
        label="无匹配数据"
        style="color:#999;"
        class="no-match-option">
      </el-option>
    </el-select>
    <span class="lazy-select-icons">
      <i class="el-select__caret" :class="dropdownVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </span>
  </div>
</template>

<script>
import lazySelect from './lazySelect.js'
export default lazySelect
</script>

<style lang="scss" scoped>
.lazy-select-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.lazy-select-icons {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  z-index: 10;

  .el-select__caret {
    color: #C0C4CC;
    font-size: 14px;
    transition: transform 0.3s;
    line-height: 1;
  }
}

.lazy-select:hover + .lazy-select-icons .el-select__caret,
.lazy-select-icons:hover .el-select__caret {
  color: #909399;
}

// 隐藏原生的箭头
.lazy-select /deep/ .el-input__suffix-inner {
  opacity: 0;
}
</style>

