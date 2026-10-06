<template>
    <div id="fcActualSalesManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="fcActualSalesManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>实际营收列表</span>
                    <el-tooltip effect="light" content="实际营收列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1007068" @click="toAdd">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007069" @click="toUpdate">修改</el-button>
                  <el-button type="danger" plain size="mini" v-entity="1007070" @click="toDel">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007071" @click="showImp(true)">导入</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007072" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="fcActualSalesManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toView">
            </tableCommon>
        </div>

      <!-- 导入 -->
      <el-dialog title="导入实际营收" :visible.sync="impFlag" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="showImp(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix" style="margin-top:10px;">
            <li class="item item80">
              <label class="label-term"><em>*</em>实际营收名称</label>
              <div class="input-text">
                <el-input v-model="baseInfo.name" placeholder="实际营收名称" v-if="isNew" @input="$forceUpdate();"></el-input>
                <el-select v-model="baseInfo.id" placeholder="请选择实际营收" @change="baseInfoChange" filterable clearable v-else>
                  <el-option v-for="item in fcActualSalesData" :key="item.id" :label="item.name" :value="item.id" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li style="display: block;margin-bottom: 10px;float: left;width: 15%;margin-right: 2%;">
              <div class="input-text" style="float: left;line-height: 40px;position: relative;">
                <el-checkbox v-model="isNew" class="fl" @change="changeNew">新增</el-checkbox>
              </div>
            </li>
            <li class="item item80" v-if="isNew">
              <label class="label-term"><em>*</em>营收年度</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate()" v-model="baseInfo.year" type="year"
                                placeholder="选择年度" align="right" @change="initName"
                                format="yyyy" value-format="yyyy" >
                </el-date-picker>
              </div>
            </li>
            <li class="item item80" v-if="isNew">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="baseInfo.remark" placeholder="备注" @input="$forceUpdate();"></el-input>
              </div>
            </li>
            <li class="item item80">
              <label class="label-term"><em>*</em>导入月份</label>
              <div class="input-text">
                <el-select v-model="baseInfo.month" placeholder="请选择导入月份" filterable clearable>
                  <el-option v-for="item in monthData" :key="item.value" :label="item.name" :value="item.value" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传</label>
              <!-- 批量导入 -->
              <my-import ref="myImport" :handle-success="myImportSuccessCallback" :noneDialog="true" template="fcActualSales.xlsx" template-url="fcActualSalesTF|downloadExcelTmp"  title="上传excel"
                         bean="fcActualSalesTF" method="impAddFcActualSalesInfo" repeatCheckNums="0,1,2,3,4" :param="baseInfo"></my-import>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showImp(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="impAdd()">确定</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 导入 -->
    </div>
</template>

<script>
import fcActualSalesManage from './fcActualSalesManage.js'
export default fcActualSalesManage
</script>
<style lang="scss">

</style>




