<template>
    <div class="commonItemClaimApply">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="6">物品领用申请单</td>
            </tr>
            <tr>
                <td><em>*</em>标题</td>
                <td colspan="5">
                    <el-input v-model="apply.title" maxlength="500" placeholder="请输入标题" type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请编号</td>
                <td class="blueFont" colspan="3">
                    <el-input v-model="apply.applyNum" disabled placeholder="申请编号" type="text"></el-input>
                </td>
                <td><em>*</em>紧急程度</td>
                <td class="blueFont">
                    <el-radio-group v-model="apply.urgentLevel">
                        <el-radio :label="item.codeValue" v-for="item in urgentLevelData">{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请人</td>
                <td class="blueFont">
                    <el-input v-model="apply.applyUser" disabled placeholder="申请人" type="text"></el-input>
                </td>
                <td><em>*</em>申请人部门</td>
                <td>
                    <el-input v-model="apply.applyUserOrg" disabled placeholder="申请人部门" type="text"></el-input>
                </td>
                <td><em>*</em>申请日期</td>
                <td>
                    <el-date-picker v-model="apply.applyDate" type="date" class="tl" placeholder="默认当前日期"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td><em>*</em>部门审核人</td>
                <td>
                    <el-select v-model="apply.orgVerifyUserId" placeholder="请选择审核人" filterable clearable>
                        <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                                   :value="item.userId"></el-option>
                    </el-select>
                </td>
                <td><em>*</em>物品申请类型</td>
                <td class="blueFont" colspan="3">
                    <el-select v-model="apply.applyItemType" placeholder="请选择物品申请类型" filterable clearable>
                        <el-option v-for="item in applyItemTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请理由</td>
                <td colspan="5">
                    <el-input v-model="apply.applyReason" type="textarea" placeholder="请输入申请理由"></el-input>
                </td>
            </tr>
        </table>

        <div class="table_height mt_20">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="40">序号</th>
                    <th><em>*</em>物品类型</th>
                    <th><em>*</em>物品明细</th>
                    <th>物品规格</th>
                    <th><em>*</em>数量</th>
                    <th><em>*</em>单位</th>
                    <th><em>*</em>用途</th>
                    <th>备注</th>
                    <th width="100"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(detail, index) in apply.list">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input v-model="detail.itemType" type="text" placeholder="物品类型"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemName" type="text" placeholder="物品明细"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemSpecification" type="text" placeholder="物品规格"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemCount" type="text" v-mynumval placeholder="数量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemUnit" type="text" placeholder="单位"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemUse"  type="text" placeholder="用途"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemRemark"  type="text" placeholder="备注"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                            <span @click="addDetail()" class="add" style="margin-right: 5px;"></span>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'
                                    v-show="index !== 0 && apply.list.length > 1">
                            <span @click="removeDetail(detail, index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="bot-btn">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdateClaimApply">提交</el-button>
        </div>
    </div>
</template>

<script>
import addItemClaimApply from './addItemClaimApply.js'

export default addItemClaimApply
</script>
<style>
.blueFont {
    color: #0379FF;
}
</style>
<style lang="scss" src="../commonItemClaimApply.scss"></style>
