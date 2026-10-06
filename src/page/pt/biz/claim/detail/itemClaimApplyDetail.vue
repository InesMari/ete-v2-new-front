<template>
    <div class="commonItemClaimApply">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="6">物品领用申请单</td>
            </tr>
            <tr>
                <td><em>*</em>标题</td>
                <td colspan="5">
                    <el-input v-model="apply.title" maxlength="500" disabled placeholder="请输入标题" type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请编号</td>
                <td class="blueFont" colspan="3">
                    <el-input v-model="apply.applyNum" disabled placeholder="申请编号" type="text"></el-input>
                </td>
                <td><em>*</em>紧急程度</td>
                <td class="blueFont">
                    <el-radio-group v-model="apply.urgentLevel" disabled >
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
                    <el-date-picker v-model="apply.applyDate" disabled type="date" class="tl" placeholder="默认当前日期"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td style="color: red;">当前审核人</td>
                <td>
                    <el-input v-model="apply.currentVerifyUserName" disabled type="text"></el-input>
                </td>
                <td><em>*</em>物品申请类型</td>
                <td class="blueFont" colspan="3">
                    <el-select v-model="apply.applyItemType" disabled filterable clearable placeholder="请选择物品申请类型">
                        <el-option v-for="item in applyItemTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td class="blueFont">部门审核人</td>
                <td>
                    <el-input v-model="apply.orgVerifyName" disabled type="text"></el-input>
                </td>
                <td class="blueFont">人事审核人</td>
                <td>
                    <el-input v-model="apply.hrVerifyUserName" disabled type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td class="blueFont">部门审核时间</td>
                <td>
                    <el-input v-model="apply.orgVerifyDate" disabled type="text"></el-input>
                </td>
                <td class="blueFont">人事审核时间</td>
                <td>
                    <el-input v-model="apply.hrVerifyDate" disabled type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td class="blueFont">部门审核备注</td>
                <td>
                    <el-input v-model="apply.orgVerifyRemark" disabled type="text"></el-input>
                </td>
                <td class="blueFont">人事审核备注</td>
                <td>
                    <el-input v-model="apply.hrVerifyRemark" disabled type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请理由</td>
                <td colspan="5">
                    <el-input v-model="apply.applyReason" disabled type="textarea" placeholder="请输入申请理由"></el-input>
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
                </tr>
                </thead>
                <tbody>
                <tr v-for="(detail, index) in apply.list">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input v-model="detail.itemType" disabled type="text" placeholder="物品类型"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemName" disabled type="text" placeholder="物品明细"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemSpecification" disabled type="text" placeholder="物品规格"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemCount" disabled type="text" v-mynumval placeholder="数量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemUnit" disabled type="text" placeholder="单位"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemUse" disabled type="text" placeholder="用途"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.itemRemark" disabled type="text" placeholder="备注"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="bot-btn">
            <el-button @click="closePage(true)">关闭</el-button>
        </div>
    </div>
</template>

<script>
import itemClaimApplyDetail from './itemClaimApplyDetail.js'

export default itemClaimApplyDetail
</script>
<style>
.blueFont {
    color: #0379FF;
}
</style>
<style lang="scss" src="../commonItemClaimApply.scss"></style>
