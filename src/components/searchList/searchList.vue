<template>
  <div id="searchList" class="search-list clearfix" @click.stop="() => false">
    <div class="setSearchList">
      <!-- <el-tooltip effect="light" content="设置过滤条件" placement="top"> -->
      <i
        class="searchShowIcon el-icon-d-arrow-left"
        :class="{ active: isshowSearchList }"
        @click="showSearchList"
      ></i>
      <!-- </el-tooltip> -->
      <div class="package" v-show="isshowSearchList">
        <div class="searchShow">
          <vuedraggable v-model="formList">
            <transition-group :name="'flip-list'" type="transition" tag="div">
              <div
                class="item"
                v-for="data in formList"
                :key="data.model"
              >
                <el-checkbox
                  class="fl"
                  v-model="data.isshow"
                  @change="searchShowChange(data)"
                  >{{ data.name.replace("：", "") }}</el-checkbox
                >
              </div>
            </transition-group>
          </vuedraggable>
        </div>
        <div class="saveBtn">
          <el-button type="primary" @click="saveSearchList()" size="mini">保存</el-button>
        </div>
      </div>
    </div>
    <div class="search-form clearfix" @keydown.enter="doQuery" ref="searchForm">
      <div
        class="item"
        :class="{ item2row: item.row == 2, item100: item.row == 4 }"
        v-for="(item, index) in formList"
        :key="index"
        v-show="item.isshow"
        v-if="item.if != false"
        >
        <label class="label">{{ item.name }}：
          <el-tooltip effect="dark" :content="item.tipText" placement="top-start">
            <i class="el-icon-question" v-if="item.tipText"></i>
          </el-tooltip>
        </label>
        <div class="input-text">
          <el-input
            v-if="item.type == 'input'"
            v-model="params[item.model]"
            :placeholder="item.placeholder?item.placeholder:item.name"
            type="text"
            prefix-icon="el-icon-search"
            autocomplete="new-password"
            @input="$forceUpdate()"
          ></el-input>

          <el-select
            v-else-if="item.type == 'select'"
            v-model="params[item.model]"
            :placeholder="item.placeholder?item.placeholder:item.name"
            :multiple="item.multiple"
            collapse-tags
            clearable
            filterable
            prefix-icon="el-icon-search"
            @change="selectChange($event, item.method, item.model);$forceUpdate();">
            <el-option
              v-for="option in item.options"
              :key="option[item.value]"
              :label="option[item.label]"
              :value="option[item.value]">
            </el-option>
          </el-select>

          <el-date-picker
            v-else-if="item.type == 'daterange'"
            v-model="params[item.model]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            unlink-panel
            suffix-icon="el-icon-date"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
              v-else-if="item.type == 'monthrange'"
              v-model="params[item.model]"
              type="monthrange"
              value-format="yyyy-MM"
              format="yyyy-MM"
              suffix-icon="el-icon-date"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              @blur="$forceUpdate()"
          >
          </el-date-picker>

          <el-date-picker
            v-else-if="item.type == 'year'"
            v-model="params[item.model]"
            type="year"
            suffix-icon="el-icon-date"
            value-format="yyyy"
            placeholder="请选择年份"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
            v-else-if="item.type == 'years'"
            v-model="params[item.model]"
            type="years"
            suffix-icon="el-icon-date"
            value-format="yyyy"
            placeholder="请选择年份"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
            v-else-if="item.type == 'month'"
            v-model="params[item.model]"
            type="month"
            suffix-icon="el-icon-date"
            value-format="yyyy-MM"
            placeholder="请选择月份"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
              v-else-if="item.type == 'months'"
              v-model="params[item.model]"
              type="months"
              suffix-icon="el-icon-date"
              value-format="yyyy-MM"
              placeholder="请选择月份"
              @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
            v-else-if="item.type == 'date'"
            v-model="params[item.model]"
            type="date"
            suffix-icon="el-icon-date"
            value-format="yyyy-MM-dd"
            :placeholder="item.placeholder?item.placeholder:item.name"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
            v-else-if="item.type == 'datetime'"
            v-model="params[item.model]"
            type="datetime"
            suffix-icon="el-icon-date"
            value-format="yyyy-MM-dd HH:mm:ss"
            @blur="$forceUpdate()"
          ></el-date-picker>

          <el-date-picker
              v-else-if="item.type == 'datetimerange'"
              v-model="params[item.model]"
              type="datetimerange"
              range-separator="至"
              suffix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panel
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00', '23:59:59']"
              @blur="$forceUpdate()"
          >
          </el-date-picker>

          <monthsPicker
            v-else-if="item.type == 'monthsPicker'"
            ref="monthsPicker"
            @changeData="chooseMonths(item.method, item.model)"
          ></monthsPicker>

          <el-input
            v-else-if="item.type == 'textarea'"
            style="height: 30px"
            :class="{ textareaFocus: textareaFocus }"
            @focus="setTextareaFocus"
            @blur="setTextareaFocus"
            v-model="params[item.model]"
            :placeholder="item.placeholder?item.placeholder:item.name"
            type="textarea"
            prefix-icon="el-icon-search"
            autocomplete="new-password"
            @keydown.native="textareaKeyup"
            @input="$forceUpdate()"
          ></el-input>

          <el-cascader
            v-else-if="item.type == 'cascader'"
            v-model="params[item.model]"
            size="medium"
            separator="-"
            :options="item.options"
            :props="item.props"
            collapse-tags
            clearable 
            filterable
            @change="cascaderChange($event, item.method, item.model)">
          </el-cascader>

          <div v-else-if="item.children.length > 1">
            <el-select
              v-model="params[item.children[0].model]"
              @change="$forceUpdate()"
              clearable
              style="width: 40%"
            >
              <el-option
                v-for="option in item.children[0].options"
                :key="option[item.children[0].value]"
                :label="option[item.children[0].label]"
                :value="option[item.children[0].value]"
              ></el-option>
            </el-select>
            <el-input
              style="width: 60%"
              v-model="params[item.children[1].model]"
              :placeholder="item.children[1].placeholder ? item.children[1].placeholder : item.name"
              type="text"
              @input="$forceUpdate()"
              v-mydouble4val>
            </el-input>
          </div>

        </div>
      </div>
    </div>
    <div class="search-btn clearfix">
      <div class="btn">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-search"
          @click="doQuery"
          >查询</el-button
        >
      </div>
      <div class="btn">
        <el-button
          type="danger"
          plain
          size="mini"
          icon="el-icon-close"
          @click="cleanQuery"
          >清空</el-button
        >
      </div>
    </div>
    <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
    <div class="search-bot">
      <img src="@/static/image/search-bot.png" alt="" />
      <i class="icon el-icon-arrow-down" ref="arrowDown"></i>
      <i class="icon el-icon-arrow-up" ref="arrowUp"></i>
    </div>
  </div>
