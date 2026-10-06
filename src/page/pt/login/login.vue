<template>
    <div id="login" class="loginPtPage">
        <div class="login_box clearfix">            
            <img class="fl login_box_bg" src="@/static/image/login_box_bg.png" alt="">
            <div class="fr loginFrom">
                <img class="logo" src="@/static/image/logo_pt.png" alt="">
                <el-menu :default-active="loginType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">手机号登录</el-menu-item>
                    <el-menu-item index="2">短信验证登录</el-menu-item>
                </el-menu>
                <div class="loginInfo">
                    <form class="login_wrap" name="loginForm" novalidate @keyup.enter="submit()">
                        <div class="item">
                            <img class="icon" src="@/static/image/phone2.png" alt="">
                            <input type="text" v-model="userName" id="_userName" @blur="getShowCode" placeholder="手机号">
                        </div>
                        <!-- 密码登陆 -->
                        <div v-show="loginType==1">
                            <div class="item">
                                <img class="icon" src="@/static/image/psw2.png" alt="">
                                <input :type="showPassword ? 'text' : 'password'" v-model="password" id="_password" @blur="getShowCode" placeholder="密码">
                                <span class="password-toggle" @click="togglePassword">
                                    <img v-if="!showPassword" src="@/static/image/eye_close.png" alt="显示密码">
                                    <img v-else src="@/static/image/eye_open.png" alt="隐藏密码">
                                </span>
                            </div>
                            <div class="item" v-show="validCodeShow">
                                <img class="icon" src="@/static/image/code2.png" alt="">
                                <input type="text" v-model="vaildCode" placeholder="验证码">
                                <img @click="genCode()" :src="codeUrl" class="imgCode" width="150" height="50" />
                            </div>
                        </div>
                        <!-- 短信验证码登录 -->
                        <div class="item code clearfix" v-show="loginType==2" key="sms">
                            <!-- <img class="icon" src="@/static/image/msg.png" alt=""> -->
                            <img class="icon" src="@/static/image/code2.png" alt="">
                            <input type="text" v-model="smsVaildCode" placeholder="验证码">
                            <el-button @click="sendLoginSmsValidCode">{{msg}}</el-button>
                        </div>
                    </form>
                </div>
                <el-button class="loginBtn" type="primary" @click="submit()" :disabled="loading">
                    <span v-if="!loading">登<span style="margin:0 20px;"></span> 录</span>
                    <span v-else class="loading">
                        <span class="loading-icon"></span>
                        登录中...
                    </span>
                </el-button>
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
<style lang="scss" src="./loginPt.scss"></style>