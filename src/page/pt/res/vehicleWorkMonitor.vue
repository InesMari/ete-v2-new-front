<template>
    <div id="vehicleWorkMonitor" class="vehicleWorkMonitor">
        <div id="mapId" class="bm-view"></div>
    </div>
</template>

<script>
    import vehicleWorkMonitor from './vehicleWorkMonitor.js'
    export default vehicleWorkMonitor;
</script>
<style lang="scss">
.vehicleWorkMonitor{
    position: relative;
    height: 100%;
    border:$border;
    box-sizing: border-box;
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

  .textareaFocus{
    position: relative;
    z-index: 99;
    .el-textarea__inner {
      height: 60px!important;
      border: 1px solid #DCDFE6!important;
      box-sizing: border-box;
    }
  }
}
</style>
