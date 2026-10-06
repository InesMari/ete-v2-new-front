<template>
    <div id="inOrderFeeConfirm" class="inOrderFeeConfirmPage">
        <innerTab v-if="hasNewQrcode" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div class="common-info" v-show="showType==1">
            <!--            基本信息-->
            <h3 class="common-title" style="margin-top: -20px;"><span class="title-name">基础信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">入库单号</td>
                    <td class="value">{{ info.inOrderNum }}</td>
                    <td class="label">预计入库时间</td>
                    <td class="value">{{ info.requireInDate }}</td>
                    <td class="label">入库类型</td>
                    <td class="value">{{ info.rejectedStateName }}</td>

                    <td rowspan="4" class="label">
                        <p>附件</p><br/>
                        <p>只支持.jpg .png</p>
                    </td>
                    <td rowspan="4" width="110px;">
                        <div class="uploadFile clearfix" style="width: 110px; margin-top: 5px">
                            <div class="fl">
                                <myFileModel ref="receiptsImg"></myFileModel>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label">货主</td>
                    <td class="value">{{ info.srcTenantName }}</td>
                    <td class="label">实际入库日期</td>
                    <td class="value">{{ info.realInDate }}</td>
                    <td class="label">返程短驳单</td>
                    <td class="value"><a href="javascript:void(0);" class="link"
                                         @click.stop="openDetail(info.waybillId)">{{ info.waybillNum }}</a></td>
                </tr>
                <tr>
                    <td class="label">来货地址</td>
                    <td class="value">{{ info.workName }}</td>
                    <td class="label" v-if="info.rejectedState==2">退货类型</td>
                    <td class="value" v-if="info.rejectedState==2">{{ info.rejectedTypeName }}</td>
                    <td class="label" v-if="info.rejectedState==2">退货责任方</td>
                    <td class="value" v-if="info.rejectedState==2">{{ info.rejectedDuty }}</td>
                    <td class="label" v-if="info.rejectedState!=2">备注</td>
                    <td class="value" colspan="3" v-if="info.rejectedState!=2">{{ info.remark }}</td>
                </tr>
                <tr v-if="info.rejectedState==2">
                    <td class="label">备注</td>
                    <td class="value" :colspan="5">{{ info.remark }}</td>
                </tr>
            </table>
            <!--            基本信息-->

            <!--            物料信息-->
            <h3 class="common-title mt_20"><span class="title-name">物料信息</span></h3>
            <div style="overflow-x: auto;">
                <table
                        class="tableCommon"
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        ref="orderDetail">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="150">批次号</th>
                        <th width="150">供应商批次号</th>
                        <th width="120">ASN</th>
                        <th width="180">物料编码</th>
                        <th width="150">物料描述</th>
                        <th width="180">到货厂商</th>
                        <th width="120">规格名称</th>
                        <th width="90">入库数量</th>
                        <th width="80">管理单位</th>
                        <th width="90">箱数</th>
                        <th width="90">托数</th>
                        <th width="150">生产日期</th>
                        <th width="150">时代条码编号</th>
                        <th width="180">时代条码</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in materialList">
                        <td>{{index+1}}</td>
                        <td>{{ item.batchNum }}</td>
                        <td>{{ item.supplierBatchNum }}</td>
                        <td>{{ item.asn }}</td>
                        <td>{{ item.materialNum }}</td>
                        <td>{{ item.materialDesc }}</td>
                        <td>{{ item.fromTenantName }}</td>
                        <td>{{ item.materialSpecsName }}</td>
                        <td>{{ item.nums }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>{{ item.boxNums }}</td>
                        <td>{{ item.palletNums }}</td>
                        <td>{{ item.produceDate }}</td>
                        <td>{{ item.codeNum }}</td>
                        <td><img :src="item.qrcodeUrl" alt="" width="100%" style="margin-top: 5px;height: 50px;"
                                 v-if="item.qrcodeUrl"></td>
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
                        <td class="red fw">{{ totalInfo.nums }}</td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.boxNums }}</td>
                        <td class="red fw">{{ totalInfo.palletNums }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            物料信息-->

            <!--            入库物料情况-->
            <h3 class="common-title mt_20"><span class="title-name">入库物料情况</span></h3>
            <div style="overflow-x: auto;">
                <table
                        class="tableCommon"
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        ref="orderInfo">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="150">批次号</th>
                        <th width="150">供应商批次号</th>
                        <th width="180">物料编码</th>
                        <th width="150">物料描述</th>
                        <th width="180">到货厂商</th>
                        <th width="150">生产日期</th>
                        <th width="80">管理单位</th>
                        <th width="90">库区</th>
                        <th width="90">库位</th>
                        <th width="90">实际入库数量</th>
                        <th width="80">是否冻结库存</th>
                        <th width="150">时代条码编号</th>
                        <th width="180">时代条码</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in stockMaterialList">
                        <td>{{index+1}}</td>
                        <td>{{ item.batchNum }}</td>
                        <td>{{ item.supplierBatchNum }}</td>
                        <td>{{ item.materialNum }}</td>
                        <td>{{ item.materialDesc }}</td>
                        <td>{{ item.fromTenantName }}</td>
                        <td>{{ item.produceDate }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>{{ item.reservoirCode }}</td>
                        <td>{{ item.storageCode }}</td>
                        <td>{{ item.nums }}</td>
                        <td>{{ item.freezeStateName }}</td>
                        <td>{{ item.codeNum }}</td>
                        <td><img :src="item.qrcodeUrl" alt="" width="100%" style="margin-top: 5px;height: 50px;"
                                 v-if="item.qrcodeUrl"></td>
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
                        <td class="red fw">{{ totalInfo.stockNums }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            入库物料情况-->

            <!--            器具信息-->
            <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
            <table
                    class="tableCommon"
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0">
                <thead>
                <tr>
                    <th width="200"><em>*</em>可回收器具</th>
                    <th width="280"><em>*</em>所属人</th>
                    <th width="280"><em>*</em>到货厂商</th>
                    <th width="120"><em>*</em>入库数量</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in packMaterialList">
                    <td>{{ item.name }}</td>
                    <td>{{ item.srcTenantName }}</td>
                    <td>{{ item.useTenantName }}</td>
                    <td>{{ item.nums }}</td>
                </tr>
                </tbody>
            </table>
            <!--            器具信息-->

            <!--            收入信息-->
            <h3 class="common-title mt_20">
              <span class="title-name">收入信息</span>
              <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="feeDetail">
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
                    <td>{{ item.itemTypeName }}</td>
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

            <!--            入库附件-->
            <!--            <h3 class="common-title mt_20"><span class="title-name">入库附件</span></h3>-->
            <!--            <div class="uploadFile clearfix">-->
            <!--                <div class="fl mr_20">-->
            <!--                    <myFileModel ref="receiptsImg" :disabledEdit="true" :disabled-del="true"></myFileModel>-->
            <!--                    <p>只支持.jpg .png</p>-->
            <!--                </div>-->
            <!--            </div>-->
            <!--            入库附件-->

            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="feeConfirm()">保存</el-button>
            </div>
        </div>

        <!-- 标签详情 -->
        <tagTable :data="materialCodeList" v-show="showType==2" type="1"></tagTable>

      <!--        计费项目操作-->
      <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px">
        <div class="title">
          <div>不参与计费项目</div>
          <div>参与计费项目</div>
        </div>
        <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
        <div class="bot-btn">
          <el-button @click="isShowDialog = false">关闭</el-button>
          <el-button type="primary" @click="saveChangeFeeItem">保存</el-button>
        </div>
      </el-dialog>
      <!--        计费项目操作-->
    </div>
</template>

<script>
import inOrderFeeConfirm from './inOrderFeeConfirm.js'

export default inOrderFeeConfirm
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.inOrderFeeConfirmPage {
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
    .tableCommon {
        border: $border;
    }

    .table-content {
        .tableCommon {
            border: none;
        }
    }
}
</style>
