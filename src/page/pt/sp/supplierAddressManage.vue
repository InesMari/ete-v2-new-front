<template>
    <div id="supplierAddressManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierAddressManageSearch"></searchList>

        <!--   列表  开始-->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>专线地址列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="专线地址列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showArea" v-entity="1002073">查看电子围栏</el-button>
                    <el-button type="primary" plain size="mini" @click="showPage(true, 0)" v-entity="1002074">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="showPage(true,2)" v-entity="1002075">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteWork()" v-entity="1002076">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierAddressManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>
        <!--  列表  结束-->
        <!-- 新增作业点 开始-->
        <el-dialog :title="title" :visible.sync="showModify" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showPage(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商名称</label>
                        <div class="input-text">
                            <el-select v-model="workInfo.tenantId" placeholder="请选择归属供应商" filterable clearable @change="changeSupplier" :disabled="isOnlySee">
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>作业点名称</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.workName" maxlength="100" placeholder="请输入作业点名称" :disabled="isOnlySee" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所在地区</label>
                        <div class="input-text">
                            <el-select v-model="workInfo.provinceId" placeholder="省" filterable @change="changeProvince" disabled style="width:23%;margin-right:2%;">
                                <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                           :value="item.id" ></el-option>
                            </el-select>
                            <el-select v-model="workInfo.cityId" placeholder="市" filterable @change="changeCity" :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                           :value="item.id" ></el-option>
                            </el-select>
                            <el-select v-model="workInfo.districtId" placeholder="区" filterable :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>

                            <el-button type="primary" @click="showMap" style="width:25%;">{{tip}}</el-button>
                            <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" @sureCallback="sureWorkAddress"
                                        :showSure="showSure" :showCancel="showCancel" :showClear="showClear"
                                        @hideMapBack="hideMapBack" :modal="false"></map-dialog>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>街道地址</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.address" maxlength="200" placeholder="不需要重复填写省/市/区" :disabled="isOnlySee" @input="forceUpdate" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">电子围栏范围</label>
                        <div class="input-text">
                            <el-input v-show="showElectricFenceInput" v-model="workInfo.electricFence" maxlength="100" :placeholder="electricPlace" :disabled="isOnlySee || isOverlays" :style="{'width': width1_}"></el-input>
                            <el-button type="primary" @click="showMapDraw" class="fr" :style="{'width': width2_}" >{{tip2}}</el-button>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>类型</label>
                        <div class="input-text">
                            <el-radio v-model="workInfo.workinfoType" label="1" :disabled="isOnlySee">作业点</el-radio>
                            <el-radio v-model="workInfo.workinfoType" label="2" :disabled="isOnlySee">仓库</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.linkmanName" maxlength="50" placeholder="请输入联系人" :disabled="isOnlySee" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系手机</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.bill" maxlength="11" v-mynumval placeholder="请输入联系手机" :disabled="isOnlySee" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.phone" maxlength="50" placeholder="请输入联系电话" :disabled="isOnlySee" show-word-limit></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showPage(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveWorkInfo()" v-show="!isOnlySee">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <map-dialog ref="mapDialogDraw" mapName="draw" :isShowMap="isShowMapDraw" :mapPoint="mapPointDraw" :drawPoints="drawPoints"
                    :isDraw="isDrawArea" @sureCallback="sureWorkAddressDraw"  :showSure="showSureDraw" :showCancel="showCancelDraw" :showClear="showClearDraw"
                    @hideMapBack="hideMapBackDraw" :modal="true"></map-dialog>
        <!-- 新增作业点 结束-->

    </div>
</template>
<script>
    import supplierAddressManage from './supplierAddressManage.js'
    export default supplierAddressManage
</script>
<style lang="scss">

</style>

