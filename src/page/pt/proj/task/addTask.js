import WangEditor from "@/components/wangEditor/wangEditor.vue";
import MyFileModelList from "@/components/myFileModel/myFileModelList.vue";

export default {
  name: 'addRequirement',
  data() {
    return {
      info:this.initInfo(),
      isNext:false,
      priorityData:[],
      requirementData:[],
      taskData:[],
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
        assignedToUserId:'',
        testUserId:'',
        planStartDate:'',
        planEndDate:''
      };
      if(this.info.relId){
          this.initInfoFromRequirementInfo(this.info.relId);
      }
      return this.info;
    },

  async initInfoFromRequirementInfo(id) {
      let data = await this.common.postUrl("projRequirementTF", 'getRequirementInfoDetail', {id});
      this.$refs.wangEditor.setEditor('<p>需求描述：</p>'+data.requirementDesc+'<p>解决方案：</p>'+data.solveDesc);
      let list = data.srcList.concat(data.solveList);
      this.$refs.fileModelList.initFileList(list);
      this.$forceUpdate();
  },
    /**
     * 初始化数据
     */
    async initData(){
      this.priorityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRIORITY"});
      this.requirementData = await this.common.postUrl("projRequirementTF", "queryRequirementInfoList");
      this.taskData = await this.common.postUrl("projTaskTF", "queryTaskInfoList");
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
      this.common.postUrl("projTaskTF", "addProjTaskInfo", this.info, function (data) {
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