<template>
    <div id="maintenanceManage">
      <div class="search-list clearfix">
        <div class="search-form clearfix">
          <div class="item">
            <label class="label">器具名称：</label>
            <div class="input-text">
              <el-input v-model="query.deviceName" placeholder="搜索器具名称" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">器具类型：</label>
            <div class="input-text">
              <el-select v-model="query.deviceType" placeholder="器具类型" @change="doQuery" clearable filterable>
                <el-option v-for="item in deviceTypeOptions" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
        <div class="search-btn clearfix">
          <div class="btn">
            <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
          </div>
          <div class="btn">
            <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
          </div>
        </div>
          <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
          <div class="search-bot">
            <img src="@/static/image/search-bot.png" alt="">
            <i class="icon el-icon-arrow-down"></i>
            <i class="icon el-icon-arrow-up"></i>
          </div>
        </div>
      </div>
  
  
      <div class="table-content">
        <div class="table-title">
          <h3>
            <span>器具维护列表</span>
            <el-tooltip effect="light" content="器具维护列表" placement="right">
             <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn" style="margin-right: 90px;">
            <el-button type="primary" plain size="mini" @click="showAddDialog(true)" v-entity="1012008">新增器具</el-button>
            <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1012009">修改器具</el-button>
            <el-button type="primary" plain size="mini" @click="delDevInfo()" v-entity="1012010">删除器具</el-button>
            <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1012030">导入Excel</el-button>
          </div>
        </div>
        <tableCommon tableName="maintenanceManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true">
          <template v-slot:default="{item}">
            <a href="javascript:void(0);" v-show="item.imgId" class="link" @click.stop="showImg(item)" style="margin: 0 10px;">查看</a>
          </template>
        </tableCommon>
      </div>
  
      <!-- 新建器具 开始-->
      <el-dialog :title="title" :visible.sync="isShowAddDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showAddDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item90">
                <label class="label-term"><em>*</em>器具名称</label>
                <div class="input-text">
                  <el-input v-model="devInfo.name" placeholder="请输入器具名称"></el-input>
                </div>
              </li>
              <li class="item item90">
                <label class="label-term"><em>*</em>长宽高</label>
                <div class="input-text" style="display:flex;">
                  <el-input style="margin-right: 10px;" v-model="devInfo.length" placeholder="长度(mm)"></el-input>
                  <el-input style="margin-right: 10px;" v-model="devInfo.width" placeholder="宽度(mm)"></el-input>
                  <el-input v-model="devInfo.height" placeholder="高度(mm)"></el-input>
                </div>
              </li>
              <li class="item item90">
                <label class="label-term"><em>*</em>管理单位</label>
                <div class="input-text">
                  <el-select v-model="devInfo.deviceUnit" placeholder="请选择" clearable>
                    <el-option v-for="item in deviceUnitOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                    </el-option>
                  </el-select>
                </div>
              </li>
                <li class="item item90">
                    <label class="label-term"><em>*</em>器具类型</label>
                    <div class="input-text">
                        <el-select v-model="devInfo.deviceType" placeholder="请选择" clearable>
                            <el-option v-for="item in deviceTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                            </el-option>
                        </el-select>
                    </div>
                </li>
              <li class="item item90">
                <label class="label-term">器具备注</label>
                <div class="input-text">
                  <el-input v-model="devInfo.remark" placeholder="请输入器具备注"></el-input>
                </div>
              </li>
            </ul>
  
          <ul class="content clearfix">
            <li class="item img-upload">
              <label class="label-term">器具图片</label>
              <div class="input-text">
                <myFileModel ref="devImg" @successCallback="successCallback" :disabledEdit="false" :disabledDel="false"></myFileModel>
              </div>
            </li>
          </ul>
  
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showAddDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveDevData" >保存</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 新建器具 结束-->

      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

      <!-- 批量导入 -->
      <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/device.xls" title="器具导入"
                 bean="deviceBaseService" method="impAddStockInfo" repeatCheckNums="1"></my-import>
    </div>
  </template>
  
  <script>
  import maintenanceManage from './maintenanceManage.js'
  export default maintenanceManage
  </script>
  
  
  <style scoped>
  </style>
  