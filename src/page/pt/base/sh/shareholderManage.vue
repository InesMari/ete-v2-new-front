<template>
    <div id="shareholderManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="shareholderManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>股东列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="股东列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                  <el-button type="primary" plain size="mini" @click="addShareholderInfo" v-entity="1008039">新增股东</el-button>
                  <el-button type="primary" plain size="mini" @click="updateShareholderInfo" v-entity="1008040">修改股东</el-button>
                  <el-button type="primary" plain size="mini" @click="delShareholderInfo" v-entity="1008041">删除股东</el-button>
                  <el-button type="primary" plain size="mini" @click="loadEntityTree" v-entity="1008042">权限配置</el-button>
                  <el-button type="primary" plain size="mini" @click="updateShareholderState(1)" v-entity="1008043">启用</el-button>
                  <el-button type="primary" plain size="mini" @click="updateShareholderState(0)" v-entity="1008044">禁用</el-button>
                </div>
            </div>
            <tableCommon tableName="shareholderManageTable" ref="table" :showNum="true" :showSetTable="false"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>
        <!-- 权限配置 -->
        <div class="popup" :class="{'show':showEntityPage}">
            <div class="popup_bj" @click="isShowEntityPage(false)"></div>
            <div class="popup_content" style="width:40%">
                <authRoleTree ref="authRoleTree" :showRole="false"></authRoleTree>
            </div>
        </div>
    </div>
</template>

<script>
import shareholderManage from './shareholderManage.js'

export default shareholderManage
</script>

<style scoped>

</style>
