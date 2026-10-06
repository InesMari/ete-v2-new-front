<template>
    <div id="login" class="loginHzPage">
        <div class="login_box clearfix">
            <img class="fl login_box_bg" src="@/static/image/login_box_bg.png" alt="">
            <div class="fr loginFrom">
                <img class="logo" src="@/static/image/logo_hz.png" alt="">
                <el-menu :default-active="loginType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">账号登录</el-menu-item>
                    <el-menu-item index="2">验证码登录</el-menu-item>
                </el-menu>
                <div class="loginInfo">
                    <form class="login_wrap" name="loginForm" novalidate @keyup.enter="submit()">
                        <div class="item">
                            <img class="icon" src="@/static/image/phone2.png" alt="">
                            <input type="text" v-model="userName" id="_userName" @blur="getShowCode" placeholder="手机号/邮箱">
                        </div>
                        <!-- 密码登陆 -->
                        <div v-show="loginType==1">
                            <div class="item">
                                <img class="icon" src="@/static/image/psw2.png" alt="">
                                <input type="password" v-model="password" id="_password"  placeholder="密码">
                            </div>
                            <div class="item" v-show="validCodeShow">
                                <img class="icon" src="@/static/image/code2.png" alt="">
                                <input type="text" v-model="vaildCode" placeholder="验证码">
                                <img @click="genCode()" :src="codeUrl" class="imgCode" width="80" height="36" />
                            </div>
                        </div>
                        <!-- 短信验证码登录 -->
                        <div class="item code clearfix" v-show="loginType==2">
                            <!-- <img class="icon" src="@/static/image/msg.png" alt=""> -->
                            <img class="icon" src="@/static/image/code2.png" alt="">
                            <input type="text" v-model="smsVaildCode" placeholder="验证码">
                            <el-button @click="sendLoginSmsValidCode">{{msg}}</el-button>
                        </div>
                    </form>
                </div>
                <el-button class="loginBtn" type="primary" @click="submit()">登<span style="margin:0 20px;"></span> 录</el-button>
                <div class="remember clearfix">
                    <el-checkbox v-model="rememberAccount" class="fl">7天内自动登录</el-checkbox>
                    <el-link type="primary"  class="fr" @click="toForget">忘记密码？</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import loginClient from './login.js'
    export default loginClient
</script>
<style lang="scss" src="./loginHz.scss"></style>
