<template>
    <div id="timeLimitRemindManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="timeLimitRemindManageSearch" v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>仓库时效提醒列表</span>
                    <el-tooltip effect="light" content="仓库时效提醒列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="timeLimitRemindManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true">
              <template v-slot:default="{item, code}">
                  <span v-if="code === 'curTimeout'" :style="item.curTimeoutFlg==0?'color:red!important':''">{{item.curTimeout}}</span>
                  <span v-if="code === 'timeout'" :style="item.timeoutFlg==0?'color:red!important':''">{{item.timeout}}</span>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import timeLimitRemindManage from './timeLimitRemindManage.js'
export default timeLimitRemindManage
</script>
<style lang="scss">
#timeLimitRemindManage{
  .common-info.flex .content>.item .label-term{
    width: 130px;
  }
  .common-title{
    .title-text{
      padding-right: 20px;
      line-height: 30px;
      font-weight: bold;
      float: right;
      span{
        margin-left: 20px;
      }
    }
  }
}
</style>

