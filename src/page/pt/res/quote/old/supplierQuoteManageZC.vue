<template>
    <div id="quoteManageZC">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-select v-model="query.tenantId" @change="doQuery" clearable filterable placeholder="选择供应商">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">起始地：</label>
                    <div class="input-text">
                        <el-input v-model="query.beginIndexSearchStr" placeholder="请输入起始地" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">目的地：</label>
                    <div class="input-text">
                        <el-input v-model="query.endIndexSearchStr" placeholder="请输入目的地" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">报价车型：</label>
                    <div class="input-text">
                        <el-select v-model="query.quoteVehicleType" @change="doQuery" clearable placeholder="选择车型" filterable>
                            <el-option v-for="item in quoteVehicleTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">车长：</label>
                    <div class="input-text">
                        <el-select v-model="query.vehicleLength" @change="doQuery" clearable placeholder="选择车长" filterable>
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">是否启用：</label>
                    <div class="input-text">
                        <el-select v-model="query.sts" @change="doQuery" clearable placeholder="是否启用">
                            <el-option v-for="item in stsData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
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
                    <span>整车报价列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="整车报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toAddQuotePage()" v-entity="374">新增报价</el-button>
                    <el-button type="primary" plain size="mini" @click="isShow(2)" v-entity="375">查看报价</el-button>
                    <el-button type="primary" plain size="mini" @click="isShow(3)" v-entity="376">修改报价</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteZCQuote()" v-entity="377">删除报价</el-button>
                    <el-button type="primary" plain size="mini" @click="changeZCQuoteSts(1)" v-entity="378">启用报价</el-button>
                    <el-button type="primary" plain size="mini" @click="changeZCQuoteSts(0)" v-entity="379">禁用报价</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierZCQuoteManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

        <!--        弹窗        -->
        <el-dialog :title="title" :visible.sync="isShowPage" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="70%">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <ul class="content clearfix">
                            <li class="item width48">
                                <label class="label-term"><em>*</em>起始地</label>
                                <div class="input-text">
                                    <el-input v-model="form.beginIndexSearchStr" disabled></el-input>
                                </div>
                            </li>
                            <li class="item width48">
                                <label class="label-term"><em>*</em>目的地</label>
                                <div class="input-text">
                                    <el-input v-model="form.endIndexSearchStr" disabled></el-input>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="item item100">
                        <ul class="content clearfix">
                            <li class="item width48">
                                <label class="label-term"><em>*</em>供应商</label>
                                <div class="input-text">
                                    <el-select v-model="form.tenantId" filterable disabled placeholder="请选择">
                                        <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                                   :value="item.tenantId"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="item width48">
                                <label class="label-term"><em>*</em>指定客户</label>
                                <div class="input-text">
                                    <el-select v-model="form.specifyTenantId" filterable disabled placeholder="请选择">
                                        <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                                   :value="item.tenantId"></el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="item item100">
                        <ul class="content clearfix">
                            <li class="item width48">
                                <label class="label-term">运输时效</label>
                                <div class="input-text">
                                    <el-input v-model="form.transportTimeliness" v-mynumval :disabled="canEditFee" ></el-input>
                                </div>
                            </li>
                            <li class="item width48">
                                <label class="label-term"><em>*</em>计费方式</label>
                                <div class="input-text">
                                    <el-select v-model="form.billingType" filterable :disabled="canEditFee" placeholder="请选择">
                                        <el-option
                                                v-for="item in billingTypeData"
                                                :key="item.codeValue"
                                                :label="item.codeName"
                                                :value="item.codeValue">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="item item100">
                        <ul class="content clearfix">
                            <li class="item width48">
                                <label class="label-term"><em>*</em>报价车型</label>
                                <div class="input-text">
                                    <el-select v-model="form.quoteVehicleType" filterable :disabled="canEditFee" placeholder="请选择">
                                        <el-option
                                                v-for="item in quoteVehicleTypeData"
                                                :key="item.codeValue"
                                                :label="item.codeName"
                                                :value="item.codeValue">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="item width48">
                                <label class="label-term"><em>*</em>车长</label>
                                <div class="input-text">
                                    <el-select v-model="form.vehicleLength" filterable :disabled="canEditFee" placeholder="请选择">
                                        <el-option
                                                v-for="item in vehicleLengthData"
                                                :key="item.codeValue"
                                                :label="item.codeName"
                                                :value="item.codeValue">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="item item100">
                        <ul class="content clearfix">
                            <li class="item width48">
                                <label class="label-term"><em>*</em>价格</label>
                                <div class="input-text">
                                    <el-input v-model="form.feePrice" v-mydouble4val maxlength="19" show-word-limit
                                              :disabled="canEditFee"></el-input>
                                </div>
                            </li>
                            <li class="item width48">
                                <label class="label-term">点位费单价</label>
                                <div class="input-text">
                                    <el-input v-model="form.pointFee" v-mydouble4val maxlength="19" show-word-limit
                                              :disabled="canEditFee"></el-input>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="page-bot-btn" style="text-align: center;">
                    <el-button size="mini" @click="isShow(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="submit()" v-show="showSubmit">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import supplierQuoteManageZC from './supplierQuoteManageZC.js'

	export default supplierQuoteManageZC
</script>
<style lang="scss">
  .width48{
    width: 48% !important;
  }
</style>
