<template>
    <div id="wasteDisposalIncomeManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="wasteDisposalIncomeManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>废品处理收入列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="废品处理收入列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addIncome" v-entity="1006220">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="updateIncome" v-entity="1006221">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteIncome" v-entity="1006222">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="confirmIncome" v-entity="1006223">财务确认</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006224">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="detailIncome" v-entity="1006225">详情</el-button>
                </div>
            </div>
            <tableCommon tableName="wasteDisposalIncomeManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="false" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='fileId'"
                       :class="item.handlingChecklistUrl == null || item.handlingChecklistUrl == undefined || item.handlingChecklistUrl == '' ? 'link color999' : 'link'"
                       @click.stop="showFile(item.handlingChecklistUrl)"
                       style="margin: 0 10px;">处理清单</a>
                    <a href="javascript:void(0);" v-if="code=='fileId'"
                       :class="item.settlementDocumentUrl == null || item.settlementDocumentUrl == undefined || item.settlementDocumentUrl == '' ? 'link color999' : 'link'"
                       @click.stop="showFile(item.settlementDocumentUrl)"
                       style="margin: 0 10px;">结算单据</a>
                    <a href="javascript:void(0);" v-if="code=='fileId'"
                       :class="item.salesRecordsUrl == null || item.salesRecordsUrl == undefined || item.salesRecordsUrl == '' ? 'link color999' : 'link'"
                       @click.stop="showFile(item.salesRecordsUrl)"
                       style="margin: 0 10px;">售卖记录</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

      <!-- 财务确认 begin-->
      <el-dialog title="财务确认" :visible.sync="confirmShow" width="500px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="showConfirm(false)">
        <div class="fcCommonPage">
          <div class="common-info" style="border:none;padding:0;">
            <p style="text-align:center;margin: -15px 0 10px;">确认需要进行财务确认操作？</p>
            <ul class="content clearfix;">
              <li class="item item100">
                <label class="label-term"><em>*</em>收款日期</label>
                <div class="input-text">
                  <el-date-picker v-model="info.receiveFeeDate" type="date" placeholder="收款日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">收款备注</label>
                <div class="input-text">
                  <el-input v-model="info.confirmRemark" type="textarea" maxlength="200" placeholder="请输入收款备注" @input="$forceUpdate();" ></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="showConfirm(false)">关闭</el-button>
              <el-button type="primary" size="mini" @click="confirm()">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 财务确认 end-->

    </div>
</template>

<script>
import wasteDisposalIncomeManage from './wasteDisposalIncomeManage.js'

export default wasteDisposalIncomeManage
</script>

<style scoped>
    .color999 {
        color: #999 !important;
    }
</style>
