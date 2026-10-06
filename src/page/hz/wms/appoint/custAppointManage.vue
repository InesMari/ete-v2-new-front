<template>
    <div id="custAppointManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="custAppointManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓库预约列表</span>
                    <el-tooltip effect="light" content="仓库预约列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="2003012" @click="toAdd">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="2003013" @click="toUpdate">修改</el-button>
                  <el-button type="primary" plain size="mini" v-entity="2003014" @click="del">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="2003015" @click="uploadOpen=true">导入</el-button>
                  <el-button type="primary" plain size="mini" v-entity="2003016" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="custAppointManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true">
            </tableCommon>
        </div>

      <!-- 批量导入 -->
      <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/custAppoint.xlsx" title="批量导入"
                 bean="wmsCustAppointTF" method="impAddWmsAppoint"></my-import>
      <!-- 新增 预约 -->
      <el-dialog :title="title" :visible.sync="dialogShow" width="520px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="close()">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term"><em>*</em>仓库</label>
              <div class="input-text">
                <el-select v-model="info.workId" @input="$forceUpdate()"  placeholder="请选择车长" clearable filterable
                           :disabled="isLock">
                  <el-option v-for="item in workList" :key="item.workId"
                             :label="item.workName" :value="item.workId"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">车牌号码</label>
              <div class="input-text">
                <el-input v-model="info.plateNumber" placeholder="请输入车牌号" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">车长</label>
              <div class="input-text">
                <el-select v-model="info.vehicleLength" @input="$forceUpdate()"  placeholder="请选择车长" clearable filterable
                           :disabled="isLock">
                  <el-option v-for="item in vehicleLengthData" :key="item.codeValue"
                             :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>预计到达时间</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate()" v-model="info.expectArriveDate" type="date" :disabled="isLock"
                                placeholder="选择日期" align="right"  format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">司机名称</label>
              <div class="input-text">
                <el-input v-model="info.driverName" placeholder="请输入司机名称" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">司机手机</label>
              <div class="input-text">
                <el-input v-model="info.billId" placeholder="请输入司机手机" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>货物类型</label>
              <div class="input-text">
                <el-input v-model="info.goodsType" placeholder="请输入货物类型" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">批次号</label>
              <div class="input-text">
                <el-input v-model="info.batchNum" placeholder="请输入批次号" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">货物数量</label>
              <div class="input-text">
                <el-input v-model="info.goodsCount" v-mynumval placeholder="请输入货物数量" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">货物托数</label>
              <div class="input-text">
                <el-input v-model="info.goodsPallet" v-mydouble4val placeholder="请输入货物托数" @input="$forceUpdate()" :disabled="isLock"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="close()">取消</el-button>
            <el-button type="primary" size="mini" @click="save()" v-show="!isLock">确定</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
</template>

<script>
import custAppointManage from './custAppointManage.js'
export default custAppointManage
</script>
<style lang="scss">
</style>

