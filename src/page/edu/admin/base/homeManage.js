import 'swiper/dist/js/swiper'
import 'swiper/dist/css/swiper.css'
import Swiper from "swiper"
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'homeManage',
    data() {
        return {
            homeData:[[],[],[],[],[],[],[]],
            courseClassData:[],
            eduCourseData:[],
            bookData:[],
            currentColumn:[],
            activeModel:-1,
            currentTitle:'请点击选择需要设置的模块',
        }
    },

    mounted() {
        this.doQuery();     //查询首页数据
        this.initData();    //初始化数据
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    methods: {
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
        // 初始化数据
        async initData(){
            this.courseClassData = await this.common.postUrl("eduHomeService", "getSysStaticData");
            this.eduCourseData = await this.common.postUrl("eduCourseService", "getAllEduCourseInfos");
            this.bookData = await this.common.postUrl("eduBookService", "queryAllEduBookInfo");
        },
        // 初始化设置
        initCurrentColumn(index){
            if(this.homeData[index].length == 0){
                this.currentColumn = [{}];
                this.$nextTick(()=>{    //清除残留图片
                    this.$refs['imgCover0'][0].clean();
                })
            }else{
                this.currentColumn = this.common.copyObj(this.homeData[index]);
                if(index==1 || index==5) return;    //热门课程和好书推荐
                this.$nextTick(()=>{
                    this.currentColumn.forEach((item,index) => {
                        this.$refs['imgCover'+index][0].initDate(item.imgId);
                    })
                })
            }
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
        // 模块点击
        changeAcitve(index){
            switch(index){
                case 0: //banner
                    this.currentTitle = '轮播图设置';
                    this.tip = "请上传1920*500尺寸图片"
                    break;
                case 1: //热门课程
                    this.currentTitle = '热门课程设置';
                    break;
                case 3: //讲师团队
                    this.currentTitle = '讲师团队设置';
                    this.tip = "请上传1920*280尺寸图片"
                    break;
                case 4: //学习成果
                    this.currentTitle = '学习成果设置';
                    this.tip = "请上传1920*400尺寸图片"
                    break;
                case 5: //好书推荐
                    this.currentTitle = '好书推荐设置';
                    this.tip = "请上传400*400尺寸图片"
                    break;
                case 6: //底栏
                    this.currentTitle = '底栏设置';
                    this.tip = "请上传1920*280尺寸图片"
                    break;
            }
            this.activeModel = index;
            this.initCurrentColumn(index);
        },
        // 上传成功回调
        successCallback(data){
            let index = data.componentId;
            this.currentColumn[index].imgId = data.flowId;
            this.currentColumn[index].imgPath = data.storePath;
        },
        // 选择课程
        selectCourse(value,index){
            if(this.activeModel == 1){
                this.eduCourseData.forEach(item => {
                    if(item.id == value){
                        this.currentColumn[index].imgId = item.imgId;
                        this.currentColumn[index].imgPath = item.imgPath;
                        this.currentColumn[index].content = item.courseName;
                    }
                })
            }
        },
        selectBook(value,index){
            if(this.activeModel == 5){
                this.bookData.forEach(item => {
                    if(item.id == value){
                        this.currentColumn[index].imgId = item.imgId;
                        this.currentColumn[index].imgPath = item.imgPath;
                        this.currentColumn[index].content = item.bookName;
                    }
                })
            }
        },
        // 添加
        addImg(){
            let max;
            switch(this.activeModel){
                case 0: //banner
                    max = 5
                    break;
                case 1: //热门课程
                    max = 6
                    break;
                case 3: //讲师团队
                    max = 1
                    break;
                case 4: //学习成果
                    max = 3
                    break;
                case 5: //好书推荐
                    max = 5
                    break;
                case 6: //底栏
                    max = 1
                    break;
            }
            if(this.currentColumn.length < max){
                this.currentColumn.push({});
            }else{
                this.$message.error("超出上限")
            }
        },
        // 删除
        delImg(index){
            if(this.currentColumn.length==1){
                this.$message.error("至少保留一个")
                return
            }
            this.currentColumn.splice(index,1);
        },
        //保存
        async save(){
            let type = Number(this.activeModel)+1;
            await this.common.postUrl("eduHomeService", "setHomeColumn",{type,columns:this.currentColumn});
            this.$message.success("保存成功");
            this.doQuery();
        },
    }
}
