<template>
    <div class="shareGift" id="shareGift">
      <div class="common-info flex">
        <div class="innerInfo">
            <ul class="content clearfix">
                <li class="item item100">
                    <label class="label-term"><em>*</em>礼品方案编码：</label>
                    <div class="input-text">{{ info.schemeNum }}</div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>礼品方案名称：</label>
                    <div class="input-text">{{ info.schemeName }}</div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>截止日期：</label>
                    <div class="input-text">{{ info.deadlineDate }}</div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>公司名称：</label>
                    <div class="input-text">
                        <el-input v-model="info.companyName" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>客户姓名：</label>
                    <div class="input-text">
                        <el-input v-model="info.customerName" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term">客户职位：</label>
                    <div class="input-text">
                        <el-input v-model="info.customerPosition" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term"><em>*</em>分享方案：</label>
                    <div class="input-text">
                        <el-select v-model="info.schemeSubId" filterable clearable :disabled="disabled"
                                   placeholder="请选择分享方案" @change="forceUpdate">
                            <el-option v-for="item in schemeSubData" :key="item.id" :label="item.schemeSubNameDesc"
                                       :value="item.id"></el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
            <div class="imgView">
              <img :src="info.bgImgUrl" alt="">
            </div>
          </div>
        <div class="bot-btn">
          <p style="line-height: 30px;font-size: 14px;margin-bottom: 12px;"><em>注: 礼品方案在生成二维码后 将不允许修改!</em></p>
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="generateShareQrCode" v-show="!showQeCode">生成二维码图片</el-button>
          <el-button type="primary" @click="reflush" v-show="showQeCode">清空信息生成下一张</el-button>
          <el-button type="primary" @click="downloadQrCode" v-show="showQeCode">下载二维码</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import shareGift from './shareGift.js'
    export default shareGift
  </script>
<style lang="scss" scoped>
  .shareGift {
    /deep/ .common-info{
      height: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
      .innerInfo{
        display: flex;
        .content{
            width: 50%;
        }
        .imgView{
            flex: 1;
            margin-left: 60px;
            img{
                width: 50%;
                max-width: 200px;
            }
        }
        .label-term{
            width: 100px;
        }
        .el-textarea__inner{
            width:100%;
            height: 86px;
        }
      }
    }
  }
  </style>