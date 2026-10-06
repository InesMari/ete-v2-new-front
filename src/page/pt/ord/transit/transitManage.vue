<template>
  <div id="transitManage" class="dispatchPage orderPage">
    <div class="table_height orderInfo">
      <!--        <el-tooltip effect="dark" content="修改订单" placement="top-start" :hide-after='1000'>-->
      <!--            <img src="@/static/image/edit.png" class="edit_icon" alt="">-->
      <!--        </el-tooltip>-->
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="150">订单号</th>
          <th width="100">下单客户</th>
          <th width="100">客户单号</th>
          <th width="100">库存仓库</th>
          <th width="100">调度件数/件</th>
          <th width="100">调度重量/kg</th>
          <th width="100">调度体积/m³</th>
          <th width="100">干线供应商</th>
          <th width="100">交接方式</th>
          <th width="100">卸货地</th>
          <th width="200">卸货地详细地址</th>
          <th width="100">订单备注</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!-- 订单号 -->
          <td>
            <a href="javascript:;" class="link" @click="toOrderDetail(transitOrderData.ORDER_ID)">{{ transitOrderData.ORDER_NUM }}</a>
          </td>
          <!-- 下单客户 -->
          <td>
            {{ transitOrderData.CUST_NAME }}
          </td>
          <!-- 客户单号 -->
          <td>
            {{ transitOrderData.CUST_ORDER_NUM }}
          </td>
          <!-- 库存仓库 -->
          <td>
            {{ transitOrderData.WORK_NAME }}
          </td>
          <!-- 调度件数/件 -->
          <td>
            <el-tooltip effect="dark" content="查看编辑货物明细" placement="top-start" :hide-after='1000'>
              <img src="@/static/image/list.png" class="list_icon" alt="" @click="showGoodsDetail()">
            </el-tooltip>
            {{ transitOrderData.GOODS_COUNT }}
          </td>
          <!-- 调度重量/kg -->
          <td>
            {{ transitOrderData.GOODS_WEIGHT }}
          </td>
          <!-- 调度体积/m³ -->
          <td>
            {{ transitOrderData.GOODS_VOLUME }}
          </td>
          <!-- 干线供应商 -->
          <td>
            <el-select v-model="transitOrderData.TRANSIT_SUPPLIER_ID" placeholder="请选择供应商" filterable
                        :disabled="disableEdit || showTransitLog" @change="changeSupplier">
              <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.supplierName"
                         :value="supplier.tenantId"></el-option>
            </el-select>
          </td>
          <!-- 交接方式 -->
          <td>
            <el-select v-model="transitOrderData.DELIVERY_MODE" placeholder="交接方式" :disabled="disableEdit || showTransitLog" @change="changeDeliveryMode">
              <el-option v-for="item in dicDeliveryMode" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <!-- 卸货地 -->
          <td v-if="transitOrderData.DELIVERY_MODE == 1">
            <el-input v-model="transitOrderData.UNLOAD_WORK_NODE_NAME" type="text" placeholder="卸货地" :disabled="true"></el-input>
          </td>
          <td v-else-if="transitOrderData.DELIVERY_MODE !== 1" style="padding-left:24px;"  @click="showArriveWorkDialog()">
            <el-tooltip effect="dark" content="选择卸货地" placement="top-start" :hide-after='1000' v-if="modifyOpDisable">
              <img src="@/static/image/edit.png" class="list_icon" :style="'top:'+((0)*17.5+7)+'px'" alt="">
            </el-tooltip>
            {{transitOrderData.UNLOAD_WORK_NODE_NAME}}
          </td>
          <!-- 卸货地详细地址 -->
          <td>
            <el-input v-model="transitOrderData.UNLOAD_WORK_ADDRESS_STR" type="text" placeholder="卸货详细地址"
                      :disabled="true"></el-input>
          </td>
          <!-- 订单备注 -->
          <td>{{ transitOrderData.ORDER_REMARK }}</td>
        </tr>
        </tbody>
        <!--            <tfoot>-->
        <!--                <tr>-->
        <!--                    <td>合计：</td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                    &lt;!&ndash; 调度件数/件 &ndash;&gt;-->
        <!--                    <td>3</td>-->
        <!--                    &lt;!&ndash; 调度重量/kg &ndash;&gt;-->
        <!--                    <td>3300</td>-->
        <!--                    &lt;!&ndash; 调度体积/m³ &ndash;&gt;-->
        <!--                    <td>6</td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                    <td></td>-->
        <!--                </tr>-->
        <!--            </tfoot>-->
      </table>
    </div>


    <!--      作业点信息    -->
    <div>
      <h3 class="common-title mt_20">
        <span class="title-name">运单信息</span>
      </h3>
      <div class="innerTable">
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label" width="16%">作业点</td>
            <td class="label" width="16%">作业内容</td>
            <td class="label" width="16%">要求运作时间</td>
            <td class="label" width="16%">预计到达时间</td>
            <td class="label" width="16%">实际到达时间</td>
            <td class="label" width="16%">联系人</td>
            <td class="label" width="16%">联系电话</td>
            <td class="label" width="16%">详细地址</td>
          </tr>
          <tr v-for="(item,index) in transitWaybillOrderWorkList">
            <td>{{item.workName}}</td>
            <td>{{item.workTypeName}}</td>
            <td>{{item.workDate}}</td>
            <td >
