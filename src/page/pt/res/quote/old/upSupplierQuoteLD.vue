<template>
    <div id="upSupplierQuoteLD" class="addQuoteManageLDPage">
        <div class="common-info" style="border:none;padding-bottom:0;">
            <ul class="content clearfix">
                <li class="item item100">
                    <div class="input-text">
                        <el-input v-model="quoteInfo.beginAddress" placeholder="起始地" type="text" disabled
                                  autocomplete="new-password"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <div class="input-text">
                        <el-input v-model="quoteInfo.endAddress" placeholder="目的地" type="text" disabled
                                  autocomplete="new-password"></el-input>
                    </div>
                </li>

            </ul>
        </div>
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
                <tr v-for="(item,index) in quoteFeeData">
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
    import upSupplierQuoteLD from './upSupplierQuoteLD.js'

    export default upSupplierQuoteLD
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
            min-height: 300px;
            margin-top: 30px;
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
    }
</style>
