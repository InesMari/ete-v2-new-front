<template>
    <div id="inspectionDetail" class="inspectionDetailPage">
        <div class="common-info">
            <div id="inspectionDetailPrint">
                <div class="tableTitle">
                    <img src="@/static/image/logo.png">
                    <h3>{{ info.title}}</h3>
                </div>
                <div class="tableBox">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <!-- 分配每列宽度 -->
                        <colgroup>
                            <col width="40">
                            <col v-for="hd in head" :width="hd.width">
                        </colgroup>
                        <thead>
                            <tr class="tableTop">
                                <td colspan="4" style="text-align: center;">适用范围</td>
                                <td :colspan="days">
                                    <span class="fl">托盘车编号：{{ info.equipmentNum }}</span>
                                    <span class="fr">巡检月份：{{ info.inspectMonth }}</span>
                                </td>
                            </tr>
                            <tr>
                                <th width="40">序号</th>
                                <th v-for="hd in head" :width="hd.width">{{ hd.name }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData">
                                <td>{{ index + 1 }}</td>
                                <td v-for="hd in head" :width="hd.width" :style="item[hd.code]=='NG'?'color: red':''">{{ item[hd.code] }}</td>
                            </tr>
                            <tr style="height:70px;">
                                <td class="txtLeft" colspan="4">点检人姓名：</td>
                                <td class="vertical" v-for="(item, index) in new Array(days)">{{info['name'+(index+1)]}}</td>
                            </tr>
                            <tr>
                                <td class="txtLeft" colspan="4">备注：异常问题描述</td>
                                <td class="txtLeft" :colspan="days"></td>
                            </tr>
                            <tr>
                                <td class="txtLeft" colspan="4">
                                    <div class="fl mr_10">状态说明：</div>
                                    <div class="fl mr_10">无异常：OK</div>
                                    <div class="fl mr_10">有异常：NG</div>
                                    <div class="fl mr_10">待巡检：待</div>
                                    <div class="fl mr_10">超时未巡检：漏</div>
                                </td>
                                <td class="txtLeft" :colspan="days">{{ info.principalTips }}：{{ info.principalName }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bot-btn">
                <el-button type="default" @click="close">关闭</el-button>
                <el-button type="primary" @click="print">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import inspectionDetail from './inspectionDetail.js'

export default inspectionDetail
</script>
<style lang="scss" scoped>
.inspectionDetailPage {
    .common-info {
        min-height: 100%;
        box-sizing: border-box;
        padding-top: 20px;

        .tableBox {
            overflow: auto;
        }

        .tableTitle {
            position: relative;
            padding-bottom: 10px;

            img {
                position: absolute;
                height: 40px;
                left: 10px;
                top: 10px;
            }

            h3 {
                font-weight: bold;
                font-size: 20px;
                line-height: 60px;
                text-align: center;
                color: #000;
            }
        }

        .tableCommon {
            border: $border;

            .tableTop {
                background: none;

                td:first-child {
                    border-right: $border;
                }

                td {
                    height: 30px;
                    padding: 0 10px;
                    white-space:initial;
                }
            }

            .vertical {
                writing-mode: vertical-rl;
                letter-spacing: 2px;
            }

            .txtLeft {
                text-align: left;
                padding-left: 10px;

                div {
                    color: #333;
                }
            }
        }
    }
}</style>