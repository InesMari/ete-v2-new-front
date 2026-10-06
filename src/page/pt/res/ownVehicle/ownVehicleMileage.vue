<template>
    <div id="ownVehicleMileage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="ownVehicleMileageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车里程管理列表</span>
                    <el-tooltip effect="light" content="自有车里程管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1002235" @click="openUpdateDialog">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002236" @click="uploadOpen = true">导入有效里程</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002237" @click="download()">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleMileageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
            </tableCommon>
        </div>

        <!-- 开始 -->
        <el-dialog title="修改有效里程" :visible.sync="showUpdate" width="600px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>车牌号码</label>
                        <div class="input-text">
                            <el-input v-model="info.plateNumber" placeholder="车牌号码" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>发生日期</label>
                        <div class="input-text">
                            <el-input v-model="info.createDate" placeholder="日期" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>总行驶里程</label>
                        <div class="input-text">
                            <el-input v-model="info.sumMileage" placeholder="总行驶里程" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>有效里程</label>
                        <div class="input-text">
                            <el-input v-model="info.effectiveMileage" v-mydoubleval maxlength="15" placeholder="有效里程"></el-input>
                        </div>
                    </li>

                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="updateShow(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="updateVehicleMileageInfo()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 结束 -->


        <!-- 导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="sureCallback" begin-row="1"
                   template="/download/ownVehicleMileage.xlsx" title="导入有效里程导入" bean="vehicleMileageService"
                   method="importVehicleMileage"></my-import>
        <!-- 导入 -->

    </div>
</template>

<script>
import ownVehicleMileage from './ownVehicleMileage.js'

export default ownVehicleMileage
</script>
<style lang="scss">

</style>
