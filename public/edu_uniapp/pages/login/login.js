import {
	util,
	uniApi,
	common
} from '/common/commonImport';
import {
	onLoad
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	computed
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			stamp: true,
			msg: '获取验证码',
			vaildCode: "",
			billId: '',
			password: '',
		})
		// 普通数据		
		let staticData = {}
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(() => {
			
		})
		
		// 获取验证码
		function getCode() {
			if (!bindData.billId) {
				uniApi.showModal({
					title: "提示",
					content: '请输入手机号码',
					confirmText: "确定",
					showCancel: false
				})
				return false;
			}
			if (bindData.billId.length != 11) {
				uniApi.showModal({
					title: "提示",
					content: '请输入有效的手机号',
					confirmText: "确定",
					showCancel: false
				})
				return false;
			}
			sendvaildCode(function() {
				staticData.verifyPhone = false
			})
		}

		function sendvaildCode(fun) {
			if (bindData.stamp) {
				util.postByBeanName("eduUserService", "sendStudentLoginSmsValidCodeForWechat", {
					billId: bindData.billId,
				}, function(data) {
					//成功执行
					if (data) {
						bindData.stamp = false;
						bindData.miao = 60;
						if (typeof fun == "function") {
							fun();
						}
						const timer = setInterval(function() {
							if (!bindData.stamp) {
								bindData.miao = parseInt(bindData.miao) - 1;
								bindData.msg = bindData.miao + "S";
								if (bindData.miao == 0) {
									bindData.msg = "获取验证码";
									bindData.stamp = true;
									clearInterval(timer)
								}
							} else {
								bindData.msg = "获取验证码";
								bindData.stamp = true;
							}
						}, 1000);
					}
				}, function(data) {
					if (data.data.message === '短信验证码5分钟内有效，无需重复申请') {
						staticData.verifyPhone = false
					}
				})
			}
		}

		// 登录
		async function login() {
			let billId = bindData.billId;
			if (billId === '') {
				//账号/密码为空
				await uniApi.showModal('请输入账号');
				return;
			} else if (billId.length != 11) {
				//手机号码格式错误
				await uniApi.showModal('请输入正确的手机号');
				return;
			}
			let password = bindData.password;
			if (billId === '') {
				//密码为空
				await uniApi.showModal('请输入密码');
				return;
			}
			let pwd = util.rsaEncrypt(password);
			let vaildCode = bindData.vaildCode;
			if (vaildCode === '') {
				//验证码为空
				await uniApi.showModal('请输入验证码');
				return;
			}
			//小程序登陆
			//#ifdef MP-WEIXIN
			let res = await uni.login();
			let userInfo = await uni.getUserInfo(); //获取用户信息
			console.log('登录获取用户信息授权成功，信息用于首页展示用户微信名。');
			let params = {
				wxCode: res.code,
				userInfo: userInfo,
				billId,
				appId: util.wxAppId,
			};
			//#endif
			//#ifndef MP-WEIXIN
			// 其他登录
			let params = {
				billId,
				loginByBillId: 1,
			};
			//#endif
			
			params.password = pwd;
			params.vaildCode = vaildCode;
			let data = await util.postByBeanName('eduUserService', 'studentLoginForWechat', params);
			uni.setStorageSync('userInfo', data);
			uni.reLaunch({
				url: '/pages/home/home'
			});
		}

		// 忘记密码
		function toForgetPsw() {
			uni.navigateTo({
				url: '/pages/forgetPsw/forgetPsw'
			});
		}

		// 查看协议
		function protocol() {
			uni.navigateTo({
				url: '/pages/protocol/protocol'
			});
		}
		return {
			...toRefs(bindData),
			getCode,
			login,
			toForgetPsw,
			protocol,
		}
	}
};