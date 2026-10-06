<template>
    <div id="outDeviceClearUpRecordManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery">
                <div class="item">
                    <label class="label">登记单号：</label>
                    <div class="input-text">
                        <el-input v-model="query.recordNum" placeholder="登记单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-input v-model="query.supplierTenantName" placeholder="供应商" type="text"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">整理时间：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.createDate" type="daterange" range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">仓库名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.workId" filterable clearable placeholder="仓库名称"
                                   @change="doQuery">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">确认状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.confirmState" filterable clearable placeholder="确认状态"
                                   @change="doQuery">
                            <el-option v-for="item in confirmData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                    </el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空
                    </el-button>
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
                    <span>客户器具整理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="客户器具整理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005207" @click="openConfirm(true)">确认登记</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005208" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="outDeviceClearUpRecordManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="openDetail">
                <template v-slot:default="{item, code}">
                    <div v-if="code=='file'">
                        <a class="link" :class="!item.fileUrl?'disabled':'link'" href="javascript:;"
                           @click="showImg(item)">查看</a>
                    </div>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <el-dialog title="整理确认" :visible.sync="dialogShow" width="540px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openConfirm(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">整理登记单号：</label>
                        <div class="input-text">
                            <el-input v-model="info.recordNum" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">整理登记日期：</label>
                        <div class="input-text">
                            <el-input v-model="info.actualDate" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">器具整理总数量：</label>
                        <div class="input-text">
                            <el-input v-model="info.dealNum" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注信息：</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" disabled></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openConfirm(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOutDeviceRecordConfirm()" >确认</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList" zIndex="10000"></fileViewer>
    </div>
</template>

<script>
import outDeviceClearUpRecordManage from './outDeviceClearUpRecordManage.js'

export default outDeviceClearUpRecordManage
</script>
<style lang="scss">
</style>
