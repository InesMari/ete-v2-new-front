<template>
  <div id="orderStock">
      <div  class="table_height orderInfo">
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="150">订单号</th>
                    <th width="200">下单客户</th>
                    <th width="150">客户单号</th>
                    <th width="100">库存仓库</th>
                    <th width="100">调度件数/件</th>
                    <th width="100">调度重量/kg</th>
                    <th width="100">调度体积/m³</th>
                    <th width="200" v-if="deliveryTenantShow">干线供应商</th>
                    <th width="200" v-if="transitWorkShow">中转网点</th>
                    <th width="100" v-if="transitWorkShow">交接方式</th>
                    <!-- 中转卸货地 -->
                    <th width="100" v-if="transitWorkShow">卸货地</th>
                    <!-- 中转卸货地详细地址 -->
                    <th width="200" v-if="transitWorkShow">卸货地地址</th>
                    <th width="120" v-if="deliveryModeShow">交接方式</th>
                    <th width="100" v-if="arriveWorkShow">卸货地</th>
                    <th width="200" v-if="arriveWorkShow">卸货地地址</th>
                    <th width="100" v-if="totalPointFeeShow">点位费</th>
                    <th width="100" v-if="freightShow">运费</th>
                    <th width="100" v-if="premiumFeeShow">保险费</th>
<!--                    <th width="100" v-if="pickupFeeShow">提货费</th>-->
<!--                    <th width="100" v-if="deliveryFeeShow">送货费</th>-->
                    <th width="100" v-if="loadingFeeShow">装货费</th>
                    <th width="100" v-if="dischargeFeeShow">卸货费</th>
                    <th width="100" v-if="emptyDrivingFeeShow">放空费</th>
                    <th width="100" v-if="standbyFeeShow">压夜费</th>
                    <th width="100" v-if="otherFeeShow">其他费</th>
                    <th width="100" v-if="totalFeeShow">{{totalFeeDisplayName}}</th>
                    <th width="100" v-if="transitFeeShow">中转运费</th>
                    <th width="100" v-if="transitPickupFeeShow">提货费</th>
                    <th width="100" v-if="transitDeliveryFeeShow">送货费</th>
                    <th width="100" v-if="transitOtherFeeShow">中转其他费</th>
                    <th width="100" v-if="totalTransitFeeShow">干线合计</th>
                    <th width="100">订单备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in orderStockList">
                    <!-- 订单号 -->
                    <td>
                        <a href="javascript:;" class="link" @click="toOrderDetail(item.orderId)">{{item.orderNum}}</a>
                    </td>
                    <!-- 下单客户 -->
                    <td>{{item.orderCustName}}</td>
                    <!-- 客户单号 -->
                    <td>{{item.custOrderNum}}</td>
                    <!-- 库存仓库 -->
                    <td>{{item.workName}}</td>
                    <!-- 调度件数/件 -->
                    <td @click="showGoodsDetail(item,index)">
                        <el-tooltip effect="dark" content="查看编辑货物明细" placement="top-start" :hide-after='1000'>
                            <img src="@/static/image/list.png" class="list_icon" alt="">
                        </el-tooltip>
                      {{item.goodsCount}}
                    </td>
                    <!-- 调度重量/kg -->
                    <td>{{item.goodsWeight}}</td>
                    <!-- 调度体积/m³ -->
                    <td>{{item.goodsVolume}}</td>
                    <!-- 供应商 -->
                    <td  v-if="deliveryTenantShow">
                      {{item.deliveryTenantName}}
                    </td>
                    <!-- 中转网点 -->
                    <td  v-if="transitWorkShow">
                      {{item.arriveWorkName}}
                    </td>
                    <td v-if="transitWorkShow">
                      {{item.transitDeliveryModeName}}
                    </td>
                    <!-- 中转卸货地 -->
                    <td  v-if="transitWorkShow">
                      {{item.transitArriveWorkName}}
                    </td>
                    <!-- 中转卸货地详细地址 -->
                    <td  v-if="transitWorkShow">
                      {{item.transitArriveWorkAddress}}
                    </td>
                    <td v-if="deliveryModeShow">
                      {{item.deliveryModeName}}
                    </td>
                    <!-- 卸货地 -->
                    <td v-if="arriveWorkShow">
                      {{item.arriveWorkName}}
                    </td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="arriveWorkShow">
                      {{item.arriveWorkAddress}}
                    </td>
                    <td v-if="totalPointFeeShow">
                      {{item.totalPointFee}}
                    </td>
                    <td v-if="freightShow">
                      {{item.freight}}
                    </td>
                    <td v-if="premiumFeeShow">
                      {{item.premiumFee}}
                    </td>
