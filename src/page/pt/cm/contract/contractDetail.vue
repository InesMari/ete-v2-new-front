<template>
    <div id="contractDetail" class="contractDetail orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">合同信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">合同编号</td>
                    <td class="value">
                        <el-input v-model="contract.contractNum" maxlength="100" placeholder="合同编号不填系统默认生成"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label"><em v-show="contractType != 5">*</em>{{ contractType == 7 ? "甲方开票抬头" : "合同评审编号" }}</td>
                    <td class="value">
                        <el-select v-if="contractType == 7" v-model="contract.partyATitle"
                                   placeholder="请选择甲方开票抬头" class="tl" filterable clearable :disabled="disabled">
                            <el-option v-for="item in payTitleOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                        <el-select v-else v-model="contract.reviewContractId" placeholder="请选择合同评审编号"
                                   @change="changeContractReview" class="tl" filterable clearable :disabled="disabled">
                            <el-option v-for="item in contractData" :key="item.contractId" :label="item.contractName"
                                       :value="item.contractId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>{{ contractType == 7 ? "甲方所属部门" : "合同名称" }}</td>
                    <td class="value">
                        <el-select v-if="contractType == 7" v-model="contract.partyAOrgId"
                                   placeholder="请选择甲方所属部门" class="tl" filterable clearable :disabled="disabled">
                            <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-input v-else v-model="contract.contractName" maxlength="100" placeholder="请输入合同名称"
                                  :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label" v-if="contractType==1"><em>*</em>客户名称</td>
                    <td class="value" v-if="contractType==1">
                        <el-select v-model="contract.tenantId" placeholder="请选择客户名称" filterable clearable
                                   :disabled="disabled||tenantDisabled">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td class="label" v-if="contractType==7"><em>*</em>业务内容</td>
                    <td class="value" v-if="contractType==7">
                        <el-input v-model="contract.businessContent" maxlength="100" placeholder="请输入业务内容"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label" v-if="contractType!=1 && contractType!=7"><em>*</em>供应商名称</td>
                    <td class="value" v-if="contractType!=1 && contractType!=7">
                        <el-select v-model="contract.tenantId" placeholder="供应商名称" filterable clearable
                                   :disabled="disabled">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>合同开始日期</td>
                    <td class="value">
                        <el-date-picker v-model="contract.beginDate" type="date" class="tl" @change="changeStartDate(contract)"
                                        placeholder="请选择合同开始日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled"
                                        @input="$forceUpdate"></el-date-picker>
                    </td>
                    <td class="label"><em>*</em>合同结束日期</td>
                    <td class="value">
                        <el-date-picker v-model="contract.endDate" type="date" class="tl"
                                        placeholder="请选择合同结束日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled"
                                        @input="$forceUpdate"></el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label" v-if="contractType != 7&&disabled&&(contract.orgIds==null||contract.orgIds.length==0)"><em>*</em>物流中心</td>
                    <td class="value" v-if="contractType != 7&&disabled&&(contract.orgIds==null||contract.orgIds.length==0)">
                      <el-tooltip :content="getSelectedLabels(contract.workIds, storeHouseData, 'workId', 'workName')" placement="top" >
                        <el-select v-model="contract.workIds" placeholder="物流中心" filterable multiple clearable
                                   collapse-tags  :disabled="disabled">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                      </el-tooltip>
                    </td>
                  <td class="label" v-if="!(contractType != 7&&disabled&&(contract.orgIds==null||contract.orgIds.length==0))"><em>*</em>部门</td>
                  <td class="value" v-if="!(contractType != 7&&disabled&&(contract.orgIds==null||contract.orgIds.length==0))">
                    <el-tooltip :content="getSelectedLabels(contract.orgIds, orgData, 'id','orgName')" placement="top">
                      <el-select v-model="contract.orgIds" placeholder="部门" filterable multiple clearable
                                 collapse-tags :disabled="disabled">
                        <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                      </el-select>
                    </el-tooltip>
                  </td>
                    <td class="label">是否顺延</td>
                    <td class="value">
                        <el-select v-model="contract.isPostpone" placeholder="请选择是否顺延" filterable clearable
                                   :disabled="disabled">
                            <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>

                  <td class="label" v-if="contractType != 7">备注</td>
                  <td class="value" v-if="contractType != 7">
                    <el-input v-model="contract.remark" maxlength="100" placeholder="请输入备注"
                              :disabled="disabled"></el-input>
                  </td>

                    <td class="label" v-if="contractType == 7"><em>*</em>乙方开票抬头</td>
                    <td class="value" v-if="contractType == 7">
                        <el-select v-model="contract.partyBTitle"
                                   placeholder="请选择乙方开票抬头" class="tl" filterable clearable :disabled="disabled">
                            <el-option v-for="item in payTitleOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label" v-if="contractType == 7"><em>*</em>乙方所属部门</td>
                    <td class="value" v-if="contractType == 7">
                        <el-select v-model="contract.partyBOrgId"
                                   placeholder="请选择乙方所属部门" class="tl" filterable clearable :disabled="disabled">
                            <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>

          <h3 class="common-title"  style="margin-top: 10px;" v-if="contractType == 5"><span class="title-name">车辆保险</span></h3>
          <div class="vehicle-insurance-container"  v-if="contractType == 5">
            <div class="vehicle-insurance-item">
              <el-radio-group v-model="contract.isVehicleInsurance"  :disabled="disabled" @change="vehicleInsuranceChange">
                <el-radio v-for="item in whetherData" :label="item.codeValue" :key="item.codeValue">{{ item.codeName }}
                </el-radio>
              </el-radio-group>
            </div>
            <div class="vehicle-insurance-item" v-show="contract.isVehicleInsurance==1">
              <el-checkbox-group v-model="contract.vehicleInsuranceType"  :disabled="disabled">
                <el-checkbox v-for="item in vehicleInsuranceTypeData" :label="item.codeValue" :key="item.codeValue" >{{ item.codeName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="vehicle-insurance-item" v-show="contract.isVehicleInsurance==1">
              <el-select v-model="contract.vehicleId" placeholder="请选择车牌" class="tl" filterable clearable :disabled="disabled">
                <el-option v-for="item in vehicleData" :key="item.id" :label="item.plateNumber"
                           :value="item.id"></el-option>
              </el-select>
            </div>
          </div>

          <h3 class="common-title" style="margin-top: 10px;"><span class="title-name">合同原件</span></h3>
            <div class="clearfix">
                <myFileModel ref="img" :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                             @successCallback="setImgData" @delCallback="deleteImgData"></myFileModel>
            </div>

            <h3 class="common-title" v-if="type!=1 && contractType != 7"><span class="title-name">子合同或补充合同信息</span>
                <el-button type="primary" plain size="mini" @click="addSubItem" style="float: right;"
                           v-show="!disabled">添加
                </el-button>
            </h3>
            <div class="table_height" style="z-index: 99;position: relative;" v-if="type!=1  && contractType != 7">

                <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="150">合同编号</th>
                        <th width="150">合同评审号</th>
                        <th width="200">合同名称</th>
                        <th width="120">合同开始日期</th>
                        <th width="120">合同结束日期</th>
                        <th width="120">合同原件</th>
                        <th width="80">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in contract.subContractList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-input v-model="item.contractNum" @input="forceUpdate" maxlength="100"
                                      placeholder="合同编号不填跟主合同一致" :disabled="disabled"></el-input>
                        </td>
                        <td>
                            <el-select v-model="item.reviewContractId" placeholder="请选择合同评审编号"
                                       @change="changeSubContractReview(item)" class="tl" filterable clearable
                                       :disabled="disabled">
                                <el-option v-for="subItem in contractData" :key="subItem.contractId"
                                           :label="subItem.contractName"
                                           :value="subItem.contractId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="item.contractName" @input="forceUpdate" maxlength="100"
                                      placeholder="请输入合同名称" :disabled="disabled"></el-input>
                        </td>
                        <td>
                            <el-date-picker v-model="item.beginDate" type="date" class="tl"
                                            placeholder="请选择合同开始日期"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled"
                                            @input="$forceUpdate"></el-date-picker>
                        </td>
                        <td>
                            <el-date-picker v-model="item.endDate" type="date" class="tl"
                                            placeholder="请选择合同结束日期"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled"
                                            @input="$forceUpdate"></el-date-picker>
                        </td>
                        <td>
                            <myFileModel :ref="'img'+index" clickType="text"
                                         @successCallback="fileCallback($event,item)" @delCallback="delCallback(item)"
                                         :disabledEdit="disabledEdit" :disabledDel="disabledDel"></myFileModel>
                        </td>
                        <td style="text-align: center;">
                            <el-tooltip effect="dark" content="删除" v-show="!disabled"
                                        placement="top-start" :hide-after='1000'>
                                <span @click="removeSubItem(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>


            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="!disabled" @click="saveOrUpdateContract()">提交
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import contractDetail from './contractDetail.js'

export default contractDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss">
.contractDetail {
    .table_height {
        overflow: auto;
        min-height: 300px;
        width: 100%;
        border-bottom: $border;

        .tableCommon {
            .el-select {
                width: 100%;
            }
        }
    }
  // 新增车辆保险容器样式
  .vehicle-insurance-container {
    display: flex;
    align-items: center;
    gap: 100px; // 控制控件之间的间距
    padding: 10px 0;
    margin-left: 30px; // 增加左边距，与其他内容对齐

    .vehicle-insurance-item {
      display: flex;
      align-items: center;
      height: 40px; // 占位元素高度与控件高度一致

      .el-radio-group,
      .el-checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px; // 控制单选框/复选框之间的间距
      }

      .el-select {
        width: 280px; // 设置下拉框宽度
      }
    }
  }
}
</style>