</template>

<script>
import searchList from "./searchList.js";
export default searchList;
</script>

<style lang="scss">
.search-list {
  .setSearchList {
    position: absolute;
    box-sizing: border-box;
    left: -23px;
    top: 5px;
    z-index: 999;
    border-radius: 3px;
    .searchShowIcon {
      display: block;
      background: #fff;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      color: $main-color;
      transform: rotate(-90deg);
      -webkit-transform: rotate(-90deg);
      cursor: pointer;
      transition: all 0.5s;
      &.active {
        transform: rotate(-270deg);
        -webkit-transform: rotate(-270deg);
      }
      &:hover {
        background: $hover-color;
      }
    }
    .package {
      position: absolute;
      top: 25px;
      left: 0;
      background: #fff;
      border: $border;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .searchShow {
        padding: 10px 20px;
        max-height: 400px;
        overflow: auto;

        /* 优化滚动条样式 */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .item {
          cursor: pointer;
          padding: 4px 8px;
          line-height: 22px;
          overflow: hidden;
          border-radius: 4px;
          transition: all 0.2s ease;
          border: 1px solid transparent;

          &:hover {
            background-color: #f5f7fa;
            border-color: #dcdfe6;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .saveBtn {
        padding: 12px 20px 10px;
        border-top: 1px solid #ebeef5;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
    }

    /* 优化拖动效果 - 让拖动块更明显 */
    .flip-list-dragging {
      opacity: 0.95;
      transform: scale(1.05) rotate(2deg);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      border: 2px solid #409eff;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
      z-index: 9999;
      transition: none;
      animation: drag-highlight 0.6s ease-in-out infinite alternate;
    }

    @keyframes drag-highlight {
      0% {
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
        border-color: #409eff;
      }
      100% {
        box-shadow: 0 10px 30px rgba(64, 158, 255, 0.6);
        border-color: #66b1ff;
        transform: scale(1.08) rotate(3deg);
      }
    }

    /* 被拖拽元素松手后的嵌入动画 */
    .drop-embed {
      animation: embed-animation 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      will-change: transform, box-shadow;
    }

    @keyframes embed-animation {
      0% {
        transform: scale(1.05) rotate(2deg);
        box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
      }
      70% {
        transform: scale(1.02) rotate(1deg);
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.2);
      }
      100% {
        transform: scale(1) rotate(0deg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .search-form {
      .el-input__icon{
          line-height: 36px;
      }
    .item {
      .el-textarea__inner {
        height: 30px;
        border:none;
        resize: none;
        line-height: 20px;
        &::placeholder{
          font-size: 12px;
          line-height: 24px;
        }
      }
      .el-cascader{
        width: 100%;
      }
      .el-input__suffix{
        height: 35px;
      }
    }
  }
  .textareaFocus{
    position: relative;
    z-index: 99;
    .el-textarea__inner {
      height: 60px!important;
      border: 1px solid #DCDFE6!important;
      box-sizing: border-box;
    }
  }
}
</style>
