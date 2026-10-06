<template>
  <div id="materialInfoManage">
    <select-work v-show="showSelWork"></select-work>
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="materialInfoManageSearch" v-show="!showSelWork"></searchList>
    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
          <h3>
              <span>物料管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
              <el-tooltip effect="light" content="物料管理列表" placement="right">
                  <img class="tip" src="@/static/image/tip.png" alt="">
              </el-tooltip>
          </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="uploadOpen = true"  v-entity="1005064">批量导入</el-button>
          <el-button type="primary" plain size="mini" @click="toAddMaterial(true)"  v-entity="1005065">新增</el-button>
          <el-button type="primary" plain size="mini" @click="toUpMaterial()" v-entity="1005066">修改</el-button>
          <el-button type="danger" plain size="mini" @click="delMaterialInfo()" v-entity="1005067">删除</el-button>
            <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
        </div>
      </div>
      <tableCommon tableName="materialInfoManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem"></tableCommon>
    </div>
    <!-- 批量导入 开始-->
      <el-dialog class="sureDialog" title="导入物料" :visible.sync="uploadOpen" :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 width="500px" @close="showUpload(false)">
          <div class="common-info" style="border:none;padding:0;">
              <em style="font-size:14px;padding-left:22px;">注：所属货主必须是到货厂商的归属货主</em>
              <ul class="content clearfix" style="margin-top:10px;">
                  <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                      <my-import ref="myImport" :handle-success="sureSuccess" :noneDialog="true"
                                 template="/download/material.xlsx" title="导入物料"
                                 tip="仅允许导入“xls”或“xlsx”格式文件！" bean="wmsMaterialPickTF" method="impAddMaterialInfo"></my-import>
                  </li>
              </ul>
              <div class="page-bot-btn ">
                  <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                  <el-button type="primary" size="mini" @click="sure()">确认</el-button>
              </div>
          </div>
      </el-dialog>
      <!-- 批量导入 结束-->


    <!-- 新增 物料 -->
    <el-dialog class="materialDialog" :title="title" :visible.sync="showMaterial" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddMaterial(false)">
      <div class="common-info flex" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term"><em>*</em>物料编码</label>
            <div class="input-text">
              <el-input v-model="material.materialNum" placeholder="请输入物料编码" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>物料描述</label>
            <div class="input-text">
              <el-input v-model="material.materialDesc" placeholder="请输入物料描述" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>所属货主</label>
            <div class="input-text">
              <el-select v-model="material.srcTenantId" placeholder="请选择所属货主" clearable filterable :disabled="isLock" @change="chnageSrcTenantOrFromTenant(1)">
                <el-option v-for="item in srcTenantData" :key="item.wId" :label="item.name" :value="item.wId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>到货厂商</label>
            <div class="input-text">
              <el-select v-model="material.fromTenantId" placeholder="请选择到货厂商" clearable filterable :disabled="isLock" @change="chnageSrcTenantOrFromTenant(2)">
                <el-option v-for="item in fromTenantData" :key="item.wId" :label="item.name" :value="item.wId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>管理单位</label>
            <div class="input-text">
              <el-select v-model="material.unit" placeholder="请选择管理单位" clearable filterable :disabled="isLock">
                <el-option v-for="item in unitData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                    <span style="float: left">{{ item.codeName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.codeDesc }}</span>
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库龄超期</label>
            <div class="input-text">
              <el-input v-model="material.warningDay" v-mynumval placeholder="请输入天数" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">最低库存</label>
            <div class="input-text">
              <el-input v-model="material.minStock" v-mynumval placeholder="请输入最低库存" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">最高库存</label>
            <div class="input-text">
              <el-input v-model="material.maxStock" v-mynumval placeholder="请输入最高库存" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>货物有效期</label>
            <div class="input-text">
              <el-input v-model="material.validityPeriod" v-mynumval placeholder="请输入天数" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">立库库位类型</label>
            <div class="input-text">
              <el-input v-model="material.timesStorageCode"  placeholder="立库库位类型" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>计费规格类型</label>
            <div class="input-text">
              <el-select v-model="material.specsType" placeholder="请选择计费规格类型" clearable filterable :disabled="isLock">
                <el-option v-for="item in specsTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">存放条件</label>
            <div class="input-text">
              <el-radio-group v-model="material.storageCondition"  :disabled="isLock">
                <el-radio :label="item.codeValue" v-for="item in storageConditionData">{{ item.codeName }}</el-radio>
              </el-radio-group>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">客户物料编码</label>
            <div class="input-text">
              <el-input v-model="material.custMaterialNum" placeholder="请输入客户物料编码" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">关联物料代码</label>
            <div class="input-text">
              <el-input v-model="material.relMaterialNum" placeholder="请输入关联物料代码" :disabled="isLock"></el-input>
            </div>
          </li>
          <li class="item" style="width: 23%;  margin-right: 2%;">
            <label class="label-term" style="width: 115px;"><em>*</em>是否开启预警</label>
            <div class="input-text">
              <el-switch v-model="material.isWarning == 1" @change="changeMaterialSwitch()" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"></el-switch>
              <span class="name">{{material.isWarning == 1 ? "是" : "否"}}</span>
            </div>
          </li>
          <li class="item" style="width: 23%;  margin-right: 2%;">
            <label class="label-term" style="width: 115px;"><em>*</em>是否整进整出</label>
            <div class="input-text">
              <el-switch v-model="material.isAllInAllOut == 1" @change="changeIsAllInAllOutSwitch()" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"></el-switch>
              <span class="name">{{material.isAllInAllOut == 1 ? "是" : "否"}}</span>
              <el-tooltip class="item" effect="dark" placement="top-start" style="margin-left: 5px;">
                <div style="color: #fff;"slot="content">新建出库单时，物料【在库数量】为1440，则计划出库数量自动填入1440。</div>
                <i class="el-icon-question" style="color: red;"></i>
              </el-tooltip>
            </div>
          </li>
