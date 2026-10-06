<template>
  <div id="supplierDriver">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item" style="width: 250px">
          <label class="label">司机名称：</label>
          <div class="input-text">
            <el-input v-model="query.driverName" placeholder="司机名称" type="text"></el-input>
          </div>
        </div>
        <div class="item" style="width: 250px">
          <label class="label">手机号：</label>
          <div class="input-text">
            <el-input v-model="query.driverPhone" placeholder="手机号" type="text"></el-input>
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
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>供应商司机列表</span>
          <el-tooltip effect="light" content="没有开票资质只能调度G7审核通过且签约成功的司机" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="showAdd">添加</el-button>
          <el-button type="danger" plain size="mini" @click="del">删除</el-button>
        </div>
      </div>
      <tableCommon tableName="driverTable" ref="driverTable" :showNum="true" :showSetTable="false" :head="head"></tableCommon>
    </div>
    <el-dialog title="添加司机"  :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="true" :append-to-body="true"
               width="580px" @close="showDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>司机</label>
            <div class="input-text">
              <el-select v-model="selDriverList" @change="$forceUpdate()" placeholder="请选择司机" multiple filterable>
                <el-option
                    v-for="item in driverList"
                    :key="item.driverId"
                    :label="item.driverName"
                    :value="item.driverId">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="showDialog=false;" >关闭</el-button>
          <el-button type="primary" size="mini" @click="add">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierDriver from './supplierDriver.js'
export default supplierDriver
</script>

<style scoped>

</style>
