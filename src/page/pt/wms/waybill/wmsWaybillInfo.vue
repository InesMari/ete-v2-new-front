<template>
    <div id="wmsWaybillInfo">
        <div class="common-info" style="padding-top: 20px !important;padding-bottom: 30px !important;">
          <h3 class="common-title">
            <span class="title-name">出库物料信息</span>
            <div style="position: absolute;right: 10px;bottom: 5px;font-weight: bold;">配送单号：{{waybillInfo.waybillNum}}</div>
          </h3>
          <div class="table_height orderInfo" style="overflow: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="150">出/入库单号</th>
                <th width="200">货主</th>
                <th width="200">到货厂商</th>
                <th width="150">物料编码</th>
                <th width="150">批次号</th>
                <th width="150">供应商批次号</th>
                <th width="150">ASN</th>
                <th width="100">物料描述</th>
                <th width="150">作业点</th>
                <th width="100">卸货点</th>
                <th width="300">送货卸货地址</th>
                <th width="100">管理单位</th>
                <th width="100">出/入库数量</th>
                <th width="100">出/入库箱数</th>
                <th width="100">出/入库托数</th>
                <th width="100">配送数量</th>
                <th width="100">配送箱数</th>
                <th width="100">配送托数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in list">
                <td>
                  <a href="javascript:" class="link"
                     @click="toOrderDetail(item)">{{ item.outOrderNum }}</a>
                </td>
                <td>{{ item.srcTenantName }}</td>
                <td>{{ item.fromTenantName }}</td>
                <td>{{ item.materialNum }}</td>
                <td>{{ item.batchNum }}</td>
                <td>{{ item.supplierBatchNum }}</td>
                <td>{{ item.asn }}</td>
                <td>{{ item.materialDesc }}</td>
                <td>{{ item.workName }}</td>
                <td>{{ item.workDetailName }}</td>
                <td>{{ item.workNameDetail }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ item.nums }}</td>
                <td>{{ item.boxNums }}</td>
                <td>{{ item.palletNums }}</td>
                <td>{{ item.nums2 }}</td>
                <td>{{ item.boxNums2 }}</td>
                <td>{{ item.palletNums2 }}</td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td>合计：{{ list.length }}</td>
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
                <td>{{ totalInfo.nums }}</td>
                <td>{{ totalInfo.boxNums }}</td>
                <td>{{ totalInfo.palletNums }}</td>
                <td>{{ totalInfo.nums2 }}</td>
                <td>{{ totalInfo.boxNums2 }}</td>
                <td>{{ totalInfo.palletNums2 }}</td>
              </tr>
              </tfoot>
            </table>
          </div>

            <!--            运输信息-->
            <h3 class="common-title mt_20">
                <span class="title-name">运输信息</span>
            </h3>
            <div class="innerTable" style="width:100%">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="19%">供应商</th>
                        <th width="19%">联系人</th>
                        <th width="19%">联系电话</th>
                        <th width="19%">是否加急</th>
                        <th width="19%">是否回单</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            {{ waybillInfo.tenantName }}
                        </td>
                        <td>
                            {{ waybillInfo.linkman }}
                        </td>
                        <td>
                            {{ waybillInfo.linkPhone }}
                        </td>
                        <td>
                            {{ waybillInfo.isUrgentName }}
                        </td>
                        <td>
                            {{ waybillInfo.haveReceiptName }}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="19%">车牌号码</th>
                        <th width="19%">车型</th>
                        <th width="19%">车长</th>
                        <th width="19%">司机</th>
                        <th width="19%">司机电话</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            {{ waybillInfo.plateNumber }}
                        </td>
                        <td>
                            {{ waybillInfo.vehicleTypeName }}
                        </td>
                        <td>
                            {{ waybillInfo.vehicleLengthName }}
                        </td>
                        <td>
                            {{ waybillInfo.driverName }}
                        </td>
                        <td>
                            {{ waybillInfo.driverLinkPhone }}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                    <thead>
                        <tr>
                            <th width="19%">配送时间</th>
                            <th width="19%">报价车型</th>
                            <th width="19%">备注</th>
                            <th width="19%">是否返程</th>
                            <th width="19%">返程数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {{ waybillInfo.deliveryDate }}
                            </td>
                            <td>{{waybillInfo.quoteVehicleTypeName}}</td>
                          <td>{{waybillInfo.remark}}</td>
                          <td>
                                <el-switch v-model="waybillInfo.isReturn == 1"
                                           @change="changeSwitch"
                                           active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           active-text="是"
                                           inactive-text="否">
                                </el-switch>
                            </td>
                            <td>
                                <el-input v-model="costInfo.returnNums" @input="changeReturnNums"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--            运输信息-->
            
            <!--            短驳配送收入-->
            <h3 class="common-title mt_20">
                <span class="title-name">短驳配送收入</span>
                <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
            </h3>
            <div class="tickManager" style="overflow: auto;">
                <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        
                        <th width="50">序号</th>
                        <th width="250">货主</th>
                        <th width="150">费用项目名称</th>
                        <th width="100">单位</th>
                        <th width="100">不含税单价</th>
                        <th width="100">税率</th>
                        <th width="100">含税价</th>
                        <th width="100">配送数量</th>
                        <th width="100">返程数量</th>
                        <th width="100">合计数量</th>
                        <th width="100">不含税金额</th>
                        <th width="100">含税金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in feeList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.srcTenantName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.tax }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>{{ item.num }}</td>
                        <td>
                            <el-input v-model="item.returnNums" @input="changeFeeItemReturnNums(item, index)" :disabled="item.disabled"></el-input>
                        </td>
                        <td>{{ item.totalNum }}</td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
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
                        <td class="red fw">{{ totalInfo.num }}</td>
                        <td class="red fw">{{ totalInfo.returnNums }}</td>
                        <td class="red fw">{{ totalInfo.totalNum }}</td>
                        <td class="red fw">{{ totalInfo.totalFee }}</td>
                        <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            短驳配送收入-->

            <!--            仓配项目成本-->
            <h3 class="common-title mt_20">
                <span class="title-name">仓配项目成本</span>
            </h3>
            <div class="tickManager" style="overflow: auto;">
                <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="150">费用类型</th>
                        <th width="150">作业名称</th>
                        <th width="100">计费单位</th>
                        <th width="100">外包作业</th>
                        <th width="250">外包供应商</th>
                        <th width="100">未税单价</th>
                        <th width="100">税率(%)</th>
                        <th width="100">含税价</th>
                        <th width="100">配送数量</th>
                        <th width="100">返程数量</th>
                        <th width="100">合计数量</th>
                        <th width="100">未税金额</th>
                        <th width="100">含税金额</th>
                        <th width="100">托面积合计(m²)</th>
                        <th width="100">托面积占比(%)</th>
                        <th width="100">实际成本</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in costList">
                        <td>{{index + 1}}</td>
                        <td>{{ item.itemTypeName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>
                            <el-switch v-model="item.isWorkOrder == 1"
                                       @change="changeCostSwitch(item, index)"
                                       :disabled="item.disabled && item.flag"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       active-text="是"
                                       inactive-text="否">
                            </el-switch>
                        </td>
                        <td>
                            <el-select v-model="item.tenantId" placeholder="请选择供应商" filterable
                                       :disabled="item.disabled"
                                       @change="changeSupplier(item, index)">
                                <el-option v-for="supplier in item.supplierData" :key="supplier.tenantId"
                                           :label="supplier.tenantName"
                                           :value="supplier.tenantId"></el-option>
                            </el-select>
                        </td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.tax }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>{{ item.num }}</td>
                        <td>
                            <el-input v-model="item.returnNums" @input="changeCostItemReturnNums(item, index)" :disabled="item.unitDisabled"></el-input>
                        </td>
                        <td>{{ item.totalNum }}</td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
                        <td>
                            <el-input v-model="item.palletNumsSum" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.palletNumsPercent" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.actualCost" type="text" disabled></el-input>
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
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red">{{ totalInfo.costNum }}</td>
                        <td class="red">{{ totalInfo.costReturnNums }}</td>
                        <td class="red">{{ totalInfo.costTotalNum }}</td>
                        <td class="red">{{ totalInfo.costTotalFee }}</td>
                        <td class="red">{{ totalInfo.costTotalFeeWithTax }}</td>
                        <td class="red">{{ totalInfo.palletNumsSum }}</td>
                        <td class="red"></td>
                        <td class="red">{{ totalInfo.actualCost }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            仓配项目成本-->

<!--            利润-->
            <div id="costList" class="clearfix infoTable" style="padding-top: 5px">
                <h3 class="common-title mt_20">
                    <span class="title-name">本车次毛利率</span>
                </h3>
                <div class="innerTable" style="width: 100%;">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="100">实际成本</th>
                            <th width="100">含税收入</th>
                            <th width="100">本车次毛利率(%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <el-input v-model="actualCost" type="text" disabled></el-input>
                            </td>
                            <td>
                                <el-input v-model="income" type="text" disabled></el-input>
                            </td>
                            <td>
                                <el-input v-model="profitRate" type="text" disabled></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
<!--            利润-->

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="sureWaybill()">确定送达</el-button>

            </div>
        </div>

        <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px" >
            <div class="title">
                <div>不参与计费项目</div>
                <div>参与计费项目</div>
            </div>
            <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
            <div class="bot-btn">
                <el-button size="mini" @click="isShowDialog = false">关闭</el-button>
                <el-button size="mini" type="primary" @click="saveChangeFeeItem">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import wmsWaybillInfo from './wmsWaybillInfo.js'

export default wmsWaybillInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
#wmsWaybillInfo{
    .el-input__inner
    {
        text-align: center;
    }
    .operateDialog {
        .title {
            display: flex;

            >div {
                flex: 1;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
        }
    }
}
</style>
