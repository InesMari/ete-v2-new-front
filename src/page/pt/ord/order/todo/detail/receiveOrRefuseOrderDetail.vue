<template>
    <div id="receiveOrRefuseOrderDetail" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>订单编号</td>
                    <td class="value">
                        <el-input v-model="order.orderNum" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">下单人</td>
                    <td class="value">
                        <el-input v-model="order.createUserName" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">系统录单时间</td>
                    <td class="value">
                        <el-input v-model="order.createDate" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">订单状态</td>
                    <td class="value">
                        <el-input v-model="order.orderStateName" :disabled="true" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>客户</td>
                    <td class="value">
                        <el-select v-model="order.tenantId" :disabled="true" filterable clearable  placeholder="请选择客户" >
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                      <el-select v-model="order.routeId" :disabled="true" filterable placeholder="线路名称">
                        <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName" :value="item.routeId"></el-option>
                      </el-select>
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-select v-model="order.orderType" :disabled="true" placeholder="订单类型" >
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">是否加急</td>
                    <td class="value">
                      <el-select v-model="order.isUrgent" :disabled="true" placeholder="是否加急">
                        <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>客户下单时间</td>
                    <td class="value">
                        <el-input v-model="order.customerOrderDate" :disabled="true" type="text"></el-input>
                    </td>
					<td class="label"><em>*</em>业务类型</td>
					<td class="value">
						<el-select v-model="order.bizType" placeholder="业务类型">
							<el-option v-for="item in bizTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
						</el-select>
					</td>
                    <td class="label">客户单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">是否回单
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">要求回单，但没做回单的或者没要求回单或未完成的订单，都可以直接修改订单金额，已完成已传回单的订单，订单金额不可修改！</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </td>
                    <td class="value">
                        <el-select v-model="order.haveReceipt" :disabled="true" placeholder="是否回单">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">
                        <el-input v-model="order.remark" :disabled="true" type="text"></el-input>
                    </td>
					<td class="label">附件</td>
					<td class="value">
						<a v-bind:href="order.fullPath" v-bind:download="order.fileName" class="link" ><span>{{order.fileName}}</span></a>
					</td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
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
                        <el-select v-model="work.workId" :disabled="true" filterable clearable placeholder="请选择作业点">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="work.workType" :disabled="true" placeholder="请选择作业内容">
                            <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-date-picker v-model="work.workDate" :disabled="true" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                        value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </td>
                    <td>
                        <el-input v-model="work.linkmanName" :disabled="true" type="text" placeholder="联系人"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.bill" :disabled="true" type="text" placeholder="联系手机"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.phone" :disabled="true" type="text" placeholder="联系电话"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workAddressStr" :disabled="true" type="text" placeholder="详细地址" :title="work.workAddressStr"></el-input>
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
                    <tr v-for="(goods) in goodsList">
                        <td>
                            <el-select v-model="goods.goodsId" :disabled="true" filterable clearable placeholder="选择货物">
                                <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId" ></el-option>
                                </el-option-group>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.classId" :disabled="true" filterable clearable placeholder="货物类别">
                                <el-option v-for="item in classTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.packingType" :disabled="true" filterable clearable placeholder="包装类型">
                                <el-option v-for="item in packTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsModel" :disabled="true" type="text" maxlength="100" placeholder="规格"></el-input>
                        </td>
                        <td>
                            <el-select v-model="goods.beginWorkId" :disabled="true" placeholder="提货点">
                                <el-option v-for="item in beginWorkData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.endWorkId" :disabled="true" placeholder="卸货点">
                                <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsCount" :disabled="true" maxlength="7" type="text" placeholder="货物件数"></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsWeight" :disabled="true" maxlength="19" type="text" placeholder="货物重量"></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsVolume" :disabled="true" maxlength="19" type="text" placeholder="货物体积"></el-input>
                        </td>
                        <td>
                            <el-input v-mynumval v-model="goods.actualGoodsCount" @input="changeGoodsActualCount()" type="text" maxlength="100" ></el-input>
                        </td>
                        <td>
                            <el-input v-mydoubleval v-model="goods.piecePrice" disabled type="text" maxlength="100" ></el-input>
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
            <h3 class="common-title mt_20"><span class="title-name">收入信息</span></h3>
            <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="fee.billingType" @change="matchOrderFee(false)" placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车型</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleType" filterable clearable placeholder="车型">
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="fee.quoteVehicleType" @change="changeQuoteVehicleType" placeholder="请选择报价车型" filterable clearable>
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
                        <el-select v-model="fee.vehicleLength" filterable clearable @change="changeVehicleLength" placeholder="车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算方式</td>
                    <td class="value">
                        <el-select v-model="fee.payMode" clearable @change="changePayMode()" placeholder="结算方式">
                            <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
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
                                <div slot="content">按整车：=单价<br/>按体积：=单价*体积<br/>按净重：=单价*净重<br/>按毛重：=单价*毛重</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="70">提货费</th>
                        <th width="70">送货费</th>
                        <th width="90">费用合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=点位费合计+运费+提货费+送货费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <el-input v-model="fee.netWeight" v-mydouble4val @input="calcTotalFee()"  placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.grossWeight" v-mydouble4val @input="calcTotalFee()" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.volume" v-mydouble4val @input="calcTotalFee()" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freightPrice" :disabled="true" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="workList.length - 2" :disabled="true" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pointFee" :disabled="true" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalPointFee" :disabled="true"  placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freight" :disabled="true" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pickupFee" disabled placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.deliveryFee" disabled placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalFee" :disabled="true" placeholder=""></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <h3 class="common-title mt_20">
                    <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>注：以上报价为合同报价，如果有出入请做费用异动，需上级领导审核！</em></span>
                </h3>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="70">保险费</th>
                        <th width="70">装货费</th>
                        <th width="70">卸货费</th>
                        <th width="70">其他费</th>
                        <th width="90">异动合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=保险费+装卸费+卸货费+其他费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <el-input v-model="fee.premiumFee" v-mydoubleval @input="calcStatementTotalFee()" type="text"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.loadingFee" v-mydoubleval @input="calcStatementTotalFee()" type="text"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.dischargeFee" v-mydoubleval @input="calcStatementTotalFee()" type="text"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.otherFee" v-mydoubleval @input="calcStatementTotalFee()" type="text"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.statementFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="toReceiveOrder">接受订单</el-button>
            </div>
        </div>

    </div>
</template>

<script>
	import receiveOrRefuseOrderDetail from './receiveOrRefuseOrderDetail.js'

	export default receiveOrRefuseOrderDetail
</script>
<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>
