<template>
    <div id="outOrderDetail" class="outOrderDetailPage">
        <innerTab v-if="tabs.length > 1" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
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
                    <th width="150" v-show="info.orderType==2">货主</th>
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
                    <td v-show="info.orderType==2">{{ item.srcTenantName }}</td>
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
                    <td v-show="info.orderType==2"></td>
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
            <tableCommon class="" tableName="outOrderDetailTable" ref="table" :head="materialCodeHead" :showNum="true" :showSetTable="true" :showSelect="false" :showPage="false">
                <template v-slot:default="{item,code}">
                    <a v-if="code=='custQrcodeNum'" href="javascript:;" class="link" @click="selCustQrcode(item)">{{ item.custQrcodeNum }}</a>
                    <img v-if="code=='qrcodeUrl' && item.qrcodeUrl" :src="item.qrcodeUrl" alt="" width="100%" style="margin-top: 5px;height: 50px;">
                </template>
            </tableCommon>
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
            <h3 class="common-title mt_20" v-show="info.state > 4"><span class="title-name">收入信息</span></h3>
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
                                 disabled
                                 active-color="#13ce66"
                                 inactive-color="#ff4949"
                                 active-text="是"
                                 inactive-text="否">
                      </el-switch>
                  </td>
                  <td>{{item.tenantName}}</td>
                  <td>{{item.price}}</td>
                  <td>{{item.tax}}</td>
                  <td>{{item.priceWithTax}}</td>
                  <td>{{item.num}}</td>
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
            </div>
        </div>
        <!-- 标签详情 -->
        <tagTable :data="materialCodeList" :showTagBtn="false" v-show="showType==2" type="2"></tagTable>
        <tagTable :data="custQrcodeList" :head="custQrcodeHead" v-show="showType==3" :showTagBtn="false" type="2"></tagTable>
        <operateLog v-show="showType==4"></operateLog>

        
      <!-- 选择客户码 -->
    <el-dialog class="operateDialog" :visible.sync="custQrcodeDialog" width="90%"  :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title" class="custDialogTitle">
            <span class="title">查看客户码</span>
            <em>批次号：{{ currentItem.batchNum }}</em>
            <em>物料编码：{{ currentItem.materialNum }}</em>
        </div>
        <dbTable tableName="custCodeTable" ref="custCodeTable" :head="custCodeHead" onlyId="id"></dbTable>
        <div class="bot-btn">
            <el-button @click="custQrcodeDialog = false">关闭</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import outOrderDetail from './outOrderDetail.js'

export default outOrderDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss" scoped>
.outOrderDetailPage {
    position: relative;
    .orderNum{
        font-weight: bold;
        margin-left: 20px;
        color:#333;
    }
    .tableCommon {
        border: $border;
    }
    /deep/ .tableCommonComponents{
        border:$border;
        .setTableRow{
            top: -34px;
            z-index: 9999;
        }
        .table_height{
            min-height: auto;
        }
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
    .dbTable{
        table{            
            pointer-events: none;
        }
    }
    .operateDialog{
        .custDialogTitle{
            line-height: 24px;
            .title{
                font-size: 18px;
                color: #333;
                margin-right: 20px;
            }
            em{
                margin-right: 10px;
                font-size: 12px;
            }
        }
    }
}

</style>