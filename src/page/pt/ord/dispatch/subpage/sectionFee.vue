<template>
      <div id="sectionFee"  class="clearfix infoTable">
        <table class="fillTable" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label" width="15%" style="font-size: 12px;font-weight: bold;" @click="displayDialog">计算成本报价
              <img src="@/static/image/calc.png" alt="" style="width:18px;width: 18px;vertical-align: middle;margin: -3px 0 0 3px;cursor: pointer;">
            </td>
            <td class="value" style="text-align:left;padding-left: 10px;font-size: 12px;font-weight: bold;line-height: 30px;">{{title}}
              <div class="item" style="display: inline-block;margin-right: 50px;float:right;line-height: 30px;" v-if="display">
                <label class="label" style="font-size: 14px;font-weight: 500;">是否需要点检</label>
                <div class="switchDiv" style="margin-left: 8px;">
                  <el-switch v-model="isCheck" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  <span class="name">{{isCheck? "是" : "否"}}</span>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <el-dialog class="feeCalcDialog" title="计算成本报价" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="81%" @close="closeDialog()">
          <div class="common-info" style="border:none;padding:0;" v-if="param.dispatchType!=4">
            <ul class="content clearfix">
              <li class="item">
                <label class="label-term"><em>*</em>计费方式</label>
                <div class="input-text">
                  <el-select v-model="param.billingType" filterable clearable placeholder="请选择" @change="forceUpdate">
                    <el-option v-for="item in billingTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li class="item">
                <label class="label-term">时效</label>
                <div class="input-text">
                  <el-input v-model="param.transportTimeliness" placeholder="<=" v-mydoubleval></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term"><em>*</em>报价车型</label>
                <div class="input-text">
                  <el-select v-model="param.quoteVehicleType" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in quoteVehicleTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li class="item">
                <label class="label-term"><em>*</em>车长</label>
                <div class="input-text">
                  <el-select v-model="param.vehicleLength" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li class="item">
                <label class="label-term">货物重量</label>
                <div class="input-text">
                  <el-input v-model="param.goodsWeight" disabled="true"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">货物体积</label>
                <div class="input-text">
                  <el-input v-model="param.goodsVolume" disabled="true"></el-input>
                </div>
              </li>
<!--              <li class="item">-->
<!--                <label class="label-term">中途点数</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input v-model="param.midwayPointNum" :disabled="true"></el-input>-->
<!--                </div>-->
<!--              </li>-->
              <li class="item">
                <label class="label-term">指定客户</label>
                <div class="input-text">
                  <el-checkbox v-model="param.specifyTenant" :disabled="specifyTenantDisabled">是</el-checkbox>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="closeDialog()">关闭</el-button>
              <el-button type="primary" size="mini" @click="doQuery()">计算报价</el-button>
            </div>
          </div>
          <div class="common-info" style="border:none;padding:0;" v-if="param.dispatchType==4">
            <ul class="content clearfix">
              <li class="item">
                <label class="label-term"><em>*</em>计费方式</label>
                <div class="input-text">
                  <el-select v-model="param.billingType" filterable clearable placeholder="请选择" @change="forceUpdate">
                    <el-option v-for="item in billingTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li class="item">
                <label class="label-term">运输模式</label>
                <div class="input-text">
                  <el-checkbox v-model="param.transport1" @change="forceUpdate">提</el-checkbox>
                  <el-checkbox v-model="param.transport2" @change="forceUpdate" :disabled="true">干</el-checkbox>
                  <el-checkbox v-model="param.transport3" @change="forceUpdate">送</el-checkbox>
                </div>
              </li>
              <li class="item">
                <label class="label-term">时效</label>
                <div class="input-text">
                  <el-input v-model="param.transportTimeliness" placeholder="<=" v-mydoubleval></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">指定客户</label>
                <div class="input-text">
                  <el-checkbox v-model="param.specifyTenant" :disabled="specifyTenantDisabled">是</el-checkbox>
                </div>
              </li>
              <li class="item">
                <label class="label-term">货物重量</label>
                <div class="input-text">
                  <el-input v-model="param.goodsWeight" :disabled="true"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">货物体积</label>
                <div class="input-text">
                  <el-input v-model="param.goodsVolume" :disabled="true"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="closeDialog()">关闭</el-button>
              <el-button type="primary" size="mini" @click="doQuery()">计算报价</el-button>
            </div>
          </div>
          <tableCommon tableName="sectionFeeTable" ref="table" :head="head" :showNum="true" :showSelect="false" :showSetTable="false" style="margin-top:10px; " v-slot="{item}">
            <div>
              <a href="javascript:void(0);" class="link" @click.stop="selSectionFee(item)">选择</a>
            </div>
          </tableCommon>
        </el-dialog>

      </div>
</template>

<script>
import sectionFee from './sectionFee.js'
export default sectionFee
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
#sectionFee{
  .feeCalcDialog{
    .tableCommon{
      border-left:none;
      border-right:none;
    }
  }
}

</style>
