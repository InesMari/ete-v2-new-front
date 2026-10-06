<template>
    <div id="addSupplierQuoteZC" class="addQuoteZC">
        <div class="common-info search-list clearfix" style="border:none;padding-bottom:0;">
            <ul class="content clearfix" style="margin-bottom: 10px;">
                <li class="item">
                    <label class="label-term"><em>*</em>供应商：</label>
                    <div class="input-text">
                        <el-select v-model="form.tenantId" @change="" filterable clearable placeholder="选择供应商">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">指定客户：</label>
                    <div class="input-text">
                        <el-select v-model="form.specifyTenantId" @change="changeSpecifyTenant" clearable placeholder="选择客户" filterable>
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">运输时效：</label>
                    <div class="input-text">
                        <el-input v-model="form.transportTimeliness" v-mynumval placeholder="请输入以小时为单位的数值" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item" style="width: 40%">
                    <label class="label-term"><em>*</em>起始地：</label>
                    <div class="input-text">
                        <el-radio-group v-model="radio1" class="fl" @change="selectRadio(true)">
                            <el-radio-button label="1" >作业点</el-radio-button>
                            <el-radio-button label="2" >省市区</el-radio-button>
                        </el-radio-group>
                        <el-select v-model="form.beginWorkId" style="width: 250px;" filterable clearable @change="chengeWork" v-show="showBeginWorkSelect" placeholder="请选择作业点">
                            <el-option
                                    v-for="item in workData"
                                    :key="item.workId"
                                    :label="item.workName"
                                    :value="item.workId"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <mycity ref="beginCity" selectType="3" @selectCallback="selectBeginCallback" class="mycity fl" v-show="showBeginCity" placeholder="请选择省市区"></mycity>
                    </div>
                </li>
                <li class="item" style="width: 50%">
                    <label class="label-term"><em>*</em>目的地：</label>
                    <div class="input-text">
                        <el-radio-group v-model="radio2" class="fl" @change="selectRadio(false)">
                            <el-radio-button label="1" >作业点</el-radio-button>
                            <el-radio-button label="2" >省市区</el-radio-button>
                        </el-radio-group>
                        <el-select v-model="form.endWorkId" style="width: 250px;" filterable clearable @change="chengeWork" v-show="showEndWorkSelect" placeholder="请选择作业点">
                            <el-option
                                    v-for="item in workData"
                                    :key="item.workId"
                                    :label="item.workName"
                                    :value="item.workId"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <mycity ref="endCity" selectType="3" @selectCallback="selectEndCallback" class="mycity fl" v-show="showEndCity" placeholder="请选择省市区"></mycity>
                    </div>
                </li>
            </ul>
            <em class="fw">注：计费方式按毛重、净重、体积时价格为计费单价，按整车时为运费！</em>
        </div>
        <div class="table_height" style="margin-left: 20px;">
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>操作</th>
                        <th>报价车型</th>
                        <th>车长</th>
                        <th>计费方式</th>
                        <th>价格/元</th>
                        <th>点位费单价/元</th>
                        <th style="background-color: #fff;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in array">
                        <td>{{index + 1}}</td>
                        <td><a href="javascript:void(0);" @click="removeItem(index)">删除</a></td>
                        <td><el-select v-model="item.quoteVehicleType" placeholder="请选择" filterable clearable>
                            <el-option
                                    v-for="v in quoteVehicleTypeData"
                                    :key="v.codeValue"
                                    :label="v.codeName"
                                    :value="v.codeValue">
                            </el-option>
                        </el-select></td>
                        <td><el-select v-model="item.vehicleLength" placeholder="请选择" filterable clearable>
                            <el-option
                                    v-for="v in vehicleLengthData"
                                    :key="v.codeValue"
                                    :label="v.codeName"
                                    :value="v.codeValue">
                            </el-option>
                        </el-select></td>

                        <td ><el-select v-model="item.billingType" clearable placeholder="请选择">
                            <el-option
                                    v-for="b in billingTypeData"
                                    :key="b.codeValue"
                                    :label="b.codeName"
                                    :value="b.codeValue">
                            </el-option>
                        </el-select></td>
                        <td><el-input v-model="item.feePrice" v-mydouble4val maxlength="19"></el-input></td>
                        <td><el-input v-model="item.pointFee" v-mydouble4val maxlength="19"></el-input></td>
                        <td style="border-bottom:0;text-align: left;"><el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addItem" v-show="index === array.length - 1"></el-button></td>
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
    import addSupplierQuoteZC from './addSupplierQuoteZC.js'
    export default addSupplierQuoteZC
</script>
<style lang="scss">
    .addSupplierQuoteZC{
        background: #fff;
        border:$border;
        .el-radio-group{
            position: relative;
            z-index: 2;
            vertical-align: top;
        }
        .table_height{
            overflow: auto;
            min-height: 300px;
            margin-top: 30px;
            border-bottom:$border;
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
