import myTab from '@/components/myTab/myTab.vue'
import navMenu from './navMenu.vue'

export default {
    name: 'studentHome',
    data() {
        return {
            keepAlivePage : this.$store.state.keepAlivePage,
            isshowNav:true,
            isshowInfoList:false, //右上 - 是否展示个人信息
            userName:this.common.userInfo().userName,
        }
    },
    created(){
        this.path = this.$route.path;
    },
    mounted() {
        this.common.initTheme('edu');
        this.pageInfo = JSON.parse(localStorage.getItem("pageInfo"));
        this.openMain();
        this.checkUrl();
        this.checkForm();
    },
    components: {
        myTab,
        navMenu,
    },
    methods: {
        checkForm(){
            let entryInfo = sessionStorage.getItem("entryInfo");
            if(this.path == "/main" && this.common.isNotBlank(entryInfo)){
                entryInfo = JSON.parse(entryInfo)
                let _this = this;
                setTimeout(() => {                    
                    _this.openTab(entryInfo);
                    sessionStorage.removeItem("entryInfo");
                });
            }
        },
        // 打开首页
        openMain(){
            this.openTab({
                children: [],
                urlId: 5001001,
                entityId: 5001001,
                urlName: "控制中心",
                urlPath: "/edu/student/home/toMain.vue",
                urlPathName: "/student",
            })
        },
        openOperate(){
            window.open("/static/pdf/易迁易学堂.pdf","_blank");
        },
        //打开一个新页面
        openTab(item) {
            this.$refs.myTab.openTab(item);
        },
        /**
         * 关闭页面
         * @param {页面id} id 
         * @param {父页面id} parentId 
         * @param {是否执行父页面方法} isDoParentMethod 
         * @param {执行父页面的方法名，不传默认doQuery} parentMethodName 
         */
        closeTab(id,parentId,isDoParentMethod,parentMethodName){
            this.$refs.myTab.close(id,parentId,isDoParentMethod,parentMethodName);
        },
        //关闭其它页面
        closeOthers() {
            this.$refs.myTab.closeOthers();
        },
        //关闭当前页面转到父级页面
        closeToOther(id){
            this.closeTab(id,this.$route.meta.parentId);
        },
        //刷新tab
        refreshTab(id,query){
            this.$refs.myTab.refresh(id,query);
        },
        //刷新全部tab
        refreshAllTab(){
            this.$refs.myTab.refreshAll();
        },
        navMenuSwitch(state){
            this.isshowNav = state;
        },
        //检测路径，如果后台有配置，则自动跳转，没用则回到首页
        checkUrl(){
            let tab = this.pageInfo;
            let visitPageInfo = this.$store.state.visitPageInfo;
            if(this.common.isNotBlank(visitPageInfo) && (this.common.isBlank(tab) || tab.urlPathName!=visitPageInfo.path)){    //访问可直接访问路径
                this.openTab({
                    urlName: decodeURI(visitPageInfo.query.urlName),
                    urlId: new Date().getTime(),
                    urlPath: visitPageInfo.path,
                    urlPathName: visitPageInfo.path,
                    query:visitPageInfo.query
                })
            }else if(this.common.isNotBlank(tab)){    //访问缓存路径
                this.openTab(tab);
            }else if(this.$route.path.indexOf('/static')>-1){
                return
            }
        },
        // 展示右上角个人信息
        showInfoList(){
            this.isshowInfoList = true;
        },
        // 退出登录
        logout(){
            let that = this;
            this.common.postUrl("userTF", "logout", {}, function (data) {
                if(data){
                    that.$store.commit('resetData',{name:'componentName',data:'eduLogin'});
                    localStorage.removeItem("defaultUrl");
                    localStorage.removeItem("token");
                    localStorage.removeItem("entityIds");
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("rememberAccount");
                    localStorage.removeItem("pageInfo");
                    const timer = new Date().getTime();
                    window.location.href=`/edu?ver=${timer}`;
                }
            });
        },
        toHome(){
            this.$store.commit('resetData',{name:'componentName',data:'eduHome'});
        },
    },
}
