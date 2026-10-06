<template>
    <div id="storeHouseBillDetail" class="orderPage">
        <div class="common-info" style="border:none;padding:0;">
            <!--            基础信息-->
            <div id="baseInfo">
                <h3 class="common-title">
                    <span class="title-name">基础信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>重要说明：次月的5日后，禁止提交上月月成本，例：1月的月成本，2月5日后将无法再新建！</em></span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>仓库名称</label>
                        <div class="input-text">
                            <el-select v-model="info.workId" @change="changeStoreHouse()"
                                       filterable :disabled="isOnlySee"
                                       v-if="info.wmsFeeCostItemType != 1&&info.wmsFeeCostItemType!=30" placeholder="请选择仓库">
                                <el-option v-for="item in storeHouseData"
                                           :key="item.workId"
                                           :label="item.workName"
                                           :value="item.workId">
                                </el-option>
                            </el-select>
                            <el-cascader ref="cascader" v-if="info.wmsFeeCostItemType == 1||info.wmsFeeCostItemType==30"
                                         v-model="info.workIds"
                                         @change="changeWork"
                                         size="medium"
                                         separator="-"
                                         :options="treeData"
                                         :props="props"
                                         :disabled="isOnlySee"
                                         collapse-tags
                                         clearable filterable>
                            </el-cascader>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">仓库地址</label>
                        <div class="input-text">
                            <el-input v-model="info.workAddressStr" disabled></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>供应商</label>
                        <div class="input-text">
                            <el-select v-model="info.supplierTenantId"
                                       @change="changeSupplier"
                                       filterable :disabled="isOnlySee"
                                       placeholder="请选择供应商">
                                <el-option v-for="supplier in supplierData"
                                           :key="supplier.tenantId"
                                           :label="supplier.supplierName"
                                           :value="supplier.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>费用月份</label>
                        <div class="input-text">
                            <el-date-picker v-model="info.billMonth" type="month" value-format="yyyy-MM"
                                            @change="changeBillMonth" :disabled="isOnlySee" :picker-options="pickerOptions"
                                            placeholder="请选择费用月份">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>费用类型</label>
                        <div class="input-text">
                            <el-select v-model="info.wmsFeeCostItemType"
                                       @change="changeWmsFeeCostItemType"
                                       filterable :disabled="isOnlySee"
                                       placeholder="请选择费用类型">
                                <el-option v-for="item in wmsFeeCostItemTypeData"
                                           :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
              <ul class="content clearfix" style="margin-top: 10px;">
                <li class="item" style="width: 98%;">
                  <label class="label-term">备注</label>
                  <div class="input-text">
                    <el-input v-model="info.remark"  :disabled="isOnlySee" @input="forceUpdate"></el-input>
                  </div>
                </li>
              </ul>
            </div>
            <!--            基础信息-->

            <!-- 仓库租赁 -->
          <!-- 仓库租赁 -->
          <div v-show="info.wmsFeeCostItemType == 1&&info.isNew==0">
            <h3 class="common-title">
                    <span class="title-name">仓库租赁
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">租赁费的数据来源：资源中心-仓库资源-仓库详情-租赁费(元/月)</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
            </h3>
            <ul class="content clearfix" style="margin-top: 10px;">
              <li class="item">
                <label class="label-term">租赁费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.leaseFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.leaseFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">水费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.waterFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.waterFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">硬件费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.hardwareFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.hardwareFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">保险费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.insureFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.insureFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>

            </ul>
            <ul class="content clearfix">
              <li class="item">
                <label class="label-term">物业费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.propertyFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.propertyFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">电费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.energyFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.energyFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">管理费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.manageFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.manageFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">其他费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.otherFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.otherFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(1)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
            </ul>
            <div style="text-align: right; margin: 10px 30px;">
              <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFeeWithTax}}</span></span>
              <span>未税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFee}}</span></span>
            </div>
          </div>

          <!-- 水电费 -->
          <div v-show="info.wmsFeeCostItemType == 30">
            <h3 class="common-title">
                    <span class="title-name">水电费用</span>
            </h3>
            <ul class="content clearfix" style="margin-top: 10px;">
              <li class="item">
                <label class="label-term">水费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.waterFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(30)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.waterFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(30)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">电费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.energyFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(30)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.energyFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(30)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
            </ul>
            <div style="text-align: right; margin: 10px 30px;">
              <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFeeWithTax}}</span></span>
              <span>未税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFee}}</span></span>
            </div>
          </div>

            <div v-show="info.wmsFeeCostItemType == 1&&info.isNew==1">
                <h3 class="common-title">
                    <span class="title-name">仓库租赁
                    </span>
                </h3>
              <div class="tickManager" style="overflow: auto;">
                <table class="tableCommon" ref="monthFeeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                  <tr>
                    <th width="50">序号</th>
                    <th width="80">操作</th>
                    <th width="100">费用类型</th>
                    <th width="120">含税租赁费(元)</th>
                    <th width="100">税率(%)</th>
                    <th width="120">含税管理费(元)</th>
                    <th width="100">税率(%)</th>
                    <th width="120">含税其他杂费(元)</th>
                    <th width="100">税率(%)</th>
