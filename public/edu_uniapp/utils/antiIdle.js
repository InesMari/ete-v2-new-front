/**
 * 防挂机弹窗模块
 * 功能：
 * 1. 视频/PDF观看时，随机1-2分钟弹出确认弹窗
 * 2. 弹窗时自动暂停视频，确认后恢复播放
 * 3. 视频暂停时不弹窗
 * 4. 超过30秒无操作触发超时回调（视频跳回记录点）
 * 5. 视频每30秒保存进度到localStorage和后台study接口
 * 6. PDF只弹窗防挂机，不做记录
 */

class AntiIdle {
	constructor() {
		this.isActive = false;
		this.popupTimer = null;
		this.timeoutTimer = null;
		this.saveTimer = null;
		this.lastSaveTime = 0; // 上次保存的观看时间
		this.fileId = null;
		this.videoContext = null;
		this.isPaused = true; // 视频是否暂停
		this.onTimeout = null; // 超时回调
		this.onSaveProgress = null; // 保存进度回调（localStorage）
		this.onSaveToBackend = null; // 保存到后台回调（study接口）
		this.isShowingDialog = false; // 是否正在显示弹窗
	}

	/**
	 * 启动防挂机功能
	 * @param {Object} options 配置项
	 * @param {string} options.fileId 文件ID，用于localStorage key
	 * @param {Object} options.videoContext 视频上下文
	 * @param {Function} options.onTimeout 超时回调
	 * @param {Function} options.onSaveProgress 保存进度回调（localStorage）
	 * @param {Function} options.onSaveToBackend 保存到后台回调（study接口）
	 */
	start(options = {}) {
		this.fileId = options.fileId;
		this.videoContext = options.videoContext;
		this.onTimeout = options.onTimeout;
		this.onSaveProgress = options.onSaveProgress;
		this.onSaveToBackend = options.onSaveToBackend;
		this.isActive = true;
		this.isPaused = true;
		this.isShowingDialog = false;
		this.lastSaveTime = 0; // 重置保存时间

		// 启动弹窗定时器（10-30秒随机）
		this.startPopupTimer();

		// 启动超时检测定时器（30秒）
		this.startTimeoutTimer();
	}

	/**
	 * 停止防挂机功能
	 */
	stop() {
		this.isActive = false;
		this.clearAllTimers();
	}

	/**
	 * 设置视频暂停状态
	 * @param {boolean} paused 是否暂停
	 */
	setPaused(paused) {
		this.isPaused = paused;
		// 如果视频恢复播放，重置超时计时器
		if (!paused && this.isActive) {
			this.resetTimeout();
		}
	}

	/**
	 * 重置超时计时器（用户点击确认时调用）
	 */
	resetTimeout() {
		if (!this.isActive) return;

		// 清除超时定时器
		if (this.timeoutTimer) {
			clearTimeout(this.timeoutTimer);
		}

		// 清除弹窗定时器
		if (this.popupTimer) {
			clearTimeout(this.popupTimer);
		}

		// 重启定时器
		this.startPopupTimer();
		this.startTimeoutTimer();
	}

	/**
	 * 保存当前观看进度
	 * @param {number} currentTime 当前播放时间（秒）
	 */
	saveProgress(currentTime) {
		if (!this.fileId || !this.isActive) return;

		// 每30秒才保存一次
		if (currentTime - this.lastSaveTime >= 30 || this.lastSaveTime === 0) {
			this.lastSaveTime = currentTime;

			// 1. 保存到localStorage
			const key = `video_progress_${this.fileId}`;
			const data = {
				currentTime: currentTime,
				saveTime: Date.now()
			};
			uni.setStorageSync(key, JSON.stringify(data));

			if (this.onSaveProgress) {
				this.onSaveProgress(currentTime);
			}

			// 2. 调用后台study接口保存进度
			if (this.onSaveToBackend) {
				this.onSaveToBackend(currentTime);
			}
		}
	}

	/**
	 * 获取保存的观看进度
	 * @returns {number|null} 保存的播放时间（秒）
	 */
	getSavedProgress() {
		if (!this.fileId) return null;
		const key = `video_progress_${this.fileId}`;
		const data = uni.getStorageSync(key);
		if (data) {
			try {
				const parsed = JSON.parse(data);
				return parsed.currentTime;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	/**
	 * 清除保存的观看进度（localStorage）
	 */
	clearSavedProgress() {
		if (!this.fileId) return;
		const key = `video_progress_${this.fileId}`;
		uni.removeStorageSync(key);
	}

	/**
	 * 退出全屏（浏览器环境）
	 */
	exitFullscreen() {
		try {
			if (document.fullscreenElement || document.webkitFullscreenElement) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		} catch (e) {
			// 忽略退出全屏时的错误
		}
	}

	/**
	 * 显示防挂机确认弹窗
	 */
	showConfirmDialog() {
		if (!this.isActive || this.isShowingDialog) return;

		// 如果视频暂停，不弹窗
		if (this.isPaused) {
			this.resetTimeout();
			return;
		}

		this.isShowingDialog = true;

		// 弹窗时暂停视频
		if (this.videoContext) {
			this.videoContext.pause();
		}
		// 强制退出全屏，否则弹窗不可见
		this.exitFullscreen();

		uni.showModal({
			title: '学习确认',
			content: '请确认您正在观看学习，30秒后将自动跳转回之前观看位置。',
			showCancel: false,
			confirmText: '我已知晓，继续学习',
			success: (res) => {
				this.isShowingDialog = false;
				if (res.confirm) {
					this.resetTimeout();
					// 用户确认后恢复视频播放
					if (this.videoContext) {
						this.videoContext.play();
					}
				}
			},
			fail: () => {
				this.isShowingDialog = false;
				// 弹窗失败也恢复播放
				if (this.videoContext) {
					this.videoContext.play();
				}
			}
		});
	}

	/**
	 * 启动弹窗定时器（1-2分钟随机）
	 */
	startPopupTimer() {
		if (this.popupTimer) {
			clearTimeout(this.popupTimer);
		}
		// 随机1-2分钟（60-120秒）
		const delay = Math.floor(Math.random() * 61) + 60;
		this.popupTimer = setTimeout(() => {
			this.showConfirmDialog();
		}, delay * 1000);
	}

	/**
	 * 启动超时检测定时器（30秒）
	 */
	startTimeoutTimer() {
		if (this.timeoutTimer) {
			clearTimeout(this.timeoutTimer);
		}
		this.timeoutTimer = setTimeout(() => {
			if (this.isActive && this.onTimeout) {
				this.onTimeout();
			}
		}, 30000);
	}

	/**
	 * 清除所有定时器
	 */
	clearAllTimers() {
		if (this.popupTimer) {
			clearTimeout(this.popupTimer);
			this.popupTimer = null;
		}
		if (this.timeoutTimer) {
			clearTimeout(this.timeoutTimer);
			this.timeoutTimer = null;
		}
	}
}

// 导出单例
export default new AntiIdle();
