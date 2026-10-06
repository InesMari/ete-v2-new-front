<template>
  <div id="addQuoteSheet" class="quoteSheetPage">
    <div class="common-info clearfix">
        <div v-show="step==1 || step==3">
            <h3>基本信息
              <span class="quoteTime fr" style="font-size:12px;">报价时间：
                <el-date-picker v-model="info.baseInfo.quoteDate"  value-format="yyyy-MM-dd"
                                type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
              </span>
            </h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>客户</td>
                    <td class="value" colspan="2">
                        <el-select v-model="info.baseInfo.custTenantId" @change="changeCustomer" clearable filterable placeholder="选择客户">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>仓库</td>
                    <td class="value">
                        <el-select v-model="info.baseInfo.workStoreId" @change="changeWorker" placeholder="请选择物流中心" filterable clearable>
                            <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算主体</td>
                    <td class="value">
                        <el-select v-model="info.baseInfo.settleBody" placeholder="结算主体" filterable clearable>
                            <el-option v-for="item in payTitle" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                            </el-option>
                        </el-select>
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
                        <el-input v-model="info.baseInfo.ourLinkman" placeholder="报价人"></el-input>
                    </td>
                    <td class="label">联系方式</td>
                    <td class="value">
                        <el-input v-model="info.baseInfo.ourBillId" placeholder="联系方式"></el-input>
                    </td>
                    <td class="label">电子邮件</td>
                    <td class="value">
                        <el-input v-model="info.baseInfo.ourEmail" placeholder="电子邮件    "></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="6">
                        <el-input type="textarea" v-model="info.baseInfo.remark" placeholder="备注"></el-input>
                    </td>
                </tr>
            </table>
            <div class="tableItem">
                <h3>
                  <el-checkbox v-model="firstTableItem.display" :true-label="1" :false-label="0" :checked="firstTableItem.display=='1'" @change="forceUpdate">1、{{firstTableItem.title}}</el-checkbox>
                  <span v-if="firstTableItem.codeId==1"><em style="margin-left:10px;">租赁面积数量计算 = 租赁面积/托面积*(1-公摊%）</em></span>
                </h3>
                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-for="(item,index) in firstTableItem0" v-show="firstTableItem.display=='1'" style="margin-bottom:10px;">
                    <thead>
                        <tr>
                            <th width="30">
                                <el-checkbox v-model="item.display" :true-label="1" :false-label="0" :checked="item.display=='1'" @change="firstTableItemChange"></el-checkbox>
                            </th>
                            <th width="110">计费类型</th>
                            <th width="80">存放条件</th>
                            <th width="110">计费单位</th>
                            <th width="80">未税单价</th>
                            <th width="80">税率(%)</th>
                            <th width="80">价税合计</th>
                            <th width="80">公摊(%)</th>
                            <th width="80">租赁面积</th>
                            <th width="80">计费面积</th>
                            <th width="200">备注</th>
                            <th width="60">
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="index==firstTableItem0.length-1">
                                    <span @click="addFirstTableItem0" class="add" style="margin-right:5px;"></span>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="firstTableItem0.length>1">
                                    <span @click="delFirstTableItem0(index)" class="del"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>{{item.itemName}}</td>
                            <td>
                                <el-select v-model="item.storageCondition" @change="forceUpdate()" placeholder="请选择存放条件" filterable clearable>
                                    <el-option v-for="item in conditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                    </el-option>
                                </el-select>
                            </td>
                            <td>{{item.unit}}</td>
                            <td>
                                <el-input v-model="item.price" v-mydoubleval @input="forceUpdate()" @blur="calcFee(item,'price')"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.tax" v-mydoubleval @input="forceUpdate()"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.priceWithTax" v-mydoubleval @input="forceUpdate()" @blur="calcFee(item,'priceWithTax')"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.shareRate" v-mydoubleval @input="forceUpdate()"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.leaseArea" v-mydoubleval @input="leaseAreaIpt(item);"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.chargeArea" v-mydoubleval @input="chargeAreaIpt(item);"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.remark" @input="forceUpdate()"></el-input>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;" v-for="(item,index) in firstTableItem1" v-show="firstTableItem.display=='1'" >
                    <thead>
                        <tr>
                            <th width="30">
                                <el-checkbox v-model="item.display" :true-label="1" :false-label="0" :checked="item.display=='1'" @change="firstTableItemChange"></el-checkbox>
                            </th>
                            <th width="110">计费类型</th>
                            <th width="110">存放条件</th>
                            <th width="110">计费单位</th>
                            <th width="110">未税单价</th>
                            <th width="110">税率(%)</th>
                            <th width="110">价税合计</th>
                            <th width="110">取数规则</th>
                            <th width="220">备注</th>
                            <th width="60">
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="index==firstTableItem1.length-1">
                                    <span @click="addFirstTableItem1" class="add" style="margin-right:5px;"></span>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="firstTableItem1.length>1">
                                    <span @click="delFirstTableItem1(index)" class="del"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>{{item.itemName}}</td>
                            <td>
                                <el-select v-model="item.storageCondition" placeholder="请选择存放条件" filterable clearable>
                                    <el-option v-for="item in conditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.unit" placeholder="请选择价格单位" filterable clearable>
                                    <el-option v-for="item in unitList2" :key="item.codeId" :label="item.codeName" :value="item.codeName" >
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.price" v-mydoubleval @input="forceUpdate()" @blur="calcFee(item,'price')"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.tax" v-mydoubleval @input="forceUpdate()"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.priceWithTax" v-mydoubleval @input="forceUpdate()" @blur="calcFee(item,'priceWithTax')"></el-input>
                            </td>
                            <td>
                                <el-select v-model="item.countRule" placeholder="请选择" filterable clearable @change="changeCountRule(item)">
                                    <el-option v-for="item in countRuleList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.remark" @input="forceUpdate()"></el-input>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-show="step==1">
            <vuedraggable v-model="info.details">
                <div class="tableItem" v-for="(tableItem,index) in info.details" :key="tableItem.codeId" v-show="tableItem.codeId!=1">
                    <h3>
                        <el-checkbox v-model="tableItem.display" :true-label="1" :false-label="0" :checked="tableItem.display=='1'" @change="forceUpdate" v-if="tableItem.codeId!=1">{{index+1}}、{{tableItem.title}}（<em>提示：鼠标拉动此标题表格记录，可变更前后顺序</em>）</el-checkbox>
                        <span v-if="tableItem.codeId==1">{{index+1}}、{{tableItem.title}}（<em>提示：鼠标拉动表格标题或内容，可变更前后顺序</em>）</span>
                        <el-button size="mini" v-if="tableItem.codeId==11" v-show="tableItem.display=='1'" style="margin-top:6px;" @click="mergeFee(tableItem)">合并明细</el-button>
                        <el-button class="fr" size="mini" v-if="tableItem.codeId!=1&&tableItem.codeId!=2" v-show="tableItem.display=='1'" style="margin-top:6px;" @click="operation(tableItem,tableItem.codeId)">操作</el-button>
                    </h3>
                    <table :ref="'simpleTable' + tableItem.codeId" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="tableItem.display=='1'">
                        <thead class="dragDisable">
                            <tr>
                                <th :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106)">{{hd.name}}</th>
                                <th width="50" v-if="tableItem.codeId!=1">
                                    <el-tooltip v-if="tableItem.codeId==2" effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                        <span @click="addFee(tableItem)" class="add"></span>
                                    </el-tooltip>
                                </th>
                            </tr>
                        </thead>
                        <vuedraggable element="tbody" v-model="tableItem.items" draggable=".item">
                            <tr v-for="(item,idx) in tableItem.items" :key="idx" :class="item.merge==1?'hover':'item'">                                
                                <td :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106)">
                                    <!-- 未税单价、价税合计 -->
                                    <el-input v-model="item[hd.code]" v-if="hd.type == 'input'" v-mydoubleval @blur="calcFee(item,hd.code)" @input="forceUpdate()"></el-input>
                                    <!-- 价格单位 -->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && !(tableItem.codeId==1 && idx==0)&&!(tableItem.codeId==107&&item.feeType!=4)&&tableItem.codeId!=106" @change="unitChange(item,tableItem.codeId)" :disabled="tableItem.codeId==106||(tableItem.codeId==107&&item.feeType==4)" placeholder="请选择价格单位" filterable clearable>
                                        <el-option v-for="item in unitList" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                        </el-option>
                                    </el-select>
                                    <!-- 价格单位 器具租售-->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && (tableItem.codeId==107&&item.feeType!=4&&item.feeType!=6)" placeholder="请选择价格单位" filterable clearable>
                                        <el-option v-for="item in unitList3" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                        </el-option>
                                    </el-select>
                                    <!-- 价格单位 器具租售-->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && (tableItem.codeId==107&&item.feeType==6)" placeholder="请选择价格单位" filterable clearable>
                                      <el-option v-for="item in unitList4" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                      </el-option>
                                    </el-select>
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && tableItem.codeId==106" placeholder="请选择价格单位" filterable clearable>
                                      <el-option v-for="item in unitList5" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                      </el-option>
                                    </el-select>
                                    <!-- 起始地（配送服务专属） -->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'beginWork'" placeholder="请选择起始地" :disabled="true">
                                      <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                                      </el-option>
                                    </el-select>
                                    <!-- 目的地（配送服务专属） -->
                                    <el-select v-model="item[hd.code]" collapse-tags :multiple="true" v-else-if="hd.type == 'endWork'" placeholder="请选择目的地" @change="endWorkSel(item,tableItem.codeId)" filterable clearable>
                                      <el-option v-for="item in endWork" :key="item.workId" :label="item.workName" :value="item.workId" >
                                      </el-option>
                                    </el-select>
                                    <!-- 报价车型（配送服务专属） -->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'quoteVehicleType'" placeholder="车型" @change="vehicleTypeSel(item,tableItem.codeId)" :disabled="item.unit!='元/车次'" filterable clearable>
                                      <el-option v-for="item in vehicleTypeQuote" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                      </el-option>
                                    </el-select>
                                    <!-- 报价车长（配送服务专属） -->
                                    <el-select v-model="item[hd.code]" v-else-if="hd.type == 'vehicleLength'" placeholder="车长" @change="vehicleLengthSel(item,tableItem.codeId)" :disabled="item.unit!='元/车次'" filterable clearable>
                                      <el-option v-for="item in vehicleLength" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                      </el-option>
                                    </el-select>
                                    <!-- 起始地（器具回收专属，使用目的地数据） -->
                                    <el-select v-model="item[hd.code]" :multiple="true" v-else-if="hd.type == 'endWork'" placeholder="请选择目的地" @change="endWorkSel(item)" filterable clearable>
                                      <el-option v-for="item in endWork" :key="item.workId" :label="item.workName" :value="item.workId" >
                                      </el-option>
                                    </el-select>
                                    <!-- 仓储租赁 - 备注, 长途运输 - 备注 -->
                                    <el-input v-model="item[hd.code]" v-else-if="hd.type == 'inputText'" @input="forceUpdate()"></el-input>
                                    <!-- 仓储租赁 - 增值税， 长途运输 - 增值税 -->
                                    <el-input v-model="item[hd.code]" v-else-if="hd.code=='tax' && (tableItem.codeId == 1 || tableItem.codeId == 2)" v-mydoubleval @blur="calcFee(item,hd.code)" @input="forceUpdate()"></el-input>
                                    <!-- 长途运输 - 费用项目 -->
                                    <el-input v-model="item[hd.code]" v-else-if="hd.code=='itemName' && tableItem.codeId == 2" @input="forceUpdate()"></el-input>
                                    <span v-else>{{item[hd.code]}}</span>
                                </td>
                                <td width="50" v-if="tableItem.codeId!=1">
                                    <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                        <span @click="delFee(tableItem.items,item,idx)" class="del"></span>
                                    </el-tooltip>
                                </td>
                            </tr>
                        </vuedraggable>
                    </table>
                </div>
            </vuedraggable>
        </div>
        <!-- 重组合并start -->
        <div class="mergePage" v-show="step==2">
            <div><em class="fw">说明：下方费用项目可通过鼠标拖动变更位置！重组的费用项目明细，其计费单位及增值税率需一致！</em></div>
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th :width="hd.width" v-for="(hd,index) in head2" :key="index">{{hd.name}}</th>
                    </tr>
                </thead>
                <vuedraggable element="tbody" v-model="mergeList" group="merge" draggable=".item" @end="updateMerge">
                    <tr v-for="(item,idx) in mergeList" :key="idx" class="item">
                        <td :width="hd.width" v-for="(hd,index) in head2" :key="index" :title="item[hd.code]">{{item[hd.code]}}</td>
                    </tr>
                </vuedraggable>
            </table>

            <div class="mergeView mt_20" v-for="(merges,index) in mergeArr">
                <div class="mergeTitle">
                    <span class="fw">{{index+1}}、</span>
                    <el-input v-model="merges.titleName" placeholder="重组标题名称" style="width:200px;"></el-input>
                    <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="mergeArr.length-1==index">
                        <span @click="addMerge" class="add" style="margin-right:8px;"></span>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="mergeArr.length>1">
                        <span @click="delMerge(mergeArr,index,merges.rebuildType)" class="del"></span>
                    </el-tooltip>
                    <div style="display:inline-block;margin-left:20px;">
                        <el-radio v-for="item in rebuildTypeList" v-model="merges.rebuildType" @change="changeRebuildType(merges)" :label="item.codeValue">{{item.codeName}}</el-radio>
                    </div>
                </div>
                <div class="tableFlex" v-for="(merge,index) in merges.merge" style="margin-bottom:10px;">
                    <table style="flex:1;" ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th :width="hd.width" v-for="(hd,index) in head2" :key="index">{{hd.name}}</th>
                            </tr>
                        </thead>
                        <vuedraggable element="tbody" v-model="merge.items" group="merge" draggable=".draggable" @end="updateMerge">
                            <tr v-for="(item,idx) in merge.items" :key="idx" :class="{'item':idx>0&&merges.rebuildType==1,'draggable':merges.rebuildType==2||idx>0}">
                                <td :width="hd.width" v-for="hd in head2">
                                    <el-input v-model="item[hd.code]" v-if="idx==0 && (hd.code=='itemName'||hd.code=='remark') && merges.rebuildType==1" placeholder="请输入" @input="forceUpdate()"></el-input>
                                    <span v-else-if="hd.code == 'price'">{{item[hd.code] | emptyToZero}}</span>
                                    <span v-else>{{item[hd.code] | emptyToStr}}</span>
                                </td>
                            </tr>
                        </vuedraggable>
                    </table>
                    <table style="border-left:0;" ref="simpleTable" class="tableCommon" width="60" border="0" cellspacing="0" cellpadding="0" v-if="merges.rebuildType==1">
                        <thead>
                            <tr>
                                <th width="40">
                                    <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="merges.merge.length-1==index">
                                        <span @click="addMergeItem(merges.merge,merges.rebuildType)" class="add" style="margin-right:5px;"></span>
                                    </el-tooltip>
                                    <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="merges.merge.length>1">
                                        <span @click="delMergeItem(merges.merge,index,merges.rebuildType)" class="del"></span>
                                    </el-tooltip>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in merge.items" :key="idx">
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
        <!-- 重组合并end -->
        <!-- 预览start -->
        <div v-show="step==3">
            <!-- 合并 -->
            <div class="tableItem" v-for="(tableItem,index) in rebuildDetails" :key="tableItem.codeId">
                <h3>
                    <span>{{index+2}}、{{tableItem.titleName}}</span>
                </h3>
                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th :width="hd.width" v-for="(hd,index) in head2" :key="index">{{hd.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,idx) in tableItem.items" :key="idx">
                            <td :width="hd.width" v-for="(hd,index) in head2" :key="index">
                                <span>{{item[hd.code]}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 预览end -->
        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button @click="toNext" v-show="step == 1">报价合并重组</el-button>
            <el-button @click="toPre" v-show="step == 2">上一步</el-button>
            <el-button @click="toView" v-show="step == 2">预览</el-button>
            <el-button @click="cancelView" v-show="step == 3">取消预览</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
        </div>
    </div>
    <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="80%" >
        <div class="filterView" @keydown.enter="filterTableData">
            <el-input v-model="feeItem.filterText" size="small" placeholder="筛选费用项目"></el-input>
            <el-select v-model="feeItem.subItemType" size="small" @change="filterTableData" placeholder="请选择费用子类型" filterable clearable v-if="currentCodeId!='106'&&currentCodeId!='107'">
                <el-option v-for="item in subItemTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                </el-option>
            </el-select>
            <el-select v-model="feeItem.subItemType" size="small" @change="filterTableData" placeholder="请选择费用子类型" filterable clearable v-if="currentCodeId=='106'||currentCodeId=='107'">
                <el-option v-for="item in subItemTypeData" :key="item.sortId" :label="item.codeName" :value="item.sortId">
                </el-option>
            </el-select>
            <el-select v-model="feeItem.specsType" size="small" @change="filterTableData" placeholder="请选择规格类型" filterable clearable v-if="currentCodeId!='106'&&currentCodeId!='107'">
                <el-option v-for="item in specsTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                </el-option>
            </el-select>
            <el-select v-model="feeItem.feeType" size="small" @change="filterTableData" placeholder="请选择费用类型" filterable clearable v-if="currentCodeId=='106'||currentCodeId=='107'">
                <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                </el-option>
            </el-select>
            <el-select v-model="feeItem.deviceId" size="small" @change="filterTableData" placeholder="请选择器具" filterable clearable v-if="currentCodeId=='107'">
                <el-option v-for="item in deviceData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-button type="danger" size="small " @click="clearFilter">清空</el-button>
            <el-button type="primary" size="small " @click="filterTableData">筛选</el-button>
        </div>
        <div class="title">
            <div>不展示项目</div>
            <div>展示项目</div>
        </div>
        <dbTable tableName="addQuoteLDTable" ref="table" :head="operateHead" onlyId="itemId" @dataChange="tableDataChange" :noOnly="selectNoOnly"></dbTable>
        <div class="bot-btn">
            <el-button @click="isShowDialog = false">取消</el-button>
            <el-button type="primary" @click="saveChange">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog class="operateDialog" title="合并明细" :visible.sync="isShowMergeDialog" width="1000px" >
        <div style="line-height:40px;text-align: right;">
            <span>合计未税价：<em class="fw">{{priceTotal}}</em></span>
            <span style="margin-left:20px">合计含税价：<em class="fw">{{priceWithTaxTotal}}</em></span> 
        </div>
        <dbTable tableName="addQuoteMergeTable" ref="mergeTable" :head="operateHead" onlyId="itemId" @dataChange="mergeTableDataChange"></dbTable>
        <div class="bot-btn">
            <el-button @click="isShowMergeDialog = false">取消</el-button>
            <el-button type="primary" @click="saveMerge">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import addQuoteSheet from "./addQuoteSheet.js";
export default addQuoteSheet;
</script>
<style src="./quoteSheet.scss" lang="scss" scoped></style>
