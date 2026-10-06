<template>
    <div id="assetConsumingDetail">
        <div class="common-info flex " style="padding-top: 10px;">
            <h3 class="common-title"><span class="title-name">领用信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="70">领用数量</th>
                        <th width="150">领用部门</th>
                        <th width="120">领用人</th>
                        <th width="150">领用时间</th>
                        <th width="200">领用备注</th>
                        <th width="70">是否归还</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in consumingList" :key="index">
                        <td>{{item.useNums}}</td>
                        <td>{{item.useOrgName}}</td>
                        <td>{{item.useUserName}}</td>
                        <td>{{item.useDate}}</td>
                        <td>{{item.useRemark}}</td>
                        <td>{{item.stsName}}</td>
                    </tr>
                </tbody>
            </table>

<!--            <div class="bot-btn">-->
<!--                <el-button @click="closePage">关闭</el-button>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
import assetConsumingDetail from './assetConsumingDetail.js'

export default assetConsumingDetail
</script>
<style lang="scss" scoped>
#assetConsumingDetail {
    height: calc(100% - 60px);
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