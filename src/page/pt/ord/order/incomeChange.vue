<template>
    <div id="incomeChange" class="orderDetailPage orderPage">
        <div class="common-info">
            <!--     基本信息-开始       -->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>订单编号</td>
                    <td class="value">
                        <el-input v-model="order.orderNum" disabled type="text"></el-input>
                    </td>
                    <td class="label">下单人</td>
                    <td class="value">
                        <el-input v-model="order.createUserName" disabled type="text"></el-input>
                    </td>
                    <td class="label">下单时间</td>
                    <td class="value">
                        <el-input v-model="order.createDate" disabled type="text"></el-input>
                    </td>
                    <td class="label">订单状态</td>
                    <td class="value">
                        <el-input v-model="order.orderStateName" disabled type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{order.isReturnTrip ? '临时' : '合同'}}客户</td>
                    <td class="value">
                        <el-select v-model="order.tenantId" disabled placeholder="请选择客户" >
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                      <el-select v-model="order.routeId" disabled placeholder="线路名称">
                        <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName" :value="item.routeId"></el-option>
                      </el-select>
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-select v-model="order.orderType" disabled placeholder="订单类型" >
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">是否加急</td>
                    <td class="value">
                      <el-select v-model="order.isUrgent" disabled placeholder="是否加急">
                        <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label" >客户下单时间</td>
                    <td class="value">
                        <el-input v-model="order.customerOrderDate" :disabled="true" type="text"></el-input>
                    </td>
					<td class="label"><em>*</em>业务类型</td>
					<td class="value">
						<el-select v-model="order.bizType" disabled placeholder="业务类型">
							<el-option v-for="item in bizTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
						</el-select>
					</td>
                    <td class="label">客户单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" disabled type="text"></el-input>
                    </td>
                    <td class="label">是否回单
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">要求回单，但没做回单的或者没要求回单或未完成的订单，都可以直接修改订单金额，已完成已传回单的订单，订单金额不可修改！</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </td>
                    <td class="value">
                        <el-select v-model="order.haveReceipt" disabled placeholder="是否回单">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
				<tr>
					<td class="label">备注</td>
					<td class="value" colspan="7">
						<el-input v-model="order.remark" disabled type="text"></el-input>
					</td>
				</tr>
            </table>
            <!--     基本信息-结束       -->
            <!--     作业点信息-开始       -->
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;" v-show="farthestDistanceShow">作业点距离：{{ order.farthestDistanceInfo }}</div>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="40">作业点顺序</th>
                        <th width="140"><em>*</em>作业点</th>
                        <th width="50">作业内容</th>
                        <th width="110">要求运作时间</th>
                        <th width="80">联系人</th>
                        <th width="80">联系手机</th>
                        <th width="80">联系电话</th>
                        <th width="200">详细地址</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(work, index) in workList">
                    <td>{{index + 1}}</td>
                    <td>
                        <el-select v-model="work.workId" disabled filterable clearable placeholder="请选择作业点">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="work.workType" disabled placeholder="请选择作业内容">
                            <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-date-picker v-model="work.workDate" disabled type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                        value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </td>
                    <td>
                        <el-input v-model="work.linkmanName" disabled type="text" placeholder="联系人"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.bill" disabled type="text" placeholder="联系手机"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.phone" disabled type="text" placeholder="联系电话"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workAddressStr" disabled type="text" placeholder="详细地址"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--     作业点信息-结束       -->
            <!--     货物明细-开始       -->
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
                            <el-select v-model="goods.goodsId" disabled placeholder="选择货物">
                                <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId" ></el-option>
                                </el-option-group>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.classId" disabled filterable clearable placeholder="货物类别">
                                <el-option v-for="item in classTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.packingType" disabled filterable clearable placeholder="包装类型">
                                <el-option v-for="item in packTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsModel" disabled type="text" maxlength="100" placeholder="规格"></el-input>
                        </td>
                        <td>
                            <el-select v-model="goods.beginWorkId" disabled placeholder="提货点">
                                <el-option v-for="item in beginWorkData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="goods.endWorkId" disabled placeholder="卸货点">
                                <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsCount" disabled maxlength="7" type="text" placeholder="货物件数"></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsWeight" disabled maxlength="19" type="text" placeholder="货物重量"></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsVolume" disabled maxlength="19" type="text" placeholder="货物体积"></el-input>
                        </td>
                        <td>
                            <el-input v-mynumval v-model="goods.actualGoodsCount" disabled type="text" maxlength="100" ></el-input>
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
            <!--     货物明细-结束       -->
            <!--     收入信息-开始       -->
            <h3 class="common-title mt_20"><span class="title-name">收入信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="fee.billingType" disabled placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车型</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleType" disabled placeholder="车型">
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="fee.quoteVehicleType" disabled placeholder="请选择报价车型">
                            <el-option v-for="v in quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue">
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleLength" disabled placeholder="车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算方式</td>
                    <td class="value">
                        <el-select v-model="fee.payMode" disabled placeholder="结算方式">
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
                        <th >提货费</th>
                        <th >送货费</th>
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
                            <el-input v-model="fee.netWeight" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.grossWeight" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.volume" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freightPrice" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="workList.length - 2" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pointFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalPointFee" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.freight" disabled type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.pickupFee" disabled placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.deliveryFee" disabled placeholder=""></el-input>
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
            <h3 class="common-title mt_20">
                <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:red;">注：费用异动填写变更变动值，已完成没进账单，创建订单后的次月6日后不允许费用异动！</span>
                    <span class="fr" v-show="isCrossCostShow">
                        <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">选中且审核后,派车单详情自动添加一条异动记录，异动成本=异动收入*{{ common.shareRate }}</div>
                                <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                        <el-checkbox v-model="change.isCrossCost" style="margin:0 5px;"></el-checkbox>
                        <span style="color:red;">是否协同成本</span>
                    </span>
                </span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>保险费</th>
                        <th>装货费</th>
                        <th>卸货费</th>
                        <th>放空费</th>
                        <th>压夜费</th>
                        <th>其他费</th>
                        <th>异动合计
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
                    <tfoot>
                    <tr v-show="false">
                        <td>合计：</td>
                        <td>{{changeSum.premiumFeeSum}}</td>
                        <td>{{changeSum.loadingFeeSum}}</td>
                        <td>{{changeSum.dischargeFeeSum}}</td>
                        <td>{{changeSum.emptyDrivingFeeSum}}</td>
                        <td>{{changeSum.standbyFeeSum}}</td>
                        <td>{{changeSum.otherFeeSum}}</td>
                        <td>{{changeSum.totalFeeSum}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--     订单费用异动记录-结束       -->

            <!--     提交关闭       -->
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="isEdit && !isOnlySee" @click="sureChange">提交</el-button>
                <el-button type="primary" v-show="!isEdit && !isOnlySee" @click="sureChange">确认修改</el-button>
            </div>
            <!--     提交关闭       -->
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import incomeChange from './incomeChange.js'
	export default incomeChange
</script>
<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>
