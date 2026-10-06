<template>
  <div id="fileViewer">
    <!-- Office文档选择弹窗 -->
    <el-dialog
      :visible.sync="showOfficeDialog"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      width="350px"
      class="office-file-dialog"
      @close="handleDialogClose">
      <div slot="title" class="dialog-title">
        <i class="el-icon-document"></i>
        <span>打开方式</span>
      </div>
      <div class="dialog-content">
        <!-- <div class="file-info">
          <i :class="getFileIcon" class="file-type-icon"></i>
          <span class="file-name">{{ getFileName }}</span>
        </div> -->
        <p class="tip-text">请选择打开此文档的方式</p>
        <div class="action-buttons">
          <el-button
            type="primary"
            size="large"
            icon="el-icon-view"
            @click="handlePreview"
            class="preview-btn">
            在线预览
          </el-button>
          <el-button
            type="default"
            size="large"
            icon="el-icon-download"
            @click="handleDownload"
            class="download-btn">
            下载文件
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 文件预览框架组件 -->
    <fileViewerFrame
      v-if="showFrame"
      :url-list="currentUrlList"
      :isshowClose="isshowClose"
      :initial-index="initialIndex"
      :z-index="zIndex"
      :on-close="closeViewer">
    </fileViewerFrame>
  </div>
</template>

<script>
import fileViewerFrame from '@/components/myFile/file-viewer-frame.vue';

/**
 * 文件预览组件
 * 功能：支持图片、视频、PDF、Office文档(Word/Excel/PPT)的预览
 * - 图片/视频：当前页面直接预览
 * - Office文档：在新标签页中预览
 * - 其他文件类型：直接下载
 */
