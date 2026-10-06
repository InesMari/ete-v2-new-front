<template>
  <transition name="viewer-fade">
    <div tabindex="-1" ref="el-image-viewer__wrapper" class="el-image-viewer__wrapper" :style="{ 'z-index': zIndex }">
      <div class="el-image-viewer__mask" v-if="!isPdf&&!isOffice&&!isVideo"></div>
      <!-- CLOSE -->
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide" v-if="isshowClose">
        <i class="el-icon-circle-close" style="color:#fff;"></i>
      </span>
      <iframe v-if="isPdf"  :src="currentFile" style="width:100%;height:100%;border:none;"></iframe>
      <div v-if="isOffice" style="width:100%;height:100%;border:none;">
        <!-- OnlyOffice文档预览弹窗 -->
          <OfficeViewer
              :fileKey="currentFile.officeFileKey"
              :fileUrl="currentFile.officeFileUrl"
              :fileType="currentFile.officeFileType"
              :fileName="currentFile.officeFileName"
              :mode="currentFile.mode"
          />
      </div>
      <div v-if="isVideo" class="video-container">
        <video ref="videoPlayer" :src="currentFile" controls autoplay></video>
      </div>

      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="el-icon-arrow-left"/>
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="el-icon-arrow-right"/>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="el-image-viewer__btn el-image-viewer__actions" v-if="!isPdf&&!isOffice&&!isVideo">
        <div class="el-image-viewer__actions__inner">
          <i title="缩小" class="el-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i title="放大" class="el-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i title="打印" class="el-icon-printer" @click="print"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i title="逆时针旋转" class="el-icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i title="顺时针旋转" class="el-icon-refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas"  v-if="!isPdf&&!isOffice&&!isVideo">
        <img
          v-for="(url, i) in urlList"
          v-if="i === index"
          ref="img"
          class="el-image-viewer__img"
          :key="url"
          :src="currentFile"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown">
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from 'element-ui/src/utils/dom';
import { rafThrottle, isFirefox } from 'element-ui/src/utils/util';
import OfficeViewer from "@/components/officeViewer/OfficeViewer.vue";

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
};

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

export default {
  name: 'fileViewerFrame',
  components: {
    OfficeViewer
  },

  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    isshowClose: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      pdfSrc:''
    };
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    isPdf(){
      let fileName = this.urlList[this.index];
      if(fileName==''||fileName==undefined){
        return false;
      }
      var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      return 'pdf'===fileExtension.toLowerCase();
    },
    isOffice(){
      let fileName = this.urlList[this.index];
      if(fileName==''||fileName==undefined){
        return false;
      }
      let fileType = this.common.getFileType('',fileName);
      return fileType=='excel'||fileType=='word'||fileType=='ppt';
    },
    isVideo(){
      let fileName = this.urlList[this.index];
      if(fileName==''||fileName==undefined){
        return false;
      }
      let fileType = this.common.getFileType('',fileName);
      return fileType=='mp4';
    },
    isFirst() {
      return this.index === 0;
    },
    isLast() {
      return this.index === this.urlList.length - 1;
    },
    currentFile() {
      let fileName = this.urlList[this.index];
      if(!fileName) return '';

      if(this.isPdf){
        // PDF预览时移除filename参数以避免触发下载
        let pdfUrl = fileName.replaceAll('_big','');
        if (pdfUrl.includes('filename=')) {
          try {
            const urlObj = new URL(pdfUrl, window.location.origin);
            urlObj.searchParams.delete('filename');
            return urlObj.toString();
          } catch (e) {
            // URL解析失败，返回原路径
            return pdfUrl;
          }
        }
        return pdfUrl;
      }else if(this.isOffice){
        const dotIndex = fileName.lastIndexOf('.');
        const fileExtension = dotIndex > -1 ? fileName.substring(dotIndex + 1) : '';
        let officeFileKey = this.common.getRealFileName(fileName);
        let officeFileUrl = fileName;
        let officeFileType = fileExtension;
        let officeFileName = this.common.getSrcFileName(fileName);
        let mode = 'view';
        return {officeFileKey,officeFileUrl,officeFileType,officeFileName,mode};
      }else if(this.isVideo){
        return fileName
      }
      // 图片使用大图路径
      const slashIndex = fileName.lastIndexOf('/');
      const dotIndex = fileName.lastIndexOf('.');
      if(slashIndex > -1 && dotIndex > -1) {
        const host = fileName.substring(0, slashIndex);
        if(host.includes('ete56.cn') || host.includes('1000e56.com')){
          return this.common.getBigImgPath(fileName);
        }
      }
      // 非指定域名，移除_big后缀
      return fileName.replaceAll('_big','');
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%';
      }
      return style;
    }
  },
  watch: {
    index: {
      handler: function(val) {
        this.reset();
        this.onSwitch(val);
      }
    },
    currentFile(val) {
      this.$nextTick(_ => {
        if(!this.isPdf && !this.isOffice){
          const $img = this.$refs.img[0];
          if (!$img.complete) {
            this.loading = true;
          }
        }
      });
    }
  },
  methods: {
    hide() {
      // 如果是视频，先暂停
      if (this.isVideo && this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
      }
      this.deviceSupportUninstall();
      this.onClose();
    },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn');
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut');
            break;
        }
      });
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          });
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          });
        }
      });
      on(document, 'keydown', this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = '加载失败';
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;

      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, 'mousemove', this._dragHandler);
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler);
      });

      e.preventDefault();
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    toggleMode() {
      if (this.loading) return;

      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev() {
      if (this.isFirst && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      };
      const { transform } = this;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case 'clocelise':
          transform.deg += rotateDeg;
          break;
        case 'anticlocelise':
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
    print() {
      const img = this.$refs.img[0];
      if (!img) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        this.$message.error('打印窗口打开失败，请允许弹窗后重试');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>打印图片</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @page {
              size: auto;
              margin: 0;
            }
            @media print {
              @page {
                size: auto;
                margin: 0;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <img src="${img.src}" onload="window.print(); window.close();" />
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  },
  mounted() {
    this.deviceSupportInstall();
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['el-image-viewer__wrapper'].focus();
  }
};
</script>
<style lang="scss" scoped>
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  video {
    max-width: 100%;
    max-height: 100%;
  }
}
.el-image-viewer__actions__inner>i{
  cursor: pointer;
}
</style>
