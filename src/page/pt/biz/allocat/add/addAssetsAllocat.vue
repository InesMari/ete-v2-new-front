<template>
    <div class="commonAssetsAllocat">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="6">固定资产调拨单</td>
            </tr>
            <tr>
                <td><em>*</em>标题</td>
                <td colspan="5">
                    <el-input v-model="allocat.title" maxlength="500" placeholder="请输入标题" type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td><em>*</em>调拨编号</td>
                <td class="blueFont" colspan="3">
                    <el-input v-model="allocat.allocatNum" disabled placeholder="调拨编号" type="text"></el-input>
                </td>
                <td><em>*</em>紧急程度</td>
                <td class="blueFont">
                    <el-radio-group v-model="allocat.urgentLevel">
                        <el-radio :label="item.codeValue" v-for="item in urgentLevelData">{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请人</td>
                <td class="blueFont">
                    <el-input v-model="allocat.applyUser" disabled placeholder="申请人" type="text"></el-input>
                </td>
                <td><em>*</em>申请人部门</td>
                <td>
                    <el-input v-model="allocat.applyUserOrg" disabled placeholder="申请人部门" type="text"></el-input>
                </td>
                <td><em>*</em>申请日期</td>
                <td>
                    <el-date-picker v-model="allocat.applyDate" disabled type="date" class="tl" placeholder="默认当前日期"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td><em>*</em>调出部门</td>
                <td class="blueFont">
                    <el-select v-model="allocat.allocatSrcOrgId" placeholder="请选择调出部门" filterable clearable @change="loadAllocatSrcVerifyData">
                        <el-option v-for="item in allocatSrcOrgData" :key="item.orgId" :label="item.orgName"
                                   :value="item.orgId"></el-option>
                    </el-select>
                </td>
                <td><em>*</em>调入部门</td>
                <td>
                    <el-select v-model="allocat.allocatDestOrgId" placeholder="请选择调入部门" filterable clearable @change="loadAllocatDestVerifyData">
                        <el-option v-for="item in allocatDestOrgData" :key="item.orgId" :label="item.orgName"
                                   :value="item.orgId"></el-option>
                    </el-select>
                </td>
                <td><em>*</em>调拨日期</td>
                <td>
                    <el-date-picker v-model="allocat.allocatDate" type="date" class="tl" placeholder="默认当前日期"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td><em>*</em>调出部门审核人</td>
                <td class="blueFont">
                    <el-select v-model="allocat.allocatSrcVerifyId" placeholder="请选择调出部门审核人" filterable clearable>
                        <el-option v-for="item in allocatSrcVerifyData" :key="item.userId" :label="item.userName"
                                   :value="item.userId"></el-option>
                    </el-select>
                </td>
                <td><em>*</em>调入部门审核人</td>
                <td>
                    <el-select v-model="allocat.allocatDestVerifyId" placeholder="请选择调入部门审核人" filterable clearable>
                        <el-option v-for="item in allocatDestVerifyData" :key="item.userId" :label="item.userName"
                                   :value="item.userId"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td><em>*</em>调拨原因</td>
                <td colspan="5">
                    <el-input v-model="allocat.allocatReason" type="textarea" placeholder="请输入调拨原因"></el-input>
                </td>
            </tr>
        </table>

        <div class="table_height mt_20">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="40">序号</th>
                    <th><em>*</em>资产型号</th>
                    <th><em>*</em>资产名称</th>
                    <th><em>*</em>资产描述</th>
                    <th><em>*</em>数量</th>
                    <th><em>*</em>资产原价值</th>
                    <th><em>*</em>资产折旧价值</th>
                    <th>资产编号</th>
                    <th>备注</th>
                    <th width="100"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(detail, index) in allocat.list">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-input v-model="detail.assetsType"  type="text" placeholder="资产型号"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsName"  type="text" placeholder="资产名称"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsDescribe"  type="text" placeholder="资产描述"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsCount"  type="text" v-mynumval placeholder="数量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsOriginal"  type="text" placeholder="资产原价值"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsDepreciation"  type="text" placeholder="资产折旧价值"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsNum"  type="text" placeholder="资产编号"></el-input>
                    </td>
                    <td>
                        <el-input v-model="detail.assetsRemark"  type="text" placeholder="备注"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                            <span @click="addDetail()" class="add" style="margin-right: 5px;"></span>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'
                                    v-show="index !== 0 && allocat.list.length > 1">
                            <span @click="removeDetail(detail, index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="bot-btn">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdateAssetsAllocat">提交</el-button>
        </div>
    </div>
</template>

<script>
import addAssetsAllocat from './addAssetsAllocat.js'

export default addAssetsAllocat
</script>
<style>
.blueFont {
    color: #0379FF;
}
</style>
<style lang="scss" src="../commonAssetsAllocat.scss"></style>
