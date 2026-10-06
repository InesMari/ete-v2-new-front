<template>
    <div id="storageInfoManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="storageInfoManageSearch" v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>库位列表</span>
                    <el-tooltip effect="light" content="库位列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showUpload(true)" v-entity="1005087">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="toAddStorage(true)" v-entity="1005054">新建</el-button>
                    <el-button type="primary" plain size="mini" @click="toUpStorage()" v-entity="1005055">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="delStorageInfo()" v-entity="1005056">删除</el-button>
                    <!-- <el-button type="primary" plain size="mini" @click="print" v-entity="1005117">库位条码打印</el-button> -->
                    <el-button type="primary" plain size="mini" @click="batchPrint('A4')" v-entity="1005117">库位条码打印（A4）</el-button>
                    <el-button type="primary" plain size="mini" @click="batchPrint('label')" v-entity="1005117">库位条码打印（标签）</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="storageManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="false" @dblclickItem="dblclickItem">
                <template v-slot:default="{item}">
                    <img :src="item.qrImgPath" alt="" width="100%" height="100%">
                </template>
            </tableCommon>
        </div>

        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/importStorage.xlsx"
                   title="库位导入"
                   bean="wmsReservoirTF" method="importStorage"></my-import>

        <!-- 新增 库位 -->
        <el-dialog :title="title" :visible.sync="showStorage" width="520px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="toAddStorage(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>库位编码</label>
                        <div class="input-text">
                            <el-input v-model="storage.storageCode" placeholder="请输入库位编码"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所属库区</label>
                        <div class="input-text">
                            <el-select v-model="storage.reservoirId" placeholder="请选择所属库区" clearable filterable
                                       :disabled="isLock">
                                <el-option v-for="item in reservoirData" :key="item.reservoirId"
                                           :label="item.reservoirName" :value="item.reservoirId"></el-option>
                            </el-select>
                        </div>
                    </li>
                  <li class="item item100">
                    <label class="label-term"><em>*</em>是否混物料</label>
                    <div class="input-text">
                      <el-select v-model="storage.isMixGoods" placeholder="是否混物料" clearable filterable @change="changeMixGoods"
                                 :disabled="isLock||storage.isRepeat=='0'">
                        <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>是否混批次</label>
                        <div class="input-text">
                            <el-select v-model="storage.isMixBatch" placeholder="请选择是否混批次" clearable filterable
                                       :disabled="isLock||storage.isMixGoods=='1'||storage.isRepeat=='0'" @change="$forceUpdate">
                                <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                  <li class="item item100">
                    <label class="label-term">库位类型</label>
                    <div class="input-text">
                      <el-select v-model="storage.storageType" placeholder="请选择库位类型" filterable
                                 :disabled="isLock" @change="changeStorageType">
                        <el-option v-for="item in storageTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item100" v-show="storage.storageType==2">
                    <label class="label-term">是否能重复放入(立库)</label>
                    <div class="input-text">
                      <el-select v-model="storage.isRepeat" placeholder="请选择是否能重复放入" filterable
                                 :disabled="isLock" @change="changeRepeat">
                        <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item100" v-show="storage.storageType==1">
                    <label class="label-term">最大托数(平库)</label>
                    <div class="input-text">
                      <el-input v-model="storage.maxPalletNums" placeholder="请输入最大托数,不输入不限制"
                                :disabled="isLock"></el-input>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="toAddStorage(false)">取消</el-button>
                    <el-button type="primary" size="mini" @click="saveStorage()" v-show="!isLock">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import storageInfoManage from './storageInfoManage.js'

export default storageInfoManage
</script>
<style lang="scss">
#storageInfoManage{
  .label-term{
    width: 120px;
  }
  .input-text{
    width: calc(100% - 130px);
  }
}

</style>

