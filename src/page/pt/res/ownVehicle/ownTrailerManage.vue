<template>
    <div id="ownVehicleTrailerManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="ownVehicleTrailerManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车挂车列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车挂车列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002223">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002224">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="updateState()" v-entity="1002249">启用/禁用</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002225">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="openInfo" v-entity="1002226">档案卡</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleTrailerManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
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

      <my-import :open.sync="uploadOpen" :handle-success="handleSuccess" begin-row="1"
                 template="/download/ownTrailer.xlsx" title="挂车导入" bean="resVehicleInfoTF"
                 method="impTrailer"></my-import>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import ownVehicleTrailerManage from './ownTrailerManage.js'

export default ownVehicleTrailerManage
</script>

<style scoped>

</style>