<!--          <li class="item item50" >-->
<!--            <label class="label-term"><em>*</em>是否需要扫码</label>-->
<!--            <div class="input-text">-->
<!--              <el-switch v-model="material.scanQrcode == 1" @change="changeScanQrcodeSwitch()"-->
<!--                         active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock || disabled"></el-switch>-->
<!--              <span class="name">{{material.scanQrcode == 1 ? "是" : "否"}}</span>-->
<!--            </div>-->
<!--          </li>-->
          <li class="item" style="width: 23%;  margin-right: 2%;">
              <label class="label-term" style="width: 115px;"><em>*</em>是否需要扫码</label>
              <div class="input-text">
                  <el-switch v-model="material.newScanQrcode == 1" @change="changeNewScanQrcodeSwitch()" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"></el-switch>
                  <span class="name">{{material.newScanQrcode == 1 ? "是" : "否"}}</span>
              </div>
          </li>
          <li class="item" style="width: 23%;  margin-right: 2%;">
            <label class="label-term" style="width: 115px;"><em>*</em>拆单是否使用旧标签</label>
            <div class="input-text">
              <el-switch v-model="material.isUseOldQrcode == 1" @change="changeSwitch('isUseOldQrcode')"
                         active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock || relCustQrcodeTypeDisable"></el-switch>
              <span class="name">{{material.isUseOldQrcode == 1 ? "是" : "否"}}</span>
            </div>
          </li>

          <li class="item item50">
            <label class="label-term"><em>*</em>关联客户码</label>
            <div class="input-text">
              <el-radio-group v-model="material.relCustQrcodeType"  :disabled="isLock||relCustQrcodeTypeDisable">
                <el-radio :label="item.codeValue" v-for="item in relCustQrcodeTypeData">{{ item.codeName }}</el-radio>
              </el-radio-group>
            </div>
          </li>
        </ul>
        <h3 class="common-title">
          <span class="title-name"><em>注：如果客户按立方计费，会按此处数据计算，计算公式: 收费总立方=最大装载长(m)*最大装载宽(m)*最大装载高(m)*托数！</em></span>
        </h3>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="150"><em>*</em>规格名称</th>
            <th><em>*</em>最大装载长(cm)</th>
            <th><em>*</em>最大装载宽(cm)</th>
            <th><em>*</em>最大装载高(cm)</th>
            <th>箱装容数</th>
            <th><em>*</em>托装容数</th>
            <th><em>*</em>是否默认</th>
            <th width="50" v-show="!isLock">
              <el-tooltip effect="dark" content="添加规格" placement="top-start" :hide-after='1000'>
                <span @click="addMaterialSpecs()" class="add"></span>
              </el-tooltip>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(specs, index) in materialSpecsData">
            <td>
              <el-input v-model="specs.name" type="text" maxlength="50" placeholder="" :disabled="isLock"></el-input>
            </td>

            <td>
              <el-input v-model="specs.lengthStr" type="text" maxlength="10" v-mynumval :disabled="isLock"></el-input>
            </td>
              <td>
                  <el-input v-model="specs.widthStr" type="text" maxlength="10" v-mynumval :disabled="isLock"></el-input>
              </td>
              <td>
                  <el-input v-model="specs.heightStr" type="text" maxlength="10" v-mynumval :disabled="isLock"></el-input>
              </td>
            <td>
              <el-input v-model="specs.perBoxNums" type="text" v-mydouble4val placeholder="" :disabled="isLock"></el-input>
            </td>
            <td>
              <el-input v-model="specs.perPalletNums" type="text" v-mydouble4val placeholder="" :disabled="isLock"></el-input>
            </td>
            <td>
              <div class="switchDiv">
                <el-switch v-model="specs.isDefault == 1" @change="changeSpecsSwitch(index)" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"></el-switch>
                <span class="name">{{specs.isDefault == 1 ? "是" : "否"}}</span>
              </div>
            </td>
            <td v-show="!isLock">
              <el-tooltip effect="dark" content="删除规格" placement="top-start" :hide-after='1000'>
                <span @click="removeMaterialSpecs(index)" class="del"></span>
              </el-tooltip>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddMaterial(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveMaterial()" v-show="!isLock">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import materialInfoManage from './materialInfoManage.js'

export default materialInfoManage
</script>
<style lang="scss">
#materialInfoManage{
  .materialDialog{
    .tableCommon{
      .el-input__inner{
        text-align: center;
      }
    }
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
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

      // &:hover{
      //   color: #fff;
      //   background: $main-color;
      // }
    }
  }
}
</style>

