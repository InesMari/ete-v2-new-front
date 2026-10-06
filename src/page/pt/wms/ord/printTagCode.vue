<template>
    <div id="printTagCode" class="printTagCode">
        <!-- 下一步 -->
        <div class="common-info">
            <div class="tip">打印的标签纸大小宽*高：80mm * 100mm</div>
            <div id="printView" class="codeList clearfix">
                <div class="codeItem" v-for="item in materialCodeList" @click="changeSelect(item)">
                    <div class="shade" v-if="item.sts == 0 && type == 1"><i class="el-icon-circle-close"></i></div>
                    <el-checkbox v-model="item.ischecked">{{ "" }}</el-checkbox>
                    <div class="title">ETE物料标签</div>
                    <div class="tagId">{{item.codeNum}}</div>       
                    <div class="oldTagId"><span v-show="item.parentCodeNum">旧：{{item.parentCodeNum}}</span></div>    
                    <div v-show="item.mark==1||item.mark==2" class="mark" :class="item.mark==1?'':'out'">{{ item.mark == 1 ? '留' : '出' }}</div>
                    <img class="logo" src="@/static/image/logo3.png" alt="">
                    <img class="code" :src="item.qrcodeFileUrl" alt="">
                    <div class="item">
                        <label class="label">批次号：</label>
                        <div class="text">{{item.batchNum}}</div>
                    </div>
                    <div class="item">
                        <label class="label">物料编码：</label>
                        <div class="text">{{item.materialNum}}</div>
                    </div>
                    <div class="item">
                        <label class="label">供应商批次：</label>
                        <div class="text">{{item.supplierBatchNum}}</div>
                    </div>
                    <div class="item">
                        <label class="label">ASN：</label>
                        <div class="text">{{item.asn}}</div>
                    </div>
                    <div class="item">
                        <label class="label">数量：</label>
                        <div class="text">{{item.nums}} <span class="unit">{{ item.unitName }}</span></div>
                    </div>
                    <div class="item">
                        <label class="label">原数量：</label>
                        <div class="text">{{item.srcNums?item.srcNums:''}} <span class="unit" v-show="item.srcNums">{{ item.unitName }}</span></div>
                    </div>
                    <div class="item">
                        <label class="label">箱数：</label>
                        <div class="text">{{item.boxNums}}</div>
                    </div>
                    <div class="item">
                        <label class="label">是否尾数：</label>
                        <div class="text" :style="item.isRemainder==1?'color:red':''">{{item.isRemainderName}}</div>
                    </div>
                    <div class="item">
                        <label class="label">入库时间：</label>
                        <div class="text">{{item.createDate}}</div>
                    </div>
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
import printTagCode from './printTagCode.js'

export default printTagCode
</script>
<style lang="scss" src="./printTagCode.scss" scoped></style>

