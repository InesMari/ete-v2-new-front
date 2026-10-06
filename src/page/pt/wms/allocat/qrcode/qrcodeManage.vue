<template>
  <div id="qrcodeManage">
    <select-work v-show="showSelWork"></select-work>
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="qrcodeManageSearch" v-show="!showSelWork"></searchList>

    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
          <h3>
              <span>在库条码列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
              <el-tooltip effect="light" content="在库条码列表" placement="right">
                  <img class="tip" src="@/static/image/tip.png" alt="">
              </el-tooltip>
          </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005122" @click="codePrint">条码打印</el-button>
<!--          <el-button type="primary" plain size="mini" v-entity="1005123" @click="mergeGenerateBar">条码合并</el-button>-->
          <el-button type="primary" plain size="mini" v-entity="1005140" @click="qrcodeModify">条码修改</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005124" @click="download">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="qrcodeManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :single-select="false" @dblclickItem="dblclickItem">
        <template v-slot="{item,code}">
          <div v-if="code=='qrcodeUrl'">
            <img :src="item.qrcodeUrl" alt="" height="56px" style="margin-top: 5px;">
          </div>
          <div v-if="code=='inQrcodeUrl'&&item.inQrcodeUrl">
            <img :src="item.inQrcodeUrl" alt="" height="56px" style="margin-top: 5px;">
          </div>
        </template>
      </tableCommon>
    </div>

    <!-- 条码修改 begin-->
    <el-dialog title="条码修改" :visible.sync="qrcodeModifyShow" width="400px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="showQrcodeModify(false)">
      <div class="fcCommonPage">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix;">
            <li class="item item100">
              <label class="label-term">旧条码编号</label>
              <div class="input-text">
                <el-input v-model="info.codeNum" maxlength="200" placeholder="" @input="$forceUpdate();" :disabled="true" ></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix;">
            <li class="item item100">
              <label class="label-term">条码数量</label>
              <div class="input-text">
                <el-input v-model="info.qrcodeNums" maxlength="200" placeholder="" @input="$forceUpdate();" :disabled="true" ></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">新条码编号</label>
              <div class="input-text">
                <el-input v-model="info.newCodeNum" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showQrcodeModify(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="sureQrcodeModify()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 条码修改 end-->

  </div>
</template>

<script>
import qrcodeManage from './qrcodeManage.js'
export default qrcodeManage
</script>

<style scoped>

</style>
