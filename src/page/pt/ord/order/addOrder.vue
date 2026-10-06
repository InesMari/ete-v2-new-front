<template>
    <div id="addOrder" class="addOrderPage orderPage">
        <div class="common-info">
            <h3 class="common-title">
              <span class="title-name">基本信息</span>
              <!-- 新增回程单标识 -->
              <el-checkbox v-model="order.isReturnTrip" @change="changeReturnTrip" style="margin-left: 30px;" :disabled="order.ownVehicleScheduleId">
                回程单
              </el-checkbox>
            </h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>{{order.isReturnTrip ? '临时' : '合同'}}客户</td>
                    <td class="value">
                        <el-select v-model="order.tenantId"
                                   filterable clearable
                                   @click.native="loadCustomerData"
                                   @change="changeTenant"
                                   placeholder="请选择客户" >
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                        <el-select v-model="order.routeId" v-show="!order.isReturnTrip"
                                   filterable clearable
                                   @click.native="selectCustomerTip(1)"
                                   @change="changeRouteSelect"
                                   placeholder="请选择线路" >
                            <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName"
                                       :value="item.routeId"></el-option>
                        </el-select>

                        <!--                            临时客户的可输入线路-->
                        <el-autocomplete v-show="order.isReturnTrip"
                                class="inline-input" style="margin-left: -40px;"
                                v-model="order.routeName"
                                :fetch-suggestions="querySearch"
                                @select="selectRouteName"
                                @input="changeRouteName"
                                placeholder="请输入或选择线路">
                            <i @click="clearRouteName" style="margin: 13px -50px 0 0;" class="el-icon-circle-close delIcon" slot="suffix"></i>
                            <template slot-scope="{ item }">
                                <span class="addr">{{ item.routeName }}</span>
                            </template>
                        </el-autocomplete>
                        <!--                            临时客户的可输入线路-->
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-select v-model="order.orderType" clearable @click.native="keepOrderType" @change="changeOrderType"
                                   placeholder="请选择订单类型" >
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">是否加急</td>
                    <td class="value">
                        <el-select v-model="order.isUrgent" placeholder="请选择是否加急">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>客户下单时间</td>
                    <td class="value">
                        <my-el-date-picker @input="forceUpdate" v-model="order.customerOrderDate" type="datetime"
                                           placeholder="请选择日期时间" align="right" :picker-options="limitPickerOptions"
                                           format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                        </my-el-date-picker>
                    </td>
					<td class="label"><em>*</em>业务类型</td>
					<td class="value">
						<el-select v-model="order.bizType" placeholder="请选择业务类型">
							<el-option v-for="item in bizTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
						</el-select>
					</td>
                    <td class="label">客户单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" type="text"></el-input>
                    </td>
                    <td class="label">是否回单
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">要求回单，但没做回单的或者没要求回单或未完成的订单，都可以直接修改订单金额，已完成已传回单的订单，订单金额不可修改！</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </td>
                    <td class="value">
                        <el-select v-model="order.haveReceipt" placeholder="请选择是否回单">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>

                <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;" v-show="farthestDistanceShow">作业点距离：{{ order.farthestDistanceInfo }}</div>
                <el-tooltip effect="dark" content="调整顺序" placement="top-start" :hide-after='1000' >
                    <img src="@/static/image/edit.png" class="edit" alt="" @click="showEditDialog(showEdit)">
                </el-tooltip>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="80">作业点顺序</th>
                        <th width="140"><em>*</em>作业点</th>
                        <th width="100">作业内容</th>
                        <th width="190"><em>*</em>要求运作时间</th>
                        <th width="80">联系人</th>
                        <th width="120">联系手机</th>
                        <th width="120">联系电话</th>
                        <th width="180">详细地址</th>
                        <th width="50" ></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(work, index) in workList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-select v-model="work.workId" v-show="!order.isReturnTrip"
                                       @click.native="selectCustomerTip(2)"
                                       @change="changeWork(work, index)"
                                       filterable clearable
                                       placeholder="请选择作业点">
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                           :value="item.workId" :disabled="item.disabled"></el-option>
                            </el-select>
                            <!--                            临时客户的可新增作业点-->
                            <el-select v-model="work.workId" v-show="order.isReturnTrip"
                                       @click.native="selectCustomerTip(2)"
                                       @change="changeWork(work, index)"
                                       filterable clearable
                                       placeholder="请选择作业点">
                                <el-option class="add-work-option" :value="null">
                                    <div @click="addWork(true, index)">新增</div>
                                </el-option>
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                           :value="item.workId" :disabled="item.disabled"></el-option>
                            </el-select>
                            <!--                            临时客户的新增作业点-->
                        </td>
                        <td>
                            <el-select v-model="work.workType" clearable @change="changeWork(work, index)"
                                       :disabled="index === 0 || index === workList.length - 1" placeholder="请选择作业内容">
                                <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <my-el-date-picker @blur="changeWorkDate(index, work)" @input="forceUpdate" v-model="work.workDate" type="datetime"
                                               placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                               format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                            </my-el-date-picker>
                        </td>
                        <td>
                            <el-input v-model="work.linkmanName" @input="forceUpdate" type="text" placeholder="联系人"></el-input>
                        </td>
                        <td>
                            <el-input v-model="work.bill" @input="forceUpdate" type="text" placeholder="联系手机"></el-input>
                        </td>
                        <td>
                            <el-input v-model="work.phone" @input="forceUpdate" type="text" placeholder="联系电话"></el-input>
                        </td>
                        <td>
                            <el-input v-model="work.workAddressStr" @input="forceUpdate" :disabled="true" type="text"
                                      placeholder="详细地址" :title="work.workAddressStr"></el-input>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="添加作业点" placement="top-start" :hide-after='1000'
                                        v-show="index === 0">
                                <span @click="addOrderWork()" class="add"></span>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除作业点" placement="top-start" :hide-after='1000'
                                        v-show="index !== 0 && workList.length > 2">
                                <span @click="removeOrderWork(work, index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
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
                    <th width="50">
                        <el-tooltip effect="dark" content="添加货物" placement="top-start" :hide-after='1000'>
                            <span @click="addOrderGoods()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(goods, index) in goodsList">
                    <td>
                        <el-select v-model="goods.goodsId" v-show="!order.isReturnTrip"
                                   @click.native="selectCustomerTip(3)"
                                   @change="changeGoods(goods, index)"
                                   filterable clearable
                                   placeholder="请选择货物">
                            <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                                           :value="item.goodsId" :disabled="item.disabled"></el-option>
                            </el-option-group>
                        </el-select>
                        <!--                            临时客户的新增货物-->
                        <el-select v-model="goods.goodsId" v-show="order.isReturnTrip"
                                   @click.native="selectCustomerTip(3)"
                                   @change="changeGoods(goods, index)"
                                   filterable clearable
                                   placeholder="请输入选择货物">
                                <el-option class="add-work-option" :value="null">
                                    <div @click="addGoods(true, index)">新增</div>
                                </el-option>
                                <el-option v-for="item in goodsData" :key="item.goodsId" :label="item.goodsName"
                                           :value="item.goodsId" :disabled="item.disabled">
                                </el-option>
                        </el-select>
                        <!--                            临时客户的新增货物-->
                    </td>
                    <td>
                        <el-select v-model="goods.classId" placeholder="货物类别" filterable clearable>
                            <el-option v-for="item in classTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.packingType" placeholder="包装类型" clearable >
                            <el-option v-for="item in packTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsModel" type="text" maxlength="100" placeholder="规格"></el-input>
                    </td>
                    <td>
                        <el-select v-model="goods.beginWorkId" clearable @click.native="tipSelectWork(1)"
                                   @change="changeGoodsWork(goods, 1, true)" placeholder="提货点">
                            <el-option v-for="item in beginWorkData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.endWorkId" clearable @click.native="tipSelectWork(2)"
                                   @change="changeGoodsWork(goods, 2, true)" placeholder="卸货点">
                            <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsCount" v-mynumval @input="changeGoodsCount(goods, index)" maxlength="7"
                                  type="text" placeholder="货物件数"></el-input>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsWeight" v-mydouble4val @input="changeGoodsWeight" @blur="matchOrderFee(false)"
                                  maxlength="19" type="text" placeholder="货物重量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsVolume" v-mydouble4val @input="changeGoodsVolume"  @blur="matchOrderFee(false)"
                                  maxlength="19" type="text" placeholder="货物体积"></el-input>
                    </td>
                    <td>
                        <el-input v-mynumval v-model="goods.actualGoodsCount" @input="changeGoodsActualCount()"
                                  type="text" maxlength="100" ></el-input>
                    </td>
                    <td>
                        <el-input v-mydoubleval v-model="goods.piecePrice" disabled type="text" maxlength="100" ></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除货物" placement="top-start" :hide-after='1000'>
                            <span @click="removeOrderGoods(index)" class="del"></span>
                        </el-tooltip>
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
                    <td class="red">{{ fee.goodsCountSum }}</td>
                    <td class="red">{{ fee.goodsWeightSum }}</td>
                    <td class="red">{{ fee.goodsVolumeSum }}</td>
                    <td class="red">{{ fee.goodsActualCountSum }}</td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
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
                            <el-option v-for="v in quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue">
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
                            <el-input v-model="fee.netWeight" v-mydouble4val @input="calcTotalFee()" placeholder=""></el-input>
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

            <!--            协同相关-->
