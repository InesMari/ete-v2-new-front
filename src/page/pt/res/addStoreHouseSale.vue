<template>
  <div id="addStoreHouseSale" class="storeHouseSalePage quoteSheetPage">
    <div class="common-info clearfix">
        <h3>1、基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>客户： </td>
                <td class="value">
                    <el-select v-model="info.baseInfo.custTenantId" @change="changeCustomer" clearable filterable placeholder="选择客户" :disabled="$route.query.id?true:false">
                        <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                    </el-select>
                </td>
                <td class="label">报价单： </td>
                <td class="value">
                    <el-select :disabled="edit" v-model="info.baseInfo.quoteId" @change="changeQuote"  placeholder="请选择报价单" filterable clearable>
                        <el-option v-for="item in quoteSheets" :key="item.quoteId" :label="item.quoteNum" :value="item.quoteId" >
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td class="label">仓库名称：</td>
                <td class="value disabled" v-show="hasOrder">{{info.baseInfo.workName}}</td>
                <td class="value" v-show="!hasOrder">
                    <el-select v-model="info.baseInfo.workStoreId" @change="changeWorker" placeholder="请选择物流中心" filterable clearable>
                        <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                        </el-option>
                    </el-select>
                </td>
                <td class="label"><em>*</em>结算类型</td>
                <td class="value">