<!--                    <th width="120">含税水费(元)</th>-->
<!--                    <th width="100">税率(%)</th>-->
<!--                    <th width="120">含税电费(元)</th>-->
<!--                    <th width="100">税率(%)</th>-->
                    <th width="120">其他费用增减(元)</th>
                    <th width="180">增减原因</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in monthCostList">
                    <td>{{index + 1}}</td>
                    <td>
                      <a href="javascript:void(0);" class="link" @click.stop="toDetail(item)">查看详情</a>
                      <a href="javascript:void(0);" v-if="monthCostList.length>1&&(type==1||type==2)" style="margin-left: 5px;" class="link" @click.stop="deleteDetail(index)">删除</a>
                    </td>
                    <td>{{ item.feeTypeName }}</td>
                    <td>{{ item.leaseFee }}</td>
                    <td>{{ item.leaseFeeTaxRate }}</td>
                    <td>{{ item.manageFee }}</td>
                    <td>{{ item.manageFeeTaxRate }}</td>
                    <td>{{ item.otherFee }}</td>
                    <td>{{ item.otherFeeTaxRate }}</td>
<!--                    <td><el-input v-model="item.waterFee" v-mydoubleval placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee"></el-input></td>-->
<!--                    <td><el-input v-model="item.waterFeeTaxRate" v-mydoubleval placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee"></el-input></td>-->
<!--                    <td><el-input v-model="item.energyFee" v-mydoubleval placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee"></el-input></td>-->
<!--                    <td><el-input v-model="item.energyFeeTaxRate" v-mydoubleval placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee"></el-input></td>-->
                    <td><el-input v-model="item.changeFee" v-mypmdoubleval placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee||feeModifyFlag"></el-input></td>
                    <td><el-input v-model="item.changeRemark"  placeholder="请填写" @input="calculateTotalFee(1)" :disabled="isOnlySee||feeModifyFlag"></el-input></td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalWarehouseLeaseFee}}</span></span>
                </div>
            </div>
            <!-- 短驳配送 -->
            <div v-show="info.wmsFeeCostItemType == 2">
                <h3 class="common-title">
                    <span class="title-name">短驳配送(<span style="color: red;font-size: 12px;">点击数字链接查看详情</span>)
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">数据来源：仓储中心-仓储首页-短驳配送管理 或 仓储中心-仓储管理-短驳配送管理</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <div class="clearfix" style="padding:10px 0.5%;float: left;width: 24%">
                    <div class="flexItem">
                        <div class="row">
                            <div class="item">合计</div>
                        </div>
                        <div class="row">
                            <div class="item">车次</div>
                            <div class="item">每趟金额</div>
                            <div class="item">合计金额</div>
                        </div>
                        <div class="row">
                            <div class="item">{{ info.times }}</div>
                            <div class="item">{{ info.waybillFeePerTimes }}</div>
                            <div class="item a">
                                <a href="javascript:void(0);" class="link" @click.stop="toWmsWaybill">{{ info.waybillFee }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="float: left;width: 75%;padding-top: 10px;">
                    <ul class="content clearfix">
                        <li class="item">
                            <label class="label-term">回收运输费</label>
                            <div class="input-text">
                                <el-input v-model="info.recoveryTransportFee" v-mypmdoubleval
                                          disabled placeholder="含税价"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">税点</label>
                            <div class="input-text">
                                <el-input v-model="info.recoveryTransportFeeTax" v-mypmdoubleval
                                          disabled placeholder="税点" maxLength="5"></el-input>
                            </div>
                        </li>
                    </ul>
                    <ul class="content clearfix">
                        <li class="item">
                            <label class="label-term">其他费用增减</label>
                            <div class="input-text">
                                <el-input v-model="info.waybillChangeFee" :disabled="isOnlySee" @input="calculateTotalFee(2)" v-mypmdoubleval></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">增减原因</label>
                            <div class="input-text">
                                <el-input v-model="info.waybillChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalWaybillFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalWaybillFee}}</span></span>
                </div>
            </div>

          <!-- 干线运输 -->
          <div v-show="info.wmsFeeCostItemType == 10">
            <h3 class="common-title">
              <span class="title-name">干线运输</span>
            </h3>
            <ul class="content clearfix" style="margin-top: 10px;">
              <li class="item">
                <label class="label-term">外租车成本(元)</label>
                <div class="input-text">
                  <el-input v-model="info.waybillFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(10)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.waybillFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(10)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">返空运输(元)</label>
                <div class="input-text">
                  <el-input v-model="info.emptyReturnFee" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(10)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.emptyReturnFeeTax" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(10)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
            </ul>
            <div style="text-align: right; margin: 10px 30px;">
              <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalFeeWithTax}}</span></span>
              <span>未税总金额：<span style="font-size: 20px">{{info.totalFee}}</span></span>
            </div>
          </div>

          <!-- 外包劳务费 -->
          <div v-show="info.wmsFeeCostItemType == 11">
            <h3 class="common-title">
              <span class="title-name">外包劳务费</span>
            </h3>
            <ul class="content clearfix" style="margin-top: 10px;">
              <li class="item">
                <label class="label-term">装卸费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.fee1" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.tax1" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">打包费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.fee2" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.tax2" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">最终交付(元)</label>
                <div class="input-text">
                  <el-input v-model="info.fee3" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.tax3" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
              <li class="item">
                <label class="label-term">回收整理费(元)</label>
                <div class="input-text">
                  <el-input v-model="info.fee4" v-mypmdoubleval style="width: 70%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            placeholder="含税价"></el-input>
                  <el-input v-model="info.tax4" v-mypmdoubleval style="margin-left:5px;width: 27%;"
                            @input="calculateTotalFee(11)" :disabled="isOnlySee"
                            maxLength="5" placeholder="税点"></el-input>
                </div>
              </li>
            </ul>
            <div style="text-align: right; margin: 10px 30px;">
              <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalFeeWithTax}}</span></span>
              <span>未税总金额：<span style="font-size: 20px">{{info.totalFee}}</span></span>
            </div>
          </div>
            <!-- 打包费用 -->
            <div v-show="info.wmsFeeCostItemType == 3">
                <h3 class="common-title">
                    <span class="title-name">打包费用
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">当月打包板数数据来源:仓储中心-仓储管理-操作登记-操作类型-打包费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">当月打包板数</label>
                        <div class="input-text">
                            <el-input v-model="info.packCount" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">打包单价</label>
                        <div class="input-text">
                            <el-input v-model="info.packPrice" @input="calculateFee(3)" v-mypmdoubleval
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.packFeeTax" v-mypmdoubleval
                                      @input="calculateTotalFee(3)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.packChangeFee" @input="calculateTotalFee(3)" v-mypmdoubleval
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.packChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalPackFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalPackFee}}</span></span>
                </div>
            </div>
            <!-- 上楼费用 -->
            <div v-show="info.wmsFeeCostItemType == 4">
                <h3 class="common-title">
                    <span class="title-name">上楼费用
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">当月上楼板数数据来源:仓储中心-仓储管理-操作登记-操作类型-上楼费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">当月上楼板数</label>
                        <div class="input-text">
                            <el-input v-model="info.upstairsCount" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">上楼单价</label>
                        <div class="input-text">
                            <el-input v-model="info.upstairsPrice" @input="calculateFee(4)" v-mypmdoubleval
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.upstairsFeeTax" v-mypmdoubleval
                                      @input="calculateTotalFee(4)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.upstairsChangeFee" @input="calculateTotalFee(4)" v-mypmdoubleval
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.upstairsChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalUpstairsFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalUpstairsFee}}</span></span>
                </div>
            </div>
            <!-- 回收费用 -->
            <div v-show="info.wmsFeeCostItemType == 5">
                <h3 class="common-title">
                    <span class="title-name">回收费用
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">当月回收总数数据来源：仓储中心-仓储管理-器具库存-器具登记-器具登记明细-金额</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">当月回收总数</label>
                        <div class="input-text">
                            <el-input v-model="info.recoveryCount" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">当月回收费用</label>
                        <div class="input-text">
                            <el-input v-model="info.recoveryFee" disabled
                                      placeholder="含税价"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.recoveryFeeTax" v-mypmdoubleval
                                      @input="calculateTotalFee(5)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>

                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.recoveryChangeFee" @input="calculateTotalFee(5)" v-mypmdoubleval
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.recoveryChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalRecoveryFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalRecoveryFee}}</span></span>
                </div>
            </div>
            <!-- 设备租赁 -->
            <div v-show="info.wmsFeeCostItemType == 6">
                <h3 class="common-title">
                    <span class="title-name">设备租赁
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">数据来源:资源中心-仓库设备资源-新增-采购类型-租赁</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">设备租赁数量</label>
                        <div class="input-text">
                            <el-input v-model="info.equipmentLeaseCount" v-mypmdoubleval disabled
                                      @input="" placeholder="请输入设备租赁数量"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">设备租赁金额</label>
                        <div class="input-text">
                            <el-input v-model="info.equipmentLeaseFee" disabled
                                      @input="calculateTotalFee(6)" placeholder="含税价"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.equipmentLeaseFeeTax" v-mypmdoubleval
                                      @input="calculateTotalFee(6)"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.equipmentLeaseChangeFee" v-mypmdoubleval :disabled="isOnlySee"
                                      @input="calculateTotalFee(6)"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.equipmentLeaseChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalEquipmentLeaseFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalEquipmentLeaseFee}}</span></span>
                </div>
            </div>
            <!-- 耗材费用 -->
            <div v-show="info.wmsFeeCostItemType == 8">
                <h3 class="common-title">
                    <span class="title-name">耗材费用
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">暂无来源</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">耗材数量</label>
                        <div class="input-text">
                            <el-input v-model="info.consumableCount" v-mypmdoubleval :disabled="isOnlySee"
                                      @input="" placeholder="请输入耗材数量"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">耗材金额</label>
                        <div class="input-text">
                            <el-input v-model="info.consumableFee" :disabled="isOnlySee"
                                      @input="calculateTotalFee(8)" placeholder="含税价"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.consumableFeeTax" v-mypmdoubleval
                                      @input="calculateTotalFee(8)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.consumableChangeFee" v-mypmdoubleval :disabled="isOnlySee"
                                      @input="calculateTotalFee(8)" placeholder="金额"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.consumableChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalConsumableFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalConsumableFee}}</span></span>
                </div>
            </div>
            <!-- 临时劳务费用 -->
            <div v-show="info.wmsFeeCostItemType == 9">
                <h3 class="common-title">
                    <span class="title-name">临时劳务费用
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">数据来源:仓储中心-仓储管理-操作登记-操作类型-劳务临时</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">当月临时劳务工时</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceTimes" v-mypmdoubleval disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">当月临时劳务件数</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceCount" v-mypmdoubleval disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">当月临时劳务金额</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceFee" disabled
                                      @input="calculateTotalFee(9)" placeholder="含税价"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceTax" v-mypmdoubleval
                                      @input="calculateTotalFee(9)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceChangeFee" v-mypmdoubleval :disabled="isOnlySee"
                                      @input="calculateTotalFee(9)" placeholder="金额"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.temporaryServiceChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalTemporaryServiceFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalTemporaryServiceFee}}</span></span>
                </div>
            </div>

            <!-- 客户器具费用 -->
            <div v-show="info.wmsFeeCostItemType == 13">
                <h3 class="common-title">
                    <span class="title-name">客户器具成本
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">数据来源:仓储中心-仓储管理-客户器具库存-器具登记</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </span>
                </h3>
                <ul class="content clearfix" style="margin-top: 10px;">
                    <li class="item">
                        <label class="label-term">运输成本</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceRegisterFee" v-mypmdoubleval disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">回收成本</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceReoveryFee" v-mypmdoubleval disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">整理成本</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceClearUpFee" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">税点</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceTax" v-mypmdoubleval
                                      @input="calculateTotalFee(13)" :disabled="isOnlySee"
                                      placeholder="税点" maxLength="5"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">其他费用增减</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceChangeFee" v-mypmdoubleval :disabled="isOnlySee"
                                      @input="calculateTotalFee(13)" placeholder="金额"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">增减原因</label>
                        <div class="input-text">
                            <el-input v-model="info.outDeviceChangeRemark" :disabled="isOnlySee" placeholder="请填写增减原因"></el-input>
                        </div>
                    </li>
                </ul>
                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalOutDeviceFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalOutDeviceFee}}</span></span>
                </div>
            </div>


            <div v-show="info.wmsFeeCostItemType == 20">
                <h3 class="common-title mt_20">
                    <span class="title-name">外包作业成本</span>
                    <el-button v-show="type != 3" class="fr" size="mini" type="primary" style="margin-top:6px;" @click="openSelectDialog(true)">选择参与成本</el-button>
                </h3>
                <div class="tickManager" style="overflow: auto;">
                    <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="150">费用类型</th>
                            <th width="150">作业名称</th>
                            <th width="100">计费单位</th>
                            <th width="250">外包供应商</th>
                            <th width="100">未税单价</th>
                            <th width="100">税率(%)</th>
                            <th width="100">含税价</th>
                            <th width="100">数量</th>
                            <th width="100">未税金额</th>
                            <th width="100">含税金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in costList">
                            <td>{{index + 1}}</td>
                            <td>{{ item.itemTypeName }}</td>
                            <td>{{ item.itemName }}</td>
                            <td>{{ item.unit }}</td>
                            <td>{{ item.tenantName }}</td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.tax }}</td>
                            <td>{{ item.priceWithTax }}</td>
                            <td>{{ item.num }}</td>
                            <td>{{ item.totalFee }}</td>
                            <td>{{ item.totalFeeWithTax }}</td>
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
                            <td class="red">{{ totalInfo.costNum }}</td>
                            <td class="red">{{ totalInfo.costTotalFee }}</td>
                            <td class="red">{{ totalInfo.costTotalFeeWithTax }}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!--            设备集采-->
            <div v-show="info.wmsFeeCostItemType == 40">
                <h3 class="common-title">
                    <span class="title-name">设备集采
                    </span>
                </h3>
                <div class="tickManager" style="overflow: auto;">
                    <table class="tableCommon" ref="monthFeeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="120">设备名称</th>
                            <th width="100">设备类型</th>
                            <th width="120">费用月份</th>
                            <th width="100">付款类型</th>
                            <th width="80">数量</th>
                            <th width="100">税率(%)</th>
                            <th width="120">含税月费用</th>
                            <th width="120">其他费用增减</th>
                            <th width="180">增减原因</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in equipmentCostList">
                            <td>{{index + 1}}</td>
                            <td>{{ item.assetName }}</td>
                            <td>{{ item.assetClassName }}</td>
                            <td>{{ item.billMonth }}</td>
                            <td>{{ item.payTypeName }}</td>
                            <td>
                                <a href="javascript:void(0);" class="link" @click.stop="toAssetFeeDetail(item)">{{ item.num }}</a>
                            </td>
                            <td>{{ item.tax }}</td>
                            <td>{{ item.totalFeeWithTax }}</td>
                            <td><el-input v-model="item.changeFee" v-mypmdoubleval placeholder="请填写" @input="calculateTotalFee(40)" :disabled="isOnlySee||feeModifyFlag"></el-input></td>
                            <td><el-input v-model="item.changeRemark"  placeholder="请填写" :disabled="isOnlySee||feeModifyFlag"></el-input></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div style="text-align: right; margin: 10px 30px;">
                    <span style="margin-right: 10px;">含税总金额：<span style="font-size: 20px">{{info.totalAssetFeeWithTax}}</span></span>
                    <span>未税总金额：<span style="font-size: 20px">{{info.totalAssetFee}}</span></span>
                </div>
            </div>
            <!--            设备采集-->

