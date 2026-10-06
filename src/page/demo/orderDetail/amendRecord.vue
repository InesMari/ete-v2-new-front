<template>
  <div id="amendRecord">
    <div class="table-content" style="margin-top:0;">
      <div class="table-title">
        <h3>
          <span>修改记录</span>
        </h3>
      </div>
      <tableCommon tableName="listTable" ref="table" :head="head" showSetTable="false"></tableCommon>
    </div>
  </div>
</template>

<script>
import amendRecord from './amendRecord.js'
export default amendRecord
</script>
<style lang="scss">

</style>