<template>
    <div id="humitureLogPrintFd" class="humitureLogPrintFdPage">
        <div class="common-info">
            <div id="printTable">
                <div class="tableTitle">
                    <img src="@/static/image/logo.png">
                    <h3>{{info.workName}}</h3>
                    <p style="text-align: center;">{{title}}</p>
                </div>
                <div class="tableBox">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th width="40">日期</th>
                                <template v-for="i in info.index">
                                    <th v-for="hd in head" :width="hd.width?hd.width:60">{{ hd.name }}</th>
                                </template>
                                <th width="60">记录员</th>
                                <th width="80">异常处理</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in info.datas">
                                <td>{{ item.day }}</td>
                                <template v-for="i in info.index">
                                    <td v-for="hd in head" :width="hd.width?hd.width:60">{{ item[hd.code+i] }}</td>
                                </template>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tip">
                    <p>注：各类仓库的温度、湿度要求如下：</p>
                    <p>1、普通仓温度要求：0'C&lt;温度≤40°C，湿度不管控。</p>
                    <p style="padding-left: 19px;">低温低湿仓温度要求：1°C≤温度≤28°C，湿度要求:5%≤湿度≤75%。</p>
                    <p style="padding-left: 19px;">冷藏仓温度要求：温度≤10°C，湿度不管控。</p>
                    <p style="padding-left: 19px;">溶剂仓1温度要求：1’C≤温度≤25’C，湿度不管控;溶剂仓2温度要求:1’C≤温度≤35'C，湿度不管控。</p>
                    <p>2、当温度或湿度接近控制标准的上限时，记录人员进行异常处理并通知主管或班长。</p>
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
            padding-bottom: 20px;

            img {
                position: absolute;
                height: 40px;
                left: 10px;
                top: 10px;
            }

            h3 {
                font-weight: bold;
                font-size: 20px;
                line-height: 40px;
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
        .tip{
            margin-top: 20px;
            p{

            }
        }
    }
}
</style>