<template>
  <div id="toMain" class="toMainPage">
    <div class="overview homeItem">
      <div class="itemTitle">后台总览</div>
      <div class="overList">
        <div class="item" v-for="item in info.numsInfo">
          <div class="number">{{ item.nums }}</div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="catalog homeItem">
      <div class="itemTitle">快捷操作</div>
      <div class="catalogList">
        <div class="item" @click="addCourse">
          <div class="imgView">
            <img src="@/static/image/edu/home_icon1.png" alt="">            
          </div>
          <span class="name">新增课程</span>
        </div>
        <div class="item" @click="toStudentDetail">
          <div class="imgView" style="background:#d4237a;">
            <img src="@/static/image/edu/home_icon2.png" alt="">       
          </div>
          <span class="name">查看学员列表</span>
        </div>
        <div class="item" @click="toHomeSet">
          <div class="imgView" style="background:#ff5347;">
            <img src="@/static/image/edu/home_icon3.png" alt="">             
          </div>
          <span class="name">主页设置</span>
        </div>
      </div>
    </div>
    <div class="total homeItem">
      <div class="itemTitle">学习人数变化</div>
      <div class="innerTab clearfix">
        <div class="innerItem" :class="type==1?'active':''" @click="initChart(1)">
            <p class="inline">最近7天</p>
        </div>
        <div class="innerItem" :class="type==2?'active':''" @click="initChart(2)">
            <p class="inline">最近30天</p>
        </div>
      </div>
      <div id="lineCharts" class="lineCharts"></div>
    </div>
  </div>
</template>

<script>
import toMain from "./toMain.js";
export default toMain;
</script>
<style lang="scss" src="./toMain.scss" scoped></style>
