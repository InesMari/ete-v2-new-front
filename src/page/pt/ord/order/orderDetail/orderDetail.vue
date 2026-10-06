<template>
    <div id="orderDetail" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title">
              <span class="title-name">基本信息</span>
              <!-- 新增回程单标识 -->
              <el-checkbox
                  v-model="order.isReturnTrip"
                  style="margin-left: 30px;" disabled>
                回程单
              </el-checkbox>
            </h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>订单编号</td>
                    <td class="value">
                        <el-input v-model="order.orderNum" disabled ></el-input>
                    </td>
                    <td class="label">下单人</td>
                    <td class="value">
                        <el-input v-model="order.createUserName" disabled ></el-input>
                    </td>
                    <td class="label">系统录单时间</td>
                    <td class="value">
                        <el-input v-model="order.createDate" disabled ></el-input>
                    </td>
                    <td class="label">订单状态</td>
                    <td class="value">
                        <el-input v-model="order.orderStateName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{order.isReturnTrip ? '临时' : '合同'}}客户</td>
                    <td class="value">
                        <el-input v-model="order.tenantName" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                        <el-input v-model="order.routeName" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-input v-model="order.orderTypeName" disabled ></el-input>
                    </td>
                    <td class="label">是否加急</td>
                    <td class="value">
                        <el-input v-model="order.isUrgentName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>客户下单时间</td>
                    <td class="value">
                        <el-input v-model="order.customerOrderDate" disabled type="text"></el-input>
                    </td>
					<td class="label"><em>*</em>业务类型</td>
					<td class="value">
                        <el-input v-model="order.bizTypeName" disabled ></el-input>
					</td>
                    <td class="label">客户单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" disabled ></el-input>
                    </td>
                    <td class="label">是否回单
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">要求回单，但没做回单的或者没要求回单或未完成的订单，都可以直接修改订单金额，已完成已传回单的订单，订单金额不可修改！</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </td>
                    <td class="value">
                        <el-input v-model="order.haveReceiptName" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" :colspan="!order.fullPath? 7 : 5">
                        <el-input v-model="order.remark" disabled type="text"></el-input>
                    </td>
					<td class="label" v-show="order.fullPath">附件</td>
					<td class="value" v-show="order.fullPath">
<!--                        <el-input v-model="order.remark" disabled type="text" v-show="!order.fullPath"></el-input>-->
						<a v-bind:href="order.fullPath" v-show="order.fullPath" v-bind:download="order.fileName" class="link"><span>{{order.fileName}}</span></a>
					</td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;" v-show="farthestDistanceShow">作业点距离：{{ order.farthestDistanceInfo }}</div>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">作业点顺序</th>
                        <th width="140"><em>*</em>作业点</th>
                        <th width="100">作业内容</th>
                        <th width="190">要求运作时间</th>
                        <th width="80">联系人</th>
                        <th width="120">联系手机</th>
                        <th width="120">联系电话</th>
                        <th width="180">详细地址</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(work, index) in workList">
                    <td>{{index + 1}}</td>
                    <td>
                        <el-input v-model="work.workName" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workTypeName" disabled></el-input>
                    </td>
                    <td>
                        <el-date-picker v-model="work.workDate" disabled type="datetime" align="right" :picker-options="pickerOptions"
                                        format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </td>
                    <td>
                        <el-input v-model="work.linkmanName" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.bill" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.phone" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workAddressStr" disabled :title="work.workAddressStr"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">货物明细</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th><em>*</em>货物名称</th>
                        <th>货物类别</th>
                        <th>包装类型</th>
                        <th>规格</th>
                        <th><em>*</em>提货点</th>
                        <th><em>*</em>卸货点</th>
                        <th>货物件数（件）</th>
                        <th>货物重量（KG）</th>
                        <th>货物体积（m³）</th>
                        <th>实际件数</th>
                        <th>按件单价</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(goods, index) in goodsList">
                        <td>
                            <el-input v-model="goods.goodsName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.classIdName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.packingTypeName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsModel" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.beginWorkName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.endWorkName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsCount" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsWeight" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsVolume" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.actualGoodsCount" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.piecePrice" disabled></el-input>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red">{{fee.goodsCountSum}}</td>
                        <td class="red">{{fee.goodsWeightSum}}</td>
                        <td class="red">{{fee.goodsVolumeSum}}</td>
                        <td class="red">{{ fee.goodsActualCountSum }}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <h3 class="common-title mt_20" v-entity="1003029"><span class="title-name">收入信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-entity="1003029">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="fee.billingType" disabled>
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车型</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleType" disabled>
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="fee.quoteVehicleType" disabled filterable clearable>
                            <el-option
                                    v-for="v in quoteVehicleTypeData"
                                    :key="v.codeValue"
                                    :label="v.codeName"
                                    :value="v.codeValue">
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleLength" disabled>
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算方式</td>
                    <td class="value">
                        <el-select v-model="fee.payMode" disabled>
                            <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <div class="table_height" v-entity="1003029">
                <table class="tableCommon detailTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="70">净重（KG）</th>
                        <th width="70">毛重（KG）</th>
                        <th width="70">体积（m³）</th>
                        <th width="70">计费单价</th>
                        <th width="70">中途点数</th>
                        <th width="70">点位费</th>
                        <th width="90">点位费合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=中途点数*点位费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="90">运费
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">按体积：=单价*体积<br/>按净重：=单价*净重<br/>按毛重：=单价*毛重</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="70">提货费</th>
                        <th width="70">送货费</th>
                        <th width="110">下单金额合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=点位费合计+运费+提货费+送货费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="100">费用异动合计</th>
                        <th width="70">补费合计</th>
                        <th width="100">订单费用合计</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <el-input v-model="fee.netWeight" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.grossWeight" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.volume" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freightPrice" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="workList.length - 2" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pointFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalPointFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freight" disabled v-mydoubleval></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pickupFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.deliveryFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.statementFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.makeupFee" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.amount" disabled></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!--            协同相关-->
