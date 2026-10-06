<template>
  <div id="monitorManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">设备名称：</label>
          <div class="input-text">
            <el-input v-model="query.name" placeholder="设备名称" type="text"></el-input>
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
          <span>监控列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="监控列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
        </div>
      </div>
      <tableCommon tableName="monitorManageTable" ref="table" :showNum="true" :showSetTable="false" :singleSelect="true" :head="head">
        <template v-slot:default="{item}">
          <a href="javascript:void(0);" class="link" style="margin: 0 10px;" @click.stop="showModifyName(item)">修改设备名称</a>
          <a href="javascript:void(0);" class="link" style="margin: 0 10px;" @click.stop="openMonitor(item)">监控</a>
        </template>
      </tableCommon>
    </div>

    <el-dialog title="修改设备名称" :visible.sync="showModifyNameflag" :close-on-click-modal="false" :close-on-press-escape="false" width="540px" @close="closeModifyName()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>设备名称</label>
            <div class="input-text">
              <el-input v-model="name" style="width: 300px"></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeModifyName()">取消</el-button>
          <el-button type="primary" size="mini" @click="modifyName()">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="监控" :visible.sync="deviceShow" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="closeMonitor()">
      <div class="hello-ezuikit-js" style="height:400px">
        <div id="video-container" style="width:600px;height:400px"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import monitorManage from './monitorManage.js'
export default monitorManage
</script>

<style scoped>

</style>
