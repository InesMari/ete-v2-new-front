<template>
    <div class="addInspectNormPage" id="addInspectNorm">
        <div class="common-info flex">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">巡检表单号:</label>
                    <div class="input-text">
                        <el-input v-model="info.inspectionNum" maxlength="50" show-word-limit></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>巡检事项:</label>
                    <div class="input-text">
                        <el-input v-model="info.inspectionItem" maxlength="100" show-word-limit></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">设备类别:</label>
                    <div class="input-text">
                        <el-select v-model="info.equipmentType" placeholder="请选择设备类别" filterable clearable
                                   :disabled="view">
                            <el-option v-for="item in equipmentTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>检查结果填写方式:</label>
                    <div class="input-text">
                        <el-select v-model="info.type" placeholder="请选择分类目录" filterable clearable
                                   :disabled="view">
                            <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                  <label class="label-term">设备扫码:</label>
                  <div class="input-text">
                    <el-switch v-model="info.scanQrcode" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    <span class="name">{{info.scanQrcode ? "是" : "否"}}</span>
                  </div>
                </li>
                <li class="item item50">
                    <label class="label-term">备注:</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="info.remark" maxlength="500" show-word-limit></el-input>
                    </div>
                </li>
            </ul>
            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="80">序号</th>
                    <th width="120"><em>*</em>巡检项目</th>
                    <th><em>*</em>检查基准</th>
                    <th><em>*</em>巡检要求</th>
                    <th width="150"><em>*</em>巡检方法</th>
                  <th v-show="info.type == 2" width="150">上限
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">设置了上限巡检提交的数值超过上限则该项为异常项</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th v-show="info.type == 2" width="150">下限
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">设置了下限巡检提交的数值超过下限则该项为异常项</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th width="80">
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                            <span @click="addItem()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in list">
                    <td>{{index + 1}}</td>
                    <td>
                      <el-input type="text" v-model="item.inspectItem" placeholder="请输入巡检项目"></el-input>
                    </td>
                    <td>
                        <el-input type="text" v-model="item.content" placeholder="请输入检查基准"></el-input>
                    </td>
                    <td>
                      <el-input type="text" v-model="item.inspectRequire" placeholder="请输入巡检要求"></el-input>
                    </td>
                    <td>
                      <el-checkbox-group v-model="item.inspectMethod">
                        <el-checkbox v-for="item in inspectMethodData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
                      </el-checkbox-group>
                    </td>
                    <td v-show="info.type == 2">
                        <el-input v-model="item.up" v-mydoubleval maxlength="10" show-word-limit
                                  placeholder="请输入上限"></el-input>
                    </td>
                    <td v-show="info.type == 2">
                        <el-input v-model="item.floor" v-mydoubleval maxlength="10" show-word-limit
                                  placeholder="请输入下限"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                            <span @click="removeItem(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save">{{ type == 1 ? '新增' : '修改' }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addInspectNorm from './addInspectNorm.js'

export default addInspectNorm
</script>
<style lang="scss" scoped>
.addInspectNormPage {
    .common-info {
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;

        .content {
            & > .item {
                .label-term {
                    width: 115px;
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