<!--              <el-input v-model="item.predictedArrivalTime" type="text" placeholder=""></el-input>-->
              <el-date-picker v-model="item.predictedArrivalTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disableWorkNodeEdit"></el-date-picker>
            </td>
            <td>
<!--              <el-input v-model="item.entryTime" type="text" placeholder=""></el-input>-->
              <el-date-picker v-model="item.entryTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disableWorkNodeEdit"></el-date-picker>
            </td>
            <td>{{item.linkmanName}}</td>
            <td>{{item.bill}}</td>
            <td>{{item.workAddress}}</td>
          </tr>
        </table>
      </div>
    </div>

    <!--      车辆信息    -->
    <div>
      <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="label">派车单号</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.WAYBILL_NUM" type="text" placeholder="" :disabled="disableEdit"></el-input>-->
            {{transitOrderData.WAYBILL_NUM}}
          </td>
          <td class="label">调度时间</td>
          <td class="value" :title="transitOrderData.DISPATCH_CREATE_DATE">
            <el-date-picker v-model="transitOrderData.DISPATCH_CREATE_DATE" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true"></el-date-picker>
          </td>
          <td class="label">供应商联系人</td>
          <td class="value">
            <el-input v-model="transitOrderData.SUPLIER_LINK_MAN" type="text" placeholder=""
                      :disabled="disableEdit || showTransitLog"></el-input>
          </td>
          <td class="label">供应商联系电话</td>
          <td class="value">
            <el-input v-model="transitOrderData.SUPLIER_LINK_PHONE" type="text" placeholder=""
                      :disabled="disableEdit || showTransitLog"></el-input>
          </td>
          <td class="label">是否开票</td>
          <td class="value">
            <el-select v-model="transitOrderData.IS_INVOICE" placeholder="是否开票" :disabled="disableEdit || showTransitLog">
              <el-option v-for="item in dicWhether" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">是否回单</td>
          <td class="value">
            <el-select v-model="transitOrderData.HAVE_RECEIPT" placeholder="是否回单" :disabled="disableEdit || showTransitLog">
              <el-option v-for="item in dicWhether" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="label">提货车牌号</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.PICK_PLATE_NUMBER" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.PICK_VEHICLE_ID" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'PICK_')"  :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeVehicle($event,'PICK_')" @clear="clearOneSelVehicleInfo('PICK_')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td class="label">车型</td>
          <td class="value">
            <el-select v-model="transitOrderData.PICK_VEHICLE_TYPE" clearable placeholder="车型" :disabled="vehicleDisable.PICK_">
              <el-option v-for="item in dicVehicleType" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">车长</td>
          <td class="value">
            <el-select v-model="transitOrderData.PICK_VEHICLE_LENGTH" clearable placeholder="车长" :disabled="vehicleDisable.PICK_">
              <el-option v-for="item in dicVehicleLength" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">提货司机</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.PICK_DRIVER_NAME" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.PICK_DRIVER_USER_ID" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'PICK_')" :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeDriver($event,'PICK_')" @clear="clearOneSelDriverInfo('PICK_')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td class="label">提货联系电话</td>
          <td class="value">
            <el-input v-model="transitOrderData.PICK_LINK_PHONE" type="text" placeholder=""
                      :disabled="disableEdit || modifyOpDisable"></el-input>
          </td>
          <td class="label"></td>
          <td class="value">
          </td>
