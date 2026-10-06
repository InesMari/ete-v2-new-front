<template>
    <div id="permissionInfo" class="addPlanPage orderPage">
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term" style="width: 120px;"><em>*</em>数据权限名称：</label>
                    <div class="input-text" style="    width: calc(100% - 132px);">
                        <el-input v-model="info.name" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">数据权限描述：</label>
                    <div class="input-text">
                        <el-input v-model="info.remark" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>初始权限：</label>
                    <div class="input-text">
                        <el-radio-group v-model="info.type" :disabled="disabled">
                            <el-radio :label="item.codeValue" v-for="item in initTypeData">{{item.codeName}}</el-radio>
                        </el-radio-group>
                    </div>
                </li>
            </ul>
            <h3 class="common-title mt_20">
                <span class="title-name">特殊权限</span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="60" >序号</th>
                        <th><em>*</em>数据模块</th>
                        <th><em>*</em>数据权限</th>
                        <th v-show="showOrg">指定的部门</th>
                        <th width="50" v-show="type == 1 || type == 2 || type == 5">
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                <span class="add" @click="addItem"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in list">
                        <td>
                            {{index + 1}}
                        </td>
                        <td>
                            <el-select v-model="item.entityId" clearable filterable :disabled="disabled" placeholder="请选择数据模块">
                                <el-option v-for="item in menuData" :key="item.id" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.type" @change="changeAuth(item, true)" clearable filterable :disabled="disabled" placeholder="请选择数据权限">
                                <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName"
                                    :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td v-show="showOrg">
                            <el-select v-model="item.orgId" @change="forceUpdate" multiple clearable filterable :disabled="disabled || item.type == 1 || item.type == 2 || item.type == 3" placeholder="请选择指定的部门">
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                           :value="item.id"></el-option>
                            </el-select>
                        </td>
                        <td v-show="type == 1 || type == 2 || type == 5">
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span class="del" @click="removeItem(index)"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="savePermission" v-show="type == 1 || type == 2 || type == 5">保存</el-button>
            </div>
        </div>

    </div>
</template>
  
<script>
import permissionInfo from './permissionInfo.js'
export default permissionInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>