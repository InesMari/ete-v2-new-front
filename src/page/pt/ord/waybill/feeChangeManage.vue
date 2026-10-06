<template>
    <div id="feeChangeManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="feeChangeManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>成本费用异动申请列表</span>
                    <el-tooltip effect="light" content="成本费用异动申请列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1003063" @click="toFeeChange(1)">修改异动</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003064" @click="delOrdWaybillFeeCostApply">撤销申请</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003065" @click="verifyOrdWaybillFeeCostApply(1)">审核通过</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003066" @click="verifyOrdWaybillFeeCostApply(2)">审核不通过</el-button>
              </div>
            </div>
            <tableCommon tableName="feeChangeManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" singleSelect="true" @dblclickItem="toViewFeeChangeDbClick">
              <template v-slot:default="{item}">
                <a href="javascript:void(0);" class="link" @click.stop="toWaybillDetail(item)" style="margin: 0 10px;">{{item.waybillNum}}</a>
              </template>
            </tableCommon>
        </div>

      <!--  费用异动  结束-->
      <el-dialog title="费用异动" :visible.sync="feeChangeShow" :close-on-click-modal="false" :close-on-press-escape="false" width="88%">
        <div class="common-info" style="border:none;padding:0;margin-top: -30px;">
          <div id="feeInfo1" v-if="waybillInfo.isTransit==0">
            <h3 class="common-title mt_20">
              <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用异动填写的是费用变动值!</span></span>
            </h3>
            <div class="tickManager">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                  <th width="70">计费方式</th>