<!--            <table class="fillTbale " width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">协同区域</td>
                    <td class="value">
                        <el-select v-model="order.cdtRegionId" filterable clearable @click.native="checkTenant" @change="changeCdtRegion" placeholder="协同区域">
                            <el-option v-for="item in cdtRegionData" :key="item.id" :label="item.regionName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                    <td class="label">协同费用</td>
                    <td class="value">
                        <el-input v-model="fee.cdtFee" v-mydouble4val placeholder="协同费用"></el-input>
                    </td>
                </tr>
            </table>-->
            <!--            协同相关-->

            <h3 class="common-title mt_20">
                <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>注：以上报价为合同报价，如果有出入请做费用异动，需上级领导审核！</em></span>
                <span class="fr fw" style="width: 20%;text-align: center;line-height: 30px;font-size: 14px;">加上本次异动总金额：{{fee.totalStatementFeeSum}}</span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="70">保险费</th>
                    <th width="70">装货费</th>
                    <th width="70">卸货费</th>
                    <th width="70">放空费</th>
                    <th width="70">压夜费</th>
                    <th width="70">其他费</th>
                    <th width="70">异动合计
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">=保险费+装卸费+卸货费+放空费+压夜费+其他费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-input v-model="fee.premiumFee" v-mydoubleval @input="calcStatementTotalFee()"
                                      placeholder=""></el-input>
                        </td>

                        <td>
                            <el-input v-model="fee.loadingFee" v-mydoubleval @input="calcStatementTotalFee()"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.dischargeFee" v-mydoubleval @input="calcStatementTotalFee()"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.emptyDrivingFee" v-mydoubleval @input="calcStatementTotalFee()"
                                    placeholder=""></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.standbyFee" v-mydoubleval @input="calcStatementTotalFee()"
                                    placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.otherFee" v-mydoubleval @input="calcStatementTotalFee()"
                                      placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.statementFee" :disabled="true" placeholder=""></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">订单备注</td>
                    <td class="value" colspan="7">
                        <el-input v-model="order.remark" placeholder=""></el-input>
                    </td>
                </tr>
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="sureOrder">确定下单</el-button>
            </div>
        </div>

        <!-- 修改作业点信息顺序 -->
        <el-dialog class="editDialog" title="调整作业点顺序" :visible.sync="showEdit" min-width="700px"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="100">作业点名称</th>
                    <th width="200">详细地址</th>
                    <th width="100">作业内容</th>
                    <th width="100">作业顺序</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(work,index) in workList" :key="index">
                    <td>{{ work.workName }}</td>
                    <td>{{ work.workAddressStr }}</td>
                    <td>
                        <el-select v-model="work.workType" clearable :disabled="true" placeholder="请选择作业内容">
                            <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="work.workOrder" @input="forceUpdate" v-mynumval placeholder="顺序"
                                  style="text-align:center;"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="page-bot-btn">
                <el-button size="mini" @click="showEditDialog()">关闭</el-button>
                <el-button type="primary" size="mini" @click="updateWorkOrder()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 新增订单成功弹窗 -->
        <el-dialog title="新增订单成功" :visible.sync="showSuccessDialog" width="400px">
            <div style="font-weight:bold;font-size:14px;">订单号：<em>{{ successData.orderNum }}</em></div>
            <div class="page-bot-btn">
                <el-button type="primary" @click="toOrderDetail">查看订单详情</el-button>
                <el-button type="success" @click="changeSuccessDialog(false)">再下一单</el-button>
            </div>
        </el-dialog>
        <!-- 新增订单成功弹窗 -->

        
        <!-- 新增 作业点 -->
        <el-dialog :title="title" :visible.sync="workVisible" width="520px"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="identify clearfix" v-if="showIdentify">
                <el-input type="textarea" v-model="identifyText" placeholder="黏贴信息，自动拆分详细地址、联系人、电话" @input="$forceUpdate();"></el-input>
                <el-button size="mini" type="primary" class="fr" @click="identify">识别</el-button>
            </div>
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>名称</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.workName" maxlength="100" placeholder="请输入作业点名称" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所在地区</label>
                        <div class="input-text">
                            <el-select v-model="workInfo.provinceId" placeholder="省" filterable @change="changeProvinceSelect" disabled style="width:23%;margin-right:2%;">
                                <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.cityId" placeholder="市" filterable @change="changeCitySelect" :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.districtId" placeholder="区" filterable :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-button type="primary" @click="showMap" style="width:25%;" v-if="!disabled">地图选择</el-button>
                            <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton" @sureCallback="sureWorkAddress" @hideMapBack="hideMapBack" :modal="false"></map-dialog>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>街道地址</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.address" maxlength="200" placeholder="不需要重复填写省/市/区" :disabled="disabled" @input="forceUpdate"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">电子围栏范围</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.electricFence" maxlength="100" :placeholder="electricPlace" :disabled="disabled || isOverlays" style="width:73%;" v-if="!disabled"></el-input>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:25%;" v-if="!disabled">手工绘制</el-button>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:100%;" v-if="disabled">查看电子围栏范围</el-button>
                        </div>
                    </li>
