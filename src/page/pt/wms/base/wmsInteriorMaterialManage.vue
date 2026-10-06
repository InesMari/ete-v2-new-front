<template>
    <div id="wmsInteriorMaterialManage">
      <select-work v-show="showSelWork"></select-work>

        <!-- 列表相关  开始 -->
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">内材名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="内材名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="到货厂商" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
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

        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>内材库存列表</span>
                    <el-tooltip effect="light" content="内材库存列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="showInteriorMaterialRecord(true)" size="mini" v-entity="1005045">内材登记
                    </el-button>
                    <el-button type="primary" plain @click="go(0)" size="mini" v-entity="1005046">查看内材记录
                    </el-button>

                    <el-button type="primary" plain @click="go(1)" size="mini" v-entity="1005047">内材维护
                    </el-button>
                </div>
            </div>
            <tableCommon tableName="wmsInteriorMaterialManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 内材登记 开始-->
        <el-dialog class="interiorMaterialRecordDialog" title="内材登记" :visible.sync="interiorMaterialRecordShow" width="40%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showInteriorMaterialRecord(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>内材名称</label>
                        <div class="input-text">
                            <el-select v-model="interiorMaterialRecord.pId" filterable clearable placeholder="内材名称">
                                <el-option v-for="item in interiorMaterialData" :key="item.pId" :label="item.name"
                                           :value="item.pId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>到货厂商</label>
                        <div class="input-text">
                            <el-select v-model="interiorMaterialRecord.fromTenantId" filterable clearable placeholder="到货厂商">
                                <el-option v-for="item in tenantData" :key="item.wId" :label="item.name"
                                           :value="item.wId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>数量</label>
                        <div class="input-text">
                            <el-input v-model="interiorMaterialRecord.nums" maxlength="11" v-mydouble4val
                                      placeholder="数量"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>登记类型</label>
                        <div class="input-text">
                            <el-select v-model="interiorMaterialRecord.opType" filterable clearable placeholder="登记类型">
                                <el-option v-for="item in opTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>实际日期</label>
                        <div class="input-text">
                            <my-el-date-picker @input="forceUpdate" v-model="interiorMaterialRecord.realDate" type="date"
                                               placeholder="选择日期" align="right" :picker-options="pickerOptions"
                                               format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </my-el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="interiorMaterialRecord.remark" placeholder="备注" type="text"
                                      autocomplete="new-password"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showInteriorMaterialRecord(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureRecord()">确认登记</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 内材登记 结束-->

    </div>
</template>

<script>
import wmsInteriorMaterialManage from './wmsInteriorMaterialManage.js'

export default wmsInteriorMaterialManage
</script>
<style lang="scss">
#wmsInteriorMaterialManage {

}
</style>
