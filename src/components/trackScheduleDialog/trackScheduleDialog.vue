<template>
    <div id="trackScheduleDialog" class="trackScheduleDialogComponents">
        <el-dialog title="跟踪日志" :visible.sync="isshowSchedule" class="trackScheduleDialog" width="500px">
            <div class="topInfo"><span>供应商:{{orderShowData.supplierTenantName}}</span><span>中转单号:{{orderShowData.outgoingTrackingNum}}</span></div>
            <div class="trackSchedule">
                <ul class="trackList">
                    <li v-for="(data,index) in orderShowData.routes" :key="index"  :class="{'first':index == 0}">
                        <p>{{data.trackingDate}}</p>
                        <p>{{data.content}}</p>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import trackScheduleDialog from './trackScheduleDialog.js'
    export default trackScheduleDialog
</script>

<style lang="scss">
.trackScheduleDialogComponents{
    .trackScheduleDialog{
    .el-dialog__body{
      padding: 0;
      .topInfo{
        padding:0 20px 10px;
        border-bottom: $border;
        span{
          margin-right: 20px;
          font-weight: bold;
        }
      }
    }
    .trackSchedule{
        background: #fff;
        padding:10px 20px;
        .trackList{
            max-height: 400px;
            overflow-y:auto;
            position: relative;
            &::before,&::after{
                content: "";
                height: calc(100% - 60px);
                width: 1px;
                background: $border-color;
                position: absolute;
                left: 5px;
                top: 20px;
            }
            &::after{
                left:10px;
            }
            li{
                padding-left: 30px;
                position: relative;
                margin-bottom: 20px;
                z-index: 99;
                &::after{
                    content: '';
                    width:14px;
                    height: 14px;
                    border:$border;
                    border-radius: 50%;
                    position: absolute;
                    left: 0;
                    top:50%;
                    margin-top: -8px;
                    background: #fff;
                    z-index: 9;
                }
                &::before{
                    content: '';
                    width:8px;
                    height: 8px;
                    background:$border-color;
                    border-radius: 50%;
                    position: absolute;
                    left: 4px;
                    top:50%;
                    margin-top: -4px;
                    z-index: 99;
                }
            }
            li.first{
                &::before{
                    background: $tip-color;
                }
                &::after{
                    border-color: $tip-color;
                }
                p{
                    color:$tip-color;
                }
            }
        }
    }
  }
}
</style>