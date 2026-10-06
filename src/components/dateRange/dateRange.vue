<template>
    <div id="dateRange">
        <div class="dateRangeIpt">
            <el-input v-model="dateRange" readonly="readonly" @click.native="showRangeDate" :placeholder="placeholder?placeholder:'请选择'"></el-input>
            <div class="rangeBox" v-show="showDateRange">
                <div class="rangeList">
                    <div class="dateList">
                        <div class="rangeItem" :class="date.active?'active':''" @click="selectDate(date)" v-for="(date,index) in dateArr" :key="index">{{date.name}}</div>
                    </div>
                    <div class="timeList">
                        <div class="rangeItem" :class="timeIndex==index?'active':''" @click="selectTime(index)" v-for="(time,index) in timeArr" :key="index">{{time}}</div>
                    </div>
                </div>
                <div class="rangeBtn">
                    <el-button  type="warning" class="btn" @click="cancelSel">取消</el-button>
                    <el-button  type="primary" class="btn" @click="sureSel">确认</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dateRange from './dateRange.js'
    export default dateRange
</script>

<style lang="scss" scoped>
#dateRange{
    .dateRangeIpt{
        position: relative;
        .rangeBox{
            border:$border;
            border-radius: 3px;
            position: absolute;
            top: 100%;
            left: 0;
            width: 300px;
            background: #fff;
            z-index: 999;
            .rangeList{                
                height: 200px;
                .dateList,.timeList{
                    height: 100%;
                    width: 50%;
                    overflow: auto;
                    float: left;
                    .rangeItem{
                        width: 100%;
                        line-height: 40px;
                        text-align: center;
                        border-bottom: $border;
                        cursor: pointer;
                        &:hover{
                            background: $hover-color;
                        }
                        &.active{
                            background: $focus-color;
                        }
                    }
                }
            }
            .rangeBtn{
                padding: 10px 0;
                border-top: $border;
                text-align: center;
                .el-button{
                    height: 30px;
                    width: 80px;
                    color:#fff!important;
                }
            }
        }
    }
}
</style>