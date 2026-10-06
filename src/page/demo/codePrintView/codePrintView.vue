<template>
  <div id="codePrintView" class="codePrintViewPage">
    <div class="common-info">
        <div class="clearfix">
            <div class="item" v-for="item in new Array(10)">
                <img src="http://47.106.207.122:2080//group1/M00/00/09/rBKgRGMtcbCAIgs0AAA4poTFY8Y526.jpg?filename=qrcodeBar.jpg" alt="">
                <p>物料编码：MD-XTB-520-9999L<span style="margin-left:12px;">物料名称：汽车座椅骨架</span></p>
            </div>
        </div>
        <div class="bot-btn">
            <el-button>关闭</el-button>
            <el-button type="primary">打印条码</el-button>
        </div>
    </div>
  </div>
</template>

<script>

export default {
    name: 'codePrintView',
    data(){
        return{
                        
        }
    },
}
</script>
<style lang="scss" scoped>
.codePrintViewPage{
    .item{
        width: 24%;
        padding: 10px 20px;
        box-sizing: border-box;
        border:$border;
        margin:0 0.5% 20px;
        float: left;
        img{
            width: 100%;
        }
        p{
            line-height: 18px;
            text-align: center;
        }
    }
}
</style>