<template>
    <div id="updateOrder" class="addOrderPage orderPage">
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
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                        <el-select v-model="order.routeId" :disabled="isEdit" filterable
                                   @click.native="selectCustomerTip(1)" @change="changeRoute" placeholder="线路名称">
                            <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName"
                                       :value="item.routeId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-select v-model="order.orderType" :disabled="isEdit" @click.native="keepOrderType"
                                   @change="changeOrderType" placeholder="订单类型">
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">是否加急</td>
                    <td class="value">
                        <el-select v-model="order.isUrgent" :disabled="isEdit" placeholder="是否加急">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">是否回单
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">要求回单，但没做回单的或者没要求回单或未完成的订单，都可以直接修改订单金额，已完成已传回单的订单，订单金额不可修改！</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </td>
                    <td class="value">
                        <el-select v-model="order.haveReceipt" :disabled="isEdit" placeholder="是否回单">
                            <el-option v-for="item in isUrgentData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">我的单号</td>
                    <td class="value">
                        <el-input v-model="order.custOrderNum" type="text"></el-input>
                    </td>
					<td class="label">订单备注</td>
					<td class="value" colspan="3">
						<el-input v-model="order.remark" type="text" placeholder=""></el-input>
					</td>
					<td class="label">上传附件</td>
					<td class="value">
						<myFileModel ref="upload" clickType="text" @successCallback="uploadSuccessCallback"
									 style="margin-top: 3px;display: inline-block;margin-right: 10px;vertical-align: middle;">
						</myFileModel>
						<span>{{ order.fileName }}</span>
					</td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;" v-show="farthestDistanceShow">作业点距离：{{ order.farthestDistanceInfo }}</div>
                <el-tooltip effect="dark" content="调整顺序" placement="top-start" :hide-after='1000'>
                    <img src="@/static/image/edit.png" class="edit" alt="" @click="showEditDialog(showEdit)">
                </el-tooltip>
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
                    <th width="30"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(work, index) in workList">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-select v-model="work.workId" :disabled="isEdit" @click.native="selectCustomerTip(2)"
                                   @change="changeWork(work, index)" filterable clearable placeholder="请选择作业点">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="work.workType" @change="changeWork(work, index)"
                                   :disabled="index === 0 || index === workList.length - 1 || isEdit"
                                   placeholder="请选择作业内容">
                            <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <my-el-date-picker @input="forceUpdate" v-model="work.workDate" type="datetime"
                                           placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                           format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                        </my-el-date-picker>
                    </td>
                    <td>
                        <el-input v-model="work.linkmanName" @input="forceUpdate" type="text"
                                  placeholder="联系人"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.bill" @input="forceUpdate" type="text" placeholder="联系手机"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.phone" @input="forceUpdate" type="text" placeholder="联系电话"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workAddressStr" @input="forceUpdate" :disabled="true" type="text"
                                  placeholder="详细地址"></el-input>
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
            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th><em>*</em>货物名称</th>
                    <th>货物类别</th>
                    <th>包装类型</th>
                    <th><em>*</em>提货点</th>
                    <th><em>*</em>卸货点</th>
                    <th>货物件数（件）</th>
                    <th>货物重量（KG）</th>
                    <th>货物体积（m³）</th>
                    <th>规格</th>
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
                        <el-select v-model="goods.goodsId" :disabled="isEdit" @click.native="selectCustomerTip(3)"
                                   @change="changeGoods(goods, index)" filterable clearable placeholder="选择货物">
                            <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                                           :value="item.goodsId"></el-option>
                            </el-option-group>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.classId" :disabled="isEdit" filterable clearable placeholder="货物类别">
                            <el-option v-for="item in classTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.packingType" :disabled="isEdit" filterable clearable placeholder="包装">
                            <el-option v-for="item in packTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.beginWorkId" :disabled="isEdit" @click.native="tipSelectWork(1)"
                                   @change="changeGoodsWork(goods, 1, true)" placeholder="提货点">
                            <el-option v-for="item in beginWorkData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="goods.endWorkId" :disabled="isEdit" @click.native="tipSelectWork(2)"
                                   @change="changeGoodsWork(goods, 2, true)" placeholder="卸货点">
                            <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsCount" :disabled="isEdit" v-mynumval
                                  @input="changeGoodsCount(goods, index)" maxlength="7" type="text"
                                  placeholder="货物件数"></el-input>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsWeight" :disabled="isEdit" v-mydouble4val
                                  @input="changeGoodsWeight" @blur="matchOrderFee(true)" maxlength="19" type="text" placeholder="货物重量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsVolume" :disabled="isEdit" v-mydouble4val
                                  @input="changeGoodsVolume" @blur="matchOrderFee(true)" maxlength="19" type="text" placeholder="货物体积"></el-input>
                    </td>
                    <td>
                        <el-input v-model="goods.goodsModel" :disabled="isEdit" type="text" maxlength="100"
                                  placeholder="规格"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除货物" placement="top-start" :disabled="isEdit"
                                    :hide-after='1000'>
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
                    <td class="red">{{ fee.goodsCountSum }}</td>
                    <td class="red">{{ fee.goodsWeightSum }}</td>
                    <td class="red">{{ fee.goodsVolumeSum }}</td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="updateOrder">确认修改</el-button>
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
                        <el-select v-model="work.workType" :disabled="true" placeholder="请选择作业内容">
                            <el-option v-for="item in workTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="work.workOrder" @input="forceUpdate" v-mynumval type="text" placeholder="顺序"
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
        <!-- 修改作业点信息顺序 结束-->

    </div>
</template>

<script>
import updateOrderHZ from './updateOrderHZ.js'

export default updateOrderHZ
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
