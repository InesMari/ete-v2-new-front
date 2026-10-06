<template>
    <div class="videoPlayerPage" :class="{ 'fullScreen': isFullScreen }">
        <div class="videoHeader">{{ videoData.name }}监控
            <div class="iconList fr">
                <!-- <img class="icon" src="@/static/image/video_icon_screen.png" title="截图">
                <img class="icon" src="@/static/image/video_icon_camera.png" title="录像">
                <img class="icon" v-show="false" src="@/static/image/video_icon_stop.png" title="录像"> -->
            </div>
        </div>
        <div class="playerView">
            <div id="player"></div>
            <div class="startBtn" @click="toLive" v-show="!isplay">
                <i class="el-icon-caret-right"></i>
            </div>
            <div class="tiemSelectView" v-show="showDialog">
                <div class="el-dialog__header"><span class="el-dialog__title">请选择回放日期</span></div>
                <div class="common-info" style="border:none;margin-top: 0;padding-bottom: 30px;">
                    <ul class="content clearfix" style="margin-top: 10px;">
                        <li class="item item100">
                            <label class="label-term" style="width: 60px;">回放日期</label>
                            <div class="input-text">
                                <!-- <el-date-picker size="mini" style="margin-right: 20px;" v-model="info.timeRange"
                                    type="datetimerange" range-separator="至" suffix-icon="el-icon-date"
                                    value-format="yyyy-MM-dd HH:mm:ss" unlink-panel start-placeholder="开始时间"
                                    end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker> -->
                                <el-date-picker size="mini" style="margin-right: 20px;" v-model="info.date"
                                    type="date" placeholder="请选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </li>
                    </ul>
                    <div class="page-bot-btn ">
                        <el-button size="mini" @click="closeDialog()">关闭</el-button>
                        <el-button type="primary" size="mini" @click="getReplay()">确认</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="playback-container" v-show="!islive">
            <div class="video-time" id="timeMoveParentView">
                <div class="time-markers" id="timeMoveView" :style="{ left: moveLeft + 'px' }">
                    <span v-for="item in timeScale" :key="item.time" :style="{ left: item.progress }" class="time-marker">{{
                        item.time }}</span>
                    <div class="videoTimes" v-for="(item,index) in videoTimes" :key="index" :style="{left: item.left, width: item.width}"></div>
                </div>
                <div class="cursor" :style="{ left: cursorPoi + 'px' }"></div>
            </div>
        </div>
        <div class="control">
            <div class="iconList" style="margin-left: auto;">
                <img v-show="!islive" class="icon" src="@/static/image/video_icon_live.png" title="直播" @click="toLive">
                <img v-show="islive" class="icon" src="@/static/image/video_icon_replay.png" title="回放" @click="toReplay">
                <img class="icon" src="@/static/image/fullScreen_white.png" title="全屏" @click="fullScreen">
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

        .playerView {
            height: calc(100% - 148px);
        }
    }

    .videoHeader {
        background: #3d3d3d;
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        color: #fff;
    }

    .playerView {
        height: 320px;
        width: 100%;
        background-color: #000;
        position: relative;

        .startBtn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            font-size: 40px;
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            z-index: 99;
            border-radius: 50%;
            cursor: pointer;
        }

        #player {
            width: 100%;
            height: 100%;
        }
    }

    .control {
        height: 50px;
        background: #3d3d3d;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        position: relative;
        z-index: 9;
    }

    .iconList {
        height: 100%;
        display: flex;
        align-items: center;

        .icon {
            width: 20px;
            height: 20px;
            margin-left: 15px;
            cursor: pointer;
        }
    }

    .tiemSelectView {
        position: absolute;
        width: 300px;
        top: 10%;
        left: 50%;
        background: #fff;
        transform: translateX(-50%);
        z-index: 999;

        /deep/ .content {
            .el-date-editor {
                width: 100%;
            }
        }
        .page-bot-btn{
            padding-right: 0;
        }
    }

    .playback-container {
        width: 100%;
        position: relative;
        padding: 0 30px;
        box-sizing: border-box;
        background-color: #333;
        height: 50px;
        overflow: hidden;

        .video-time {
            position: relative;
            height: 100%;

            .cursor {
                position: absolute;
                width: 2px;
                height: 100%;
                top: 0;
                left: 0;
                background: #fff;
                box-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
                pointer-events: none;
            }
        }

        .time-markers {
            height: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            position: relative;
            min-width: 3000px;
            cursor: pointer;

            .time-marker {
                white-space: nowrap;
                color: #ddd;
                transform: translateX(-50%);
                position: absolute;
                top: 9px;
                pointer-events: none;
                user-select: none;
                z-index: 99;

                &::after {
                    content: "";
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    width: 1px;
                    height: 9px;
                    background-color: #ddd;
                }
            }
        }

        .videoTimes{
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 100%;
            background: rgba(29, 136, 228, 0.5);
            pointer-events: none;
        }

        .progress-track {
            position: absolute;
            width: 100%;
            height: 100%;
            position: relative;
        }


        .time-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 5px;
            border-radius: 3px;
            display: none;
        }
    }

}</style>
