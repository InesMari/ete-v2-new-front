<template>
    <div id="vehiclePositionManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="vehiclePositionManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车辆定位列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆定位列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showModify = true" v-entity="1002257">导入</el-button>
                    <el-button type="primary"plain size="mini" @click="downloadExcel" v-entity="1002258">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="vehiclePositionManageTable" ref="table" :showNum="true"
                         :showSetTable="true" :head="head" :singleSelect="true">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="openDetail(item)" style="margin: 0 10px;">{{item.waybillNum}}</a>
                </template>
            </tableCommon>
        </div>

<!--        导入下载-->
        <el-dialog title="车辆定位导入" :visible.sync="showModify"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" width="620px"
                   @close="showModifyDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>车牌所在列</label>
                        <div class="input-text">
                            <el-input type="number" v-model="importInfo.plateNumberIndex" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">目的地所在列</label>
                        <div class="input-text">
                            <el-input type="number" v-model="importInfo.addressStrIndex" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>车辆位置写入列</label>
                        <div class="input-text">
                            <el-input type="number" v-model="importInfo.gpsLocationIndex" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>距离目的地写入列</label>
                        <div class="input-text">
                            <el-input type="number" v-model="importInfo.distanceIndex" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>预计到达时间写入列</label>
                        <div class="input-text">
                            <el-input type="number" v-model="importInfo.durationIndex" placeholder="请输入"></el-input>
                        </div>
                    </li>
                    <li class="item item100" style="margin-top:10px;">
                        <label class="label-term"><em>*</em>上传数据</label>
                        <div class="input-text">
                            <myImportDown ref="myBudgetImport" :handle-success="myImportBudgetCallback" :param="importInfo" :noneDialog="true" title="上传excel"
                                          bean="sinoiovBusinessTF"
                                          method="importVehiclePositionExcel"
                                          downMethod="exportVehiclePositionExcelResult"
                                          :show-file-list="false"></myImportDown>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showModifyDialog(false)">关闭</el-button>
<!--                    <el-button type="primary" size="mini" @click="saveReovery()">2确定</el-button>-->
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vehiclePositionManage from './vehiclePositionManage.js'
export default vehiclePositionManage
</script>

<style lang="scss">

</style>
