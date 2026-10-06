<template>
    <div id="confirmedBill">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierBillConfirmedBillSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>已审核供应商账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="已审核供应商账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showInvoice(true)" v-entity="1006053">发票提交</el-button>
                    <el-button type="primary" plain size="mini" @click="showWriteoff(true)" v-entity="1006054">手动核销</el-button>
                    <el-button type="primary" plain size="mini" @click="showUpInvoiceDetailDialog(true)" v-entity="1006055">发票明细</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoPay()" v-entity="1006158">生成付款单</el-button>
                    <el-button type="danger" plain size="mini" @click="revokeFcSupplierBillInfo" v-entity="1006056">撤销审核</el-button>
                    <el-button type="primary" plain size="mini" @click="downloadExcel" v-entity="1006152">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="exportExcel" v-entity="1006162">账单Excel导出</el-button>
                </div>
            </div>
            <tableCommon tableName="confirmedBillManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="false" :head="head" @dblclickItem="toFcSupplierBillDetail">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.payNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='payNums'">{{index>0?','+data:data}}</a>
                </template>
                <template v-slot:diyColorTd="{item}">
                    <a href="javascript:void(0);" :class="!item.imgUrl?'disabled':'link'"   class="link" @click.stop="showImg(item)" style="margin: 0 10px;">查看附件</a>
                </template>
            </tableCommon>
        </div>

      <el-dialog :title="title" :visible.sync="invoiceShow" width="1100px" :close-on-click-modal="false" :close-on-press-escape="false" >
        <div class="fcCommonPage">
          <div class="common-info" style="padding:0;border:none;">
          <div class="tagList clearfix">
            <div class="tag" style="width:50%">
              <div class="tip"><span>资料</span></div>
              <h3 class="title">基本信息</h3>
              <div class="contet">
                <div class="item">
                  <div class="label">供应商名称：</div>
                  <div class="text fw">{{ billInfo.supplierName}}</div>
                </div>
                <div class="item">
                  <div class="label">账单月份：</div>
                  <div class="text fw">{{ billInfo.billMonth}}</div>
                </div>
                <div class="item">
                  <div class="label"><em>*</em>开户名字：</div>
                  <el-select v-model="billInfo.receiveBankId" :disabled="showSupplyInvoiceSingle" placeholder="开户名字" @change="selBank" filterable clearable>
                    <el-option v-for="j in supplierBankData" :key="j.receiveBankId" :label="j.label" :value="j.receiveBankId"></el-option>
                  </el-select>
                </div>
                <div class="item">
                  <div class="label">开户卡号：</div>
                  <div class="text fw">{{billInfo.bankNum}}</div>
                </div>
                <div class="item">
                  <div class="label">开户行：</div>
                  <div class="text fw">{{billInfo.bankName}}</div>
                </div>
                <div class="item">
                  <div class="label">支行名称：</div>
                  <div class="text fw">{{billInfo.branchName}}</div>
                </div>
              </div>
            </div>
            <div class="tag" style="width:50%">
              <div class="tip"><span>账单</span></div>
              <h3 class="title">账单金额</h3>
              <h5 class="cash">￥{{ billInfo.totalFee }} 元</h5>
              <div class="contet center">
                <div class="item">
                  <div class="label fw">运输金额：</div>
                  <div class="text">￥{{ billInfo.waybillFee }}元</div>
                </div>
                <div class="item">
                  <div class="label fw">仓储金额：</div>
                  <div class="text">￥{{ billInfo.storehouseFee }}元</div>
                </div>
                <div class="item">
                  <div class="label fw">器具金额：</div>
                  <div class="text">￥{{ billInfo.packCostFee }}元</div>
                </div>
                <div class="item">
                  <div class="label fw">其他金额：</div>
                  <div class="text">￥{{ billInfo.otherFee }}元</div>
                </div>
                <div class="item">
                  <div class="label fw">补录金额：</div>
                  <div class="text">￥{{ billInfo.makeupFee }}元</div>
                </div>
              </div>
            </div>
          </div>
            单个发票申请-开始
          <ul class="content clearfix" v-if="showSupplyInvoiceSingle">
            <li class="item item50">
              <label class="label-term">发票税率(%)</label>
              <div class="input-text"><el-input v-model="billInfo.invoiceTax" v-mypmdouble4val disabled></el-input></div>
            </li>
            <li class="item item50">
              <label class="label-term">发票类型</label>
              <div class="input-text">
                <el-select v-model="billInfo.invoiceType" placeholder="" disabled>
                  <el-option v-for="item in invoiceTypeData" :key="item.codeValue" :label="item.codeName"
                             :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <ul class="content clearfix"  v-if="showSupplyInvoiceSingle">
            <li class="item item50">
              <label class="label-term">本次交票金额</label>
              <div class="input-text">
                <el-input v-model="billInfo.invoiceFee" v-mypmdouble4val disabled></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">发票号</label>
              <div class="input-text">
                <el-input type="text" v-model="billInfo.invoiceNum" maxlength="255"></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix"  v-if="showSupplyInvoiceSingle">
            <li class="item">
              <label class="label-term">发票图片</label>
              <div class="input-text">
                <myFileModel ref="invoiceInfo" supportFiles="img,pdf"></myFileModel>
              </div>
            </li>
          </ul>
          <ul class="content clearfix"  v-if="showSupplyInvoiceSingle">
            <li class="item" style="width: 98%;">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input type="textarea" v-model="billInfo.remark"></el-input>
              </div>
            </li>
          </ul>

          <!--  单个发票申请-结束  -->
          <div class="table_height" v-if="!showSupplyInvoiceSingle">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead >
              <tr>
                <th width="60">序号</th>
                <th width="100">发票税率（%）</th>
                <th width="150">发票类型</th>
                <th width="100">需交票金额（含税）</th>
                <th width="100">本次交票金额</th>
                <th width="120">发票号</th>
                <th width="100">发票图片</th>
                <th width="150">备注</th>
                <th width="120">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in billInvoiceData" >
                <td :rowspan="item.rows" v-if="item.order">{{item.order}}</td>
                <td :rowspan="item.rows" v-if="item.order">{{item.invoiceTax}}
                </td>
                <td>
                  <el-autocomplete
                      class="inline-input"
                      v-model="item.invoiceType"
                      @focus="initInvoiceTypeData"
                      :fetch-suggestions="querySearch"
                      placeholder="发票类型"></el-autocomplete>
                </td>
                <td :rowspan="item.rows" v-if="item.order">{{item.maxInvoiceFee}}</td>
                <td>
                  <el-input type="text" v-mydouble4val v-model="item.invoiceFee" @change="checkInvoiceFee(item)"></el-input>
                </td>
                <td>
                  <el-input type="text" v-model="item.invoiceNum" maxlength="255"></el-input>
                </td>
                <td>
                  <img v-if="item.invoiceImgFullPath" :src="item.invoiceImgFullPath" @click="showBigImg(item.invoiceImgFullPath)" title="点击查看大图" style="width:30px;height:30px;">
                </td>
                <td>
                  <el-input type="text" v-model="item.remark" maxlength="255"></el-input>
                </td>
                <td>
                  <myFileModel :ref="'businessLicense'+index" @successCallback="imgCallback" supportFiles="img,pdf" :componentId="index" clickType="text" style="display:inline-block;vertical-align: top;margin-right:5px;" ></myFileModel>
                  <a href="javascript:;" class="link red" style="margin-right:5px;" v-if="item.parentOrder!=-1" @click="removeItem(index)">删除</a>
                  <a href="javascript:;" class="link" @click="addItem(item,index)" v-if="item.addFlag==1">新增</a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="showInvoice(false)">关闭</el-button>
            <el-button type="primary" @click="sureSubmit" v-show="!showSupplyInvoiceSingle">确定提交</el-button>
            <el-button type="primary" @click="sureUpdate" v-show="showSupplyInvoiceSingle">确定修改</el-button>
          </div>
        </div>
        </div>
      </el-dialog>

      <el-dialog :title="writeoffTitle" :visible.sync="writeoffShow" width="1100px" :close-on-click-modal="false" :close-on-press-escape="false" >
        <div class="fcCommonPage">
          <div class="common-info" style="padding:0;border:none;">
            <div class="tagList clearfix">
              <div class="tag" style="width:50%">
                <div class="tip"><span>资料</span></div>
                <h3 class="title">基本信息</h3>
                <div class="contet">
                  <div class="item">
                    <div class="label">供应商名称：</div>
                    <div class="text fw">{{ billInfo.supplierName}}</div>
                  </div>
                  <div class="item">
                    <div class="label">账单月份：</div>
                    <div class="text fw">{{ billInfo.billMonth}}</div>
                  </div>
                </div>
              </div>
              <div class="tag" style="width:50%">
                <div class="tip"><span>账单</span></div>
                <h3 class="title">账单金额</h3>
                <h5 class="cash">￥{{ billInfo.totalFee }} 元</h5>
                <div class="contet center">
                  <div class="item">
                    <div class="label fw">运输金额：</div>
                    <div class="text">￥{{ billInfo.waybillFee }}元</div>
                  </div>
                  <div class="item">
                    <div class="label fw">仓储金额：</div>
                    <div class="text">￥{{ billInfo.storehouseFee }}元</div>
                  </div>
                  <div class="item">
                    <div class="label fw">其他金额：</div>
                    <div class="text">￥{{ billInfo.otherFee }}元</div>
                  </div>
                  <div class="item">
                    <div class="label fw">补录金额：</div>
                    <div class="text">￥{{ billInfo.makeupFee }}元</div>
                  </div>
                </div>
              </div>
            </div>
            <!--  单个发票申请-结束  -->
            <div class="table_height">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead >
                <tr>
                  <th width="60">序号</th>
                  <th width="100">发票税率（%）</th>
                  <th width="100">需交票金额（含税）</th>
                  <th width="100">本次核销金额</th>
                  <th width="250">备注</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in billInvoiceData" >
                  <td>{{index+1}}</td>
                  <td>{{item.invoiceTax}}
                  </td>
                  <td>{{item.maxInvoiceFeeSrc}}</td>
                  <td>
                    <el-input type="text" v-mydouble4val v-model="item.writeoffFee" @change="checkWriteoffFee(item)"></el-input>
                  </td>
                  <td>
                    <el-input type="text" v-model="item.remark" maxlength="255"></el-input>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="bot-btn" style="margin-top: 20px;">
              <el-button @click="showWriteoff(false)">关闭</el-button>
              <el-button type="primary" @click="submitWriteoff">确定提交</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 发票申请明细 -->
      <el-dialog class="upInvoiceDetail" :title="'账单【' + billNum + '】发票提交明细'" :visible.sync="upInvoiceDetailDialog" width="1100px" :close-on-click-modal="false" :close-on-press-escape="false" >
        <div class="table-content">
          <!-- 条件 -->
          <div class="table-title">
            <div class="searchInfo fl">
              <label class="label fl">审核状态：</label>
              <div class="input-text fl">
                <el-select v-model="queryDetail.verifyState" placeholder="审核状态" @change="loadBillInvoiceDetail" clearable>
                  <el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
              <el-button class="fl" type="primary" size="mini" @click="loadBillInvoiceDetail">查询</el-button>
              <div class="tip fl">
                  <em>注1：已申请付款单、未审核、不通过的发票可以修改附件；</em>
                  <em>注2：未申请付款单、未审核、不通过的发票可以撤销；</em>
              </div>
            </div>
            <div class="table-title-btn">
              <el-button type="primary" plain size="mini" @click="viewInvoice">查看发票</el-button>
              <el-button type="primary" plain size="mini" @click="revokeBillInvoice">撤销提交</el-button>
              <el-button type="primary" plain size="mini" @click="showModifyInvoice(true)">修改发票</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <tableCommon tableName="confirmedBillInvoiceDetailListTable" v-if="upInvoiceDetailDialog" ref="detailTable" :showNum="true" :showSetTable="false"
                       :singleSelect="true" :head="detailHead" >
          </tableCommon>
        </div>
        <div class="bot-btn" style="margin-top: 20px;">
          <el-button @click="showUpInvoiceDetailDialog(false)">关闭</el-button>
        </div>
      </el-dialog>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList" :zIndex="10000"></fileViewer>

    </div>