<!--          <td class="label">提货时间</td>-->
<!--          <td class="value">-->
<!--            <el-date-picker v-model="transitOrderData.PICK_WORK_DATE" type="datetime" placeholder="选择提货时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disableEdit"></el-date-picker>-->
<!--          </td>-->
        </tr>
        <tr>
          <td class="label">送货车牌号</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.DELIVERY_PLATE_NUMBER" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.DELIVERY_VEHICLE_ID" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'DELIVERY_')" :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeVehicle($event,'DELIVERY_')" @clear="clearOneSelVehicleInfo('DELIVERY_')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td class="label">车型</td>
          <td class="value">
            <el-select v-model="transitOrderData.DELIVERY_VEHICLE_TYPE" clearable placeholder="车型" :disabled="vehicleDisable.DELIVERY_">
              <el-option v-for="item in dicVehicleType" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">车长</td>
          <td class="value">
            <el-select v-model="transitOrderData.DELIVERY_VEHICLE_LENGTH" clearable placeholder="车长" :disabled="vehicleDisable.DELIVERY_">
              <el-option v-for="item in dicVehicleLength" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">送货司机</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.DELIVERY_DRIVER_NAME" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.DELIVERY_DRIVER_USER_ID" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'DELIVERY_')" :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeDriver($event,'DELIVERY_')" @clear="clearOneSelDriverInfo('DELIVERY_')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td class="label">送货联系电话</td>
          <td class="value">
            <el-input v-model="transitOrderData.DELIVERY_LINK_PHONE" type="text" placeholder=""
                      :disabled="disableEdit || modifyOpDisable"></el-input>
          </td>
<!--          <td class="label">卸货时间</td>-->
<!--          <td class="value">-->
<!--            <el-date-picker v-model="transitOrderData.DELIVERY_WORK_DATE" type="datetime" placeholder="卸货时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disableEdit"></el-date-picker>-->
<!--          </td>-->
          <td class="label">外发单号</td>
          <td class="value">
            <el-input v-model="transitOrderData.DELIVERY_ORDER_NO" type="text" placeholder=""
                      :disabled="disableEdit"></el-input>
          </td>
        </tr>
        <tr>
          <td class="label">干线车牌号</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.TRUNK_PLATE_NUMBER" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.TRUNK_VEHICLE_ID" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'TRUNK_')" :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeVehicle($event,'TRUNK_')" @clear="clearOneSelVehicleInfo('TRUNK_')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td class="label">车型</td>
          <td class="value">
            <el-select v-model="transitOrderData.TRUNK_VEHICLE_TYPE" clearable placeholder="车型" :disabled="vehicleDisable.TRUNK_">
              <el-option v-for="item in dicVehicleType" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">车长</td>
          <td class="value">
            <el-select v-model="transitOrderData.TRUNK_VEHICLE_LENGTH" clearable placeholder="车长" :disabled="vehicleDisable.TRUNK_">
              <el-option v-for="item in dicVehicleLength" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td class="label">干线司机</td>
          <td class="value">
