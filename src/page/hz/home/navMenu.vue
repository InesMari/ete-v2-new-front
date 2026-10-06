<template>
  <div id="navMenu" class="hzNavMenuPage">
      <img class="navbg-icon" src="@/static/image/navbg.png" alt="">
      <i class="circle1"></i><!-- 装饰小圆圈 -->
      <i class="circle2"></i><!-- 装饰小圆圈 -->
      <el-scrollbar class="content_height">
        <el-menu
        :default-active="routeId"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        background-color="#52b7f5"
        text-color="#fff"
        active-text-color="#89d1fc"
        :collapse="!isshowNav">
        <div v-for="(tab1,index1) in tabs" :key="index1">
            <template v-if="tab1.children.length==0">
                <el-menu-item @click="openTab(tab1)" :index="tab1.urlId+''">
                    <img src="@/static/image/nav_home.png" class="nav_ico" :alt="tab1.urlName">
                    <span v-show="isshowNav" style="color:#fff;">{{tab1.urlName}}</span>
                </el-menu-item>
            </template>
            <!-- 一级菜单 -->
            <el-submenu v-else :index="tab1.urlId+''">
                <template slot="title" @click="openTab(tab1)">
                    <!-- 后面数据库配置 -->
                    <img v-if="tab1.id==2001001" src="@/static/image/nav_ord.png" class="nav_ico" alt="运输订单">
                    <img v-else-if="tab1.id==2002001" src="@/static/image/nav_pack.png" class="nav_ico" alt="包装业务">
                    <img v-else-if="tab1.id==2003001" src="@/static/image/nav_store_bill.png" class="nav_ico" alt="仓储业务">
                    <img v-else-if="tab1.id==2006001" src="@/static/image/nav_people.png" class="nav_ico" alt="基础管理">
                    <img v-else-if="tab1.id==2005001" src="@/static/image/nav_company.png" class="nav_ico" alt="子公司业务">
                    <img v-else-if="tab1.id==2004001" src="@/static/image/nav_bill.png" class="nav_ico" alt="账单管理">
                    <i v-else class="el-icon-menu"></i>
                    <span v-show="isshowNav">{{tab1.urlName}}</span>
                </template>
                <!-- 二级菜单 -->
                <div v-for="(tab2,index2) in tab1.children" :key="index2">
                    <el-menu-item @click="openTab(tab2)" v-show="tab2.children.length==0" :index="tab2.urlId+''">
                        <span>{{tab2.urlName}}</span>
                    </el-menu-item>
                    <!-- 三级菜单 -->
                    <el-submenu v-show="tab2.children.length>0" :index="tab2.urlId+''">
                        <template slot="title">{{tab2.urlName}}</template>
                        <el-menu-item v-for="(tab3,index3) in tab2.children" :key="index3" :index="tab3.urlId+''" @click="openTab(tab3)">{{tab3.urlName}}</el-menu-item>
                    </el-submenu>
                </div>
            </el-submenu>
        </div>
        </el-menu>
        </el-scrollbar>
        <div class="navMenuSwitch" @click="navMenuSwitch">
            <i class="el-icon-arrow-up" v-show="!isshowNav"></i>
            <i class="el-icon-arrow-down" v-show="isshowNav"></i>
        </div>
  </div>
</template>

<script>
  import navMenu from "./navMenu.js"
  export default navMenu
</script>
<style lang="scss">
.hzNavMenuPage{
    height: calc(100% - 76px);
    position: relative;
    padding-top: 40px;
    box-sizing: border-box;
    .navbg-icon{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        pointer-events: none;
    }
    .circle1{
        position: absolute;
        width: 150px;
        height: 150px;
        background: rgba(255,255,255,0.12);
        bottom: 80px;
        left: -35%;
        pointer-events: none;
        border-radius: 50%;
    }
    .circle2{
        position: absolute;
        width: 70px;
        height: 70px;
        background: rgba(255,255,255,0.12);
        bottom: 148px;
        left: 24%;
        pointer-events: none;
        border-radius: 50%;
    }
    .content_height{
        position: relative;
        height: 100%;
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
    .el-menu{
        border:none;
    }
    .nav_ico{
        width: 20px;
        vertical-align: middle;
        margin-right: 7px;
    }
    .el-submenu__title,.el-menu-item{
        &:hover{
            background-color: #11a9ff !important;
        }
        i{
            color: #fff;
        }
    }
    .el-submenu .el-menu-item{
        background-color: #11a9ff !important;
        &.is-active,&:hover{
            background: #1ea0ef !important;
            span{
                color:#fff;
            }
        }
    }
    .navMenuSwitch {
        position: absolute;
        right: -75px;
        top: 50%;
        border-bottom: 15px solid #52b7f5;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        height: 0;
        width: 30px;
        transform: rotate(90deg) translateX(-50%);
        transform-origin: 0 0;
        cursor: pointer;
        color: #fff;
        font-weight: bold;
        text-align: center;
        line-height: 15px;
        z-index: 99;
        &:hover{
            border-color: #11a9ff;
            border-left-color: transparent;
            border-right-color: transparent;
        }
    }
}
.el-menu--vertical{
    .el-menu-item{
        &.is-active,&:hover{
            background-color: #11a9ff !important;
        }
        span{
            color:#fff;
        }
    }
}
</style>
