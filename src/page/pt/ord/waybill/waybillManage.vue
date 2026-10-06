<template>
    <div id="waybillManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="waybillManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>派车单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="派车单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                  <!--                <el-button type="primary" plain size="mini" v-entity="87" @click="dispatch(1)">拼车调度</el-button>-->
<!--                <el-button type="primary" plain size="mini" v-entity="88" @click="dispatch(2)">提货中转</el-button>-->
<!--                <el-button type="primary" plain size="mini" v-entity="89" @click="dispatch(3)">整车调度</el-button>-->
<!--                <el-button type="primary" plain size="mini" v-entity="90" @click="dispatch(4)">中转调度</el-button>-->
                <el-button type="primary" plain size="mini" v-entity="1003088" @click="generateWaybillInfoQrCode">生成小程序码</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003035" @click="doCopy">复制派车单信息</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003036"  @click="toWaybillDetailBtn">查看派车单</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003037"  @click="toUpdateWaybill">修改派车单</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003038"  @click="openAddReceipts()" >上传单据</el-button>
                <el-tooltip effect="light" content="已完成没进账单，时间没超过次月15号，可以异动，时间超次月15号，不能异动！" placement="right">
                  <el-button type="primary" plain size="mini" v-entity="1003039"  @click="toFeeChange">费用异动</el-button>
                </el-tooltip>
                <el-button type="primary" plain size="mini" v-entity="1003040"  @click="cancelWaybills">取消派车单</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003041"  @click="showWorkNode" >操作节点</el-button>
<!--                <el-button type="primary" plain size="mini" v-entity="1003042"  @click="syncG7">同步平台</el-button>-->
                <el-button type="primary" plain size="mini" v-entity="1003043"  @click="download()" >导出EXCEL</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003044"  @click="showGps=true;" >导出运作状况</el-button>
<!--                <el-button type="primary" plain size="mini" v-entity="1003045"  @click="appealWaybill" >发起申诉</el-button>-->
<!--                <el-button type="primary" plain size="mini" v-entity="1003046"  @click="changeGroundShow(true)" >切换基地</el-button>-->
                <el-button type="primary" plain @click="verifyWaybill" size="mini" v-entity="1003078">入账审核</el-button>
                <el-button type="primary" plain size="mini" @click="changeSupplierShow(true)" v-entity="1003106">切换供应商</el-button>
                <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1003098">批量导入</el-button>
                <el-button type="primary" plain size="mini" @click="receiveReceiptById" v-entity="1003105">收单确认</el-button>
                <el-button type="primary" plain size="mini" @click="toScanReceipt" v-entity="1003105">扫码收单确认</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003111" @click="smsReminderDriverDeliver">短信提醒</el-button>
              </div>
            </div>
            <tableCommon tableName="waybillManageTable" ref="table" :head="head" :showNum="true" :doSelectSum="true" :showSetTable="true" :singleSelect="true" @dblclickItem="toWaybillDetailDbClick">
              <template v-slot:default="{item,code}">
                <div v-if="code=='orderNum'">
                  <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.orderNums" @click.stop="toOrderDetail(item,index)">{{index>0?','+data:data}}</a>
                </div>
                <div v-if="code=='transportationAgreementFileUrl'">
                  <a href="javascript:void(0);" class="link" :class="!item.transportationAgreementFileUrl||item.waybillState<=1?'disabled':'link'" @click.stop="showImg(item)" style="margin: 0 10px;">查看接单声明</a>
                </div>
              </template>
              <template v-slot:diyColorTd="{item}">
                <span :style="item.waybillState==4?'color:red!important':''">{{ item.waybillStateName }}</span>
              </template>
            </tableCommon>
        </div>

      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

      <el-dialog title="操作节点"  :visible.sync="showWorkNodeDialog" :close-on-click-modal="false" :close-on-press-escape="false"
                 :modal-append-to-body="false"
                 width="1050px" @close="close">
        <workNode ref="workNode"  @close="close"></workNode>
      </el-dialog>

      <!-- 导出运作状况-开始 -->
      <el-dialog title="导出运作状况" :visible.sync="showGps" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div style="position: relative;padding-left: 45px;margin-bottom: 15px;">
          <img class="tip" src="@/static/image/tip.png" alt="" style="width:24px;position: absolute;top:50%;margin-top:-12px;left: 10px">
          请选择每天固定的定位时间<br>
          系统会按照固定时间获取定位/预计到达时间/距离目的地
        </div>
        <div class="common-info" style="border:none;padding:20;">
          <ul class="content clearfix">
            <li class="item" style="width: 80%;">
              <label class="label-term"><em>*</em>定位时间1</label>
              <div class="input-text">
                <el-time-select v-model="value1" :picker-options="{format: 'HH', step:'01:00', start:'00:00', end:'23:00',  }" placeholder="选择时间"/>
              </div>
            </li>
            <li class="item " style="width: 80%;">
              <label class="label-term"><em>*</em>定位时间2</label>
              <div class="input-text">
                <el-time-select v-model="value2" :picker-options="{format: 'HH', step:'01:00', start:'00:00', end:'23:00',  }" placeholder="选择时间"/>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeGpsDialog()">关闭</el-button>
            <el-button type="primary" size="mini" @click="downloadExcel">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 导出运作状况-结束 -->

        <!-- 上传回单-开始 -->
        <el-dialog title="上传单据" :visible.sync="showReceipts" width="680px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>派车单号</label>
                        <div class="input-text">
                            <el-input v-model="receipts.waybillNum" maxlength="100" placeholder="派车单号"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>订单号</label>
                        <div class="input-text">
                            <el-select v-model="receipts.orderId" placeholder="请选择订单" @change="changeWaybillOrder"
                                       filterable clearable>
                                <el-option v-for="item in orderData" :key="item.orderId" :label="item.orderNum"
                                           :value="item.orderId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">客户</label>
                        <div class="input-text">
                            <el-input v-model="receipts.tenantName" maxlength="100" placeholder="客户"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>作业点</label>
                        <div class="input-text">
                            <el-select v-model="receipts.waybillWorkId" placeholder="作业点" @change="changeWaybillWork"
                                       filterable >
                                <el-option v-for="item in waybillWorkData" :key="item.waybillWorkId"
                                           :label="item.workName" :value="item.waybillWorkId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">详细地址</label>
                        <div class="input-text">
                            <el-input v-model="receipts.workAddressStr" maxlength="50" placeholder="详细地址"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据类型</label>
                        <div class="input-text">
                            <el-radio v-model="receipts.receiptsType" label="1" >回单</el-radio>
                            <el-radio v-model="receipts.receiptsType" label="2" >过磅单</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据图片</label>

                      <div class="input-text uploadFile clearfix">
                        <div class="fl mr_20 mb_20" v-for="(item,index) in list" >
                          <myFileModel :ref="'file' + index" v-if="showReceipts" @successCallback="fileCallback" @delCallback="delCallback" :componentId="index"></myFileModel>
                          <p>只支持.jpg .png .pdf格式</p>
                        </div>
                      </div>
