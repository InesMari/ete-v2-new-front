<template>
  <div id="orderStock">
      <div  class="table_height orderInfo">
        <el-tooltip effect="dark" content="编辑调度单" placement="top-start" :hide-after='1000' v-if="!recycleWaybill">
            <img src="@/static/image/edit.png" class="edit_icon" alt="" @click="back">
        </el-tooltip>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="150">订单号</th>
                    <th width="200">下单客户</th>
                    <th width="200">业务类型</th>
                    <th width="150">客户单号</th>
                    <th width="100">库存仓库</th>
                    <th width="100">调度件数/件</th>
                    <th width="100">调度重量/kg</th>
                    <th width="100">调度体积/m³</th>
                    <th width="100">车长</th>
                    <th width="200" v-if="deliveryTenantShow">干线供应商</th>
                    <th width="200" v-if="transitWorkShow">中转网点</th>
                    <th width="120" v-if="transitWorkShow">交接方式</th>
                    <th width="100" v-if="transitWorkShow">卸货地</th>
                    <th width="200" v-if="transitWorkShow">卸货地地址
                      <div class="switchDiv" title="是否送到相同目的地" v-if="sameDestShow">
                        <el-switch v-model="sameDest" active-color="#13ce66"> </el-switch>
                      </div>
                    </th>
                    <th width="120" v-if="deliveryModeShow">交接方式</th>
                    <th width="100" v-if="arriveWorkShow">卸货地</th>
                    <th width="200" v-if="arriveWorkShow">卸货地地址
                      <div class="switchDiv" title="是否送到相同目的地" v-if="sameDestShow">
                        <el-switch v-model="sameDest" active-color="#13ce66" :disabled="recycleWaybill"> </el-switch>
                      </div>
                    </th>
                    <th width="100" v-if="destWorkShow">卸货地</th>
                    <th width="200" v-if="destWorkShow">卸货地地址</th>
                    <th width="100" v-if="totalPointFeeShow">点位费</th>
                    <th width="100" v-if="freightShow">运费</th>
<!--                    <th width="100" v-if="premiumFeeShow">保险费</th>-->
<!--                    <th width="100" v-if="pickupFeeShow">提货费</th>-->
<!--                    <th width="100" v-if="deliveryFeeShow">送货费</th>-->
<!--                    <th width="100" v-if="loadingFeeShow">装货费</th>-->
<!--                    <th width="100" v-if="dischargeFeeShow">卸货费</th>-->
<!--                    <th width="100" v-if="otherFeeShow">其他费</th>-->
                    <th width="100" v-if="totalFeeShow">{{totalFeeDisplayName}}</th>
