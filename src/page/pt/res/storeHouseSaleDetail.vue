<template>
  <div id="storeHouseSaleDetail" class="storeHouseSalePage">
    <div class="common-info clearfix">
        <h3>1、基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>客户</td>
                <td class="value disabled">
                    {{info.baseInfo.custName}}
                </td>
                <td class="label">报价单： </td>
                <td class="value disabled">
                    {{info.baseInfo.quoteNum}}
                </td>
            </tr>
            <tr>
                <td class="label">仓库名称：</td>
                <td class="value disabled">{{info.baseInfo.workName}}</td>
                <td class="label">结算类型：</td>
                <td class="value disabled">{{info.baseInfo.settleTypeName}}</td>
            </tr>
            <tr>
                <td class="label">租赁面积：</td>
                <td class="value">
                    <el-input :disabled="true" v-model="info.baseInfo.leaseAreaTotal" placeholder="若租赁面积为0，将自动选择【按件仓储计费】"></el-input>
                </td>
                <td class="label"><em>*</em>租赁类型：</td>
                <td class="value">
                    <el-select v-model="info.baseInfo.leaseType" placeholder="请选择报租赁类型" filterable clearable :disabled="true">
                        <el-option v-for="item in leaseTypeList" :key="item.codeId" :label="item.codeName" :value="item.codeId">
                        </el-option>
                    </el-select>
                </td>
            </tr>
          <tr>
            <td class="label">加收公摊%：</td>
            <td class="value disabled">{{info.baseInfo.shareRate}}</td>
            <td class="label">计费面积：</td>
            <td class="value disabled">{{info.baseInfo.chargeArea}}</td>
          </tr>
            <tr>
                <td class="label">最大流量：</td>
                <td class="value disabled">
                    {{info.baseInfo.maxPalletNums}}
                </td>
                <td class="label">税率%：</td>
                <td class="value disabled">
                    {{info.baseInfo.taxRate}}
                </td>
            </tr>
<!--            <tr>-->
<!--                <td class="label">含税月租费用：</td>-->
<!--                <td class="value disabled">{{info.baseInfo.leaseFeeArea}}</td>-->
<!--                <td class="label">含税单价(元/㎡/月)：</td>-->
<!--                <td class="value disabled">{{info.baseInfo.unitPrice}}</td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td class="label">未税月租费用：</td>-->
<!--                <td class="value disabled">{{info.baseInfo.leaseFeeAreaNoTax}}</td>-->
<!--                <td class="label">未税单价(元/㎡/月)：</td>-->
<!--                <td class="value disabled">{{info.baseInfo.unitPriceNoTax}}</td>-->
<!--            </tr>-->
          <tr>
            <td class="label"><em>*</em>存放条件：</td>
            <td class="value disabled">
              {{info.baseInfo.storageConditionName}}
            </td>
            <td class="label">合同编号：</td>
            <td class="value disabled">
              {{info.baseInfo.contractNum}}
            </td>
          </tr>
          <tr>
            <td class="label"><em>*</em>租赁日期从：</td>
            <td class="value disabled">
              {{info.baseInfo.leaseBeginDate}}
            </td>
            <td class="label"><em>*</em>至：</td>
            <td class="value disabled">
              {{info.baseInfo.leaseEndDate}}
            </td>
          </tr>
        </table>
        <div class="tableItem" v-for="(tableItem,index) in info.details" :key="tableItem.codeId">
            <h3>{{index+2}}、{{tableItem.title}}</h3>
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th width="140">费用项目</th>
                    <th width="100" v-if="tableItem.codeId==107" >器具名称</th>
                    <th width="80">价格单位</th>
                    <th width="110" v-if="tableItem.codeId==104||tableItem.codeId==106">起始地</th>
                    <th width="110" v-if="tableItem.codeId==104">目的地</th>
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
                    <th v-if="tableItem.codeId!=1" width="80">计费节点</th>
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
                    <td v-if="tableItem.codeId==107"><span>{{item.nums}}</span></td>
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
                      <span v-if="tableItem.codeId!=107||(tableItem.codeId==107&&item.unit=='元/个/次')">{{item.relOperationName}}</span>
                    </td>
                    <td v-if="tableItem.codeId!=1" width="80">
                      <el-switch v-model="item.isDefault == 1" v-if="tableItem.codeId!=107||(tableItem.codeId==107&&item.unit=='元/个/次')"
                                 active-color="#13ce66"
                                 inactive-color="#ff4949"
                                 active-text="是"
                                 inactive-text="否">
                      </el-switch>
                    </td>
                  </tr>
              </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
import storeHouseSaleDetail from "./storeHouseSaleDetail.js";
export default storeHouseSaleDetail;
</script>
<style src="./storeHouseSale.scss" lang="scss" scoped></style>
