<template>
    <div id="vehicleMonitorTrack" class="vehicleMonitorTrackPage">
        <div class="map-popup-top">
            <label class="label-term" style="margin-left: 10px;">车牌号码：</label>
            <el-input class="queryIpt" v-model="query.plateNumber" type="text" size="mini"
                      style="height: 30px"
                      prefix-icon="el-icon-search"
                      autocomplete="new-password"
                      @input="$forceUpdate()"
                      placeholder="请输入车牌号查询">
            </el-input>
            <label class="label-term" style="margin-left: 10px;">起始日期：</label>
            <el-date-picker
                v-model="query.startDate"
                type="date"
                size="mini"
                style="width:150px;"
                placeholder="选择起始日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            <label class="label-term" style="margin-left: 10px;">结束日期：</label>
            <el-date-picker
                v-model="query.endDate"
                type="date"
                size="mini"
                style="width:150px;"
                placeholder="选择结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="!query.startDate"
                :picker-options="pickerOptions">
            </el-date-picker>

            <el-button type="primary" icon="el-icon-search" size="mini" @click="doQuery()"></el-button>
        </div>
        <!-- 地图 -->
        <map-track ref="mapTrack" :resetData="true"></map-track>
    </div>
</template>

<script>
import vehicleMonitorTrack from './vehicleMonitorTrack.js'

export default vehicleMonitorTrack;
</script>
<style lang="scss" scoped>
.vehicleMonitorTrackPage {
    position: relative;
    height: 100%;
    border: $border;
    box-sizing: border-box;

    .map-popup-top {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        padding: 5px 10px;
        border-bottom: $border;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.8);

        .el-select {
            width: 100px;
        }

        .queryIpt {
            width: 150px;
        }

        .el-input__inner {
            height: 30px;
        }

        .el-button {
            padding: 7px 10px;
            margin-left: 20px;
        }

        .el-input__icon {
            line-height: 30px;
        }

        .el-textarea__inner {
            height: 30px;
            //border:none;
            resize: none;
            line-height: 20px;

            &::placeholder {
                font-size: 12px;
                line-height: 24px;
            }
        }
    }

    /deep/ .mapTrackPage{
        margin-top: 41px;
        .map-popup {
            box-shadow: 0 5px 5px rgba(0, 0, 0, 0.4);
        }
    }

}
</style>
