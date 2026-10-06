<template>
  <div id="app">
    <div class="cellList">
      <div class="item">
        <div class="label">
          <span class="red">*</span><span class="title-lable">相关标识</span>
          <input v-model="tag" class="cellIpt" type="text" placeholder="请输入相关标识，例如：9月份成都区域考勤"/>
        </div>
      </div>

      <div class="upload-show">
        <input type="file" @change="chooseFile" :value="inputFile">
        <img class="icon" src="@/images/xls.png" alt="" />
        <div class="title">点击上传excel文件</div>
        <div class="tip">支持扩展名：.xls 或 .xlsx</div>
      </div>

    </div>
    <div class="xslList" v-show="showPorgress">
      <div class="item">
        <div class="filename">
          <img class="icon" src="@/images/accessory.png" alt=""/>
          {{filename}}
          <span class="closeIcon" @click="delFile"></span>
        </div>
        <div class="progress">
          <div class="progressing" :class="porgress100?'porgress100':''"></div>
        </div>
      </div>

    </div>

    <div class="footerBtn">
      <button @click="uploadFile">确认上传并解析</button>
    </div>
    <div class="popup" v-if="isshowAlert" @click="isshowAlert = false">
      <div class="content">{{errorText}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import CryptoJS from './utils/sha.js'
export default {
  name: 'app',
  data() {
    return {
      showPorgress:false,
      porgress100:'',
      file:'',
      filename:'',
      tempFilePaths:'',
      tag:'',
      inputFile:"",
      isshowAlert:false,
      errorText:"",
    }
  },
  mounted() {
    console.log(wx);
    let search = window.location.search.replace('?','');
    let arr = search.split('=');
    this[arr[0]] = arr[1];
  },
  methods: {
    // 选择文件
    chooseFile(e){
      this.file = e.target.files[0];
      this.filename = this.file.name;
      this.showPorgress = true;
      let _this = this;
      let timer = setTimeout(() => {
        _this.porgress100 = 'porgress100';
        clearTimeout(timer)
      }, 500);
    },
    // 删除文件
    delFile(){
      this.file = '';
      this.showPorgress = false;
      this.porgress100 = '';
      this.inputFile = '';
    },
    // 上传文件
    uploadFile(){
      if(!this.file){
        // alert('请先选择文件');
        this.isshowAlert =  true;
        this.errorText = '请先选择文件';
        return;
      }
      let intfKey = "F08eEGe2TuMIeS9Lc123X0w6EB3D3881"
      let inParam = {}
      inParam.appId = "WEB";
      inParam.beanName = "attendanceServiceImpl";
      inParam.method = "uploadAttendanceData";
      inParam.time = new Date().getTime().toString();
      inParam.rd = Math.round(Math.random() * 1000).toString();
      inParam.content = {tag:this.tag};
      inParam.inCode = '';
      // inParam.tokenId = 'WECHATtg1ziEbmv%21%21AGr4YWo6SFR%21Uq6cwHVdn';
      inParam.tokenId = window.location.search.replace("?","").split("=")[1];
      inParam.tokenId = decodeURI(inParam.tokenId);
      let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
      let str = "[";
      for (let item of paramArray) str += (item + ', ');
      str = str.replace(/, $/, '');
      str += "]";
      inParam.sign = CryptoJS.SHA1(str).toString();

      let fd = new FormData();
      let that = this;
      fd.append('file', this.file);//传文件
      fd.append('json', JSON.stringify(inParam));
      let url = window.location.origin + '/api/intf';
      console.log(url);
      axios.post(url, fd).then(function (res) {
        console.log(res);
        if(res.data.status == '200'){
          // alert('上传成功')
          that.isshowAlert =  true;
          that.errorText = '上传成功';
          wx.miniProgram.redirectTo({
            url: `/clockingIn/clockList/clockList?id=${res.data.content.id}&isPushPage=${true}`,
          })
        }else{
          // alert(res.data.message)          
          that.isshowAlert =  true;
          that.errorText = res.data.message;
        }
      }).then(function (res) {
        console.log(res);
      });
    }
  },
}
</script>

<style lang="css">
@charset "UTF-8";

html{
  background:#f0f0f2;
}
html,body{
  height:100%;
}
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, button, select, option, textarea, p, blockquote, th, td {
  padding: 0px;
  margin: 0px;
  font: rem(28) "Microsoft YaHei","Arial";
  color: #333; 
}

.red{
  color: red;
}
.cellList{
  margin-top: 5px;
  padding: 0 10px;
}
.cellList .item{
  line-height: 44px;
  background: #fff;
  overflow: hidden;
  padding:0 15px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.cellList .item .label{
  font-weight: bold;
  font-size: 14px;
  float: left;
  width: 100%;
}
.cellList .item .content{
  float: right;
  color: #0379ff;
  font-size: 12px;
  font-weight: bold;
}
.cellList .item .title-lable{
  font-weight: normal;
  font-size: 12px;
  margin-right: 5px;
}
.cellIpt{
  width: calc(100% - 90px);
  border:1px solid #eee;
  border-radius: 3px;
  padding: 5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  font-size: 12px;
  font-weight: normal;
}
.upload-show{
  margin-top: 15px;
  height: 175px;
  border:1px dashed #eee;
  background: #fff;
  width: 100%;
  position: relative;
}
.upload-show input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 9;
}
.upload-show .icon{
  width: 50px;
  margin: 35px auto 25px;
  display: block  ;
}
.upload-show .title{
  font-size: 15px;
  text-align: center;
}
.upload-show .tip{
  font-size: 12px;
  color: #999;
  margin-top: 9px;
  text-align: center;
}

.xslList{
  margin-top: 15px;
  padding: 0 10px;
}
.xslList .item{
  padding-left: 15px;
  margin-bottom: 10px;
}
.xslList .item .filename{
  position: relative;
  color: #999;
  font-size: 12px;
  font-weight: bold;
}
.xslList .item .filename .icon{
  position: absolute;
  left: -15px;
  top: 2px;
  width: 10px;
}
.xslList .item .filename .closeIcon{
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  color: #999;
  &::after{
    content:"\2715";
  }
}
.xslList .item .progress{
  margin-top: 8px;
  background: #fff;
  border-radius: 50px;
  position: relative;
  height: 6px;
}
.xslList .item .progressing{
  position: absolute;
  z-index: 99;
  left: 0;
  top: 0;
  width: 0;
  background: #1990ff;
  border-radius: 50px;
  height: 6px;
  transition: all 1s;
}
.xslList .item .porgress100{
  width: 100%;
}
.footerBtn{
  position: fixed;
  height: 58px;
  text-align: center;
  bottom:0;
  left: 0;
  width: 100%;
  z-index: 9;
  background: #fff;
  padding:10px 15px;
  box-sizing: border-box;
  box-shadow: 0 0 2px rgba(0,0,0,0.15);
}
.footerBtn button{
  background: #e51c23;
  line-height: 37px;
  height: 38px;
  width: 100%;
  color: #fff;
  font-size: 16px;
  text-align: center;
  border:none;
  border-radius: 25px;
}
.popup{
  background: rgba(0,0,0,0.5);
  position: fixed;
  top:0;
  left: 0;
  height: 100%;
  width:100%;
  z-index: 9999;
}
.popup .content{
  font-size: 12px;
  position: absolute;
  width:70%;
  padding:12px;
  line-height: 24px;
  background: #fff;
  top: 50%;
  left:50%;
  transform: translate3d(-50%,-50%,0);
  border-radius: 5px;
  text-align: center;
}
</style>
