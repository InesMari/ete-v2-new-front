<template>
    <div id="actualManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="actualManageSearch"></searchList>
  
      <div class="table-content">
        <div class="table-title">
          <div class="table-title-btn" style="margin-right: 90px;">
            <el-button type="primary" plain size="mini" @click="showModifyDialog(true)" v-entity="1007128">导入</el-button>
            <el-button type="primary" plain size="mini" @click="add" v-entity="1007117">新建</el-button>
            <el-button type="primary" plain size="mini" @click="edit" v-entity="1007118">修改</el-button>
            <el-button type="primary" plain size="mini" @click="adjust" v-entity="1007177">财务调整</el-button>
            <el-button type="danger" plain size="mini" @click="deleteInfo" v-entity="1007119">删除</el-button>
            <el-button type="primary" plain size="mini" @click="verify" v-entity="1007120">审核</el-button>.
            <el-button type="primary" plain size="mini" @click="cancelVerify" v-entity="1007130">取消审核</el-button>.
          </div>
        </div>
        <tableCommon tableName="actualManageTable" ref="table" :showNum="true"
                     :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
        </tableCommon>
      </div>

      <el-dialog title="实绩数据导入" :visible.sync="showModify" :close-on-click-modal="false" :close-on-press-escape="false" width="620px" @close="showModifyDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>实绩年度</label>
              <div class="input-text">
                <el-date-picker v-model="actualInfo.year" type="year" placeholder="实绩年度"
                                value-format="yyyy"></el-date-picker>
              </div>
            </li>
            <li class="item item98">
              <label class="label-term"><em>*</em>物流基地</label>
              <div class="input-text">
                <el-select v-model="actualInfo.orgId" clearable filterable placeholder="请选择">
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传数据</label>
              <div class="input-text">
                <my-import ref="myImport" :handle-success="myImportSuccessCallback" :noneDialog="true" template="/download/actualInfo.xlsx" title="上传excel"
                           bean="fcActualTF" method="impAddFcActualInfo" :param="actualInfo"></my-import>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showModifyDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveReovery()">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import actualManage from './actualManage.js'
  export default actualManage
  </script>
  
  <style scoped>
  
  </style>
  