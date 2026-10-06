<template>
    <div id="mapDialog" class="mapDialogPage">
        <el-dialog title="百度地图" :visible.sync="isShow" :destroy-on-close="false" width="90%" @close="cancelMap" :modal="modal">
            <div class="suggest">
                <input v-model="mapText" placeholder="请输入详细地址" :id="'suggestId'+name" v-show="!hideBtn"/>
                <div id="searchResultPanel"></div>
            </div>
            <div :id="name" class="bm-view"></div>
            <div class="page-bot-btn" style="padding:15px 0;margin:0 auto;" v-show="!hideBtn">
                <el-button type="primary" @click="sureMapSite" v-show="!showSure">确定</el-button>
                <el-button type="info" @click="cancelMap" v-show="!showCancel">取消</el-button>
                <el-button type="danger" @click="cleanMap" v-show="!showClear">清空</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mapDialog from './mapDialog.js'
    export default mapDialog;
</script>
<style lang="scss" src="./mapDialog.scss"></style>
