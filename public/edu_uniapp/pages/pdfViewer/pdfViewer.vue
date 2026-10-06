<template>
	<view class="pdfViewerPage">
		<view class="pdfContainer">
			<!-- PDF加载提示 -->
			<view class="pdfLoading" v-if="isPdfLoading">
				<view class="loadingContent">
					<view class="loadingIcon"></view>
					<text>PDF渲染中...</text>
				</view>
			</view>
			<!-- PDF iframe显示 -->
			<view class="pdfIframe">
				<div id="pdfContainer"></div>
			</view>
		</view>
	</view>
</template>

<script>
	import pdfViewer from './pdfViewer.js'
	export default pdfViewer
</script>

<style lang="scss" scoped>
.pdfViewerPage{
	height: 100%;
	.pdfContainer {
		height: 100%;
		position: relative;

		.pdfLoading {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f5f5f5;

			.loadingContent {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 20rpx;

				.loadingIcon {
					width: 60rpx;
					height: 60rpx;
					border: 4rpx solid #ddd;
					border-top-color: #e50011;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				text {
					color: #666;
					font-size: 28rpx;
				}
			}
		}
	}
}
</style>
