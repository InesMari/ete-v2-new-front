<template>
    <div id="purchaseOrderInWarehouse">
        <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">采购单单号</label>
                    <div class="input-text">{{ info.purchaseNum }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">采购方</label>
                    <div class="input-text">{{ info.settleBodyName }}</div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">入库地</label>
                    <div class="input-text">{{ info.workName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>入库日期</label>
                    <div class="input-text">
                        <el-date-picker v-model="info.inDate"
                                        :picker-options="pickerOptions"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                        type="date" placeholder="请选择年月日"></el-date-picker>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">交货单：</label>
                    <div class="input-text">
                        <div class="clearfix">
                            <myFileModel class="fl"
                                        ref="file"
                                        supportFiles="file"
                                        @successCallback="successCallback"
                                        @delCallback="delCallback">
                            </myFileModel>
                        </div>
                        <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                    </div>
                </li>
              <li class="item item50">
                <label class="label-term">实物图片：</label>
                <div class="input-text">
                  <div class="clearfix">
                    <myFileModel class="fl"
                                 ref="file"
                                 supportFiles="img"
                                 @successCallback="successCallbackReal"
                                 @delCallback="delCallbackReal">
                    </myFileModel>
                  </div>
                  <p>只支持.jpg .png格式</p>
                </div>
              </li>
            </ul>
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">备注：</label>
              <div class="input-text">
                <el-input v-model="info.orderRemark" :autosize="{minRows:5}" type="textarea" maxlength="2000" placeholder="说点什么"></el-input>
              </div>
            </li>
          </ul>
            <div class="clearfix mt_20" style="display: flex;">
                <table class="tableCommon" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="60"></th>
                            <th width="80">序号</th>
                            <th width="150">物品种类</th>
                            <th width="150">品名</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in info.dtlList">
                            <td>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                    <span class="del" @click="deleteDtlListItem(index)"></span>
                                </el-tooltip>
                            </td>
                            <td>{{ index+1 }}</td>
                            <td>{{ item.feeSubTypeName }}</td>
                            <td>{{ item.projectName }}</td>
                        </tr>
                        <tr>
                            <td>合计</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <el-scrollbar class="scrollView" style="flex:1;">                
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="150">规格型号</th>
                            <th width="120">是否资产管理</th>
                            <th width="100">数量单位</th>
                            <th width="100">采购数量</th>
                            <th width="100">已入库数量</th>
                            <th width="100">入库数量</th>
                            <th width="120">付款类型</th>
                            <th width="150">
                                <el-tooltip class="item" effect="light" placement="top-start">
                                    <div slot="content">{{tip}}</div>
                                    <i class="el-icon-question pointer"></i>
                                </el-tooltip>
                                开始计费日期</th>
                            <th width="150">结束计费日期</th>
                            <th width="120">资产类别</th>
                            <th width="120">资产子类别</th>
                            <th width="120">是否集采</th>
                            <th width="150">设备序列号</th>
                            <th width="150">合同编号</th>
                            <th width="200">存放场地</th>
                            <th width="120">计费周期</th>
                            <th width="120">押金</th>
                            <th width="120">违约金</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in info.dtlList">
                            <td>{{ item.specification }}</td>
                            <td>{{ item.isAssetName }}</td>
                            <td>{{ item.unit }}</td>
                            <td>{{ item.purchaseNum }}</td>
                            <td>{{ item.deliveryNums }}</td>
                            <td>
                                <el-input v-model="item.nums" @input="changeDeliveryNums"
                                          v-mydoubleval maxlength="100" placeholder="入库数量"></el-input>
                            </td>
                            <td>{{ item.payTypeName }}</td>
                            <td v-if="item.payType==1||item.payType==2">
                              <el-date-picker v-model="item.chargeDate" @input="forceUpdate" :picker-options="pickerOptions"
                                              type="month" class="tl" placeholder=""
                                              value-format="yyyy-MM" format="yyyy-MM"></el-date-picker>
                            </td>
                            <td v-if="item.payType==1||item.payType==2">
                              <el-date-picker v-model="item.chargeDateEnd" @input="forceUpdate" :disabled="item.payType==1"
                                              type="month" class="tl" placeholder="" :picker-options="pickerOptions"
                                              value-format="yyyy-MM" format="yyyy-MM"></el-date-picker>
                            </td>
                            <td v-if="item.payType==3||item.payType==4">
                                <el-date-picker v-model="item.chargeDate" @input="forceUpdate"
                                                type="date" class="tl" placeholder="" :picker-options="pickerOptions"
                                                value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                            </td>
                            <td v-if="item.payType==3||item.payType==4">
                              <el-date-picker v-model="item.chargeDateEnd" @input="forceUpdate" :picker-options="pickerOptions"
                                                  type="date" class="tl" placeholder=""
                                                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                            </td>
                            <td>
                              <el-select v-model="item.assetClass" filterable @change="changeAssetClass(item)" :disabled="item.isAsset==0">
                                <el-option v-for="subItem in item.assetClassData" :key="subItem.codeValue" :label="subItem.codeName"
                                           :value="subItem.codeValue"></el-option>
                              </el-select>
                            </td>
                            <td>
                              <el-select v-model="item.assetSubClass" filterable :disabled="!item.assetSubClassData||item.isAsset==0" @change="forceUpdate" >
                                <el-option v-for="subItem in item.assetSubClassData" :key="subItem.codeValue" :label="subItem.codeName"
                                           :value="subItem.codeValue"></el-option>
                              </el-select>
                            </td>
                            <td>
                              <el-select v-model="item.isCentralPurchase" filterable  @change="forceUpdate" :disabled="item.isAsset==0">
                                <el-option v-for="subItem in whetherData" :key="subItem.codeValue" :label="subItem.codeName"
                                           :value="subItem.codeValue"></el-option>
                              </el-select>
                            </td>
                            <td>
                              <el-input v-model="item.equipmentNum" :disabled="(item.assetType!=1&&item.assetType!='1')||item.isAsset==0" @input="forceUpdate" maxlength="100" placeholder="设备序列号"></el-input>
                            </td>
                            <td>
                              <el-select v-model="item.contractId" filterable clearable @change="forceUpdate" :disabled="item.isAsset==0">
                                <el-option v-for="subItem in contractData" :key="subItem.id" :label="subItem.contractNum"
                                           :value="subItem.id"></el-option>
                              </el-select>
                            </td>
                            <td>
                              <el-input v-model="item.storageLocation" maxlength="50" placeholder="请输入存放位置" :disabled="item.isAsset==0" @input="forceUpdate"></el-input>
                            </td>
                            <td>
                              <el-select v-model="item.billingCycle"  :disabled="item.payType==1||item.payType==2||item.isAsset==0" filterable @input="forceUpdate">
                                <el-option v-for="subItem in billingCycleData" :key="subItem.codeValue" :label="subItem.codeName"
                                           :value="subItem.codeValue"></el-option>
                              </el-select>
                            </td>
                            <td>
                              <el-input v-model="item.deposit" maxlength="50" placeholder="请输入押金" @input="forceUpdate" :disabled="item.isAsset==0"></el-input>
                            </td>
                            <td>
                              <el-input v-model="item.liquidatedDamages" maxlength="50" placeholder="请输入违约金" @input="forceUpdate" :disabled="item.isAsset==0"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{ total.purchaseNum }}</td>
                            <td>{{ total.deliveryNums }}</td>
                            <td>{{ total.nums }}</td>
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
                        </tr>
                    </tbody>
                </table>
                </el-scrollbar>
            </div>
            <div class="page-bot-btn ">
                <el-button size="mini" @click="closePage">关闭</el-button>
                <el-button type="primary" size="mini" @click="confirmInStorage()">确认入库</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import purchaseOrderInWarehouse from './purchaseOrderInWarehouse.js'
export default purchaseOrderInWarehouse
</script>
<style lang="scss" scoped>
#purchaseOrderInWarehouse{
  .tableCommon{
      border:$border;
      margin:20px 0;
      .del{
          vertical-align: middle;
          @include del;
      }
  }
  /deep/ .scrollView{
    flex: 1;
    box-sizing: border-box;
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
    .el-input__inner{
        text-align: center;
    }
  }

}
</style>

