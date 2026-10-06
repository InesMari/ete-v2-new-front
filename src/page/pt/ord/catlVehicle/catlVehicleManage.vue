<template>
    <div id="catlVehicleManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="catlVehicleManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车牌替换列表</span>
                    <el-tooltip effect="light" content="车牌替换列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1003113" @click="openAddDialog">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1003114" @click="openUpdateDialog">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1003115" @click="deleteItem">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1003116" @click="importExcel">导入Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="catlVehicleManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
            </tableCommon>
        </div>

        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="handleSuccess" template="/download/catlVehicle.xlsx" title="车牌替换导入"
                   bean="catlVehicleService" method="importCatlVehicle"></my-import>

        <!-- 新增 begin -->
        <el-dialog :title="title" :visible.sync="showDialog" width="500px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>客户单号</label>
                        <div class="input-text">
                            <el-input v-model="info.custOrderNum" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>旧车牌号(普)</label>
                        <div class="input-text">
                            <el-select v-model="info.srcVehicleId" placeholder="请输入后选择旧车牌号" filterable clearable
                                       remote reserve-keyword :remote-method="remoteSearchVehicle" :loading="vehicleLoading">
                                <el-option v-for="item in vehicleData" :key="item.id" :label="item.plateNumber"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>新车牌号(危)</label>
                        <div class="input-text">
                            <el-input v-model="info.plateNumber" placeholder="请输入新车牌号"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdateCatlVehicle()" >提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增 end -->

    </div>
</template>

<script>
import catlVehicleManage from './catlVehicleManage.js'
export default catlVehicleManage
</script>
<style lang="scss" scoped>

</style>

