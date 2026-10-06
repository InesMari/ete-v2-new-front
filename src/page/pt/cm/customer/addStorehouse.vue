<template>
    <div id="addStorehouse">
        <!-- 新增 仓库 -->
        <div class="common-info">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>仓库名称</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.workName" maxlength="100" placeholder="请输入仓库名称" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>所在地区</label>
                        <div class="input-text">
                            <el-select v-model="workInfo.provinceId" placeholder="省" filterable @change="changeProvinceSelect" disabled :style="disabled?'width:32%;margin-right:2%;':'width:23%;margin-right:2%;'">
                                <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.cityId" placeholder="市" filterable @change="changeCitySelect" :disabled="isNotDistrict" :style="disabled?'width:32%;margin-right:2%;':'width:23%;margin-right:2%;'">
                                <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.districtId" placeholder="区" filterable :disabled="isNotDistrict" :style="disabled?'width:32%;':'width:23%;margin-right:2%;'">
                                <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-button type="primary" @click="showMap" style="width:25%;" v-if="!disabled">地图选择</el-button>
                            <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton" @sureCallback="sureWorkAddress" @hideMapBack="hideMapBack" :modal="false"></map-dialog>
                        </div>
                    </li>


                  <li class="item item50">
                        <label class="label-term"><em>*</em>街道地址</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.address" maxlength="200" placeholder="不需要重复填写省/市/区" :disabled="disabled" @input="forceUpdate"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">电子围栏范围</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.electricFence" maxlength="100" :placeholder="electricPlace" :disabled="disabled || isOverlays" style="width:73%;" v-if="!disabled"></el-input>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:25%;" v-if="!disabled">手工绘制</el-button>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:100%;" v-if="disabled">查看电子围栏范围</el-button>
                        </div>
                    </li>

                  <li class="item ">
                    <label class="label-term"><em>*</em>仓库类型</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.storehouseType" filterable clearable :disabled="disabled" @change="forceUpdate">
                        <el-option v-for="item in storehouseTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term"><em>*</em>消防等级</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.firecontrolType" filterable clearable :disabled="disabled" @change="forceUpdate">
                        <el-option v-for="item in firecontrolTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term">租赁面积(㎡)</label>
                    <div class="input-text">
                      <el-input v-model="workInfo.storehouseArea" v-mydoubleval maxlength="50" placeholder="请输入租赁面积" @input="changeTaxAmount" :disabled="disabled"></el-input>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term">滴水高度(m)</label>
                    <div class="input-text">
                      <el-input v-model="workInfo.storehouseHeight" v-mydoubleval maxlength="50" placeholder="请输入滴水高度" :disabled="disabled"></el-input>
                    </div>
                  </li>