</template>

<script>
	import confirmedBill from './confirmedBill.js'
	export default confirmedBill
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#confirmedBill {
  height: calc(100% - 41px) !important;
  .el-dialog{
    .table_height{
      overflow:auto;
      min-height:200px;
      max-height:300px;
      border:$border;
    }
  }
  .upInvoiceDetail{
    .el-dialog__body{
      padding-top: 0;
    }    
    .table-content{
        border:none;
        .searchInfo{
            line-height: 30px;
            display: flex;
            align-items: center;
            .el-input__inner{
                height: 30px;
                line-height: 30px;
            }
            .el-input__icon{
                line-height: 30px;
            }
            .el-button{
                margin:0 15px;
            }
            .tip{
                display: flex;
                flex-direction: column;
            }
        }
        .table-title-btn{
            padding-top: 6px;
        }
    }
  }
  .tagList .tag {
    height: 300px;
    .contet .item .label{
      width: 120px!important;
    }
  }
  .el-icon-remove-outline{
    color: red;
    font-size: 18px;
  }
  .el-icon-circle-plus-outline{
    color: $main-color;
    font-size: 18px;
  }

  .content {
    >.item {
      display: block;
      margin-bottom: 10px;
      float: left;
      width: 23%;
      min-width: 240px;
      margin-right: 2%;

      .label-term {
        float: left;
        width: 84px;
        height: 40px;
        padding-right: 10px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
      }

      .input-text {
        float: left;
        width: calc(100% - 94px);
        line-height: 40px;
        position: relative;

        .el-select {
          width: 100%;
          .el-input__icon{
            line-height: 40px;
          }
        }

        .lint {
          position: absolute;
          line-height: 40px;
          color: $main-color;
          text-decoration: underline;
          top: 0;
          right: 5px;
        }
        .unit {
          position: absolute;
          line-height: 40px;
          top: 0;
          right: 5px;
        }

        .el-checkbox-group{
          line-height: 40px;
        }
        .el-date-editor.el-input{
          width: 100%;
        }
      }
      .input-range{
        border:$border;
        border-radius: 3px;
        box-sizing: border-box;
        .el-input{
          width:auto;
        }
        .el-input__inner{
          border:none;
          width:120px;
        }
      }
    }
    .item50{
      width: 48%;
      margin-right: 2%;
    }
    .item100{
      width: 100%;
    }
    .img-upload {
      .label-term {
        line-height: 20px;
        margin-top: 40px;
      }
    }
    &.content-text{
      .label-term{
        text-align: right;
      }
    }
    .el-textarea__inner{
      width: 100%;
    }
  }
}
</style>
