<template>
  <div id="assetInfoOpLog" class="assetInfoOpLogPage">
    <div class="logListCommon">
      <div class="title clearfix">
        <div class="time">时间</div>
        <div class="operator">操作人</div>
        <div class="news">最新动态</div>
      </div>
      <div class="contentHight">
        <div class="content">
          <div class="item clearfix" :class="{'first':index==0}" v-for="(item, index) in opLogData" :key="index">
            <div class="time">
              {{item.opDate}}
            </div>
            <div class="operator">
              {{item.createUserName}}
            </div>
            <div class="news" v-html="item.opContent">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import assetInfoOpLog from './assetInfoOpLog.js'
export default assetInfoOpLog
</script>

<style lang="scss">
.assetInfoOpLogPage {
  height: calc(100% - 60px);
  background: #fff;
  border: $border;
  .logListCommon{
    height: 100%;
    .contentHight{
      height: calc(100% - 40px);
      overflow: auto;
      img{
        display: inline-block;
        width: 60px;
        vertical-align: middle;
        margin: 0 4px;
        border-radius: 3px;
      }
    }
  }
}
</style>