<!--                    <th width="100" v-if="transitFeeShow">中转运费</th>-->
<!--                    <th width="100" v-if="transitPickupFeeShow">提货费</th>-->
<!--                    <th width="100" v-if="transitDeliveryFeeShow">送货费</th>-->
<!--                    <th width="100" v-if="transitOtherFeeShow">中转其他费</th>-->
<!--                    <th width="100" v-if="totalTransitFeeShow">干线合计</th>-->
                    <th width="100">总费用合计</th>
                    <th width="100">订单备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in stockInfo.selectItem">
                    <!-- 订单号 -->
                    <td>
                        <a href="javascript:;" class="link" @click="toOrderDetail(item.orderId)">{{item.orderNum}}</a>
                    </td>
                    <!-- 下单客户 -->
                    <td>{{item.orderCustName}}</td>
					<!-- 业务类型 -->
					<td>{{item.bizTypeName}}</td>
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
                    <!-- 车长 -->
                    <td>{{item.vehicleLengthName}}</td>
                    <!-- 供应商 -->
                    <td  v-if="deliveryTenantShow">
                        <el-select v-model="item.deliveryTenantId" placeholder="请选择供应商" filterable @change="changeSupplier(index)">
                          <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.supplierName"
                                     :value="supplier.tenantId"></el-option>
                        </el-select>
                    </td>
                    <!-- 中转网点 -->
                    <td  v-if="transitWorkShow">
                      <el-select v-model="item.arriveWorkId" placeholder="请选择中转网点" filterable @change="passWorkInfo">
                        <el-option v-for="arrive in supplierWorkData[index]" :key="arrive.workId" :label="arrive.workName"
                                 :value="arrive.workId"></el-option>
                      </el-select>
                    </td>
                    <!-- 交接方式 -->
                    <td :rowspan="stockInfo.selectItem.length" v-if="transitWorkShow&&index==0&&sameDest">
                      <el-select v-model="item.transitDeliveryMode" placeholder="交接方式" @change="sameSelectChange('transitDeliveryMode')">
                        <el-option v-for="j in deliveryModeOptions" :key="j.codeValue" :label="j.codeName" :value="j.codeValue"></el-option>
                      </el-select>
                    </td>
                    <td v-if="transitWorkShow&&!sameDest">
                      <el-select v-model="item.transitDeliveryMode" placeholder="交接方式" @change="changeDeliveryMode(item)">
                        <el-option v-for="j in deliveryModeOptions" :key="j.codeValue" :label="j.codeName" :value="j.codeValue"></el-option>
                      </el-select>
                    </td>
                    <!-- 卸货地 -->
                    <td style="padding-left:24px;" :title="item.transitArriveWorkName" v-if="transitWorkShow&&index==0&&sameDest" :rowspan="stockInfo.selectItem.length"  @click="showArriveWorkDialog(item,index)">
                      <el-tooltip effect="dark" content="选择卸货地" placement="top-start" :hide-after='1000' v-if="item.transitDeliveryMode!='1'">
                        <img src="@/static/image/edit.png" class="list_icon" :style="'top:'+((stockInfo.selectItem.length-1)*17.5+7)+'px'" alt="">
                      </el-tooltip>
                      {{item.transitArriveWorkName}}
                    </td>
                    <td style="padding-left:24px;" :title="item.transitArriveWorkName" v-if="transitWorkShow&&!sameDest" @click="showArriveWorkDialog(item,index)">
                      <el-tooltip effect="dark" content="选择卸货地" placement="top-start" :hide-after='1000' v-if="item.transitDeliveryMode!='1'">
                        <img src="@/static/image/edit.png" class="list_icon" alt="">
                      </el-tooltip>
                      {{item.transitArriveWorkName}}
                    </td>
                    <!-- 卸货地详细地址 -->
                    <td :rowspan="stockInfo.selectItem.length" v-if="transitWorkShow&&index==0&&sameDest">
                      {{item.transitArriveWorkAddress}}
                    </td>
                    <td v-if="transitWorkShow&&!sameDest">
                      {{item.transitArriveWorkAddress}}
                    </td>
                    <!-- 交接方式 -->
                    <td :rowspan="stockInfo.selectItem.length" v-if="deliveryModeShow&&index==0&&sameDest">
                      <el-select v-model="item.deliveryMode" placeholder="交接方式" :disabled="recycleWaybill" @change="sameSelectChange('deliveryMode')">
                        <el-option v-for="j in deliveryModeOptions" :key="j.codeValue" :label="j.codeName" :value="j.codeValue"></el-option>
                      </el-select>
                    </td>
                    <td v-if="deliveryModeShow&&!sameDest">
                      <el-select v-model="item.deliveryMode" :disabled="recycleWaybill" placeholder="交接方式" @change="changeDeliveryMode(item)">
                        <el-option v-for="j in deliveryModeOptions" :key="j.codeValue" :label="j.codeName" :value="j.codeValue"></el-option>
                      </el-select>
                    </td>
                    <!-- 卸货地 -->
                    <td style="padding-left:24px;" :title="item.arriveWorkName" v-if="arriveWorkShow&&index==0&&sameDest" :rowspan="stockInfo.selectItem.length"  @click="showArriveWorkDialog(item,index)">
                      <el-tooltip effect="dark" content="选择卸货地" placement="top-start" :hide-after='1000' v-if="item.deliveryMode!='1'">
                        <img src="@/static/image/edit.png" class="list_icon" :style="'top:'+((stockInfo.selectItem.length-1)*17.5+7)+'px'" alt="">
                      </el-tooltip>
                      {{item.arriveWorkName}}
                    </td>
                    <td style="padding-left:24px;" :title="item.arriveWorkName" v-if="arriveWorkShow&&!sameDest" @click="showArriveWorkDialog(item,index)">
                      <el-tooltip effect="dark" content="选择卸货地" placement="top-start" :hide-after='1000' v-if="item.deliveryMode!='1'">
                        <img src="@/static/image/edit.png" class="list_icon" alt="">
                      </el-tooltip>
                      {{item.arriveWorkName}}
                    </td>
                    <!-- 卸货地详细地址 -->
                    <td :rowspan="stockInfo.selectItem.length" v-if="arriveWorkShow&&index==0&&sameDest">
                      {{item.arriveWorkAddress}}
                    </td>
                    <td v-if="arriveWorkShow&&!sameDest">
                      {{item.arriveWorkAddress}}
                    </td>
                    <!-- 卸货地 -->
                    <td v-if="destWorkShow">{{item.destWorkName}}</td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="destWorkShow">{{item.destWorkAddress}}</td>
                    <td v-if="totalPointFeeShow">
                      <el-input v-model="item.totalPointFee" type="text" placeholder="点位费" @input="calculateTotalFee" v-mydouble4val></el-input>
                    </td>
                    <td v-if="freightShow">
                      <el-input v-if="freightShow" v-model="item.freight" type="text" placeholder="运费"  @input="calculateTotalFee" v-mydouble4val></el-input>
                    </td>
