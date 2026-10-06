<template>
    <div id="batchSectionQuote" class="batchSectionQuotePage orderPage">
        <div class="common-info">
            <!--            基础信息-->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <div class="common-info">
                <div class="clearfix">
                    <div class="ipt-info fl">
                        <ul class="content clearfix">
                            <li class="item item100">
                                <label class="label-term">选择客户：</label>
                                <div class="input-text">
                                    <el-select v-model="order.tenantId" filterable clearable
                                               allow-create default-first-option
                                               :disabled="type == 0" :placeholder="tenantTip">
                                        <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                                   :value="item.tenantId"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="item item100">
                                <label class="label-term"><em>*</em>询价截止时间：</label>
                                <div class="input-text">
                                    <el-date-picker v-model="order.validDate" @input="forceUpdate" :disabled="type == 0"
                                                    type="daterange" placeholder="请选择日期时间" align="right"
                                                    format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </div>
                            </li>
                            <li class="item item100">
                                <label class="label-term">账期：</label>
                                <div class="input-text">
                                    <el-input v-model="order.accountPeriod" :disabled="type == 0" v-mynumval type="text"></el-input>
                                </div>
                            </li>

                            <li class="item item50">
                                <label class="label-term"><em>*</em>供应商类型：</label>
                                <div class="input-text">
                                    <el-select v-model="order.supplierType" filterable clearable :disabled="type == 0"
                                               @change="loadSupplierData(true)" placeholder="请选择供应商类型">
                                        <el-option v-for="item in supplierTypeData" :key="item.codeValue" :label="item.codeName"
                                                   :value="item.codeValue"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="item item50">
                                <label class="label-term">主营业务：</label>
                                <div class="input-text">
                                    <el-select v-model="order.mainBusiness" filterable clearable :disabled="type == 0"
                                               @change="loadSupplierData(true)" placeholder="请选择主营业务">
                                        <el-option v-for="item in mainBusinessData" :key="item.codeValue" :label="item.codeName"
                                                   :value="item.codeValue"></el-option>
                                    </el-select>
                                </div>
                            </li>

                            <li class="item item100">
                                <label class="label-term">供应商服务区域：</label>
                                <div class="input-text">
                                    <el-select v-model="order.serviceAreas" filterable clearable multiple
                                               :disabled="type == 0" @change="loadSupplierData(true)" placeholder="请选择供应商服务区域">
                                        <el-option v-for="item in serviceAreasData" :key="item.codeValue" :label="item.codeName"
                                                   :value="item.codeValue"></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="item item100">
                                <label class="label-term"><em>*</em>竞价供应商：</label>
                                <div class="input-text">
                                    <el-select v-model="order.supplierTenantId" filterable clearable multiple
                                               :disabled="type == 0" @change="changeSupplier" placeholder="请选择竞价供应商">
                                        <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                                   :value="item.tenantId" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="upload-info fr">
                        <div class="input-text">
                            <myFileModel ref="fileModel" :disabled="type == 0" @successCallback="successCallback"></myFileModel>
                            <div v-if="files.length > 0">
                                <div class="fw">已上传文件：</div>
                                <div class="files">
                                    <div class="file" v-for="(item, index) in files">
                                        <a href="javascript:void(0);" class="link" @click.stop="showImg(item)" style="margin: 0 10px;">{{ item.fileName }}</a>
                                        <i class="el-icon-error red fr" @click="removeFile(item, index)"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--            基础信息-->

            <!--            作业要求-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业要求信息</span>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="150">序号</th>
                        <th>内容</th>
                        <th width="50" v-show="type != 0">
                            <el-tooltip effect="dark" content="添加作业要求" placement="top-start" :hide-after='1000'>
                                <span @click="addRequirement()" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in requirementList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-input v-model="item.content" type="text" placeholder="作业要求内容"
                                      :disabled="type == 0" :title="item.content"></el-input>
                        </td>
                        <td v-show="type != 0">
                            <el-tooltip effect="dark" content="删除作业要求" placement="top-start" :hide-after='1000'>
                                <span @click="removeRequirement(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            作业要求-->

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="batchSectionQuote">保存</el-button>
            </div>
        </div>
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
import batchSectionQuote from "./batchSectionQuote.js";

export default batchSectionQuote;
</script>
<style lang="scss">
@import "@/page/pt/ord/order.scss";
</style>
<style lang="scss" scoped>
.batchSectionQuotePage {
    .common-info {
        border: none;
        padding-bottom: 10px;

        .content > .item {
            .label-term {
                width: 100px;
            }

            .input-text {
                width: calc(100% - 120px);
            }
        }

        .ipt-info {
            width: calc(100% - 420px);

            .item {
                width: 48%;
            }

            .item100 {
                width: 98%;
            }

            .el-textarea__inner {
                width: 100%;
            }
            .el-date-editor{
                width: 100%;
            }
        }
    }

    .upload-info {
        width: 400px;

        .label-term {
            line-height: 40px;
        }

        /deep/ .myFileModel .avatar-uploader {
            .el-upload {
                width: 400px;
                height: 150px;
            }

            .avatar-uploader-icon {
                width: 400px;
                height: 150px;
                line-height: 150px;
                font-size: 60px;
            }
        }

        .files {
            .file {
                line-height: 30px;
                border-bottom: 1px dashed #efefef;
            }

            .el-icon-error {
                font-size: 16px;
                margin-top: 7px;
                cursor: pointer;
            }
        }
    }
}
</style>
