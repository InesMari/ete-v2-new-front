<template>
    <div id="vehicleWaybillCostManage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query"
                    searchKey="vehicleWaybillCostManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车辆变动成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆变动成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002137">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002138">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteVehicleWaybillCost()" v-entity="1002139">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(3, null)" v-entity="1002140">审核</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002164">批量导入</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002228" @click="generatePayApplyCheck(enumData.PAY_TYPE.REQ)">生成请款单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002229" @click="generatePayApplyCheck(enumData.PAY_TYPE.PAY)">生成付款单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002245" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleWaybillCostManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="false">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.reqNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='reqNums'">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.payNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='payNums'">{{index>0?','+data:data}}</a>
                </template>
            </tableCommon>
        </div>

      <my-import :open.sync="uploadOpen" :handle-success="doQuery"
                 template="/download/vehicleWaybillCost.xlsx" title="车辆变动成本导入" bean="vehicleWaybillCostService"
                 method="impAddVehicleWaybillCost"></my-import>
    </div>
</template>

<script>
import vehicleWaybillCostManage from './vehicleWaybillCostManage.js'

export default vehicleWaybillCostManage
</script>

<style scoped>

</style>