<!--            <el-input v-model="transitOrderData.TRUNK_DRIVER_NAME" type="text" placeholder=""-->
<!--                      :disabled="disableEdit"></el-input>-->
            <el-select v-model="transitOrderData.TRUNK_DRIVER_USER_ID" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'TRUNK_')" :disabled="disableEdit || isViewDetail || modifyOpDisable"
                       @change="changeDriver($event,'TRUNK_')" @clear="clearOneSelDriverInfo('TRUNK_')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td class="label">干线联系电话</td>
          <td class="value">
            <el-input v-model="transitOrderData.TRUNK_LINK_PHONE" type="text" placeholder=""
                      :disabled="disableEdit || modifyOpDisable"></el-input>
          </td>
          <td class="label">干转时间</td>
          <td class="value">
            <el-date-picker v-model="transitOrderData.TRANSIT_DATE" type="datetime" placeholder="选择中转时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disableEdit || modifyOpDisable"></el-date-picker>
          </td>
        </tr>
      </table>

      <!--      中转费用    -->
<!--      <div v-show="!showTransitLog">-->
<!--        <h3 class="common-title mt_20">-->
<!--          <span class="title-name">中转费用</span>-->
<!--        </h3>-->
<!--        <div class="tickManager">-->
<!--          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">-->
<!--            <thead>-->
<!--            <tr>-->
<!--              <th width="12%">中转运费</th>-->
<!--              <th width="12%">中转其他费</th>-->
<!--              <th width="12%">提货费</th>-->
<!--              <th width="12%">送货费</th>-->
<!--              <th width="12%" v-if="showTransitFeeMoveTable">异动金额合计</th>-->
<!--              <th width="12%" v-if="isViewDetail">补费金额合计</th>-->
<!--              <th width="16%">费用合计</th>-->
<!--            </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--            <tr>-->
<!--              <td>-->
<!--                <el-input v-model="transitOrderData.TRANSIT_FEE" type="text" placeholder="中转运费" v-mypmdouble4val-->
<!--                          @input="updateFeeTotal" :disabled="disableEdit"></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="transitOrderData.TRANSIT_OTHER_FEE" type="text" placeholder="中转其他费" v-mypmdouble4val-->
<!--                          @input="updateFeeTotal" :disabled="disableEdit"></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="transitOrderData.PICKUP_FEE" type="text" placeholder="提货费" v-mypmdouble4val-->
<!--                          @input="updateFeeTotal" :disabled="disableEdit"></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="transitOrderData.DELIVERY_FEE" type="text" placeholder="送货费" v-mypmdouble4val-->
<!--                          @input="updateFeeTotal" :disabled="disableEdit"></el-input>-->
<!--              </td>-->
<!--              <td v-if="showTransitFeeMoveTable">-->
<!--                {{feeMoveTotalInfo.totalFeeSum}}-->
<!--              </td>-->
<!--              <td v-if="isViewDetail">-->
<!--                {{totalAdditionalFeeSum}}-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="transitOrderData.TOTAL_FEE" type="text" placeholder="费用合计" :disabled="true"></el-input>-->
<!--              </td>-->
<!--            </tr>-->
<!--            </tbody>-->
<!--          </table>-->
<!--        </div>-->
<!--      </div>-->


      <!--      报价明细    -->
      <div v-show="!showTransitLog">
        <h3 class="common-title mt_20">
          <span class="title-name">报价明细</span>
        </h3>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="12%">计费方式</th>
              <th width="12%">运输模式</th>
              <th width="8%" v-if="transitOrderData.BILLING_TYPE==5">按件计费</th>
              <th width="12%">净重(kg)</th>
              <th width="12%">毛重(kg)</th>
              <th width="12%">体积(m³)</th>
              <th width="12%">计费单价</th>
              <th width="12%">提货费</th>
              <th width="12%">送货费</th>
              <th width="12%">干线费</th>
              <th width="12%">中转其他费</th>
              <th width="12%">下单金额</th>
              <th width="12%">异动金额</th>
              <th width="12%">补费金额</th>
              <th width="12%">费用合计</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <el-select v-model="transitOrderData.BILLING_TYPE" placeholder="计费方式" filterable clearable @change="" :disabled="disableEdit || transitOrderData.TRANSIT_OP_NODE > 0">
                  <el-option v-for="item in billingTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="transitOrderData.TRANSPORT" placeholder="运输模式" filterable clearable @change="" :disabled="disableEdit || transitOrderData.TRANSIT_OP_NODE > 0">
                  <el-option v-for="item in transportOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </td>
              <td v-if="transitOrderData.BILLING_TYPE==5 && transitOrderData.TRANSIT_OP_NODE > 0">
                <a href="javascript:void(0);" class="link" @click.stop="showPieceGoodsListDialog=true">查看明细</a>
              </td>
              <td v-if="transitOrderData.BILLING_TYPE==5 && transitOrderData.TRANSIT_OP_NODE == 0">
                <a href="javascript:void(0);" class="link" @click.stop="showPieceGoodsListDialog=true">维护明细</a>
              </td>
              <td>
                <!-- placeholder="净重(kg)" -->
                <el-input v-model="transitOrderData.NET_WEIGHT" type="text"  v-mypmdouble4val :disabled="isViewDetail" ></el-input>
              </td>
              <td>
                <!-- placeholder="毛重(kg)" -->
                <el-input v-model="transitOrderData.GROSS_WEIGHT" type="text"  v-mypmdouble4val :disabled="isViewDetail" ></el-input>
              </td>
              <td>
                <!-- placeholder="体积(m³)" -->
                <el-input v-model="transitOrderData.VOLUME" type="text"  v-mypmdouble4val :disabled="isViewDetail" ></el-input>
              </td>
              <td>
                <!-- placeholder="计费单价" -->
                <el-input v-model="transitOrderData.FREIGHT_PRICE" type="text"  v-mypmdouble4val :disabled="true" ></el-input>
              </td>
              <td>
                <!-- placeholder="提货费" -->
                <el-input v-model="transitOrderData.PICKUP_FEE" type="text"  v-mypmdouble4val :disabled="true" @input="updateTotalFee"></el-input>
              </td>
              <td>
                <!-- placeholder="送货费" -->
                <el-input v-model="transitOrderData.DELIVERY_FEE" type="text"  v-mypmdouble4val :disabled="true" @input="updateTotalFee"></el-input>
              </td>
              <td>
                <!-- placeholder="干线费" -->
                <el-input v-model="transitOrderData.TRANSIT_FEE" type="text"  v-mypmdouble4val :disabled="true" @input="updateTotalFee"></el-input>
              </td>
              <td>
                <!-- placeholder="中转其他费" -->
                <el-input v-model="transitOrderData.TRANSIT_OTHER_FEE" type="text"  v-mypmdouble4val :disabled="true" @input="updateTotalFee"></el-input>
              </td>
              <td>
                <!-- placeholder="下单金额" -->
                <el-input v-model="transitOrderData.TOTAL_FEE" type="text"  v-mypmdouble4val :disabled="true" ></el-input>
              </td>
              <td>
                <!-- placeholder="异动金额" -->
                <el-input v-model="transitOrderData.STATEMENT_FEE" type="text"  v-mypmdouble4val :disabled="true" ></el-input>
              </td>
              <td>
                <!-- placeholder="补费金额" -->
                <el-input v-model="transitOrderData.MAKEUP_FEE" type="text"  v-mypmdouble4val :disabled="true" ></el-input>
              </td>
              <td>
                <!-- placeholder="费用合计" -->
                <el-input v-model="quoteTotalFee" type="text"  v-mypmdouble4val :disabled="true" ></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>



      <!--      付款信息    -->
      <div v-show="!showTransitLog">
        <h3 class="common-title mt_20">
          <span class="title-name">付款信息</span>
        </h3>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="12%">预付</th>
              <th width="12%">到付</th>
              <th width="12%">周期付</th>
              <th width="12%">周期天数</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <el-input v-model="transitOrderData.PRE_PAY" type="text" placeholder="预付" v-mypmdouble4val
                          :disabled="disableEdit" @input="calcPayInfo"></el-input>
              </td>
              <td>
                <el-input v-model="transitOrderData.AFTER_PAY" type="text" placeholder="到付" v-mypmdouble4val
                          :disabled="disableEdit" @input="calcPayInfo"></el-input>
              </td>
              <td>
                <el-input v-model="transitOrderData.PERIODICAL_PAY" type="text" placeholder="周期付" v-mypmdouble4val
                          :disabled="disableEdit" @input="calcPayInfo"></el-input>
              </td>
              <td>
                <el-input v-model="transitOrderData.PERIODICAL_DAY" type="text" placeholder="周期天数" v-mynumval
                          :disabled="disableEdit"></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="">
          <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="10%">备注</td>
              <td class="value">
                <el-input v-model="transitOrderData.TRANSIT_REMARK" type="text" placeholder="" :disabled="disableEdit"></el-input>
              </td>
            </tr>
          </table>
        </div>
      </div>


      <!--      费用异动录入    -->
      <div v-if="showTransitFeeMoveTable && !isViewDetail">
        <h3 class="common-title mt_20">
          <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">（注：费用异动填写的是费用变动值!）</span></span>
        </h3>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="12%">中转运费</th>
              <th width="12%">中转其他费</th>
              <th width="12%">提货费</th>
              <th width="12%">送货费</th>
              <th width="16%">费用合计</th>
              <th width="16%">备注</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <el-input v-model="feeInfo.transitFee" type="text" placeholder="中转运费" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.transitOtherFee" type="text" placeholder="中转其他费" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.transitPickupFee" type="text" placeholder="提货费" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.transitDeliveryFee" type="text" placeholder="送货费" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input>
              <td>
                <el-input v-model="feeInfo.totalTransitFee" type="text" placeholder="费用合计" :disabled="true"></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.remark" type="text" placeholder="备注" :disabled="false"></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <!--      费用异动记录    -->
    <div v-if="isViewDetail || showTransitFeeMoveTable">
      <h3 class="common-title mt_20">
        <span class="title-name">费用异动记录</span>
      </h3>
      <div class="innerTable">
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="10%">序号</th>
<!--            <th width="10%">中转运费</th>-->
            <th width="10%">中转其他费</th>
