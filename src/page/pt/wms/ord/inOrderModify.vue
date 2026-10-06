<template>
  <div id="inOrderModify" class="warehousingDetailPage">
    <div class="common-info">
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
          <td class="value">{{info.inOrderNum}}</td>
          <td class="label">预计入库时间</td>
          <td class="value">{{info.requireInDate}}</td>
            <td class="label">实际入库日期</td>
            <td class="value">{{info.realInDate}}</td>
          <td class="label">入库类型</td>
          <td class="value">{{info.rejectedStateName}}</td>

        </tr>
        <tr>
          <td class="label">货主</td>
          <td class="value">{{info.srcTenantName}}</td>
            <td class="label">来货地址</td>
            <td class="value">{{info.workName}}</td>
<!--          <td class="label">ASN</td>-->
<!--          <td class="value">{{info.asn}}</td>-->
          <td class="label">入库单备注</td>
          <td class="value" colspan="3">{{info.remark}}</td>
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
            <td><el-input v-model="item.batchNum" type="text"
                        @input="changeBatchNum(item)"></el-input>
            </td>
            <td>{{item.supplierBatchNum}}</td>
            <td><el-input v-model="item.asn" type="text"
                        @input="changeAsn(item)"></el-input>
            </td>
            <td>{{item.materialNum}}</td>
            <td>{{item.materialDesc}}</td>
            <td>{{item.fromTenantName}}</td>
            <td>{{item.materialSpecsName}}</td>
            <td>{{item.nums}}</td>
            <td>{{item.unitName}}</td>
            <td>{{item.boxNums}}</td>
            <td>{{item.palletNums}}</td>
            <td>{{item.produceDate}}</td>
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
            <td class="red fw">{{totalInfo.nums}}</td>
            <td></td>
            <td class="red fw">{{totalInfo.boxNums}}</td>
            <td class="red fw">{{totalInfo.palletNums}}</td>
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
          <tr  v-for="item in packMaterialList">
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
            <th>是否冻结库存</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stockMaterialList">
            <td>{{item.batchNum}}</td>
            <td>{{item.supplierBatchNum}}</td>
            <td>{{item.materialNum}}</td>
            <td>{{item.materialDesc}}</td>
            <td>{{item.fromTenantName}}</td>
            <td>{{item.produceDate}}</td>
            <td>{{item.unitName}}</td>
            <td>{{item.reservoirCode}}</td>
            <td>{{item.storageCode}}</td>
            <td>{{item.nums}}</td>
            <td>{{item.freezeStateName}}</td>
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
            <td class="red fw">{{totalInfo.stockNums}}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

    </div>
    <div class="bot-btn ">
      <el-button @click="close()">关闭</el-button>
      <el-button type="primary" @click="inOrderModify()" >确定</el-button>
    </div>
  </div>
</template>

<script>
import inOrderModify from './inOrderModify.js'
export default inOrderModify
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
.warehousingDetailPage{
    .tableCommon{
        border:$border;
    }
}
</style>