<!--                  <th width="70">净重(KG)</th>-->
<!--                  <th width="70">毛重(KG)</th>-->
<!--                  <th width="70">体积(m³)</th>-->
<!--                  <th width="70">计费单价</th>-->
<!--                  <th width="70">中途点数</th>-->
<!--                  <th width="70">点位费</th>-->
<!--                  <th width="80">点位费合计</th>-->
<!--                  <th width="80">运费</th>-->
                  <th width="80">保险费</th>
                  <th width="80">装货费</th>
                  <th width="80">卸货费</th>
                  <th width="80">放空费</th>
                  <th width="80">压夜费</th>
                  <th width="80">其他费</th>
                  <th width="80">费用合计</th>
                  <th width="150">备注</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{waybillInfo.billingTypeName}}</td>
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.netWeight" type="text" placeholder="净重(KG)" @input="changeFee('netWeight')" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.grossWeight" type="text" placeholder="毛重(KG)" @input="changeFee('grossWeight')" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.volume" type="text" placeholder="体积(m³)" @input="changeFee('volume')" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.freightPrice" type="text" placeholder="计费单价" @input="changeFee('freightPrice')" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>{{waybillInfo.midwayPointNum}}-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.pointFee" type="text" placeholder="点位费" @input="changeFee('pointFee')" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>{{feeInfo.totalPointFee}}</td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.freight" type="text" placeholder="运费" :disabled="waybillInfo.billingType!=1||type==2" @input="changeFee('freight')" v-mypmdouble4val></el-input>-->
<!--                  </td>-->
                  <td>
                    <el-input v-model="feeInfo.premiumFee" type="text" placeholder="保险费" @input="changeFee('premiumFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="feeInfo.loadingFee" type="text" placeholder="装货费" @input="changeFee('loadingFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="feeInfo.dischargeFee" type="text" placeholder="卸货费" @input="changeFee('dischargeFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="feeInfo.emptyDrivingFee" type="text" placeholder="放空费" @input="changeFee('emptyDrivingFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="feeInfo.standbyFee" type="text" placeholder="压夜费" @input="changeFee('standbyFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="feeInfo.otherFee" type="text" placeholder="其他费" @input="changeFee('otherFee')" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>{{feeInfo.totalFee}}</td>
                  <td>
                    <el-input v-model="feeInfo.remark" type="text" placeholder="备注"  :disabled="type==2" ></el-input>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <h3 class="common-title mt_20">
              <span class="title-name">费用异动分摊</span>
            </h3>
            <div class="tickManager">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                  <th width="150">订单号</th>
                  <th width="100">调度件数/件</th>
                  <th width="100">调度重量/kg</th>
                  <th width="100">调度体积/m³</th>
<!--                  <th width="100">点位费</th>-->
<!--                  <th width="100">运费</th>-->
                  <th width="100">保险费</th>
<!--                  <th width="100">提货费</th>-->
<!--                  <th width="100">送货费</th>-->
                  <th width="100">装货费</th>
                  <th width="100">卸货费</th>
                  <th width="100">放空费</th>
                  <th width="100">压夜费</th>
                  <th width="100">其他费</th>
                  <th width="100">费用合计</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item) in orderStockStatementList">
                  <!-- 订单号 -->
                  <td>
                    <a href="javascript:;" class="link" @click="toOrderDetail(item.orderId)">{{item.orderNum}}</a>
                  </td>
                  <!-- 调度件数/件 -->
                  <td>{{item.goodsCount}}</td>
                  <!-- 调度重量/kg -->
                  <td>{{item.goodsWeight}}</td>
                  <!-- 调度体积/m³ -->
                  <td>{{item.goodsVolume}}</td>
<!--                  <td>-->
<!--                    <el-input v-model="item.totalPointFee" type="text" placeholder="点位费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="item.freight" type="text" placeholder="运费"  @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
                  <td>
                    <el-input v-model="item.premiumFee" type="text" placeholder="保险费"  @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
<!--                  <td>-->
<!--                    <el-input v-model="item.pickupFee" type="text" placeholder="提货费"  @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="item.deliveryFee" type="text" placeholder="送货费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
                  <td>
                    <el-input v-model="item.loadingFee" type="text" placeholder="装货费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="item.dischargeFee" type="text" placeholder="卸货费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="item.emptyDrivingFee" type="text" placeholder="放空费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="item.standbyFee" type="text" placeholder="压夜费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <td>
                    <el-input v-model="item.otherFee" type="text" placeholder="其他费" @input="calculateStatementTotalFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
                  <!-- 合计 -->
                  <td>{{item.totalFee}}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td>合计：</td>
                  <!-- 调度件数/件 -->
                  <td>{{totalInfo.goodsCount}}</td>
                  <!-- 调度重量/kg -->
                  <td>{{totalInfo.goodsWeight}}</td>
                  <!-- 调度体积/m³ -->
                  <td>{{totalInfo.goodsVolume}}</td>
<!--                  &lt;!&ndash; 点位费 &ndash;&gt;-->
<!--                  <td>{{totalInfo.totalPointFee}}</td>-->
<!--                  &lt;!&ndash; 运费 &ndash;&gt;-->
<!--                  <td>{{totalInfo.freight}}</td>-->
                  <!-- 保险费 -->
                  <td>{{totalInfo.premiumFee}}</td>
<!--                  &lt;!&ndash; 提货费 &ndash;&gt;-->
<!--                  <td>{{totalInfo.pickupFee}}</td>-->
<!--                  &lt;!&ndash; 送货费 &ndash;&gt;-->
<!--                  <td>{{totalInfo.deliveryFee}}</td>-->
                  <!-- 装货费 -->
                  <td>{{totalInfo.loadingFee}}</td>
                  <!-- 卸货费 -->
                  <td>{{totalInfo.dischargeFee}}</td>
                  <!-- 放空费 -->
                  <td>{{totalInfo.emptyDrivingFee}}</td>
                  <!-- 压夜费 -->
                  <td>{{totalInfo.standbyFee}}</td>
                  <!-- 其他费 -->
                  <td>{{totalInfo.otherFee}}</td>
                  <!-- 合计 -->
                  <td>{{totalInfo.totalFee}}</td>
                </tr>
                </tfoot>
              </table>
            </div>

            <h3 class="common-title mt_20">
              <span class="title-name">派车单费用异动记录</span>
            </h3>
            <div class="tickManager" style="overflow: auto;">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                  <th width="50">序号</th>
<!--                  <th width="60">净重(KG)</th>-->
<!--                  <th width="60">毛重(KG)</th>-->
<!--                  <th width="60">体积(m³)</th>-->
<!--                  <th width="60">计费单价</th>-->
<!--                  <th width="60">中途点数</th>-->
<!--                  <th width="60">点位费</th>-->
<!--                  <th width="80">点位费合计</th>-->
<!--                  <th width="80">运费</th>-->
                  <th width="80">保险费</th>
                  <th width="80">装货费</th>
                  <th width="80">卸货费</th>
                  <th width="80">放空费</th>
                  <th width="80">压夜费</th>
                  <th width="80">其他费</th>
                  <th width="80">费用合计</th>
                  <th width="150">备注</th>
                  <th width="60">创建人</th>
                  <th width="120">创建日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in statementList" :key="index">
                  <td>{{index+1}}</td>
<!--                  <td>{{item.netWeight}}</td>-->
<!--                  <td>{{item.grossWeight}}</td>-->
<!--                  <td>{{item.volume}}</td>-->
<!--                  <td>{{item.freightPrice}}</td>-->
<!--                  <td>{{item.midwayPointNum}}</td>-->
<!--                  <td>{{item.pointFee}}</td>-->
<!--                  <td>{{item.totalPointFee}}</td>-->
<!--                  <td>{{item.freight}}</td>-->
                  <td>{{item.premiumFee}}</td>
                  <td>{{item.loadingFee}}</td>
                  <td>{{item.dischargeFee}}</td>
                  <td>{{item.emptyDrivingFee}}</td>
                  <td>{{item.standbyFee}}</td>
                  <td>{{item.otherFee}}</td>
                  <td>{{item.totalFee}}</td>
                  <td>{{item.remark}}</td>
                  <td>{{item.createUserName}}</td>
                  <td>{{item.createDate}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="feeInfo2" v-if="waybillInfo.isTransit==1">
            <h3 class="common-title mt_20">
              <span class="title-name">费用补录&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用补录填写的是费用变动值!</span></span>
            </h3>
            <div class="tickManager">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
<!--                  <th width="80">中转运费</th>-->
                  <th width="80">中转其他费</th>
<!--                  <th width="80">提货费</th>-->
<!--                  <th width="80">送货费</th>-->
                  <th width="80">费用合计</th>
                  <th width="150">备注</th>
                </tr>
                </thead>
                <tbody>
                <tr>
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.transitFee" type="text" placeholder="中转运费" @input="calculateTotalTransitFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
                  <td>
                    <el-input v-model="feeInfo.transitOtherFee" type="text" placeholder="中转其他费" @input="calculateTotalTransitFee" v-mypmdouble4val :disabled="type==2" ></el-input>
                  </td>
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.transitPickupFee" type="text" placeholder="提货费" @input="calculateTotalTransitFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <el-input v-model="feeInfo.transitDeliveryFee" type="text" placeholder="送货费" @input="calculateTotalTransitFee" v-mypmdouble4val :disabled="type==2" ></el-input>-->
<!--                  </td>-->
                  <td>{{feeInfo.totalTransitFee}}</td>
                  <td>
                    <el-input v-model="feeInfo.remark" type="text" placeholder="备注"  :disabled="type==2" ></el-input>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <h3 class="common-title mt_20">
              <span class="title-name">中转单费用补录记录</span>
            </h3>
            <div class="tickManager" style="overflow: auto;">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                  <th width="50">序号</th>
<!--                  <th width="80">中转运费</th>-->
                  <th width="80">中转其他费</th>
<!--                  <th width="80">提货费</th>-->
<!--                  <th width="80">送货费</th>-->
                  <th width="80">费用合计</th>
                  <th width="150">备注</th>
                  <th width="60">创建人</th>
                  <th width="120">创建日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in statementList" :key="index">
                  <td>{{index+1}}</td>
<!--                  <td>{{item.transitFee}}</td>-->
                  <td>{{item.transitOtherFee}}</td>
<!--                  <td>{{item.pickupFee}}</td>-->
<!--                  <td>{{item.deliveryFee}}</td>-->
                  <td>{{item.totalFee}}</td>
                  <td>{{item.remark}}</td>
                  <td>{{item.createUserName}}</td>
                  <td>{{item.createDate}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>


          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeFeeChangeDialog">关闭</el-button>
            <el-button type="primary" size="mini" @click="sureChange()" v-if="type==1" >确认提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!--  费用异动  结束-->
    </div>
</template>

<script>
    import feeChangeManage from './feeChangeManage.js'
    export default feeChangeManage
</script>
<style lang="scss">
#feeChangeManage{
  .tableCommon{
    .el-input__inner{
      text-align: center;
    }
  }
}

</style>
