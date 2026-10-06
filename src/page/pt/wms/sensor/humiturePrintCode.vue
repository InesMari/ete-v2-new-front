<template>
    <div id="humiturePrintCode" class="humiturePrintCode">
        <!-- 下一步 -->
        <div class="common-info">
            <div class="tip">打印的标签纸大小宽*高：80mm * 100mm</div>
            <div id="printable" class="codeList clearfix">
                <div class="codeItem codeInfo">
                    <img class="code" :src="info.qrcodeUrl" alt="">
                    <div class="item">
                        <label class="label">设备名称：</label>
                        <div class="text">{{info.name}}</div>
                    </div>
                    <div class="item">
                        <label class="label">设备编号：</label>
                        <div class="text">{{info.deviceAddress}}</div>
                    </div>
                </div>  
            </div>
            
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="print()">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import humiturePrintCode from './humiturePrintCode.js'

export default humiturePrintCode
</script>
<style lang="scss" src="./humiturePrintCode.scss" scoped></style>

