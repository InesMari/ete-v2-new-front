<template>
    <div id="actualAudit">
        <div class="common-info">
            <div class="detailTitle">2025年【番禺物流基地(达道仓)】实绩汇总表</div>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">总收入：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">总成本：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">利润率：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">毛利率：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">管理费用：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">利润额：</td>
                    <td class="value">xxxxx</td>
                </tr>
            </table>

            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th rowspan="2" width="150">项目名称</th>
                        <th width="150">数据状态</th>
                        <th v-for="hd in monthData" :width="hd.width ? hd.width : 100">{{ hd.state ? hd.state : '暂无数据' }}
                        </th>
                        <th rowspan="2" width="100">合计</th>
                    </tr>
                    <tr>
                        <th width="150">数据月份</th>
                        <th v-for="hd in monthData" :width="hd.width ? hd.width : 100">{{ hd.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in projectNames">
                        <td width="150" colspan="2">{{ item.name }}</td>
                        <td v-for="hd in monthData" :width="hd.width ? hd.width : 100">
                            <el-input v-model="hd[item.code]" placeholder="请输入"></el-input>
                        </td>
                        <td width="100">{{ item.total }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="createView">
                <span>创建人：xxxx</span>
                <span>创建时间：xxxxx</span>
            </div>

            <div class="page-bot-btn">
                <el-button>关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import actualAudit from './actualAudit.js'
export default actualAudit
</script>
<style lang="scss" scoped>
#actualAudit {
    .common-info {
        padding-top: 20px;
    }

    .detailTitle {
        line-height: 1.5;
        margin-bottom: 20px;
        font-size: 16px;
        text-align: center;
    }

    /deep/ .tableCommon {
        border: $border;

        .specTh {
            position: relative;
            overflow: hidden;
            background-color: #fff;
            border-bottom: $border;
            height: 100px;

            .container {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                padding: 10px;
                width: fit-content;
                position: relative;

                /* 为伪元素定位做准备 */
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    /* 绘制对角线，宽度和高度按需调整，这里简单示例 */
                    width: 100%;
                    height: 100%;
                    /* 用线性渐变绘制对角线，实际颜色等可调整 */
                    background: linear-gradient(to bottom right, transparent 49%, #ccc 49%, #ccc 51%, transparent 51%);
                    z-index: -1;
                    /* 让背景在文字下方 */
                }

                &>span {
                    // position: absolute;
                    text-align: left;
                    /* 给文字加背景色覆盖线条，避免文字和线条重叠看不清，颜色按需改 */
                    background-color: #fff;
                    padding: 0 5px;
                    /* 让文字和线条有间隔 */
                }
            }

            // .name {
            //     bottom: 10px;
            //     left: 10px;
            // }

            // .month {
            //     bottom: 10px;
            //     right: 10px;
            // }

            // .data {
            //     top: 10px;
            //     right: 10px;
            // }



            // &::after {
            //     content: '';
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     height: 1px;
            //     width: 150%;
            //     background-color: $border-color;
            //     transform: rotate(-30deg);
            //     transform-origin: left top;
            // }

            // &::before {
            //     content: '';
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     height: 1px;
            //     width: 150%;
            //     background-color: $border-color;
            //     transform: rotate(-60deg);
            //     transform-origin: left top;
            // }
        }

        .el-input__inner {
            text-align: center;
        }
    }

    .createView {
        text-align: right;

        span {
            margin-left: 80px;
            line-height: 40px;
            font-size: 14x;
        }
    }
}</style>

