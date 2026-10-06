<template>
    <div id="inspectionPrintCode" class="inspectionPrintCode">
        <!-- 下一步 -->
        <div class="common-info">
            <div class="tip">打印的标签纸大小宽*高：80mm * 100mm</div>
            <div id="printView" class="codeList clearfix">
                <div class="codeItem" v-for="item in codeList" @click="changeSelect(item)">
                    <el-checkbox v-model="item.ischecked">{{ "" }}</el-checkbox>
                    <img class="code" :src="item.qrcodeFileUrl" alt="">
                    <div class="item">
                        <label class="label">设备名称：</label>
                        <div class="text">{{item.equipment}}</div>
                    </div>
                    <div class="item">
                        <label class="label">设备编号：</label>
                        <div class="text">{{item.equipmentNum}}</div>
                    </div>
                    <div class="num" v-if="item.equipmentIdx">{{ item.equipmentIdx }}</div>
                    <div class="equipmentNum" v-else>{{ item.equipmentNum }}</div>
                </div>  
            </div>
            
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
                <el-button type="success" @click="selectAll()">全选</el-button>
                <el-button type="primary" @click="print()">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import inspectionPrintCode from './inspectionPrintCode.js'

export default inspectionPrintCode
</script>
<style lang="scss" src="./inspectionPrintCode.scss" scoped></style>

