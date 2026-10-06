<template>
    <div id="inOrderDetailUpdate" class="warehousingDetailPage">
        <div class="common-info">
            <h3 class="common-title" style="margin-top: -20px;" ><span class="title-name">入库基础信息</span></h3>
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
                    <td class="label">入库类型</td>
                    <td class="value">{{ info.rejectedStateName }}</td>

                </tr>
                <tr>
                    <td class="label">货主</td>
                    <td class="value">{{ info.srcTenantName }}</td>
                    <td class="label">来货地址</td>
                    <td class="value">{{ info.workName }}</td>
                  <td class="label" v-if="info.rejectedState==2">退货类型</td>
                  <td class="value" v-if="info.rejectedState==2">{{info.rejectedTypeName}}</td>
                  <td class="label" v-if="info.rejectedState==2">退货责任方</td>
                  <td class="value" v-if="info.rejectedState==2">{{info.rejectedDuty}}</td>
                  <td class="label" v-if="info.rejectedState!=2">入库单备注</td>
                  <td class="value" v-if="info.rejectedState!=2" colspan="3">{{ info.remark }}</td>
                </tr>
              <tr v-if="info.rejectedState==2" >
                <td class="label">入库单备注</td>
                <td class="value" :colspan="7">{{ info.remark }}</td>
              </tr>
            </table>

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
                    <th>批次号</th>
                    <th>供应商批次号</th>
                    <th>ASN</th>
                    <th>物料编码</th>
                    <th>物料描述</th>
                    <th>到货厂商</th>
                    <th>规格名称</th>
                    <th>入库数量</th>
                    <th>管理单位</th>
                    <th>箱数</th>
                    <th>托数</th>
                    <th>生产日期</th>
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
                </tr>
                </tfoot>
            </table>
            <table
                    class="tableCommon mt_20"
                    width="90%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
            >
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

            <h3 class="common-title mt_20"><span class="title-name">物料入库情况</span></h3>
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
                    <th>批次号</th>
                    <th>供应商批次号</th>
                    <th>物料编码</th>
                    <th>物料描述</th>
                    <th>到货厂商</th>
                    <th>生产日期</th>
                    <th>管理单位</th>
                    <th>库区</th>
                    <th>库位</th>
                    <th>实际入库数量</th>
                    <th>实际入库箱数</th>
                    <th>实际入库托数</th>
                    <th>是否冻结库存</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in stockMaterialList">
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
                    <td><el-input class="txt_c" v-model="item.boxNums" type="text" @input="calc" maxlength="50" v-mynumval></el-input></td>
                    <td><el-input class="txt_c" v-model="item.palletNums" type="text" @input="calc" maxlength="10" v-mynumval></el-input></td>
                    <td>{{ item.freezeStateName }}</td>
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
                    <td class="red fw">{{ totalInfo.stockBoxNums }}</td>
                    <td class="red fw">{{ totalInfo.stockPalletNums }}</td>
                    <td></td>
                </tr>
                </tfoot>
            </table>

<!--            <h3 class="common-title mt_20"><span class="title-name">费用情况</span></h3>-->
<!--            <table-->
<!--                    class="tableCommon"-->
<!--                    width="100%"-->
<!--                    border="0"-->
<!--                    cellspacing="0"-->
<!--                    cellpadding="0"-->
<!--                    ref="feeDetail"-->
<!--            >-->
<!--                <thead>-->
<!--                <tr>-->

<!--                    <th width="100">序号</th>-->
<!--                    <th width="120">费用类型</th>-->
<!--                    <th width="120">费用项目名称</th>-->
<!--                    <th width="100">单位</th>-->
<!--                    <th width="100">不含税单价</th>-->
<!--                    <th width="100">税率</th>-->
<!--                    <th width="100">含税价</th>-->
<!--                    <th width="100">数量</th>-->
<!--                    <th width="100">不含税金额</th>-->
<!--                    <th width="100">含税金额</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr v-for="(item, index)  in feeList">-->
<!--                    <td>{{ index + 1 }}</td>-->
<!--                    <td>{{ item.itemTypeName }}</td>-->
<!--                    <td>{{ item.itemName }}</td>-->
<!--                    <td>{{ item.unit }}</td>-->
<!--                    <td>{{ item.price }}</td>-->
<!--                    <td>{{ item.tax }}</td>-->
<!--                    <td>{{ item.priceWithTax }}</td>-->
<!--                    <td>{{ item.num }}</td>-->
<!--                    <td>{{ item.totalFee }}</td>-->
<!--                    <td>{{ item.totalFeeWithTax }}</td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--                <tfoot>-->
<!--                <tr>-->
<!--                    <td>合计：</td>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                    <td></td>-->
<!--                    <td class="red fw">{{ totalInfo.num }}</td>-->
<!--                    <td class="red fw">{{ totalInfo.totalFee }}</td>-->
<!--                    <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>-->
<!--                </tr>-->
<!--                </tfoot>-->
<!--            </table>-->

<!--            <h3 class="common-title mt_20"><span class="title-name">入库作业单</span></h3>-->
<!--            <div class="uploadFile clearfix">-->
<!--                <div class="fl mr_20">-->
<!--                    <myFileModel ref="receiptsImg" :disabledEdit="true" :disabled-del="true"></myFileModel>-->
<!--                    <p>只支持.jpg .png</p>-->
<!--                </div>-->
<!--            </div>-->

            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="updateInOrderMaterial()">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import inOrderDetailUpdate from './inOrderDetailUpdate.js'

export default inOrderDetailUpdate
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
    .tableCommon {
        border: $border;
        .txt_c input{
            text-align: center;
        }
    }

}
</style>
