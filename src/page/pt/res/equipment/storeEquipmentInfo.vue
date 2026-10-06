<template>
    <div id="storeEquipmentInfo" class="storeEquipmentInfoPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>仓库名称</td>
                    <td class="value">
                        <el-select v-model="info.workId" filterable clearable :disabled="isOnlySee">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>供应商名称</td>
                    <td class="value">
                        <el-select v-model="info.tenantId" placeholder="请选择供应商" filterable clearable
                                   :disabled="isOnlySee" @change="changeTenant">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>使用起始日</td>
                    <td class="value">
                        <el-date-picker v-model="info.beginUseDate" type="datetime" :disabled="isOnlySee"
                                           @input="changeBeginUseDate" align="right" :picker-options="limitPickerOptions"
                                           format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期时间" >
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>采购类型</td>
                    <td class="value">
                        <el-select v-model="info.equipmentPurchaseType" :disabled="isOnlySee" @change="calc" placeholder="请选择采购类型">
                            <el-option v-for="item in equipmentPurchaseTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>设备名称</td>
                    <td class="value">
                        <el-input v-model="info.equipmentName" placeholder="请输入设备名称" :disabled="isOnlySee"></el-input>
                    </td>
                    <td class="label">使用结束日</td>
                    <td class="value">
                        <el-date-picker v-model="info.endUseDate" type="datetime" disabled
                                        placeholder="请选择日期时间" align="right" :picker-options="limitPickerOptions"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{ info.equipmentPurchaseType == 1 ? '折旧' : '租赁'}}月份数</td>
                    <td class="value">
                        <el-input v-model="info.month" v-mynumval @input="changeMonth" :disabled="isOnlySee" placeholder="请输入月份数"></el-input>
                    </td>
                    <td class="label"><em>*</em>税率</td>
                    <td class="value">
                        <el-input v-model="info.tax" v-mydoubleval :disabled="isOnlySee" placeholder="请输入税率"></el-input>
                    </td>
                    <td class="label">规格型号</td>
                    <td class="value">
                        <el-input v-model="info.model" placeholder="请输入规格型号" :disabled="isOnlySee"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">设备类别</td>
                    <td class="value">
                        <el-select v-model="info.equipmentType" filterable clearable :disabled="isOnlySee"
                                   @change="changeContract">
                            <el-option v-for="item in equipmentTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">设备序列号</td>
                    <td class="value">
                        <el-input v-model="info.equipmentNum" :disabled="isOnlySee" placeholder="请输入设备序列号"></el-input>
                    </td>
                    <td class="label">存放地点</td>
                    <td class="value">
                        <el-input v-model="info.siteUse" :disabled="isOnlySee" placeholder="请输入存放地点"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">合同编号</td>
                    <td class="value">
                        <el-select v-model="info.contractId" filterable clearable :disabled="isOnlySee"
                                   @change="changeContract">
                            <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum"
                                       :value="item.id">
                                <span style="float: left">{{ item.contractNum }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}</span>
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label">设备类型</td>
                    <td class="value">
                        <el-select v-model="info.equipmentClassType" filterable clearable :disabled="isOnlySee"
                                   @change="changeContract">
                            <el-option v-for="item in equipmentClassTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">备注</td>
                    <td class="value">
                        <el-input v-model="info.remark" :disabled="isOnlySee" placeholder="说点什么?"></el-input>
                    </td>
                </tr>
            </table>

            <h3 class="common-title"><span class="title-name">其他信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <!--                购买的-->
                <tr v-show="info.equipmentPurchaseType == 1">
                    <td class="label"><em>*</em>购买数量</td>
                    <td class="value">
                        <el-input v-model="info.count" placeholder="请输入数量" @input="calc" disabled></el-input>
                    </td>
                    <td class="label"><em>*</em>含税购买单价(元/台)</td>
                    <td class="value">
                        <el-input v-model="info.price" placeholder="请输入单价" @input="calc" :disabled="isOnlySee"></el-input>
                    </td>
                    <td class="label"><em>*</em>含税总金额</td>
                    <td class="value">
                        <el-input v-model="info.totalFee" disabled></el-input>
                    </td>
                </tr>
                <tr v-show="info.equipmentPurchaseType == 1">
                    <td class="label"><em>*</em>含税月平均费用</td>
                    <td class="value">
                        <el-input v-model="info.monthFee" disabled></el-input>
                    </td>
                </tr>
                <!--                购买的-->

                <!--                租赁的-->
                <tr v-show="info.equipmentPurchaseType == 2">
                    <td class="label"><em>*</em>租赁数量</td>
                    <td class="value">
                        <el-input v-model="info.count" placeholder="请输入数量" @input="calc" disabled></el-input>
                    </td>
                    <td class="label"><em>*</em>含税租赁单价(元/月/台)</td>
                    <td class="value">
                        <el-input v-model="info.price" placeholder="请输入单价" @input="calc" :disabled="isOnlySee"></el-input>
                    </td>
                    <td class="label"><em>*</em>含税每月租赁总金额</td>
                    <td class="value">
                        <el-input v-model="info.monthFee" disabled></el-input>
                    </td>
                </tr>
                <tr v-show="info.equipmentPurchaseType == 2">
                    <td class="label">押金</td>
                    <td class="value">
                        <el-input v-model="info.deposit" v-mydoubleval @input="calc" :disabled="isOnlySee" placeholder="请输入押金"></el-input>
                    </td>
                    <td class="label">违约金</td>
                    <td class="value">
                        <el-input v-model="info.liquidatedDamages" v-mydoubleval @input="calc" :disabled="isOnlySee" placeholder="请输入违约金"></el-input>
                    </td>
                    <td class="label"><em>*</em>含税总租金</td>
                    <td class="value">
                        <el-input v-model="info.totalFee" disabled></el-input>
                    </td>
                </tr>
                <!--                租赁的-->
            </table>

            <h3 class="common-title" style="margin-bottom: 10px;"><span class="title-name">附件信息</span></h3>
            <div class="clearfix">
                <div class="fl" style="margin-right: 20px;" v-for="(item, index) in list">
                    <myFileModel :ref="'file' + index" :componentId="index"
                                 :disabledEdit="disabledEdit"
                                 :disabledDel="disabledDel"
                                 @successCallback="successCallback"
                                 @delCallback="delCallback">
                    </myFileModel>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="saveOrUpdateWmsEquipmentPurchase" v-show="type != 0">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
	import storeEquipmentInfo from './storeEquipmentInfo.js'
	export default storeEquipmentInfo
</script>
<style lang="scss">
  @import '@/page/pt/ord/order.scss';
</style>
<style lang="scss">
.storeEquipmentInfoPage{
}
</style>
