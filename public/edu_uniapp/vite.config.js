// 项目根目录下的 vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    hotOnly: true,  //热更新
    proxy: {
      '/api': {
        target: 'http://183.6.76.4:38010', // 你的目标服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      },
      // PDF 文件代理 - 解决本地开发跨域问题
      '/pdf-proxy': {
        target: 'https://t.ete56.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf-proxy/, '')
      }
    }
  }
})