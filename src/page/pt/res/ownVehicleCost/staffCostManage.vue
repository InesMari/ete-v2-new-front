<template>
    <div id="staffCostManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">人员类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.personnelType" placeholder="人员类型" @change="doQuery" clearable filterable>
                            <el-option v-for="item in personnelTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">所属公司：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="所属公司" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">姓名：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="姓名" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">结算月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.billMonth" type="month" placeholder="结算月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">审核状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.verifyState" placeholder="审核状态" @change="doQuery" clearable filterable>
                            <el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
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
                    <span>人员成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="人员成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain size="mini" @click="openDialog(1, null)" v-entity="1002145">新增</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="openDialog(2, null)" v-entity="1002146">修改</el-button>-->
<!--                    <el-button type="danger" plain size="mini" @click="deletePersonnelCost()" v-entity="1002147">删除</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="openDialog(3, null)" v-entity="1002148">审核</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002163">批量导入</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>-->
                  <el-button type="primary" plain size="mini" v-entity="1002247" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleRepairCostManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="showVehicleFeeDetailDialog(item)" style="margin: 0 10px;">车辆费用明细</a>
                </template>
            </tableCommon>
        </div>

<!--        新增 修改 详情-->
        <el-dialog :title="title" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(null, null)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>结算月份</label>
                        <div class="input-text">
                            <el-date-picker v-model="info.billMonth" type="month" :disabled="isOnlySee" placeholder="结算月份" value-format="yyyy-MM"></el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>人员类型</label>
                        <div class="input-text">
                            <el-radio :disabled="isOnlySee" v-model="info.personnelType" @change="loadDriverOrSupercargoList"
                                      v-for="item in personnelTypeData" :key="item.codeValue" :label="item.codeValue">
                                {{ item.codeName }}
                            </el-radio>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>姓名</label>
                        <div class="input-text">
                            <el-select v-model="info.personnelId" @click.stop="tip" @change="changePersonnel" :disabled="isOnlySee" filterable clearable placeholder="请选择" >
                                <el-option
                                        v-for="item in personnelData"
                                        :key="item.key"
                                        :label="item.name + '-' + item.billId"
                                        :value="item.id">
                                </el-option>

                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">所属公司</label>
                        <div class="input-text">
                            <el-select v-model="info.tenantId" disabled placeholder="请选择先姓名">
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>基本工资</label>
                        <div class="input-text">
                            <el-input v-model="info.basicSalary" v-mydoubleval placeholder=""
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>提成</label>
                        <div class="input-text">
                            <el-input v-model="info.percentage" v-mydoubleval placeholder=""
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>社保</label>
                        <div class="input-text">
                            <el-input v-model="info.socialSecurityTax" v-mydoubleval placeholder=""
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">福利</label>
                        <div class="input-text">
                            <el-input v-model="info.welfare" v-mydoubleval placeholder=""
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">扣罚</label>
                        <div class="input-text">
                            <el-input v-model="info.fine" v-mydoubleval placeholder=""
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-show="type == 0 || type == 3">
                        <label class="label-term">审核备注</label>
                        <div class="input-text">
                            <el-input v-model="verifyRemark" placeholder=""
                                      :disabled="type != 3"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(null, null)">关闭</el-button>
                    <el-button type="primary" size="mini" v-show="type == 1 || type == 2" @click="saveOrUpdateStaffCost()">保存</el-button>
                    <el-button type="danger" size="mini" v-show="type == 3" @click="verifyStaffCost(2)">审核不通过</el-button>
                    <el-button type="primary" size="mini" v-show="type == 3" @click="verifyStaffCost(1)">审核通过</el-button>
                </div>
            </div>
        </el-dialog>
<!--        新增 修改 详情-->

        <!--   列表  开始-->
        <el-dialog title="车辆费用明细" :visible.sync="vehicleFeeDetailDialogShow" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <h3 style="margin-bottom: 10px;margin-top: -20px;">
                <span style="color: red;font-size: 18px;">姓名: {{show.name}} 结算月份: {{show.billMonth}}</span>
            </h3>

            <tableCommon tableName="vehicleRepairCostManageTable-list" v-if="vehicleFeeDetailDialogShow" ref="table2" :showNum="true"
                         :showSetTable="false" :singleSelect="true" :head="vehicleFeeDetailHead">
            </tableCommon>
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button size="mini" @click="vehicleFeeDetailDialogShow = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--  列表  结束-->

      <my-import :open.sync="uploadOpen" :handle-success="doQuery" repeatCheckNums="0"
                 template="/download/fcPersonnelCost.xls" title="人员成本导入" bean="fcPersonnelCostTF"
                 method="impAddFcPersonnelCost"></my-import>
    </div>
</template>

<script>
import staffCostManage from './staffCostManage.js'

export default staffCostManage
</script>

<style scoped>

</style>