<!--                    <li class="item item100">-->
<!--                        <label class="label-term"><em>*</em>类型</label>-->
<!--                        <div class="input-text">-->
<!--                            <el-radio v-model="workInfo.workinfoType" label="1" :disabled="disabled">作业点</el-radio>-->
<!--                            <el-radio v-model="workInfo.workinfoType" label="2" :disabled="disabled">仓库</el-radio>-->
<!--                        </div>-->
<!--                    </li>-->
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.linkmanName" maxlength="50" placeholder="请输入联系人" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系手机</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.bill" v-mynumval maxlength="11" placeholder="请输入联系手机" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.phone" maxlength="50" placeholder="请输入联系电话" :disabled="disabled"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button @click="addWork(false)">关闭</el-button>
                    <el-button type="primary" @click="saveWorkInfo()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <map-dialog ref="mapDialogDraw" mapName="draw" :isShowMap="isShowMapDraw" :mapPoint="mapPointDraw" :drawPoints="drawPoints" :isDraw="isDraw" @sureCallback="sureWorkAddressDraw"
                    @hideMapBack="hideMapBackDraw" :modal="true" :hideBtn="showMapBotton"></map-dialog>

        <!-- 新增 货物 -->
        <el-dialog title="新增货物" :visible.sync="goodsVisible" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>货物名称</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsName" maxlength="20" placeholder="请输入货物名称"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>货物类别</label>
                        <div class="input-text">
                            <el-select v-model="goodsInfo.classId"
                                       filterable clearable
                                       placeholder="请选择货物类别">
                                <el-option v-for="item in classData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>包装类型</label>
                        <div class="input-text">
                            <el-select v-model="goodsInfo.packingType"
                                       filterable clearable
                                       placeholder="请选择包装类型">
                                <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">规格</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsModel" maxlength="255" placeholder="请输入规格"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">长(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsLength" @blur="changeProperty(1)" v-mydouble4val maxlength="19" placeholder="请输入货物长度"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">宽(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsWidth" @blur="changeProperty(2)" v-mydouble4val maxlength="19" placeholder="请输入货物宽度"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">高(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsHeight" @blur="changeProperty(3)" v-mydouble4val maxlength="19" placeholder="请输入货物高度"></el-input>
                        </div>
                    </li>
                    <li class="item item50" v-show="showSingleVolume">
                        <label class="label-term" style="width: 94px">单个货物体积(m³)</label>
                        <div class="input-text" style="width: calc(100% - 104px)">
                            <el-input v-model="goodsInfo.singleGoodsVolume" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" @click="saveGoodsInfo()">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import addOrder from './addOrder.js'
	export default addOrder
</script>
<style lang="scss">
  @import '@/page/pt/ord/order.scss';
</style>
<style lang="scss">
.addOrderPage{

}
</style>
