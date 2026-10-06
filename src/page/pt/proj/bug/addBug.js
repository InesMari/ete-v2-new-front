import WangEditor from "@/components/wangEditor/wangEditor.vue";
import MyFileModelList from "@/components/myFileModel/myFileModelList.vue";

export default {
  name: 'addBug',
  data() {
    return {
      info:this.initInfo(),
      isNext:false,
      priorityData:[],
      severityData:[],
      taskData:[],
      bugData:[],
      userData:[],
      iterationData:[],
    }
  },
  components: {
    MyFileModelList,
    WangEditor,
  },
  mounted() {
    this.initData();

  },
  methods: {
    initInfo() {
      this.info={
        relId:this.common.isBlank(this.$route.query.relId)?'':Number(this.$route.query.relId),
        parentId:this.common.isBlank(this.$route.query.parentId)?'':Number(this.$route.query.parentId),
        title:'',
        iterationId:this.common.isBlank(this.$route.query.iterationId)?'':Number(this.$route.query.iterationId),
        itDisabled:this.common.isNotBlank(this.$route.query.iterationId),
        contentDesc:'',
        priority:"2",
        severity:"3",
        assignedToUserId:'',
        testUserId:'',
        planStartDate:'',
        planEndDate:''
      };
      return this.info;
    },
    /**
     * 初始化数据
     */
    async initData(){
      this.priorityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRIORITY"});
      this.severityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SEVERITY"});
      this.taskData = await this.common.postUrl("projTaskTF", "queryTaskInfoList");
      this.bugData = await this.common.postUrl("projBugTF", "queryBugInfoList");
      this.userData = await this.common.postUrl("userTF", "loadDevDeptOrgUserList", {orgFlag: 1});
      this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
    },
    /**
     * 关闭当前页面
     */
    closePage()
    {
      this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
    },
    delFile(fileData){
      this.common.postUrl("fileCommonTF","doDel",{flowId:fileData.flowId});
    },
    // 保存
    submit(){
      this.info.contentDesc = this.$refs.wangEditor.html;
      this.info.files = this.$refs.fileModelList.getAllFileList();
      if(this.common.isBlank(this.info.title)){
        this.$message.error("标题不能为空");
        return;
      }
      if(this.common.isBlank(this.info.priority)){
        this.$message.error("优先级不能为空");
        return;
      }
      if(this.common.isBlank(this.info.severity)){
        this.$message.error("严重程度不能为空");
        return;
      }
      if(this.common.isBlank(this.info.assignedToUserId)){
        this.$message.error("负责人不能为空");
        return;
      }
      if(this.common.isBlank(this.info.testUserId)){
        this.$message.error("验证人不能为空");
        return;
      }
      if(this.common.isBlank(this.info.planStartDate)){
        this.$message.error("计划开始时间不能为空");
        return;
      }
      if(this.common.isBlank(this.info.planEndDate)){
        this.$message.error("计划结束时间不能为空");
        return;
      }
      if(this.info.planStartDate>this.info.planEndDate){
        this.$message.error("计划结束时间不能小于计划开始时间！");
        return;
      }
      let that  = this;
      this.common.postUrl("projBugTF", "addProjBugInfo", this.info, function (data) {
        if (that.common.isNotBlank(data)) {
          that.$message.success("新增成功！");
          that.$refs.wangEditor.clearEditor();
          if(that.isNext){
            that.initInfo();
          }else{
            that.closePage();
          }
        }
      },null,'',true);
    }
  },
}