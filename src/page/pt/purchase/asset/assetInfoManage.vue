<template>
    <div id="assetInfoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="assetInfoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>资产信息列表</span>
                    <el-tooltip effect="light" content="资产信息列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014053" @click="addAssetInfo">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014054" @click="updateAssetInfo">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014055" @click="deleteAssetInfo">删除</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014056" @click="copyAddAssetInfo">复制新增</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014057" @click="verifyAssetInfo">审核</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014058" @click="importExcel">初始导入</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014067" @click="allocate(true)">调拨</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014068" @click="consuming(true)">领用</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014075" @click="returnAssetInfoShow(true)">归还</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014059" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="assetInfoManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickAssetInfo">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toContract(item)" v-if="code=='contractNum'">{{item[code]}}</a>
                    <a href="javascript:void(0);" class="link" @click.stop="toPurOrder(item)" v-if="code=='purchaseNum'">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>


        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="handleSuccess" template="/download/asset.xlsx" title="资产信息导入"
                   bean="assetTF" method="impAddAssetInfo"></my-import>

      <!-- 调拨 begin-->
      <el-dialog title="调拨" :visible.sync="allocateDialogShow" width="800px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div class="common-info flex" style="border:none;padding:0;">
          <div style="margin-bottom:20px;font-weight:bold;padding-left:20px;"><em>注：调拨之后会更新资产库存</em></div>
          <ul class="content text clearfix">
            <li class="item item50">
              <label class="label-term">资产种类：</label>
              <div class="input-text">{{ allocateInfo.assetTypeName }}-{{ allocateInfo.assetClassName }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">资产名称：</label>
              <div class="input-text">{{ allocateInfo.assetName }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">规格型号：</label>
              <div class="input-text">{{ allocateInfo.model }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">所在地：</label>
              <div class="input-text">{{ allocateInfo.locationWorkName }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">库存数量：</label>
              <div class="input-text">{{ allocateInfo.stockNum }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">结算主体：</label>
              <div class="input-text">{{ allocateInfo.settleBodyName }}</div>
            </li>
          </ul>
          <h3 class="common-title mt_20"><span class="title-name">调入地</span></h3>
          <ul class="content clearfix mt_20">
            <li class="item item50">
              <label class="label-term">费用申请单号</label>
              <div class="input-text">
                <el-select v-model="allocateInfo.applyDtlId" placeholder="费用申请单单号"
                           @change="changeApply" filterable clearable>
                  <el-option v-for="item in feeApplyData" :key="item.applyDtlId" :label="item.applyNum"
                             :value="item.applyDtlId"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>调拨数量</label>
              <div class="input-text">
                <el-input v-model="allocateInfo.allocateNum" @input="forceUpdate" v-mydoubleval></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">使用客户</label>
              <div class="input-text">
                <el-select v-model="allocateInfo.custTenantId" placeholder="使用客户" filterable clearable>
                  <el-option v-for="item in customerData" :key="item.tenantId" :label="item.tenantName"
                             :value="item.tenantId"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>库存地</label>
              <div class="input-text">
                <el-select v-model="allocateInfo.allocateWorkId"
                           @change="changeAllocateWorkId" filterable clearable placeholder="请选择库存地">
                  <el-option v-for="item in locationData" :key="item.workId" :label="item.workName"
                             :value="item.workId"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>开始计费日期</label>
              <div class="input-text">
                <el-date-picker v-model="allocateInfo.chargeDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>调入部门</label>
              <div class="input-text">
                <el-select v-model="allocateInfo.orgId" placeholder="调入部门" filterable clearable>
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>结算主体</label>
              <div class="input-text">
                <el-select v-model="allocateInfo.settleBody" placeholder="请选择"
                           filterable clearable >
                  <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="allocateInfo.remark"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="openAllocateDialogShow(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="savePurAllocate()">确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 调拨 end-->

      <!-- 领用 begin-->
      <el-dialog title="领用" :visible.sync="consumingDialogShow" width="600px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">资产种类：</label>
              <div class="input-text">{{ consumingInfo.assetTypeName }}-{{ consumingInfo.assetClassName }}</div>
            </li>
            <li class="item item100">
              <label class="label-term">资产名称：</label>
              <div class="input-text">{{ consumingInfo.assetName }}</div>
            </li>
            <li class="item item100">
              <label class="label-term">规格型号：</label>
              <div class="input-text">{{ consumingInfo.model }}</div>
            </li>
            <li class="item item100">
              <label class="label-term">所在地：</label>
              <div class="input-text">{{ consumingInfo.locationWorkName }}</div>
            </li>
            <li class="item item100">
              <label class="label-term">库存数量：</label>
              <div class="input-text">{{ consumingInfo.stockNum }}</div>
            </li>
            <li class="item item100">
              <label class="label-term">领用数量：</label>
              <div class="input-text">
                <el-input v-model="consumingInfo.num" @input="forceUpdate" maxlength="30" v-mydoubleval ></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term" style="height:40px;"><em>*</em>领用部门：</label>
              <div class="input-text">
                <el-select v-model="consumingInfo.orgId" placeholder="领用部门" @change="changeOrg" filterable clearable>
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term" style="height:40px;"><em>*</em>领用人员：</label>
              <div class="input-text">
                <el-select v-model="consumingInfo.userId" placeholder="领用人员" @change="forceUpdate" filterable clearable allow-create="true">
                  <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName"
                             :value="item.userId" :disabled="item.disabled"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">领用备注：</label>
              <div class="input-text">
                <el-input v-model="consumingInfo.useRemark"  @input="forceUpdate" maxlength="200" show-word-limit></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="openConsumingDialogShow(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="saveConsuming()">确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 领用 end-->

      <!-- 归还-开始 -->
      <el-dialog title="归还提示" :visible.sync="showReturnAssetInfoDlg" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:20px;">
          <ul class="content clearfix">
            <li class="item " style="width: 100%;">
              <label class="label-term" style="width: 98px;"><em>*</em>归还时间</label>
              <div class="input-text" style="width: calc(100% - 108px);">
                <el-date-picker v-model="returnInfo.borrowEndDate" type="date" class="tl" placeholder="请选择归还时间" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" ></el-date-picker>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="returnAssetInfoShow(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="returnAssetInfo">归还确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 归还-结束 -->
    </div>
</template>

<script>
import assetInfoManage from './assetInfoManage.js'
export default assetInfoManage
</script>
<style lang="scss" scoped>
#assetInfoManage{
    /deep/.search-list .search-form .item:nth-child(4n-3){
        .label{
            width: 124px;
        }
    } 
}
</style>

