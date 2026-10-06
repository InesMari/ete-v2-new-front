<template>
    <div id="rankChart" class="rankChart">
        <div class="item" v-for="(item,index) in list">
            <div class="title clearfix">
                <div class="label">
                    <i class="el-icon-medal-1" v-if="index == 0"></i>
                    <span class="num" v-else>{{ index+1}}</span>
                    {{ item[name] }}
                </div>
                <div class="value">{{ item[value] }}</div>
            </div>
            <div class="rate" :style="'width:'+item.rate+'%'"></div>
        </div>
    </div>
</template>

<script>
    import rankChart from './rankChart.js'
    export default rankChart
</script>

<style lang="scss" scoped>
.rankChart{
    .item{
        .title{
            padding: 15px 0 5px;
            .label{
                float: left;
                font-weight: bold;
                font-size: 14px;
                i{
                    font-size: 22px;
                    color: #adad00;
                    vertical-align: top;
                    margin-left: -3px;
                }
                span{
                    border: 1px solid #adad00;
                    font-size: 12px;
                    line-height: 1;
                    padding: 0 4px;
                    color: #adad00;
                    border-radius: 2px;
                    margin-right: 3px;
                }
            }
            .value{
                float: right;
                font-weight: bold;
                font-size: 14px;
            }
        }
        // 渐变颜色进度条
        .rate{
            width: 0;
            transition: all 1s;
            height: 10px;
            border:$border;
            background: linear-gradient(to right, #ffecee, #e70b1d);
        }
    }
}
</style>