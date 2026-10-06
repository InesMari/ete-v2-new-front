<template>
    <div class="addInspectAssignPage" id="addInspectAssign">
        <div class="common-info flex">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>仓库:</label>
                    <div class="input-text">
                        <el-select v-model="info.workStoreId" placeholder="请选择仓库" filterable clearable
                                   @change="loadWorkUser(true)" :disabled="view">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>巡检事项:</label>
                    <div class="input-text">
                        <el-select v-model="info.standardId" placeholder="请选择巡检事项" filterable clearable
                                   @change="changeStandard" :disabled="view">
                            <el-option v-for="item in standardData" :key="item.id" :label="item.inspectionItem"
                                       :value="item.id"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                  <label class="label-term"><em>*</em>执行人:</label>
                  <div class="input-text">
                    <el-select v-model="info.executor" placeholder="请选择执行人" filterable clearable multiple
                               :disabled="view">
                      <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                                 :value="item.userId"></el-option>
                    </el-select>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term"><em>*</em>负责人:</label>
                  <div class="input-text">
                    <el-select v-model="info.principal" placeholder="请选择负责人" filterable clearable
                               :disabled="view">
                      <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                                 :value="item.userId"></el-option>
                    </el-select>
                  </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>巡检频率:</label>
                    <div class="input-text">
                        <el-select v-model="info.inspectionTimes"
                                   filterable clearable @change="changeTimes"
                                   :disabled="view" placeholder="请选择巡检频率">
                            <el-option v-for="item in inspectionTimesData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50" v-show="info.inspectionTimes == 2">
                    <label class="label-term" style="width: 80px;"><em>*</em>每月截止日期:</label>
                    <div class="input-text">
                        <el-date-picker v-model="appointInspectionDate" type="date" :disabled="view"
                                        placeholder="请选择日期" align="right" :picker-options="limitPickerOptions"
                                        format="d" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item item50" v-show="info.inspectionTimes == 1">
                  <label class="label-term" style="width: 80px;">跳过:</label>
                  <div class="input-text">
                    <el-checkbox :label="index" v-for="(item,index) in passData" v-model="item.value">{{ item.name }}</el-checkbox>
                  </div>
                </li>
            </ul>
            <ul class="content clearfix" v-show="info.inspectionTimes == 3">
                <li class="item item20" v-for="(item, index) in inspectionTimesList">
                    <div class="input-text">
                        <el-time-picker
                                is-range
                                v-model="item.time"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围"
                                :disabled="view"
                                format="HH:mm" value-format="HH:mm">
                        </el-time-picker>
                    </div><i class="el-icon-error del" @click="deleteTime(index)"></i>
                </li>
            </ul>



            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="80">序号</th>
                    <th>巡检设备</th>
                    <th>设备产品编号</th>
                    <th>生效状态</th>
                    <th width="80">
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                            <span @click="addListItem()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in list">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input v-model="item.equipment" placeholder="请输入设备"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.equipmentNum" placeholder="请输入设备编号"></el-input>
                    </td>
                    <td>
                        <el-switch v-model="item.sts == 1" size="mini" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                            <span @click="removeListItem(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="tableCommon mt_20" width="50%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="80">序号</th>
                    <th>附加图片名称</th>
                    <th width="80">
                        <el-tooltip effect="dark" content="添加图片名称" placement="top-start" :hide-after='1000'>
                            <span @click="addImgItem()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in imgNameList">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input v-model="item.imgName" placeholder="请输入图片名称"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除图片名称" placement="top-start" :hide-after='1000'>
                            <span @click="removeImgItem(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="type == 1 || type == 2" @click="save">{{ type == 1 ? '新增' : '修改' }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addInspectAssign from './addInspectAssign.js'

export default addInspectAssign
</script>
<style lang="scss" scoped>
.addInspectAssignPage {
    /deep/ .common-info {
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;

        .el-textarea__inner {
            width: 100%;
            height: 100px;
        }
        .el-range-editor.el-input__inner{
            width: 100%;
        }
        .item20{
            width: 18%;
            margin-right: 2%;
        }
        .item{
            position: relative;
        }
        .del{
            position: absolute;
            right: -10px;
            top: -2px;
            color: red;
            font-size: 20px;
            cursor: pointer;
        }
    }

    .tableCommon {
        border: $border;

        /deep/ .el-select {
            width: 100%;
        }

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