import myWangEditor from "@/components/myWangEditor/myWangEditor.vue";
import MyFileModelList from "@/components/myFileModel/myFileModelList.vue";
import tableCommon from "@/components/table/tableCommon.vue";

export default {
  name: 'taskDetail',
  data() {
    return {
      head: [
        {"name": "任务单号", "code": "taskNum", "width": "120", "type": "text"},
        {"name": "任务标题", "code": "title", "width": "250", "type": "text"},
        {"name": "关联需求", "code": "relRequirementNum", "width": "150", "type": "diy"},
        // {"name": "父任务", "code": "parentTaskNum", "width": "120", "type": "diy"},
        {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
        {"name": "任务状态", "code": "stateName", "width": "120", "type": "diy"},
        {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
        {"name": "验证人", "code": "testUserName", "width": "80", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
      ],
      bugHead: [
        {"name": "缺陷单号", "code": "bugNum", "width": "120", "type": "text"},
        {"name": "缺陷标题", "code": "title", "width": "250", "type": "text"},
        // {"name": "关联任务", "code": "relTaskNum", "width": "120", "type": "diy"},
        {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
        {"name": "严重程度", "code": "severityName", "width": "70", "type": "text"},
        {"name": "缺陷状态", "code": "stateName", "width": "120", "type": "diy"},
        {"name": "不修复理由", "code": "refuseDesc", "width": "180", "type": "text"},
        {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
        {"name": "验证人", "code": "testUserName", "width": "80", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
      ],
      info:{
        id:this.$route.query.id,
        contentDesc:'',
        logList:[],
      },
      oldInfo:{},
      contentTitle:'任务描述',

      baseDisable:true,//任务是否禁用  待处理的时候，以及有修改权限的时候 以及有处理权限的时候
      stateDisable:true,

      priorityData:[],
      requirementData:[],
      taskData:[],
      userData:[],
      stateData:[],
      bugStateData:[],
      iterationData:[],

      tab:'1',

      initFlag:false,
    }
  },
  components: {
    tableCommon,
    myWangEditor,
    MyFileModelList
  },
  async mounted() {
    await this.initData();
    await this.initInfo();
    this.initEditFlag();
  },
  methods: {
    async initInfo() {
      let data = await this.common.postUrl("projTaskTF", 'getProjTaskInfoDetail', {id: this.info.id});
      this.info = data;
      this.oldInfo = this.common.copyObj(data);
      this.info.priority = this.info.priority+'';
      this.info.state = this.info.state+'';
      this.$refs.fileModelList.initFileList(this.info.fileList);
      this.initFlag = true;
      this.$forceUpdate();
    },
    initEditFlag(){
        let entityIds = localStorage.getItem("entityIds").split(",");
        entityIds.forEach(item => {
            if(item == 1007095){
                if(this.info.state=='7'|| this.info.state=='8'){
                  this.baseDisable = true;
                } else{
                  this.baseDisable = false;
                }
                this.stateDisable = false;
            }
        });
    },
    /**
     * 初始化数据
     */
    async initData(){
      this.priorityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRIORITY"});
      this.requirementData = await this.common.postUrl("projRequirementTF", "queryRequirementInfoList");
      this.taskData = await this.common.postUrl("projTaskTF", "queryTaskInfoList",{id:this.info.id});
      this.userData = await this.common.postUrl("userTF", "loadDevDeptOrgUserList", {orgFlag: 1});
      this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TASK_STATE"});
      this.bugStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUG_STATE"});
      this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
    },
    async queryLogList() {
      let list = await this.common.postUrl("projTaskTF", 'queryLogList', {id: this.info.id});
      this.info.logList = list;
      this.$forceUpdate();
    },
    // 保存
    contentSubmit(value){
      this.info.contentDesc = value;
      this.updateTaskInfoByField('contentDesc');
    },

    addTaskFile(fileData){
      let param = this.common.copyObj(fileData);
      param.relId = this.info.id;
      let that = this;
      this.common.postUrl("projTaskTF", "addTaskFile", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
    },
    delTaskFile(fileData){
      let param = this.common.copyObj(fileData);
      param.relId = this.info.id;
      let that = this;
      this.common.postUrl("projTaskTF", "delTaskFile", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
    },
    updateTaskInfoByField(field){
      let param = {
        id:this.info.id,
        fieldName:field,
        fieldValue:this.info[field]
      };
      //如果是计划时间 实际时间的 追加校验
      if (field == 'planStartDate' || field == 'planEndDate') {
        if (this.common.isNotBlank(this.info.planStartDate) && this.common.isNotBlank(this.info.planEndDate) && this.info.planStartDate > this.info.planEndDate) {
          this.$message.error("计划结束时间不能小于计划开始时间！");
          this.info[field] = this.oldInfo[field];
          return;
        }
      }
      if (field == 'actualStartDate' || field == 'actualEndDate') {
        if (this.common.isNotBlank(this.info.actualStartDate) && this.common.isNotBlank(this.info.actualEndDate) && this.info.actualStartDate > this.info.actualEndDate) {
          this.$message.error("实际结束时间不能小于实际开始时间！");
          this.info[field] = this.oldInfo[field];
          return;
        }
      }
      if(field=='relId'&&!this.info[field]){
        this.info.relRequirementTitle = '';
      }
      if(field=='parentId'&&!this.info[field]){
        this.info.parentTaskTitle = '';
      }
      if(this.initFlag){
        if(this.info.state=='7'|| this.info.state=='8'){
          this.baseDisable = true;
        }else{
          this.baseDisable = false;
        }
        let that = this;
        this.common.postUrl("projTaskTF", "updateTaskInfoByField", param, function (data) {
          if (that.common.isNotBlank(data)) {
            that.queryLogList();
            that.oldInfo[field] = that.info[field];
            that.$forceUpdate();
          }
        },null,'',true);
      }
      this.$forceUpdate();
    },


    /**
     * 新增
     */
    add(){
      this.$emit("openTab",{
        urlId: 'addTask' + new Date().getTime(),
        query: {parentId:this.info.id,relId:this.info.relId},
        urlName: "新增任务",
        urlPathName: "/addTask",
        urlPath: "/pt/proj/task/addTask.vue"});
    },
    /**
     * 双击打开详情页面
     */
    dblclickItem(item){
      this.$emit("openTab",{
        urlId: 'viewTask' + new Date().getTime(),
        query: {id:item.id},
        urlName: "任务详情",
        urlPathName: "/viewTask",
        urlPath: "/pt/proj/task/taskDetail.vue"});
    },
    gotoRequirement(item){
      this.$emit("openTab",{
        urlId: 'viewRequirement' + new Date().getTime(),
        query: {id:item.relId},
        urlName: "需求详情",
        urlPathName: "/viewRequirement",
        urlPath: "/pt/proj/requirement/requirementDetail.vue"});
    },
    updateSubTaskInfoByField(item,field){
      let param = {
        id:item.id,
        fieldName:field,
        fieldValue:item[field]
      };
      let that = this;
      this.common.postUrl("projTaskTF", "updateTaskInfoByField", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$refs.wangEditor.clearEditor();
          that.$forceUpdate();
        }
      },null,'',true);
      this.$forceUpdate();
    },
    async handleClick() {
      if (this.tab == '2') {
        let that = this;
        let {items} = await this.$refs.table.load("projTaskTF", "queryProjTaskInfoPage", {parentId: that.info.id});
        items.forEach((el) => {
          if (el.state == 7 || el.state == 8) {
            el.disabled = true;
          }
          el.state = el.state + '';
        })
        this.$refs.table.resetData(items);
      } else  if (this.tab == '3') {
        let that = this;
        let {items} = await this.$refs.bugTable.load("projBugTF", "queryProjBugInfoPage", {relId: that.info.id});
        items.forEach((el) => {
          if (el.state == 8) {
            el.disabled = true;
          }
          el.state = el.state+'';
        })
        this.$refs.bugTable.resetData(items);
      }
    },
    /**
     * 双击打开详情页面
     */
    dblclickBugItem(item){
      this.$emit("openTab",{
        urlId: 'viewBug' + new Date().getTime(),
        query: {id:item.id},
        urlName: "缺陷详情",
        urlPathName: "/viewBug",
        urlPath: "/pt/proj/bug/bugDetail.vue"});
    },
    updateSubBugInfoByField(item,field){
      let param = {
        id:item.id,
        fieldName:field,
        fieldValue:item[field]
      };
      let that = this;
      this.common.postUrl("projBugTF", "updateBugInfoByField", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
      this.$forceUpdate();
    },



  },
}