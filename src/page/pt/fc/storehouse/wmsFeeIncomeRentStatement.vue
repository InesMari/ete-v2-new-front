<template>
  <div id="wmsFeeIncomeRentStatement" class="wmsFeeIncomeRentStatement">
    <div class="common-info">
        <h3 class="common-title"><span class="title-name">基本信息</span></h3>
        <div class="table_height">
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td class="label">费用类型： </td>
                  <td class="value disabled">{{info.baseInfo.itemTypeName}}</td>
                  <td class="label">仓库名称： </td>
                  <td class="value disabled">{{info.baseInfo.workName}}</td>
              </tr>
              <tr>
                  <td class="label">客户：</td>
                  <td class="value disabled">{{info.baseInfo.tenantName}}</td>
                  <td class="label">费用月份：</td>
                  <td class="value disabled">{{info.baseInfo.billMonth}}</td>
              </tr>
              <tr>
                  <td class="label">仓库面积：</td>
                  <td class="value disabled">{{info.baseInfo.storehouseArea}}</td>
                  <td class="label">含税合计：</td>
                  <td class="value disabled">{{info.baseInfo.totalFeeWithTax}}</td>
              </tr>
          </table>
        </div>
            <h3 class="common-title"><span class="title-name">定量仓储收入信息</span></h3>
            <div class="table_height">
              <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                      <tr>
                        <th width="140">报价单号</th>
                        <th width="100">费用项目</th>
                        <th width="80">存放条件</th>
                        <th width="60">计费单位</th>
                        <th width="60">未税单价</th>
                        <th width="60">税率</th>
                        <th width="60">含税单价</th>
                        <th width="60">公摊%</th>
                        <th width="60">租赁面积</th>
                        <th width="60">计费面积</th>
                        <th width="60">未税金额</th>
                        <th width="60">含税金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,idx) in info.details1" :key="idx">
                        <td><span>
                          <a href="javascript:void(0);" class="link" @click.stop="toQuoteDetail(item)" style="margin: 0 10px;">{{item.quoteNum}}</a></span></td>
                        <td><span>{{item.itemName}}</span></td>
                        <td><span>{{item.storageConditionName}}</span></td>
                        <td><span>{{item.unit}}</span></td>
                        <td><span>{{item.price}}</span></td>
                        <td><span>{{item.tax}}</span></td>
                        <td><span>{{item.priceWithTax}}</span></td>
                        <td><span>{{item.shareRate}}</span></td>
                        <td><span>{{item.leaseAreaTotal}}</span></td>
                        <td><span>{{item.chargeArea}}</span></td>
                        <td><span>{{item.totalFee}}</span></td>
                        <td><span>{{item.totalFeeWithTax}}</span></td>
                      </tr>
                  </tbody>
                </table>
            </div>
        <h3 class="common-title"><span class="title-name">流量仓储收入信息</span></h3>
        <div class="table_height">
          <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="140">报价单号</th>
              <th width="100">费用项目</th>
              <th width="80">存放条件</th>
              <th width="60">计费周期</th>
              <th width="60">计费单位</th>
              <th width="60">未税单价</th>
              <th width="60">税率</th>
              <th width="60">含税单价</th>
              <th width="60">最大流量</th>
              <th width="60">计费数量</th>
              <th width="60">未税金额</th>
              <th width="60">含税金额</th>
              <th width="60">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,idx) in info.details2" :key="idx">
              <td><span>
                <a href="javascript:void(0);" class="link" @click.stop="toQuoteDetail(item)" style="margin: 0 10px;">{{item.quoteNum}}</a></span></td>
              <td><span>{{item.itemName}}</span></td>
              <td><span>{{item.storageConditionName}}</span></td>
              <td><span>{{item.billingCycleName}}</span></td>
              <td><span>{{item.unit}}</span></td>
              <td><span>{{item.price}}</span></td>
              <td><span>{{item.tax}}</span></td>
              <td><span>{{item.priceWithTax}}</span></td>
              <td><span>{{item.maxPalletNums}}</span></td>
              <td><span>{{item.num}}</span></td>
              <td><span>{{item.totalFee}}</span></td>
              <td><span>{{item.totalFeeWithTax}}</span></td>
              <td><span><a href="javascript:void(0);" class="link" @click.stop="toDetail(item)" style="margin: 0 10px;" v-if="item.billingCycle==1">查看明细</a></span></td>
            </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>
</template>

<script>
import wmsFeeIncomeRentStatement from "./wmsFeeIncomeRentStatement.js";
export default wmsFeeIncomeRentStatement;
</script>
<style lang="scss" scoped>
.wmsFeeIncomeRentStatement {
  .common-info {
    padding: 30px 20px;

    .fillTbale {
      .value{
        text-align: left;
      }
      .disabled{
        background: #F5F7FA;
        padding: 0 15px;
      }
    }

    h3 {
      line-height: 40px;
      font-weight: bold;
      color: #333;
      font-size: 14px;

      em {
        font-size: 12px;
      }

      /deep/ .el-checkbox__label {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
    }

    .tableItem {
      /deep/ .tableCommon {
        border: $border;

        .el-input__inner {
          text-align: center;
        }

        .add {
          vertical-align: middle;
          @include add;
        }

        .del {
          vertical-align: middle;
          @include del;
        }
      }
    }
  }

  /deep/ .dbTable {
    .table_height {
      border: $border;
    }

    .tfoot {
      display: none;
    }
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

  .timeline {
    position: fixed;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    padding: 10px;
    border-radius: 5px;
    transition: all .3s;

    .item {
      position: relative;
      padding-bottom: 20px;
      padding-right: 20px;
      text-align: center;
      min-height: 40px;
      cursor: pointer;

      .circle {
        position: absolute;
        background-color: #E4E7ED;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        right: 0;
        top: 16px;
        margin-top: -6px;
        z-index: 9;
        &.active{
          background: #07c160;
        }
      }

      .line {
        position: absolute;
        right: 5px;
        top: 16px;
        height: 100%;
        border-left: 2px solid #E4E7ED;
      }

      .content {
        display: none;

      }

      &:last-child{
        padding-bottom: 0;
        .line{
          display: none;
        }
      }

      &:hover{
        p{
          color: #07c160;
        }
      }
    }
    &:hover{
      background: #fff;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
      right: 10px;
      .item{
        .content {
          display: block;
        }
      }
    }
  }
}
</style>
