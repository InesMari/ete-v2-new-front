<template>
    <div class="addInspectRegGoodsPage" id="addInspectRegGoods">
        <div class="common-info flex">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>仓库:</label>
                    <div class="input-text">
                        <el-select v-model="info.workStoreId" placeholder="请选择仓库" filterable clearable
                                   :disabled="view">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="info.customerName"
                                  :disabled="view" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>料号：</label>
                    <div class="input-text">
                        <el-input v-model="info.materialNum"
                                  :disabled="view" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>批次号：</label>
                    <div class="input-text">
                        <el-input v-model="info.batchNum"
                                  :disabled="view" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>数量：</label>
                    <div class="input-text">
                        <el-input v-model="info.count" v-mydoubleval
                                  :disabled="view" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>计划处理时间：</label>
                    <div class="input-text">                        
                        <el-date-picker  v-model="info.planDealDate"
                                         :disabled="view" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item100">
                    <label class="label-term"><em>*</em>异常品存放区域图片:</label>
                    <div class="fl mr_20"  v-for="(item,index) in imgList">
                        <myFileModel :ref="'file' + index"
                                     :disabledEdit="view"
                                     :disabledDel="view"
                                     @successCallback="successCallback"
                                     @delCallback="delCallback"
                                     :componentId="index"></myFileModel>
                        <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                    </div>
                </li>
            </ul>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="type != 0" @click="save">{{ type == 1 ? '新增' : '修改' }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addInspectRegGoods from './addInspectRegGoods.js'

export default addInspectRegGoods
</script>
<style lang="scss" scoped>
.addInspectRegGoodsPage {
    .common-info {
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;

        .content {
            & > .item {
                .label-term {
                    width: 140px;
                }
            }
        }

        /deep/ .el-textarea__inner {
            width: 100%;
            height: 100px;
        }
    }

    .tableCommon {
        border: $border;

        .add {
            vertical-align: middle;
            @include add;
        }

        .del {
            vertical-align: middle;
            @include del;
        }
    }
}
</style>