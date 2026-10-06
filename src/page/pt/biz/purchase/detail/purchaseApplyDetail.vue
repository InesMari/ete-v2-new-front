<template>
    <div class="commonPurchaseApply">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="6">采购费用申请单</td>
            </tr>
            <tr>
                <td><em>*</em>标题</td>
                <td colspan="3">
                    <el-input v-model="apply.title" disabled maxlength="500" type="text"></el-input>
                </td>
                <td><em>*</em>申请编号</td>
                <td class="blueFont">
                    <el-input v-model="apply.applyNum" disabled type="text"></el-input>
                </td>
            </tr>
            <!--            请款/付款合并展示            -->
            <tr v-show="apply.reqArray.length + apply.payArray.length > 0 && apply.reqArray.length + apply.payArray.length <= 4">
                <td v-show="apply.reqArray.length > 0">请款单号</td>
                <td v-for="(item, index) in apply.reqArray" :colspan="apply.reqArray.length === (index + 1) && apply.payArray.length === 0 ? 5 - apply.reqArray.length + 1 : 1">
                    <a href="javascript:void(0);" style="color:red;" @click="clickItem(item.reqId, enumData.PAY_TYPE.REQ)">{{item.reqNum}}</a>
                </td>
                <td v-show="apply.payArray.length > 0">付款单号</td>
                <td v-for="(item, index) in apply.payArray" :colspan="apply.payArray.length === (index + 1) ? 5 - (apply.reqArray.length + apply.payArray.length) + 1 : 1">
                    <a href="javascript:void(0);" style="color:blue;" @click="clickItem(item.payId, enumData.PAY_TYPE.PAY)">{{item.payNum}}</a>
                </td>
            </tr>
            <!--            请款/付款合并展示            -->



            <!--            请款/付款            -->
            <tr v-show="apply.reqArray.length > 0 && apply.reqArray.length + apply.payArray.length > 4">
                <td>请款单号</td>
                <td v-for="(item, index) in apply.reqArray" :colspan="apply.reqArray.length === (index + 1) ? 5 - apply.reqArray.length + 1 : 1">
                    <a href="javascript:void(0);" style="color:red;" @click="clickItem(item.reqId, enumData.PAY_TYPE.REQ)">{{item.reqNum}}</a>
                </td>
            </tr>
            <tr v-show="apply.payArray.length > 0 && apply.reqArray.length + apply.payArray.length > 4">
                <td>付款单号</td>
                <td v-for="(item, index) in apply.payArray" :colspan="apply.payArray.length === (index + 1) ? 5 - apply.payArray.length + 1 : 1">
                    <a href="javascript:void(0);" style="color:blue;" @click="clickItem(item.payId, enumData.PAY_TYPE.PAY)">{{item.payNum}}</a>
                </td>
            </tr>
            <!--            请款/付款            -->
            <tr>
                <td><em>*</em>采购名称</td>
                <td colspan="3">
                    <el-input v-model="apply.purchaseName" disabled ></el-input>
                </td>
                <td><em>*</em>采购方式</td>
                <td>
                    <el-select v-model="apply.purchasePayType" disabled >
                        <el-option v-for="item in purchasePayTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td><em>*</em>付款方式</td>
                <td>
                    <el-radio-group v-model="apply.payType" >
                        <el-radio :label="item.codeValue" disabled v-for="item in payTypeData">{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
                <td><em>*</em>紧急程度</td>
                <td class="blueFont">
                    <el-radio-group v-model="apply.urgentLevel" >
                        <el-radio :label="item.codeValue" disabled v-for="item in urgentLevelData" >{{ item.codeName }}</el-radio>
                    </el-radio-group>
                </td>
                <td>预计到达时间</td>
                <td>
                    <el-date-picker v-model="apply.expectDate" disabled type="date" class="tl"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td><em>*</em>申请人</td>
                <td class="blueFont">
                    <el-input v-model="apply.applyUser" disabled type="text"></el-input>
                </td>
                <td><em>*</em>申请人部门</td>
                <td>
                    <el-input v-model="apply.applyUserOrg" disabled type="text"></el-input>
                </td>
                <td><em>*</em>申请日期</td>
                <td>
                    <el-date-picker v-model="apply.applyDate" disabled type="date" class="tl"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                </td>
            </tr>
            <tr>
                <td>是否预算内</td>
                <td>
                    <el-radio v-model="apply.isWithinBudget" disabled :label="item.codeValue" v-for="item in whetherData">{{ item.codeName }}</el-radio>
                </td>
                <td><em>*</em>采购类型</td>
                <td class="blueFont">
                    <el-select v-model="apply.purchaseType" disabled >
                        <el-option v-for="item in purchaseTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </td>
                <td><em>*</em>采购金额</td>
                <td>
                    <el-input v-model="apply.payFee" disabled v-mydoubleval class="tl"></el-input>
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
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(detail, index) in apply.detailList">
                            <td>
                                <el-input v-model="detail.name" disabled placeholder="费用项目名称"></el-input>
                            </td>
                            <td>
                                <el-input v-mydoubleval v-model="detail.fee" disabled  @input="calcFee" maxlength="100"  placeholder="请输入采购金额"></el-input>
                            </td>
                            <td>
                                <el-input v-model="detail.remark" disabled placeholder="采购原因"></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>采购原因描述</td>
                <td colspan="5">
                    <el-input v-model="apply.purchaseReason" disabled type="textarea"></el-input>
                </td>
            </tr>
            <tr>
                <td>采购询价描述</td>
                <td colspan="5">
                    <el-input v-model="apply.purchaseInquiry" disabled type="textarea"></el-input>
                </td>
            </tr>

            <tr >
                <td colspan="6" class="fw txt_c">评审记录（注意：当您评审时，应对以上审查事项重点核实，并对您的评审意见负责）</td>
            </tr>
            <tr >
                <td class="label">审核部门</td>
                <td class="label">审核人</td>
                <td class="label">审核日期</td>
                <td class="label" colspan="3">评审意见</td>
            </tr>
            <tr v-for="item in apply.reviewList" style="height: 30px;">
                <td class="label">{{ item.orgName}}</td>
                <td class="label blueFont">{{ item.userName }}</td>
                <td class="label blueFont">{{ item.reviewDate }}</td>
                <td class="label blueFont" colspan="3">{{ item.reviewRemark }}</td>
            </tr>

        </table>
        <div class="uploadFile clearfix" style="margin-top:20px;">
            <div class="fl mr_20 ml_10"  v-for="(item, index) in apply.list">
                <myFileModel :ref="'file' + index" :disabledEdit="true" :disabled-del="true" :componentId="index"></myFileModel>
                <p>只支持.jpg.png.pdf.xls.xlsx格式</p>
            </div>
        </div>
        <div class="bot-btn">
            <el-button @click="closePage(true)">关闭</el-button>
        </div>
    </div>
</template>

<script>
import purchaseApplyDetail from './purchaseApplyDetail.js'

export default purchaseApplyDetail
</script>
<style>
.blueFont {
    color: #0379FF;
}
</style>
<style lang="scss" src="../commonPurchaseApply.scss"></style>
