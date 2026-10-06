<template>
  <div id="navMenu" class="navMenuPage">
      <img class="navbg-icon" src="@/static/image/navbg.png" alt="">
      <i class="circle1"></i><!-- 装饰小圆圈 -->
      <i class="circle2"></i><!-- 装饰小圆圈 -->
      <el-scrollbar class="content_height">
        <div class="allMenus" @click="openMenuList(true)">
            <img  src="@/static/image/nav_allMenus.png" class="nav_ico">{{isshowNav?'所有菜单展示':''}}
            <div class="menuList" v-show="isshowMenuList">
                <el-input v-model="menuSearch" @input="searchMenu" @click.native.stop="()=>false" placeholder="请输入菜单关键字"></el-input>
                <i class="el-icon-close" @click.stop="openMenuList(false)"></i>
                <el-scrollbar class="list">
                    <template v-if="!menuSearch">
                    <div class="menu-item" v-for="menu1 in allMenus" :key="menu1.id">
                        <div v-if="menu1.urlId!='000'&&menu1.urlId!='10000'">
                            <h3>{{menu1.urlName}}</h3>
                            <div class="clearfix" v-if="menu1.children.length>0">
                                <div v-for="menu2 in menu1.children" :key="menu2.id">
                                    <div v-if="menu2.children.length==0" class="item" @click.stop="openTab(menu2)">{{menu2.urlName}} <i class="el-icon-star-on" :class="menu2.favoritesFlag==1?'active':''" @click.stop="collect(menu2)"></i></div>
                                    <div v-if="menu2.children.length>0">
                                        <div class="item" @click.stop="openTab(menu3)" v-for="menu3 in menu2.children" :key="menu3.id">
                                            {{menu3.urlName}} <i class="el-icon-star-on" :class="menu3.favoritesFlag==1?'active':''" @click.stop="collect(menu3)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </template>
                    <template v-if="menuSearch">
                        <div class="item" v-for="menu in menuSearchList" :key="menu.id" @click.stop="openTab(menu)">    
                            {{menu.urlName}} <i class="el-icon-star-on" :class="menu.favoritesFlag==1?'active':''" @click.stop="collect(menu)"></i>
                        </div>
                    </template>
                </el-scrollbar>
            </div>
        </div>
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
            <!-- 一级菜单o  -->
            <el-submenu v-else :index="tab1.urlId+''">
                <template slot="title" @click="openTab(tab1)">
                    <!-- 后面数据库配置 -->
                    <img v-if="tab1.id==1001001" src="@/static/image/nav_sell.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1002001" src="@/static/image/nav_resource.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1003001" src="@/static/image/nav_transport.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1004001" src="@/static/image/nav_pack.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1005001" src="@/static/image/nav_store_bill.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1006001" src="@/static/image/nav_bill.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1007001" src="@/static/image/nav_transReport.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1008001" src="@/static/image/nav_setup.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1009001" src="@/static/image/nav_hr.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1011001" src="@/static/image/nav_file.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1012001" src="@/static/image/nav_pallet.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1013001" src="@/static/image/nav_exception.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1014001" src="@/static/image/nav_purchase.png" class="nav_ico" :alt="tab1.urlName">
                    <img v-else-if="tab1.id==1015001" src="@/static/image/nav_business.png" class="nav_ico" :alt="tab1.urlName">
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
        <div class="navMenuSwitch" @click="navMenuSwitch();navMenuSwitchOp()">
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
.navMenuPage{
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
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
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
            background-color: #11a9ff;
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
    .submenu3{
        .el-submenu__title{
            background: #5db3e9!important;
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
    .el-scrollbar__thumb{
        background-color:rgba(144,147,153,0.6);
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
