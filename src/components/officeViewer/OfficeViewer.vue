<template>
  <div class="office-viewer">
    <div id="office-editor-container" v-show="loaded"></div>
    <div v-if="!loaded" class="loading-mask">
      <i class="el-icon-loading"></i>
      <span>文档加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "OfficeViewer",
  props: {
    fileKey: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: 'document'
    },
    mode: {
      type: String,
      default: 'edit' // 'edit' or 'view'
    },
  },
  data() {
    return {
      loaded: false,
      docEditor: null
    };
  },
  watch: {
    // 监听文件URL变化，重新初始化编辑器
    fileUrl(newVal, oldVal) {
      if (newVal !== oldVal && this.docEditor) {
        console.log('=== 文档URL已变化，重新初始化编辑器 ===');
        console.log('旧URL:', oldVal);
        console.log('新URL:', newVal);
        this.destroyEditor();
        this.initEditor();
      }
    },
    fileKey(newVal, oldVal) {
      if (newVal !== oldVal && this.docEditor) {
        console.log('=== 文档Key已变化，重新初始化编辑器 ===');
        console.log('旧Key:', oldVal);
        console.log('新Key:', newVal);
        this.destroyEditor();
        this.initEditor();
      }
    }
  },
  mounted() {
    this.loadScript();
  },
  beforeDestroy() {
    this.destroyEditor();
  },
  methods: {
    loadScript() {
      // 检查是否已经加载了onlyoffice api脚本
      if (window.DocsAPI) {
        this.initEditor();
        return;
      }

      // 动态加载onlyoffice api脚本
      const script = document.createElement('script');
      let onlyOfficeUrl=process.env.VUE_APP_ONLYOFFICE_URL || 'https://prodof.1000e56.com'; // OnlyOffice服务地址
      script.src = `${onlyOfficeUrl}/web-apps/apps/api/documents/api.js`;
      script.onload = () => {
        this.initEditor();
      };
      script.onerror = () => {
        this.$message.error('OnlyOffice服务加载失败，请检查服务是否正常运行');
      };
      document.head.appendChild(script);
    },
    async initEditor() {
      if (!window.DocsAPI) {
        this.$message.error('OnlyOffice API未正确加载');
        return;
      }
      let url = this.fileUrl;
      this.fileUrl = url.replaceAll('https://pt.1000e56.com','http://172.18.160.69:1080');
      this.fileUrl = url.replaceAll('https://t.ete56.cn/','http://172.18.160.68:2080');
      let token = await this.common.postUrl("fileCommonTF", "createToken", {
        url: this.fileUrl,
        fileName: this.fileName,
        key: this.fileKey
      });
      const config = this.buildConfig();
      // 确定文档类型
      let documentType = 'word';
      if (this.fileType === 'xlsx' || this.fileType === 'xls') {
        documentType = 'cell';
      } else if (this.fileType === 'pptx' || this.fileType === 'ppt') {
        documentType = 'slide';
      }
      // OnlyOffice JWT配置：在config中设置token

      config.token = token;

      config.documentType = documentType;
      try {
        this.docEditor = new DocsAPI.DocEditor('office-editor-container', config);
        this.loaded = true;
      } catch (error) {
        console.error('OnlyOffice初始化失败:', error);
        console.error('错误详情:', JSON.stringify(error, null, 2));
        this.$message.error('文档加载失败: ' + error.message);
      }
    },
    buildConfig() {
      const config = {
        document: {
          fileType: this.fileType,
          key: this.fileKey,
          title: this.fileName,
          url: this.fileUrl,
          permissions: {
            comment: this.mode === 'edit',
            download: false,
            edit: this.mode === 'edit',
            fillForms: this.mode === 'edit',
            modifyFilter: this.mode === 'edit',
            modifyContentControl: this.mode === 'edit',
            review: this.mode === 'edit'
          }
        },
        editorConfig: {
          lang: 'zh-CN',
          mode: this.mode === 'edit' ? 'edit' : 'view',
          callbackUrl: '', // 如果需要保存编辑，需要提供回调地址
          user: {
            id: 'viewer',
            name: '预览用户'
          },
          customization:{
            review: {
              hoverMode:true,
              reviewDisplay: "final"
            }
          }
        },
        height: '100%',
        width: '100%',
        type: 'desktop',
      };

      return config;
    },
    destroyEditor() {
      if (this.docEditor) {
        try {
          this.docEditor.destroyEditor();
          console.log('✓ OnlyOffice编辑器已销毁');
        } catch (error) {
          console.warn('销毁OnlyOffice编辑器时出错:', error);
        } finally {
          this.docEditor = null;
          this.loaded = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.office-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  #office-editor-container {
    width: 100%;
    height: 100%;
  }
  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    color: #666;
    font-size: 14px;
    i {
      font-size: 32px;
      margin-bottom: 10px;
      color: #409EFF;
    }
  }
}
</style>
