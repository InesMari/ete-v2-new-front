<template>
  <div id="addQuoteSheet" class="quoteSheetPage">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>客户</td>
                <td class="value" colspan="2">
                    <el-select v-model="info.baseInfo.custTenantId" @change="changeCustomer" clearable filterable placeholder="选择客户">
                        <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                    </el-select>
                </td>
                <td class="label"><em>*</em>结算主体</td>
                <td class="value">
                    <el-select v-model="info.baseInfo.settleBody" placeholder="结算主体" filterable clearable>
                        <el-option v-for="item in payTitle" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                        </el-option>
                    </el-select>
                </td>
                <td class="label">报价时间</td>
                <td class="value">
                    <el-date-picker
                        v-model="info.baseInfo.quoteDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="报价时间"
                    ></el-date-picker>
                </td>
            </tr>
            <tr>
                <td class="label labelSpec">客户信息：</td>
                <td class="label">客户联系人</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.linkman" placeholder="客户联系人"></el-input>
                </td>
                <td class="label">联系方式</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.billId" placeholder="联系方式"></el-input>
                </td>
                <td class="label">电子邮件</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.email" placeholder="电子邮件"></el-input>
                </td>
            </tr>
            <tr>
                <td class="label labelSpec">我方信息：</td>
                <td class="label">报价人</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.ourLinkman" :disabled="true" placeholder="报价人"></el-input>
                </td>
                <td class="label">联系方式</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.ourBillId" :disabled="true" placeholder="联系方式"></el-input>
                </td>
                <td class="label">电子邮件</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.ourEmail" :disabled="true" placeholder="电子邮件    "></el-input>
                </td>
            </tr>
            <tr>
                <td class="label">备注</td>
                <td class="value" colspan="6">
                    <el-input type="textarea" v-model="info.baseInfo.remark" placeholder="备注"></el-input>
                </td>
            </tr>
        </table>
        
        <vuedraggable v-model="info.titles">
        <div class="tableItem" v-for="(tableItem,tableIndex) in info.titles" :key="tableItem.codeId">
            <h3>
                <el-checkbox v-model="tableItem.display" :true-label="1" :false-label="0" :checked="tableItem.display=='1'" @change="forceUpdate">{{tableIndex+1}}、{{tableItem.titleName}}（<em>提示：鼠标拉动此标题表格记录，可变更前后顺序</em>）</el-checkbox>
                <span v-if="tableItem.codeId==1">{{tableIndex+1}}、{{tableItem.title}}（<em>提示：鼠标拉动表格标题或内容，可变更前后顺序</em>）</span>
                <el-button size="mini" v-if="tableItem.codeId==11" v-show="tableItem.display=='1'" style="margin-top:6px;" @click="mergeFee(tableItem)">合并明细</el-button>
            </h3>
            <div v-for="(routeItem,routeIndex) in tableItem.routes" :key="routeIndex" v-show="tableItem.display=='1'" style="margin-bottom:20px;">
                <div class="common-info" style="border:none;padding:0;">
                    <ul class="content clearfix">
                        <li class="item" style="width: 21%;">
                            <label class="label-term"><em>*</em>报价级别：</label>
                            <div class="input-text">
                                <el-select v-model="routeItem.quoteLevel" @change="changeQuoteLevel(tableIndex,routeItem,routeIndex)" filterable placeholder="报价级别">
                                    <el-option v-for="item in quoteLevelData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                                </el-select>
                            </div>
                        </li>
                        
                        <li class="item" v-for="(item, index) in routeItem.sections" :key="index" style="width: 21%;">
                            <label class="label-term" v-if="index==0"><em>*</em>起始地：</label>
                            <label class="label-term" v-if="index!=0 && index!=routeItem.sections.length-1"><em>*</em>中途点：</label>
                            <label class="label-term" v-if="index==routeItem.sections.length-1"><em>*</em>目的地：</label>
                            <div class="input-text">
                                <el-select v-model="item.workId" @focus="focusWork" @change="changeWork(routeItem, index, item)" clearable filterable
                                        v-show="routeItem.quoteLevel == enumData.quoteLevel.PRESS_WORK" placeholder="请选择作业点">
                                    <el-option v-for="item in routeItem.workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                                </el-select>
                                <mycity :ref="'city'+ tableIndex + routeIndex + index" class="mycity fl" selectType="3" @selectCallback="selectCallback(tableIndex,routeItem,routeIndex,item,index)"
                                        v-show="routeItem.quoteLevel == enumData.quoteLevel.PRESS_REGION" placeholder="请选择省市区"></mycity>
                            </div>
                        </li>
                        <li class="item" style="padding-top: 8px; width: 8%;margin:0; min-width: auto;" v-if="tableItem.itemType==1">
                            <el-tooltip effect="dark" :content="(routeItem.quoteLevel == enumData.quoteLevel.PRESS_WORK) ? '添加作业点' : '添加省市区'"
                                        v-show="routeItem.sections.length < 4" placement="top-start" :hide-after='1000' style="margin-right: 10px">
                                <span @click="addSectionItem(tableIndex,routeItem,routeIndex)" class="add"></span>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="(routeItem.quoteLevel == enumData.quoteLevel.PRESS_WORK) ? '删除作业点' : '删除省市区'"
                                        v-show="routeItem.sections.length > 2" placement="top-start" :hide-after='1000'>
                                <span @click="removeSectionItem(routeItem,routeIndex)" class="del"></span>
                            </el-tooltip>
                        </li>
                    </ul>
                </div>
                <h5 class="routeTitle">
                    线路名称：<span v-for="(item,index) in routeItem.sections">{{ (item.indexSearchStr?item.indexSearchStr:'') + (routeItem.sections.length-1==index?'':' - ')}}</span>
                    <el-tooltip effect="dark" content="添加线路" placement="top-start" :hide-after='1000' style="margin-right: 10px" v-if="routeIndex == tableItem.routes.length-1">
                        <span @click="addRouter(tableItem.routes,tableItem.itemType)" class="add"></span>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除线路" placement="top-start" :hide-after='1000' v-if="tableItem.routes.length>1">
                        <span @click="delRouter(tableItem.routes,routeIndex,tableIndex)" class="del"></span>
                    </el-tooltip>
                </h5>
                <div style="overflow-x: auto;">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="tableIndex==0">
                    <thead>
                        <tr>
                            <th width='40'>序号</th>
                            <th width="100">计费方式</th>
                            <th width="200">报价车型</th>
                            <th width="200">车长</th>
                            <th width="80">是否往返</th>
                            <th width="100">未税单价（元）</th>
                            <th width="80">增值税（%）</th>
                            <th width="100">价税合计（元）</th>
                            <th width="200">备注</th>
                            <th width='40'>
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                    <span @click="addFee(routeItem.details,tableItem.itemType)" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in routeItem.details">
                            <td>{{idx + 1}}</td>
                            <td >
                                <el-select v-model="item.billingType" filterable clearableplaceholder="请选择">
                                    <el-option v-for="v in billingTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.quoteVehicleType" @change="changeQuoteVehicleType(item)" filterable multiple clearable placeholder="请选择报价车型">
                                    <el-option v-for="v in item.quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue" :disabled="v.disabled"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.vehicleLength" @change="changeVehicleLength(item)" filterable multiple clearable placeholder="请选择车长">
                                    <el-option v-for="v in item.vehicleLengthData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue" :disabled="v.disabled"></el-option>
                                </el-select>
                            </td>
                            <td>
                              <el-switch v-model="item.isRound == 1" @change="changeInfoSwitch(item)" active-color="#13ce66"
                                         inactive-color="#ff4949"></el-switch>
                              <span style="margin-left:8px;vertical-align: middle;"
                                    class="name">{{ item.isRound == 1 ? "是" : "否" }}</span>
                            </td>
                            <!-- 未税单价（元） -->
                            <td><el-input v-model="item.fee" v-mydouble5val maxlength="19" @input="calcFee(item,'fee')"></el-input></td>
                            <!-- 增值税（%） -->
                            <td><el-input v-model="item.taxRate" v-mydouble5val maxlength="19" @input="calcFee(item,'taxRate')"></el-input></td>
                            <!-- 价税合计（元） -->
                            <td><el-input v-model="item.feeWithTax" v-mydouble5val maxlength="19" @input="calcFee(item,'feeWithTax')"></el-input></td>
                            <td><el-input v-model="item.remark"></el-input></td>
                            <td>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                    <span @click="delFee(routeItem.details,idx)" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                
                <div style="overflow-x: auto;">
                <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="tableIndex==1">
                    <thead>
                        <tr>
                            <th width='40'>序号</th>
                            <th width="100">费用类型</th>
                            <th width="100">计费方式</th>
                            <th width="200">区间</th>
                            <th width="100">区间单位</th>
                            <th width="100">未税单价（元）</th>
                            <th width="100">增值税（%）</th>
                            <th width="110">价税合计（元）</th>
                            <th width="200">备注</th>
                            <th width='40'>
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                    <span @click="addFee(routeItem.details,tableItem.itemType)" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in routeItem.details">
                            <td>{{index + 1}}</td>
                            <td>
                                <el-select v-model="item.feeType" placeholder="请选择" filterable>
                                    <el-option v-for="v in feeTypeData" :key="v.codeValue"
                                        :label="v.codeName" :value="v.codeValue">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.billingType" clearable placeholder="请选择" :disabled="item.disBillingType">
                                    <el-option v-for="b in billingTypeData" :key="b.codeValue"
                                        :label="b.codeName" :value="b.codeValue">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.rangeStart" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable" @change="forceUpdate"></el-input> -
                                <el-input v-model="item.rangeEnd" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable" @change="forceUpdate"></el-input>
                            </td>
                            <td>
                                <el-select v-model="item.rangeUnit" placeholder="请选择" :disabled="item.rangeDisable">
                                    <el-option v-for="v in rangeUnitData" :key="v.codeValue"
                                        :label="v.codeName" :value="v.codeValue">
                                    </el-option>
                                </el-select>
                            </td>
                            <!-- 未税单价（元） -->
                            <td><el-input v-model="item.fee" v-mydouble5val maxlength="19" @input="calcFee(item,'fee')"></el-input></td>
                            <!-- 增值税（%） -->
                            <td><el-input v-model="item.taxRate" v-mydouble5val maxlength="19" @input="calcFee(item,'taxRate')"></el-input></td>
                            <!-- 价税合计（元） -->
                            <td><el-input v-model="item.feeWithTax" v-mydouble5val maxlength="19" @input="calcFee(item,'feeWithTax')"></el-input></td>
                            <td><el-input v-model="item.remark"></el-input></td>
                            <td>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                    <span @click="delFee(routeItem.details,idx)" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        
        </vuedraggable>
        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import addQuoteSheet from "./addQuoteSheet.js";
export default addQuoteSheet;
</script>
<style src="./quoteSheet.scss" lang="scss" scoped></style>
