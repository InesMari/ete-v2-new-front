<template>
    <div id="fcBudgetSalesManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="fcBudgetSalesManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>预算营收列表</span>
                    <el-tooltip effect="light" content="预算营收列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1007061" @click="toAdd">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007062" @click="toUpdate">修改</el-button>
                  <el-button type="danger" plain size="mini" v-entity="1007063" @click="toDel">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007064" @click="toCopy">复制</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007065" @click="showImp(true)">导入</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007066" @click="downloadExcel">导出</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007067" @click="toVerify">审核</el-button>
                </div>
            </div>
            <tableCommon tableName="fcBudgetSalesManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toView">
            </tableCommon>
        </div>

      <!-- 导入 -->
      <el-dialog title="导入预算营收" :visible.sync="impFlag" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="showImp(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix" style="margin-top:10px;">
            <li class="item item50">
              <label class="label-term"><em>*</em>预算营收名称</label>
              <div class="input-text">
                <el-input v-model="baseInfo.name" placeholder="预算营收名称" @input="$forceUpdate();"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>预算年度</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate()" v-model="baseInfo.year" type="year"
                                placeholder="选择年度" align="right" @change="initName"
                                format="yyyy" value-format="yyyy" >
                </el-date-picker>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="baseInfo.remark" placeholder="备注"  style="width: 98%;" @input="$forceUpdate();"></el-input>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传</label>
              <!-- 批量导入 -->
              <my-import ref="myImport" :handle-success="myImportSuccessCallback" :noneDialog="true" template="fcBudgetSales.xlsx" template-url="fcBudgetSalesTF|downloadExcelTmp" title="上传excel"
                         bean="fcBudgetSalesTF" method="impAddFcBudgetSalesInfo" repeatCheckNums="0,1,2,3,4" :param="baseInfo"></my-import>
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
import fcBudgetSalesManage from './fcBudgetSalesManage.js'
export default fcBudgetSalesManage
</script>
<style lang="scss">

</style>




