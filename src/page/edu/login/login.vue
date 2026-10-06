<template>
    <div id="login" class="loginEduPage">
        <div class="login_box clearfix">            
            <img class="fl login_box_bg" src="@/static/image/edu/login_box_bg.png" alt="">
            <div class="fr loginFrom">
                <img class="logo" src="@/static/image/edu/logo_edu.png" alt="">
                <!-- <div style="font-weight:bold;font-size:16px;text-align:center;">欢迎来到易迁易大学</div>  -->
                <el-menu :default-active="loginType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">学员登录入口</el-menu-item>
                    <el-menu-item index="2">管理员入口</el-menu-item>
                </el-menu>
                <div class="loginInfo">
                    <form class="login_wrap" name="loginForm" novalidate @keyup.enter="submit()">
                        <div class="item">
                            <img class="icon" src="@/static/image/phone2.png" alt="">
                            <input type="text" v-model="userName" id="_userName" @blur="getShowCode" placeholder="手机号">
                        </div>
                        <!-- 密码登陆 -->
                        <div>
                            <div class="item">
                                <img class="icon" src="@/static/image/psw2.png" alt="">
                                <input type="password" v-model="password" id="_password" @input="getShowCode" placeholder="密码">
                            </div>
                            <div class="item" v-show="validCodeShow">
                                <img class="icon" src="@/static/image/code2.png" alt="">
                                <input type="text" v-model="vaildCode" placeholder="验证码">
                                <img @click="genCode()" :src="codeUrl" class="imgCode" width="80" height="36" />
                            </div>
                        </div>
                    </form>
                </div>
                <el-button class="loginBtn" type="primary" @click="submit()">登<span style="margin:0 20px;"></span> 录</el-button>
                <div class="remember clearfix">
                    <el-checkbox v-model="rememberAccount" class="fl">7天内自动登录</el-checkbox>
                    <a class="link fr" @click="toForget">忘记密码？</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import loginClient from './login.js'
    export default loginClient
</script>
<style lang="scss" src="./login.scss" scoped></style>
