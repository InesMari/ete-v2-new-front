<template>
    <div id="inOrderDetail" class="warehousingDetailPage">
        <innerTab v-if="tabs.length>1"  :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div class="common-info" v-show="showType==1">
            <h3 class="common-title"><span class="title-name">入库基础信息</span></h3>
            <table
                    class="fillTbale"
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
            >
                <tr>
                    <td class="label">入库单号</td>
                    <td class="value">{{ info.inOrderNum }}</td>
                    <td class="label">预计入库时间</td>
                    <td class="value">{{ info.requireInDate }}</td>
                    <td class="label">实际入库日期</td>
                    <td class="value">{{ info.realInDate }}</td>
                    <td class="label">是否退货</td>
                    <td class="value">{{ info.rejectedStateName }}</td>

                </tr>
                <tr>
                    <td class="label">货主</td>
                    <td class="value">{{ info.srcTenantName }}</td>
                    <td class="label">来货地址</td>
                    <td class="value">{{ info.workName }}</td>
                    <!--          <td class="label">ASN</td>-->
                    <!--          <td class="value">{{info.asn}}</td>-->
                    <td class="label">入库单备注</td>
                    <td class="value" colspan="3">{{ info.remark }}</td>
                </tr>
            </table>

            <div style="overflow-x: auto;">
                <table
                        class="tableCommon mt_20"
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        ref="orderDetail"
                >
                    <thead>
                    <tr>
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
                    <tr v-for="item in materialList">
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
            <table
                    class="tableCommon mt_20"
                    width="80%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
            >
                <thead>
                <tr>
                  <th><em>*</em>可回收器具</th>
                  <th><em>*</em>所属人</th>
                  <th><em>*</em>到货厂商</th>
                  <th><em>*</em>入库数量</th>
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

            <h3 class="common-title mt_20"><span class="title-name">物料入库情况</span></h3>
            <div style="overflow-x: auto;">
                <table
                        class="tableCommon"
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        ref="orderInfo"
                >
                    <thead>
                    <tr>
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
                    <tr v-for="item in stockMaterialList">
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
                        <td class="red fw">{{ totalInfo.stockNums }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <h3 class="common-title mt_20"><span class="title-name">费用情况</span></h3>
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
                    <td>{{ item.num }}</td>
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

            <h3 class="common-title mt_20"><span class="title-name">入库作业单</span></h3>
            <div class="uploadFile clearfix">
                <div class="fl mr_20">
                    <myFileModel ref="receiptsImg" :disabledEdit="true" :disabled-del="true"></myFileModel>
                    <p>只支持.jpg .png</p>
                </div>
            </div>

          <div class="bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
          </div>
        </div>
      <!-- 标签详情 -->
      <tagTable :data="materialCodeList" v-show="showType==2" type="1"></tagTable>
<!--        <div class="table-content" v-show="showType==2">-->
<!--            <tableCommon tableName="inOrderDetailTable" ref="table" :head="head" :showNum="true" :showSetTable="false">-->
<!--                <template v-slot="{item,code}">-->
<!--                    <div v-if="code=='qrcodeUrl'">-->
<!--                        <img :src="item.qrcodeUrl" alt="" width="100%" height="100%" style="margin-top: 5px;">-->
<!--                    </div>-->
<!--                </template>-->
<!--            </tableCommon>-->
<!--        </div>-->
    </div>
</template>

<script>
import inOrderDetail from './inOrderDetail.js'

export default inOrderDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
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
