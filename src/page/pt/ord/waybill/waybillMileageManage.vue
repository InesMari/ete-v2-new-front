<template>
    <div id="waybillMileageManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="waybillMileageManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>公里数管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="公里数管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="uploadMileage" v-entity="1002151">上传公里数</el-button>
                    <el-button type="primary" plain size="mini" @click="updateUploadMileage" v-entity="1002162">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="clearMileage(3, null)" v-entity="1002154">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="confirmMileage()" v-entity="1002152">里程确认</el-button>
                    <el-button type="primary" plain size="mini" @click="cancelConfirmMileage()" v-entity="1002153">取消确认</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1002242">导出Excel</el-button>
                  <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="waybillMileageManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>

        <!--        新增 修改 详情-->
        <el-dialog :title="title" :visible.sync="dialogShow" width="640px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>派车单号</label>
                        <div class="input-text">
                            <el-select v-model="info.key" filterable clearable
                                       :disabled="isOnlySee || disabledWaybill" placeholder="请选择派车单号">
                                <el-option v-for="item in waybillData" :key="item.key"
                                           :label="item.waybillNum" :value="item.key"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>起始公里(km)</label>
                        <div class="input-text">
                            <el-input v-model="info.startMileage" @input="changeMileage" v-mydoubleval placeholder="请输入公里数"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>结束公里(km)</label>
                        <div class="input-text">
                            <el-input v-model="info.endMileage" @input="changeMileage" v-mydoubleval placeholder="请输入公里数"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">里程数(km)</label>
                        <div class="input-text">
                            <el-input v-model="info.totalMileage" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>起始公里图片</label>
                        <div class="input-text">
                            <myFileModel ref="begin" @successCallback="successCallback" componentId="1"
                                         supportFiles="img" :disabledEdit="isOnlySee" :disabledDel="isOnlySee"></myFileModel>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>结束公里图片</label>
                        <div class="input-text">
                            <myFileModel ref="end" @successCallback="successCallback" componentId="2"
                                         supportFiles="img" :disabledEdit="isOnlySee" :disabledDel="isOnlySee"></myFileModel>
                        </div>
                    </li>

                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" v-show="saveShow" @click="saveMileage">保存</el-button>
                </div>
            </div>
        </el-dialog>
        <!--        新增 修改 详情-->

    </div>
</template>

<script>
import waybillMileageManage from './waybillMileageManage.js'

export default waybillMileageManage
</script>

<style scoped lang="scss">
    #waybillMileageManage{
        .common-info .content > .item .label-term {
            width: 118px;
        }
        .common-info .content > .item .input-text {
            width: calc(100% - 128px);
        }
    }
</style>
