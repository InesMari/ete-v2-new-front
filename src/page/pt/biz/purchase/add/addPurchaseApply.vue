<template>
    <div class="commonPurchaseApply">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="6">采购费用申请单</td>
            </tr>
            <tr>
                <td><em>*</em>标题</td>
                <td :colspan="apply.applyNum ? 3 : 5">
                    <el-input v-model="apply.title" maxlength="500" placeholder="请输入标题" type="text"></el-input>
                </td>
                <td v-show="apply.applyNum">申请编号</td>
                <td v-show="apply.applyNum" class="blueFont">
                    <el-input v-model="apply.applyNum" disabled type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td><em>*</em>采购名称</td>
                <td colspan="3">
                    <el-input v-model="apply.purchaseName" placeholder="请输入采购名称"></el-input>
                </td>
                <td><em>*</em>采购方式</td>
                <td>
                    <el-select v-model="apply.purchasePayType" placeholder="请选择采购方式" filterable clearable>
                        <el-option v-for="item in purchasePayTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue">
                            <span style="float: left">{{ item.codeName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.codeDesc }}</span>
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td><em>*</em>付款方式</td>
                <td>
                    <el-radio-group v-model="apply.payType">
                        <el-radio :label="item.codeValue" v-for="item in payTypeData">{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
                <td><em>*</em>紧急程度</td>
                <td class="blueFont">
                    <el-radio-group v-model="apply.urgentLevel">
                        <el-radio :label="item.codeValue" v-for="item in urgentLevelData">{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
                <td>预计到达时间</td>
                <td>
                    <el-date-picker v-model="apply.expectDate" type="date" class="tl" placeholder="请选择"
                                    value-format="yyyy-MM-dd"></el-date-picker>
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
                <td><em>*</em>是否预算内
                    <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">是预算内的无需副总以上审核</div>
                        <i class="el-icon-question pointer"></i>
                    </el-tooltip>
                </td>
                <td>
                    <el-radio v-model="apply.isWithinBudget" :label="item.codeValue" v-for="item in whetherData">{{ item.codeName }}</el-radio>
                </td>
                <td><em>*</em>采购类型</td>
                <td class="blueFont">
                    <el-select v-model="apply.purchaseType" placeholder="请选择采购类型" filterable clearable>
                        <el-option v-for="item in purchaseTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue" class="purchaseApplySpecSel">                                
                                <p style="font-size: 14px;">{{ item.codeName }}</p>
                                <p style="color: #8492a6; font-size: 12px">{{ item.codeDesc }}</p>
                        </el-option>
                    </el-select>
                </td>
                <td><em>*</em>采购总金额</td>
                <td>
                    <el-input v-model="apply.payFee" v-mydoubleval placeholder="请输入采购总金额" class="tl"></el-input>
                </td>
            </tr>
            <tr>
                <td colspan="6">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th>费用项目名称</th>
                            <th>采购金额</th>
                            <th>采购原因</th>
                            <th width="50">
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                    <span @click="addItem()" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(detail, index) in apply.detailList">
                            <td>
                                <el-input v-model="detail.name" placeholder="费用项目名称"></el-input>
                            </td>
                            <td>
                                <el-input v-mydoubleval v-model="detail.fee" @input="calcFee" maxlength="100"  placeholder="请输入采购金额"></el-input>
                            </td>
                            <td>
                                <el-input v-model="detail.remark" placeholder="采购原因"></el-input>
                            </td>
                            <td>
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                    <span @click="removeItem(index)" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>采购原因描述</td>
                <td colspan="5">
                    <el-input v-model="apply.purchaseReason" type="textarea" placeholder="请输入采购原因描述"></el-input>
                </td>
            </tr>
            <tr>
                <td>采购询价描述</td>
                <td colspan="5">
                    <el-input v-model="apply.purchaseInquiry" type="textarea" placeholder="请输入采购询价描述"></el-input>
                </td>
            </tr>
        </table>
        <div class="uploadFile clearfix" style="margin-top:20px;">
            <div class="fl mr_20 ml_10"  v-for="(item, index) in apply.list">
                <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback" supportFiles="img,excel,pdf" :componentId="index"></myFileModel>
                <p>只支持.jpg.png.pdf.xls.xlsx格式</p>
            </div>
            <div class="form fr" style="margin-top: 60px;">
                <em>*</em>部门审核人：
                <el-select v-model="apply.orgVerifyUserId" placeholder="请选择审核人" filterable clearable>
                    <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName"
                               :value="item.userId"></el-option>
                </el-select>
            </div>
        </div>
        <div class="bot-btn">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdatePurchaseApply">提交</el-button>
        </div>
    </div>
</template>

<script>
import addPurchaseApply from './addPurchaseApply.js'

export default addPurchaseApply
</script>
<style>
.blueFont {
    color: #0379FF;
}
.purchaseApplySpecSel{
    height: auto;
    padding: 5px 20px;
}

</style>
<style lang="scss" src="../commonPurchaseApply.scss"></style>
