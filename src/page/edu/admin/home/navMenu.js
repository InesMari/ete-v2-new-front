export default {
    name: 'navMenu',
    data() {
        return {
            tabs:[],
            routeId:'-1',
            isshowNav:true,
            allMenus:[],    //所有菜单(二级)
            menuSearch:"",
            isshowMenuList:false,
        }
    },
    mounted() {
        this.initDevTab();
        this.loadMenuTree();
        this.$nextTick(()=>{
            this.routeId = this.$store.state.routeId+'';

        })
    },
    components: {
        
    },
    methods: {
        openTab(item){
            item.query = item.query?item.query:{};
            item.query.pId = item.entityId;
            this.$emit("openTab",item);
            this.openMenuList(false);
        },
        openMenuList(flag)
        {
            if (flag)
            {
                if (this.isshowMenuList)
                    this.isshowMenuList = false;
                else
                    this.isshowMenuList = flag;
            }
            else
                this.isshowMenuList = flag;
            this.$forceUpdate();
        },
        /**
         * 加载菜单树
         */
        async loadMenuTree()
        {
            let data = await this.common.postUrl("menuTF", "loadMenuTree",{entityId:4001001});
            this.tabs = [...this.tabs,...data];
        },
        // 侧边栏展示隐藏
        navMenuSwitch(){
            this.isshowNav = this.isshowNav?false:true;
            this.$emit("navMenuSwitch",this.isshowNav);
        },
        /**
         * 搜素菜单
         */
        searchMenu(){
            this.menuSearchList = [];
            this.eachMenus(this.allMenus);
        },
        /**
         * 深度遍历所有菜单
         */
        eachMenus(data){
            data.forEach(el => {
                if(el.urlName.indexOf(this.menuSearch)>-1 && el.parentId!=10000 && el.parentId!=-1){
                    this.menuSearchList.push(el);   //插值
                }
                // 递归
                if(el.children.length>0){
                    this.eachMenus(el.children);
                }
            })
            this.$forceUpdate();
        },
        initDevTab(){
            if(window.location.href.indexOf('localhost')>-1){
                this. tabs = [
                    {
                        urlName: "demo(本地才显示)",
                        urlId: "000",
                        children:[
                            {
                                urlName: "上传视频demo",
                                urlId: "videoDemosadfasdf",
                                urlPath: '/demo/videoDemo/videoDemo.vue',
                                urlPathName: "/videoDemo.vue",
                                children:[]
                            },
                            {
                                urlName: "课程管理",
                                urlId: "courseManage111",
                                urlPath: '/edu/admin/course/courseManage.vue',
                                urlPathName: "/courseManage.vue",
                                children:[]
                            },
                            {
                                urlName: "新增课程",
                                urlId: "addCourse",
                                urlPath: '/edu/admin/course/addCourse.vue',
                                urlPathName: "/addCourse.vue",
                                children:[]
                            },
                            {
                                urlName: "添加试卷",
                                urlId: "addExam",
                                urlPath: '/edu/admin/exam/addExam.vue',
                                urlPathName: "/addExam.vue",
                                children:[]
                            },
                        ]
                    }
                ]
            }
        }
    }
}