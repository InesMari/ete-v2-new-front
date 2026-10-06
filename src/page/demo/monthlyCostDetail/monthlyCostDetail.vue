<template>
    <div id="monthlyCostDetail" class="monthlyCostDetailPage">
        <div class="common-info">
            <h3 class="warehouseTitle">仓库月成本</h3>
            <div class="warehouseInfo clearfix">
                <div class="fl">xxxxx仓库</div>
                <div class="fr">2024-08</div>
            </div>

            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="60">序号</th>
                        <th width="150">成本大项</th>
                        <th width="150">成本费用</th>
                        <th width="150">供应商</th>
                        <th width="100">含税金额</th>
                        <th width="100">税率</th>
                        <th width="100">未税金额</th>
                        <th width="100">税金</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="2">1</td>
                        <td rowspan="2">配送费用</td>
                        <td>外租车成本</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                    </tr>
                    <tr>
                        <td>自有车成本</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                    </tr>
                    <tr>
                        <td rowspan="2">1</td>
                        <td rowspan="2">配送费用</td>
                        <td>外租车成本</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                    </tr>
                    <tr>
                        <td>自有车成本</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                        <td>xxxxxx</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  
<script>
// import monthlyCostDetail from './monthlyCostDetail.js'
// export default monthlyCostDetail
</script>
<style lang="scss" scoped>

.monthlyCostDetailPage {
    .warehouseTitle{
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }
    .tableCommon {
        border: $border;
    }
    .warehouseInfo{
        padding: 0 10px;
        &>div{
            line-height: 40px;
            font-size: 14px;
        }
    }
}
</style>
  