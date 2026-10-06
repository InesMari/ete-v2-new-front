<template>
    <div id="humitureLogPrintPy" class="humitureLogPrintPyPage">
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
                                <th width="100">时间</th>
                                <th width="80">日期</th>
                                <th v-for="item in info.datas" width="60">{{ item.day }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(time,i) in timeRanges">
                                <tr>
                                    <td rowspan="2">{{ time.timeRange }}</td>
                                    <td>温度°C</td>
                                    <td v-for="item in info.datas" width="60">{{ item['temperature'+(i+1)] }}</td>
                                </tr>
                                <tr>
                                    <td>湿度%RH</td>
                                    <td v-for="item in info.datas" width="60">{{ item['humidity'+(i+1)] }}</td>
                                </tr>
                            </template>
                            <tr>
                                <td colspan="2">白班记录人</td>
                                <td v-for="item in info.datas"></td>
                            </tr>
                            <tr>
                                <td colspan="2">夜班记录人</td>
                                <td v-for="item in info.datas"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tip">
                    <p>注：</p>
                    <p>1、仓库作业人员每2小时记录一次温湿度度记录表，记录人在对应的位置签名确认此记录需要保存1年。</p>
                    <p>2、当温度或湿度接近控制标准的上限时，记录人员立即通知班长调整货物区域。</p>
                    <p>3、温湿度标准范围：温度:1-28°C；温度:65%以下。</p>
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
import humitureLogPrintPy from './humitureLogPrintPy.js'

export default humitureLogPrintPy
</script>
<style lang="scss" scoped>
.humitureLogPrintPyPage {
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