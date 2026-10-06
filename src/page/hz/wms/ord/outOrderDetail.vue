<template>
    <div id="outOrderDetail" class="warehousingDetailPage">
      <innerTab v-if="tabs.length > 1" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
      <div class="common-info" v-show="showType==1">
            <h3 class="common-title"><span class="title-name">出库基础信息</span></h3>
            <table class="fillTbale">
                <tr>
                    <td class="label">出库单号</td>
                    <td class="value">{{ info.outOrderNum }}</td>
                    <td class="label">要求出库时间</td>
                    <td class="value">{{ info.requireOutDate }}</td>
<!--                    <td class="label">ASN</td>-->
<!--                    <td class="value">{{ info.asn }}</td>-->
                    <td class="label">是否为退货</td>
                    <td class="value">{{ info.rejectedStateName }}</td>
                </tr>
                <tr>
                    <td class="label">货主</td>
                    <td class="value">{{ info.srcTenantName }}</td>
                    <td class="label">送货地址</td>
                    <td class="value">{{ info.workName }}</td>
                    <td class="label">出库单备注</td>
                    <td class="value">{{ info.remark }}</td>
                </tr>
            </table>

            <h3 class="common-title" v-show="materialList.length > 0"><span class="title-name">要求发货情况</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="materialList.length > 0">
                <thead>
                <tr>
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
                <tr v-for="(item) in materialList">
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
                    <td class="red fw">{{ totalInfo.nums }}</td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.boxNums }}</td>
                    <td class="red fw">{{ totalInfo.palletNums }}</td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <table class="tableCommon mt_20" width="80%">
                <thead>
                <tr>
                    <th><em>*</em>可回收器具</th>
                    <th><em>*</em>所属人</th>
                    <th><em>*</em>到货厂商</th>
                    <th><em>*</em>出库数量</th>
                    <th v-show="info.state >= 4">实际出库数量</th>
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
            <h3 class="common-title mt_20" v-show="outMaterialList.length > 0"><span class="title-name ">物料出库情况</span>
            </h3>
            <div style="overflow: auto;">
                <table class="tableCommon" ref="orderDetail" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="outMaterialList.length > 0">
                    <thead>
                    <tr>
                        <th width="120">批次号</th>
                        <th width="120">供应商批次号</th>
                        <th width="100">ASN</th>
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
                        <td>{{item.batchNum}}</td>
                        <td>{{item.supplierBatchNum}}</td>
                        <td>{{item.asn}}</td>
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

            <h3 class="common-title mt_20" v-show="info.state > 4"><span class="title-name">费用项目明细</span></h3>
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
                    <td>{{item.num}}</td>
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
            <h3 class="common-title mt_20" v-show="info.state > 4"><span class="title-name">出库作业单</span></h3>
            <div class="uploadFile clearfix" v-show="info.state > 4">
                <div class="fl mr_20">
                    <myFileModel ref="receiptsImg" :disabledEdit="true" :disabled-del="true"></myFileModel>
                    <p>只支持.jpg .png</p>
                </div>
            </div>

            <div class="bot-btn ">
                <el-button @click="close()">关闭</el-button>
            </div>
        </div>
<!--      <div class="table-content" v-show="showType==2">-->
<!--        <tableCommon tableName="outOrderDetailTable" ref="table" :head="head" :showNum="true" :showSetTable="false">-->
<!--          <template v-slot="{item,code}">-->
<!--            <div v-if="code=='qrcodeUrl'">-->
<!--              <img :src="item.qrcodeUrl" alt="" width="100%" height="100%" style="margin-top: 5px;">-->
<!--            </div>-->
<!--          </template>-->
<!--        </tableCommon>-->
<!--      </div>-->
      <!-- 标签详情 -->
      <tagTable :data="materialCodeList" :showTagBtn="false" v-show="showType==2" type="2"></tagTable>
    </div>
</template>

<script>
import outOrderDetail from './outOrderDetail.js'

export default outOrderDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
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