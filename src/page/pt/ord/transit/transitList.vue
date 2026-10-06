<template>
  <div id="transitList">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="transitListSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>中转列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
<!--          <el-tooltip effect="light" content="Right Center 提示文字" placement="right">-->
<!--            <img class="tip" src="@/static/image/tip.png" alt="">-->
<!--          </el-tooltip>-->
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1003047" @click="toTransitDispatch()">中转调度</el-button>
          <el-button type="primary" plain size="mini" v-entity="1003048" @click="toTransitManage('中转跟踪',1)">中转跟踪</el-button>
          <el-button type="primary" plain size="mini" v-entity="1003049" @click="toTransitManage('修改中转',2)">修改中转</el-button>
            <el-button type="primary" plain size="mini" v-entity="1003050" @click="openAddReceipts()" >上传单据</el-button>
            <el-button type="primary" plain size="mini" v-entity="1003051" @click="toTransitManage('费用异动',4)">费用异动</el-button>
          <el-button type="primary" plain size="mini" v-entity="1003052"  @click="toTransitManage('查看中转',3)">查看中转</el-button>
          <el-button type="primary" plain size="mini" v-entity="1003053"  @click="showCancelWaybills">取消中转</el-button>
          <el-button type="primary" plain size="mini" v-entity="1003067"  @click="download()" >导出EXCEL</el-button>
          <el-button type="primary" plain @click="verifyWaybill" size="mini" v-entity="1003077">入账审核</el-button>
        </div>
      </div>
      <tableCommon tableName="listTable" ref="table" :showNum="true" :showSetTable="true" :head="head" @dblclickItem="dblclickItem" :singleSelect="true"></tableCommon>
    </div>



    <!-- 取消中转-开始 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="false"
               width="450px" @close="dialogVisible=false">
      <span>确认需要取消中转单</span>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini"  @click="dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="cancelWaybills">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 取消中转-结束 -->

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
                         :disabled="true" filterable clearable>
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
                         filterable>
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
              <el-radio v-model="receipts.receiptsType" label="1">回单</el-radio>
              <el-radio v-model="receipts.receiptsType" label="2">过磅单</el-radio>
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
<!--            -->
<!--            <div class="input-text">-->
<!--              <myFileModel v-if="showReceipts" ref="receiptsImg" :disabledEdit="false"-->
<!--                           :disabledDel="false" @successCallback="setImgData"></myFileModel>-->
<!--            </div>-->
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="addReceipts()">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 上传回单-结束 -->


    <!-- 中转费用异动-开始 -->
    <el-dialog title="中转费用异动" :visible.sync="showFeeMoveDialog" width="920px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="common-info" style="border:none;padding:0;">
        <h3 class="common-title">
          <span class="title-name">费用异动变更&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">（注：费用异动填写的是费用变动值!）</span></span>
        </h3>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="15%">中转其他费</th>
              <th width="40%">备注</th>
<!--              <th width="10%">中转运费</th>-->
<!--              <th width="10%">提货费</th>-->
<!--              <th width="10%">送货费</th>-->
<!--              <th width="10%">中转其他费</th>-->
              <th width="15%" v-show="false">费用合计</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td><el-input v-model="feeInfo.transitOtherFee" type="text" placeholder="" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input></td>
              <td><el-input v-model="feeInfo.remark" type="text" placeholder="" @input="changeInput"></el-input></td>
