<template>
    <div id="wmsWaybillManage">
        <select-work v-show="showSelWork"></select-work>

        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsWaybillManageSearch" v-show="!showSelWork"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>配送列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="配送列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="openAddTab" size="mini" v-entity="1005095">新增</el-button>
                    <el-button type="primary" plain @click="openUpdateTab" size="mini" v-entity="1005096">修改</el-button>
                    <el-button type="danger" plain @click="openDeleteTab" size="mini" v-entity="1005097">删除</el-button>
                    <el-button type="primary" plain @click="openConfirmTab" size="mini" v-entity="1005098">确认送达</el-button>
                    <el-button type="primary" plain @click="openReceiptsUploadTab" size="mini" v-entity="1005126">回单上传</el-button>
<!--                    <el-button type="primary" plain @click="openDetail()" size="mini" v-entity="1005099">查看</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1005151" @click="downloadExcel()">导出</el-button>
                    <el-button type="primary" plain @click="openPrint" size="mini" v-entity="1005152">打印</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsWaybillManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" v-if="code=='orderNum'" v-for="(data,index) in item.orderNums" @click.stop="toOrderDetail(item,index, data)">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" v-if="code=='receiptsStateName'"
                       :class=" item.receiptsSum > 0 ? 'link' : 'link disabled'" @click.stop="showBigImg(item)"
                       style="margin: 0 10px;">{{item.receiptsStateName}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 确认 开始-->
        <el-dialog class="receiptsDialog" title="确认提示" :visible.sync="show" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">短驳单号</label>
                        <div class="input-text">
                            <el-input v-model="waybill.waybillNum" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">配送拖数</label>
                        <div class="input-text">
                            <el-input v-model="waybill.palletNums" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">是否返程</label>
                        <div class="input-text">
                            <el-radio v-model="waybill.isReturn" label="1">是</el-radio>
                            <el-radio v-model="waybill.isReturn" label="0">否</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em v-show="waybill.isReturn == 1">*</em>返程数量</label>
                        <div class="input-text">
                            <el-input v-model="waybill.returnNums"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">确认备注</label>
                        <div class="input-text">
                            <el-input type="textarea" v-model="waybill.confirmRemark"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureWaybill()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 确认 结束-->

        <!-- 单据 开始-->
        <el-dialog title="上传单据" :visible.sync="showReceipts" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>短驳配送单号</label>
                        <div class="input-text">
                            <el-input v-model="receipts.waybillNum" :disabled="true"></el-input>
                        </div>
                    </li>
					<li class="item item100">
						<label class="label-term"><em>*</em>到货厂商</label>
						<div class="input-text">
							<el-select  v-model="receipts.fromTenantId" placeholder="请选择到货厂商"
										filterable clearable>
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
                        <el-radio :label="item.codeValue" v-for="item in receiptsTypeData" >{{ item.codeName }}</el-radio>
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
                        <label class="label-term">短驳回单</label>
                        <div class="input-text" >
                            <myFileModel style="float:left;margin-right: 20px;" v-if="showReceipts" v-for="(item, index) in receipts.receiptsList" :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback" :componentId="index"></myFileModel>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="addReceipts()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 单据 结束-->

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>


    </div>
</template>

<script>
	import wmsWaybillManage from './wmsWaybillManage.js'
	export default wmsWaybillManage
</script>
<style lang="scss">
#wmsWaybillManage{
    .disabled {
        color: #999 !important;
    }
}
</style>
