<template>
  <div id="studentHome" class="homePage studentHomePage" @click="isshowInfoList=false">
    <div class="home_main">
      
      <!-- 侧边栏 -->
      <div class="slide_bar fl" :style="isshowNav?'':'width:64px'">
        <div class="logo2" v-show="isshowNav">
          <img class="logo2-icon" src="@/static/image/logo.png" alt="">
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
        <div class="header">
          <div class="headerInfo fr">
            <el-button class="homeBtn" @click="toHome" size="mini">首页</el-button>
            <a class="operate" @click="openOperate" href="javascript:;" title="操作教程">
              <img class="sop-icon" src="@/static/image/sop.png" alt="">
            </a>
            <div class="infoList fr" @click.stop="showInfoList" style="z-index: 999">
              <p class="name">{{userName}}</p>
              <ul v-show="isshowInfoList">
  <!--              <li>个人资料</li>-->
  <!--              <li @click="showModifyDialog=true">修改密码</li>-->
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
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include='keepAlivePage'>
                <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" @refreshTab="refreshTab" @closeOthers="closeOthers"></router-view>
              </keep-alive>
            </transition>
            <!-- 切换结束生命周期的页面 -->
            <!-- <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" @refreshTab="refreshTab" v-if="!$route.meta.keep"></router-view> -->
          </div>
        </div>
        <!-- 主体页面 结束 -->

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

<style lang="scss" src="./home.scss" scoped></style>
