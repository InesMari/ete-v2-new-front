<template>
  <div id="forgetPassword" class="forgetPasswordPage">
    <img class="logo" src="@/static/image/logo_pt.png" alt="">
    <el-steps :active="active" :align-center="true">
      <el-step title="填写手机号码"></el-step>
      <el-step title="填写短信验证码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <div class="from">
      <!-- 第一步 -->
      <div class="item" v-show="active==0">
          <img class="icon" src="@/static/image/phone.png" alt="">
          <input type="text" v-model="userName" id="_userName" placeholder="手机号">
      </div>
      <!-- 第二步 -->
      <div class="item code clearfix" v-show="active==1">
          <img class="icon" src="@/static/image/msg.png" alt="">
          <input type="text" v-model="smsVaildCode" placeholder="验证码">
        <el-button @click="sendSmsValidCode">{{msg}}</el-button>
      </div>
      <!-- 第三步 -->
      <div class="item" v-show="active==2">
          <img class="icon" src="@/static/image/psw.png" alt="">
          <input type="password" v-model="password" id="_password"  placeholder="请输入新密码">
      </div>
      <div class="item" v-show="active==2">
          <img class="icon" src="@/static/image/psw.png" alt="">
          <input type="password" v-model="confirmPassword" id="_password"  placeholder="请二次输入新密码">
      </div>
      <el-button type="primary" @click="next()">{{btnMsg}}</el-button>
      <el-button type="primary" @click="toLogin">返回登录</el-button>
    </div>
  </div>
</template>

<script>
import forgetPassword from './forgetPassword.js'
export default forgetPassword
</script>

<style lang="scss">
.forgetPasswordPage{
  height: 100%;
  background: #fff;

  .logo{
    width: 300px;
    margin: 0 auto;
    padding: 50px 0;
    display: block;
  }
  .el-steps{
    margin:20px 0 50px;
  }
  .el-step__head.is-process{
    color: #666;
    border-color:#666;
  }
  .el-step__icon-inner{
    color: #409EFF;
  }
  .from{
    width: 400px;
    margin:30px auto;
    .item{
      margin-bottom: 20px;
      position: relative;
      .icon{
          position: absolute;
          top:12px;
          left: 15px;
          width: 20px;
      }
      input{
          height: 45px;
          border:$border;
          display: block;
          padding-left: 50px;
          width: 100%;
          box-sizing: border-box;
          &:focus{
              outline: none;
              border:1px solid $main-color;
          }
      }
      .imgCode{
          position: absolute;
          right: 5px;
          top: 4px;
      }
      &.code{
          input{
              width: 58%;
              float: left;
          }
          .el-button{
              width: 40%;
              float: right;
              height:45px;
              margin: 0;
          }
      }
    }
    .el-button{
        width: 100%;
        margin: 0 0 10px;
    }
  }

}
</style>
