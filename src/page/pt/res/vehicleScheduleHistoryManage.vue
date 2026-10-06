<template>
    <div id="vehicleScheduleHistoryManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="vehicleScheduleHistoryManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>历史运力管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="历史运力管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" :style="showList ? 'margin-right: 90px;' : ''">
                    <el-button type="primary" plain @click="changeShowStyle" size="mini" icon="el-icon-refresh">{{ text }}</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleScheduleHistoryManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" v-show="showList">
            </tableCommon>
            <div class="clearfix" v-show="!showList" style="margin-top: 5px;">
                <div style="height:350px;width: 100%;" class="fl" id="chart1"></div>
                <div style="height:350px;width: 100%;" class="fl" id="chart2"></div>
            </div>
        </div>

        <el-dialog title="查看明细" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="600px" @close="open(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">运力上报编号</label>
                        <div class="input-text">
                            <el-input v-model="info.vehicleScheduleNum" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">供应商名称</label>
                        <div class="input-text">
                            <el-input v-model="info.tenantName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">车牌号码</label>
                        <div class="input-text">
                            <el-input v-model="info.plateNumber" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">车型</label>
                        <div class="input-text">
                            <el-input v-model="info.vehicleTypeName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">车长</label>
                        <div class="input-text">
                            <el-input v-model="info.vehicleLengthName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">预计出车时间</label>
                        <div class="input-text">
                            <el-input v-model="info.scheduleTime" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">起始地城市</label>
                        <div class="input-text">
                            <el-input v-model="info.beginCityName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100" style="width: 88%;">
                        <label class="label-term">目的地城市</label>
                        <div class="input-text">
                            <el-input v-model="info.endCityName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">司机</label>
                        <div class="input-text">
                            <el-input v-model="info.driverName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">司机手机号</label>
                        <div class="input-text">
                            <el-input v-model="info.driverPhone" disabled></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" disabled></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="open(false)">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import vehicleScheduleHistoryManage from './vehicleScheduleHistoryManage.js'

export default vehicleScheduleHistoryManage
</script>

<style lang="scss" scoped>
#vehicleScheduleHistoryManage{
    //height: auto!important;
}
</style>
