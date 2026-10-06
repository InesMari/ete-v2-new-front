<template>
    <div id="costAccountManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="costAccountManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车成本记账列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车成本记账列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain size="mini" @click="toShowAddCost(true,1)" v-entity="1006078">新增记账</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="toShowVerify(true)" v-entity="1006079">票据审核</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="delCostAccount()" v-entity="1006080">删除记账</el-button>-->
                </div>
            </div>
            <tableCommon tableName="costAccountManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         @dblclickItem="dblclickItem" :singleSelect="true">
            </tableCommon>
        </div>

        <!-- 票据审核 begin-->
        <div class="imageViewerOut" v-if="showVerify">
          <!-- 查看大图 -->
          <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
          <div class="imageViewerInfo">
            <div class="tipbox">
              <img class="tip" src="@/static/image/tip.png" alt="">
              <span class="text">请务必核对票据信息</span>
            </div>
            <div class="content">

              <div class="item">
                <div class="label">供应商名称：</div>
                <div class="text">{{accountInfo.supplierName}}</div>
              </div>
              <div class="item">
                <div class="label">车牌号码：</div>
                <div class="text">{{accountInfo.plateNumber}}</div>
              </div>
              <div class="item">
                <div class="label">记账类型：</div>
                <div class="text">{{accountInfo.accountTypeName}}</div>
              </div>
              <div class="item">
                <div class="label">票据类型：</div>
                <div class="text">{{accountInfo.invoiceTypeName}}</div>
              </div>
              <div class="item">
                <div class="label">税率：</div>
                <div class="text">{{accountInfo.plateNumber}}</div>
              </div>
              <div class="item">
                <div class="label">记账金额：</div>
                <div class="text">{{accountInfo.accountFee}}</div>
              </div>
              <div class="item">
                <div class="label">提交人：</div>
                <div class="text">{{accountInfo.createUserName}}</div>
              </div>
              <div class="item">
                <div class="label">提交时间：</div>
                <div class="text">{{accountInfo.createDate}}</div>
              </div>
              <div class="item">
                <div class="label">审核备注：</div>
                <div class="input-text">
                  <el-input v-model="accountInfo.verifyRemark" type="textarea" maxlength="200" placeholder="" ></el-input>
                </div>
              </div>
            </div>
            <div class="page-bot-btn">
              <el-button size="mini" type="danger" @click="verifyInvoice(2)">审核不通过</el-button>
              <el-button type="primary" size="mini" @click="verifyInvoice(1)">审核通过</el-button>
            </div>
          </div>
        </div>
      <!-- 票据审核 end-->
      <!-- 新增记账 begin-->
      <el-dialog :title="title" class="tickerLogDialog" :visible.sync="showAddCost" width="1200px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="toShowAddCost(false)">
        <div class="common-info" style="border:none;padding:0;">
          <div class="clearfix">
            <div class="fl" style="width:50%;">
              <ul class="content clearfix">
                <li class="item">
                  <label class="label-term"><em>*</em>票据类型</label>
                  <div class="input-text">
                    <el-select v-model="costInfo.invoiceType" placeholder="请选择" :disabled="isLock" @change="changeInvoiceType" clearable>
                      <el-option v-for="item in invoiceTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                  </div>
                </li>
                <li class="item">
                  <label class="label-term"><em>*</em>记账类型</label>
                  <div class="input-text">
                    <el-select v-model="costInfo.accountType" placeholder="请选择" :disabled="isLock" clearable>
                      <el-option v-for="item in accountTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                  </div>
                </li>
                <li class="item">
                  <label class="label-term"><em>*</em>记账金额</label>
                  <div class="input-text">
                    <el-input v-model="costInfo.accountFee" v-mydouble4val :disabled="isLock" @input="forupdate"></el-input>
                  </div>
                </li>
                <li class="item">
                  <label class="label-term"><em>*</em>税率(%)</label>
                  <div class="input-text">
                    <el-input v-model="costInfo.invoiceTax" v-mydoubleval :disabled="isLock || isGenralVote" @input="forupdate"></el-input>
                  </div>
                </li>
              </ul>
            </div>
            <div class="fr" style="width:50%;">
              <ul class="content clearfix">
                <li class="item item100">
                  <label class="label-term">备注</label>
                  <div class="input-text">
                    <el-input v-model="costInfo.remark" type="textarea" rows="4" maxlength="255" :disabled="isLock" @input="forupdate"></el-input>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <ul class="content clearfix">
            <li class="item item100 img-upload">
              <label class="label-term"><em>*</em>票据上传</label>
              <div class="input-text">
                <myFileModel class="fl" style="margin-right: 20px;" ref="invoiceInfo"></myFileModel>
                <myFileModel class="fl" style="margin-right: 20px;" ref="invoiceInfoTwo"></myFileModel>
                <myFileModel class="fl" style="margin-right: 20px;" ref="invoiceInfoThree"></myFileModel>
                <myFileModel class="fl" style="margin-right: 20px;" ref="invoiceInfoFour"></myFileModel>
                <myFileModel class="fl" style="margin-right: 20px;" ref="invoiceInfoFive"></myFileModel>
              </div>
            </li>
          </ul>
          <div class="clearfix" style="margin-bottom:10px;" v-show="!isLock">
            <el-input v-model="waybillParam.plateNumber" placeholder="车牌号码" style="width:150px;"></el-input>
            <el-date-picker v-model="waybillParam.daterange" type="daterange"  range-separator="至" start-placeholder="收车日期"
                            end-placeholder="收车日期" value-format="yyyy-MM-dd" style="width:300px;margin:0 15px" ></el-date-picker>
            <el-button type="primary" @click="queryAddCostWaybillData()">查询</el-button>
            <div class="fr">
              记账金额：<el-input v-model="costInfo.accountFee" placeholder="" style="width:100px;margin-right:15px;" :disabled="true"></el-input>
              <el-button @click="shareFee()">自动拆分</el-button>
            </div>
          </div>
          <scrollTable ref="waybillTable" :head="waybillHead" :data="waybillData" @inputFn="inputFn" :doSum="true"></scrollTable>
          <div class="page-bot-btn ">
            <el-button @click="toShowAddCost(false)">关闭</el-button>
            <el-button type="primary" @click="saveCostAccountInfo()" v-show="!isLock">确定提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 新增记账 end-->
    </div>
</template>

<script>
    import costAccountManage from './costAccountManage.js'

    export default costAccountManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#costAccountManage {
  .tagList .tag .contet .item .label{
    width: 100px;
  }
}
.tickerLogDialog{
  .el-textarea{
    textarea{
      height: 89px;
    }
  }
  .table_height{
    border:$border;
  }
}
</style>