<!--            <table class="fillTbale " width="100%" border="0" cellspacing="0" cellpadding="0">-->
<!--                <tr>-->
<!--                    <td class="label">协同区域</td>-->
<!--                    <td class="value">-->
<!--                        <el-input v-model="order.cdtRegionName" disabled v-mydouble4val placeholder="协同区域"></el-input>-->
<!--                    </td>-->
<!--                    <td class="label">协同费用</td>-->
<!--                    <td class="value">-->
<!--                        <el-input v-model="fee.cdtFee" disabled v-mydouble4val placeholder="协同费用"></el-input>-->
<!--                    </td>-->
<!--                </tr>-->
<!--            </table>-->
            <!--            协同相关-->

            <!--     费用异动记录-开始       -->
            <h3 class="common-title mt_20" v-show="changeList.length > 0"><span class="title-name">费用异动记录</span></h3>
            <div class="table_height" v-show="changeList.length > 0">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="70">保险费</th>
                            <th width="70">装货费</th>
                            <th width="70">卸货费</th>
                            <th width="70">放空费</th>
                            <th width="70">压夜费</th>
                            <th width="70">其他费</th>
                            <th width="110">费用合计
                                <el-tooltip class="item" effect="light" placement="top-start">
                                    <div slot="content">=保险费+装卸费+卸货费+放空费+压夜费+其他费</div>
                                    <i class="el-icon-question pointer"></i>
                                </el-tooltip>
                            </th>
                            <th width="70">审核状态</th>
                            <th width="70">创建人</th>
                            <th width="90">创建日期</th>
                            <th width="150">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in changeList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.premiumFee }}</td>
                            <td>{{ item.loadingFee }}</td>
                            <td>{{ item.dischargeFee }}</td>
                            <td>{{ item.emptyDrivingFee }}</td>
                            <td>{{ item.standbyFee }}</td>
                            <td>{{ item.otherFee }}</td>
                            <td>{{ item.totalFee }}</td>
                            <td>{{ item.verifyStateName }}</td>
                            <td>{{ item.createUserName }}</td>
                            <td>{{ item.createDate }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--     费用异动记录-结束       -->

            <!--     补费记录-开始       -->
            <h3 class="common-title mt_20" v-show="makeupList.length > 0"><span class="title-name">补费记录</span></h3>
            <div class="table_height" v-show="makeupList.length > 0">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="70">保险费</th>
                            <th width="70">装货费</th>
                            <th width="70">卸货费</th>
                            <th width="70">放空费</th>
                            <th width="70">压夜费</th>
                            <th width="70">其他费</th>
                            <th width="110">费用合计
                                <el-tooltip class="item" effect="light" placement="top-start">
                                    <div slot="content">=保险费+装卸费+卸货费+放空费+压夜费+其他费</div>
                                    <i class="el-icon-question pointer"></i>
                                </el-tooltip>
                            </th>
                            <th width="70">创建人</th>
                            <th width="90">创建日期</th>
                            <th width="150">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in makeupList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.premiumFee }}</td>
                            <td>{{ item.loadingFee }}</td>
                            <td>{{ item.dischargeFee }}</td>
                            <td>{{ item.emptyDrivingFee }}</td>
                            <td>{{ item.standbyFee }}</td>
                            <td>{{ item.otherFee }}</td>
                            <td>{{ item.totalFee }}</td>
                            <td>{{ item.createUserName }}</td>
                            <td>{{ item.createDate }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td>{{makeupSum.premiumFeeSum}}</td>
                        <td>{{makeupSum.loadingFeeSum}}</td>
                        <td>{{makeupSum.dischargeFeeSum}}</td>
                        <td>{{makeupSum.emptyDrivingFeeSum}}</td>
                        <td>{{makeupSum.standbyFeeSum}}</td>
                        <td>{{makeupSum.otherFeeSum}}</td>
                        <td>{{makeupSum.totalFeeSum}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--     补费记录-结束       -->

            <h3 class="common-title mt_20"><span class="title-name"  v-entity="1003030">派车单成本信息</span></h3>
            <div class="table_height" v-entity="1003030">
                <table class="tableCommon detailTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="70">运费</th>
<!--                            <th width="70">提货费</th>-->
<!--                            <th width="70">送货费</th>-->
<!--                            <th width="70">装货费</th>-->
<!--                            <th width="70">卸货费</th>-->
                            <th width="70">点位费</th>
<!--                            <th width="70">放空费</th>-->
<!--                            <th width="70">压夜费</th>-->
<!--                            <th width="70">其他费</th>-->
                            <th width="80">中转运费</th>
                            <th width="80">中转其他费</th>
                            <th width="90">下单金额合计</th>
                            <th width="90">异动金额合计</th>
                            <th width="90">补费金额合计</th>
                            <th width="100">派车单费用合计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><el-input v-model="cost.freight" disabled ></el-input></td>
<!--                            <td><el-input v-model="cost.pickupFee" disabled ></el-input></td>-->
<!--                            <td><el-input v-model="cost.deliveryFee" disabled ></el-input></td>-->
<!--                            <td><el-input v-model="cost.loadingFee" disabled ></el-input></td>-->
<!--                            <td><el-input v-model="cost.dischargeFee" disabled ></el-input></td>-->
                            <td><el-input v-model="cost.totalPointFee" disabled ></el-input></td>
<!--                            <td><el-input v-model="cost.emptyDrivingFee" disabled ></el-input></td>-->
<!--                            <td><el-input v-model="cost.standbyFee" disabled ></el-input></td>-->
<!--                            <td><el-input v-model="cost.otherFee" disabled ></el-input></td>-->
                            <td><el-input v-model="cost.transitFee" disabled ></el-input></td>
                            <td><el-input v-model="cost.transitOtherFee" disabled ></el-input></td>
                            <td><el-input v-model="cost.totalFee" disabled ></el-input></td>
                            <td><el-input v-model="cost.statementFee" disabled ></el-input></td>
                            <td><el-input v-model="cost.makeupFee" disabled ></el-input></td>
                            <td><el-input v-model="cost.amount" disabled ></el-input></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="common-title mt_20"  v-entity="1003030"><span class="title-name">派车单明细</span></h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="150">派车单号</th>
                            <th width="80">调度类型</th>
                            <th width="60">状态</th>
                            <th width="120">起始点</th>
                            <th width="120">目的地</th>
                            <th width="200">供应商</th>
                            <th width="80" v-entity="1003030">计费方式</th>
                            <th width="100">司机名称</th>
                            <th width="100">司机联系方式</th>
                            <th width="100">车牌号码</th>
                            <th width="150">出车时间</th>
                            <th width="150">收车时间</th>
                            <th width="100">下单人</th>
                            <th width="150">系统录单时间</th>
                            <th width="80" v-entity="1003030">点位费</th>
                            <th width="100" v-entity="1003030">运费</th>
<!--                            <th width="80" v-entity="1003030">提货费</th>-->
<!--                            <th width="80" v-entity="1003030">送货费</th>-->
<!--                            <th width="80" v-entity="1003030">装货费</th>-->
<!--                            <th width="80" v-entity="1003030">卸货费</th>-->
<!--                            <th width="80" v-entity="1003030">放空费</th>-->
<!--                            <th width="80" v-entity="1003030">压夜费</th>-->
<!--                            <th width="80" v-entity="1003030">其他费</th>-->
                            <th width="80" v-entity="1003030">中转费</th>
                            <th width="80" v-entity="1003030">中转其他费</th>
                            <th width="100" v-entity="1003030">下单金额合计</th>
                            <th width="100" v-entity="1003030">异动金额合计</th>
                            <th width="100" v-entity="1003030">补费金额合计</th>
                            <th width="100" v-entity="1003030">派车单费用合计</th>
                            <th width="120">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dispatchList">
                            <td>{{ index + 1 }}</td>
                            <td><a class="link" @click="toWaybillDetail(item)">{{ item.waybillNum }}</a></td>
                            <td>{{ item.dispatchTypeName }}</td>
                            <td>{{ item.waybillStateName }}</td>
                            <td>{{ item.beginWorkName }}</td>
                            <td>{{ item.endWorkName }}</td>
                            <td>{{ item.tenantName }}</td>
                            <td v-entity="1003030">{{ item.billingTypeName }}</td>
                            <td>{{ item.driverName }}</td>
                            <td>{{ item.linkPhone }}</td>
                            <td>{{ item.plateNumber }}</td>
                            <td>{{ item.startCarDate }}</td>
                            <td>{{ item.endCarDate }}</td>
                            <td>{{ item.createUserName }}</td>
                            <td>{{ item.createDate }}</td>
                            <td v-entity="1003030">{{ item.totalPointFee }}</td>
                            <td v-entity="1003030">{{ item.freight }}</td>
<!--                            <td v-entity="1003030">{{ item.pickupFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.deliveryFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.loadingFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.dischargeFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.emptyDrivingFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.standbyFee }}</td>-->
<!--                            <td v-entity="1003030">{{ item.otherFee }}</td>-->
                            <td v-entity="1003030">{{ item.transitFee }}</td>
                            <td v-entity="1003030">{{ item.transitOtherFee }}</td>
                            <td v-entity="1003030">{{ item.totalFee }}</td>
                            <td v-entity="1003030">{{ item.fluctuationCostFee }}</td>
                            <td v-entity="1003030">{{ item.billShareCostFee }}</td>
                            <td v-entity="1003030">{{ item.waybillTotalFee }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-entity="1003030"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-entity="1003030">{{ dispatchSum.totalPointFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.freightSum }}</td>
<!--                        <td v-entity="1003030">{{ dispatchSum.pickupFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.deliveryFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.loadingFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.dischargeFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.emptyDrivingFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.standbyFeeSum }}</td>-->
<!--                        <td v-entity="1003030">{{ dispatchSum.otherFeeSum }}</td>-->
                        <td v-entity="1003030">{{ dispatchSum.transitFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.transitOtherFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.totalFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.fluctuationCostFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.billShareCostFeeSum }}</td>
                        <td v-entity="1003030">{{ dispatchSum.waybillTotalFeeSum }}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <h3 class="common-title mt_20"><span class="title-name">单据管理</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>单据类型</th>
                        <th>上传时间</th>
                        <th>上传人员</th>
                        <th>图片</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in receiptsList">
                        <td>{{index + 1}}</td>
                        <td>{{item.receiptsTypeName}}</td>
                        <td>{{item.createDate}}</td>
                        <td>{{item.createUserName}}</td>
                        <td><el-button type="primary" plain @click="showBigImg(item)" size="mini">查看图片</el-button></td>
                    </tr>
                </tbody>
            </table>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import orderDetail from './orderDetail.js'

	export default orderDetail
</script>
<style lang="scss">
    @import '@/page/pt/ord/order.scss';
    #orderDetail{
        .detailTable{
            .el-input__inner{
                padding:0;
            }
        }
    }
</style>
