<template>
    <div id="wmsOrderStock">
        <h3 class="common-title mt_20">
            <span class="title-name">出库物料信息</span>
            <el-tooltip effect="dark" content="编辑出/入库物料信息" placement="top-start" :hide-after='1000' v-if="type==1&&!modifyFlag">
                <img src="@/static/image/edit.png" class="edit_icon" alt="" @click="back">
            </el-tooltip>
        </h3>
        <div class="table_height orderInfo">
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
                    <th width="100"><em>*</em>配送数量</th>
                    <th width="100">配送箱数</th>
                    <th width="100">配送托数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in stockInfo.selectItem">
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
                    <td>
                        <el-input v-model="item.nums2" type="text" placeholder="配送数量"
                                  @input="changeNums2(item)" v-mydouble4val></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.boxNums2" type="text" placeholder="配送箱数"
                                  @input="changeBoxNums2(item)"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.palletNums2" type="text" placeholder="配送拖数"
                                  @input="changePalletNums2(item)"></el-input>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：{{ stockInfo.selectItem.length }}</td>
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
    </div>
</template>

<script>
import orderStock from './orderStock.js'

export default orderStock
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.switchDiv {
    padding: 4px 0px;
    border-radius: 3px;
    color: $main-color;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;

    .name {
        vertical-align: middle;
        margin-left: 8px;
    }

    // &:hover{
    //   color: #fff;
    //   background: $main-color;
    // }
}

.arriveWorkTable .tableCommon {
    border: none !important;
}
</style>
