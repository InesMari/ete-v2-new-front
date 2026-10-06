<template>
  <div id="stockMaterialManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">所属货主：</label>
          <div class="input-text">
            <el-input v-model="loadParam.srcTenantName" placeholder="搜索所属货主" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">到货厂商：</label>
          <div class="input-text">
            <el-input v-model="loadParam.fromTenantName" placeholder="搜索到货厂商" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">物料编码：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialNum" placeholder="搜索物料编码" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">物料描述：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialDesc" placeholder="搜索物料描述" type="text"></el-input>
          </div>
        </div>
          <div class="item">
              <label class="label">供应商批次号：</label>
              <div class="input-text">
                  <el-input v-model="loadParam.supplierBatchNum" placeholder="搜索供应商批次号" type="text"></el-input>
              </div>
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

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>在库管理列表-按物料</span>
          <el-tooltip effect="light" content="在库管理列表-按物料" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005034" @click="uploadOpen=true">批量导入</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005035" @click="download">导出Excel</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005088" @click="downloadExcel">导出出入库详情</el-button>
            <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
        </div>

      </div>
      <tableCommon tableName="stockMaterialManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true" ></tableCommon>
    </div>

      <!-- 批量导入 开始-->
      <el-dialog class="sureDialog" title="导入库存" :visible.sync="uploadOpen" :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 width="500px" @close="showUpload(false)">
          <div class="common-info" style="border:none;padding:0;">
              <em style="font-size:14px;padding-left:22px;">注：所属货主必须是到货厂商的归属货主</em>
              <ul class="content clearfix" style="margin-top:10px;">
                  <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                      <my-import ref="myImport" :handle-success="sureSuccess" :noneDialog="true"
                                 template="/download/stockMaterial.xlsx" title="导入库存"
                                 tip="仅允许导入“xls”或“xlsx”格式文件！" bean="wmsInOrderTF" method="importWmsStockInfo"></my-import>
                  </li>
              </ul>
              <div class="page-bot-btn ">
                  <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                  <el-button type="primary" size="mini" @click="sure()">确认</el-button>
              </div>
          </div>
      </el-dialog>
      <!-- 批量导入 结束-->

  </div>
</template>

<script>
import stockMaterialManage from './stockMaterialManage.js'
export default stockMaterialManage
</script>

<style scoped>

</style>
