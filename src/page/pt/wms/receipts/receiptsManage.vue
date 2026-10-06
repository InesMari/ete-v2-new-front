<template>
    <div id="wmsReceiptsManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsReceiptsManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>短驳配送单据列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="短驳配送单据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="openAddWmsReceipts" size="mini" v-entity="1005128">上传单据</el-button>
                    <el-button type="primary" plain @click="openSureWmsReceipts" size="mini" v-entity="1005129">单据确认</el-button>
                    <el-button type="primary" plain @click="cancelSureWmsReceipts" size="mini" v-entity="1005130">取消确认</el-button>
                    <el-button type="danger" plain @click="deleteWmsReceipts" size="mini" v-entity="1005131">删除单据</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsReceiptManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 单据 开始-->
        <el-dialog class="wmsReceiptsDialog" :title="title" :visible.sync="showReceipts"
                   width="500px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>短驳配送单号</label>
                        <div class="input-text">
                            <el-select  v-model="receipts.waybillId" placeholder="请选择短驳配送单号"
                                        filterable clearable @change="changeWmsWaybill(receipts.waybillId)" :disabled="isOnlySee">
                                <el-option v-for="item in waybillData" :key="item.waybillId"
                                           :label="item.waybillNum" :value="item.waybillId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
					<li class="item item100">
						<label class="label-term"><em>*</em>到货厂商</label>
						<div class="input-text">
							<el-select  v-model="receipts.fromTenantId" placeholder="请选择到货厂商"
										filterable clearable :disabled="isOnlySee">
								<el-option v-for="item in fromTenantData" :key="item.fromTenantId"
										   :label="item.fromTenantName" :value="item.fromTenantId">
								</el-option>
							</el-select>
						</div>
					</li>
                  <li class="item item100">
                    <label class="label-term"><em>*</em>单据类型</label>
                    <div class="input-text">
                      <el-radio-group v-model="receipts.receiptsType" >
                        <el-radio :label="item.codeValue" v-for="item in receiptsTypeData"  :disabled="isOnlySee">{{ item.codeName }}</el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据数量</label>
                        <div class="input-text">
                            <el-input v-model="receipts.nums" v-mynumval></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">单据图片</label>
                      <div class="input-text uploadFile clearfix">
                        <div class="fl mr_20 mb_20" v-for="(item,index) in list" >
                          <myFileModel :ref="'file' + index" v-if="showReceipts" @successCallback="fileCallback" @delCallback="delCallback" :disabled-del="isOnlySee" :disabled-edit="isOnlySee" :componentId="index"></myFileModel>
                          <p>只支持.jpg .png .pdf格式</p>
                        </div>
                      </div>
<!--                        <div class="input-text">-->
<!--                            <myFileModel ref="receiptsImg" :disabledEdit="canEditImg"-->
<!--                                         @successCallback="successCallback" ></myFileModel>-->
<!--                        </div>-->
                    </li>
                </ul>
                <div class="page-bot-btn">
                    <el-button size="mini" @click="changeWmsReceiptsShow(false)">关闭</el-button>
                    <el-button type="primary" v-show="isShowSureButton" size="mini" @click="sureWmsReceipts()">确认</el-button>
                    <el-button type="primary" v-show="isShowSubmitButton" size="mini" @click="saveOrUpdateWmsReceipts()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 单据 结束-->

        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import receiptsManage from './receiptsManage.js'
	export default receiptsManage
</script>
<style lang="scss">
.mr_20{
  margin-right: 20px;
}
#wmsReceiptsManage{

}
</style>
