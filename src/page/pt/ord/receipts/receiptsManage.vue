<template>
    <div id="receiptsManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="receiptsManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>单据列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="单据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="openAddReceipts" size="mini" v-entity="1003054">上传单据</el-button>
<!--                    <el-button type="primary" plain @click="seeReceipts()" size="mini" v-entity :entityId="[{1001104:1001106}]">查看单据</el-button>-->
                    <el-button type="primary" plain @click="receiptsSure" size="mini" v-entity="1003055">单据确认</el-button>
                    <el-button type="primary" plain @click="cancelSureReceipts" size="mini" v-entity="1003056">取消确认</el-button>
                    <el-button type="danger" plain @click="deleteReceipts" size="mini" v-entity="1003057">删除单据</el-button>
                    <el-button type="primary" plain @click="showOpLog" size="mini" v-entity="1003058">操作记录</el-button>
                </div>
            </div>
            <tableCommon tableName="receiptManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 操作记录 -->
        <commonOpLog ref="operate"></commonOpLog>

        <!-- 单据 开始-->
        <el-dialog class="receiptsDialog" :title="title" :visible.sync="showReceipts" width="680px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <img class="switch" src="@/static/image/switch.png" alt="" @click="doSwitch" v-show="title == '上传单据'">
                    <li class="item item100" :class="showSelect?'top':'bottom'">
                        <label class="label-term"><em>*</em>派车单号</label>
                        <div class="input-text">
                            <el-select v-if="showSelect" v-model="receipts.waybillId" placeholder="请输入派车单号搜索" filterable clearable remote :remote-method="remoteSearchWaybill"
                                       @change="changeWaybill" :disabled="isEditWaybill">
                                <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum" :value="item.waybillId"></el-option>
                            </el-select>
                            <el-select v-if="!showSelect" v-model="receipts.waybillId" placeholder="请选择派车单号" clearable @change="changeWaybill(receipts.waybillId, true)" :disabled="isOnlySee">
                                <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum" :value="item.waybillId"></el-option>
                            </el-select>

                        </div>
                    </li>
                    <li class="item item100" :class="!showSelect?'top':'bottom'">
                        <label class="label-term"><em>*</em>订单号</label>
                        <div class="input-text">
                            <el-select v-if="showSelect" v-model="receipts.orderId" placeholder="请选择订单号" clearable @change="changeWaybillOrder(receipts.orderId)" :disabled="isOnlySee">
                                <el-option v-for="item in orderData" :key="item.orderId" :label="item.orderNum" :value="item.orderId"></el-option>
                            </el-select>
                            <el-select v-if="!showSelect" v-model="receipts.orderId" placeholder="请输入订单号搜索" filterable clearable remote :remote-method="remoteSearchOrder"
                                       @change="changeWaybillOrder(receipts.orderId, true)" :disabled="isEditOrder">
                                <el-option v-for="item in orderData" :key="item.waybillId" :label="item.orderNum" :value="item.orderId"></el-option>
                            </el-select>

                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">客户</label>
                        <div class="input-text">
                            <el-input v-model="receipts.tenantName" maxlength="100" placeholder="客户" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>作业点</label>
                        <div class="input-text">
                            <el-select v-model="receipts.waybillWorkId" placeholder="作业点" @change="changeWaybillWork" filterable clearable :disabled="isOnlySee" >
                                <el-option v-for="item in waybillWorkData" :key="item.waybillWorkId"  :label="item.workName" :value="item.waybillWorkId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">详细地址</label>
                        <div class="input-text">
                            <el-input v-model="receipts.workAddressStr" maxlength="50" placeholder="详细地址" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据类型</label>
                        <div class="input-text">
                            <el-radio v-model="receipts.receiptsType" label="1" :disabled="isOnlySee">回单</el-radio>
                            <el-radio v-model="receipts.receiptsType" label="2" :disabled="isOnlySee">过磅单</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据图片</label>
                      <div class="input-text uploadFile clearfix" v-if="isShowSubmitButton">
                        <div class="fl mr_20 mb_20" v-for="(item,index) in list" >
                          <myFileModel :ref="'file' + index" v-if="showReceipts"  @successCallback="fileCallback" @delCallback="delCallback" :componentId="index"></myFileModel>
                          <p>只支持.jpg .png .pdf格式</p>
                        </div>
                      </div>
                      <div class="input-text" v-else>
                          <myFileModel v-if="showReceipts" ref="receiptsImg" :disabledEdit="isOnlySee" :disabledDel="canDeleteImg" @successCallback="setImgData" ></myFileModel>
                      </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
                    <el-button type="primary" v-show="isShowSureButton" size="mini" @click="sureReceipts()">确认</el-button>
                    <el-button type="primary" v-show="isShowSubmitButton" size="mini" @click="addReceipts()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 单据 结束-->

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
#receiptsManage{
    .receiptsDialog{
        .content{
            padding-top: 100px;
            position: relative;
            .switch{
                position: absolute;
                left: -15px;
                top: 30px;
                width: 30px;
                cursor: pointer;
            }
            .top,.bottom{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                transition: 0.5s all;
            }
            .bottom{
                top:50px;
            }
        }
    }
}
</style>
