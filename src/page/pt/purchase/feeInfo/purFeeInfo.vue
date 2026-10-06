<template>
    <div id="purFeeInfo">
        <div class="common-info flex">
            <h3 class="common-title"><span class="title-name">基础属性</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item">
                    <label class="label-term"><em>*</em>费用类型：</label>
                    <div class="input-text">
                        <el-cascader ref="cascader"
                                v-model="info.feeTypeData"
                                size="medium"
                                separator="-"
                                :options="treeData"
                                :props="props"
                                @change="feeTypeChange"
                                collapse-tags
                                clearable filterable :disabled="onlySee">
                            <template slot-scope="{ node, data }">
<!--                                <p :style="node.isLeaf?'line-height:1;':''">{{ data.codeName }}</p>-->
<!--                                <p v-if="node.isLeaf" style="color: #8492a6; font-size: 12px"> {{ data.codeTip }}</p>-->
                                <span style="margin-right: 20px;">{{ data.codeName }}</span>
                                <span v-if="node.isLeaf" style="color: #8492a6;float: right;"> {{ data.codeTip }} </span>
                            </template>
                        </el-cascader>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">费用类别：</label>
                    <div class="input-text">
                      <el-input v-model="info.codeTip" disabled></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>{{ showDevice ? '器具名称' : '品名/项目'}}：</label>
                    <div class="input-text" v-show="!showDevice">
                        <el-input v-model="info.projectName" @input="forceUpdate"
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                    <div  class="input-text" v-show="showDevice">
                        <el-select v-model="info.projectId" placeholder="请选择"
                                   filterable clearable :disabled="onlySee" >
                            <el-option v-for="item in deviceData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                  <label class="label-term">成本类型：</label>
                  <div class="input-text">
                    <el-cascader ref="cascader"
                                 v-model="info.accrualCostTypeData"
                                 size="medium"
                                 separator="-"
                                 :options="accrualCostTypeTreeData"
                                 :props="props"
                                 collapse-tags
                                 clearable filterable :disabled="onlySee">
                    </el-cascader>
                  </div>
                </li>
                <li class="item">
                    <label class="label-term">规格型号：</label>
                    <div class="input-text">
                        <el-input v-model="info.specification" @input="forceUpdate"
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>数量单位：</label>
                    <div class="input-text">
                        <el-input v-model="info.unit" @input="forceUpdate"
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>付款类型：</label>
                    <div class="input-text">
                        <el-select v-model="info.payType" @input="forceUpdate" placeholder="请选择"
                                   filterable clearable :disabled="onlySee" >
                            <el-option v-for="item in payTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>税率：</label>
                    <div class="input-text">
                        <el-input v-model="info.rate" @input="forceUpdate" v-mydoubleval
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">租赁/分期/折旧月份数：</label>
                    <div class="input-text">
                        <el-input v-model="info.depreciationMonthCount" @input="forceUpdate"
                                  :disabled="onlySee" v-mynumval placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">物品下限数量：</label>
                    <div class="input-text">
                        <el-input v-model="info.floor" @input="forceUpdate" v-mydoubleval
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">物品上限数量：</label>
                    <div class="input-text">
                        <el-input v-model="info.up" @input="forceUpdate" v-mydoubleval
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
<!--                <li class="item item50">-->
<!--                    <label class="label-term"><em>*</em>采购类型-->
<!--&lt;!&ndash;                        <el-tooltip class="item" effect="light" placement="top-start">&ndash;&gt;-->
<!--&lt;!&ndash;                            <div slot="content">生产类采购：生产类采购需经营中心审核</div><br/>&ndash;&gt;-->
<!--&lt;!&ndash;                            <div slot="content">行政类采购：行政类采购需行政部门审核</div>&ndash;&gt;-->
<!--&lt;!&ndash;                            <i class="el-icon-question pointer"></i>&ndash;&gt;-->
<!--&lt;!&ndash;                        </el-tooltip>&ndash;&gt;-->
<!--                    </label>-->
<!--                    <div class="input-text">-->
<!--                        <el-radio-group v-model="info.purchaseType" :disabled="onlySee" >-->
<!--                            <el-radio :label="1">生产类采购</el-radio>-->
<!--                            <el-radio :label="2">行政类采购</el-radio>-->
<!--                        </el-radio-group>-->
<!--                    </div>-->
<!--                </li>-->
                <li class="item">
                  <label class="label-term">备货周期：</label>
                  <div class="input-text">
                    <el-input v-model="info.stockingCycle" @input="forceUpdate"
                              :disabled="onlySee" placeholder="请输入"></el-input>
                  </div>
                </li>
                <li class="item">
                    <label class="label-term">参考含税单价：</label>
                    <div class="input-text">
                        <el-input v-model="info.referPrice" @input="forceUpdate" v-mydoubleval
                                  :disabled="onlySee" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                  <label class="label-term"><em>*</em>是否需要走采购单：</label>
                  <div class="input-text">
                    <el-radio-group v-model="info.isPurchase" :disabled="onlySee||isPurchaseDisable" @change="purchaseChange">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </div>
                </li>
              <li class="item" v-show="info.isPurchase==1">
                <label class="label-term"><em>*</em>是否资产管理：</label>
                <div class="input-text">
                  <el-radio-group v-model="info.isAsset" :disabled="onlySee" >
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div>
              </li>
                <li class="item item98">
                    <label class="label-term">备注：</label>
                    <div class="input-text">
                        <el-input v-model="info.remark" @input="forceUpdate" :autosize="{minRows:5}"
                                  :disabled="onlySee" type="textarea" maxlength="2000" placeholder="说点什么"></el-input>
                    </div>
                </li>
            </ul>
            <h3 class="common-title"><span class="title-name">附件信息</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term">附件：</label>
                    <div class="input-text">
                        <div class="clearfix">
                            <myFileModel v-for="(item,index) in fileList" class="fl"
                                         :ref="'file'+index" :componentId="index"
                                         supportFiles="file"
                                         :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                         @successCallback="successCallback"
                                         @delCallback="delCallback">
                            </myFileModel>
                        </div>
                    </div>
                </li>
            </ul>
            <h3 class="common-title"><span class="title-name">供应商信息</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term">供应商合同号：</label>
                    <div class="input-text">
                        <el-select v-model="info.contractId" @change="changeContract" placeholder="请选择"
                                   filterable clearable :disabled="onlySee" >
                            <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum"
                                       :value="item.id">
                                <span style="float: left">{{ item.contractNum }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">付款条件：</label>
                    <div class="input-text">
                        <el-input v-model="info.payCondition" @input="forceUpdate"
                                  :disabled="onlySee" placeholder="请输入付款条件"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">合同开始日期：</label>
                    <div class="input-text">
                        <el-date-picker v-model="info.contractBeginDate" disabled type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">合同结束日期：</label>
                    <div class="input-text">
                        <el-date-picker v-model="info.contractEndDate" disabled type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em v-show="showFlag">*</em>供应商：</label>
                    <div class="input-text">
                        <el-select v-model="info.tenantId" @input="forceUpdate"
                                   @change="changeSupplier" placeholder="请选择"
                                   filterable clearable :disabled="onlySee" >
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">银行账号：</label>
                    <div class="input-text">
                        <el-select v-model="info.bankCard" @input="forceUpdate" placeholder="请选择"
                                   filterable clearable :disabled="onlySee" >
                            <el-option v-for="item in bankCardData" :key="item.bankCard" :label="item.bankCard"
                                       :value="item.bankCard"></el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">供应商联系人：</label>
                    <div class="input-text">
                        <el-input v-model="info.linkman" disabled placeholder=""></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">联系人电话：</label>
                    <div class="input-text">
                        <el-input v-model="info.linkPhone" disabled placeholder=""></el-input>
                    </div>
                </li>
            </ul>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="type != 0" @click="save">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import purFeeInfo from './purFeeInfo.js'

export default purFeeInfo
</script>
<style lang="scss" scoped>
#purFeeInfo {
  height: auto!important;;
  /deep/ .common-info{
    height: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    .content{
      &>.item{
        .label-term{
          width: 130px;
        }
        .input-text{
          .areaView{
            padding:10px 0;
            line-height: 20px;
          }
          .el-cascader,.el-input__inner,.el-textarea__inner{
            width:100%;
          }
        }
      }
      .myFileModel{
        float: left;
        margin-right: 10px;
        .avatar-uploader{
          .el-upload{
            width: 115px;
            height: 80px;
          }
          .avatar-uploader-icon{
            width: 115px;
            height: 80px;
            line-height: 80px;
          }
        } 
      } 
    }
  }
  .item98{
    width: 98% !important;
  }
  
}
</style>