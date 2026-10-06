<template>
    <div id="transportOperatingDataDetail" class="operatingDataDetailPage">
        <div class="common-info">
            <div class="detailTitle">{{info.year}}年- ETE运输中心营收预实数据</div>
            <div class="table_height mt_20">
                <table ref="table" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="200" rowspan="2">项目名称</th>
                            <th v-for="(hd,hdIdx) in head" v-show="hdIdx<12" :width="hd.width ? hd.width : 100"><span :class="hd.verifySts == 0 ? 'link red':''" @click="toVerify(hd)">{{ hd.verifyStsName }}</span></th>
                            <th width="100" rowspan="2">合计</th>
                        </tr>
                        <tr>
                            <th v-for="(hd,hdIdx) in head" :width="hd.width ? hd.width : 100" v-show="hdIdx<12" style="padding:5px">
                                <div>{{ hd.name }}</div>
                                <div><a class="link" @click.stop="toDetail(hd.id)">详情</a><span v-if="hd.verifySts != 1" v-entity="1007178">&nbsp;|&nbsp;</span><a class="link" @click.stop="toFinanceDetail(hd.id)" v-if="hd.verifySts != 1" v-entity="1007178">调整</a></div>
                            </th>
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
                <el-button type="primary" @click="exportExcel" v-entity="1007159">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import transportOperatingDataDetail from './transportOperatingDataDetail.js'
export default transportOperatingDataDetail
</script>
<style lang="scss" scoped src="../operatingDataDetail.scss"></style>