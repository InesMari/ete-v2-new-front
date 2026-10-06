<template>
    <div id="mapTrack" class="mapTrackPage">
        <!-- <el-dialog title="百度地图" :visible.sync="isShow" :destroy-on-close="false" width="90%" @close="cancelMap" :modal="modal"> -->
            <div class="map-popup clearfix">
                <div class="search-info fl">
                    <div class="label">超速标记</div>
                    <div class="value">
                        <el-select v-model="speedMark" placeholder="选择超速标记" @change="changeCS">
                            <el-option v-for="item in speedMarks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="label">停留标记</div>
                    <div class="value">
                        <el-select v-model="stayMark" placeholder="选择停留标记" @change="changeTL">
                            <el-option v-for="item in stayMarks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="player fl">
                    <div class="playBtn" v-show="!isPlay" @click="play"></div>
                    <div class="pauseBtn" v-show="isPlay" @click="pause"></div>
                    <div class="map-progress">
                        <div class="play-distance">
                            <el-slider v-model="distancePlan" @change="distanceMove" :disabled="!isPlay"></el-slider>
                        </div>
                        <div class="clearfix">
                            <div class="time">{{currentDate}}</div>
                            <div class="play-speed">
                                速度： <el-slider v-model="speed" @change="changeSpeed" :disabled="!isPlay"></el-slider>
                            </div>
                        </div>
                    </div>
                    <div class="refresh" @click="reset">
                        <img class="i_1" src="@/static/image/refresh.png" alt="">
                        <img class="i_2" src="@/static/image/refresh2.png" alt="">
                    </div>
                </div>
                <div class="info fl">
                    <div class="distance">
                        <span style="margin-right:20px;">总里程：{{waybillMap.distance}}</span><span>速度：{{currentSpeed}}km/h</span>
                    </div>
                    <div class="arriveTime" v-if="waybillMap.isShowExcept==1">预计{{waybillMap.duration}}到达<em>{{waybillMap.nextWorkName}}</em></div>
                </div>
                <el-button :disabled="disabledExport" class="export fl" @click="exportExcel">导出</el-button>
            </div>
            <!-- 地图 -->
            <div id="mapTrackComponent" class="bm-view"></div>
        <!-- </el-dialog> -->
    </div>
</template>

<script>
    import mapTrack from './mapTrack.js'
    export default mapTrack;
</script>
<style lang="scss" src="./mapTrack.scss"></style>
