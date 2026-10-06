<template>
    <div id="workOrderInfo" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>作业单号</td>
                    <td class="value">
                        <el-input v-model="order.orderNum" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>供应商</td>
                    <td class="value">
                        <el-input v-model="order.tenantName" disabled ></el-input>
                    </td>
                    <td class="label">仓库名称</td>
                    <td class="value">
                        <el-input v-model="order.workName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>作业名称</td>
                    <td class="value">
                        <el-input v-model="order.itemName" disabled></el-input>
                    </td>
                    <td class="label">费用类型</td>
                    <td class="value">
                        <el-input v-model="order.itemTypeName" disabled></el-input>
                    </td>
                    <td class="label">计费单位</td>
                    <td class="value">
                        <el-input v-model="order.unit" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>登记数量</td>
                    <td class="value">
                        <el-input v-model="order.num" disabled ></el-input>
                    </td>
                    <td class="label">登记时间</td>
                    <td class="value">
                        <el-input v-model="order.registerDate" disabled></el-input>
                    </td>
                    <td class="label"><em>*</em>登记状态</td>
                    <td class="value">
                        <el-input v-model="order.registerStateName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">确认人</td>
                    <td class="value">
                        <el-input v-model="order.confirmUserName" disabled></el-input>
                    </td>
                    <td class="label">确认时间</td>
                    <td class="value">
                        <el-input v-model="order.confirmDate" disabled></el-input>
                    </td>
                    <td class="label"><em>*</em>确认状态</td>
                    <td class="value">
                        <el-input v-model="order.confirmStateName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">未税金额</td>
                    <td class="value">
                        <el-input v-model="order.fee" disabled></el-input>
                    </td>
                    <td class="label">税率(%)</td>
                    <td class="value">
                        <el-input v-model="order.tax" disabled></el-input>
                    </td>
                    <td class="label">含税金额</td>
                    <td class="value">
                        <el-input v-model="order.feeWithTax" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>要求作业日期</td>
                    <td class="value">
                        <el-input v-model="order.requiredWorkDate" disabled></el-input>
                    </td>
                    <td class="label">创建时间</td>
                    <td class="value">
                        <el-input v-model="order.createDate" disabled></el-input>
                    </td>
                </tr>

            </table>
            <h3 class="common-title mt_20" v-show="type != 5">
                <span class="title-name">操作凭证</span>
            </h3>
            <div class="uploadFile clearfix" v-show="type != 5">
                <div class="fl mr_20" v-for="(item,index) in operaterCertificateList">
                    <myFileModel :ref="'file' + index" :componentId="index" disabled-del="true" disabled-edit="true"></myFileModel>
                    <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                </div>
            </div>
            <h3 class="common-title mt_20" v-show="type != 5">
                <span class="title-name">现场图片</span>
            </h3>
            <div class="uploadFile clearfix" v-show="type != 5">
                <div class="fl mr_20" v-for="(item,index) in scenePictureList">
                    <myFileModel :ref="'file2' + index" :componentId="index" disabled-del="true" disabled-edit="true"></myFileModel>
                    <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                </div>
            </div>

            <div class="bot-btn">
                <el-button @click="closePage" v-show="type != 5">关闭</el-button>
                <el-button type="primary" @click="print" v-show="type == 5">打印</el-button>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import workOrderInfo from './workOrderInfo.js'

	export default workOrderInfo
</script>
<style lang="scss">



</style>
