<template>
    <div id="oilManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="oilManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车型油耗列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车型油耗列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true, 1)" v-entity="1006262">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openDialog(true, 2)" v-entity="1006263">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteOil" v-entity="1006264">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006265">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="oilManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

        <!-- begin -->
        <el-dialog :title="title + '车型油耗'" :visible.sync="showDialog" width="500px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>车长</label>
                        <div class="input-text">
                            <el-select v-model="info.vehicleLength" filterable clearable :disabled="isVisible">
                                <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>能源类型</label>
                        <div class="input-text">
                            <el-select v-model="info.energyType" filterable clearable :disabled="isVisible">
                                <el-option v-for="item in energyTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>每公里油耗(元)</label>
                        <div class="input-text">
                            <el-input v-model="info.amount"
                                      maxlength="10" v-mydoubleval placeholder="请输入金额"
                                      :disabled="isVisible"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="savePersonCost()" v-show="!isOnlySee">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- end -->

    </div>
</template>

<script>
import oilManage from './oilManage.js'

export default oilManage
</script>

<style scoped>

</style>
