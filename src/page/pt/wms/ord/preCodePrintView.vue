<template>
  <div id="codePrintView" class="codePrintViewPage">
    <div class="common-info">
        <div class="clearfix">
            <div class="item" v-for="item in codeList">
              <img :src="item.qrcodeFileUrl" alt="">
            </div>
        </div>
      <div class="bot-btn">
        <el-button @click="closePage">关闭</el-button>
        <el-button type="primary" @click="printCode">打印条码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import preCodePrintView from "./preCodePrintView.js";
export default preCodePrintView;

</script>
<style lang="scss" scoped>
.codePrintViewPage{
    /deep/ .item{
        width: 24%;
        padding: 10px 20px;
        box-sizing: border-box;
        border:$border;
        margin:0 0.5% 20px;
        float: left;
        img{
            width: 100%;
        }
        //p{
        //    line-height: 18px;
        //    text-align: center;
        //}
        .el-input__inner{
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
        .el-input__icon{
          line-height: 30px;
        }
    }
}
</style>