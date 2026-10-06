<template>
  <div id="addQuoteInfoLD" class="addQuoteLD">
    <div class="common-info search-info" style="border:none;padding-bottom:0;">
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term"><em>*</em>供应商：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.tenantId" filterable clearable placeholder="选择供应商" @change="queryQuoteHisData();forceUpdate()">
              <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                         :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>报价级别：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.quoteLevel" filterable clearable @change="changeQuoteLevel">
              <el-option v-for="item in quoteLevelData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term">指定客户：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.specifyTenantId" placeholder="选择客户" filterable clearable @change="changeSpecifyTenant">
              <el-option v-for="item in specifyTenantData" :key="item.tenantId" :label="item.name"
                         :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>运输时效：</label>
          <div class="input-text">
            <el-input v-model="quoteInfo.transportTimeliness" v-mynumval placeholder="请输入以小时为单位的数值" type="text" @blur="queryQuoteHisData"
                      autocomplete="new-password"></el-input>
          </div>
        </li>
      </ul>
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term">起始地：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.beginWorkId" filterable clearable @change="chengeWork" v-show="showBeginWorkSelect" placeholder="请选择作业点">
              <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                  :value="item.workId" :disabled="item.disabled">
              </el-option>
            </el-select>
            <mycity ref="beginCity" selectType="3" @selectCallback="selectBeginCallback" class="mycity fl" v-show="showBeginCity" placeholder="请选择省市区"></mycity>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="addWork(true, 1)" v-show="showWorkButton" circle></el-button>
          </div>
        </li>
        <li class="item">
          <label class="label-term">目的地：</label>
          <div class="input-text">
            <el-select v-model="quoteInfo.endWorkId" filterable clearable @change="chengeWork" v-show="showEndWorkSelect" placeholder="请选择作业点">
              <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                  :value="item.workId" :disabled="item.disabled">
              </el-option>
            </el-select>
            <mycity ref="endCity" selectType="3" @selectCallback="selectEndCallback" class="mycity fl" v-show="showEndCity" placeholder="请选择省市区"></mycity>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="addWork(true, 2)" v-show="showWorkButton" circle></el-button>
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
      <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">注：同一客户下,相同的起始点、目的地、指定客户、运输时效、计费方式、同一个区间、区间单位、相同费用类型，相同货物只能存在一条。通用等于全选。</div>
      <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th>序号</th>
          <th>费用类型</th>
          <th width="200px">区间</th>
          <th width="80px">区间单位</th>
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
            <el-select v-model="item.feeType" placeholder="请选择" filterable @change="changeFeeType(index)">
              <el-option v-for="v in feeTypeData" :key="v.codeValue"
                  :label="v.codeName" :value="v.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="item.rangeStart" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable" @input="forceUpdate"></el-input> -
            <el-input v-model="item.rangeEnd" v-mydoubleval style="width: 46%" :disabled="item.rangeDisable" @input="forceUpdate"></el-input>
          </td>
          <td>
            <el-select v-model="item.rangeUnit" placeholder="请选择" :disabled="item.rangeDisable">
              <el-option v-for="v in rangeUnitData" :key="v.codeValue"
                  :label="v.codeName" :value="v.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="item.billingType" clearable placeholder="请选择" :disabled="item.disBillingType" @change="changebillingType(index)">
              <el-option v-for="b in billingTypeData" :key="b.codeValue"
                  :label="b.codeName" :value="b.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="item.goodsId" @focus="focusGoods" :disabled="item.isDisable"
                       @change="changeGoodsId(item)" filterable clearable multiple placeholder="选择货物">
              <el-option-group v-for="group in item.goodsGroupData" :key="group.label" :label="group.label">
                <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                           :value="item.goodsId" :disabled="item.disabled"></el-option>
              </el-option-group>
            </el-select>
          </td>
          <td><el-input v-model="item.fee" v-mydouble5val maxlength="19"></el-input></td>
          <td style="border-bottom:0;text-align: left;">
            <el-tooltip effect="dark" content="添加报价" v-show="index == array.length - 1"
                        placement="top-start" :hide-after='1000' style="margin-right: 10px">
              <span @click="addItem()" class="add"></span>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除报价" v-show="index != 0"
                        placement="top-start" :hide-after='1000'>
              <span @click="removeItem(index)" class="del"></span>
            </el-tooltip>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

      <!-- 新增 作业点 -->
      <el-dialog title="新增作业点" :visible.sync="showWork" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="addWork(false)">
          <div class="common-info" style="border:none;padding:0;">
              <ul class="content clearfix">
                  <li class="item item100" >
                      <label class="label-term"><em>*</em>名称</label>
                      <div class="input-text">
                          <el-input v-model="workInfo.workName" maxlength="100" disabled placeholder="请点击地图选择地址获取"></el-input>
                      </div>
                  </li>
                  <li class="item item100">
                      <label class="label-term"><em>*</em>所在地区</label>
                      <div class="input-text">
                          <el-select v-model="workInfo.provinceId" placeholder="省" filterable @change="changeProvinceSelect" disabled style="width:23%;margin-right:2%;">
                              <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                         :value="item.id" :disabled="item.disabled"></el-option>
                          </el-select>
                          <el-select v-model="workInfo.cityId" placeholder="市" filterable @change="changeCitySelect" :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                              <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                         :value="item.id" :disabled="item.disabled"></el-option>
                          </el-select>
                          <el-select v-model="workInfo.districtId" placeholder="区" filterable @change="changeDistrictSelect" :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                              <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                         :value="item.id" :disabled="item.disabled"></el-option>
                          </el-select>
                          <el-button type="primary" @click="showMap" style="width:25%;">地图选择</el-button>
                          <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton" @sureCallback="sureWorkAddress" @hideMapBack="hideMapBack" :modal="false"></map-dialog>
                      </div>
                  </li>
                  <li class="item item100">
                      <label class="label-term"><em>*</em>街道地址</label>
                      <div class="input-text">
                          <el-input v-model="workInfo.address" @input="changeAddress" maxlength="200" placeholder="不需要重复填写省/市/区"></el-input>
                      </div>
                  </li>
                  <li class="item item100">
                      <label class="label-term">备注</label>
                      <div class="input-text">
                          <el-input v-model="workInfo.remark" placeholder="备注"></el-input>
                      </div>
                  </li>
              </ul>
              <div class="page-bot-btn ">
                  <el-button size="mini" @click="addWork(false)">关闭</el-button>
                  <el-button type="primary" size="mini" @click="saveWorkInfo()">提交</el-button>
              </div>
          </div>
      </el-dialog>
      <!-- 新增 作业点 -->

    <div class="bot-btn">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import addQuoteInfoLD from './addQuoteInfoLD.js'
export default addQuoteInfoLD
</script>
<style lang="scss">
.addQuoteLD{
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
  .common-info.search-info .content > .item .input-text{
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
