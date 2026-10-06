<template>
    <div id="timeLimitManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="timeLimitManageSearch" v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>仓库时效列表</span>
                    <el-tooltip effect="light" content="仓库时效列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005275" @click="openTimeLimitConfig(true)">基础配置</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005276" @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="timeLimitManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true"></tableCommon>
        </div>


      <!-- 基础配置 -->
      <el-dialog title="基础配置" :visible.sync="showTimeLimitConfigFlg" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="openTimeLimitConfig(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50" v-for="item in timeLimitConfigList" :key="item.value">
              <label class="label-term"><em>*</em>{{item.name}}(分钟)</label>
              <div class="input-text">
                <el-input v-model="timeLimitInfo[item.code]" maxlength="20" @input="calTimeLimit" :placehoLder="'请输入'+item.name+'(分钟)'" :disabled="item.value==99"></el-input>
              </div>
            </li>
            <li class="item item98">
              <label class="label-term">企微推送地址</label>
              <div class="input-text">
                <el-input v-model="timeLimitInfo.weComPushUrl" maxlength="200" @input="forceUpdate" placeholder="请输入企业微信推送地址"></el-input>
              </div>
            </li>
          </ul>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="openTimeLimitConfig(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveWmsTimeLimitInfo()">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import timeLimitManage from './timeLimitManage.js'
export default timeLimitManage
</script>
<style lang="scss">
#timeLimitManage{
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

