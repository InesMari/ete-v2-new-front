import 'swiper/dist/js/swiper'
import 'swiper/dist/css/swiper.css'
import Swiper from "swiper"
import bookDetail from '../books/bookDetail.vue'

export default {
    name: 'toMain',
    data() {
        return {
            homeData:[[],[],[],[],[],[],[]],
            courseClassData:[],
            homeType:1,
            param:{
                searchKey:'',
                stateStr: '',
            },
            list:[{}],
        }
    },
    mounted() {
        if (this.$route.path == '/main') {
            this.$store.commit('resetData', {name: 'componentName', data: 'eduHome'});
        }
        this.listenPopstate();
        this.doQuery();
        this.initData();
    },
    components: {
        bookDetail,
    },
    methods: {
        // 监听后退
        listenPopstate(){
            let _this = this;
            window.addEventListener("popstate", this.goback, false);
        },
        goback(e){
            e.preventDefault();
            this.homeType = 1;
            this.$router.go(-1)
        },
        async doQuery(){
            this.homeData = await this.common.postUrl("eduHomeService", "queryHomeColumn");
            this.homeData.forEach(arr => {
                arr.forEach(item => {
                    if(this.common.isNotBlank(item.imgUrl)) item.imgUrl = this.common.getBigImgPath(item.imgUrl);
                })
            })
            this.$nextTick(()=>{
                this.initSwiper();  //初始化轮播图
            })
        },
        async queryCourse(item,type){
            if(item.codeValue=='-99'){
                this.homeType = 1;
                this.list = [{}];
                return;
            }
            if(type == 2){
                this.param.oneClass = item.codeId;
                this.param.twoClass = item.codeValue;
            }else{
                this.param.oneClass = item.codeValue;
                this.param.twoClass = undefined;
            }
            this.param.studentFlg = 1;
            this.homeType = 2;            
            let {items} = await this.common.postUrl("eduCourseService", "queryEduCourseInfoPage", this.param);
            this.list = items;
        },
        // 初始化数据
        async initData(){
            this.courseClassData = await this.common.postUrl("eduHomeService", "getSysStaticData");
            this.courseClassData.unshift({codeValue:'-99',codeName:'首页',childrens:[]});
            this.eduCourseData = await this.common.postUrl("eduCourseService", "getAllEduCourseInfos");
        },
        initSwiper() {
            new Swiper('#banner', {
                direction: 'horizontal', // 垂直切换选项
                //mousewheel: true, //滚轮
                autoplay: { //自动开始
                    delay: 2000, //时间间隔
                    disableOnInteraction: false, //*手动操作轮播图后不会暂停*
                },
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true, // 分页器可以点击
                },

                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                // 如果需要滚动条
                scrollbar: {
                    el: '.swiper-scrollbar',
                },
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
            })
            new Swiper('#result', {
                direction: 'horizontal', // 垂直切换选项
                //mousewheel: true, //滚轮
                autoplay: { //自动开始
                    delay: 2500, //时间间隔
                    disableOnInteraction: false, //*手动操作轮播图后不会暂停*
                },
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true, // 分页器可以点击
                },

                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                // 如果需要滚动条
                scrollbar: {
                    el: '.swiper-scrollbar',
                },
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
            })
        },
        // 去到学生个人中心
        toStudent() {
            this.$store.commit('resetData',{name:'componentName',data:'eduStudentHome'});
            localStorage.setItem("defaultUrl","eduStudentHome");
        },
        hotLearn(id){
            this.toLearn({id})
        },
        toBookDetail(id){
            // this.$store.commit('resetData',{name:'componentName',data:'eduStudentHome'});
            // localStorage.setItem("defaultUrl","eduStudentHome");
            // let obj = {
            //     urlName: "查看书籍",
            //     urlId: "bookDetail"+id+new Date().getTime(),
            //     urlPath: "/edu/main/books/bookDetail.vue",
            //     urlPathName: "/bookDetail",
            //     query:{id}
            // }
            // sessionStorage.setItem("entryInfo",JSON.stringify(obj));
            this.bookId = id;
            this.homeType = 3;
        },
        // 去学习
        toLearn(item){
            if(this.common.isBlank(item.id)) return;
            this.$store.commit('resetData',{name:'componentName',data:'eduStudentHome'});
            localStorage.setItem("defaultUrl","eduStudentHome");
            let obj = {
                urlName: "查看课程",
                urlId: "courseDetail"+item.id,
                urlPath: "/edu/student/course/courseDetail.vue",
                urlPathName: "/courseDetail",
                query:{courseId:item.id}
            }
            sessionStorage.setItem("entryInfo",JSON.stringify(obj));
        },
    },
    destroyed(){
        const timer = setTimeout(() => {
            clearTimeout(timer);
            window.removeEventListener("popstate", this.goback);
        }, 500);
    }
}
