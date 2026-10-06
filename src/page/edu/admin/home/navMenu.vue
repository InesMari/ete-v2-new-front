<template>
  <div id="navMenu" class="eduAdminNavMenuPage">
      <img class="navbg-icon" src="@/static/image/navbg.png" alt="">
      <i class="circle1"></i><!-- 装饰小圆圈 -->
      <i class="circle2"></i><!-- 装饰小圆圈 -->
      <el-scrollbar class="content_height">
        <el-menu
        :default-active="routeId"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        background-color="#e70b1d"
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
                    <img v-if="tab1.id==4001003" src="@/static/image/nav_course.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==4001004" src="@/static/image/nav_people.png" class="nav_ico" :alt="tab1.urlName">
                    <i v-else class="el-icon-menu"></i>
                    <span v-show="isshowNav">{{tab1.urlName}}</span>        
                </template>
                <!-- 二级菜单 -->
                <div v-for="(tab2,index2) in tab1.children" :key="index2">
                    <el-menu-item @click="openTab(tab2)" v-show="tab2.children.length==0" :index="tab2.urlId+''">
                        <span>{{tab2.urlName}}</span>
                    </el-menu-item>
                    <!-- 三级菜单 -->
                    <el-submenu v-show="tab2.children.length>0" :index="tab2.urlId+''" class="submenu3">
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
.eduAdminNavMenuPage{
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
        height: 100%;
    }
    .allMenus{
        font-size: 14px;
        padding: 0 20px;
        -webkit-transition: border-color .3s,background-color .3s,color .3s;
        transition: border-color .3s,background-color .3s,color .3s;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-left: 20px;
        color: #fff;
        height: 56px;
        line-height: 56px;
        position: relative;
        white-space: nowrap;
        list-style: none;
        &:hover{
            background-color: $main-color-hover;
        }
        .menuList{
            position: fixed;
            z-index: 9999;
            left: 199px;
            top: 120px;
            background: #fff;
            padding: 20px 0 20px 20px;
            width: 600px;
            border-radius: 6px;
            border:$border;
            height: calc(100% - 240px);
            overflow: hidden;
            .el-icon-close{
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 20px;
                cursor: pointer;
                &:hover{
                    color: $main-color;
                }
            }
            .el-input{
                width: 350px;
            }
            .list{
                height: calc(100% - 50px);
                margin-top: 10px;
                h3{
                    font-weight: bold;
                    line-height: 32px;
                    font-size: 15px;
                    margin-top: 10px;
                }
                .item{
                    width: 190px;
                    box-sizing: border-box;
                    padding-right: 20px;
                    line-height: 32px;
                    font-size: 14px;
                    float: left;
                    cursor: pointer;
                }
                .el-icon-star-on{
                    font-size: 20px;
                    float: right;
                    margin-top: 6px;
                    color: #eee;
                    &:hover{
                        color: #ec9315;
                    }
                    &.active{
                        color: #ec9315;
                    }
                }
            }
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
            background-color: $main-color-hover!important;
        }
        i{
            color: #fff;
        }
    }
    .el-submenu .el-menu-item{
        background-color: $main-color-hover !important;
        &.is-active,&:hover{
            background: #f62436 !important;
            span{
                color:#fff;
            }
        }
    }
    .submenu3{
        .el-submenu__title{
            background: $main-color-hover!important;
        }
    }
    .navMenuSwitch {
        position: absolute;
        right: -75px;
        top: 50%;
        border-bottom: 15px solid $main-color;
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
            border-color: $main-color-hover;
            border-left-color: transparent;
            border-right-color: transparent;
        }
    }
    .el-scrollbar__thumb{
        background-color:rgba(144,147,153,0.6);
    }
}
.el-menu--vertical{
    .el-menu-item{
        &.is-active,&:hover{
            background-color: $main-color-hover !important;
        }
        span{
            color:#fff;
        }
    }
}
</style>