<!--            <th width="10%">提货费</th>-->
<!--            <th width="10%">送货费</th>-->
<!--            <th width="10%">费用合计</th>-->
            <th width="10%">备注</th>
            <th width="10%">审核状态</th>
            <th width="10%">创建人</th>
            <th width="10%">创建日期</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in waybillStatementList" style="text-align: center">
            <td width="10%">{{ index + 1 }}</td>
<!--            <td width="10%">{{ item.transitFee }}</td>-->
            <td width="10%">{{ item.transitOtherFee }}</td>
<!--            <td width="10%">{{ item.pickupFee }}</td>-->
<!--            <td width="10%">{{ item.deliveryFee }}</td>-->
<!--            <td width="10%">{{ item.totalFee }}</td>-->
            <td width="10%">{{ item.remark }}</td>
            <td width="10%">{{ item.verifyStateName }}</td>
            <td width="10%">{{ item.createUserName }}</td>
            <td width="10%">{{ item.createDate }}</td>

          </tr>
          </tbody>
          <tfoot>
          <tr v-if="feeMoveTotalInfo.transitOtherFeeSum > 0">
            <td>合计</td>
            <!-- 调度重量/kg -->
<!--            <td>{{ feeMoveTotalInfo.transitFeeSum }}</td>-->
            <td>{{ feeMoveTotalInfo.transitOtherFeeSum }}</td>