<!--                      -->
<!--                        <div class="input-text">-->
<!--                            <myFileModel v-if="showReceipts" ref="receiptsImg" :disabledEdit="false"-->
<!--                                         :disabledDel="false" @successCallback="setImgData"></myFileModel>-->
<!--                        </div>-->
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="addReceipts()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 上传回单-结束 -->



      <!-- 切换基地-开始 -->
      <el-dialog title="切换基地" :visible.sync="showGround" width="320px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term"><em>*</em>基地</label>
              <div class="input-text">
                <el-select v-model="g7NtoccGround" placeholder="请选择基地" filterable clearable>
                  <el-option v-for="item in g7NtoccGroundData" :key="item.codeName" :label="item.codeName"
                             :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="changeGroundShow(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="transG7NtoccGround()">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 切换基地-结束 -->

      <!-- 切换供应商-开始 -->
      <el-dialog title="切换供应商" :visible.sync="showChangeSupplier" width="320px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term"><em>*</em>供应商</label>
              <div class="input-text">
                <el-select v-model="tenantId" placeholder="请选择供应商" filterable clearable>
                  <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.supplierName"
                             :value="item.tenantId"></el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="changeSupplierShow(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="changeSupplier()">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 切换供应商-结束 -->

        <!-- 导入派车单 -->
        <my-import :open.sync="uploadOpen" :handle-success="doQuery" repeatCheckNums="0"
                   template="/download/waybill.xlsx" title="派车单导入" bean="ordWaybillTF"
                   method="importWaybillFromExcel"></my-import>
        <!-- 导入派车单 -->

    </div>
</template>

<script>
    import waybillManage from './waybillManage.js'
    export default waybillManage
</script>
<style lang="scss">
.mr_20{
  margin-right: 20px;
}
#waybillManage {
  .equipmentFocus {
    position: relative;
    z-index: 99;

    .el-textarea__inner {
      height: 60px !important;
      border: 1px solid #DCDFE6 !important;
      box-sizing: border-box;
    }
  }
}
</style>
