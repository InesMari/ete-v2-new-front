<template>
  <div id="codePrintView" class="codePrintViewPage">
    <div class="common-info">
        <div class="clearfix">
            <div class="item" v-for="item in codeList">
                <img :src="item.qrcodeUrl" alt="">
              <div v-if="!simpleFlag">
                <p style="text-align: center;font-size:9px;">物料编码：{{item.materialNum}}</p>
                <p style="text-align: center;font-size:9px;" v-if="item.produceDateShow">
                  <span style="margin-right:10px;">物料数量：{{item.nums}}</span>
                  <span>生产日期：{{ item.produceDateShow }}</span>
                </p>
                <p style="text-align: center;font-size:9px;" v-else>
                  <span>物料数量：{{item.nums}}</span>
                </p>
                <div style="text-align: center;">
                  <el-select v-model="item.selVal" placeholder="">
                    <el-option :label="'批次号：'+item.batchNum" :value="item.batchNum"></el-option>
                    <el-option :label="'供应商批次号：'+item.supplierBatchNum" :value="item.supplierBatchNum"></el-option>
                    <el-option :label="'ASN：'+item.asn" :value="item.asn"></el-option>
                  </el-select>
                </div>
              </div>
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
import codePrintView from "./codePrintView.js";
export default codePrintView;

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