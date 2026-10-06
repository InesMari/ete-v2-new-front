export default {
    name: 'navMenu',
    data() {
        return {
            tabs:[
                {
                    children: [],
                    urlId: 5001001,
                    entityId: 5001001,
                    urlName: "控制中心",
                    urlPath: "/edu/student/home/toMain.vue",
                    urlPathName: "/student",
                },
                {
                    children: [],
                    urlId: 5001002,
                    entityId: 5001002,
                    urlName: "我的课程",
                    urlPath: "/edu/student/course/myCourse.vue",
                    urlPathName: "/student",
                },
                {
                    children: [],
                    urlId: 5001003,
                    entityId: 5001003,
                    urlName: "学习记录",
                    urlPath: "/edu/student/exam/examRecord.vue",
                    urlPathName: "/student",
                },
                // {
                //     children: [],
                //     urlId: 5001004,
                //     entityId: 5001004,
                //     urlName: "考试评卷",
                //     urlPath: "/edu/student/exam/examScore.vue",
                //     urlPathName: "/student",
                // },
            ],
            routeId:'-1',
            isshowNav:true,
            allMenus:[],    //所有菜单(二级)
            menuSearch:"",
            isshowMenuList:false,
        }
    },
    mounted() {
        // this.initDevTab();
        // this.loadMenuTree();
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
            // let data = await this.common.postUrl("menuTF", "loadMenuTree",{});
            // this.tabs = [...this.tabs,...data];
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
                this.tabs = [
                    {
                        urlName: "demo(本地才显示)",
                        urlId: "000",
                        children:[
                            {
                                urlName: "我的课程",
                                urlId: "myCourse",
                                urlPath: '/edu/student/course/myCourse.vue',
                                urlPathName: "/myCourse.vue",
                                children:[]
                            },
                            {
                                urlName: "学习记录",
                                urlId: "examRecord",
                                urlPath: '/edu/student/exam/examRecord.vue',
                                urlPathName: "/examRecord.vue",
                                children:[]
                            },
                            {
                                urlName: "考试评卷",
                                urlId: "examScore",
                                urlPath: '/edu/student/exam/examScore.vue',
                                urlPathName: "/examScore.vue",
                                children:[]
                            },
                        ]
                    }
                ]
            }
        }
    }
}