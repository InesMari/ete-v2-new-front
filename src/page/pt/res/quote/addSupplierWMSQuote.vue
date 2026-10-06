<template>
    <div id="addSupplierWMSQuote" class="addSupplierWMSQuote">
        <div class="common-info search-info" style="border:none;padding-bottom:0;">
            <ul class="content clearfix" style="margin-bottom: 10px;">
                <li class="item" style="width: 31%;">
                    <label class="label-term"><em>*</em>供应商：</label>
                    <div class="input-text">
                        <el-select v-model="quote.tenantId" clearable filterable placeholder="选择供应商">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item" style="width: 31%;">
                    <label class="label-term"><em>*</em>起始地：</label>
                    <div class="input-text">
                        <el-select v-model="quote.beginWorkId" @change="changeBeginWork" clearable filterable placeholder="请选择起始地">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item" style="width: 31%;">
                    <label class="label-term"><em>*</em>目的地：</label>
                    <div class="input-text">
                        <el-select v-model="quote.endWorkId" clearable filterable  placeholder="请选择目的地">
                            <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="margin-bottom: 10px;">
              <li class="item"  style="width: 31%;">
                <label class="label-term"><em>*</em>生效日期：</label>
                <div class="input-text">
                  <el-date-picker
                      v-model="quote.effectDate"
                      type="date" value-format="yyyy-MM-dd"
                      placeholder="选择生效日期">
                  </el-date-picker>
                </div>
              </li>
              <li class="item"  style="width: 31%;">
                <label class="label-term"><em>*</em>失效日期：</label>
                <div class="input-text">
                  <el-date-picker
                      v-model="quote.expireDate"
                      type="date" value-format="yyyy-MM-dd"
                      placeholder="选择失效日期">
                  </el-date-picker>
                </div>
              </li>
                <li class="item"  style="width: 31%;">
                    <label class="label-term">备注</label>
                    <div class="input-text">
                        <el-input v-model="quote.remark"></el-input>
                    </div>
                </li>
            </ul>
        </div>
        <div class="table_height" style="margin-left: 20px;">
            <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">注：选择按月时不区分目的地，且只能一条包月记录！</div>
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>计费方式</th>
                        <th>报价车型</th>
                        <th>车长</th>
                        <th>单价金额</th>
                        <th>返程单价金额</th>
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
                            <el-select v-model="item.vehicleLength" @change="changeVehicleLength(item)" :disabled="item.disabledVehicleLength" filterable multiple clearable placeholder="请选择车长">
                                <el-option v-for="v in item.vehicleLengthData" :key="v.codeValue" :label="v.codeName" :value="v.codeValue" :disabled="v.disabled"></el-option>
                            </el-select>
                        </td>
                        <td><el-input v-model="item.feePrice" v-mydouble5val maxlength="15"></el-input></td>
                        <td><el-input v-model="item.returnFeePrice" v-mydouble5val maxlength="15"></el-input></td>
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

        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="submit()">提交</el-button>
        </div>
    </div>
</template>


<script>
    import addSupplierWMSQuote from './addSupplierWMSQuote.js'
    export default addSupplierWMSQuote
</script>
<style lang="scss">
    .addSupplierWMSQuote{
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
            .switchDiv {
                padding: 2px 8px;
                border: 1px solid $main-color;
                border-radius: 3px;
                color: $main-color;
                display: inline-block;
                margin-left: 10px;
                vertical-align: top;
                cursor: pointer;

                .name {
                    vertical-align: middle;
                    margin-left: 8px;
                }

                // &:hover{
                //   color: #fff;
                //   background: $main-color;
                // }
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
