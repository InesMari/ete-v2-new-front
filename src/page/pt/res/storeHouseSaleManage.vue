<template>
  <div id="storeHouseSaleManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="storeHouseSaleManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
          <h3>
              <span>仓库客户合同列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
              <el-tooltip effect="light" content="仓库客户合同列表" placement="right">
                  <img class="tip" src="@/static/image/tip.png" alt="">
              </el-tooltip>
          </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="addSale" v-entity :entityId="[{1001053:1001054}]">新增</el-button>
          <el-button type="primary" plain size="mini" @click="editSale" v-entity :entityId="[{1001053:1001055}]">修改</el-button>
          <el-button type="danger" plain size="mini" @click="updateStateToInvalid(0)" v-entity :entityId="[{1001053:1001057}]">删除</el-button>
          <el-button type="primary" plain size="mini" v-entity="1001091" @click="showRenewal()">续期</el-button>
          <el-button type="primary" plain size="mini" @click="download()" v-entity="1001056">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="storeHouseSaleManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">

      </tableCommon>
    </div>

    <!-- 导出运作状况-开始 -->
    <el-dialog title="续期" :visible.sync="showDlg" width="420px" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div style="position: relative;padding-left: 45px;margin-bottom: 15px;">
        <img class="tip" src="@/static/image/tip.png" alt="" style="width:24px;position: absolute;top:50%;margin-top:-12px;left: 10px">
        请选择续期到哪一天
      </div>
      <div class="common-info" style="border:none;padding:20;">
        <ul class="content clearfix">
          <li class="item" style="width: 80%;">
            <label class="label-term"><em>*</em>到期时间</label>
            <div class="input-text">
              <el-date-picker @input="$forceUpdate" v-model="endDate" type="date"
                              placeholder="选择日期时间" align="right"
                              value-format="yyyy-MM-dd">
              </el-date-picker>            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeDialog()">关闭</el-button>
          <el-button type="primary" size="mini" @click="renewal">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 导出运作状况-结束 -->
  </div>
</template>

<script>
import storeHouseSaleManage from './storeHouseSaleManage.js'
export default storeHouseSaleManage
</script>

<style scoped>
/deep/ .trRed td{color:red}
</style>
