<template>
    <div id="tsQuoteSheetManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="tsQuoteSheetManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>运输报价列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="运输报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1001078" @click="showGenerate()">报价单引入</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001079" @click="toAdd()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001080" @click="toUpdate()">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001081" @click="toCopy()">复制</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1001082" @click="delQuoteSheet">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001083" @click="confirmQuoteSheet">客户确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001084" @click="cancelConfirmQuoteSheet">撤销确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001085" @click="verifyQuoteSheet">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001086" @click="downloadPdf(1)">导出PDF</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001087" @click="downloadPdf(2)">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001088" @click="toAll">批量查看</el-button>
                </div>
            </div>
            <tableCommon tableName="tsQuoteSheetManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

      <!-- 报价单引入-开始 -->
      <el-dialog title="报价单引入" :visible.sync="generateShowFlag" width="520px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div style="position: relative;padding-left: 45px;margin-bottom: 15px;">
          <img class="tip" src="@/static/image/tip.png" alt="" style="width:24px;position: absolute;top:50%;margin-top:-12px;left: 10px">
          请选择报价结算单有效期进行报价单引入操作。报价单引入之后，自动生成报价结算单且自动审核通过，确认是否引入报价？
        </div>
        <div class="common-info" style="border:none;padding:20;">
          <ul class="content clearfix">
            <li class="item" style="width: 80%;">
              <label class="label-term"><em>*</em>有效期</label>
              <div class="input-text">
                <el-date-picker v-model="info.validDate" range-separator="至" @blur="forceUpdate" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="generateShowFlag = false;">关闭</el-button>
            <el-button type="primary" size="mini" @click="toGenerate">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 报价单引入-结束 -->

    </div>
</template>

<script>
import tsQuoteSheetManage from './tsQuoteSheetManage.js'
export default tsQuoteSheetManage
</script>
<style lang="scss">

</style>




