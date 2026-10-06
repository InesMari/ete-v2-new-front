<template>
    <div id="addSupplierQuoteLD" class="addQuoteManageLDPage">
        <div class="common-info" style="border:none;padding-bottom:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">供应商：</label>
                <div class="input-text">
                  <el-select v-model="quoteInfo.tenantId" filterable clearable placeholder="选择供应商" @change="forceUpdate">
                    <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                               :value="item.tenantId"></el-option>
                  </el-select>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">指定客户：</label>
                <div class="input-text">
                  <el-select v-model="quoteInfo.specifyTenantId" filterable clearable placeholder="选择客户" @change="changeSpecifyTenant();forceUpdate()">
                    <el-option v-for="item in specifyTenantData" :key="item.tenantId" :label="item.name"
                               :value="item.tenantId"></el-option>
                  </el-select>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term"><em>*</em>运输时效：</label>
                <div class="input-text">
                  <el-input v-model="quoteInfo.transportTimeliness" v-mynumval placeholder="请输入以小时为单位的数值" type="text"
                            autocomplete="new-password"></el-input>
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item100">
                    <label class="label-term"><em>*</em>起始地：</label>
                    <div class="input-text">
                        <el-radio-group v-model="redio1" class="fl" @change="changeRedio1">
                            <el-radio-button label="作业点"></el-radio-button>
                            <el-radio-button label="省市区"></el-radio-button>
                        </el-radio-group>
                        <el-select v-model="quoteInfo.beginWorkId" placeholder="请选择起始地" filterable clearable @change="changeWorkSelect" v-show="showBeginWork">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                        <mycity ref="quoteCity" selectType="3" v-show="!showBeginWork"></mycity>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>目的地：</label>
                    <div class="input-text">
                        <el-radio-group v-model="redio2"  @change="changeRedio2">
                            <el-radio-button label="作业点"></el-radio-button>
                            <el-radio-button label="省市区"></el-radio-button>
                        </el-radio-group>
                        <span class="innerLabel" v-show="!showEndWork">省：</span>
                        <el-select v-model="quoteInfo.endProvinceId" placeholder="" filterable @change="changeProvinceSelect" v-show="!showEndWork">
                            <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                       :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                        <span class="innerLabel" v-show="!showEndWork">市：</span>
                        <el-select v-model="quoteInfo.endCityId" placeholder="" filterable @change="changeCitySelect" v-show="!showEndWork">
                            <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                       :value="item.id" :disabled="item.disabled"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item100" v-show="showEndDistrict && !showEndWork">
                    <label class="label-term">区县</label>
                    <div class="input-text">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="item in districtData" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </li>
            </ul>
        </div>
        <div class="dbTableFilter clearfix" v-show="showEndWork">
            <div class="remark">
                <h3 class="title">可选目的地</h3>
                <label>名称：<el-input type="text" v-model="loadParam.workName"></el-input></label>
                <label>地址：<el-input type="text" v-model="loadParam.workAddress"></el-input></label>
                <el-button size="mini" type="primary" @click="doQuery()">查询</el-button>
                <span class="num">{{leftDataLength}}</span>
            </div>
            <div class="remark fr">
                <h3 class="title">可选目的地</h3>
                <span class="num">{{rightDataLength}}</span>
            </div>
        </div>
        <dbTable tableName="addQuoteManageLDTable" ref="table" :head="head" onlyId="workId" v-show="showEndWork" @dataChange="dataChange"></dbTable>
        <div class="table_height">
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="1200" colspan="14">提送货费</th>
                    <th width="600" colspan="7">运费</th>
                </tr>
                <tr>
                    <th colspan="4">提货费/按重量/kg</th>
                    <th colspan="3">提货费/按体积</th>
                    <th colspan="4">送货费/按重量/kg</th>
                    <th colspan="3">送货费/按体积/m³</th>
                    <th colspan="4">按重量计费/kg</th>
                    <th colspan="3">按体积计费/m³</th>
                </tr>
                <tr>
                    <th>&gt;</th>
                    <th>≤</th>
                    <th>净重价格/元</th>
                    <th>毛重价格/元</th>

                    <th>&gt;</th>
                    <th>≤</th>
                    <th>价格/元</th>

                    <th>&gt;</th>
                    <th>≤</th>
                    <th>净重价格/元</th>
                    <th>毛重价格/元</th>

                    <th>&gt;</th>
                    <th>≤</th>
                    <th>价格/元</th>

                    <th>&gt;</th>
                    <th>≤</th>
                    <th>净重价格/元</th>
                    <th>毛重价格/元</th>

                    <th>&gt;</th>
                    <th>≤</th>
                    <th>价格/元</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in quoteFeeData" :key="index">
                    <td>{{item.beginPickupWeight}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endPickupWeight" @blur="changeFeeInput(1,item.endPickupWeight,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.pickupNetWeightFee"></el-input>
                    </td>
                    <td>
                      <el-input type="text" v-mydouble4val v-model="item.pickupGrossWeightFee"></el-input>
                    </td>

                    <td>{{item.beginPickupVolume}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endPickupVolume" @blur="changeFeeInput(2,item.endPickupVolume,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.pickupVolumeFee"></el-input>
                    </td>

                    <td>{{item.beginDeliveryWeight}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endDeliveryWeight" @blur="changeFeeInput(3,item.endDeliveryWeight,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.deliveryNetWeightFee"></el-input>
                    </td>
                    <td>
                      <el-input type="text" v-mydouble4val v-model="item.deliveryGrossWeightFee"></el-input>
                    </td>

                    <td>{{item.beginDeliveryVolume}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endDeliveryVolume" @blur="changeFeeInput(4,item.endDeliveryVolume,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.deliveryVolumeFee"></el-input>
                    </td>

                    <td>{{item.beginFreightWeight}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endFreightWeight" @blur="changeFeeInput(5,item.endFreightWeight,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.freightNetWeightFee"></el-input>
                    </td>
                    <td>
                      <el-input type="text" v-mydouble4val v-model="item.freightGrossWeightFee"></el-input>
                    </td>

                    <td>{{item.beginFreightVolume}}</td>
                    <td>
                        <el-input type="text" v-mynumval v-model="item.endFreightVolume" @blur="changeFeeInput(6,item.endFreightVolume,index)"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-mydouble4val v-model="item.freightVolumeFee"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="bot-btn">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="addQuote()">提交</el-button>
        </div>
    </div>
</template>

<script>
    import addSupplierQuoteLD from './addSupplierQuoteLD.js'

    export default addSupplierQuoteLD
</script>
<style lang="scss">
    .addQuoteManageLDPage {
        background: #fff;
        border: $border;

        .el-radio-group {
            position: relative;
            z-index: 2;
            vertical-align: top;
        }

        .table_height {
            overflow: auto;
            height: 300px;
            border-bottom: $border;
        }

        .common-info .content > .item .input-text {
            .innerLabel {
                margin: 0 10px 0 20px;
            }

            .el-select, .el-input {
                width: 150px;
            }
        }
        .dbTableFilter{
            margin-top: 20px;
            .remark{
                background: #2d3a4b;
                line-height: 36px;
                padding: 0 20px;
                width: 49%;
                color:#fff;
                float: left;
                box-sizing: border-box;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                .title{
                    font-size: 14px;
                    margin-right: 20px;
                    color:#fff;
                    line-height: 36px;
                    float: left;
                }
                label{
                    float: left;
                    margin-right: 10px;
                    .el-input{
                        width: 80px;
                    }
                    .el-input__inner{
                        height: 24px;
                        padding:0 8px;
                    }
                }
                .num{
                    float:right;
                }
            }
        }
    }
</style>
