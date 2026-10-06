<template>
  <div id="vehicleManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="vehicleManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>车辆列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="车辆列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">

            <el-button type="primary" plain size="mini" @click="toShowUpEquipment(true)" v-entity="1002019">更换定位设备</el-button>
            <el-button type="primary" plain size="mini" @click="openPage(1)"  v-entity="1002020">新增</el-button>
            <el-button type="primary" plain size="mini" @click="openPage(2)" v-entity="1002021">修改</el-button>
            <el-button type="primary" plain size="mini" @click="updateState()" v-entity="1002023">启用/禁用</el-button>
            <el-button type="primary" plain size="mini" @click="openPage(3)" v-entity="1002024">资质审核</el-button>
            <el-button type="danger" plain size="mini" @click="openSync(true)" v-entity="1002220">同步车辆</el-button>
            <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002254">批量导入</el-button>
        </div>
      </div>
      <tableCommon tableName="vehicleManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" @dblclickItem="dblclickItem" :singleSelect="true">
        <template v-slot:default="{item}">
          <a href="javascript:void(0);" :class="!item.vehicleLicenseFrontImgPath && !item.vehicleLicenseBackImgPath?'disabled':'link'" @click.stop="showVehicleLicenseImg(item)" style="margin: 0 10px;">行驶证</a>
          <a href="javascript:void(0);" :class="!item.roadTransportCertificateImgPath?'disabled':'link'" @click.stop="showRoadTransportCertificateImg(item)" style="margin: 0 10px;">道路运输证</a>
          <a href="javascript:void(0);" :class="!item.roadOperatingPermitImgPath?'disabled':'link'" @click.stop="showRoadOperatingPermitImg(item)" style="margin: 0 10px;">道路运输经营许可证</a>
        </template>
        <template v-slot:diyColorTd="{item}">
          <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
        </template>
      </tableCommon>
    </div>

    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <!-- 更换定位设备 begin-->
    <el-dialog title="更换定位设备" :visible.sync="showUpEquipment" width="340px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toShowUpEquipment">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>车牌号码</label>
            <div class="input-text">
              <el-input v-model="upEquipmentParam.plateNumber" maxlength="20" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>设备类型</label>
            <div class="input-text">
              <el-select v-model="upEquipmentParam.equipmentType" placeholder="" filterable clearable @change="changeEquipmentTypeSelect">
                <el-option v-for="item in equipmentTypeData" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>设备型号</label>
            <div class="input-text">
              <el-select v-model="upEquipmentParam.equipmentModel" placeholder="" filterable clearable @change="queryVehicleEquipment();forceInput()">
                <el-option v-for="item in equipmentModelData_" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item" v-show="upEquipmentParam.equipmentType != 8">
            <label class="label-term"><em>*</em>设备编号</label>
            <div class="input-text">
              <el-input v-model="upEquipmentParam.equipmentNumber" maxlength="50" placeholder="" :disabled="true"></el-input>
            </div>
          </li>

            <li class="item"  v-show="upEquipmentParam.equipmentType == 8">
                <label class="label-term"><em>*</em>设备编号</label>
                <div class="input-text">
                    <el-select v-model="upEquipmentParam.equipmentId" placeholder="" filterable clearable @change="queryVehicleEquipment">
                        <el-option v-for="item in equipmentData" :key="item.equipmentId" :label="item.equipmentNumber"
                                   :value="item.equipmentId"></el-option>
                    </el-select>
                </div>
            </li>

        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toShowUpEquipment(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="saveVehicleEquipment()">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 更换定位设备 end-->

    <!-- 同步 begin -->
    <el-dialog title="同步车辆" :visible.sync="showSync" width="360px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="openSync(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>车牌号码</label>
            <div class="input-text">
              <el-input v-model="plateNumber" maxlength="30"  placeholder="请输入车牌号码"></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="openSync(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="syncVehicleInfo()">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 同步 end -->

      <my-import :open.sync="uploadOpen" :handle-success="doQuery" begin-row="1" :param="impParam"
                 template="/download/vehicle.xlsx" title="车辆导入" bean="resVehicleInfoTF"
                 method="impAddVehicleInfos"></my-import>

  </div>
</template>

<script>
import vehicleManage from './vehicleManage.js'
export default vehicleManage
</script>

<style scoped>

</style>
