<template>
    <div id="fcPayManage" class="fcPayManagePage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="clear" :query="query"
                    searchKey="fcPayManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>付款单列表</span>
                    <el-tooltip effect="light" content="付款单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1006122" @click="verifyPayOrder">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006123" @click="addPayOrder">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006124" @click="updatePayOrder">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006126" @click="printPayOrder">打印</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006125" @click="delPayOrder">删除</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006156" @click="cancelPayOrder">取消审核</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006172" @click="oneKeyCancelFcPayInfo">一键取消审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006175" @click="payRegistNew">付款登记</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006179" @click="cancelPayRegist">取消付款登记</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006176" @click="copyAddPayOrder">复制新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006171" @click="downloadExcel()">导出</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006182" @click="receiveReceipt()">收单操作</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006183" @click="showRegisterDetail(true)">付款明细</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006186" @click="invalidFcPayInfo()">作废</el-button>
                </div>
            </div>
            <tableCommon tableName="fcPayManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         :singleSelect="false" @dblclickItem="viewPayOrder">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"
                       v-for="(data,index) in item.applyNumArray"
                       @click.stop="toDetail(item,code,index)"
                       v-if="code=='applyNums'">{{ index > 0 ? ',' + data : data }}</a>
                    <a href="javascript:void(0);" class="link" v-for="(data,index) in item.reqNumArray"
                       @click.stop="toDetail(item, code, index)"
                       v-if="code=='reqNums'">{{ index > 0 ? ',' + data : data }}</a>
                    <a href="javascript:void(0);" class="link" v-for="(data,index) in item.billNum"
                       @click.stop="goto(data)"
                       v-if="code=='billNums'">{{ index > 0 ? ',' + data.billNum : data.billNum }}</a>

                  <span v-if="code=='noPayFee'" style="color:red!important">{{ item.noPayFee }}</span>
                </template>
<!--                <template v-slot:diyColorTd="{item}">-->
<!--                    <span :style="item.state==10?'color:red!important':''">{{ item.stateName }}</span>-->
<!--                </template>-->
            </tableCommon>
        </div>


        <!-- 付款登记 begin-->
        <el-dialog title="付款登记" :visible.sync="registerShow" width="1000px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="showRegister(false)">
            <div class="fcCommonPage">
                <div class="common-info" style="border:none;padding:0;">
                    <h3 class="common-title"><span class="title-name">基本信息</span></h3>
                    <ul class="content clearfix;" style="height: 150px;">
                        <li class="item item100">
                            <label class="label-term">收款方全称：</label>
                            <div class="input-text">
                                {{info.bankAccountName}}
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">付款单：</label>
                            <div class="input-text">
                                {{info.payNum}}
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">请款金额：</label>
                            <div class="input-text">
                                {{info.payFee}}
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">已付金额：</label>
                            <div class="input-text">
                                {{info.hasPayFee}}
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">未付金额：</label>
                            <div class="input-text">
                                {{info.noPayFee}}
                            </div>
                        </li>
                    </ul>
                    <h3 class="common-title"><span class="title-name">付款信息</span></h3>
                    <ul class="content clearfix">
                        <li class="item item50">
                            <label class="label-term"><em>*</em>本次付款金额：</label>
                            <div class="input-text">
                                <el-input v-model="info.fee" :disabled="disabledFee" v-mydouble4val placeholder=""
                                          @input="$forceUpdate();"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term"><em>*</em>实际付款日期：</label>
                            <div class="input-text">
                                <el-date-picker v-model="info.actualPayDate" type="date" placeholder="实际付款日期"
                                                value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">付款备注：</label>
                            <div class="input-text">
                                <el-input v-model="info.remark" type="textarea" maxlength="200" placeholder=""
                                          @input="$forceUpdate();"></el-input>
                            </div>
                        </li>
                    </ul>
                    <div class="page-bot-btn ">
                        <el-button size="mini" @click="showRegister(false)">关闭</el-button>
                        <el-button type="primary" size="mini" @click="sureRegister()">确定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 付款登记 end-->

        <!-- 付款明细 begin -->
        <el-dialog class="upInvoiceDetail" title="付款明细记录" :visible.sync="registerDetailShow" width="1000px"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showRegisterDetail(false)">
            <div class="table-content">
                <h3 style="margin-bottom: 10px;margin-top: -30px;">
                    <span>
                        请款单号: <span style="color: red;font-size: 18px;">{{info.payNum}}</span>
                        收款方全称: <span style="color: red;font-size: 18px;">{{info.bankAccountName}}</span>
                        请款金额: <span style="color: red;font-size: 18px;">{{info.payFee}}</span>
                    </span>
                </h3>
                <tableCommon tableName="payReqPayDetailTable" v-if="showRegisterDetail" ref="detailTable" :showNum="true"
                             :showSetTable="false" :singleSelect="true" :head="detailHead">
                    <template v-slot:default="{item,index}">
                        <el-button type="primary" size="mini" @click="revokePay(item)">撤销付款</el-button>
                    </template>
                </tableCommon>
            </div>
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button  @click="showRegisterDetail(false)">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 付款明细 end -->

    </div>
</template>

<script>
import fcPayManage from './fcPayManage.js'

export default fcPayManage
</script>
<style lang="scss">
</style>
