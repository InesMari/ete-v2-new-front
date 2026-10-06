<template>
    <div id="addStockInventory" class="warehousingDetailPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">盘点单基础信息</span></h3>
            <table class="fillTbale">
                <tr>
                    <td class="label">盘点人</td>
                    <td class="value">
                        <el-select v-model="info.inventoryUserId" placeholder="请选择盘点人" filterable clearable>
                            <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                                       :value="item.userId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">盘点日期</td>
                    <td class="value" style="width: 180px;">
                        <el-date-picker v-model="info.inventoryDate" type="datetime" class="tl" placeholder="盘点日期"
                                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </td>
                    <td class="label">备注</td>
                    <td class="value" colspan="3">
                        <el-input v-model="info.inventoryRemark" placeholder="备注" type="text"></el-input>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">盘点明细</span>
                <el-button  class="fr" size="mini" type="primary" @click="oneButtonConfirm">一键确认</el-button>
                <el-button  class="fr mr_10" size="mini" type="primary" @click="downloadExcelFile">导出excel</el-button>
            </h3>
            <div ref="scrollView" style="max-height:500px;overflow: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="90">序号</th>
                    <th width="180"><em>*</em>物料编码</th>
                    <th width="130">物料描述</th>
                    <th width="130"><em>*</em>批次号</th>
                    <th width="130">供应商批次号</th>
                    <th width="130">ASN</th>
                    <th width="150"><em>*</em>规格</th>
                    <th width="130">生产日期</th>
<!--                    <th width="180"><em>*</em>入库时间</th>-->
                    <th width="130"><em>*</em>库区</th>
                    <th width="100"><em>*</em>库位</th>
                    <th width="100">管理单位</th>
                    <th width="80">库存数量</th>
                    <th width="80">预占数量</th>
                    <th width="80">库存箱数</th>
                    <th width="80">库存托数</th>
                    <th width="100">库存数量差异</th>
                    <th width="100"><em>*</em>盘点数量</th>
<!--                    <th width="200">盘盈盘亏条码</th>-->
<!--                    <th width="200">每张条码数量</th>-->
                    <th width="100">盘点箱数</th>
                    <th width="100">盘点托数</th>
                    <th width="100">盘盈盘亏</th>
                    <th width="300">备注</th>
                    <th width="50" v-if="!disable" >
                        <el-tooltip effect="dark" content="添加库存" placement="top-start" :hide-after='1000'>
                            <span @click="add()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in stockList">
                    <td>
                        {{index + 1}}
                    </td>
                    <td :title="item.materialNum">
                        <el-select v-model="item.materialId" @change="changeMaterial(item, index, false)" :disabled="disable" filterable clearable placeholder="请选择物料编码" >
                            <el-option v-for="data in materialList" :key="data.materialId" :label="data.materialNum" :value="data.materialId"/>
                        </el-select>
                    </td>
                    <td :title="item.materialDesc">
                        {{item.materialDesc}}
                    </td>
                    <td :title="item.batchNum">
                        <select :value="item.batchNum" @change="changeBatchNum(item, index, false, $event)" filterable clearable :disabled="disable"  placeholder="请选择批次号" >
                            <option v-for="data in item.batchNumList" :key="data.batchNum" :label="data.batchNum" :value="data.batchNum" :disabled="data.disabled"/>
                        </select>
                    </td>
                    <td :title="item.supplierBatchNum">
                        <select :value="item.supplierBatchNum" @change="changeSupplierBatchNum(item, index, false, $event)" filterable clearable :disabled="disable"  placeholder="请选择供应商批次号" >
                            <option v-for="data in item.supplierBatchNumList" :key="data.supplierBatchNum" :label="data.supplierBatchNum" :value="data.supplierBatchNum" :disabled="data.disabled"/>
                        </select>
                    </td>
                    <td :title="item.asn">
                        <select :value="item.asn" @change="changeAsn(item, index, false, $event)" filterable clearable :disabled="disable"  placeholder="请选择ASN" >
                            <option v-for="data in item.asnList" :key="data.asn" :label="data.asn" :value="data.asn" :disabled="data.disabled"/>
                        </select>
                    </td>
                    <td :title="item.specsName">
                        <select :value="item.materialSpecsId" @change="changeMaterialSpecs(item, index, false, $event)" :disabled="disable"  filterable clearable placeholder="请选择规格" >
                            <option v-for="data in item.materialSpecsList" :key="data.materialSpecsId" :label="data.specsName" :value="data.materialSpecsId"/>
                        </select>
                    </td>
                    <td :title="item.produceDate">
                        <select :value="item.produceDate" @change="changeProduceDate(item, index, false, $event)" clearable :disabled="disable"  placeholder="请选择生产日期" >
                            <option v-for="data in item.produceDateList" :key="data.produceDate" :label="data.produceDate" :value="data.produceDate"/>
                        </select>
                    </td>