export default {
  name: "fileViewer",
  components: {
    fileViewerFrame,
  },
  props: {
    // 文件URL列表
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    initialIndex: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      isshowClose: false,    // 是否显示关闭按钮
      showFrame: false,      // 是否显示预览框架
      type: '',              // 文件类型
      localUrlList: [],      // 本地文件URL列表（避免直接修改props）
      showOfficeDialog: false, // Office文档选择弹窗
      pendingFileType: '',    // 待处理的文件类型
      // 支持的文件类型扩展名列表
      typeList: {
        img: ".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
        table: ".xls,.xlsx,.XLS,.XLSX",
        file: "file"
      },
    }
  },
  mounted() {
    // 如果是新标签页打开的fileViewer页面，自动调用show方法
    if (this.isNewTab()) {
      this.show();
    }
  },
  methods: {
    show(){
      this.$nextTick(()=>{
        console.log('fileViewer mounted:', this.currentUrlList);
        this.isshowClose = false;
        this.showFrame = false;
        // 初始化文件列表
        this.initFileList();
        // 根据文件类型执行相应操作
        this.handleFileByType();
      })
    },
    /**
     * 初始化文件列表
     * 如果没有传入urlList，则从URL参数中获取
     */
    initFileList() {
      if (this.urlList.length > 0) {
        this.getFileType();
      } else {
        // 从 URL 参数中提取 url 参数
        const urlParams = new URLSearchParams(window.location.search);
        const url = urlParams.get('url') || '';
        this.localUrlList = [decodeURIComponent(url)];
        this.getFileType();
      }
    },

    /**
     * 根据文件类型执行相应操作
     */
    handleFileByType() {
      switch (this.type) {
        case 'img':
        case 'mp4':
          // 图片和视频：在当前页面预览，显示关闭按钮
          this.isshowClose = true;
          this.showFrame = true;
          break;

        case 'pdf':
          // PDF：在新标签页预览
          if (this.isNewTab()) {
            this.showFrame = true;
            console.log('预览文件:', this.currentUrlList);
          } else {
            const encodeUrl = encodeURIComponent(this.currentUrlList[this.initialIndex] || '');
            window.open(`${window.location.origin}/fileViewer?url=${encodeUrl}`, '_blank');
          }
          break;

        case 'excel':
        case 'word':
        case 'ppt':
          // Office文档：弹出选择框让用户选择预览或下载
          if (this.isNewTab()) {
            this.showFrame = true;
            console.log('预览文件:', this.currentUrlList);
          } else {
            this.pendingFileType = this.type;
            this.showOfficeDialog = true;
          }
          break;

        default:
          // 其他文件类型：直接下载
          if (this.currentUrlList[this.initialIndex]) {
            this.common.downloadFile(this.currentUrlList[this.initialIndex]);
          }
          break;
      }
    },

    /**
     * 获取文件类型
     * 根据文件扩展名判断文件类型
     */
    getFileType() {
      const fullPath = this.currentUrlList[this.initialIndex];
      if (!fullPath) {
        this.type = 'file';
        return;
      }

      // 提取文件扩展名
      const name = fullPath.substring(fullPath.lastIndexOf('/'), fullPath.length);
      const dotIndex = name.indexOf('.');
      const suffix = name.substring(dotIndex, name.length);

      // 根据扩展名判断类型
      let type = this.getFileTypeBySuffix(suffix);

      // 检查是否为图片类型
      if (this.isImageType(suffix)) {
        type = 'img';
      }

      this.type = type;
    },

    /**
     * 根据文件扩展名获取文件类型
     * @param {string} suffix - 文件扩展名（包含点）
     * @returns {string} 文件类型
     */
    getFileTypeBySuffix(suffix) {
      const suffixLower = suffix.toLowerCase();
      if (suffixLower.endsWith('.pdf')) {
        return 'pdf';
      } else if (suffixLower.endsWith('.doc') || suffixLower.endsWith('.docx')) {
        return 'word';
      } else if (suffixLower.endsWith('.ppt') || suffixLower.endsWith('.pptx')) {
        return 'ppt';
      } else if (suffixLower.endsWith('.xls') || suffixLower.endsWith('.xlsx')) {
        return 'excel';
      } else if (suffixLower.endsWith('.mp4')) {
        return 'mp4';
      }
      return 'file';
    },

    /**
     * 判断是否为图片类型
     * @param {string} suffix - 文件扩展名
     * @returns {boolean}
     */
    isImageType(suffix) {
      const imgExtensions = this.typeList.img.split(",");
      return imgExtensions.some(ext => suffix.includes(ext));
    },

    /**
     * 检查当前是否在新标签页的fileViewer页面
     * @returns {boolean}
     */
    isNewTab() {
      return window.location.pathname.includes('fileViewer');
    },

    /**
     * 关闭预览器
     */
    closeViewer() {
      this.showFrame = false;
    },

    /**
     * 处理弹窗关闭
     */
    handleDialogClose() {
      this.showOfficeDialog = false;
      this.pendingFileType = '';
    },

    /**
     * 处理在线预览
     */
    handlePreview() {
      this.showOfficeDialog = false;
      const encodeUrl = encodeURIComponent(this.currentUrlList[this.initialIndex] || '');
      window.open(`${window.location.origin}/fileViewer?url=${encodeUrl}`, '_blank');
    },

    /**
     * 处理下载文件
     */
    handleDownload() {
      this.showOfficeDialog = false;
      if (this.currentUrlList[this.initialIndex]) {
        this.common.downloadFile(this.currentUrlList[this.initialIndex]);
      }
    }
  },
  computed: {
    // 使用 computed 返回本地文件列表
    currentUrlList() {
      return this.localUrlList.length > 0 ? this.localUrlList : this.urlList;
    },

    // 获取文件图标
    getFileIcon() {
      switch (this.pendingFileType) {
        case 'excel':
          return 'el-icon-s-grid';
        case 'word':
          return 'el-icon-document';
        case 'ppt':
          return 'el-icon-s-data';
        default:
          return 'el-icon-document';
      }
    },

    // 获取文件名
    getFileName() {
      const fullPath = this.currentUrlList[this.initialIndex];
      if (!fullPath) return '未知文件';
      const name = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      return name.length > 30 ? name.substring(0, 30) + '...' : name;
    }
  },
};
</script>

<style lang="scss" scoped>
.office-file-dialog {
  ::v-deep .el-dialog {
    border-radius: 12px;
    overflow: hidden;
  }

  ::v-deep .el-dialog__header {
    background: linear-gradient(135deg, #52b7f5 0%, #667eea 100%);
    padding: 20px 25px;
  }

  ::v-deep .el-dialog__title {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
  }

  ::v-deep .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    font-size: 20px;

    &:hover {
      color: #f0f0f0;
    }
  }

  ::v-deep .el-dialog__body {
    padding: 30px 25px;
  }
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 22px;
    color:#fff;
  }
  span{
    color: #fff;
    font-size: 15px;
    font-weight: bold;
  }

}

.dialog-content {
  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 20px;

    .file-type-icon {
      font-size: 36px;
      color: #667eea;
    }

    .file-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      word-break: break-all;
    }
  }

  .tip-text {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-bottom: 25px;
  }

  .action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;

    .el-button {
      flex: 1;
      height: 48px;
      font-size: 15px;
      border-radius: 8px;
      transition: all 0.3s;

      i {
        margin-right: 6px;
      }
    }

    .preview-btn {
      background: linear-gradient(135deg, #52b7f5 0%, #667eea 100%);
      border: none;

      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }

    .download-btn {
      background: #fff;
      border: 2px solid #52b7f5;
      color: #52b7f5;

      &:hover {
        background: #52b7f5;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }
  }
}
</style>
