<template>
    <div id="wmsAllocatMaterialManage">
      <select-work v-show="showSelWork"></select-work>
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">物料编码：</label>
                    <div class="input-text">
                        <el-input v-model="query.materialNum" placeholder="物料编码" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="到货厂商" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">批次号：</label>
                    <div class="input-text">
                        <el-input v-model="query.batchNum" placeholder="批次号" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>

        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>移库单列表</span>
                    <el-tooltip effect="light" content="移库单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain @click="showAllocat(true)" size="mini" v-entity="1005037">移库操作</el-button>-->
                    <el-button type="primary" plain @click="go()" size="mini" v-entity="1005038">打印移库单</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsAllocatMaterialManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 调拨 开始-->
        <el-dialog class="allocatDialog" title="移库操作" :visible.sync="allocatShow" width="95%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showAllocat(false)">
            <div class="common-info" style="border:none;padding:0;">
                <div style="overflow-x:auto;">
                <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="180"><em>*</em>物料编码</th>
                            <th width="130"><em>*</em>批次号</th>
                            <th width="130">供应商批次号</th>
                            <th width="130">ASN</th>
                            <th width="130">物料描述</th>
                            <th width="150"><em>*</em>规格</th>
                            <th width="130">生产日期</th>
<!--                            <th width="180"><em>*</em>入库时间</th>-->
                            <th width="80">库存数量</th>
                            <th width="100">管理单位</th>
                            <th width="130"><em>*</em>原库区</th>
                            <th width="100"><em>*</em>原库位</th>
                            <th width="130"><em>*</em>新库区</th>
                            <th width="100"><em>*</em>新库位</th>
                            <th width="110"><em>*</em>移库数量</th>
                            <th width="140">移库备注</th>
                            <th width="100">是否冻结</th>
                            <th width="50">
                                <el-tooltip effect="dark" content="添加库存" placement="top-start" :hide-after='1000'>
                                    <span @click="add()" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in allocatList">
                        <td :title="item.materialNum">
                            <el-select v-model="item.materialId" @change="changeMaterial(item, index, false)" filterable clearable placeholder="请选择物料编码" :disabled="isOnlySee">
                                <el-option v-for="data in materialList" :key="data.materialId" :label="data.materialNum" :value="data.materialId"/>
                            </el-select>
                        </td>
                        <td :title="item.batchNum">
                            <el-select v-model="item.batchNum" @change="changeBatchNum(item, index, false)" filterable clearable placeholder="请选择批次号" :disabled="isOnlySee">
                                <el-option v-for="data in item.batchNumList" :key="data.batchNum" :label="data.batchNum" :value="data.batchNum" :disabled="data.disabled"/>
                            </el-select>
                        </td>
                        <td :title="item.supplierBatchNum">
                            <el-select v-model="item.supplierBatchNum" @change="changeSupplierBatchNum(item, index, false)" filterable clearable placeholder="请选择供应商批次号" :disabled="isOnlySee">
                                <el-option v-for="data in item.supplierBatchNumList" :key="data.supplierBatchNum" :label="data.supplierBatchNum" :value="data.supplierBatchNum" :disabled="data.disabled"/>
                            </el-select>
                        </td>
                        <td :title="item.asn">
                            <el-select v-model="item.asn" @change="changeAsn(item, index, false)" filterable clearable placeholder="请选择ASN" :disabled="isOnlySee">
                                <el-option v-for="data in item.asnList" :key="data.asn" :label="data.asn" :value="data.asn" :disabled="data.disabled"/>
                            </el-select>
                        </td>
                        <td :title="item.materialDesc">
                            <el-input v-model="item.materialDesc" type="text" v-mynumval placeholder="物料描述" disabled></el-input>
                        </td>
                        <td :title="item.specsName">
                            <el-select v-model="item.materialSpecsId" @change="changeMaterialSpecs(item, index, false)" filterable clearable placeholder="请选择规格" :disabled="isOnlySee">
                                <el-option v-for="data in item.materialSpecsList" :key="data.materialSpecsId" :label="data.specsName" :value="data.materialSpecsId"/>
                            </el-select>
                        </td>

                        <td :title="item.produceDate">
                            <el-select v-model="item.produceDate" @change="changeProduceDate(item, index, false)" clearable placeholder="请选择生产日期" :disabled="isOnlySee">
                                <el-option v-for="data in item.produceDateList" :key="data.produceDate" :label="data.produceDate" :value="data.produceDate"/>
                            </el-select>
                        </td>
