<template>
    <div id="wmsArrivalManufacturerTenantManage">
        <!--        选择仓库-->
        <select-work v-show="showSelWork"></select-work>
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">所属货主：</label>
                    <div class="input-text">
                        <el-input v-model="query.srcTenantName" placeholder="所属货主" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="到货厂商名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商编码：</label>
                    <div class="input-text">
                        <el-input v-model="query.code" placeholder="到货厂商编码" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.tenantType" @change="doQuery(query)" clearable filterable
                                   placeholder="类型">
                            <el-option v-for="item in tenantTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
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
                    <span>到货厂商列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="到货厂商列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="showUpload(true)" size="mini" v-entity="1005060">批量导入</el-button>
                    <el-button type="primary" plain @click="showArrivalManufacturer(true,1)" size="mini" v-entity="1005061">新增</el-button>
                    <el-button type="primary" plain @click="showArrivalManufacturer(true, 2)" size="mini" v-entity="1005062">修改</el-button>
                    <el-button type="danger" plain @click="deleteArrivalManufacturer()" size="mini" v-entity="1005063">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsArrivalManufacturerTenantManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 导入 开始-->
        <el-dialog class="sureDialog" title="导入厂商" :visible.sync="showUploadPage" :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="500px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <em style="font-size:14px;padding-left:22px;">注：只能导入系统不存在的厂商且类型必须填写</em>
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                        <my-import ref="myImport" :handle-success="sureImportSuccess" :noneDialog="true"
                                   template="/download/arrivalManufacturer.xlsx" title="导入厂商"
                                   tip="仅允许导入“xls”或“xlsx”格式文件！" bean="wmsTenantTF" method="importArrivalManufacturer"
                                   repeatCheckNums="0" :param="uploadParam"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureImport()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 导入 结束-->

        <!-- 新增修改查看到货厂商 -->
        <el-dialog class="arrivalManufacturerDialog" :title="title" :visible.sync="arrivalManufacturerShow" width="40%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showArrivalManufacturer(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term "><em>*</em>到货厂商名称</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.name" maxlength="20" placeholder="到货厂商名称"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term "><em>*</em>归属货主</label>
                        <div class="input-text">
                            <el-select v-model="arrivalManufacturer.parentId" @change="chnageSrcTenant" filterable clearable placeholder="归属货主"
                                       :disabled="isOnlySee">
                                <el-option v-for="item in wmsTenantData" :key="item.wId" :label="item.name"
                                           :value="item.wId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">到货厂商编码</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.code" maxlength="20" placeholder="到货厂商编码"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.linkman" maxlength="20" placeholder="联系人"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系方式</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.linkPhone" maxlength="20" placeholder="联系方式"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">作业点简称</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.workName" maxlength="20" placeholder="作业点简称"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">地址</label>
                        <div class="input-text">
                            <el-input v-model="arrivalManufacturer.workAddressStr" maxlength="20" placeholder="请通过地图选择详细地址"
                                      disabled style="width: 71%;margin-right: 10px;"></el-input>
                            <el-button type="primary" @click="showMap" style="width:25%;">地图选择</el-button>
                            <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton"
                                        @sureCallback="sureAddress" @hideMapBack="hideMapBack" :modal="false">
                            </map-dialog>
                        </div>
                    </li>
                    <li class="item item100" v-show="isNotDistrict">
                        <label class="label-term"><em>*</em>区/县</label>
                        <div class="input-text">
                            <el-select v-model="arrivalManufacturer.districtId" @change="changeDistrict" filterable placeholder="区/县">
                                <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>类型</label>
                        <div class="input-text">
                            <el-select v-model="arrivalManufacturer.tenantType" :disabled="isOnlySee" filterable
                                       clearable placeholder="类型">
                                <el-option v-for="item in tenantTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showArrivalManufacturer(false)">关闭</el-button>
                    <el-button type="primary" v-show="showAddButton" size="mini" @click="saveOrUpdateArrivalManufacturer(1)">新增</el-button>
                    <el-button type="primary" v-show="showUpdateButton" size="mini" @click="saveOrUpdateArrivalManufacturer(2)">修改
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 到货厂商 结束-->

    </div>
</template>

<script>
import wmsArrivalManufacturerTenantManage from './wmsArrivalManufacturerTenantManage.js'

export default wmsArrivalManufacturerTenantManage
</script>
<style lang="scss">
#wmsArrivalManufacturerTenantManage {
    .arrivalManufacturerDialog {
        .el-dialog__body {
            padding: 20px 20px 30px !important;
        }
        .common-info .content > .item {
            .label-term {
                width: 100px;
            }
            .label-term2 {
                width: 100%;
                height: 40px;
                padding-left: 23px;
            }
            .input-text {
                width: calc(100% - 110px);
            }
        }
    }
}
</style>
