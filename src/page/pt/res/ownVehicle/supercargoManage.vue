<template>
    <div id="supercargoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="supercargoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>押运员列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="押运员列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002122">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002123">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteSupercargoInfo()" v-entity="1002124">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002212">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1002216">批量导出</el-button>
                    <el-button type="danger" plain size="mini" @click="open(true)" v-entity="1002227">离职</el-button>
                </div>
            </div>
            <tableCommon tableName="supercargoManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" :class="!item.idCardFrontImgUrl && !item.idCardBackImgUrl?'disabled':'link'"
                       @click.stop="showIdCardImg(item)" style="margin: 0 10px;">身份证</a>
                    <a href="javascript:void(0);" :class="!item.supercargoLicenceImgUrl?'disabled':'link'"
                       @click.stop="showSupercargoLicenceImg(item)" style="margin: 0 10px;">押运证</a>
                </template>
            </tableCommon>
        </div>

        <my-import :open.sync="uploadOpen" :handle-success="doQuery" :begin-row="1"
                   template="/download/ownSupercargo.xlsx" title="自有押运员导入" bean="supercargoService"
                   method="impAddSupercargoInfos"></my-import>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <el-dialog title="离职" :visible.sync="showModify" width="660px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="open(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>押运员姓名</label>
                        <div class="input-text">
                            <el-input v-model="info.supercargoName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100" >
                        <label class="label-term"><em>*</em>离职日期</label>
                        <div class="input-text">
                            <el-date-picker v-model="info.resignDate" type="date" class="tl"
                                            placeholder="离职日期"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">离职原因备注</label>
                        <div class="input-text">
                            <el-input v-model="info.resignRemark" ></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn">
                    <el-button size="mini" @click="open(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="resignForSupercargo()">确认</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import supercargoManage from './supercargoManage.js'

export default supercargoManage
</script>

<style scoped>

</style>
