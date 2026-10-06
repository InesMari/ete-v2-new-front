<template>
    <div id="vehicleWorkManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">车牌号码：</label>
                    <div class="input-text">
                        <el-input v-model="query.plateNumber" ></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">作业点名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" ></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">作业点地址：</label>
                    <div class="input-text">
                        <el-input v-model="query.workAddress" ></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车辆监控维护列表</span>
                    <el-tooltip effect="light" content="车辆监控维护列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true, 1)" v-entity="1005234">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openDialog(true, 2)" v-entity="1005235">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteVehicleWork" v-entity="1005236">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleWorkManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true"
                         :showSetTable="true"></tableCommon>
        </div>

        <!-- begin -->
        <el-dialog :title="title" :visible.sync="showDialog" width="800px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>车牌号码</label>
                        <div class="input-text">
                            <el-select v-model="info.vehicleId" filterable clearable :disabled="isOnlySee">
                                <el-option v-for="item in vehicleData" :key="item.id" :label="item.plateNumber"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>作业点</label>
                        <div class="input-text">
                            <el-select v-model="info.workId" filterable clearable :disabled="isOnlySee">
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                           :value="item.workId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" :disabled="isOnlySee" type="textarea" placeholder="说点什么..."></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="savePersonCost()" v-show="!isOnlySee">保存</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- end -->

    </div>
</template>

<script>
import vehicleWorkManage from './vehicleWorkManage.js'

export default vehicleWorkManage
</script>
<style lang="scss">

</style>

