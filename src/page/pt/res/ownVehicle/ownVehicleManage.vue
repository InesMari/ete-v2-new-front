<template>
    <div id="ownVehicleManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="ownVehicleManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车车辆列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车车辆列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toShowUpEquipment(true)" v-entity="1002115">更换定位设备</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002116">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002117">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="updateState()" v-entity="1002118">启用/禁用</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002213">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1002214">批量导出</el-button>
                    <el-button type="primary" plain size="mini" @click="toVehicleRecord" v-entity="1002221">档案卡</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot:default="{item}">
                  <a href="javascript:void(0);" :class="!item.vehicleLicenseFrontImgPath && !item.vehicleLicenseBackImgPath?'disabled':'link'" @click.stop="showVehicleLicenseImg(item)" style="margin: 0 10px;">行驶证</a>
                  <a href="javascript:void(0);" :class="!item.roadTransportCertificateImgPath?'disabled':'link'" @click.stop="showRoadTransportCertificateImg(item)" style="margin: 0 10px;">道路运输证</a>
                  <a href="javascript:void(0);" :class="!item.carBodyImgPath?'disabled':'link'" @click.stop="showCarBody(item)" style="margin: 0 10px;">车身照片</a>
                </template>
                <template v-slot:diyColorTd="{item}">
                  <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

      <my-import :open.sync="uploadOpen" :handle-success="doQuery" begin-row="1" :param="impParam"
                 template="/download/ownVehicle.xlsx" title="自有车导入" bean="resVehicleInfoTF"
                 method="impAddVehicleInfos"></my-import>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <!-- 更换定位设备 begin-->
        <el-dialog title="更换定位设备" :visible.sync="showUpEquipment" width="340px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="toShowUpEquipment(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term"><em>*</em>车牌号码</label>
                        <div class="input-text">
                            <el-input v-model="upEquipmentParam.plateNumber" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>设备类型</label>
                        <div class="input-text">
                            <el-select v-model="upEquipmentParam.equipmentType" placeholder="" filterable clearable
                                       @change="changeEquipmentTypeSelect(true)">
                                <el-option v-for="item in equipmentTypeData" :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>设备型号</label>
                        <div class="input-text">
                            <el-select v-model="upEquipmentParam.equipmentModel" placeholder="" filterable clearable
                                       @change="queryVehicleEquipment();">
                                <el-option v-for="item in equipmentModelData" :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>设备编号</label>
                        <div class="input-text">
                            <el-input v-model="upEquipmentParam.equipmentNumber" maxlength="50" placeholder=""
                                      :disabled="true"></el-input>
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
    </div>
</template>

<script>
import ownVehicleManage from './ownVehicleManage.js'

export default ownVehicleManage
</script>

<style scoped>

</style>
