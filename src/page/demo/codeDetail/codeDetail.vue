<template>
  <div id="codeDetail" class="codeDetailPage">
    <div class="common-info" style="height:calc(100% - 90px);">
        <div class="clearfix">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTbale fl" style="width:50%">
                <tr>
                    <td class="label">条码编号：</td>
                    <td class="value">123</td>
                    <td class="label">在库数量：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">库区：</td>
                    <td class="value">123</td>
                    <td class="label">库位：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">物料编码：</td>
                    <td class="value">123</td>
                    <td class="label">入库日期：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">物料名称：</td>
                    <td class="value">123</td>
                    <td class="label">生产日期：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">物料规格：</td>
                    <td class="value">123</td>
                    <td class="label">ASN：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">供应商批次：</td>
                    <td class="value">123</td>
                    <td class="label">批次号：</td>
                    <td class="value">123</td>
                </tr>
                <tr>
                    <td class="label">所属货主：</td>
                    <td colspan="3" class="value">123</td>
                </tr>
                <tr>
                    <td class="label">到货厂商：</td>
                    <td colspan="3" class="value">123</td>
                </tr>
            </table>
            <div class="codeInfo fr">
                <div class="info">
                    <p>物料编码：aaaaaaaaa</p>
                    <p>物料名称：aaaaaaaaa</p>
                    <p>在库数量：aaaaaaaaa <span style="margin-left:20px;">是否位数：否</span></p>
                </div>
                <img src="http://47.106.207.122:2080//group1/M00/00/09/rBKgRGMtcbCAIgs0AAA4poTFY8Y526.jpg?filename=qrcodeBar.jpg" alt="">
            </div>
        </div>
    </div>
    <div class="bot-btn" style="margin-top: -80px!important;">
      <el-button>关闭</el-button>
      <el-button type="primary">打印条码</el-button>
    </div>
  </div>
</template>

<script>

export default {
    name: 'codeDetail',
    data(){
        return{
                        
        }
    },
}
</script>
<style lang="scss" scoped>
.codeDetailPage{
    .codeInfo{
        border:$border;
        padding: 10px 20px;;
        width: 48%;
        box-sizing: border-box;
        height: 290px;
        .info{
            padding: 0 25px;
            p{
                line-height: 30px;
                font-size: 14px;
            }
        }
        img{
            width: 100%;
            margin-top: 20px;
            height: 160px;
        }
    }
}
</style>