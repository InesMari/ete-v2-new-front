<template>
    <div class="addInspectRegIncomePage" id="addInspectRegIncome">
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
                        <el-input v-model="info.customerName" placeholder="请输入客户名称"
                                  :disabled="view" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>来料异常描述：</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="info.exceptionDescribe" placeholder="请输入来料异常描述"
                                  :disabled="view" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>临时处理措施：</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="info.tempDealMeasure" placeholder="请输入临时处理措施"
                                  :disabled="view" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>原因分析：</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="info.causeAnalysis" :placeholder="'1.请输入发生原因\n2.请输入流出原因\n3.请输入系统原因'"
                                  :disabled="view" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>改善对策：</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="info.improveCounterplan" :placeholder="'1.请输入发生改善对策\n2.请输入流出改善对策\n3.请输入系统改善对策'"
                                  :disabled="view" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">来料异常图片:</label>
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
import addInspectRegIncome from './addInspectRegIncome.js'

export default addInspectRegIncome
</script>
<style lang="scss" scoped>
.addInspectRegIncomePage {
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