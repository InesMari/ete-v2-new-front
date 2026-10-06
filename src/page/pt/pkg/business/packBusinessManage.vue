<template>
    <div id="packBusinessManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户：</label>
                  <div class="input-text">
                      <el-select v-model="loadParam.custTenantId" placeholder="客户" @change="changeCustSel" clearable filterable>
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name"
                                   :value="item.tenantId"></el-option>
                      </el-select>
                  </div>
                </div>
                <div class="item">
                    <label class="label">包装名称：</label>
                    <div class="input-text">
                        <el-select v-model="loadParam.pkgId" placeholder="包装名称" @change="doQuery" clearable filterable>
                          <el-option v-for="item in packInfoDataSel" :key="item.pkgId" :label="item.pkgName"
                                     :value="item.pkgId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">包装类型：</label>
                    <div class="input-text">
                        <el-select v-model="loadParam.packingType" placeholder="包装类型" @change="doQuery" clearable >
                          <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName"
                                     :value="item.codeValue"></el-option>
                        </el-select>
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
                    <span>包装租赁列表</span>
                    <el-tooltip effect="light" content="包装租赁列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showReovery(true)" v-entity="1004016">手工回收</el-button>
                    <el-button type="primary" plain size="mini" @click="toDetail()" v-entity="1004017">查看明细</el-button>
                    <el-button type="primary" plain size="mini" @click="toPackMonitor()" v-entity="1004018">查看库存位置</el-button>
                </div>
            </div>
            <tableCommon tableName="pkgBusinessManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"></tableCommon>
        </div>

      <!-- 手工回收 -->
      <el-dialog title="手工回收" :visible.sync="showModify" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="showReovery(false)">
        <div class="common-info" style="border:none;padding:0;">
          <em style="font-size:14px;padding-left:22px;">注：确定回收之后会更新包装库存</em>
          <ul class="content clearfix" style="margin-top:10px;">
            <li class="item item50">
              <label class="label-term"><em>*</em>客户名称</label>
              <div class="input-text">
                <el-select v-model="pkgPackInfo.custTenantId" clearable filterable placeholder="请选择" @change="changeCust">
                  <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name" :value="item.tenantId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>包装名称</label>
              <div class="input-text">
                <el-select v-model="pkgPackInfo.pkgId" clearable filterable placeholder="请选择">
                  <el-option v-for="item in packInfoData" :key="item.pkgId" :label="item.pkgName" :value="item.pkgId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>交付地</label>
              <div class="input-text">
                <el-select v-model="pkgPackInfo.workId" clearable filterable placeholder="请选择">
                  <el-option v-for="item in tenantWorkData" :key="item.workId" :label="item.workName" :value="item.workId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>回收数量</label>
              <div class="input-text">
                <el-input v-model="pkgPackInfo.reoveryNums" placeholder="请输入实际回收数量"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>开始计费时间</label>
              <div class="input-text">
                <el-date-picker v-model="pkgPackInfo.chargeDate" type="date" placeholder="开始计费日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传</label>
              <!-- 批量导入 -->
              <my-import ref="myImport" :handle-success="myImportSuccessCallback" :noneDialog="true" template="/download/packReovery.xlsx" title="上传excel"
                   bean="pkgBusinessTF" method="saveReovery" repeatCheckNums="0" :param="pkgPackInfo"></my-import>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showReovery(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveReovery()">确定回收</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 手工回收 -->
    </div>
</template>

<script>
    import packBusinessManage from './packBusinessManage.js'

    export default packBusinessManage
</script>
<style lang="scss">
#packBusinessManage{
  .el-upload{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
    }
  }
}
</style>
