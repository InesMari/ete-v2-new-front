import {
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
	nextTick,
	toRefs
} from "vue";

export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			isPdfLoading:true
		})

		// 获取页面参数
		onLoad((options) => {
			let url = decodeURIComponent(options.url);
			nextTick(()=>{
				initPDF(url);
			})
		})
		
		function initPDF(url){
			let pdfContainer = document.getElementById('pdfContainer');
			let pdfUrl = url;

			// 根据环境选择合适的PDF加载方式
			// 开发/测试环境使用代理，测试/生产环境尝试直接加载
			const isLocalDev = window.location.hostname === 'localhost';

			if (pdfUrl && pdfUrl.startsWith('https://t.ete56.cn') && isLocalDev) {
				pdfUrl = pdfUrl.replace('https://t.ete56.cn', '/pdf-proxy');
			}
			let pdfOption = {
				url:pdfUrl,
				cMapUrl : '/cmaps/',
				cMapPacked : true,
			}
			// 使用PDF.js加载PDF文件
			window.pdfjsLib.getDocument(pdfOption).promise.then(function(pdf) {
				const totalPages = pdf.numPages;
				// 遍历所有页面
				for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
					// 创建一个用于显示单页的canvas元素
					const canvas = document.createElement('canvas');

					// 将canvas添加到PDF容器中
					pdfContainer.appendChild(canvas);

					// 获取当前页的尺寸
					var page = pdf.getPage(pageNumber).then(function(page){
						// 根据容器宽度计算合适的缩放比例
						var containerWidth = pdfContainer.clientWidth;
						// 获取原始viewport（scale: 1）
						var originalViewport = page.getViewport({ scale: 1 });
						// 根据容器宽度计算缩放比例，使PDF宽度适应容器
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
							bindData.isPdfLoading = false;
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

		// 返回章节
		function goBack() {
			uni.navigateBack();
		}

		return {
			...toRefs(bindData),
		}
	}
};
