<template>
    <div id="custAppointManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="custAppointManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>客户预约列表</span>
                    <el-tooltip effect="light" content="客户预约列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005164" @click="download">导出Excel
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="custAppointManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
                <template v-slot:default="{item}">
                    <el-button type="primary" size="mini" :style="item.state==2?'background:#aaa;':''"
                               :disabled="item.state!=1" @click.stop="updateWmsAppointInfoState(item,1)">已到达
                    </el-button>
                    <el-button type="primary" size="mini" :style="item.state==3?'background:#aaa;':''"
                               :disabled="item.state!=1" @click.stop="updateWmsAppointInfoState(item,2)">未到达
                    </el-button>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import custAppointManage from './custAppointManage.js'
export default custAppointManage
</script>
<style lang="scss">
</style>