<!--            <td>{{ feeMoveTotalInfo.pickupFeeSum }}</td>-->
<!--            <td>{{ feeMoveTotalInfo.deliveryFeeSum }}</td>-->
<!--            <td>{{ feeMoveTotalInfo.totalFeeSum }}</td>-->
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!--      补费记录    -->
    <div v-if="isViewDetail">
      <h3 class="common-title mt_20">
        <span class="title-name">补费记录</span>
      </h3>
      <div class="innerTable">
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="10%">序号</th>
            <th width="10%">中转运费</th>
            <th width="10%">中转其他费</th>
            <th width="10%">提货费</th>
            <th width="10%">送货费</th>
            <th width="10%">费用合计</th>
            <th width="10%">备注</th>
            <th width="10%">创建人</th>
            <th width="10%">创建日期</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in waybillAdditionalBillList" style="text-align: center">
            <td width="10%">{{ index + 1 }}</td>
            <td width="10%">{{ item.transitFee }}</td>
            <td width="10%">{{ item.transitOtherFee }}</td>
            <td width="10%">{{ item.pickupFee }}</td>
            <td width="10%">{{ item.deliveryFee }}</td>
            <td width="10%">{{ item.totalFee }}</td>
            <td width="10%">{{ item.remark }}</td>
            <td width="10%">{{ item.createUserName }}</td>
            <td width="10%">{{ item.createDate }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr v-if="additionalBillTotalInfo.totalFeeSum > 0">
            <td>合计</td>
            <!-- 调度重量/kg -->
            <td>{{ additionalBillTotalInfo.transitFeeSum }}</td>
            <td>{{ additionalBillTotalInfo.transitOtherFeeSum }}</td>
            <td>{{ additionalBillTotalInfo.pickupFeeSum }}</td>
            <td>{{ additionalBillTotalInfo.deliveryFeeSum }}</td>
            <td>{{ additionalBillTotalInfo.totalFeeSum }}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!--      跟踪录入    -->
    <div v-if="showTransitLog">
    <h3 class="common-title mt_20">
      <span class="title-name">跟踪录入</span>
    </h3>
    <div class="innerTable" >
      <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="label" width="16%">跟踪节点</td>
          <td class="value">
            跟踪内容
          </td>
        </tr>
        <tr>
          <td width="16%">
            <el-select v-model="transitOrderData.TRANSIT_OP_NODE" clearable placeholder="请选择跟踪节点" @change="$forceUpdate()">
              <el-option v-for="item in dicTransitOpNode" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="transitOrderData.TRANSIT_OP_CONTENT" type="text" placeholder=""></el-input>
          </td>
        </tr>
      </table>
    </div>
    </div>




    <!-- 操作按钮 -->
    <div class="bot-btn">
      <el-button @click="closePage">关闭</el-button>
      <el-button type="primary" v-if="showSubmitBtn" @click="submitTransit()">提交</el-button>
    </div>

    <!-- 货物明细 -->
    <el-dialog title="货物明细" :visible.sync="showGoodsDetialDialog" :close-on-click-modal="false"
               :close-on-press-escape="false" width="700px" @close="showGoodsDetialDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">订单号</label>
            <div class="input-text">
              <el-input v-model="transitOrderData.ORDER_NUM" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">客户</label>
            <div class="input-text">
              <el-input v-model="transitOrderData.CUST_NAME" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库存仓库</label>
            <div class="input-text">
              <el-input v-model="transitOrderData.WORK_NAME" type="text" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">卸货地</label>
            <div class="input-text">
              <el-input v-model="transitOrderData.UNLOAD_WORK_ADDRESS_STR" type="text" placeholder=""
                        :disabled="true"></el-input>
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
              <td>{{index + 1}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.goodsCount}}</td>
              <td>
                <el-input v-model="item.dispatchGoodsCount" type="text" placeholder="调度件数/件"
                          :disabled="true"></el-input>
              </td>
              <td>{{item.goodsWeight}}</td>
              <td>
                <el-input v-model="item.dispatchGoodsWeight" type="text" placeholder="调度重量/kg"
                          :disabled="true"></el-input>
              </td>
              <td>{{item.goodsVolume}}</td>
              <td>
                <el-input v-model="item.dispatchGoodsVolume" type="text" placeholder="调度体积/m³"
                          :disabled="true"></el-input>
              </td>
            </tr>
            </tbody>
            <!--            <tfoot>-->
            <!--            <tr>-->
            <!--              <td>合计：</td>-->
            <!--              <td></td>-->
            <!--              <td>{{ dispatchGoodsInfo.goodsCount }}</td>-->
            <!--              <td>{{ dispatchGoodsInfo.dispatchGoodsCount }}</td>-->
            <!--              <td>{{ dispatchGoodsInfo.goodsWeight }}</td>-->
            <!--              <td>{{ dispatchGoodsInfo.dispatchGoodsWeight }}</td>-->
            <!--              <td>{{ dispatchGoodsInfo.goodsVolume }}</td>-->
            <!--              <td>{{ dispatchGoodsInfo.dispatchGoodsVolume }}</td>-->
            <!--            </tr>-->
            <!--            </tfoot>-->
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <!--        <el-button size="mini" @click="showGoodsDetialDialog=false">关闭</el-button>-->
        <!--        <el-button type="primary" size="mini" @click="dispachGoodsDetail">修改保存</el-button>-->
      </div>
    </el-dialog>


    <!-- 选择作业点 -->
    <el-dialog title="选择卸货地"  :visible.sync="arriveWorkDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
               width="780px" @close="arriveWorkDialogShow=false">
      <div class="search-list clearfix">
        <div class="search-form clearfix" @keyup.enter="doQueryWorkInfo">
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
            <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQueryWorkInfo()">查询</el-button>
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



    <!-- 货物明细 -->
    <el-dialog title="运输实际件数" :visible.sync="showPieceGoodsListDialog"  :close-on-click-modal="false" :close-on-press-escape="false"  width="1200px"  @close="showPieceGoodsListDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <div>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="5%">序号</th>
              <th width="20%">下单客户</th>
              <th width="11%">货物</th>
              <th width="20%">库存仓库</th>
              <th width="20%">卸货地</th>
              <th width="8%">实际件数</th>
              <th width="8%">计费单价</th>
              <th width="8%">运费</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in pieceGoodsList">
              <td>{{index+1}}</td>
              <td>{{item.customerName}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.wareHouseName}}</td>
              <td>{{item.unloadPlace}}</td>
              <td><el-input v-model="item.actualGoodsCount" type="text" placeholder="实际件数" @input="inputPieceGoodsInfo(index)" @blur="inputPieceGoodsInfo(index)" v-mynumval :disabled="disableEdit || transitOrderData.TRANSIT_OP_NODE > 0"></el-input></td>
              <td>{{item.piecePrice}}</td>
              <td>{{item.pieceFee}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <el-button size="mini" @click="showPieceGoodsListDialog=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="savePieceGoodsInfo" v-if="transitOrderData.BILLING_TYPE==5 && transitOrderData.TRANSIT_OP_NODE <= 0">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import transitManage from './transitManage.js'

export default transitManage
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';


.dispatchPage .infoTable .leftTitle {
  float: left;
  width: 36px;
  background: #e8e8e8;
  font-weight: bold;
  font-size: 14px;
  height: 76px;
  letter-spacing: 5px;
  text-align: center;
  -webkit-writing-mode: vertical-lr;
  -ms-writing-mode: tb-lr;
  writing-mode: vertical-lr;
  vertical-align: middle;
  padding: 0 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
