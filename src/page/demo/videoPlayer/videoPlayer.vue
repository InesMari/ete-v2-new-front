<template>
    <div class="videoPlayerPage" :class="{'fullScreen':isFullScreen}">
        <div class="playerView" id="player"></div>
        <div class="control">
            <!-- 切换模式 -->
            <el-select size="mini" v-model="info.videoType" style="margin-right: 20px;">
                <el-option label="直播" value="1"></el-option>
                <el-option label="录像" value="2"></el-option>
            </el-select>
            <!-- 选择时间 -->
            <el-date-picker size="mini" style="margin-right: 20px;" v-if="info.videoType == 2" v-model="info.timeRange" type="datetimerange" range-separator="至" suffix-icon="el-icon-date"
                value-format="yyyy-MM-dd HH:mm:ss" unlink-panel start-placeholder="开始时间" end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <div style="margin-left: auto;">
                <!-- 下载 -->
                <el-button size="mini" v-if="info.videoType == 2" type="primary" icon="el-icon-download" @click="download">下载</el-button>
                <!-- 全屏 -->
                <el-button size="mini" type="primary" icon="el-icon-full-screen" @click="play">{{ isFullScreen?'退出全屏':'全屏' }}</el-button>
                <!-- <input type="button" @click="play" value="play" /> -->
            </div>
        </div>
    </div>
</template>
  

<script>
import videoPlayer from './videoPlayer.js'
export default videoPlayer;
</script>

<style lang="scss" scoped>
.videoPlayerPage {
    position: relative;
    background-color: #fff;
    &.fullScreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
    }
    .playerView{
        height: 100%;
        width: 100%;
    }
    .control{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }
}
</style>
