<template>
    <div id="assetsAllocatManage" class="assetsAllocatManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="assetsAllocatManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>固定资产调拨单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="固定资产调拨单列表" placem ent="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1009015" @click="verifyAssetsAllocat">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009016" @click="addAssetsAllocat">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009017" @click="updateAssetsAllocat">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1009018" @click="deleteAssetsAllocat">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="assetsAllocatManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import assetsAllocatManage from './assetsAllocatManage.js'

export default assetsAllocatManage
</script>
<style lang="scss">
</style>
