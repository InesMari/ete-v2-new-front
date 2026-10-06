<template>
    <div id="addSupplierZCQuote" class="addSupplierZCQuote">
        <div class="common-info search-info" style="border:none;padding-bottom:0;">
            <ul class="content clearfix" style="margin-bottom: 10px;">
                <li class="item" style="width: 21%;">
                    <label class="label-term"><em>*</em>供应商：</label>
                    <div class="input-text">
                        <el-select v-model="quote.tenantId" @change="changeSupplier" clearable filterable placeholder="选择供应商">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item" style="width: 21%;">
                    <label class="label-term"><em>*</em>报价级别：</label>
                    <div class="input-text">
                        <el-select v-model="quote.quoteLevel" @change="changeQuoteLevel" filterable placeholder="报价级别">
                            <el-option v-for="item in quoteLevelData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item" style="width: 21%;">
                    <label class="label-term">指定客户：</label>
                    <div class="input-text">
                        <el-select v-model="quote.specifyTenantId" @change="changeTenant" clearable filterable placeholder="选择客户">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item" style="width: 21%;">
                    <label class="label-term">运输时效：</label>
                    <div class="input-text">
                        <input v-mydoubleval v-model="quote.transportTimeliness"
                               style="line-height: 36px; width: 146px; border: 1px solid #DCDFE6; text-align: center;"
                               placeholder="请输入小时"></input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="margin-bottom: 10px;">
              <li class="item"  style="width: 21%;">
                <label class="label-term"><em>*</em>生效日期：</label>
                <div class="input-text">
                  <el-date-picker
                      v-model="quote.effectDate"
                      type="date" value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </div>
              </li>
              <li class="item"  style="width: 21%;">
                <label class="label-term"><em>*</em>失效日期：</label>
                <div class="input-text">
                  <el-date-picker
                      v-model="quote.expireDate"
                      type="date" value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </div>
              </li>
                <li class="item" style="width: 21%;">
                    <label class="label-term">合同编号：</label>
                    <div class="input-text">
                        <el-select v-model="quote.contractId" filterable clearable @change="changeContract" placeholder="合同编号">
                            <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum" :value="item.id">
                                <span style="float: left">{{ item.contractNum }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </li>
            </ul>

            <ul class="content clearfix">
                <li class="item" v-for="(item, index) in sectionData" :key="index" style="width: 21%;">
                    <label class="label-term"><em>*</em>{{item.name}}：</label>
                    <div class="input-text">
                        <el-select v-model="item.workId" @change="changeWork(index, item)" clearable filterable
                                   v-show="quote.quoteLevel == enumData.quoteLevel.PRESS_WORK" placeholder="请选择作业点">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                        <mycity :ref="'city' + index" class="mycity fl" selectType="3" @selectCallback="selectCallback(index, item)"
                                v-show="quote.quoteLevel == enumData.quoteLevel.PRESS_REGION" placeholder="请选择省市区"></mycity>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="addWork(true, index)" v-show="showWorkButton" circle></el-button>
                    </div>
                </li>
                <li class="item" style="padding-top: 8px; width: 8%;margin:0; min-width: auto;">
                    <el-tooltip effect="dark" :content="(quote.quoteLevel == enumData.quoteLevel.PRESS_WORK) ? '添加作业点' : '添加省市区'"
                                v-show="sectionData.length < 4" placement="top-start" :hide-after='1000' style="margin-right: 10px">
                        <span @click="addSectionItem()" class="add"></span>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="(quote.quoteLevel == enumData.quoteLevel.PRESS_WORK) ? '删除作业点' : '删除省市区'"
                                 v-show="sectionData.length > 2" placement="top-start" :hide-after='1000'>
                        <span @click="removeSectionItem(index)" class="del"></span>
                    </el-tooltip>
                </li>
            </ul>
        </div>
        <div class="table_height" style="margin-left: 20px;">
            <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">注：同一供应商下,相同的起始点、中途点、目的地、计费方式、报价车型、车长、货物、只能存在一条。通用等于全选。</div>
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>计费方式</th>
                        <th>报价车型</th>
                        <th>车长</th>
                        <th>货物</th>
                        <th>单程运费单价/元</th>
                        <th>往返运费单价/元</th>
                        <th>点位费单价/元</th>
                        <th style="background-color: #fff;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in quoteList">
                        <td>{{index + 1}}</td>
                        <td >
                            <el-select v-model="item.billingType" @change="changeBillingType(item, index)" filterable clearable placeholder="请选择">
                                <el-option v-for="v in billingTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.quoteVehicleType" @change="changeQuoteVehicleType(item)" filterable multiple clearable placeholder="请选择报价车型">
                                <el-option v-for="v in item.quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue" :disabled="v.disabled"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.vehicleLength" @change="changeVehicleLength(item)" filterable multiple clearable placeholder="请选择车长">
                                <el-option v-for="v in item.vehicleLengthData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue" :disabled="v.disabled"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.goodsId" @focus="focusGoods" :disabled="item.billingType != enumData.billingTypeOrder.count"
                                       @change="changeGoodsId(item)" filterable clearable multiple placeholder="选择货物">
                                <el-option-group v-for="group in item.goodsGroupData" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                                               :value="item.goodsId" :disabled="item.disabled"></el-option>
                                </el-option-group>
                            </el-select>
                        </td>
                        <td><el-input v-model="item.feePrice" v-mydouble5val maxlength="19"></el-input></td>
                        <td><el-input v-model="item.returnPrice" v-mydouble5val maxlength="19"></el-input></td>
                        <td><el-input v-model="item.pointFee" :disabled="item.billingType == enumData.billingTypeOrder.count" v-mydouble5val maxlength="19"></el-input></td>
                        <td style="border-bottom:0;text-align: left;">
                            <el-tooltip effect="dark" content="添加报价" v-show="index === quoteList.length - 1"
                                        placement="top-start" :hide-after='1000' style="margin-right: 10px">
                                <span @click="addQuoteItem()" class="add"></span>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除报价" v-show="quoteList.length > 1"
                                        placement="top-start" :hide-after='1000'>
                                <span @click="removeQuoteItem(index)" class="del"></span>
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
                    <el-button type="primary" size="mini" @click="saveWorkInfo()" >提交</el-button>
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
    import addSupplierZCQuote from './addSupplierZCQuote.js'
    export default addSupplierZCQuote
</script>
<style lang="scss">
    .addSupplierZCQuote{
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
