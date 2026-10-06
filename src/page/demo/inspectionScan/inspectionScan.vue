<template>
    <div id="inspectionScan" class="inspectionScanPage">
        <div class="common-info">
            <div class="scanInfo" @keydown.enter="doQuery">
                <div class="label">请扫码</div>
                <el-input class="text" placeholder="请扫设备二维码"></el-input>
            </div>
            <div class="scanTip">说明 ： 扫码后，自动跳转巡检明细界面</div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'inspectionScan',
    data() {
        return {

        }
    },
    
    mounted() {
        
    },
    methods:{
        doQuery(){
            console.log(1)
        }
    }
}
</script>
<style lang="scss" scoped>
.inspectionScanPage {
    .common-info{
        min-height: 100%;
        box-sizing: border-box;
    }
    .scanInfo {
        padding-top: 10vh;
        display: flex;
        align-items: center;
        justify-content: center;

        .label {
            font-size: 16px;
        }

        .text {
            font-size: 16px;
            border-radius: 3px;
            padding: 8px 12px;
            width: 300px;
            margin-left: 20px;
        }
    }
    .scanTip{
        text-align: center;
        margin-top: 50px;
        color: $main-color;
        font-size: 30px;
        line-height: 1;
    }
}
</style>