<!--                    <td :title="item.inDate">-->
<!--                        <select :value="item.inDate" @change="changeInDate(item, index, false)" clearable placeholder="请选择入库日期" >-->
<!--                            <option v-for="data in item.inDateList" :key="data.inDate" :label="data.inDate" :value="data.inDate"/>-->
<!--                        </select>-->
<!--                    </td>-->
                    <td :title="item.reservoirName">
                        <select :value="item.reservoirId" @change="changeReservoir(item, index, false, $event)" filterable clearable :disabled="disable"  placeholder="请选择原库区" >
                            <option v-for="data in item.reservoirList" :key="data.reservoirId" :label="data.reservoirName" :value="data.reservoirId"/>
                        </select>
                    </td>
                    <td :title="item.storageCode">
                        <select :value="item.storageId" @change="changeStorage($event, item, index)" filterable clearable :disabled="disable"  placeholder="请选择原库位" >
                            <option v-for="data in item.storageList" :key="data.storageId" :label="data.storageCode" :value="data.storageId"/>
                        </select>
                    </td>
                    <td :title="item.unitName">
                        {{item.unitName}}
                    </td>
                    <td :title="item.storeNums">
                        {{item.storeNums}}
                    </td>
                    <td :title="item.expectNums">
                        {{item.expectNums}}
                    </td>
                    <td :title="item.boxNums">
                        {{item.boxNums}}
                    </td>
                    <td :title="item.palletNums">
                        {{item.palletNums}}
                    </td>
                    <td :id="'diffNumsDom'+index">
                        {{item.diffNums}}
                    </td>
                    <td :title="item.inventoryNums">
                        <input :value="item.inventoryNums" @input="changeInventoryNums($event, item, index)" type="text" v-mydouble4valNoBlur placeholder="盘点数量"/>
                    </td>
<!--                    <td>-->
<!--                        <input :value="item.qrcodes" type="text" placeholder="多条条码使用,分隔！"/>-->
<!--                    </td>-->
<!--                    <td>-->
<!--                        <input :value="item.perNum" type="text" placeholder="盘盈多条码每张条码数目！" v-mynumval/>-->
<!--                    </td>-->
                    <td :title="item.inventoryBoxNums">
                        <input :value="item.inventoryBoxNums" @input="changeValue($event,item,'inventoryBoxNums')" type="text" v-mynumval placeholder="盘点箱数"/>
                    </td>
                    <td :title="item.inventoryPalletNums">
                        <input :value="item.inventoryPalletNums" @input="changeValue($event,item,'inventoryPalletNums')" type="text" v-mynumval placeholder="盘点托数"/>
                    </td>
                    <td>
                        <select :value="item.inventoryState" disabled :id="'inventoryState'+index">
                            <option v-for="data in inventoryStateData" :key="data.codeValue" :label="data.codeName" :value="data.codeValue"/>
                        </select>
                    </td>
                    <td :title="item.remark">
                        <input :value="item.remark" type="text" @input="changeValue($event,item,'remark')" placeholder="请输入盘点备注" />
                    </td>
                    <td v-if="!disable" >
                        <el-tooltip effect="dark" content="删除库存" placement="top-start" :hide-after='1000'>
                            <span @click="remove(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计:</td>
                    <td></td><!--物料编码-->
                    <td></td><!--物料描述-->
                    <td></td><!--批次号-->
                    <td></td><!--供应商批次号-->
                    <td></td><!--ASN-->
                    <td></td><!--规格-->
                    <td></td><!--生产日期-->
<!--                    <td></td>&lt;!&ndash;入库时间&ndash;&gt;-->
                    <td></td><!--库区-->
                    <td></td><!--库位-->
                    <td></td><!--管理单位-->
                    <td></td><!--库存数量-->
                    <td></td><!--预占数量-->
                    <td></td><!--库存箱数-->
                    <td></td><!--库存托数-->
                    <td></td><!--库存数量差异-->
                    <td style="color: red"></td><!--盘点数量-->
<!--                    <td></td>&lt;!&ndash;盘盈盘亏条码&ndash;&gt;-->
<!--                    <td></td>&lt;!&ndash;每张条码数量&ndash;&gt;-->
                    <td></td><!--盘点箱数-->
                    <td></td><!--盘点托数-->
                    <td></td><!--盘盈盘亏-->
                    <td></td><!--备注-->
                    <td v-if="!disable" ></td>
                </tr>
                </tfoot>
            </table>
            </div>

            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="saveOrUpdateWmsStockInventory()" v-if="!disable" >保存</el-button>
                <el-button type="primary" @click="inventoryWmsStock()" v-if="disable" >保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addStockInventory from './addStockInventory.js'

export default addStockInventory
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
    .add{
        vertical-align: middle;
        @include add;
    }
    .del{
        vertical-align: middle;
        @include del;
    }
    .el-input__inner{
        text-align: center;
    }
    .tableCommon{
        input,select{
            display: block;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            border:$border;
            height: 28px;
            border-radius: 5px;
        }
    }
}

</style>
