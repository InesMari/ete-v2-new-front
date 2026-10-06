<template>
    <div id="writeOffFeeApply">
      <div class="common-info">
        <h3 class="common-title"><span class="title-name">基础信息</span><span style="font-weight: bold;font-size: 12px;position: absolute;bottom: 0px;right: 0;">申请单号:{{info.applyNum}}</span></h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label">申请人</td>
            <td class="value">{{info.applyUserName}}</td>
            <td class="label">申请部门</td>
            <td class="value">{{info.orgName}}</td>
            <td class="label">申请主体</td>
            <td style="width:33%;" class="value">{{info.applySettleBodyName}}</td>
          </tr>
          <tr>
            <td class="label">申请日期</td>
            <td class="value">{{info.applyDate}}</td>
            <td class="label"><em>*</em>申请理由</td>
            <td class="value" colspan="3">{{info.applyRemark}}</td>
          </tr>
        </table>
        <h3 class="common-title mt_20"><span class="title-name">费用明细</span></h3>
        <div style="overflow-x:auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="table">
                <thead>
                    <tr>
                        <th width="60">序号</th>
                        <th width="150">费用类型</th>
                        <th width="150">品名/项目</th>
                        <th width="150">规格型号</th>
                        <th width="100">数量单位</th>
                        <th width="80">需求数量</th>
                        <th width="80">已采购数量</th>
                        <th width="80">已核销数量</th>
                        <th width="100">本次核销数量</th>
                        <th width="300">备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fee, index) in info.dtls">
                        <td>{{ index+1 }}</td>
                        <td>{{fee.feeNames}}</td>
                        <td>{{fee.projectName}}</td>
                        <td>{{fee.specification}}</td>
                        <td>{{fee.unit}}</td>
                        <td>{{fee.demandNums}}</td>
                        <td>{{fee.purchaseNums}}</td>
                        <td>{{fee.oldWriteOffNums}}</td>
                        <td>
                            <el-input v-model="fee.writeOffNums" :disabled="fee.writeOffDisable" type="text" v-mydoubleval maxlength="10" placeholder="本次核销数量"></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.writeOffRemark" :disabled="fee.writeOffDisable" type="text" maxlength="200" placeholder="核销备注"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>

    </div>
  </template>
    
<script>
import writeOffFeeApply from './writeOffFeeApply.js'
export default writeOffFeeApply
</script>
<style lang="scss" scoped>
#writeOffFeeApply {
    height: auto!important;;
    /deep/ .common-info{
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
        .pageTitle{
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            font-size: 16px;
        }
        .fillTbale{
            .el-textarea__inner{
                border:none;
            }
        }
        .tableCommon{
            border:$border;
        }
    }
    /deep/ .dbTable{
        margin-top:20px;
        .table_height{
            border:$border;
        }
    }
    
    .uploadFile{
      padding: 20px;
      background: #fff;
      border:$border;
      p{
        text-align: center;
      }
      .imgList{
        img{
          width:110px;
          height: 110px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-left: 20px;
        }
      }
    }

  /deep/ .operateDialog{
    .dbTable{
      height: 46vh;
    }
  }
}
</style>