<template>
    <div id="orderDetail" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">订单编号</td>
                    <td class="value">
                        <el-input v-model="order.orderNum" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">下单人</td>
                    <td class="value">
                        <el-input v-model="order.createUserName" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">下单时间</td>
                    <td class="value">
                        <el-input v-model="order.createDate" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">订单状态</td>
                    <td class="value">
                        <el-input v-model="order.orderStateName" :disabled="true" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">线路名称</td>
                    <td class="value">
                      <el-select v-model="order.routeId" :disabled="true" filterable placeholder="线路名称">
                        <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName" :value="item.routeId"></el-option>
                      </el-select>
                    </td>
                    <td class="label">订单类型</td>
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
                    <td class="label">是否回单</td>
                    <td class="value">
                      <el-select v-model="order.haveReceipt" :disabled="true" placeholder="是否回单">
                        <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">我的单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label">订单备注</td>
                    <td class="value" :colspan="order.fileName == null || order.fileName === undefined || order.fileName === '' ? 5 : 3">
                        <el-input v-model="order.remark" :disabled="true" type="text"></el-input>
                    </td>
                    <td class="label" v-show="order.fileName">附件</td>
                    <td class="value" v-show="order.fileName">
                        <a v-bind:href="order.fullPath" v-bind:download="order.fileName" class="link" ><span>{{order.fileName}}</span></a>
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
                        <th width="140">作业点</th>
                        <th width="100">作业内容</th>
                        <th width="190">运作时间</th>
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
                        <th>货物名称</th>
                        <th>货物类别</th>
                        <th>包装类型</th>
                        <th>提货点</th>
                        <th>卸货点</th>
                        <th>货物件数（件）</th>
                        <th>货物重量（KG）</th>
                        <th>货物体积（m³）</th>
                        <th>规格</th>
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
                            <el-input v-model="goods.goodsModel" :disabled="true" type="text" maxlength="100" placeholder="规格"></el-input>
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
                        <td class="red">{{fee.goodsCountSum}}</td>
                        <td class="red">{{fee.goodsWeightSum}}</td>
                        <td class="red">{{fee.goodsVolumeSum}}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">费用信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">计费方式</td>
                    <td class="value">
                        <el-select v-model="fee.billingType" :disabled="true" placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车型</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleType" :disabled="true" filterable clearable placeholder="车型">
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-select v-model="fee.vehicleLength" :disabled="true" filterable clearable placeholder="车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">结算方式</td>
                    <td class="value">
                        <el-select v-model="fee.payMode" :disabled="true" placeholder="结算方式">
                            <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
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
                        <th width="80">运费
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
                        <th width="100">异动金额合计</th>
                        <th width="70">补费金额合计</th>
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
                            <el-input v-model="fee.pickupFee" disabled placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.deliveryFee" disabled placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.totalFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.statementFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.makeupFee" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                        <td>
                            <el-input v-model="fee.amount" :disabled="true" type="text" placeholder=""></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="common-title mt_20"><span class="title-name">派车单明细</span></h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="150">派车单号</th>
                            <th width="60">状态</th>
                            <th width="120">起始点</th>
                            <th width="120">目的地</th>
                            <th width="100">司机名称</th>
                            <th width="100">司机联系方式</th>
                            <th width="100">车牌号码</th>
                            <th width="150">出车时间</th>
                            <th width="150">收车时间</th>
                            <th width="100">下单人</th>
                            <th width="150">下单时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dispatchList">
                            <td>{{ index + 1 }}</td>
                            <td><a class="link" @click="toWaybillDetail(item)">{{ item.waybillNum }}</a></td>
                            <td>{{ item.waybillStateName }}</td>
                            <td>{{ item.beginWorkName }}</td>
                            <td>{{ item.endWorkName }}</td>
                            <td>{{ item.driverName }}</td>
                            <td>{{ item.linkPhone }}</td>
                            <td>{{ item.plateNumber }}</td>
                            <td>{{ item.startCarDate }}</td>
                            <td>{{ item.endCarDate }}</td>
                            <td>{{ item.createUserName }}</td>
                            <td>{{ item.createDate }}</td>
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
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
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
</style>
