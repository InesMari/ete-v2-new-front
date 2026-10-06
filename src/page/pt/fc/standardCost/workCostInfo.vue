<template>
    <div id="workCostInfo" class="workCostInfoPage">
        <div class="treeView">
            <el-select v-model="info.operateId"
                       @change="changeOperate"
                       clearable filterable
                       :disabled="isVisible"
                       style="width: 100%"
                       placeholder="操作费">
                <el-option v-for="item in operateFeeData" :key="item.id" :label="item.deliveryFormName"
                           :value="item.id">
                    <span style="float: left">{{ item.name }} || {{ item.deliveryFormName }}</span>
                </el-option>
            </el-select>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="80">工序</th>
                    <th width="100">明细单价</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item) in details">
                        <td>{{ item.processTypeName }}</td>
                        <td>{{ item.amount }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td>{{ info.operateAmount }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div style="width: calc(100% - 500px)">
            <div class="common-info">
                <h3 class="common-title">
                    <span class="title-name">辅助成本</span>
                </h3>
                <div class="mt_20">
                    <ul class="content clearfix">
                        <li class="item item50">
                            <label class="label-term">辅助材料(单价)</label>
                            <div class="input-text">
                                <el-input v-model="info.assistPrice" @input="changeAssist" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">设备折旧</label>
                            <div class="input-text">
                                <el-input v-model="info.equipmentDepreciation" @input="changeAssist" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">办公折旧</label>
                            <div class="input-text">
                                <el-input v-model="info.officeDepreciation" @input="changeAssist" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">损坏费</label>
                            <div class="input-text">
                                <el-input v-model="info.damage" @input="changeAssist" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">招待费</label>
                            <div class="input-text">
                                <el-input v-model="info.entertain" @input="changeAssist" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">管理成本(%)</label>
                            <div class="input-text">
                                <el-input v-model="info.managePercent" @input="changeAmount" v-mydoubleval :disabled="isVisible"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                            <label class="label-term">辅助合计</label>
                            <div class="input-text">
                                <el-input v-model="info.assistAmount" v-mydoubleval disabled></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">备注</label>
                            <div class="input-text">
                                <el-input v-model="info.remark" placeholder="写点什么?"
                                          :disabled="isVisible"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="common-info">
                <h3 class="common-title">
                    <span class="title-name">最终成本</span>
                </h3>
                <div class="mt_20">
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term" style="width: 300px">(操作小计+辅助小计)*(1+管理成本*100%)=</label>
                            <div class="input-text" style="width: calc(100% - 310px);">
                                <el-input v-model="info.amount" disabled></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="type != 5 && type != 6" @click="save">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import workCostInfo from './workCostInfo.js'

export default workCostInfo
</script>
<style lang="scss" scoped>
.workCostInfoPage {
    display: flex;

    /deep/ .treeView {
        width: 500px;
        background: #fff;
        border: $border;
        height: 100%;
        box-sizing: border-box;

        .el-input {
            margin: 20px;
            display: block;
            width: auto;
        }
    }
    .common-info .content .el-textarea__inner {
        width: 100% !important;width: 100% !important;
    }
}
</style>
  