<!--                  <li class="item ">-->
<!--                    <label class="label-term">公摊比例(%)</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.shareRate" v-mydoubleval maxlength="50" placeholder="公摊比例" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term"><em>*</em>功能区板数</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.functionalAreaPalletNums" v-mydoubleval maxlength="50" placeholder="功能区板数" @input="forceUpdate" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term"><em>*</em>功能区面积(㎡)</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.functionalAreaArea" v-mydoubleval maxlength="50" placeholder="功能区面积" @input="forceUpdate" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term"><em>*</em>存储区板数</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.storageAreaPalletNums" v-mydoubleval maxlength="50" placeholder="存储区板数" @input="calCostPerPallet" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term"><em>*</em>存储区面积(㎡)</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.storageAreaArea" v-mydoubleval maxlength="50" placeholder="存储区面积" @input="calUseRate" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term">仓库利用率(%)</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.useRate" maxlength="50" placeholder="自动计算" :disabled="true"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term">单板费用</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.costPerPallet" maxlength="50" placeholder="自动计算" :disabled="true"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                  <li class="item ">-->
<!--                    <label class="label-term">最大板数</label>-->
<!--                    <div class="input-text">-->
<!--                      <el-input v-model="workInfo.maxPalletNums" v-mydoubleval maxlength="50" placeholder="请输入最大板数" @input="forceUpdate" :disabled="disabled"></el-input>-->
<!--                    </div>-->
<!--                  </li>-->
                  <li class="item ">
                    <label class="label-term">租赁开始日期</label>
                    <div class="input-text">
                      <el-date-picker v-model="workInfo.leaseStartDate" type="date" placeholder="租赁开始日期"
                                      value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term">租赁结束日期</label>
                    <div class="input-text">
                      <el-date-picker v-model="workInfo.leaseEndDate" type="date" placeholder="租赁结束日期"
                                      value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">所属区域</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.regionId" clearable filterable placeholder="请选择"  @change="regionChange" :disabled="disabled">
                        <el-option
                            v-for="item in regionData"
                            :key="item.id"
                            :label="item.regionName"
                            :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">所属部门</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.orgId" clearable filterable placeholder="请选择" @change="orgChange" :disabled="disabled">
                        <el-option
                            v-for="item in regionOrgData"
                            :key="item.id"
                            :label="item.orgName"
                            :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item ">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.linkmanName" maxlength="50" placeholder="请输入联系人" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item ">
                        <label class="label-term">联系手机</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.bill" v-mynumval maxlength="11" placeholder="请输入联系手机" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item ">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.phone" maxlength="50" placeholder="请输入联系电话" :disabled="disabled"></el-input>
                        </div>
                    </li>
                  <li class="item ">
                    <label class="label-term">归属仓库</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.parentWorkId" filterable clearable :disabled="disabled" @change="forceUpdate">
                        <el-option v-for="item in allStoreHouseData" :key="item.workId" :label="item.workName"
                                   :value="item.storeHouseId"></el-option>
                      </el-select>
                    </div>
                  </li>

                  <li class="item">
                    <label class="label-term">仓库联系人</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.customerService" clearable filterable placeholder="请选择" @change="selStaff"
                                 :disabled="disabled">
                        <el-option
                            v-for="item in orgStaffData"
                            :key="item.userId"
                            :label="item.staffName"
                            :value="item.userId">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term">仓库联系电话</label>
                    <div class="input-text">
                      <el-input v-model="workInfo.billId" maxlength="50" placeholder="请输入联系电话" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">仓配供应商</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.transportTenantId" clearable filterable placeholder="请选择" @change="selStaff"
                                 :disabled="disabled">
                        <el-option v-for="item in allSupplierData" :key="item.tenantId" :label="item.supplierName"
                                   :value="item.tenantId"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item ">
                    <label class="label-term">存放方式</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.storageCondition" filterable clearable multiple :disabled="disabled" @change="forceUpdate">
                        <el-option v-for="item in storageConditionData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term"><em>*</em>结算主体</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.settleBody" clearable filterable placeholder="请选择"
                                 :disabled="disabled">
                        <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                    <li class="item" style="width: 73%;">
                      <label class="label-term">备注</label>
                      <div class="input-text">
                        <el-input v-model="workInfo.remark" maxlength="50" placeholder="请输入备注" :disabled="disabled"></el-input>
                      </div>
                    </li>
                    <li class="item">
                      <label class="label-term">仓库照片</label>
                      <div class="input-text">
                        <myFileModel ref="attach" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                      </div>
                    </li>
                    <li class="item">
                      <label class="label-term">营业执照</label>
                      <div class="input-text">
                        <myFileModel ref="businessLicense" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                      </div>
                    </li>
                  <li class="item">
                    <label class="label-term">房地产权证</label>
                    <div class="input-text">
                      <myFileModel ref="propertyRightCertificate" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">消防合格证</label>
                    <div class="input-text">
                      <myFileModel ref="fireSafetyCertificate" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                    </div>
                  </li>
                  <li class="item">
                    <label class="label-term">保险单</label>
                    <div class="input-text">
                      <myFileModel ref="insurancePolicy" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button  @click="close(false)">关闭</el-button>
                    <el-button type="primary" v-show="!disabled"  @click="saveWorkInfo()">提交</el-button>
                </div>
            </div>
        <map-dialog ref="mapDialogDraw" mapName="draw" :isShowMap="isShowMapDraw" :drawPoints="drawPoints" :mapPoint="mapPointDraw" :isDraw="isDraw" @sureCallback="sureWorkAddressDraw"
                    @hideMapBack="hideMapBackDraw" :modal="true" :centerPoint="centerPoint" :hideBtn="showMapBotton"></map-dialog>

      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
    import addStorehouse from './addStorehouse.js'

    export default addStorehouse
</script>
<style lang="scss">
  .item33{
    width: 33% !important;
    margin-right: 0 !important;
  }
  .item98{
    width: 98% !important;
  }
//.el-dialog__body {
//  padding: 2px 20px;
//  color: #606266;
//  font-size: 14px;
//  word-break: break-all;
//}


</style>
