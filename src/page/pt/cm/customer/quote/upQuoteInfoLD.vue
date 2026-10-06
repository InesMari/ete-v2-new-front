<template>
  <div id="upQuoteInfoLD" class="upQuoteLD">
    <div class="common-info" style="border:none;padding-bottom:0;">
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term">报价单号：</label>
          <div class="input-text">
            <el-input v-model="quoteInfo.quoteNum" placeholder="报价单号" type="text" :disabled="true"
                      autocomplete="new-password"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">客户：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.tenantId" placeholder="选择客户" filterable clearable :disabled="true">
              <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name"
                         :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term">报价级别：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.quoteLevel" filterable clearable :disabled="true">
              <el-option v-for="item in quoteLevelData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
      </ul>
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term">起始地：</label>
          <div class="input-text">
            <el-input v-model="quoteInfo.beginIndexSearchStr" placeholder="起始地" type="text" :disabled="true"
                      autocomplete="new-password"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">目的地：</label>
          <div class="input-text">
            <el-input v-model="quoteInfo.endIndexSearchStr" placeholder="目的地" type="text" :disabled="true"
                      autocomplete="new-password"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>生效日期：</label>
          <div class="input-text">
            <el-date-picker
                v-model="quoteInfo.effectDate"
                type="date" value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>失效日期：</label>
          <div class="input-text">
            <el-date-picker
                v-model="quoteInfo.expireDate"
                type="date" value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
          </div>
        </li>
      </ul>
    </div>
    <div class="table_height" style="margin-left: 20px;">
      <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">注：同一客户下,相同的起始点、目的地、计费方式、同一个区间、区间单位、相同费用类型，相同货物只能存在一条。通用等于全选。</div>
      <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th>序号</th>
          <th>费用类型</th>
          <th>区间</th>
          <th>区间单位</th>
          <th>计费方式</th>
          <th>货物</th>
          <th>费用</th>
          <th style="background-color: #fff;"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in array">
          <td>{{index + 1}}</td>
          <td>
            <el-select v-model="item.feeType" placeholder="请选择" filterable @change="changeFeeType(index)" :disabled="modifyType==2&&item.id">
              <el-option v-for="v in feeTypeData" :key="v.codeValue"
                         :label="v.codeName" :value="v.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="item.rangeStart" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable||(modifyType==2&&item.id)" @input="forceUpdate"></el-input> -
            <el-input v-model="item.rangeEnd" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable||(modifyType==2&&item.id)" @input="forceUpdate"></el-input>
          </td>
          <td>
            <el-select v-model="item.rangeUnit" placeholder="请选择" :disabled="item.rangeDisable||(modifyType==2&&item.id)">
              <el-option v-for="v in rangeUnitData" :key="v.codeValue"
                         :label="v.codeName" :value="v.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="item.billingType" clearable placeholder="请选择" :disabled="item.disBillingType||(modifyType==2&&item.id)" @change="changebillingType(index)">
              <el-option v-for="b in billingTypeData" :key="b.codeValue"
                         :label="b.codeName" :value="b.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="item.goodsId" :disabled="item.isDisable||(modifyType==2&&item.id)"
                       @change="changeGoodsId(item)" filterable clearable multiple placeholder="选择货物">
              <el-option-group v-for="group in item.goodsGroupData" :key="group.label" :label="group.label">
                <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                           :value="item.goodsId" :disabled="item.disabled"></el-option>
              </el-option-group>
            </el-select>
          </td>
          <td><el-input v-model="item.fee" v-mydouble5val maxlength="19" :disabled="(modifyType==2&&item.id)"></el-input></td>
          <td style="border-bottom:0;text-align: left;">
            <el-tooltip effect="dark" content="添加报价" v-show="(index == array.length - 1)"
                        placement="top-start" :hide-after='1000' style="margin-right: 10px">
              <span @click="addItem()" class="add"></span>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除报价" v-show="array.length > 1&&!(modifyType==2&&item.id)"
                        placement="top-start" :hide-after='1000'>
              <span @click="removeItem(index)" class="del"></span>
            </el-tooltip>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="bot-btn">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import upQuoteInfoLD from './upQuoteInfoLD.js'
export default upQuoteInfoLD
</script>
<style lang="scss">
.upQuoteLD{
  background: #fff;
  border:$border;
  .el-radio-group{
    position: relative;
    z-index: 2;
    vertical-align: top;
  }
  .add{
    vertical-align: middle;
    width: 20px;
    height: 20px;
    background: #1990ff;
    position: relative;
    cursor: pointer;
    @include add;
  }
  .del{
    vertical-align: middle;
    width: 20px;
    height: 20px;
    background: #ff0000;
    position: relative;
    display: inline-block;
    cursor: pointer;
    @include del;
  }
  .table_height{
    overflow: auto;
    min-height: 300px;
    margin-top: 10px;
    border-bottom:$border;
    .tableCommon{
      .el-select{
        width: 100%;
      }
    }
  }
  .common-info .content > .item .input-text{
    .innerLabel{
      margin: 0 10px 0 20px;
    }
    .el-select,.el-input{
      width: 150px;
    }
  }
}
td input{
  text-align: center;
}
</style>
