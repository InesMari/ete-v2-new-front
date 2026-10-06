<template>
    <div id="hrManagementCostManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="hrManagementCostManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>管理成本列表</span>
                    <el-tooltip effect="light" content="管理成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1009053" @click="toAdd">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009054" @click="toUpdate">修改</el-button>
                  <el-button type="danger" plain size="mini"  v-entity="1009055" @click="toDel">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009056" @click="showImp(true)">导入</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009057" @click="downloadExcel">导出</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009058" @click="displayChangePasswordDialog">更改密码</el-button>
                </div>
            </div>
            <tableCommon tableName="hrManagementCostManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toView">
            </tableCommon>
        </div>

      <!-- 导入 -->
      <el-dialog title="导入管理成本" :visible.sync="impFlag" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="showImp(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix" style="margin-top:10px;">
            <li class="item item50">
              <label class="label-term"><em>*</em>成本月份</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate()" v-model="baseInfo.billMonth" type="month"
                                placeholder="选择成本月份" align="right"
                                format="yyyy-MM" value-format="yyyy-MM" >
                </el-date-picker>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传</label>
              <!-- 批量导入 -->
              <my-import ref="myImport" :handle-success="myImportSuccessCallback" :noneDialog="true" template="hrManagementCost.xlsx" template-url="hrManagementCostTF|downloadExcelTmp" title="上传excel"
                         bean="hrManagementCostTF" method="impAddManagementCost" :param="baseInfo"></my-import>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showImp(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="impAdd()">确定</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 导入 -->

      <el-dialog title="提示" :visible.sync="showLoginPasswordDialog" :close-on-click-modal="false"
                 :close-on-press-escape="false" width="450px" :show-close="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix" style="text-align: center;">
            <li class="item item100" style="margin-top: -10px;color: red">
              该功能需要解密密码，否则无法查看
            </li>
            <li class="item item100" style="margin-top: 10px;">
              <label class="label-term">密码</label>
              <div class="input-text">
                <el-input type="password" v-model="password" autocomplete="new-password"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn " style="padding-right:0px">
            <el-button size="mini" @click="closePage">取消</el-button>
            <el-button type="primary" size="mini" @click="loginPassword">确认</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog title="修改密码" :visible.sync="showDialog" :close-on-click-modal="false"
                 :close-on-press-escape="false" width="340px" :show-close="true">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">旧密码</label>
              <div class="input-text">
                <el-input type="password" v-model="info.oldPassword" autocomplete="new-password"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">新密码</label>
              <div class="input-text">
                <el-input type="password" v-model="info.newPassword" autocomplete="new-password"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">确认密码</label>
              <div class="input-text">
                <el-input type="password" v-model="info.confirmPassword" autocomplete="new-password"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn " style="padding-right:0px">
            <el-button size="mini" @click="closeDialog">取消</el-button>
            <el-button type="primary" size="mini" @click="changePassword">确认修改</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import hrManagementCostManage from './hrManagementCostManage.js'
export default hrManagementCostManage
</script>
<style lang="scss">

</style>