<!--              <td><el-input v-model="feeInfo.transitFee" type="text" placeholder="" :disabled="true"></el-input></td>-->
<!--              <td><el-input v-model="feeInfo.transitPickupFee" type="text" placeholder="" :disabled="true"></el-input></td>-->
<!--              <td><el-input v-model="feeInfo.transitDeliveryFee" type="text" placeholder="" :disabled="true"></el-input></td>-->
<!--              <td><el-input v-model="feeInfo.transitOtherFee" type="text" placeholder="" :disabled="true"></el-input></td>-->
              <td v-show="false"><el-input v-model="feeInfo.totalTransitFee" type="text" placeholder="" :disabled="true"></el-input></td>
            </tr>
            </tbody>
          </table>
        </div>


        <h3 class="common-title mt_20">
          <span class="title-name">费用异动记录</span>
        </h3>
        <div class="innerTable">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="10%">中转运费</th>
              <th width="10%">提货费</th>
              <th width="10%">送货费</th>
              <th width="10%">中转其他费</th>
              <th width="10%">费用合计</th>
              <th width="10%">备注</th>
              <th width="10%">创建人</th>
              <th width="10%">创建日期</th>
              <th width="10%">审核状态</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in waybillStatementList" style="text-align: center">
              <td width="10%">{{ index + 1 }}</td>
              <td width="10%">{{ item.transitFee }}</td>
              <td width="10%">{{ item.pickupFee }}</td>
              <td width="10%">{{ item.deliveryFee }}</td>
              <td width="10%">{{ item.transitOtherFee }}</td>
              <td width="10%">{{ item.totalFee }}</td>
              <td width="10%">{{ item.remark }}</td>
              <td width="10%">{{ item.createUserName }}</td>
              <td width="10%">{{ item.createDate }}</td>
              <td width="10%">{{ item.verifyStateName }}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td>合计</td>
              <!-- 调度重量/kg -->
              <td>{{ feeMoveTotalInfo.transitFeeSum }}</td>
              <td>{{ feeMoveTotalInfo.pickupFeeSum }}</td>
              <td>{{ feeMoveTotalInfo.deliveryFeeSum }}</td>
              <td>{{ feeMoveTotalInfo.transitOtherFeeSum }}</td>
              <td>{{ feeMoveTotalInfo.totalFeeSum }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tfoot>
          </table>
        </div>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="showFeeMoveDialog=false">关闭</el-button>
          <el-button type="primary" size="mini" @click="saveFeeMoveInfo()">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 中转费用异动-结束 -->



    <!-- 中转跟踪-开始 -->
    <el-dialog title="中转跟踪" :visible.sync="showTrackDialog" width="920px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="common-info" style="border:none;padding:0;">

        <h3 class="common-title">
          <span class="title-name">跟踪录入</span>
        </h3>
        <div class="innerTable" >
          <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="label" width="10%">跟踪节点</td>
              <td class="label" width="20%">实际时间</td>
              <td class="label" width="30%">跟踪内容</td>
              <td class="label" width="40%">定位</td>
            </tr>
            <tr>
              <td width="10%">
                <el-select v-model="trackInfo.transitOpNode" clearable placeholder="请选择" @change="$forceUpdate()">
                  <el-option v-for="item in dicTransitOpNode" :key="item.codeValue" :label="item.codeName"
                             :value="item.codeValue"></el-option>
                </el-select>
              </td>
              <td width="20%">
                <el-date-picker v-model="trackInfo.actArrivalTime" type="datetime" placeholder="" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </td>
              <td width="30%"><el-input v-model="trackInfo.transitOpContent" type="text" placeholder=""></el-input></td>
              <td>
                  <el-input v-model="trackInfo.transitLocation" type="text" placeholder="" style="width:80%;"></el-input>
                  <img src="@/static/image/mapTrack.png" alt="" @click="showMap" style="width:18px;width: 18px;vertical-align: middle;margin: -3px 0 0 3px;cursor: pointer;">
                  <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton" @sureCallback="sureWorkAddress" @hideMapBack="hideMapBack" :modal="false"></map-dialog>
              </td>
            </tr>
          </table>
        </div>


        <h3 class="common-title mt_20">
          <span class="title-name">跟踪记录</span>
        </h3>
        <div class="innerTable">
          <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="label">序号</td>
              <td class="label">跟踪节点</td>
              <td class="label">实际时间</td>
              <td class="label">跟踪内容</td>
              <td class="label">定位</td>
              <td class="label">操作人</td>
              <td class="label">操作时间</td>
            </tr>
            <tr v-for="(item,index) in ordTransitDetailList" style="text-align: center">
              <td width="5%">{{ index + 1 }}</td>
              <td width="10%">{{item.TRANSIT_OP_NODE_NAME}}</td>
              <td width="15%">{{item.ACTUAL_TIME}}</td>
              <td width="20%">{{item.OP_CONTENT}}</td>
              <td width="25%">{{item.LOCATION}}</td>
              <td width="10%">{{item.OP_USER_NAME}}</td>
              <td width="15%">{{item.OP_DATE}}</td>
            </tr>
          </table>
        </div>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="changeShowTrackDialogShow(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="submitTrackInfo()">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 中转跟踪-结束 -->



  </div>
</template>

<script>
import list from './transitList.js'
export default list
</script>
<style lang="scss">
.mr_20{
  margin-right: 20px;
}
</style>
