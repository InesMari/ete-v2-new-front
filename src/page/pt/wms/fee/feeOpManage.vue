<template>
    <div id="feeOpManage">
        <select-work v-show="showSelWork"></select-work>
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="供应商"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">货主：</label>
                    <div class="input-text">
                        <el-input v-model="query.srcTenantName" placeholder="货主"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商：</label>
                    <div class="input-text">
                        <el-input v-model="query.fromTenantName" placeholder="到货厂商"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">操作类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.wmsCostItemType" @change="doQuery" clearable filterable placeholder="操作类型">
                            <el-option v-for="item in itemTypeData"
                                       :key="item.codeValue"
                                       :label="item.codeName"
                                       :value="item.codeValue">
                            </el-option>
                        </el-select>
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
                    <span>操作登记列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="操作登记列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true,1)" v-entity="1005155">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openDialog(true,2)" v-entity="1005156">修改</el-button>
                    <el-button type="danger"  plain size="mini" @click="deleteFeeCostOperate" v-entity="1005157">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="print" v-entity="1005165">打印</el-button>
                    <el-button type="primary" plain @click="showFileUpload()" size="mini"  v-entity="1005166">上传操作凭据</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="feeOpManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true">
              <template v-slot="{item,code,name,index}">
                <div v-if="code=='file'">
                  <a class="link" :class="!item.fileUrl?'disabled':'link'" href="javascript:;" @click="showImg(item)">查看</a>
                </div>
              </template>
            </tableCommon>
        </div>


      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList" zIndex="10000"></fileViewer>

      <!-- 操作凭据 开始-->
      <el-dialog title="上传操作凭据" :visible.sync="showFile" width="380px" :close-on-click-modal="false" :close-on-press-escape="false" >
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term"><em>*</em>操作凭据</label>
              <div class="input-text">
                <myFileModel ref="file"></myFileModel>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showFile=false;">关闭</el-button>
            <el-button type="primary" size="mini" @click="uploadCredentialFile()">确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 操作凭据 结束-->

        <!-- begin -->
        <el-dialog :title="title" :visible.sync="showDialog" width="540px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商</label>
                        <div class="input-text">
                            <el-select v-model="info.tenantId" placeholder="请选择供应商" filterable clearable
                                       :disabled="isOnlySee" @click="loadSupplierData">
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100" v-show="info.itemType != 9">
                        <label class="label-term"><em>*</em>到货厂商</label>
                        <div class="input-text">
                            <el-select v-model="info.fromTenantId" placeholder="请选择到货厂商" clearable filterable :disabled="isOnlySee">
                                <el-option v-for="item in fromTenantData" :key="item.wId" :label="item.name" :value="item.wId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>操作类型</label>
                        <div class="input-text">
                            <el-radio-group v-model="info.itemType" @change="changeItemType">
                                <el-radio :label="item.codeValue" v-for="item in itemTypeData">{{ item.codeName }}</el-radio>
                            </el-radio-group>
                        </div>
                    </li>
                    <li class="item item100" v-show="info.itemType == 9">
                        <label class="label-term"><em>*</em>计费方式</label>
                        <div class="input-text">
                            <el-select v-model="info.wmsBillingType" placeholder="请选择计费方式" clearable filterable :disabled="isOnlySee">
                                <el-option v-for="item in wmsBillingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100" v-show="info.itemType == 9">
                        <label class="label-term"><em>*</em>单价</label>
                        <div class="input-text">
                            <el-input v-model="info.price" @input="calcTotalFee" maxlength="10" v-mydoubleval placeholder="请输入单价"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>数量</label>
                        <div class="input-text">
                            <el-input v-model="info.sums" @input="calcTotalFee" maxlength="10" v-mynumval placeholder="请输入数量"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-show="info.itemType == 3 || info.itemType == 9">
                        <label class="label-term"><em>*</em>金额</label>
                        <div class="input-text">
                            <el-input v-model="info.totalFee" maxlength="10" v-mydoubleval placeholder="请输入金额"
                                      :disabled="isOnlySee || info.itemType == 9"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>实际发生日期</label>
                        <div class="input-text">
                            <el-date-picker v-model="info.actualDate" :disabled="isOnlySee" type="date"
                                            placeholder="请选择实际发生日期" value-format="yyyy-MM-dd"
                                            :picker-options="limitPickerOptions">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" type="textarea" placeholder="说点什么..."></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveFeeCostOperate()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- end -->
    </div>
</template>

<script>
import feeOpManage from './feeOpManage.js'

export default feeOpManage
</script>
<style lang="scss">

</style>

