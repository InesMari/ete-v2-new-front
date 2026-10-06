import myFileModel from '@/components/myFileModel/myFileModel.vue';
import WangEditor from "@/components/wangEditor/wangEditor.vue";
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'addCourse',
    data()
    {
        return {
            showType:1, //1展示课程管理，2展示章节课程
            course:{
                baseInfo:{
                    files:[{}],
                    isRequired: '1', // 1-必修课，2-选修课
                },
                positions: [], // 指定学习岗位
                chapters:[
                    {
                        files:[]
                    }
                ]
            },
            creditData:[],  //学分
            courseOneClass:[],  //课程分类
            courseTwoClass:[],  //二级分类
            courseTwoClassShow:[],
            staffData:[],   //人员列表
            positionsData:[], // 全部岗位
            isPositionsDialog: false, // 指定学习岗位弹窗
            dbHead:[
                {name:"岗位名称",code:"positionName",width:"100"},
                {name:"备注",code:"remark",width:"150"},
            ],
            currentChapter:0,
            videoSrc:"",
            // 时长设置对话框
            showDurationDialog: false,
            durationForm: {
                fileName: '',
                fileIndex: -1,
                minutes: 0,
                seconds: 0
            },
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();
        this.initCreditData();
        if(this.common.isNotBlank(this.$route.query.id)){
            this.doQuery();
        }
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        WangEditor,
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        // 格式化时长显示为"xx分xx秒"
        formatDuration(seconds) {
            if (!seconds || seconds <= 0) return '';
            const mins = Math.floor(seconds / 60);
            const secs = Math.round(seconds % 60); // 秒数取整
            if (mins === 0) {
                return `${secs}秒`;
            }
            return `${mins}分${secs}秒`;
        },
        async initData(){
            // 第一级课程分类
            this.courseOneClass = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COURSE_ONE_CLASS"});
            // 第二级课程分类
            this.courseTwoClass = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COURSE_TWO_CLASS"});
            // 人员列表
            this.staffData = await this.common.postUrl("regionOrgTF", "queryStaffData", {});
            // 全部岗位列表
            this.positionsData = await this.common.postUrl("eduCourseService", "getAllPositions");
        },
        async doQuery(){
            this.course = await this.common.postUrl("eduCourseService", "getEduCourseInfo", {id: this.$route.query.id});
            // 类型转换
            this.course.baseInfo.lecturers = this.course.baseInfo.lecturers.split(",").map(Number);
            this.course.baseInfo.oneClass = String(this.course.baseInfo.oneClass);
            this.course.baseInfo.twoClass = String(this.course.baseInfo.twoClass);
            this.course.baseInfo.isRequired = String(this.course.baseInfo.isRequired || '1');
            // 获取已指定岗位
            const setPositions = await this.common.postUrl("eduCourseService", "getAllSetPositions", {courseId: this.$route.query.id});
            this.course.positions = setPositions || [];
            this.courseOneClassChange()
            this.$nextTick(()=>{
                this.$refs.wangEditor.setEditor(this.course.baseInfo.introduction);
                this.$refs.imgCover.initDate(this.course.baseInfo.imgId);
                this.course.baseInfo.files.forEach((item,index) => {
                    this.$refs['file'+index][0].initDate(item.fileId);
                })
            })
        },
        // 初始化学分枚举
        initCreditData(){
            for(let i=1; i<6; i++){
                let obj = {codeValue:i,codeName:i};
                this.creditData.push(obj);
            }
        },
        // 选择第一级课程分类
        courseOneClassChange(e){
            if(this.common.isNotBlank(e)){
                this.course.baseInfo.twoClass = null;
            }
            this.courseTwoClassShow = [];
            let haveNext = false;
            this.courseTwoClass.forEach(item => {
                if(item.codeId == this.course.baseInfo.oneClass){
                    this.courseTwoClassShow.push(item);
                    haveNext = true;
                }
            })
            if(this.common.isNotBlank(e) && this.course.baseInfo.oneClass == 1){
                // 必修
                this.course.baseInfo.isRequired = '1';
            }else if(this.common.isNotBlank(e) && this.course.baseInfo.oneClass != 1){
                // 选修
                this.course.baseInfo.isRequired = '2';
            }
            this.$forceUpdate();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        // 课程类型切换
        onCourseTypeChange(val){
            if(val == '1'){
                this.course.positions = [];
            }
            if(val == '2'){
                // 选修课：初始化岗位数据
                if(!this.course.positions){
                    this.course.positions = [];
                }
            }
            this.$forceUpdate();
        },
        // 打开指定学习岗位弹窗
        openPositionsDialog(){
            this.isPositionsDialog = true;
            this.$nextTick(() => {
                // 右边：已选岗位
                this.$refs.dbTable.setRightData(this.course.positions || []);
                // 左边：全部可选岗位
                let positionsData = this.common.copyObj(this.positionsData)
                this.$refs.dbTable.setLeftData(positionsData);
                this.$refs.dbTable.changeTop(0);
                this.$refs.dbTable.changeTop(0, 'right');
            });
        },
        // 保存指定学习岗位
        savePositions(){
            this.course.positions = this.$refs.dbTable.getRightData() || [];
            this.isPositionsDialog = false;
            this.$forceUpdate();
        },
        // 切换tab
        changeTab(type){
            this.showType = type;
        },
        /**
         * 封面上传回调
         * @param imgData
         */
         imgCoverCallback(data)
        {
            this.course.baseInfo.imgId = data.flowId;
            this.course.baseInfo.imgPath = data.storePath;
        },
        /**
         * 课件上传回调
         * @param data
         */
         fileCallback(data)
        {
            let index = data.componentId;
            this.course.baseInfo.files[index].fileId = data.flowId;
            this.course.baseInfo.files[index].filePath = data.storePath;
            if(index < 2 && this.course.baseInfo.files.length-2 < index){
                this.course.baseInfo.files.push({});
            }
        },
        /**
         * 课程上传回调
         * @param data
         */
         chapterCallback(data)
        {
            let obj = {};
            obj.fileName = data.fileName;
            obj.fileId = data.flowId;
            obj.filePath = data.storePath;
            
            // 获取后缀名
            const dotIndex = data.fileName.lastIndexOf('.');
            obj.name = data.fileName.substring(0, dotIndex);
            obj.fileType = data.fileName.substring(dotIndex+1, data.fileName.length);
            
            // 判断是否为视频文件
            const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
            const isVideo = videoTypes.includes(obj.fileType.toLowerCase());
            obj.isVideo = isVideo ? 1 : 0;
            
            if (isVideo) {
                // 视频文件：自动获取时长（秒数取整）
                this.videoSrc = data.fileUrl;
                obj.duration = 0; // 先设置默认值
                this.course.chapters[this.currentChapter].files.push(obj);
                
                let _this = this;
                this.$nextTick(() => {
                    var video = document.getElementById("myVideo");
                    video.addEventListener('canplaythrough', function() {
                        let index = _this.course.chapters[_this.currentChapter].files.length-1;
                        // 秒数取整
                        _this.course.chapters[_this.currentChapter].files[index].duration = Math.round(this.duration);
                        _this.$forceUpdate();
                    });
                });
            } else {
                // 非视频文件：弹出对话框让用户设置时长（精确到秒）
                obj.duration = 0; // 默认值
                this.course.chapters[this.currentChapter].files.push(obj);
                
                // 显示时长设置对话框
                this.durationForm.fileName = data.fileName;
                this.durationForm.fileIndex = this.course.chapters[this.currentChapter].files.length - 1;
                this.durationForm.minutes = 1; // 默认1分钟
                this.durationForm.seconds = 0;
                this.showDurationDialog = true;
            }
            
            // 上传后清空
            this.$refs.addChapter.clean();
        },
        // 删除章节课件
        delChapter(index){
            this.course.chapters[this.currentChapter].files.splice(index,1);
            this.$forceUpdate();
        },
        // 新增章节
        addCourse(){
            this.course.chapters.push({files:[]});
            this.currentChapter = this.course.chapters.length -1;
        },
        // 确认设置时长
        confirmDuration() {
            const totalSeconds = this.durationForm.minutes * 60 + this.durationForm.seconds;
            if (!totalSeconds || totalSeconds < 1) {
                this.$message.error('请输入有效的时长');
                return;
            }
            let fileIndex = this.durationForm.fileIndex;
            // 秒数取整
            this.course.chapters[this.currentChapter].files[fileIndex].duration = Math.round(totalSeconds);
            this.showDurationDialog = false;
            this.$forceUpdate();
        },
        // 编辑时长
        editDuration(index) {
            let file = this.course.chapters[this.currentChapter].files[index];
            this.durationForm.fileName = file.fileName;
            this.durationForm.fileIndex = index;
            // 将秒数转换为分钟和秒（取整）
            const duration = file.duration > 0 ? file.duration : 60;
            this.durationForm.minutes = Math.floor(duration / 60);
            this.durationForm.seconds = Math.round(duration % 60);
            this.showDurationDialog = true;
        },
        // 删除章节
        delCourse(index){
            if(this.course.chapters.length==1){
                this.$message.error("至少保留一个章节");
                return false;
            }
            this.course.chapters.splice(index,1);
            
            // 修复 currentChapter 的逻辑
            if(index < this.currentChapter){
                // 删除的章节在当前章节之前，索引减 1
                this.currentChapter -= 1;
            } else if(index == this.currentChapter && this.currentChapter >= this.course.chapters.length){
                // 删除的是当前章节，且当前章节超出范围了，调整到最后一个
                this.currentChapter = this.course.chapters.length - 1;
            }
            
            this.$forceUpdate();
        },
        // 切换章节
        changeCourse(index){
            this.currentChapter = index;
        },
        async save(){
            // 编辑框赋值
            this.course.baseInfo.introduction = this.$refs.wangEditor.html;
            if(this.common.isBlank(this.course.baseInfo.courseName)){
                this.$message.error("请输入课程标题");
                return false;
            }
            if(this.common.isBlank(this.course.baseInfo.oneClass)){
                this.$message.error("请选择课程分类");
                return false;
            }
            if(this.common.isBlank(this.course.baseInfo.lecturers)){
                this.$message.error("请选择课程讲师");
                return false;
            }
            if(this.common.isBlank(this.course.baseInfo.credit)){
                this.$message.error("请选择学分");
                return false;
            }
            if(this.common.isBlank(this.course.baseInfo.isRequired)){
                this.$message.error("请选择课程类型");
                return false;
            }
            if(this.common.isBlank(this.course.baseInfo.imgId)){
                this.$message.error("请上传封面");
                return false;
            }
            // 使用for循环以便正确中断
            for(let index = 0; index < this.course.chapters.length; index++){
                let item = this.course.chapters[index];
                if(this.common.isBlank(item.chapterTitle)){
                    this.$message.error(`请输入第${index+1}章标题`);
                    return false;
                }
                if(item.files.length == 0){
                    this.$message.error(`请上传第${index+1}章课件`);
                    return false;
                }
                // 验证每个文件是否设置了时长
                for(let file of item.files){
                    if(!file.duration || file.duration <= 0){
                        this.$message.error(`第${index+1}章的课件"${file.fileName}"未设置时长`);
                        return false;
                    }
                }
            }
            
            await this.common.postUrl("eduCourseService", "saveEduCourseInfo", this.course);
            this.$message.success("保存成功");
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        }
    },
}
