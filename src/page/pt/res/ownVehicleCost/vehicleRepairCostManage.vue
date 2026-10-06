<template>
    <div id="vehicleRepairCostManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="vehicleRepairCostManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车辆修理成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆修理成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002141">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002142">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteVehicleRepairCost()" v-entity="1002143">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(3, null)" v-entity="1002144">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002230" @click="generatePayApplyCheck(enumData.PAY_TYPE.REQ)">生成请款单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002231" @click="generatePayApplyCheck(enumData.PAY_TYPE.PAY)">生成付款单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002246" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleRepairCostManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="false">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.reqNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='reqNums'">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.payNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='payNums'">{{index>0?','+data:data}}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import vehicleRepairCostManage from './vehicleRepairCostManage.js'

export default vehicleRepairCostManage
</script>

<style scoped>

</style>
