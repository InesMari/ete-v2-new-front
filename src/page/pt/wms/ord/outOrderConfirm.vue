<template>
    <div id="outOrderConfirm" class="warehousingDetailPage">
        <innerTab v-if="hasNewQrcode" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div class="common-info" v-show="showType == 1">
          <!--            基础信息-->
          <h3 class="common-title" style="margin-top: -20px;" >
            <span class="title-name">基础信息</span>
            <span class="orderNum">出库单号：{{ info.outOrderNum }}</span>
          </h3>
          <table class="fillTbale">
            <tr>
              <td class="label">出库类型</td>
              <td class="value">{{ info.orderTypeName }}</td>
              <td class="label">货主</td>
              <td class="value">{{ info.srcTenantName?info.srcTenantName:'-' }}</td>
              <td class="label">送货地址</td>
              <td class="value">{{ info.workName }}</td>
              <td class="label">要求出库时间</td>
              <td class="value">{{ info.requireOutDate }}</td>
            </tr>
            <tr>
              <td class="label">是否退货</td>
              <td class="value">{{ info.rejectedStateName }}</td>
              <td class="label">是否自提</td>
              <td class="value">{{ info.selfPickupName }}</td>
              <td class="label">是否紧急</td>
              <td class="value">{{ info.isEmergencyName }}</td>
              <td class="label">客户单号</td>
              <td class="value">{{ info.custOrderNum }}</td>
            </tr>
            <tr>
              <td class="label">要求送达时间</td>
              <td class="value">{{ info.requireDoneTime }}</td>
              <td class="label">抛单时间</td>
              <td class="value">{{ info.deliverOrderTime }}</td>
              <td class="label" v-show="info.timeoutReason">超时原因</td>
              <td class="value" v-show="info.timeoutReason">{{info.timeoutReasonName}}</td>
              <td class="label">出库单备注</td>
              <td class="value" :colspan="info.timeoutReason?1:3">{{ info.remark }}</td>
            </tr>
          </table>
          <!--            基础信息-->

