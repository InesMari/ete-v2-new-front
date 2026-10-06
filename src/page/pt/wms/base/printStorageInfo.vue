<template>
    <div id="printStorageInfo">
        <div class="common-info">
            <div id="printTable">
                <img :src="param.qrImgPath" alt="" width="100%" height="100%">
                <ul class="content clearfix" style="padding:0 12px;">
                    <li class="item item100">
                        <div style="text-align:center;">
                            <p style="width: 32%;float: left;font-size: x-large;">库区：{{param.reservoirName}}</p>
                            <p style="width: 50%;float: left;">&nbsp;</p>
                            <p style="float: left;font-size: x-large;">库位：{{param.storageCode}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="printCode">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import printStorageInfo from './printStorageInfo.js'
export default printStorageInfo
</script>
<style lang="scss" scoped>
#printStorageInfo{

}
</style>
