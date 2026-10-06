<template>
    <div id="purchaseInOrderManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="purchaseInOrderManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>入库管理列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="入库管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1014042" @click="inOrderConfirm">入库确认</el-button>
                </div>
            </div>
            <tableCommon tableName="purchaseInOrderManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickItem">
                <template v-slot="{item,code}">
                    <div v-if="'url'==code&&item[code]!=null&&item[code]!=''">
                        <a href="javascript:void(0);" class="link" @click.stop="showBigImg(item)">查看</a>
                    </div>
                    <div v-if="'purchaseNum'==code">
                        <a href="javascript:void(0);" class="link" @click.stop="toPurOrder(item)">{{item[code]}}</a>
                    </div>
                </template>
            </tableCommon>
        </div>



        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
import purchaseInOrderManage from './purchaseInOrderManage.js'
export default purchaseInOrderManage
</script>
<style lang="scss">
</style>

