<template>
    <div id="incomeChangeCustomer" class="orderDetailPage orderPage">
        <div class="search-list clearfix">
          <div class="search-form clearfix">
            <div class="item">
              <label class="label">客户名称</label>
              <div class="input-text">
                <el-input v-model="query.tenantName" placeholder="客户" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">线路名称</label>
              <div class="input-text">
                <el-input v-model="query.routeName" placeholder="线路名称" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">车牌号码</label>
              <div class="input-text">
                <el-input v-model="query.plateNumber" placeholder="订单号/客户单号" type="text"></el-input>
              </div>
            </div>
            <div class="item daterange">
              <label class="label">客户下单时间</label>
              <div class="input-text">
                <el-date-picker v-model="query.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                unlink-panels></el-date-picker>
              </div>
            </div>
          </div>
          <div class="search-btn clearfix">
            <div class="btn">
              <el-button type="primary" plain size="mini" @click="loadIncomeOrderData" icon="el-icon-search">查询</el-button>
            </div>
            <div class="btn">
              <el-button type="danger" plain size="mini" @click="clear()" icon="el-icon-close">清空</el-button>
            </div>
          </div>
          <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
          <div class="search-bot">
            <img src="@/static/image/search-bot.png" alt="">
            <i class="icon el-icon-arrow-down"></i>
            <i class="icon el-icon-arrow-up"></i>
          </div>
        </div>
        <div class="common-info ">
            <div class="input-text">
              <el-select v-model="orderId" placeholder="请选择订单编号" filterable clearable
                         @change="changeOrder">
                <el-option v-for="item in orderList" :key="item.orderId" :label="item.orderNum" :value="item.orderId"></el-option>
              </el-select>
              <el-button type="primary" plain size="mini" @click="toOrderDetail()" style="margin-left: 10px;">查看订单详情</el-button>
            </div>
            <!--     基本信息-开始       -->
            <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td class="label">客户单号</td>
                <td class="value">
                  <el-input v-model="order.custOrderNum" :disabled="true" type="text"></el-input>
                </td>
                <td class="label" >线路名称</td>
                <td class="value">
                  <el-input v-model="order.routeName" :disabled="true" type="text"></el-input>
                </td>
                <td class="label">客户下单时间</td>
                <td class="value">
                  <el-input v-model="order.createDate" :disabled="true" type="text"></el-input>
                </td>
                <td class="label">订单状态</td>
                <td class="value">
                  <el-input v-model="order.orderStateName" :disabled="true" type="text"></el-input>
                </td>
              </tr>
            </table>
            <!--     基本信息-结束       -->
            <!--     收入信息-开始       -->
            <h3 class="common-title mt_20"><span class="title-name">收入信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="fee.billingType" :disabled="true" @change="matchOrderFee" placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车型</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleType" :disabled="true" filterable clearable placeholder="车型">
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="fee.quoteVehicleType" :disabled="true" placeholder="请选择报价车型" filterable clearable>
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
                        <el-select v-model="fee.vehicleLength" :disabled="true" filterable clearable @change="matchOrderFee" placeholder="车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算方式</td>
                    <td class="value">
                        <el-select v-model="fee.payMode" :disabled="true" @change="changePayMode()" placeholder="结算方式">
                            <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>净重（KG）</th>
                        <th>毛重（KG）</th>
                        <th>体积（m³）</th>
                        <th>计费单价</th>
                        <th>中途点数</th>
                        <th>点位费</th>
                        <th>点位费合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=中途点数*点位费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th>运费
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">按体积：=单价*体积<br/>按净重：=单价*净重<br/>按毛重：=单价*毛重</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th>提货费</th>
                        <th>送货费</th>
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
                            <el-input v-model="fee.netWeight" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.grossWeight" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.volume" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freightPrice" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="workList.length - 2" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pointFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalPointFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freight" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pickupFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.deliveryFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.totalFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.statementFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.makeupFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.amount" disabled type="text" placeholder=""></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--     收入信息-结束       -->
            <!--     费用异动-开始       -->
            <h3 class="common-title mt_20"><span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用异动填写变更变动值，已完成没进账单，创建订单后的次月6日后不允许费用异动！</span></span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>保险费</th>
                        <th>装货费</th>
                        <th>卸货费</th>
                        <th>放空费</th>
                        <th>压夜费</th>
                        <th>其他费</th>
                        <th>费用合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=保险费+装卸费+卸货费+放空费+压夜费+其他费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="150">异动备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-input v-model="change.premiumFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.loadingFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.dischargeFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="change.emptyDrivingFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="change.standbyFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.otherFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.totalFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.remark" :disabled="isOnlySee" type="text" placeholder="" maxlength="255"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--     费用异动-结束       -->
            <!--     订单费用异动记录-开始       -->
            <h3 class="common-title mt_20"><span class="title-name">订单费用异动记录</span></h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>保险费</th>
                            <th>装货费</th>
                            <th>卸货费</th>
                            <th>放空费</th>
                            <th>压夜费</th>
                            <th>其他费</th>
                            <th>费用合计</th>
                            <th>审核状态</th>
                            <th>创建人</th>
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
            <!--     订单费用异动记录-结束       -->

            <!--     提交关闭       -->
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="!isOnlySee" @click="sureChange">确定异动</el-button>
            </div>
            <!--     提交关闭       -->

        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import incomeChangeCustomer from './incomeChangeCustomer.js'
	export default incomeChangeCustomer
</script>
<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>
