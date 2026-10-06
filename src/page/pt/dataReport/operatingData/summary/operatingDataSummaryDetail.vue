<template>
    <div id="operatingDataSummaryDetail" class="operatingDataDetailPage">
        <div class="common-info">
            <div class="detailTitle">{{info.year}}年- 数据汇总表</div>
            <div class="table_height mt_20">
                <table ref="table" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="200">项目名称</th>
                            <th v-for="(hd,hdIdx) in head" :width="hd.width ? hd.width : 100" v-show="hdIdx<12" style="padding:5px">
                                <div>{{ hd.name }}</div>
                            </th>
                            <th width="100">合计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in projectNames">
                            <td width="200" :colspan="item.isTitle?14:1" :class="item.isTitle?'title':''">{{ item.name }}</td>
                            <template v-if="!item.isTitle">
                                <td v-for="(hd,hdIdx) in head" :width="hd.width ? hd.width : 100">
                                    {{ hd[item.code] | permill}}
                                </td>
                                <td width="100">{{ info.values.month99[item.code] | permill}}</td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="exportExcel" v-entity="1007176">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import operatingDataSummaryDetail from './operatingDataSummaryDetail.js'
export default operatingDataSummaryDetail
</script>
<style lang="scss" scoped src="../operatingDataDetail.scss"></style>