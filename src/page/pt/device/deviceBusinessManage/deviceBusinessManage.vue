<template>
    <div id="deviceBusinessManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户：</label>
                  <div class="input-text">
                      <el-select v-model="query.custTenantId" placeholder="客户" @change="doQuery" clearable filterable>
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.tenantName"
                                   :value="item.tenantId"></el-option>
                      </el-select>
                  </div>
                </div>
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
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
                    <span>器具租赁列表</span>
                    <el-tooltip effect="light" content="器具租赁列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true)" v-entity="1012018">手工回收</el-button>
                </div>
            </div>
            <tableCommon tableName="deviceBusinessManageTable" ref="table" :head="head" :showNum="true" :single-select="true" :showSetTable="true"></tableCommon>
        </div>


      <!-- 手工回收 -->
      <el-dialog title="手工回收" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="openDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <em style="font-size:14px;padding-left:22px;">注：确定回收之后会更新器具库存</em>
          <ul class="content clearfix" style="margin:10px 30px 0 0;">
              <li class="item item100">
                  <label class="label-term"><em>*</em>po单</label>
                  <div class="input-text">
                      <el-select v-model="info.purchaseId" @change="changePurchase" filterable clearable placeholder="请选择">
                          <el-option v-for="item in POData" :key="item.id" :label="item.purchaseOrderNum"
                                      :value="item.id"></el-option>
                      </el-select>
                  </div>
              </li>
              <li class="item item100">
                  <label class="label-term"><em>*</em>回收数量</label>
                  <div class="input-text">
                      <el-input v-model="info.reoveryCount" v-mynumval @input="forceUpdate" placeholder="请输入回收数量"></el-input>
                  </div>
              </li>
              <li class="item item100">
                  <label class="label-term"><em>*</em>回收日期</label>
                  <div class="input-text">
                      <el-date-picker v-model="info.actualDate" type="date" placeholder="请选择年月日" value-format="yyyy-MM-dd"></el-date-picker>
                  </div>
              </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="openDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveReovery()">确定回收</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 手工回收 -->
    </div>
</template>

<script>
    import deviceBusinessManage from './deviceBusinessManage.js'

    export default deviceBusinessManage
</script>
<style lang="scss">
#deviceBusinessManage{
  .el-upload{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
    }
  }
}
</style>
