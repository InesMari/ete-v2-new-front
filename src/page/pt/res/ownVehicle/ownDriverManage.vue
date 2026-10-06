<template>
    <div id="ownDriverManage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query"
                    searchKey="ownDriverManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车司机列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车司机列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1)" v-entity="1002119">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2)" v-entity="1002120">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="updateState()" v-entity="1002121">启用/禁用</el-button>
                    <el-button type="danger" plain size="mini" @click="delDriver()" v-entity="1002165">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002211">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1002215">批量导出</el-button>
                    <el-button type="danger" plain size="mini" @click="open(true)" v-entity="1002218">离职</el-button>
                </div>
            </div>
            <tableCommon tableName="ownDriverManageTable" :head="head" ref="table"
                         :showNum="true" :showSetTable="true" :singleSelect="true"
                         @dblclickItem="dblclickItem">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);"
                       :class="!item.idCardFrontImgPath && !item.idCardBackImgPath?'disabled':'link'"
                       @click.stop="showIdCardImg(item)" style="margin: 0 10px;">身份证</a>
                    <a href="javascript:void(0);"
                       :class="!item.driverLicenceFrontImg && !item.idCardBackImgPath?'disabled':'link'"
                       @click.stop="showDriverLicenceImg(item)" style="margin: 0 10px;">驾驶证</a>
                    <a href="javascript:void(0);" :class="!item.qualifyCertImgUrl?'disabled':'link'"
                       @click.stop="showQualifyCertImgUrl(item)" style="margin: 0 10px;">从业资格证</a>
                </template>
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

        <my-import :open.sync="uploadOpen" :handle-success="doQuery" :begin-row="1" :param="impParam"
                   template="/download/ownDriver.xlsx" title="自有司机导入" bean="driverTF"
                   method="impAddDriverInfos"></my-import>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <el-dialog title="离职" :visible.sync="showModify" width="660px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="open(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>司机姓名</label>
                        <div class="input-text">
                            <el-input v-model="info.driverName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
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
                    <el-button type="primary" size="mini" @click="resignForDriver()">确认</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import ownDriverManage from './ownDriverManage.js'

export default ownDriverManage
</script>

<style scoped>

</style>
