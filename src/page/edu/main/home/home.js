export default {
  name: 'eduHome',
  data() {
    return {

    }
  },
  mounted() {
    this.common.initTheme('edu');
    this.openMain();
  },
  components: {

  },
  methods: {
    // 打开首页
    openMain() {
      this.openTab({
        urlName: "首页",
        urlPath: "/edu/main/home/toMain.vue",
        urlPathName: "/main"
      })
    },
    //打开一个新页面
    openTab(item) {
      //添加路由
      this.$router.addRoute({
        path: item.urlPathName,
        name: item.urlName,
        params: item.params,
        component: () => import(`@/page${item.urlPath}`),
      })
      this.$router.push({ path: item.urlPathName});
    },
    //检测路径，如果后台有配置，则自动跳转，没用则回到首页
    checkUrl() {
      let tab = this.pageInfo;
      let visitPageInfo = this.$store.state.visitPageInfo;
      if (this.common.isNotBlank(visitPageInfo) && (this.common.isBlank(tab) || tab.urlPathName != visitPageInfo.path)) {    //访问可直接访问路径
        this.openTab({
          urlName: decodeURI(visitPageInfo.query.urlName),
          urlId: new Date().getTime(),
          urlPath: visitPageInfo.path,
          urlPathName: visitPageInfo.path,
          query: visitPageInfo.query
        })
      } else if (this.common.isNotBlank(tab)) {    //访问缓存路径
        this.openTab(tab);
      } else if (this.$route.path.indexOf('/static') > -1) {
        return
      }
    },

  }
}