<!--                        <td :title="item.inDate">-->
<!--                            <el-select v-model="item.inDate" @change="changeInDate(item, index, false)" clearable placeholder="请选择入库日期" :disabled="isOnlySee">-->
<!--                                <el-option v-for="data in item.inDateList" :key="data.inDate" :label="data.inDate" :value="data.inDate"/>-->
<!--                            </el-select>-->
<!--                        </td>-->
                        <td :title="item.nums">
                            <el-input v-model="item.nums" type="text" v-mydouble4val placeholder="库存" disabled></el-input>
                        </td>
                        <td :title="item.unitName">
                            <el-input v-model="item.unitName" type="text" v-mynumval placeholder="管理单位" disabled></el-input>
                        </td>
                        <td :title="item.reservoirName">
                            <el-select v-model="item.reservoirId" @change="changeReservoir(item, index, false)" filterable clearable placeholder="请选择原库区" :disabled="isOnlySee">
                                <el-option v-for="data in item.reservoirList" :key="data.reservoirId" :label="data.reservoirName" :value="data.reservoirId"/>
                            </el-select>
                        </td>
                        <td :title="item.storageCode">
                            <el-select v-model="item.storageId" @change="changeStorage(item, index)" filterable clearable placeholder="请选择原库位" :disabled="isOnlySee">
                                <el-option v-for="data in item.storageList" :key="data.storageId" :label="data.storageCode" :value="data.storageId"/>
                            </el-select>
                        </td>

                        <td :title="item.reservoirName">
                            <el-select v-model="item.toReservoirId" @change="loadStorageListByReservoirId(item, index)" filterable clearable placeholder="请选择新库区" :disabled="isOnlySee">
                                <el-option v-for="data in newReservoirList" :key="data.reservoirId" :label="data.reservoirName" :value="data.reservoirId"/>
                            </el-select>
                        </td>
                        <td :title="item.storageCode">
                            <el-select v-model="item.toStorageId" @change="changeNewStorage(item)" filterable clearable placeholder="请选择新库位" :disabled="isOnlySee">
                                <el-option v-for="data in item.newStorageList" :key="data.storageId" :label="data.storageCode" :value="data.storageId"/>
                            </el-select>
                        </td>
                        <td :title="item.aNums">
                            <el-input v-model="item.aNums" type="text" v-mydouble4val placeholder="请输入移库数量" @input="changeSum(item)" :disabled="isOnlySee"></el-input>
                        </td>
                        <td :title="item.remark">
                            <el-input v-model="item.remark" type="text" placeholder="请输入移库备注" :disabled="isOnlySee"></el-input>
                        </td>
                        <td>
                            <div class="switchDiv">
                                <el-switch v-model="item.freezeState == 1" @change="changeSwitch(item)" active-color="#13ce66" inactive-color="#ff4949" :disabled="isOnlySee"></el-switch>
                                <span class="name">{{item.freezeState == 1 ? "是" : "否"}}</span>
                            </div>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="删除库存" placement="top-start" :hide-after='1000'>
                                <span @click="remove(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>合计:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="color: red">{{allocat.sum}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                </div>
                <div class="page-bot-btn" style="margin-top: 15px">
                    <el-button size="mini" @click="showAllocat(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureRecord()">确认移库</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 调拨 结束-->

    </div>
</template>

<script>
import wmsAllocatMaterialManage from './wmsAllocatMaterialManage.js'

export default wmsAllocatMaterialManage
</script>
<style lang="scss">
#wmsAllocatMaterialManage {
    .el-dialog__body{
        padding: 10px 15px 20px !important;
    }
    .allocatDialog{
        .tableCommon{
            border:$border;
            table-layout: fixed;
        }
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
}
</style>