<!--                    <td v-if="pickupFeeShow">-->
<!--                      {{item.pickupFee}}-->
<!--                    </td>-->
<!--                    <td v-if="deliveryFeeShow">-->
<!--                      {{item.deliveryFee}}-->
<!--                    </td>-->
                    <td v-if="loadingFeeShow">
                      {{item.loadingFee}}
                    </td>
                    <td v-if="dischargeFeeShow">
                      {{item.dischargeFee}}
                    </td>
                    <td v-if="emptyDrivingFeeShow">
                      {{item.emptyDrivingFee}}
                    </td>
                    <td v-if="standbyFeeShow">
                      {{item.standbyFee}}
                    </td>
                    <td v-if="otherFeeShow">
                      {{item.otherFee}}
                    </td>
                    <!-- 合计 -->
                    <td v-if="totalFeeShow">{{item.totalFee}}</td>
                    <td v-if="transitFeeShow">
                      {{item.transitFee}}
                    </td>
                    <td v-if="transitPickupFeeShow">
                      {{item.transitPickupFee}}
                    </td>
                    <td v-if="transitDeliveryFeeShow">
                      {{item.transitDeliveryFee}}
                    </td>
                    <td v-if="transitOtherFeeShow">
                      {{item.transitOtherFee}}
                    </td>
                    <!-- 合计 -->
                    <td v-if="totalTransitFeeShow">{{item.totalTransitFee}}</td>
                    <!-- 订单备注 -->
                    <td>{{item.remark}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>合计：{{orderStockList!=null&&orderStockList.length>0?orderStockList.length:0}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <!-- 调度件数/件 -->
                    <td>{{totalInfo.goodsCount}}</td>
                    <!-- 调度重量/kg -->
                    <td>{{totalInfo.goodsWeight}}</td>
                    <!-- 调度体积/m³ -->
                    <td>{{totalInfo.goodsVolume}}</td>
                    <!-- 供应商 -->
                    <td v-if="deliveryTenantShow"></td>
                    <!-- 中转网点 -->
                    <td  v-if="transitWorkShow"></td>
                    <!-- 交接方式 -->
                    <td v-if="transitWorkShow"></td>
                    <!-- 中转卸货地 -->
                    <td  v-if="transitWorkShow"></td>
                    <!-- 中转卸货地详细地址 -->
                    <td  v-if="transitWorkShow"></td>
                    <!-- 交接方式 -->
                    <td v-if="deliveryModeShow"></td>
                    <!-- 卸货地 -->
                    <td v-if="arriveWorkShow"></td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="arriveWorkShow"></td>
                    <!-- 点位费 -->
                    <td v-if="totalPointFeeShow">{{totalInfo.totalPointFee}}</td>
                    <!-- 运费 -->
                    <td v-if="freightShow">{{totalInfo.freight}}</td>
                    <!-- 提货费 -->
                    <td v-if="premiumFeeShow">{{totalInfo.premiumFee}}</td>
<!--                    &lt;!&ndash; 提货费 &ndash;&gt;-->
<!--                    <td v-if="pickupFeeShow">{{totalInfo.pickupFee}}</td>-->
<!--                    &lt;!&ndash; 送货费 &ndash;&gt;-->
<!--                    <td v-if="deliveryFeeShow">{{totalInfo.deliveryFee}}</td>-->
                    <!-- 装货费 -->
                    <td v-if="loadingFeeShow">{{totalInfo.loadingFee}}</td>
                    <!-- 卸货费 -->
                    <td v-if="dischargeFeeShow">{{totalInfo.dischargeFee}}</td>
                    <!-- 放空费 -->
                    <td v-if="emptyDrivingFeeShow">{{totalInfo.emptyDrivingFee}}</td>
                    <!-- 压夜费 -->
                    <td v-if="standbyFeeShow">{{totalInfo.standbyFee}}</td>
                    <!-- 其他费 -->
                    <td v-if="otherFeeShow">{{totalInfo.otherFee}}</td>
                    <!-- 合计 -->
                    <td v-if="totalFeeShow">{{totalInfo.totalFee}}</td>
                    <!-- 中转运费 -->
                    <td v-if="transitFeeShow">{{totalInfo.transitFee}}</td>
                    <!-- 中转提货费 -->
                    <td v-if="transitPickupFeeShow">{{totalInfo.transitPickupFee}}</td>
                    <!-- 中转送货费 -->
                    <td v-if="transitDeliveryFeeShow">{{totalInfo.transitDeliveryFee}}</td>
                    <!-- 中转其他费 -->
                    <td v-if="transitOtherFeeShow">{{totalInfo.transitOtherFee}}</td>
                    <!-- 合计 -->
                    <td v-if="totalTransitFeeShow">{{totalInfo.totalTransitFee}}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
      </div>
    <!-- 货物明细 -->
    <el-dialog title="货物明细" :visible.sync="showGoodsDetialDialog"  :close-on-click-modal="false" :close-on-press-escape="false"  width="700px"  @close="showGoodsDetialDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">订单号</label>
            <div class="input-text">
              <el-input v-model="dispatchGoodsInfo.orderNum" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">客户</label>
            <div class="input-text">
              <el-input v-model="dispatchGoodsInfo.orderCustName" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库存仓库</label>
            <div class="input-text">
              <el-input v-model="dispatchGoodsInfo.workName" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">卸货地</label>
            <div class="input-text">
              <el-input v-model="dispatchGoodsInfo.destWorkAddress" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
        </ul>
        <div>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th>序号</th>
              <th>货物名称</th>
              <th>调度件数/件</th>
              <th>调度重量/kg</th>
              <th>调度体积/m³</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in dispatchGoodsInfo.orderStockDetailList">
              <td>{{index+1}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.goodsCount}}</td>
              <td>{{item.goodsWeight}}</td>
              <td>{{item.goodsVolume}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td>合计：</td>
              <td></td>
              <td>{{ dispatchGoodsInfo.goodsCount }}</td>
              <td>{{ dispatchGoodsInfo.goodsWeight }}</td>
              <td>{{ dispatchGoodsInfo.goodsVolume }}</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <el-button size="mini" @click="showGoodsDetialDialog=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderStock from './orderStock.js'
export default orderStock
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
.switchDiv{
  padding:4px 0px;
  border-radius: 3px;
  color: $main-color;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  .name{
    vertical-align: middle;
    margin-left:8px;
  }
  // &:hover{
  //   color: #fff;
  //   background: $main-color;
  // }
}
.arriveWorkTable .tableCommon{
  border:none!important;
}
</style>
