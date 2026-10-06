import {
	util,
	common,
	antiIdle
} from '/common/commonImport';
import {
	onLoad,
	onUnload,
	onShow,
	onHide
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	nextTick
} from "vue";
export default {
	setup() {
		// ========== 防挂机功能配置（可在此处统一修改时间参数） ==========
		const antiIdleConfig = {
			popupMinInterval: 60, // 弹窗最小弹出间隔（秒），默认1分钟
			popupMaxInterval: 120, // 弹窗最大弹出间隔（秒），默认2分钟
			timeoutDuration: 30,   // 超时检测时长（秒），默认30秒无操作则回滚
		};

		// 绑定数据
		let bindData = reactive({
			chapterInfo: {},
			fileInfo: {},
			previousTime: 0,
			interval: null,
			videoContext: null,
			isVideo: false, // 根据文件后缀判断
			isSeekingBack: false, // 是否正在跳转回之前位置，用于禁止快进时不保存错误进度
			hasAutoSeeked: false, // 是否已自动定位过，防止重复seek
			isStudyCompleted: false, // 是否学习完成
			// PDF相关
			isPdf: false,
			isPdfLoading: true, // PDF加载中状态
			pdfCountdown: 0, // PDF倒计时（秒）
			pdfLastSaveCountdown: 0, // 上次保存时的倒计时位置
			pdfTimer: null, // PDF倒计时定时器
			pdfStudyTimer: null, // PDF学习计时器
			pdfStudyTime: 0, // PDF累计学习时间（秒）
			pdfLastSaveTime: 0, // PDF上次保存时间
			pdfPopupTimer: null, // PDF防挂机弹窗定时器
			pdfTimeoutTimer: null, // PDF超时定时器
			isPdfDialogShowing: false // PDF弹窗是否显示
		})

		// 视频文件后缀列表
		const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm3u8'];

		// 判断是否是视频文件
		function checkIsVideo(fileUrl) {
			if (!fileUrl) return false;
			const ext = fileUrl.split('.').pop().toLowerCase().split('?')[0];
			return videoExtensions.includes(ext);
		}

		// 获取页面参数
		onLoad((options) => {
			bindData.chapterInfo = JSON.parse(decodeURIComponent(options.chapterInfo || '{}'));
			bindData.fileInfo = JSON.parse(decodeURIComponent(options.fileInfo || '{}'));

			// 判断是否学习完成（studyDuration >= duration）
			const studyDuration = parseFloat(bindData.fileInfo.studyDuration) || 0;
			const duration = parseFloat(bindData.fileInfo.duration) || 0;
			//是否学习完成
			bindData.isStudyCompleted = studyDuration >= duration;
			//已学习时间
			bindData.previousTime = bindData.isStudyCompleted?0:parseFloat(bindData.fileInfo.studyDuration);

			// 根据文件后缀判断是否是视频
			bindData.isVideo = checkIsVideo(bindData.fileInfo.fileUrl);
			// 判断是否是PDF
			bindData.isPdf = !bindData.isVideo;


			// 初始化PDF倒计时（减去已学习的时间）
			if (bindData.isPdf && bindData.fileInfo.duration) {
				const totalDuration = parseInt(bindData.fileInfo.duration) || 0;
				const learnedTime = parseInt(bindData.previousTime) || 0;
				bindData.pdfCountdown = Math.max(0, totalDuration - learnedTime);
				bindData.pdfLastSaveCountdown = bindData.pdfCountdown; // 初始化保存位置
			}

			if(!bindData.isVideo){
				nextTick(()=>{
					// PDF渲染成功后再启动倒计时和防挂机
					initPDF(() => {
						bindData.isPdfLoading = false;
						if (!bindData.isStudyCompleted) {
							startPdfAntiIdle();
							startPdfCountdown();
						}
					});
				})
			}
		})

		onShow(() => {
			// 页面显示时启动防挂机功能
			if (bindData.fileInfo.id) {
				bindData.videoContext = uni.createVideoContext('myVideo');
				
				if (bindData.isVideo) {
					// 学习完成时不启动防挂机功能
					if (!bindData.isStudyCompleted) {
						// 视频防挂机
						antiIdle.start({
							fileId: bindData.fileInfo.id,
							videoContext: bindData.videoContext,
							enabled: true,
							onTimeout: () => {
								// 超时回调：跳回之前记录的观看点
								const savedProgress = antiIdle.getSavedProgress();
								if (savedProgress && bindData.videoContext) {
									bindData.videoContext.seek(savedProgress);
									bindData.previousTime = savedProgress;
									uni.showToast({
										title: '已跳转回之前的观看位置',
										icon: 'none',
										duration: 2000
									});
								}
							},
							onSaveProgress: (currentTime) => {
								console.log('已保存到localStorage:', currentTime);
							},
							onSaveToBackend: async (currentTime) => {
								// 调用后台study接口保存进度
								console.log('正在保存进度到后台:', currentTime);
								await study(currentTime);
							}
						});
					}
				} else if (bindData.isPdf) {
					// 页面显示时重新启动PDF倒计时和防挂机
					if (!bindData.isStudyCompleted) {
						startPdfAntiIdle();
						startPdfCountdown();
					}
				}
			}
		})

		onHide(() => {
			// 页面隐藏时彻底停止所有定时器
			antiIdle.stop();
			stopPdfAntiIdle();
			stopPdfCountdown();
		})

		onUnload(() => {
			clearInterval(bindData.interval);
			antiIdle.stop();
			// 页面退出时清理localStorage中的进度
			antiIdle.clearSavedProgress();
			// 停止PDF倒计时
			stopPdfAntiIdle();
			stopPdfCountdown();
			// 保存PDF学习时间
			if (bindData.isPdf && bindData.pdfStudyTime > 0) {
				study(bindData.pdfStudyTime);
			}
		})

		// 视频播放进度更新（禁止快进 + 保存进度）
		function videoTimeUpdate(e) {
			const currentTime = e.detail.currentTime;

			// 学习完成时不限制进度，可随意观看
			if (bindData.isStudyCompleted) {
				bindData.previousTime = currentTime;
				return;
			}

			// 禁止快进：如果当前播放时间比记录的时间超过2秒，强制跳回
			if (currentTime > bindData.previousTime + 2) {
				bindData.isSeekingBack = true;
				bindData.videoContext.seek(bindData.previousTime);
				// 500ms 后重置标志位
				const timer = setTimeout(() => {
					bindData.isSeekingBack = false;
					clearTimeout(timer)
				}, 500);
			} else {
				// 正常播放时，只有不在跳转状态时才保存进度和更新时间
				if (!bindData.isSeekingBack) {
					antiIdle.saveProgress(currentTime);
					bindData.previousTime = currentTime;
				}
			}
		}

		// 视频播放结束
		async function videoEnded(e) {
			if(bindData.isStudyCompleted) return;
			let time = parseInt(bindData.fileInfo.duration);
			await study(time);
			// 清除保存的进度
			antiIdle.clearSavedProgress();
			uni.showToast({
				title: '学习完成',
				icon: 'success'
			});
			const timer = setTimeout(() => {
				uni.navigateBack();
				clearTimeout(timer);
			}, 3000);
		}

		// 视频播放出错
		function videoError(e) {
			console.error('视频播放错误:', e);
			uni.showToast({
				title: '视频播放失败，请检查网络',
				icon: 'none'
			});
		}

		// 视频开始播放
		function videoPlay(e) {
			antiIdle.setPaused(false);
			// 如果有学习进度且尚未自动定位，则跳转到学习进度位置
			if (bindData.previousTime > 0 && !bindData.hasAutoSeeked) {
				bindData.hasAutoSeeked = true;
				bindData.videoContext && bindData.videoContext.seek(bindData.previousTime);
			}
		}

		// 视频暂停
		function videoPause(e) {
			antiIdle.setPaused(true);
		}

		function initPDF(onReady){
			let pdfContainer = document.getElementById('pdfContainer');
			let pdfUrl = bindData.fileInfo.fileUrl;

			// 根据环境选择合适的PDF加载方式
			// 开发/测试环境使用代理，测试/生产环境尝试直接加载
			const isLocalDev = window.location.hostname === 'localhost';

			if (pdfUrl && pdfUrl.startsWith('https://t.ete56.cn') && isLocalDev) {
				pdfUrl = pdfUrl.replace('https://t.ete56.cn', '/pdf-proxy');
			}

			let pdfOption = {
				url : pdfUrl,
				cMapUrl : '/cmaps/',
				cMapPacked : true,
			}

			// 使用PDF.js加载PDF文件
			window.pdfjsLib.getDocument(pdfOption).promise.then(function(pdf) {
				const totalPages = pdf.numPages;
				let renderedPages = 0;

				// 遍历所有页面
				for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
					// 创建一个用于显示单页的canvas元素
					const canvas = document.createElement('canvas');

					// 将canvas添加到PDF容器中
					pdfContainer.appendChild(canvas);

					// 获取当前页的尺寸
					var page = pdf.getPage(pageNumber).then(function(page){
						// 获取原始viewport（scale: 1）来计算缩放比例
						var originalViewport = page.getViewport({ scale: 1 });
						// 根据容器宽度计算合适的缩放比例，使PDF宽度适应容器
						var containerWidth = window.innerWidth; // 减去左右各16px的边距
						var scale = containerWidth / originalViewport.width;
						// 使用计算出的缩放比例创建viewport
						var viewport = page.getViewport({ scale: scale });
						
						canvas.width = viewport.width;
						canvas.height = viewport.height;
				
						// 渲染当前页到canvas上
						page.render({ 
							canvasContext: canvas.getContext('2d', { alpha: false, antialias: 'subpixel',desynchronized:true }), 
							viewport: viewport,
							enableTextDrawing: true,
							renderInteractiveForms: true,
						}).promise.then(function() {
							renderedPages++;
							// 所有页面渲染完成后执行回调
							if (renderedPages === totalPages && typeof onReady === 'function') {
								// 添加touch事件监听，重置弹窗定时器
								pdfContainer.addEventListener('touchstart', function() {
									if (!bindData.isPdfDialogShowing && !bindData.isStudyCompleted) {
										resetPdfPopupTimer();
									}
								}, { passive: true });
								onReady();
							}
						});
						
					});
				}
			
			}).catch(function(error) {
				console.error('PDF加载失败:', error);
				uni.showToast({
					title: 'PDF加载失败，请刷新重试',
					icon: 'none'
				});
			});
		}

		// 打开PDF全屏观看
		function openPDF(url) {
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			uni.navigateTo({
				url: '/pages/pdfViewer/pdfViewer?url=' + encodeURIComponent(url) + '&fileId=' + bindData.fileInfo.id
			});
			// #endif
		}

		//保存学习进度接口
		async function study(duration) {
			let fileExtId = bindData.fileInfo.id;
			await util.postByBeanName('eduCourseService', 'studyCourse', {
				fileExtId,
				duration
			},null,null,null,false);
		}

		// 返回课程详情
		function goBack() {
			uni.navigateBack();
		}

		// ========== PDF相关方法 ==========

		// 格式化时间显示（秒转为 mm:ss 或 hh:mm:ss）
		function formatTime(seconds) {
			if (seconds <= 0) return '00:00';
			const hours = Math.floor(seconds / 3600);
			const mins = Math.floor((seconds % 3600) / 60);
			const secs = seconds % 60;
			if (hours > 0) {
				return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
			}
			return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
		}

		// 启动PDF倒计时
		function startPdfCountdown() {
			if (bindData.pdfTimer) {
				clearInterval(bindData.pdfTimer);
			}
			bindData.pdfTimer = setInterval(() => {
				// 弹窗显示时暂停倒计时
				if (bindData.isPdfDialogShowing) {
					return;
				}
				if (bindData.pdfCountdown > 0) {
					bindData.pdfCountdown--;
				}
			}, 1000);

			// 学习计时器（每30秒保存一次）
			if (bindData.pdfStudyTimer) {
				clearInterval(bindData.pdfStudyTimer);
			}
			bindData.pdfStudyTimer = setInterval(() => {
				// 弹窗显示时暂停学习计时
				if (bindData.isPdfDialogShowing) {
					return;
				}
				bindData.pdfStudyTime++;
				// 学习满30秒才保存（避免一开始频繁保存）
				if (bindData.pdfStudyTime >= 30 && bindData.pdfStudyTime - bindData.pdfLastSaveTime >= 30) {
					bindData.pdfLastSaveTime = bindData.pdfStudyTime;
					// 同步保存当前倒计时位置
					bindData.pdfLastSaveCountdown = bindData.pdfCountdown;
					bindData.fileInfo.studyDuration = Number(bindData.fileInfo.studyDuration) + bindData.pdfStudyTime;
					study(bindData.fileInfo.studyDuration);
					bindData.pdfStudyTime = 0;
					console.log('PDF学习时间已保存，当前倒计时:', bindData.pdfCountdown);
				}
				// PDF倒计时结束
				if (bindData.pdfCountdown <= 0) {
					handlePdfComplete();
				}
			}, 1000);
		}

		// 停止PDF倒计时
		function stopPdfCountdown() {
			if (bindData.pdfTimer) {
				clearInterval(bindData.pdfTimer);
				bindData.pdfTimer = null;
			}
			if (bindData.pdfStudyTimer) {
				clearInterval(bindData.pdfStudyTimer);
				bindData.pdfStudyTimer = null;
			}
		}

		// 启动PDF防挂机功能
		function startPdfAntiIdle() {
			// 先启动弹窗定时器（超时定时器在弹窗弹出后启动）
			resetPdfPopupTimer();
		}

		// 停止PDF防挂机
		function stopPdfAntiIdle() {
			if (bindData.pdfPopupTimer) {
				clearTimeout(bindData.pdfPopupTimer);
				bindData.pdfPopupTimer = null;
			}
			if (bindData.pdfTimeoutTimer) {
				clearTimeout(bindData.pdfTimeoutTimer);
				bindData.pdfTimeoutTimer = null;
			}
		}

		// 重置PDF弹窗定时器
		function resetPdfPopupTimer() {
			if (bindData.pdfPopupTimer) {
				clearTimeout(bindData.pdfPopupTimer);
			}
			const delay = Math.floor(Math.random() * (antiIdleConfig.popupMaxInterval - antiIdleConfig.popupMinInterval + 1)) + antiIdleConfig.popupMinInterval;
			bindData.pdfPopupTimer = setTimeout(() => {
				showPdfConfirmDialog();
			}, delay * 1000);
		}

		// 重置PDF超时定时器
		function resetPdfTimeoutTimer() {
			if (bindData.pdfTimeoutTimer) {
				clearTimeout(bindData.pdfTimeoutTimer);
			}
			bindData.pdfTimeoutTimer = setTimeout(() => {
				// 超时处理：回滚倒计时到上次保存位置，重置学习计时
				bindData.pdfCountdown = bindData.pdfLastSaveCountdown;
				bindData.pdfStudyTime = 0;
				bindData.pdfLastSaveTime = 0;
				uni.showToast({
					title: '已回滚到上次保存位置',
					icon: 'none',
					duration: 2000
				});
				// 超时后重新启动弹窗定时器
				resetPdfPopupTimer();
			}, antiIdleConfig.timeoutDuration * 1000);
		}

		// 显示PDF防挂机确认弹窗
		function showPdfConfirmDialog() {
			if (bindData.isPdfDialogShowing) return;

			bindData.isPdfDialogShowing = true;
			// 弹窗弹出后启动超时检测
			resetPdfTimeoutTimer();

			uni.showModal({
				title: '学习确认',
				content: `请确认您正在阅读学习。`,
				showCancel: false,
				confirmText: '继续学习',
				success: (res) => {
					bindData.isPdfDialogShowing = false;
					if (res.confirm) {
						// 用户确认后，取消超时计时器，重新开始弹窗定时器
						clearTimeout(bindData.pdfTimeoutTimer);
						resetPdfPopupTimer();
					}
				},
				fail: () => {
					bindData.isPdfDialogShowing = false;
				}
			});
		}

		// PDF学习完成
		function handlePdfComplete() {
			stopPdfAntiIdle();
			stopPdfCountdown();
			study(bindData.fileInfo.duration);
			uni.showToast({
				title: '学习完成',
				icon: 'success'
			});
			const timer = setTimeout(() => {
				uni.navigateBack();
				clearTimeout(timer)
			}, 1500);
		}

		return {
			...toRefs(bindData),
			videoTimeUpdate,
			videoEnded,
			videoError,
			videoPlay,
			videoPause,
			openPDF,
			study,
			goBack,
			// PDF相关
			formatTime,
			startPdfCountdown,
			stopPdfCountdown,
		}
	}
};
