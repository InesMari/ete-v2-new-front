<template>
    <div id="deviceMonitor" class="deviceMonitorPage">
        <div class="map-popup-top">
            <el-input class="queryIpt fl" v-model="query.workName" placeholder="作业点名称查询" type="text"></el-input>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="doQuery()"></el-button>
        </div>
        <!-- 地图 -->
        <div id="mapId" class="bm-view"></div>
    </div>
</template>

<script>
    import deviceMonitor from './deviceMonitor.js'
    export default deviceMonitor;
</script>
<style lang="scss">
.deviceMonitorPage{
    position: relative;
    height: 100%;
    border:$border;
    box-sizing: border-box;
    .map-popup-top{
        position: absolute;
        top: 0;
        left:0;
        z-index: 99;
        width:100%;
        padding: 5px 10px;
        border-bottom: $border;
        box-sizing: border-box;
        background: rgba(255,255,255,0.8);
        .el-select{
            width: 100px;
            margin-left: 20px;
        }
        .queryIpt{
            width: 150px;
        }
        .el-input__inner{
            height: 30px;
        }
        .el-button{
            padding:7px 10px;
            margin-left: 20px;
        }
    }
    .map-popup-bottom{
        position: absolute;
        bottom: 0;
        left:0;
        z-index: 99;
        width:100%;
        border-top: $border;
        background: #fff;
        box-sizing: border-box;
        .item{
            float: left;
            line-height: 40px;
            font-size: 12px;
            padding:0 30px 0 20px;
            position: relative;
            >span{
                font-weight: bold;
                margin-left: 20px;
            }
            &.all{
                color:#fff;
                background: red;
            }
            &::before{
                content:"";
                position: absolute;
                right: 0;
                top:8px;
                border-right: $border;
                height: 24px;
            }
            &.all::before{
                display: none;
            }
        }
    }
    .bm-view{
        height: 100%;
        width: 100%;
    }
}
</style>