<!--            <h3 class="common-title"><span class="title-name">要求发货情况</span></h3>-->
            <!--            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">-->
            <!--                <thead>-->
            <!--                <tr>-->
            <!--                    <th width="150">到货厂商</th>-->
            <!--                    <th width="120">物料编码</th>-->
            <!--                    <th width="100">物料描述</th>-->
            <!--                    <th width="120">规格</th>-->
            <!--                    <th width="80">库存数量</th>-->
            <!--                    <th width="80">出库数量</th>-->
            <!--                    <th width="80">管理单位</th>-->
            <!--                    <th width="80">箱数</th>-->
            <!--                    <th width="80">托数</th>-->
            <!--                    <th width="120">卸货点</th>-->
            <!--                </tr>-->
            <!--                </thead>-->
            <!--                <tbody>-->
            <!--                <tr v-for="(item) in materialList">-->
            <!--                    <td>{{ item.fromTenantName }}</td>-->
            <!--                    <td>{{ item.materialNum }}</td>-->
            <!--                    <td>{{ item.materialDesc }}</td>-->
            <!--                    <td>{{ item.materialSpecsName }}</td>-->
            <!--                    <td>{{ item.stockNums }}</td>-->
            <!--                    <td>{{ item.nums }}</td>-->
            <!--                    <td>{{ item.unitName }}</td>-->
            <!--                    <td>{{ item.boxNums }}</td>-->
            <!--                    <td>{{ item.palletNums }}</td>-->
            <!--                    <td>{{ item.workDetailName }}</td>-->
            <!--                </tr>-->
            <!--                </tbody>-->
            <!--                <tfoot>-->
            <!--                <tr>-->
            <!--                    <td>合计：</td>-->
            <!--                    <td></td>-->
            <!--                    <td></td>-->
            <!--                    <td></td>-->
            <!--                    <td></td>-->
            <!--                    <td class="red fw">{{ totalInfo.nums }}</td>-->
            <!--                    <td></td>-->
            <!--                    <td class="red fw">{{ totalInfo.boxNums }}</td>-->
            <!--                    <td class="red fw">{{ totalInfo.palletNums }}</td>-->
            <!--                    <td></td>-->
            <!--                </tr>-->
            <!--                </tfoot>-->
            <!--            </table>-->

            <h3 class="common-title mt_20" v-show="show1"><span class="title-name">出库物料情况</span>
                <!--                <div class="item clearfix">-->
                <!--                    <label class="label fl" style="line-height: 40px;">拣货策略：</label>-->
                <!--                    <div class="input-text fl">-->
                <!--                        <el-select v-model="tacticsId" @change="doTactics" clearable :disabled="type != 2"-->
                <!--                                   placeholder="拣货策略">-->
                <!--                            <el-option v-for="item in tacticsData" :key="item.id" :label="item.name"-->
                <!--                                       :value="item.id"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </div>-->
                <!--                </div>-->
            </h3>
            <div style="overflow-x: auto">
                <table class="tableCommon" ref="orderDetail" width="100%" border="0" cellspacing="0" cellpadding="0"
                       v-show="show1">
                    <thead>
                    <tr>
                        <th width="90">序号</th>
                        <th width="150">批次号</th>
                        <th width="150">供应商批次号</th>
                        <th width="100">ASN</th>
                        <th width="250" v-show="info.orderType==2">货主</th>
                        <th width="250">到货厂商</th>
                        <th width="120">物料编码</th>
                        <th width="120">物料描述</th>
                        <th width="100">规格</th>
                        <th width="120" v-show="show2||isLiKu==1">生产日期</th>
                        <!--                        <th width="120" v-show="show2">入库日期</th>-->
                        <th width="120" v-show="show2||isLiKu==1">库区</th>
                        <th :width="type == 2&&isLiKu==1?240:120" v-show="show2||isLiKu==1">库位</th>
                        <th width="80">库存数量</th>
                        <th width="80">管理单位</th>
                        <th width="120">卸货点</th>
                        <th width="100">计划出库数量</th>
                        <th width="150">时代条码编号</th>
                        <th width="100" v-show="show2"><em>*</em>实际出库数量</th>
                        <th width="100" v-show="show2"><em>*</em>实际出库箱数</th>
                        <th width="100" v-show="show2"><em>*</em>实际出库拖数</th>
                        <th width="50" v-show="type == 2">
                            <el-tooltip effect="dark" content="添加库存" placement="top-start" :hide-after='1000'>
                                <span @click="addDealMaterial(dealMaterialData.length - 1)" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in dealMaterialData">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td>
                            <el-select v-model="item.batchNum" @change="changeBatchNum(index)" filterable clearable
                                       :disabled="show2" placeholder="请选择批次号">
                                <el-option v-for="data in batchNumList" :key="data.batchNum" :label="data.batchNum"
                                           :value="data.batchNum"/>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.supplierBatchNum" @change="initAsnList(index)"
                                       filterable clearable :disabled="show2" placeholder="请选择供应商批次号">
                                <el-option v-for="data in item.supplierBatchNumList" :key="data.supplierBatchNum"
                                           :label="data.supplierBatchNum" :value="data.supplierBatchNum"/>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.asn" @change="initFromTenantList(index)"
                                       filterable clearable :disabled="show2" placeholder="请选择ASN">
                                <el-option v-for="data in item.asnList" :key="data.asn"
                                           :label="data.asn" :value="data.asn"/>
                            </el-select>
                        </td>
                      <td v-show="info.orderType==2">{{ item.srcTenantName }}</td>
                      <td>
                            <el-select v-model="item.fromTenantId" @change="initMaterialList(index)" clearable
                                       :disabled="show2" placeholder="请选择到货厂商">
                                <el-option v-for="data in item.fromTenantList" :key="data.fromTenantId"
                                           :label="data.fromTenantName" :value="data.fromTenantId"/>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.materialId" @change="initMaterialSpecsList(index)" clearable
                                       :disabled="show2" placeholder="请选择物料编码">
                                <el-option v-for="data in item.materialList" :key="data.materialId"
                                           :label="data.materialNum" :value="data.materialId"/>
                            </el-select>
                        </td>
                        <td>{{ item.materialDesc }}</td>
                        <td>
                            <el-select v-model="item.materialSpecsId" clearable
                                       :disabled="show2" placeholder="请选择规格">
                                <el-option v-for="data in item.materialSpecsList" :key="data.materialSpecsId"
                                           :label="data.specsName" :value="data.materialSpecsId"/>
                            </el-select>
                        </td>
                        <td v-show="show2||isLiKu==1">
                            <el-select v-model="item.produceDate" @change="initReservoirList(index)" clearable
                                       :disabled="show2" placeholder="请选择生产日期">
                                <el-option v-for="data in item.produceDateList" :key="data.produceDate"
                                           :label="data.produceDate" :value="data.produceDate"/>
                            </el-select>
                        </td>
                        <!--                        <td>-->
                        <!--                            <el-select v-model="item.inDate" @change="initReservoirList(index)" clearable-->
                        <!--                                       :disabled="show2" placeholder="请选择入库日期">-->
                        <!--                                <el-option v-for="data in item.inDateList" :key="data.inDate" :label="data.inDate"-->
                        <!--                                           :value="data.inDate"/>-->
                        <!--                            </el-select>-->
                        <!--                        </td>-->
                        <td v-show="show2||isLiKu==1">
                            <el-select v-model="item.reservoirId" @change="initStorageList(index)" clearable
                                       :disabled="show2" placeholder="请选择库区">
                                <el-option v-for="data in item.reservoirList" :key="data.reservoirId"
                                           :label="data.reservoirCode" :value="data.reservoirId"/>
                            </el-select>
                        </td>
                        <td v-show="show2||isLiKu==1">
                            <el-select style="width: 100%" v-model="item.storageId" @change="selMaterial(index)"
                                       clearable multiple collapse-tags filterable :disabled="show2"
                                       placeholder="请选择库位" v-if="type==2&&isLiKu==1">
                                <el-option v-for="data in item.storageList" :key="data.storageId"
                                           :label="data.storageCodeLabel" :value="data.storageId"/>
                            </el-select>
                            <el-select v-model="item.storageId" @change="selMaterial(index)" clearable :disabled="show2"
                                       placeholder="请选择库位" v-else>
                                <el-option v-for="data in item.storageList" :key="data.storageId"
                                           :label="data.storageCode" :value="data.storageId"/>
                            </el-select>
                        </td>
                        <td>{{ item.nums }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>{{ item.workDetailName }}</td>
                        <td>
                            <el-input v-model="item.planNums" type="text" v-mydouble4val
                                      placeholder="请输入计划出库数量" :disabled="show2||isLiKu==1"
                                      @input="calStockNums"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.codeNum" type="text" maxlength="50" placeholder=""
                                      :disabled="type != 2"></el-input>
                        </td>
                        <td v-show="show2">
                            <el-input v-model="item.realNums" type="text" v-mydouble4val
                                      placeholder="请输入实际出库数量" :disabled="type != 3||info.state==4"
                                      @input="calNums(index)"></el-input>
                        </td>
                        <td v-show="show2">
                            <el-input v-model="item.boxNums" type="text" v-mydouble4val placeholder="请输入实际出库箱数"
                                      :disabled="type != 3||info.state==4" @input="calcNums(index, 1)"></el-input>
                        </td>
                        <td v-show="show2">
                            <el-input v-model="item.palletNums" type="text" v-mydouble4val
                                      placeholder="请输入实际出库拖数||info.state==4" :disabled="type != 3||info.state==4"
                                      @input="calcNums(index, 2)"></el-input>
                        </td>
                        <td v-show="type == 2">
                            <el-tooltip effect="dark" content="删除库存" placement="top-start" :hide-after='1000'>
                                <span @click="removeDealMaterial(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td width="150">合计:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-show="info.orderType==2"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td v-show="show2||isLiKu==1"></td>
                        <!--                        <td></td>-->
                        <td v-show="show2||isLiKu==1"></td>
                        <td v-show="show2||isLiKu==1"></td>
                        <td style="color: red">{{ totalInfo.nums2 }}</td>
                        <td></td>
                        <td></td>
                        <td style="color: red">{{ totalInfo.planNums }}</td>
                        <td></td>
                        <td style="color: red" v-show="show2">{{ totalInfo.stockNums }}</td>
                        <td style="color: red" v-show="show2">{{ totalInfo.stockBoxNums }}</td>
                        <td style="color: red" v-show="show2">{{ totalInfo.stockPalletNums }}</td>
                        <td v-show="type == 2"></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <!--            器具信息-->
            <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
            <table class="tableCommon" width="100%">
                <thead>
                <tr>
                    <th width="200"><em>*</em>可回收器具</th>
                    <th width="280"><em>*</em>所属人</th>
                    <th width="280"><em>*</em>到货厂商</th>
                    <th width="120"><em>*</em>出库数量</th>
                    <th v-show="type == 3" width="120">实际出库数量</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in packMaterialList">
                    <td>{{ item.name }}</td>
                    <td>{{ item.srcTenantName }}</td>
                    <td>{{ item.useTenantName }}</td>
                    <td>{{ item.nums }}</td>
                    <td v-show="type == 3">
                        <el-input v-model="item.realNums" type="text" v-mydouble4val placeholder=""
                                  @input="$forceUpdate();" style="width: 100%"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            器具信息-->

            <!--            收入信息-->
            <h3 class="common-title mt_20" v-show="show2">
                <span class="title-name">收入信息</span>
                <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
            </h3>
            <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0"
                   v-show="show2">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th width="120" v-show="info.orderType==2">货主</th>
                    <th width="120">费用类型</th>
                    <th width="120">费用项目名称</th>
                    <th width="100">单位</th>
                    <th width="100">不含税单价</th>
                    <th width="100">税率</th>
                    <th width="100">含税价</th>
                    <th width="100">数量</th>
                    <th width="100">不含税金额</th>
                    <th width="100">含税金额</th>
                    <th width="100">是否下次展示</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index)  in feeList">
                    <td>{{ index + 1 }}</td>
                    <td v-show="info.orderType==2">{{ item.srcTenantName }}</td>
                    <td>{{ item.itemTypeName }}</td>
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.tax }}</td>
                    <td>{{ item.priceWithTax }}</td>
                    <td>
                        <el-input v-model="item.num" type="text" v-mydouble4val placeholder=""
                                  @input="calcFeeTotal(item)"></el-input>
                    </td>
                    <td>{{ item.totalFee }}</td>
                    <td>{{ item.totalFeeWithTax }}</td>
                    <td>
                        <el-switch v-model="item.isDefault == 1"
                                   @change="changeDefaultSwitch(item, index)"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-text="是"
                                   inactive-text="否">
                        </el-switch>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td v-show="info.orderType==2"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.num }}</td>
                    <td class="red fw">{{ totalInfo.totalFee }}</td>
                    <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                    <td></td>
                </tr>
                </tfoot>
            </table>

            <!--            成本信息-->
            <h3 class="common-title mt_20"><span class="title-name">成本信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th width="120" v-show="info.orderType==2">货主</th>
                    <th width="120">费用类型</th>
                    <th width="120">作业名称</th>
                    <th width="100">计费单位</th>
                    <th width="100">外包作业</th>
                    <th width="150">外包供应商</th>
                    <th width="100">未税单价</th>
                    <th width="100">税率(%)</th>
                    <th width="100">含税价</th>
                    <th width="100">数量</th>
                    <th width="100">未税金额</th>
                    <th width="100">含税金额</th>

                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index)  in costList">
                    <td>{{ index + 1 }}</td>
                    <td v-show="info.orderType==2">{{ item.srcTenantName }}</td>
                    <td>{{ item.itemTypeName }}</td>
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.unit }}</td>
                    <td>
                        <el-switch v-model="item.isWorkOrder == 1"
                                   @change="changeCostSwitch(item)"
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
                                  @input="calcCostTotal" :disabled="item.disabled"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.totalFee" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.totalFeeWithTax" type="text" disabled></el-input>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td v-show="info.orderType==2"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.costNum }}</td>
                    <td class="red fw">{{ totalInfo.costTotalFee }}</td>
                    <td class="red fw">{{ totalInfo.costTotalFeeWithTax }}</td>
                </tr>
                </tfoot>
            </table>
            <!--            成本信息-->

            <!--            入库附件-->
            <h3 class="common-title mt_20" v-show="show2"><span class="title-name">出库附件</span></h3>
            <div class="uploadFile clearfix" v-show="show2">
                <div class="fl mr_20">
                    <myFileModel ref="receiptsImg"></myFileModel>
                    <p>只支持.jpg .png</p>
                </div>
            </div>
            <!--            入库附件-->

            <div class="bot-btn ">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="sureAllocat()" v-show="type == 1">确定分配</el-button>
                <el-button type="primary" @click="outOrderAllocat()" v-show="type == 2">确定分拣</el-button>
                <el-button type="primary" @click="outOrderDeal()" v-show="type == 3">确定出库</el-button>
            </div>
        </div>
        

        <!-- 标签详情 -->
        <tagTable :data="materialCodeList" :showTagBtn="false" v-show="showType==2" type="2"></tagTable>
        <tagTable :data="custQrcodeList" :head="custQrcodeHead" v-show="showType==3" :showTagBtn="false" type="2"></tagTable>


      <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px">
            <div class="title">
                <div>不参与计费项目</div>
                <div>参与计费项目</div>
            </div>
            <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
            <div class="bot-btn">
                <el-button size="mini" @click="isShowDialog = false">关闭</el-button>
                <el-button size="mini" type="primary" @click="saveChangeFeeItem">保存</el-button>
            </div>
        </el-dialog>

        <!-- 确认出库对话框 -->
        <el-dialog title="确认出库提示" :visible.sync="showOutOrderDialog" width="500px" center>
            <div style="text-align: center;">
                <p>出库单号：{{ info.outOrderNum }}</p>
                <p>计划出库：{{ totalInfo.planNums }}, 实际出库：{{ totalInfo.stockNums }}</p>
                <p v-if="totalInfo.stockNums != totalInfo.planNums" style="color: #f56c6c;">
                    计划出库数量与实际出库数量不一致!
                </p>
                <p style="color: #f56c6c; margin-top: 10px;">
                    注：确认出库后，在库数量=原在库数量-本次实际出库数量
                </p>
                <div v-if="isTimeout" style="margin-top: 15px;">
                    <span>超时原因：</span>
                    <el-select v-model="timeoutReasonSelect" placeholder="请选择超时原因" style="width: 250px; margin-left: 10px;">
                        <el-option value="" disabled hidden>请选择超时原因</el-option>
                        <el-option v-for="item in timeoutReasonData" :key="item.codeValue" 
                                   :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showOutOrderDialog = false">关闭</el-button>
                <el-button type="primary" @click="confirmOutOrder">确认出库</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import outOrderConfirm from './outOrderConfirm.js'

export default outOrderConfirm
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
    position: relative;
    .operateDialog {
        .title {
            display: flex;

            > div {
                flex: 1;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
        }
    }
  .orderNum{
    font-weight: bold;
    margin-left: 20px;
    color:#333;
  }

    .tableCommon {
        border: $border;
    }

    .add {
        vertical-align: middle;
        @include add;
    }

    .del {
        vertical-align: middle;
        @include del;
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
    }
}

</style>