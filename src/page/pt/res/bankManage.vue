<template>
    <div id="bankManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">供应商名称：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.supplierName" placeholder="供应商名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">开户名字 ：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.bankName" placeholder="开户名字" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">开户卡号：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.bankCard" placeholder="开户卡号" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">银行卡类型：</label>
                    <div class="input-text">
                        <el-select v-model="loadParam.bankType" placeholder="" clearable>
                            <el-option v-for="item in bankTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                    </el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>银行卡列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="银行卡列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add(true,1)" v-entity="1002014">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="add(true,2)" v-entity="1002015">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="delBank" v-entity="1002016">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>

                </div>
            </div>
            <tableCommon tableName="bankManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true"></tableCommon>
        </div>


        <!-- 新增 begin -->
        <el-dialog :title="title" :visible.sync="showModify" width="660px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="add(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100" v-show="!isSelfBank">
                        <label class="label-term"><em>*</em>供应商</label>
                        <div class="input-text">
                            <el-select v-model="bankInfo.tenantId" placeholder="请选择供应商" filterable clearable
                                       @change="changSupplier" :disabled="isLock" @click="initSupplierData">
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100" v-show="isSelfBank">
                        <label class="label-term"><em>*</em>员工姓名</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.userName" placeholder="请输入"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>银行卡号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankCard" maxlength="30" v-mynumval placeholder="请输入银行卡号"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开户行</label>
                        <div class="input-text">
                            <el-select v-model="bankInfo.bankDeposit" placeholder="请选择开户行" filterable clearable
                                       :disabled="isLock">
                                <el-option v-for="item in bankDepositData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term" v-if="showBankPayCard"><em>*</em>开户手机号</label>
                        <label class="label-term" v-if="!showBankPayCard">开户手机号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankPhone" maxlength="11" placeholder="开户手机号"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>支行名称</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankSubName" maxlength="64" placeholder="请输入支行名称"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>银行卡类型</label>
                        <div class="input-text">
                            <el-radio v-model="bankInfo.bankType" label="1" :disabled="isLock" @change="clickRadio">
                                对公账号
                            </el-radio>
                            <el-radio v-model="bankInfo.bankType" label="2" :disabled="isLock" @change="clickRadio">
                                个人账号
                            </el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开户名字</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankAccountName" maxlength="50" placeholder="请输入开户名字"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-if="!showBankPayCard">
                        <label class="label-term"><em>*</em>纳税人识别号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.taxpayerNum" maxlength="100" placeholder="请输入纳税人识别号"
                                      :disabled="true" @input="forceUpdate"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-if="showBankPayCard">
                        <label class="label-term"><em>*</em>身份证号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.userPayeeCard" maxlength="50" placeholder="请输入身份证号"
                                      :disabled="isLock" @input="forceUpdate"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>合同或协议</label>
                        <div class="input-text">
                            <myFileModel :ref="'file' + index"  v-for="(item, index) in fileArray"
                                         :disabled-del="isLock"
                                         :disabled-edit="isLock"
                                         @successCallback="successCallback"
                                         @delCallback="delCallback"
                                         :componentId=index
                                         class="fl mr_10">
                            </myFileModel>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="add(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveorupdateBank()" v-if="!isLock">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增 end -->
    </div>
</template>

<script>
import bankManage from './bankManage.js'

export default bankManage
</script>
<style lang="scss">

</style>