<!--                  <span style="padding:0 15px;">{{ settleType[0].codeName }}</span>-->
                  <span style="padding:0 15px;">普通结算</span>
                </td>
            </tr>
            <tr>
                <td class="label">租赁面积：</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.leaseAreaTotal" v-mydoubleval maxlength="11"
                              @input="leaseAreaIptSale(info.baseInfo)" placeholder="若租赁面积为0，将自动选择【按件仓储计费】"></el-input>
                </td>
                <td class="label"><em>*</em>租赁类型：
                    <el-tooltip effect="dark" content="只有客户类型为“外部”，才可新建其对应的仓储月收入！" placement="top" style="position: relative;left: -6px;top: -5px;">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </td>
                <td class="value">
                    <el-select v-model="info.baseInfo.leaseType" placeholder="请选择租赁类型" filterable clearable>
                        <el-option v-for="item in leaseTypeList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                        </el-option>
                    </el-select>
                </td>
            </tr>
          <tr>
            <td class="label">加收公摊%：</td>
            <td class="value">
              <el-input v-model="info.baseInfo.shareRate" v-mydoubleval maxlength="11"
                        @input="changeLeaseArea" placeholder="加收公摊，单位%"></el-input>
            </td>
            <td class="label">计费面积：</td>
            <td class="value">
              <el-input v-model="info.baseInfo.chargeArea" v-mydoubleval maxlength="11"
                                                            @input="chargeAreaIptSale(info.baseInfo)" placeholder="计费面积"></el-input>
            </td>
          </tr>
            <tr>
                <td class="label">最大流量：</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.maxPalletNums" placeholder="请输入"></el-input>
                </td>
                <td class="label">税率%：</td>
                <td class="value">
                    <el-input v-model="info.baseInfo.taxRate" placeholder="请输入"></el-input>
                </td>
            </tr>
            <tr>
              <td class="label"><em>*</em>存放条件：
                <el-tooltip effect="dark" content="存在多种存放条件的报价，每一种都要生成一个合同" placement="top" style="position: relative;left: -6px;top: -5px;">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </td>
              <td class="value">
                <el-select v-if="hasOrder" v-model="info.baseInfo.storageCondition" placeholder="请选择存放条件" filterable @change="setBaseinfo">
                  <el-option v-for="item in storageConditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
                <el-select v-if="!hasOrder" v-model="info.baseInfo.storageCondition" placeholder="请选择存放条件" filterable>
                  <el-option v-for="item in allStorageConditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </td>
              <td class="label">合同编号： </td>
              <td class="value">
                <el-select v-model="info.baseInfo.contractId" placeholder="合同编号" filterable @change="changeContract">
                  <el-option v-for="item in contractList" :key="item.id" :label="item.contractNum"
                            :value="item.id">
                    <span style="float: left">{{ item.contractNum }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.contractName }}</span>
                  </el-option>
                </el-select>
              </td>
            </tr>
          <tr>
            <td class="label"><em>*</em>租赁日期从：</td>
            <td class="value">
              <el-date-picker
                  v-model="info.baseInfo.leaseBeginDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择日期"
              ></el-date-picker>
            </td>
            <td class="label"><em>*</em>至：</td>
            <td class="value">
              <el-date-picker
                  v-model="info.baseInfo.leaseEndDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择日期"
              ></el-date-picker>
            </td>
          </tr>
        </table>
          
        <div v-if="hasOrder">
          <div class="tableItem" v-for="(tableItem,index) in info.details" :key="tableItem.codeId">
              <h3>{{index+2}}、{{tableItem.title}}</h3>
              <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                      <tr>
                          <th width="140">费用项目</th>
                          <th width="100" v-if="tableItem.codeId==107">器具名称</th>
                          <th width="80">价格单位</th>
                          <th width="100" v-if="tableItem.codeId==104||tableItem.codeId==106">起始地</th>
                          <th width="100" v-if="tableItem.codeId==104">目的地</th>
                          <th width="70" v-if="tableItem.codeId==104">报价车型</th>
                          <th width="60" v-if="tableItem.codeId==104">报价车长</th>
                          <th width="60">未税单价</th>
                          <th width="60">增值税</th>
                          <th width="60">含税单价</th>
                          <th width="60" v-if="tableItem.codeId==107">数量</th>
                          <th width="60" v-if="tableItem.codeId==107">含税金额</th>
                          <th width="70" v-if="tableItem.codeId==1">未税月租费用</th>
                          <th width="70" v-if="tableItem.codeId==1">含税月租费用</th>
                          <th width="200">备注</th>
                          <th v-if="tableItem.codeId!=1" width="110">计费节点</th>
                          <th v-if="tableItem.codeId!=1" width="80">是否默认</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item,idx) in tableItem.items" :key="idx">
                        <td><span>{{item.itemName}}</span></td>
                        <td v-if="tableItem.codeId==107"><span>{{item.deviceName}}</span></td>
                        <td><span>{{item.unit}}</span></td>
                        <td v-if="tableItem.codeId==104"><span>{{item.beginWorkName}}</span></td>
                        <td v-if="tableItem.codeId==104||tableItem.codeId==106"><span>{{item.endWorkName}}</span></td>
                        <td v-if="tableItem.codeId==104"><span>{{item.quoteVehicleTypeName}}</span></td>
                        <td v-if="tableItem.codeId==104"><span>{{item.vehicleLengthName}}</span></td>
                        <td><span>{{item.price}}</span></td>
                        <td><span>{{item.tax}}</span></td>
                        <td><span>{{item.priceWithTax}}</span></td>
                        <td v-if="tableItem.codeId==107">
                          <el-input v-model="item.nums" placeholder="请输入数量" @input="forceUpdate" @change="changeNums(item)"></el-input>
                        </td>
                        <td v-if="tableItem.codeId==107"><span>{{item.totalPriceWithTax}}</span></td>
                        <td v-if="tableItem.codeId==1">
                          <span v-if="item.itemCode=='monthFee'">{{info.baseInfo.leaseFeeAreaNoTax}}</span>
                          <span v-else>-</span>
                        </td>
                        <td v-if="tableItem.codeId==1">
                          <span v-if="item.itemCode=='monthFee'">{{info.baseInfo.leaseFeeArea}}</span>
                          <span v-else>-</span>
                        </td>
                        <td><span>{{item.remark}}</span></td>
                        <td width="150" v-if="tableItem.codeId!=1">
                          <el-select v-model="item.relOperation" placeholder="请选择" multiple collapse-tags :multiple-limit="1" v-if="tableItem.codeId!=107||(tableItem.codeId==107&&item.unit=='元/个/次')">
                            <el-option v-for="item in relOperationList" :key="item.codeId" :label="item.codeName" :value="item.codeId" >
                            </el-option>
                          </el-select>
                        </td>
                        <td v-if="tableItem.codeId!=1" width="80">
                          <el-switch v-model="item.isDefault" v-if="tableItem.codeId!=107||(tableItem.codeId==107&&item.unit=='元/个/次')"
                                    @change="changeSwitch(item)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value="1"
                                     :inactive-value="0">
                          </el-switch>
                        </td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>
        <div v-if="!hasOrder">
          <div class="tableItem">
              <h3>
                <el-checkbox v-model="firstTableItem.display" :true-label="1" :false-label="0" :checked="firstTableItem.display=='1'" @change="forceUpdate">1、{{firstTableItem.title}}</el-checkbox>
                <span v-if="firstTableItem.codeId==1"><em style="margin-left:10px;">租赁面积数量计算 = 租赁面积/托面积*(1-公摊%）</em></span>
              </h3>
              <div style="overflow-x: auto;">
              <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-for="(item,index) in firstTableItem0" v-show="firstTableItem.display=='1'" style="margin-bottom:10px;">
                  <thead>
                      <tr>
                          <th width="30">
                              <el-checkbox v-model="item.display" :true-label="1" :false-label="0" :checked="item.display=='1'" @change="firstTableItemChange"></el-checkbox>
                          </th>
                          <th width="110">计费类型</th>
                          <!-- <th width="80">存放条件</th> -->
                          <th width="110">计费单位</th>
                          <th width="80">未税单价</th>
                          <th width="80">税率(%)</th>
                          <th width="80">价税合计</th>
                          <th width="70">未税月租费用</th>
                          <th width="70">含税月租费用</th>
                          <!-- <th width="80">公摊(%)</th>
                          <th width="80">租赁面积</th>
                          <th width="80">计费面积</th> -->
                          <th width="200">备注</th>
                          <!-- <th width="60">
                              <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="index==firstTableItem0.length-1">
                                  <span @click="addFirstTableItem0" class="add" style="margin-right:5px;"></span>
                              </el-tooltip>
                              <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="firstTableItem0.length>1">
                                  <span @click="delFirstTableItem0(index)" class="del"></span>
                              </el-tooltip>
                          </th> -->
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td></td>
                          <td>{{item.itemName}}</td>
                          <!-- <td>
                              <el-select v-model="item.storageCondition" @change="forceUpdate()" placeholder="请选择存放条件" filterable clearable>
                                  <el-option v-for="item in conditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                  </el-option>
                              </el-select>
                          </td> -->
                          <td>{{item.unit}}</td>
                          <td>
                              <el-input v-model="item.price" v-mydoubleval @input="setBaseInfoForMonthFee(item)" @blur="calcFee(item,'price')"></el-input>
                          </td>
                          <td>
                              <el-input v-model="item.tax" v-mydoubleval @input="setBaseInfoForMonthFee(item)"></el-input>
                          </td>
                          <td>
                              <el-input v-model="item.priceWithTax" v-mydoubleval @input="setBaseInfoForMonthFee(item)" @blur="calcFee(item,'priceWithTax')"></el-input>
                          </td>
                          <!-- <td>
                              <el-input v-model="item.shareRate" v-mydoubleval @input="forceUpdate()"></el-input>
                          </td>
                          <td>
                              <el-input v-model="item.leaseArea" v-mydoubleval @input="leaseAreaIpt(item);"></el-input>
                          </td>
                          <td>
                              <el-input v-model="item.chargeArea" v-mydoubleval @input="chargeAreaIpt(item);"></el-input>
                          </td> -->
                          <td>
                            <span>{{info.baseInfo.leaseFeeAreaNoTax}}</span>
                          </td>
                          <td >
                            <span>{{info.baseInfo.leaseFeeArea}}</span>
                          </td>
                          <td>
                              <el-input v-model="item.remark" @input="forceUpdate()"></el-input>
                          </td>
                          <!-- <td></td> -->
                      </tr>
                  </tbody>
              </table>
              </div>
              <div style="overflow-x: auto;">
              <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;" v-for="(item,index) in firstTableItem1" v-show="firstTableItem.display=='1'">
                  <thead>
                      <tr>
                          <th width="30">
                              <el-checkbox v-model="item.display" :true-label="1" :false-label="0" :checked="item.display=='1'" @change="firstTableItemChange"></el-checkbox>
                          </th>
                          <th width="110">计费类型</th>
                          <!-- <th width="110">存放条件</th> -->
                          <th width="110">计费单位</th>
                          <th width="110">未税单价</th>
                          <th width="110">税率(%)</th>
                          <th width="110">价税合计</th>
                          <th width="110">取数规则</th>
                          <th width="220">备注</th>
                          <!-- <th width="60">
                              <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="index==firstTableItem1.length-1">
                                  <span @click="addFirstTableItem1" class="add" style="margin-right:5px;"></span>
                              </el-tooltip>
                              <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="firstTableItem1.length>1">
                                  <span @click="delFirstTableItem1(index)" class="del"></span>
                              </el-tooltip>
                          </th> -->
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td></td>
                          <td>{{item.itemName}}</td>
                          <!-- <td>
                              <el-select v-model="item.storageCondition" placeholder="请选择存放条件" filterable clearable>
                                  <el-option v-for="item in conditionList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                  </el-option>
                              </el-select>
                          </td> -->
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
                              <el-select v-model="item.countRule" placeholder="请选择" filterable clearable @change="forceUpdate()">
                                  <el-option v-for="item in countRuleList" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                                  </el-option>
                              </el-select>
                          </td>
                          <td>
                              <el-input v-model="item.remark" @input="forceUpdate()"></el-input>
                          </td>
                          <!-- <td></td> -->
                      </tr>
                  </tbody>
              </table>
              </div>
          </div>
          <vuedraggable v-model="info.details">
              <div class="tableItem" v-for="(tableItem,index) in info.details" :key="tableItem.codeId" v-show="tableItem.codeId!=1">
                  <h3>
                      <el-checkbox v-model="tableItem.display" :true-label="1" :false-label="0" :checked="tableItem.display=='1'" @change="forceUpdate" v-if="tableItem.codeId!=1">{{index+1}}、{{tableItem.title}}（<em>提示：鼠标拉动此标题表格记录，可变更前后顺序</em>）</el-checkbox>
                      <span v-if="tableItem.codeId==1">{{index+1}}、{{tableItem.title}}（<em>提示：鼠标拉动表格标题或内容，可变更前后顺序</em>）</span>
                      <el-button size="mini" v-if="tableItem.codeId==11" v-show="tableItem.display=='1'" style="margin-top:6px;" @click="mergeFee(tableItem)">合并明细</el-button>
                      <el-button class="fr" size="mini" v-if="tableItem.codeId!=1&&tableItem.codeId!=2" v-show="tableItem.display=='1'" style="margin-top:6px;" @click="operation(tableItem,tableItem.codeId)">操作</el-button>
                  </h3>
                  <div style="overflow-x: auto;">
                  <table :ref="'simpleTable' + tableItem.codeId" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="tableItem.display=='1'">
                      <thead class="dragDisable">
                          <tr>
                              <th :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106) || (hd.parent == 'zusou' && tableItem.codeId==107)">{{hd.name}}</th>
                              <th width="50" v-if="tableItem.codeId!=1">
                                  <el-tooltip v-if="tableItem.codeId==2" effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                      <span @click="addFee(tableItem)" class="add"></span>
                                  </el-tooltip>
                              </th>
                          </tr>
                      </thead>
                      <vuedraggable element="tbody" v-model="tableItem.items" draggable=".item">
                          <tr v-for="(item,idx) in tableItem.items" :key="idx" :class="item.merge==1?'hover':'item'">                                
                              <td :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106) || (hd.parent == 'zusou' && tableItem.codeId==107)">
                                  <!-- 未税单价、价税合计 -->
                                  <el-input v-model="item[hd.code]" v-if="hd.type == 'input'" v-mydoubleval @blur="calcFee(item,hd.code)" @input="forceUpdate()"></el-input>
                                  <!-- 价格单位 -->
                                  <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && !(tableItem.codeId==1 && idx==0)&&!(tableItem.codeId==107&&item.feeType!=4)&&tableItem.codeId!=106" @change="unitChange(item,tableItem.codeId)" :disabled="tableItem.codeId==106||(tableItem.codeId==107&&item.feeType==4)" placeholder="请选择价格单位" filterable clearable>
                                      <el-option v-for="item in unitList" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                      </el-option>
                                  </el-select>
                                  <!-- 价格单位 器具租售-->
                                  <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && (tableItem.codeId==107&&item.feeType!=4&&item.feeType!=6)" placeholder="请选择价格单位" filterable clearable @change="unitChange2(item,tableItem.codeId)">
                                      <el-option v-for="item in unitList3" :key="item.codeName" :label="item.codeName" :value="item.codeName" >
                                      </el-option>
                                  </el-select>
                                  <!-- 价格单位 器具租售-->
                                  <el-select v-model="item[hd.code]" v-else-if="hd.type == 'select' && (tableItem.codeId==107&&item.feeType==6)" placeholder="请选择价格单位" filterable clearable @change="unitChange2(item,tableItem.codeId)">
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
                                  <!-- 数量 -->
                                  <el-input v-model="item[hd.code]" placeholder="请输入" @input="forceUpdate" v-else-if="hd.code=='nums' && tableItem.codeId == 107" @change="changeNums(item)"></el-input>
                                  <!-- 含税金额 -->
                                  <span v-else-if="hd.code=='totalPriceWithTax' && tableItem.codeId == 107">{{ item.totalPriceWithTax }}</span>
                                  <!-- 计费节点 -->
                                  <el-select v-model="item[hd.code]" @change="forceUpdate" :multiple-limit="1" :multiple="true" placeholder="请选择" collapse-tags v-else-if="hd.type == 'relOperation' && tableItem.codeId!=107 || (hd.type == 'relOperation' && tableItem.codeId==107 && item.unit=='元/个/次')">
                                    <el-option v-for="item in relOperationList" :key="item.codeId" :label="item.codeName" :value="item.codeId" >
                                    </el-option>
                                  </el-select>
                                  <!-- 是否默认 -->
                                  <el-switch v-model="item[hd.code]" v-else-if="hd.type == 'isDefault' && tableItem.codeId!=107 || (hd.type == 'isDefault'&&tableItem.codeId==107&&item.unit=='元/个/次')"
                                            @change="changeSwitch(item)"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否"
                                            :active-value="1"
                                            :inactive-value="0">
                                  </el-switch>
                                  <span v-else-if="hd.type == 'isDefault' && tableItem.codeId!=107 || (hd.type == 'isDefault'&&tableItem.codeId==107&&item.unit!='元/个/次')"></span>
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
              </div>
          </vuedraggable>
        </div>        
        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
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
import addStoreHouseSale from "./addStoreHouseSale.js";
export default addStoreHouseSale;
</script>
<style src="./storeHouseSale.scss" lang="scss" scoped></style>
<style src="../wms/quoteSheet/quoteSheet.scss" lang="scss" scoped></style>