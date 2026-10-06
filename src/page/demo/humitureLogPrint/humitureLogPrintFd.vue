<template>
    <div id="humitureLogPrintFd" class="humitureLogPrintFdPage">
        <div class="common-info">
            <div id="humitureLogPrintFdPrint">
                <div class="tableTitle">
                    <img src="@/static/image/logo.png">
                    <h3>xxxxx托盘车日常点检表</h3>
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
                                    <span class="fl">托盘车编号：SY-01</span>
                                    <span class="fr">巡检月份：2025-06</span>
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
                                <td v-for="hd in head" :width="hd.width">{{ item[hd.code] }}</td>
                            </tr>
                            <tr style="height:70px;">
                                <td class="txtLeft" colspan="4">点检人姓名：</td>
                                <td class="vertical" v-for="day in new Array(days)">欧阳震华</td>
                            </tr>
                            <tr>
                                <td class="txtLeft" colspan="4">备注：异常问题描述</td>
                                <td class="txtLeft" :colspan="days"></td>
                            </tr>
                            <tr>
                                <td class="txtLeft" colspan="4">
                                    <div>无异常：OK</div>
                                    <div>有异常：NG</div>
                                </td>
                                <td class="txtLeft" :colspan="days">电动托盘车管理负责人：杨康</td>
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
import humitureLogPrintFd from './humitureLogPrintFd.js'

export default humitureLogPrintFd
</script>
<style lang="scss" scoped>
.humitureLogPrintFdPage {
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