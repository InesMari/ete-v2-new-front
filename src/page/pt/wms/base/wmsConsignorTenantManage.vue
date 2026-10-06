<template>
    <div id="wmsConsignorTenantManage">
      <select-work v-show="showSelWork"></select-work>
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsConsignorTenantManageSearch" v-show="!showSelWork"></searchList>

        <!-- 列表相关  开始 -->
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>货主关联列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="新增或修改客户仓储合同时自动添加新的货主" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain @click="showConsignor(true, 1)" size="mini" v-entity="1005057">新增</el-button>-->
                    <el-button type="primary" plain @click="showConsignor(true, 2)" size="mini" v-entity="1005058">修改</el-button>
                    <el-button type="danger" plain @click="deleteConsignor()" size="mini" v-entity="1005059">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsConsignorTenantManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 货主 开始-->
        <el-dialog class="consignorDialog" :title="title" :visible.sync="consignorShow" width="40%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showConsignor(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>货主名称</label>
                        <div class="input-text">
                            <el-input v-model="consignor.name" maxlength="20" placeholder="货主名称"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">关联客户</label>
                        <div class="input-text">
                            <el-select v-model="consignor.tenantId" filterable clearable disabled placeholder="请选择关联客户">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">货主编码</label>
                        <div class="input-text">
                            <el-input v-model="consignor.code" maxlength="20" placeholder="货主编码"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="consignor.linkman" maxlength="20" placeholder="联系人"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系方式</label>
                        <div class="input-text">
                            <el-input v-model="consignor.linkPhone" maxlength="20" placeholder="联系方式"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                      <label class="label-term">对账日
                        <el-tooltip effect="light" placement="top-start">
                          <div slot="content">如对账日填24：代表仓储收入的计费周期从上月25日，到本月的24日为一个周期；留空代表计费周期为自然月。</div>
                          <i class="el-icon-question pointer" style="color: red;"></i>
                        </el-tooltip>
                      </label>
                      <div class="input-text">
                        <el-input v-model="consignor.reconciliationDate" maxlength="2" v-mynumval placeholder="对账日(1~31)，为空即按照自然月"
                                  :disabled="isOnlySee"></el-input>
                      </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">地址</label>
                        <div class="input-text">
                            <el-input v-model="consignor.address" maxlength="20" placeholder="地址"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showConsignor(false)">关闭</el-button>
                    <el-button type="primary" v-show="showAddButton" size="mini" @click="saveOrUpdateConsignor(1)">新增</el-button>
                    <el-button type="primary" v-show="showUpdateButton" size="mini" @click="saveOrUpdateConsignor(2)">修改</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 货主 结束-->

    </div>
</template>

<script>
import wmsConsignorTenantManage from './wmsConsignorTenantManage.js'
export default wmsConsignorTenantManage
</script>
<style lang="scss">
#wmsConsignorTenantManage {
    .consignorDialog .common-info .content .item{
        width: 97%;
    }
}
</style>
