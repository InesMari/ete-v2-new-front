<template>
    <div id="outOrderFeeConfirm" class="outOrderFeeConfirmPage">
      <innerTab v-if="hasNewQrcode" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
      <div class="common-info" v-show="showType==1">
        <!--            基础信息-->
        <h3 class="common-title" style="margin-top: -20px;" >
          <span class="title-name">基础信息</span>
          <span class="orderNum">出库单号：{{ info.outOrderNum }}</span>
        </h3>
        <table class="fillTbale">
          <tr>
            <td class="label">出库类型</td>
            <td class="value">{{ info.orderTypeName }}</td>
            <td class="label">货主</td>
            <td class="value">{{ info.srcTenantName?info.srcTenantName:'-' }}</td>
            <td class="label">送货地址</td>
            <td class="value">{{ info.workName }}</td>
            <td class="label">要求出库时间</td>
            <td class="value">{{ info.requireOutDate }}</td>
          </tr>
          <tr>
            <td class="label">是否退货</td>
            <td class="value">{{ info.rejectedStateName }}</td>
            <td class="label">是否自提</td>
            <td class="value">{{ info.selfPickupName }}</td>
            <td class="label">是否紧急</td>
            <td class="value">{{ info.isEmergencyName }}</td>
            <td class="label">客户单号</td>
            <td class="value">{{ info.custOrderNum }}</td>
          </tr>
          <tr>
            <td class="label">要求送达时间</td>
            <td class="value">{{ info.requireDoneTime }}</td>
            <td class="label">抛单时间</td>
            <td class="value">{{ info.deliverOrderTime }}</td>
            <td class="label" v-show="info.timeoutReason">超时原因</td>
            <td class="value" v-show="info.timeoutReason">{{info.timeoutReasonName}}</td>
            <td class="label">出库单备注</td>
            <td class="value" :colspan="info.timeoutReason?1:3">{{ info.remark }}</td>
          </tr>
        </table>
        <!--            基础信息-->

          <!--            要求发货情况-->
            <h3 class="common-title mt_20" v-show="materialList.length > 0"><span class="title-name">要求发货情况</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="materialList.length > 0">
                <thead>
                <tr>
                    <th width="50">序号</th>
                    <th width="150">到货厂商</th>
                    <th width="120">物料编码</th>
                    <th width="100">物料描述</th>
                    <th width="120">规格</th>
                    <th width="80">库存数量</th>
                    <th width="80">出库数量</th>
                    <th width="80">管理单位</th>
                    <th width="80">箱数</th>
                    <th width="80">托数</th>
                    <th width="120">卸货点</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in materialList">
                    <td>{{index+1}}</td>
                    <td>{{ item.fromTenantName }}</td>
                    <td>{{ item.materialNum }}</td>
                    <td>{{ item.materialDesc }}</td>
                    <td>{{ item.materialSpecsName }}</td>
                    <td>{{ item.stockNums }}</td>
                    <td>{{ item.nums }}</td>
                    <td>{{ item.unitName }}</td>
                    <td>{{ item.boxNums }}</td>
                    <td>{{ item.palletNums }}</td>
                    <td>{{ item.workDetailName }}</td>
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
                    <td class="red fw">{{ totalInfo.nums }}</td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.boxNums }}</td>
                    <td class="red fw">{{ totalInfo.palletNums }}</td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
          <!--            要求发货情况-->

          <!--            出库物料情况-->
            <h3 class="common-title mt_20" v-show="outMaterialList.length > 0"><span class="title-name ">出库物料情况</span>
            </h3>
            <div style="overflow: auto;">
                <table class="tableCommon" ref="orderDetail" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="outMaterialList.length > 0">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="120">批次号</th>
                        <th width="120">供应商批次号</th>
                        <th width="100">ASN</th>
                        <th width="250" v-show="info.orderType==2">货主</th>
                        <th width="250">到货厂商</th>
                        <th width="150">物料编码</th>
                        <th width="120">物料描述</th>
                        <th width="100">规格</th>
                        <th width="120">生产日期</th>
                        <th width="80">库存数量</th>
                        <th width="80">管理单位</th>
                        <th width="120">库区</th>
                        <th width="120">库位</th>
                        <th width="120">卸货点</th>
                        <th width="100">计划出库数量</th>
                        <th width="100">计划出库箱数</th>
                        <th width="100">计划出库托数</th>
                        <th width="150">时代条码编号</th>
                        <th width="180">时代条码</th>
                        <th width="100" v-show="info.state > 4">实际出库数量</th>
                        <th width="100" v-show="info.state > 4">实际出库箱数</th>
                        <th width="100" v-show="info.state > 4">实际出库托数</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in outMaterialList">
                        <td>{{index+1}}</td>
                        <td>{{item.batchNum}}</td>
                        <td>{{item.supplierBatchNum}}</td>
                        <td>{{item.asn}}</td>
                      <td v-show="info.orderType==2">{{ item.srcTenantName }}</td>
                      <td>
                            {{item.fromTenantName}}
                        </td>
                        <td>
                            {{item.materialNum}}
                        </td>
                        <td>{{ item.materialDesc }}</td>
                        <td>
                            {{item.materialSpecsName}}
                        </td>
                        <td>
                            {{item.produceDate}}
                        </td>
                        <td>{{ item.storeNums }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>
                            {{ item.reservoirCode }}
                        </td>
                        <td>
                            {{ item.storageCode }}
                        </td>
                        <td>{{ item.workDetailName }}</td>
                        <td>
                            {{item.planNums}}
                        </td>
                        <td>
                          {{item.planBoxNums}}
                        </td>
                        <td>
                          {{item.planPalletNums}}
                        </td>
                        <td>{{item.codeNum}}</td>
                        <td><img :src="item.qrcodeUrl" alt="" width="100%" style="margin-top: 5px;height: 50px;" v-if="item.qrcodeUrl"></td>
                        <td v-show="info.state > 4">
                            {{item.nums}}
                        </td>
                        <td v-show="info.state > 4">
                            {{item.boxNums}}
                        </td>
                        <td v-show="info.state > 4">
                            {{item.palletNums}}
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td width="150">合计:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      <td v-show="info.orderType==2"></td>
                      <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="color: red">{{ totalInfo.nums2 }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="color: red">{{ totalInfo.stockPlanNums }}</td>
                        <td style="color: red">{{ totalInfo.stockPlanBoxNums }}</td>
                        <td style="color: red">{{ totalInfo.stockPlanPalletNums }}</td>
                        <td></td>
                        <td></td>
                        <td style="color: red" v-show="info.state > 4">{{ totalInfo.stockNums }}</td>
                        <td style="color: red" v-show="info.state > 4">{{ totalInfo.stockBoxNums }}</td>
                        <td style="color: red" v-show="info.state > 4">{{ totalInfo.stockPalletNums }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
          <!--            出库物料情况-->

          <!--            器具信息-->
          <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
          <table class="tableCommon" width="100%">
              <thead>
              <tr>
                  <th width="200"><em>*</em>可回收器具</th>
                  <th width="280"><em>*</em>所属人</th>
                  <th width="280"><em>*</em>到货厂商</th>
                  <th width="120"><em>*</em>出库数量</th>
                  <th v-show="info.state >= 4" width="120">实际出库数量</th>
              </tr>
              </thead>
              <tbody>
              <tr  v-for="item in packMaterialList">
                  <td>{{item.name}}</td>
                  <td>{{item.srcTenantName}}</td>
                  <td>{{item.useTenantName}}</td>
                  <td>{{item.nums}}</td>
                  <td  v-show="info.state >= 4">{{item.realNums}}</td>
              </tr>
              </tbody>
          </table>
          <!--            器具信息-->

          <!--            收入信息-->
            <h3 class="common-title mt_20" v-show="info.state > 4">
              <span class="title-name">收入信息</span>
              <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
            </h3>
            <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="info.state > 4">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th width="120">费用类型</th>
                    <th width="120">费用项目名称</th>
                    <th width="100">单位</th>
                    <th width="100">不含税单价</th>
                    <th width="100">税率</th>
                    <th width="100">含税价</th>
                    <th width="100">数量</th>
                    <th width="100">不含税金额</th>
                    <th width="100">含税金额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index)  in feeList">
                    <td>{{ index + 1 }}</td>
                    <td>{{item.itemTypeName}}</td>
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.tax }}</td>
                    <td>{{ item.priceWithTax }}</td>
                    <td>
                      <el-input v-model="item.num" type="text" v-mydouble4val placeholder=""
                                @input="calcFeeTotal(item)"></el-input>
                    </td>
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
                    <td class="red fw">{{ totalInfo.totalFee }}</td>
                    <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                </tr>
                </tfoot>
            </table>
          <!--            收入信息-->

          <!--            成本信息-->
          <h3 class="common-title mt_20"><span class="title-name">成本信息</span></h3>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
              <thead>
              <tr>
                  <th width="100">序号</th>
                  <th width="120">费用类型</th>
                  <th width="120">作业名称</th>
                  <th width="100">计费单位</th>
                  <th width="100">外包作业</th>
                  <th width="150">外包供应商</th>
                  <th width="100">未税单价</th>
                  <th width="100">税率(%)</th>
                  <th width="100">含税价</th>
                  <th width="100">数量</th>
                  <th width="100">未税金额</th>
                  <th width="100">含税金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index)  in costList">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.itemTypeName }}</td>
                  <td>{{ item.itemName }}</td>
                  <td>{{ item.unit }}</td>
                  <td>
                    <el-switch v-model="item.isWorkOrder == 1"
                               @change="changeCostSwitch(item)"
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
                  <td>{{item.price}}</td>
                  <td>{{item.tax}}</td>
                  <td>{{item.priceWithTax}}</td>
                  <td>
                    <el-input v-model="item.num" type="text" v-mydouble4val
                              :placeholder="item.disabled ? '' : '请输入数量'"
                              @input="calcCostTotal" :disabled="item.disabled"></el-input>
                  </td>
                  <td>{{item.fee}}</td>
                  <td>{{item.feeWithTax}}</td>
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
                  <td class="red fw">{{ totalInfo.costNum }}</td>
                  <td class="red fw">{{ totalInfo.costTotalFee }}</td>
                  <td class="red fw">{{ totalInfo.costTotalFeeWithTax }}</td>
              </tr>
              </tfoot>
          </table>
          <!--            成本信息-->

            <h3 class="common-title mt_20" v-show="info.state > 4"><span class="title-name">出库作业单</span></h3>
            <div class="uploadFile clearfix" v-show="info.state > 4">
                <div class="fl mr_20">
                    <myFileModel ref="receiptsImg" :disabledEdit="true" :disabled-del="true"></myFileModel>
                    <p>只支持.jpg .png</p>
                </div>
            </div>


            <div class="bot-btn ">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="feeConfirm()">保存</el-button>
            </div>
        </div>
      <!-- 标签详情 -->
      <tagTable :data="materialCodeList" :showTagBtn="false" v-show="showType==2" type="2"></tagTable>
      <tagTable :data="custQrcodeList" :head="custQrcodeHead" v-show="showType==3" :showTagBtn="false" type="2"></tagTable>

      <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px">
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
import outOrderFeeConfirm from './outOrderFeeConfirm.js'

export default outOrderFeeConfirm
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.outOrderFeeConfirmPage {
  .operateDialog {
    .title {
      display: flex;

      > div {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }
  .orderNum{
    font-weight: bold;
    margin-left: 20px;
    color:#333;
  }
    .tableCommon {
        border: $border;
    }

    .add {
        vertical-align: middle;
        @include add;
    }

    .del {
        vertical-align: middle;
        @include del;
    }

    .switchDiv {
        padding: 2px 8px;
        border: 1px solid $main-color;
        border-radius: 3px;
        color: $main-color;
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
        cursor: pointer;

        .name {
            vertical-align: middle;
            margin-left: 8px;
        }
    }
    .table-content{
      .tableCommon{
        border:none;
      }
    }
}

</style>