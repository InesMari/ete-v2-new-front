<template>
	<view class="loginPage">
		<view class="contain">
			<image class="banner" src="/static/images/login_banner.png" mode="widthFix"></image>
			<view class="logs-inputBox">
				<view class="field">
					<view class="item">
						<image class="icon" src="/static/images/icon_phone.png" mode="widthFix"></image>
						<input type="number" v-model="billId" placeholder="请输入手机号" />
					</view>
					<view class="item">
						<image class="icon psw" src="/static/images/icon_password.png" mode="widthFix"></image>
						<input type="password" password="true" v-model="password" placeholder="请输入密码" />
					</view>
					<view class="item">
						<image class="icon msg" src="/static/images/icon_verify.png" mode="widthFix"></image>
						<input type="text" v-model="vaildCode" placeholder="请输入验证码"></input>
						<button class="msg-btn" v-if="billId" :class="!stamp?'disabled':''" @click="getCode">{{msg}}</button>
					</view>
				</view>
				<!-- <view class="forgetPassword" @tap="toForgetPsw">忘记密码？</view> -->
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="logs-bot" open-type="getUserInfo" @getuserinfo="login">
				登
				<text style="margin: 0 25rpx"></text>
				录
			</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<button class="logs-bot" @click="login">
				登
				<text style="margin: 0 25rpx"></text>
				录
			</button>
			<!-- #endif -->

			<!-- <view class="protocol">
        点击登录，即表示已阅读并同意 <view class="protocol-text span" bindtap="protocol">《易迁易用户协议》</view>
    </view> -->
		</view>
		<!-- <image class="loginBg" src="/static/images/loginBg.png" mode="widthFix"></image> -->
	</view>
</template>

<script>
	import login from './login.js'
	export default login
</script>
<style lang="scss">
@import './login.scss';
</style>