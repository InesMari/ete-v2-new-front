<template>
  <div id="reservoirInfoManage">
    <select-work v-show="showSelWork"></select-work>
    <div class="search-list clearfix" v-show="!showSelWork">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">库区编码：</label>
          <div class="input-text">
            <el-input v-model="loadParam.reservoirCode" placeholder="库区编码" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">库区名称：</label>
          <div class="input-text">
            <el-input v-model="loadParam.reservoirName" placeholder="库区名称" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">库区类型：</label>
          <div class="input-text">
            <el-select v-model="loadParam.reservoirType" placeholder="库区类型" clearable>
              <el-option v-for="item in reservoirTypeData" :key="item.codeValue" :label="item.codeName"
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
    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
        <h3>
          <span>库区列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="库区列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAddReservoir(true)"  v-entity="1005051">新建</el-button>
          <el-button type="primary" plain size="mini" @click="toUpReservoir()" v-entity="1005052">修改</el-button>
          <el-button type="danger" plain size="mini" @click="delReservoirInfo()" v-entity="1005053">删除</el-button>
            <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
        </div>
      </div>
      <tableCommon tableName="reservoirManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem"></tableCommon>
    </div>
    <!-- 新增 库区 -->
    <el-dialog :title="title" :visible.sync="showReservoir" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddReservoir(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>库区编码</label>
            <div class="input-text">
              <el-input v-model="reservoir.reservoirCode" placeholder="请输入库区编码" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>库区名称</label>
            <div class="input-text">
              <el-input v-model="reservoir.reservoirName" placeholder="请输入库区名称" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>库区类型</label>
            <div class="input-text">
              <el-select v-model="reservoir.reservoirType" placeholder="请选择库区类型" clearable filterable :disabled="isLock">
                <el-option v-for="item in reservoirTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>是否为VMI</label>
            <div class="input-text">
              <el-select v-model="reservoir.isVmi" placeholder="请选择是否为VMI" clearable filterable :disabled="isLock">
                <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddReservoir(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveReservoir()" v-show="!isLock">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import reservoirInfoManage from './reservoirInfoManage.js'

export default reservoirInfoManage
</script>
<style lang="scss">

</style>

