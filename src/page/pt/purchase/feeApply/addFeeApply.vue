<template>
    <div id="addFeeApply">
      <div class="common-info">
        <div class="pageTitle">费用申请单</div>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">申请人</td>
                <td class="value">{{info.userName}}</td>
                <td class="label">申请部门</td>
                <td class="value">{{info.orgName}}</td>
                <td class="label"><em>*</em>申请主体</td>
                <td style="width:33%;" class="value">
                  <el-select v-model="info.applySettleBody" placeholder="请选择申请主体" filterable clearable>
                    <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                               :value="item.codeValue"></el-option>
                  </el-select>
                </td>
            </tr>
            <tr>
                <td class="label">申请日期</td>
                <td class="value">{{info.date}}</td>
                <td class="label"><em>*</em>申请理由</td>
                <td class="value" colspan="3">
                    <el-input v-model="info.applyRemark" type="textarea"></el-input>
                </td>
            </tr>
            <tr>
                <td class="label" ><em>*</em>紧急程度</td>
                <td class="value">
                  <el-radio-group v-model="info.urgentLevel" >
                    <el-radio :label="item.codeValue" v-for="item in urgentLevelData">{{ item.codeName }}</el-radio>
                  </el-radio-group>
                </td>
                <td class="label"><em>*</em>是否预算内
                    <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">是预算内的无需副总以上审核</div>
                        <i class="el-icon-question pointer"></i>
                    </el-tooltip>
                </td>
                <td class="value">
                    <el-radio v-model="info.isWithinBudget" :disabled="isWithinBudgetSwitch" :label="item.codeValue" v-for="item in whetherData">{{ item.codeName }}</el-radio>
                </td>
                <td class="label"><em>*</em>期望完成日期</td>
                <td class="value">
                    <el-date-picker v-model="info.expectDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </td>
            </tr>
            <tr>
                <td class="label"><em>*</em>收货人</td>
                <td class="value">
                    <el-input v-model="info.deliveryUser" type="text"></el-input>
                </td>
                <td class="label"><em>*</em>收货人联系电话</td>
                <td class="value">
                    <el-input v-model="info.deliveryPhone" type="text"></el-input>
                </td>
                <td class="label"><em>*</em>收货地址</td>
                <td class="value">
                    <el-input v-model="info.deliveryAddress" type="text"></el-input>
                </td>
            </tr>
        </table>
        <h3 class="common-title mt_20 clearfix" style="background:none;">
            <el-button class="fr" size="mini" style="margin-top:2px;" @click="operation()" >选择费用信息</el-button>
        </h3>
        <div style="overflow-x:auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="table">
                <thead>
                    <tr>
                        <th width="60">序号</th>
                        <th width="200">费用类型</th>
<!--                        <th width="100">采购类型</th>-->
                        <th width="200">品名/项目</th>
                        <th width="180">规格型号</th>
                        <th width="250">供应商</th>
                        <th width="100">数量单位</th>
                        <th width="150">在途数量</th>
                        <th width="150">现有库存数量</th>
                        <th width="150">上月使用数量</th>
                        <th width="100">需求数量</th>
                        <th width="100">付款类型</th>
                        <th width="80">参考税率</th>
                        <th width="80">参考含税单价</th>
                        <th width="80">参考含税金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fee, index) in info.dtls">
                        <td>{{ index+1 }}</td>
                        <td>{{fee.feeNames}}</td>
<!--                        <td>{{fee.purchaseTypeName}}</td>-->
                        <td>{{fee.projectName}}</td>
                        <td>{{fee.specification}}</td>
                        <td>{{fee.tenantName}}</td>
                        <td>{{fee.unit}}</td>
                        <td>{{fee.inTheRoadNums}}</td>
                        <td>{{fee.stockNums}}</td>
                        <td>{{fee.lastMonthUseNums}}</td>
                        <td>
                            <el-input v-model="fee.demandNums" type="text" v-mydoubleval maxlength="100" placeholder="需求数量" @input="changeDemandNums(fee)"></el-input>
                        </td>
                        <td>{{fee.payTypeName}}</td>
                        <td>
                          <el-input v-model="fee.referTax" type="text" v-mydoubleval maxlength="3" placeholder="参考税率"></el-input>
                        </td>
                        <td>
                          <el-input v-model="fee.referPrice" type="text" v-mydoubleval maxlength="100" placeholder="参考含税单价" @input="changeDemandNums(fee)"></el-input>
                        </td>
                        <td>{{fee.referTotalFee}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td></td>
<!--                        <td></td>-->
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
                        <td>{{totalReferTotalFee}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="uploadFile clearfix" style="margin-top:20px;">
            <div style="font-size:14px;margin-bottom: 10px;font-weight: bold;">附件：</div>
            <div class="fl mr_20"  v-for="(item,index) in info.files">
                <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback" :componentId="index"></myFileModel>
                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
            </div>
            <div class="form fr" style="margin-top: 60px;">
                <em>*</em>部门审核人：
                <el-select v-model="info.orgVerifyUserId" placeholder="请选择审核人" filterable clearable>
                    <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                               :value="item.userId"></el-option>
                </el-select>
            </div>
        </div>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>

      
      <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false">
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label">费用类型</td>
            <td class="value">
              <el-cascader ref="cascader"
                           v-model="loadParam.feeTypeData"
                           size="medium"
                           separator="-"
                           :options="treeData"
                           :props="props"
                           :disabled="feeTypeDisabled"
                           collapse-tags
                           clearable filterable>
              </el-cascader>
            </td>
<!--              <td class="label">采购类型</td>-->
<!--              <td class="value">-->
<!--                  <el-select v-model="loadParam.purchaseType" placeholder="请选择"-->
<!--                             filterable clearable >-->
<!--                      <el-option v-for="item in purchaseTypeData" :key="item.codeValue" :label="item.codeName"-->
<!--                                 :value="item.codeValue"></el-option>-->
<!--                  </el-select>-->
<!--              </td>-->
            <td class="label">品名/项目</td>
            <td class="value">
              <el-input v-model="loadParam.projectName" @input="forceUpdate" placeholder="请输入"></el-input>
            </td>
            <td class="label">规格型号</td>
            <td class="value">
              <el-input v-model="loadParam.specification" @input="forceUpdate" placeholder="请输入"></el-input>
            </td>
            <td width="80">
              <el-button size="mini" type="primary" @click="doQuery()">查询</el-button>
            </td>
          </tr>
        </table>
        <dbTable tableName="addFeeApply" ref="selStockTable" :head="head"
                 onlyId="baseId" @dataChange="dataChange" @filter="filter" :isFilter="isFilter"></dbTable>
        <div class="bot-btn">
          <el-button @click="isShowDialog = false">取消</el-button>
          <el-button type="primary" @click="saveChange">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
    
<script>
import addFeeApply from './addFeeApply.js'
export default addFeeApply
</script>
<style lang="scss" scoped>
#addFeeApply {
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