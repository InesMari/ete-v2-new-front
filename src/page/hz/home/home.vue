<template>
  <div id="home" class="homePage homeHzPage" @click="hideDom">
    <div class="home_main">
      <!-- 侧边栏 -->
      <div class="slide_bar fl" :style="isshowNav?'':'width:64px'">
        <div class="logo2" v-show="isshowNav">
          <img class="logo2-icon" src="@/static/image/logo2.png" alt="">
        </div>
        <div class="logo3" v-show="!isshowNav">
          <img class="logo2-icon" src="@/static/image/logo3.png" alt="">
        </div>
        <navMenu @openTab="openTab" @navMenuSwitch="navMenuSwitch"></navMenu>
      </div>
      <!-- 侧边栏结束 -->
      <div class="home_main_right fr" :style="isshowNav?'':'width:calc(100% - 64px)'">
      <!-- 右侧 -->
        <!-- 右侧头部 -->
        <div class="header" style="position: relative;z-index: 990">
          <div>
            <el-dropdown class="fl home-el-dropdown-menu" trigger="click">
              <img class="message-icon" src="@/static/image/message.png" alt="">
              <span class="numTip" v-show="todo.totalSum > 0">{{todo.totalSum}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="gotoMessageList" v-entity="2010002">
                  订单
                  <span class="itemNumTip" v-show="todo.orderMessageSum > 0">{{todo.orderMessageSum}}</span>
                </el-dropdown-item>
                <el-dropdown-item v-entity="2010003">
                  回单
                </el-dropdown-item>
                <el-dropdown-item v-entity="2010004">
                  账单
                </el-dropdown-item>
                <el-dropdown-item v-entity="2010005">
                  器具
                </el-dropdown-item>
                <el-dropdown-item v-entity="2010006">
                  仓储
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="infoList fl" @click.stop="showInfoList">
              <p class="name">{{userName}}</p>
              <ul v-show="isshowInfoList">
                <li @click="toBaseInfo">基础资料</li>
                <li @click="showModifyDialog=true">修改密码</li>
                <li @click="logout">注销退出</li>
              </ul>
            </div>
            
          </div>
        </div>
        <!-- 右侧头部结束 -->
        <!-- 主体页面 -->
        <div class="main_content" >
          <div class="tabs clearfix">
            <myTab ref="myTab"></myTab>
          </div>
          <div class="main_frame" ref="mainFrame">
            <!-- 生命周期保持的页面 -->
            <keep-alive>
              <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" v-if="$route.meta.keep"></router-view>
            </keep-alive>
            <!-- 切换结束生命周期的页面 -->
            <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" v-if="!$route.meta.keep"></router-view>
          </div>
        </div>
        <!-- 主题页面 结束 -->
        <el-dialog title="初次登陆，需要您重置密码" :visible.sync="showDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="340px" :show-close="false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="password" ></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">确认密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="confirmPassword"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="modifyPasswordFirst">确认修改</el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="showModifyDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="400px" @close="showModifyDialog=false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">用户名</label>
                <div class="input-text">
                  <el-input v-model="billId" :disabled="true"></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">验证码</label>
                <div class="input-text">
                  <el-input v-model="smsVaildCode" style="width: 125px"></el-input>
                  <el-button @click="sendSmsValidCode" style="width: 150px;" :disabled="!stamp">{{msg}}</el-button>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="password" ></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">确认密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="confirmPassword"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="smsModifyPassword">确认修改</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 右侧 -->
      <!-- 公用遮罩层 -->
      <div class="main-popup" id="mainPopup">
        <div class="main-popup-content">
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import home from "./home.js"
  export default home
</script>
<style lang="scss" src="@/page/pt/home/home.scss"></style>