<!--                    <td v-if="premiumFeeShow">-->
<!--                      <el-input v-model="item.premiumFee" type="text" placeholder="保险费"  @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="pickupFeeShow">-->
<!--                        <el-input v-model="item.pickupFee" type="text" placeholder="提货费"  @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="deliveryFeeShow">-->
<!--                        <el-input v-model="item.deliveryFee" type="text" placeholder="送货费" @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="loadingFeeShow">-->
<!--                        <el-input v-model="item.loadingFee" type="text" placeholder="装货费" @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="dischargeFeeShow">-->
<!--                        <el-input v-model="item.dischargeFee" type="text" placeholder="卸货费" @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="otherFeeShow">-->
<!--                        <el-input v-model="item.otherFee" type="text" placeholder="其他费" @input="calculateTotalFee" v-mydouble4val></el-input>-->
<!--                    </td>-->
                    <!-- 合计 -->
                    <td v-if="totalFeeShow">{{item.totalFee}}</td>
<!--                    <td v-if="transitFeeShow">-->
<!--                      <el-input v-model="item.transitFee" type="text" placeholder="中转运费" @input="calculateTotalTransitFee()" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="transitPickupFeeShow">-->
<!--                      <el-input v-model="item.transitPickupFee" type="text" placeholder="提货费" @input="calculateTotalTransitFee()" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="transitDeliveryFeeShow">-->
<!--                      <el-input v-model="item.transitDeliveryFee" type="text" placeholder="送货费" @input="calculateTotalTransitFee()" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    <td v-if="transitOtherFeeShow">-->
<!--                      <el-input v-model="item.transitOtherFee" type="text" placeholder="中转其他费" @input="calculateTotalTransitFee()" v-mydouble4val></el-input>-->
<!--                    </td>-->
<!--                    &lt;!&ndash; 合计 &ndash;&gt;-->
<!--                    <td v-if="totalTransitFeeShow">{{item.totalTransitFee}}</td>-->
                    <!-- 订单备注 -->
                    <td>{{item.amount}}</td>
                    <td>{{item.remark}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>合计：{{stockInfo.selectItem.length}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <!-- 调度件数/件 -->
                    <td>{{totalInfo.goodsCount}}</td>
                    <!-- 调度重量/kg -->
                    <td>{{totalInfo.goodsWeight}}</td>
                    <!-- 调度体积/m³ -->
                    <td>{{totalInfo.goodsVolume}}</td>
                    <td></td>
                    <!-- 供应商 -->
                    <td v-if="deliveryTenantShow"></td>
                    <!-- 中转网点 -->
                    <td  v-if="transitWorkShow"></td>
                    <!-- 交接方式 -->
                    <td v-if="transitWorkShow"></td>
                    <!-- 卸货地 -->
                    <td v-if="transitWorkShow"></td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="transitWorkShow"></td>
                    <!-- 交接方式 -->
                    <td v-if="deliveryModeShow"></td>
                    <!-- 卸货地 -->
                    <td v-if="arriveWorkShow"></td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="arriveWorkShow"></td>
                    <!-- 卸货地 -->
                    <td v-if="destWorkShow"></td>
                    <!-- 卸货地详细地址 -->
                    <td v-if="destWorkShow"></td>
                    <!-- 点位费 -->
                    <td v-if="totalPointFeeShow">{{totalInfo.totalPointFee}}</td>
                    <!-- 运费 -->
                    <td v-if="freightShow">{{totalInfo.freight}}</td>
<!--                    &lt;!&ndash; 保险费 &ndash;&gt;-->
<!--                    <td v-if="premiumFeeShow">{{totalInfo.premiumFee}}</td>-->
<!--                    &lt;!&ndash; 提货费 &ndash;&gt;-->
<!--                    <td v-if="pickupFeeShow">{{totalInfo.pickupFee}}</td>-->
<!--                    &lt;!&ndash; 送货费 &ndash;&gt;-->
<!--                    <td v-if="deliveryFeeShow">{{totalInfo.deliveryFee}}</td>-->
<!--                    &lt;!&ndash; 装货费 &ndash;&gt;-->
<!--                    <td v-if="loadingFeeShow">{{totalInfo.loadingFee}}</td>-->
<!--                    &lt;!&ndash; 卸货费 &ndash;&gt;-->
<!--                    <td v-if="dischargeFeeShow">{{totalInfo.dischargeFee}}</td>-->
<!--                    &lt;!&ndash; 其他费 &ndash;&gt;-->
<!--                    <td v-if="otherFeeShow">{{totalInfo.otherFee}}</td>-->
                    <!-- 合计 -->
                    <td v-if="totalFeeShow">{{totalInfo.totalFee}}</td>
<!--                    &lt;!&ndash; 中转运费 &ndash;&gt;-->
<!--                    <td v-if="transitFeeShow">{{totalInfo.transitFee}}</td>-->
<!--                    &lt;!&ndash; 中转提货费 &ndash;&gt;-->
<!--                    <td v-if="transitPickupFeeShow">{{totalInfo.transitPickupFee}}</td>-->
<!--                    &lt;!&ndash; 中转送货费 &ndash;&gt;-->
<!--                    <td v-if="transitDeliveryFeeShow">{{totalInfo.transitDeliveryFee}}</td>-->
<!--                    &lt;!&ndash; 中转其他费 &ndash;&gt;-->
<!--                    <td v-if="transitOtherFeeShow">{{totalInfo.transitOtherFee}}</td>-->
<!--                    &lt;!&ndash; 合计 &ndash;&gt;-->
<!--                    <td v-if="totalTransitFeeShow">{{totalInfo.totalTransitFee}}</td>-->
                    <td>{{totalInfo.amount}}</td>
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
              <th>库存件数/件</th>
              <th>调度件数/件</th>
              <th>库存重量/kg</th>
              <th>调度重量/kg</th>
              <th>库存体积/m³</th>
              <th>调度体积/m³</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in dispatchGoodsInfo.orderStockDetailList">
              <td>{{index+1}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.goodsCount}}</td>
              <td><el-input v-model="item.dispatchGoodsCount" type="text" placeholder="调度件数/件" :ref='"dispatchGoodsCount"+index' @input="inputGoodsDetail(1,index)" @blur="inputGoodsDetail(1,index)" v-mydouble4val></el-input></td>
              <td>{{item.goodsWeight}}</td>
              <td><el-input v-model="item.dispatchGoodsWeight" type="text" placeholder="调度重量/kg" :ref='"dispatchGoodsWeight"+index'  @input="inputGoodsDetail(2,index)" @blur="inputGoodsDetail(1,index)" v-mydouble4val></el-input></td>
              <td>{{item.goodsVolume}}</td>
              <td><el-input v-model="item.dispatchGoodsVolume" type="text" placeholder="调度体积/m³" :ref='"dispatchGoodsVolume"+index'  @input="inputGoodsDetail(3,index)" @blur="inputGoodsDetail(1,index)" v-mydouble4val></el-input></td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td>合计：</td>
              <td></td>
              <td>{{ dispatchGoodsInfo.goodsCount }}</td>
              <td>{{ dispatchGoodsInfo.dispatchGoodsCount }}</td>
              <td>{{ dispatchGoodsInfo.goodsWeight }}</td>
              <td>{{ dispatchGoodsInfo.dispatchGoodsWeight }}</td>
              <td>{{ dispatchGoodsInfo.goodsVolume }}</td>
              <td>{{ dispatchGoodsInfo.dispatchGoodsVolume }}</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <el-button size="mini" @click="showGoodsDetialDialog=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="dispachGoodsDetail">修改保存</el-button>
      </div>
    </el-dialog>


    <el-dialog title="选择卸货地"  :visible.sync="arriveWorkDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
               width="780px" @close="arriveWorkDialogShow=false">
        <div class="search-list clearfix">
          <div class="search-form clearfix" @keyup.enter="doQuery()">
            <div class="item" style="width: 250px">
              <label class="label">企业名称：</label>
              <div class="input-text">
                <el-input v-model="query.tenantName" placeholder="企业名称模糊查询" type="text"></el-input>
              </div>
            </div>
            <div class="item" style="width: 250px">
              <label class="label">卸货地址：</label>
              <div class="input-text">
                <el-input v-model="query.keyword" placeholder="作业点名称或者详细地址模糊查询" type="text"></el-input>
              </div>
            </div>
          </div>
          <div class="search-btn clearfix">
            <div class="btn">
              <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
            </div>
            <div class="btn">
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
            </div>
          </div>
        </div>
        <div class="table-content">
          <tableCommon class="arriveWorkTable" tableName="table" ref="table" :showNum="true" :showSetTable="false" :head="head" :singleSelect="true"></tableCommon>
        </div>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="arriveWorkDialogShow=false">关闭</el-button>
          <el-button type="primary" size="mini" @click="selArriveWork">确认</el-button>
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
