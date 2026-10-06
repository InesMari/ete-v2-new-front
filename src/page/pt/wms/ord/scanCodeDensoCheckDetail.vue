<template>
    <div id="scanCodeDensoCheckDetail" class="scanCodeDensoCheckDetailPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <ul class="content clearfix mb_20">
                <li class="item">
                    <label class="label-term">看板标签：</label>
                    <div class="input-text">{{ info.kanbanCodeNum }}</div>
                </li>
                <li class="item">
                    <label class="label-term">供应商代码：</label>
                    <div class="input-text">{{ info.supplierId }}</div>
                </li>
                <li class="item">
                    <label class="label-term">物料代码：</label>
                    <div class="input-text">{{ info.partNo }}</div>
                </li>
                <li class="item">
                    <label class="label-term">批号：</label>
                    <div class="input-text">{{ info.batchNo }}</div>
                </li>
                <li class="item">
                    <label class="label-term">数量：</label>
                    <div class="input-text">{{ info.nums }}</div>
                </li>
                <li class="item">
                    <label class="label-term">包装箱号：</label>
                    <div class="input-text">{{ info.boxNo }}</div>
                </li>
                <li class="item">
                    <label class="label-term">物料编码：</label>
                    <div class="input-text">{{ info.materialNum }}</div>
                </li>
                <li class="item">
                    <label class="label-term">客户物料编码：</label>
                    <div class="input-text">{{ info.custMaterialNum }}</div>
                </li>
                <li class="item">
                    <label class="label-term">关联物料代码：</label>
                    <div class="input-text">{{ info.relMaterialNum }}</div>
                </li>
                <li class="item">
                    <label class="label-term">出库单号：</label>
                    <div class="input-text">{{ info.outOrderNum }}</div>
                </li>
                <li class="item">
                    <label class="label-term">创建人及时间：</label>
                    <div class="input-text">{{ info.createUserName }} {{ info.createDate }}</div>
                </li>
            </ul>
            <h3 class="common-title">
                <span class="title-name">产品标签明细</span>
                <el-button class="fr" type="primary" plain size="mini" v-entity="1005269" @click="downloadExcel">导出</el-button>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="100">序号</th>
                        <th>产品标签</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in info.materialCodeNumArr">
                        <td width="100">{{ index + 1 }}</td>
                        <td>{{ item }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div></template>

<script>
import scanCodeDensoCheckDetail from './scanCodeDensoCheckDetail.js'

export default scanCodeDensoCheckDetail
</script>
<style lang="scss">
.scanCodeDensoCheckDetailPage {
    .tableCommon {
        border: $border;

        .txt_c input {
            text-align: center;
        }
    }

    .common-info {
        .content>.item {
            width: 31.33%;

            &:first-child {
                width: 64.66%;
            }
        }
    }
}
</style>