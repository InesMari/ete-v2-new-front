<template>
    <div id="inventoryDetail">
        <div class="common-info flex">
            <h3 class="common-title"><span class="title-name">在库地信息</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term">库存地：</label>
                    <div class="input-text">{{ info.workName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">供应商名称：</label>
                    <div class="input-text">{{ info.supplierName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">采购单号：</label>
                    <div class="input-text"><a href="javascript:void(0);" class="link"
                                               @click.stop="toPurOrder(info)">{{ info.purchaseNum }}</a></div>
                </li>
                <li class="item item50">
                    <label class="label-term">采购类型：</label>
                    <div class="input-text">{{ info.purchaseTypeName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">调拨单号：</label>
                    <div class="input-text">{{ info.transferOrderNum }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">供应商合同号：</label>
                    <div class="input-text"><a href="javascript:void(0);" class="link"
                                               @click.stop="toContract(info)">{{ info.contractNum }}</a></div>
                </li>
            </ul>

            <h3 class="common-title"><span class="title-name">在库物品信息</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term">物品种类：</label>
                    <div class="input-text">{{ info.feeSubTypeName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">品名：</label>
                    <div class="input-text">{{ info.projectName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">规格型号：</label>
                    <div class="input-text">{{ info.specification }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">数量单位：</label>
                    <div class="input-text">{{ info.unit }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">品名附件：</label>
                    <div class="input-text uploadFile clearfix">
                        <img class="img" v-for="item in info.fileList" :src="item.url" @click="seeBigImg(item.url)"
                             alt="">
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">品名备注：</label>
                    <div class="input-text">{{ info.baseRemark }}</div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">在库数量：</label>
                    <div class="input-text">{{ info.nums }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">付款类型：</label>
                    <div class="input-text">{{ info.payTypeName }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">增值税：</label>
                    <div class="input-text">{{ info.addValueTax }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">含税单价：</label>
                    <div class="input-text">{{ info.actualPrice }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">含税金额：</label>
                    <div class="input-text"><em>{{ info.totalFee }}</em></div>
                </li>
                <li class="item item50">
                    <label class="label-term">租赁/折旧/分期月份数：</label>
                    <div class="input-text">{{ info.depreciationMonthCount }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">开始计费日期：</label>
                    <div class="input-text">{{ info.chargeDate }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">结束计费日期：</label>
                    <div class="input-text">{{ info.chargeDateEnd }}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">残值：</label>
                    <div class="input-text"><em>{{ info.scrapFee }}</em></div>
                </li>
                <li class="item item50">
                    <label class="label-term">累计产生成本：</label>
                    <div class="input-text"><em>{{ info.payFee }}</em></div>
                </li>
            </ul>

            <h3 class="common-title"><span class="title-name">领用信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="70">固定资产编号</th>
                        <th width="70">领用数量</th>
                        <th width="70">领用部门</th>
                        <th width="70">领用人</th>
                        <th width="70">领用时间</th>
                        <th width="70">领用备注</th>
                        <th width="70">是否归还</th>
                        <th width="70">固定资产标识卡</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in info.consumingList" :key="index">
                        <td>{{item.stockNum}}</td>
                        <td>{{item.useNums}}</td>
                    <td>{{item.useOrgName}}</td>
                    <td>{{item.useUserName}}</td>
                      <td>{{item.useDate}}</td>
                      <td>{{item.useRemark}}</td>
                        <td>{{item.stsName}}</td>
                    <td>
                            <a href="javascript:void(0);" class="link" @click="showImg(item)"
                               style="margin: 0 10px;" >查看</a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <fileViewer ref="viewer2" :url-list="[bigImageUrl]"></fileViewer>
    </div>
</template>

<script>
import inventoryDetail from './inventoryDetail.js'

export default inventoryDetail
</script>
<style lang="scss" scoped>
#inventoryDetail {
    height: auto !important;;

    /deep/ .common-info {
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;

        .tableCommon {
            border: $border;
        }

        .label-term {
            height: 30px;
            width: 135px;
        }

        .input-text {
            line-height: 30px;
        }
    }

    .uploadFile {
        img {
            width: 110px;
            height: 80px;
            border-radius: 5px;
            overflow: hidden;
            float: left;
            margin-right: 20px;
            float: left;
        }
    }
}
</style>