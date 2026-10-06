<template>
    <div id="costList" class="clearfix infoTable" style="padding-top: 5px">
        <h3 class="common-title mt_20">
            <span class="title-name">短驳配送成本</span>
        </h3>
        <div class="innerTable" style="width: 100%;overflow-x: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="50">序号</th>
                    <th width="150">费用类型</th>
                    <th width="150">作业名称</th>
                    <th width="100">计费单位</th>
                    <th width="100">外包作业</th>
                    <th width="250">外包供应商</th>
                    <th width="100">未税单价</th>
                    <th width="100">税率(%)</th>
                    <th width="100">含税价</th>
                    <th width="100">配送数量</th>
                    <th width="100" v-if="isReturn==1&&type==2"><em>*</em>返程数量</th>
                    <th width="100" v-if="isReturn==1&&type==2">合计数量</th>
                    <th width="100">未税金额</th>
                    <th width="100">含税金额</th>
                    <th width="100">托面积合计(m²)</th>
                    <th width="100">托面积占比(%)</th>
                    <th width="100">实际成本</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in costList">
                    <td>{{index + 1}}</td>
                    <td>{{ item.itemTypeName }}</td>
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.unit }}</td>
                    <td>
                        <el-switch v-model="item.isWorkOrder == 1"
                                   @change="changeCostSwitch(item, index)"
                                   :disabled="item.disabled && item.flag"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-text="是"
                                   inactive-text="否">
                        </el-switch>
                    </td>
                    <td>
                        <el-select v-model="item.tenantId" placeholder="请选择供应商" filterable
                                   :disabled="item.disabled"
                                   @change="changeSupplier(item, index)">
                            <el-option v-for="supplier in item.supplierData" :key="supplier.tenantId"
                                       :label="supplier.tenantName"
                                       :value="supplier.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.price" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.tax" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.priceWithTax" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.num" type="text" v-mydouble4val
                                  :placeholder="item.disabled ? '' : '请输入数量'"
                                  @input="changeNum(item, index)" :disabled="item.disabled || item.unitDisabled"></el-input>
                    </td>
                    <td v-if="isReturn==1&&type==2">
                      <el-input v-model="item.returnNums" @input="changeCostItemReturnNums(item, index)" :disabled="item.unitDisabled"></el-input>
                    </td>
                    <td v-if="isReturn==1&&type==2">{{ item.totalNum }}</td>
                    <td>
                        <el-input v-model="item.totalFee" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.totalFeeWithTax" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.palletNumsSum" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.palletNumsPercent" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.actualCost" type="text" disabled></el-input>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red">{{ total.costNum }}</td>
                    <td class="red" v-if="isReturn==1&&type==2">{{ total.costReturnNums }}</td>
                    <td class="red" v-if="isReturn==1&&type==2">{{ total.costTotalNum }}</td>
                    <td class="red">{{ total.costTotalFee }}</td>
                    <td class="red">{{ total.costTotalFeeWithTax }}</td>
                    <td class="red">{{ total.palletNumsSum }}</td>
                    <td class="red"></td>
                    <td class="red">{{ total.actualCost }}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
import costList from './costList.js'

export default costList
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