<!--            分摊-->
            <h3 class="common-title" v-show="info.wmsFeeCostItemType != 20">
                <span class="title-name">成本分摊</span>
                <el-button @click="share" v-show="(type == 1 || type == 2) && info.wmsFeeCostItemType != 13" type="success" size="mini" round style="margin-left: 10px;">一键分摊</el-button>
            </h3>
            <div class="innerTable tableCommon" v-show="info.wmsFeeCostItemType != 20">
                <!-- 新增、修改 -->
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="!isOnlySee">
                    <tr>
                        <td class="label" width="10%">序号</td>
                        <td class="label" width="30%">客户</td>
                        <td class="label" width="15%" v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">{{ tdName }}</td>
                        <td class="label" width="20%">分摊成本(含税)</td>
                        <td class="label" width="10%">分摊成本(未税)</td>
                        <td class="label" width="5%">
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                <span @click="addCostShare" class="add"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tr v-for="(item,index) in shareCostDataList" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-select v-model="item.tenantId"
                                       filterable clearable placeholder="请选择客户">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId">
                                </el-option>
                            </el-select>
                        </td>
                        <td v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">
                            <el-input v-model="item.count" @input="calcShareSum" v-mypmdoubleval placeholder="请填写"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.shareCostAmountWithTax" @input="calcShareSum" v-mypmdoubleval placeholder="请填写"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.shareCostAmount" @input="calcShareSum" v-mydouble4val placeholder="请填写"></el-input>
                        </td>
                        <td v-if="!isOnlySee">
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span @click="deleteCostShare(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tfoot>
                    <tr>
                        <td class="fw red">合计</td>
                        <td></td>
                        <td v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">{{ totalShareCount }}</td>
                        <td>{{ totalShareAmountWithTax }}</td>
                        <td>{{ totalShareAmount }}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>

                <!-- 查看（为了可以复制） -->
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="isOnlySee">
                    <tr>
                        <td class="label" width="10%">序号</td>
                        <td class="label" width="30%">客户</td>
                        <td class="label" width="15%" v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">{{ tdName }}</td>
                        <td class="label" width="20%">分摊成本(含税)</td>
                        <td class="label" width="10%">分摊成本(未税)</td>
                    </tr>
                    <tr v-for="(item,index) in shareCostDataList" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            {{item.customerName }}
                        </td>
                        <td v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">
                            {{ item.count }}
                        </td>
                        <td>
                            {{ item.shareCostAmountWithTax }}
                        </td>
                        <td>
                            {{item.shareCostAmount}}
                        </td>
                    </tr>
                    <tfoot>
                    <tr>
                        <td class="fw red">合计</td>
                        <td></td>
                        <td v-show="!(info.wmsFeeCostItemType == 8 || info.wmsFeeCostItemType == 9)">{{ totalShareCount }}</td>
                        <td>{{ totalShareAmountWithTax }}</td>
                        <td>{{ totalShareAmount }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div class="page-bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="saveFeeCost()" v-show="type == 1 || type == 2">提交</el-button>
            </div>
        </div>

        <!--   选择费用项目     -->
        <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="1000px">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">单号</td>
                    <td class="value">
                        <el-input v-model="query.wmsOrderNum"></el-input>
                    </td>
                    <td class="label">费用名称</td>
                    <td class="value">
                        <el-input v-model="query.itemName"></el-input>
                    </td>
                    <td class="label">费用类型</td>
                    <td class="value">
                        <el-select v-model="query.itemType" @change="doQuery"
                                   clearable filterable placeholder="请选择费用类型">
                            <el-option v-for="item in itemTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </td>
                    <td width="80">
                        <el-button size="mini" type="primary" @click="doQuery">查询</el-button>
                    </td>
                </tr>
            </table>
            <dbTable tableName="workContractInfoTable" ref="table"
                     :head="head" onlyId="onlyId" :showTotal="true"
            ></dbTable>
            <div class="bot-btn">
                <el-button @click="open(false)">关闭</el-button>
                <el-button type="primary" @click="saveCostItem">确认</el-button>
            </div>
        </el-dialog>
        <!--   选择费用项目     -->

    </div>
</template>

<script>
import storeHouseBillDetail from './storeHouseBillDetail.js'

export default storeHouseBillDetail
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>

<style lang="scss" scoped>
.orderPage {
    /deep/ .el-collapse-item__header {
        padding: 0 5px;
        background: #f7fafd;
        position: relative;
        line-height: 30px;
        color: #1990ff;
        position: relative;
        padding-left: 30px;
        font-size: 14px;
        font-weight: 700;
        &::before {
            content: "";
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #1990ff;
            position: absolute;
            left: 14px;
            top: 19px;
        }
    }
    .common-title .title-name::before {
        top: 2px;
    }
    /deep/.el-cascader{
        width:100%;
        .el-input__inner {
            height: 40px !important;
            line-height: 40px !important;
        }
    }
    /deep/ .dbTable{
        height: 50vh;
        margin-top: 20px;
    }
}

.flexItem {
    float: left;
    width: 100%;
    border-radius: 5px;
    box-sizing: border-box;
    border: $border;
    margin: 0 0.5%;
    // &:last-child{
    //   margin:0;
    // }
    .row {
        display: flex;
        background: #efefef;

        &:nth-child(2) {
            background: #fff;
        }
        .item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;

            &.a {
                color: $main-color;
            }
        }
    }

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
</style>
