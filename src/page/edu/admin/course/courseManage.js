import tree from '@/components/tree/tree.vue'
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue"
export default {
    name: 'courseManage',     
    data() {
        return {
            searchKey:'',
            // courseOneClass:[],
            list:[{}],
            info:{
                courseName:'',
                page:1,
                count:10,
            },
            changeClassDialog:false, //移动分类弹窗
            courseOneClass:[],  //一级分类
            courseOneClassNav:[],
            courseTwoClass:[],  //二级分类
            courseTwoClassShow:[],
            courseClassData:[], //全部分类
            courseOneClassModel:null,
            courseTwoClassModel:null,
            positions:[],   //指定岗位
            isStudyDialog:false,    //指定学习弹窗
            dbHead:[
                {name:"岗位名称",code:"positionName",width:"100"},
                {name:"备注",code:"remark",width:"150"},
            ],
            currentPage:1,
        }
    },
    mounted() {
        this.initData();
        this.doQuery();
    },
    components: {
        tree, 
        myFileModel,
        dbTable,
    },
    methods: {
        async doQuery(){
            let {items} = await this.common.postUrl("eduCourseService", "queryEduCourseInfoPage", this.info);
            // 转换时长字段
			if (items && items.length > 0) {
				items.forEach(item => {
					item.durationStr = this.formatDuration(item.duration);
					item.studyDurationStr = this.formatDuration(item.studyDuration);
				});
			}
            this.list = items;
        },
        
		// 格式化时长（秒转为xx分xx秒，少于一分钟显示xx秒）
		formatDuration(seconds) {
			if (!seconds || seconds <= 0) return '0秒';
			seconds = Math.floor(seconds);
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			if (minutes === 0) {
				return secs + '秒';
			}
			return minutes + '分' + secs + '秒';
		},
        // 改变每页查询条数
        handleSizeChange(val){
            this.info.count = val;
            this.doQuery();
        },
        // 切换当前页面
        handleCurrentChange(page){
            this.info.page = page;
            this.doQuery();
        },
        async initData(){
            // 第一级课程分类
            this.courseOneClass = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COURSE_ONE_CLASS"});
            // 第二级课程分类
            this.courseTwoClass = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COURSE_TWO_CLASS"});
            this.courseOneClassNav = this.common.copyObj(this.courseOneClass);
            let obj = {codeValue:-1,codeName:'全部'}
            this.courseOneClassNav.unshift(obj);
            // 全部课程分类
            this.courseClassData = await this.common.postUrl("eduHomeService", "getSysStaticData");
        },
        // 选择第一级课程分类
        async courseOneClassChange(e){
            if(this.common.isNotBlank(e)){
                this.courseTwoClassModel = null;
            }
            this.courseTwoClassShow = [];
            this.courseTwoClass.forEach(item => {
                if(item.codeId == this.courseOneClassModel){
                    this.courseTwoClassShow.push(item);
                }
            })    
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        // 选择课程类别
        chooseCourse(item){
            this.courseOneClassNav.forEach(el => {
                el.active = false;
            })
            item.active = true;
            this.info.oneClass = item.codeValue;
            this.doQuery();
            this.$forceUpdate();
        },
        // 新增课程
        addCourse(){
            this.$emit("openTab",{
                urlName: "添加课程",
                urlId: "addCourse"+new Date().getTime(),
                urlPath: "/edu/admin/course/addCourse.vue",
                urlPathName: "/addCourse",
            })
        },
        // 修改课程
        editCourse(id){
            this.$emit("openTab",{
                urlName: "修改课程",
                urlId: "addCourse"+id,
                urlPath: "/edu/admin/course/addCourse.vue",
                urlPathName: "/addCourse",
                query:{id}
            })
        },
        // 查看课程
        courseDetail(id){
            this.$emit("openTab",{
                urlName: "查看课程",
                urlId: "courseDetail"+id,
                urlPath: "/edu/admin/course/courseDetail.vue",
                urlPathName: "/courseDetail",
                query:{id}
            })
        },
        // 删除课程
        async delCourse(){
            let selectTotal = 0;
            for(let item of this.list){
                if(item.isSelect){
                    selectTotal++;
                    await this.common.postUrl("eduCourseService", "delEduCourseInfo", {id:item.id});
                }
            }
            if(selectTotal>0){
                this.$message.success("删除成功");
                this.doQuery();
            }else{
                this.$message.error("请选择删除的课程")
            }
        },
        // 打开移动分类弹窗
        openClassChange(){
            let isSelect = false;
            this.list.forEach(el => {
                if(el.isSelect){
                    isSelect = true;
                }
            });
            if(!isSelect){
                this.$message.error("请先选择课程")
            }else{
                this.changeClassDialog = true;
            }
        },
        //移动分类修改保存
        async saveClassChange(){
            for(let item of this.list){
                if(item.isSelect){
                    await this.common.postUrl("eduCourseService", "updateEduCourseInfoClass", {id:item.id,oneClass:this.courseOneClassModel,twoClass:this.courseTwoClassModel});
                }
            }
            this.$message.success("移动分类成功");
            this.changeClassDialog = false;
            this.doQuery();
        },
        // 置顶课程
        async setTop(id,topFlag){
            await this.common.postUrl("eduCourseService", "updateTopFlag", {id});
            this.$message.success(topFlag?"取消置顶成功":"置顶成功");
            this.doQuery();
        },
        // 指定学习
        async appointStudy(item){
            let {id,isRequired} = item;
            if(isRequired == 1){
                this.$message.warning("必修课程不需要指定学习");
                return;
            }
            this.isStudyDialog = true;
            // 获取已指定岗位 
            let rightData = await this.common.postUrl("eduCourseService", "getAllSetPositions",{courseId:id});
            this.$refs.dbTable.setRightData(rightData);
            // 获取指定岗位
            let leftData = await this.common.postUrl("eduCourseService", "getAllPositions");
            this.$refs.dbTable.setLeftData(leftData);
            this.$refs.dbTable.changeTop(0);
            this.$refs.dbTable.changeTop(0,'right');
            // 当前id
            this.appointStudyCourseId = id;
        },
        // 保存更改指定学习
        async saveChangeAppointStudy(){
            let list = this.$refs.dbTable.getRightData();
            await this.common.postUrl("eduCourseService", "updateCourseAppoint", {courseId:this.appointStudyCourseId,positions:list});
            this.$message.success("保存成功");
            this.isStudyDialog = false;
            this.doQuery();
        },
        // 添加试卷
        addExam(id,testId){
            if(this.common.isNotBlank(testId)){
                this.$message.error("已经有试卷了");
                return;
            }
            this.$emit("openTab",{
                urlName: "添加试卷",
                urlId: "addExam"+id,
                urlPath: "/edu/admin/exam/addExam.vue",
                urlPathName: "/addExam",
                query:{id}
            })
        },
        // 修改试卷
        editExam(id,testId){
            this.$emit("openTab",{
                urlName: "修改试卷",
                urlId: "addExam"+testId,
                urlPath: "/edu/admin/exam/addExam.vue",
                urlPathName: "/addExam",
                query:{id,testId}
            })
        },
        // 删除试卷
        async delExam(testId){
            let _this = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                _this.common.postUrl("eduCourseService", "delEduTestInfo", {testId},function(){
                    _this.$message.success("删除成功");
                    _this.doQuery();
                });
            }).catch(() =>{})
        },
        // 学习记录
        learnRecord(id){
            this.$emit("openTab",{
                urlName: "学习记录",
                urlId: "learnRecord"+id,
                urlPath: "/edu/admin/course/learnRecord.vue",
                urlPathName: "/learnRecord",
                query:{id}
            })
        },
        // 查看成绩
        checkScore(id){
            this.$emit("openTab",{
                urlName: "查看成绩",
                urlId: "checkScore"+id,
                urlPath: "/edu/admin/course/checkScore.vue",
                urlPathName: "/checkScore",
                query:{id}
            })
        },
        // 查看试卷
        examDetail(id,testId){
            this.$emit("openTab",{
                urlName: "查看试卷",
                urlId: "examDetail"+testId,
                urlPath: "/edu/admin/exam/examDetail.vue",
                urlPathName: "/examDetail",
                query:{id,testId}
            })
        },
    }
}
