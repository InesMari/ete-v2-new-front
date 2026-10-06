<template>
  <div id="operateLog" class="operateLogPage">
    <div class="logListCommon">
      <div class="title clearfix">
        <div class="time">
          时间
        </div>
        <div class="operator">
          操作人
        </div>
        <div class="news">
          最新动态
        </div>
      </div>
      <div class="content">
        <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in list" :key="index">
          <div class="time">
            13:10
          </div>
          <div class="operator">
            司机：张师傅
          </div>
          <div class="news">
            收车【广州黄埔】（司机：张三，联系电话：13118837449）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import operateLog from './operateLog.js'
export default operateLog
</script>
<style lang="scss">
.operateLogPage{
  height: calc(100% - 60px);
  background: #fff;
  border:$border;
}
</style>