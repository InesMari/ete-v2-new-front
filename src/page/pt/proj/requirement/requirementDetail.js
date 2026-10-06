import myWangEditor from "@/components/myWangEditor/myWangEditor.vue";
import MyFileModelList from "@/components/myFileModel/myFileModelList.vue";
import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'requirementDetail',
  data() {
    return {
      head: [
        {"name": "任务单号", "code": "taskNum", "width": "120", "type": "text"},
        {"name": "任务标题", "code": "title", "width": "250", "type": "text"},
        {"name": "父任务", "code": "parentTaskNum", "width": "120", "type": "diy"},
        {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
        {"name": "任务状态", "code": "stateName", "width": "120", "type": "diy"},
        {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
        {"name": "验证人", "code": "testUserName", "width": "80", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
      ],
      info:{
        id:this.$route.query.id,
        content:'',
        solveDesc:'',
        logList:[],
      },
      oldInfo:{},
      contentTitle:'需求描述',
      solveTitle:'解决方案',

      baseDisable:true,//需求基础部分是否禁用  待处理的时候，以及有修改权限的时候 以及有处理权限的时候
      solveDisable:true,//需求解决方案部分是否禁用  有处理权限的时候
      stateDisable:true,

      requirementClassData:[],
      settleBodyData:[],
      custOptions: [],
      typeData:[],
      priorityData:[],
      orgData:[],
      orgUserData:[],
      acceptStateData:[],
      stateData:[],
      taskStateData:[],
      assignedToUserData:[],
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
      let data = await this.common.postUrl("projRequirementTF", 'getRequirementInfoDetail', {id: this.info.id});
      this.info = data;
      this.oldInfo = this.common.copyObj(data);
      this.info.requirementClass = this.info.requirementClass+'';
      this.info.type = this.info.type+'';
      this.info.srcSettleBody = this.info.srcSettleBody+'';
      this.info.priority = this.info.priority+'';
      this.info.acceptState = this.info.acceptState+'';
      this.info.state = this.info.state+'';
      this.$refs.fileModelList.initFileList(this.info.srcList);
      this.$refs.solveFileModelList.initFileList(this.info.solveList);
      let srcUserId = data.srcUserId;
      await this.changeOrg();
      this.info.srcUserId = srcUserId;
      this.initFlag = true;
      this.$forceUpdate();
    },
    initEditFlag(){
        let entityIds = localStorage.getItem("entityIds").split(",");
        entityIds.forEach(item => {
            if(item == 1007090||item == 1007091){
              if(this.info.acceptState != '1'||this.info.state=='6'){
                this.baseDisable = true;
              }else{
                this.baseDisable = false;
              }
            }
            if(item == 1007091){
                this.solveDisable = false;
                this.stateDisable = false;
            }
        });
    },
    /**
     * 初始化数据
     */
    async initData(){
      this.requirementClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_CLASS"});
      this.custOptions = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
      this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
      this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_TYPE"});
      this.priorityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRIORITY"});
      this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
      await this.changeOrg();
      this.acceptStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCEPT_STATE"});
      this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_STATE"});
      this.taskStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TASK_STATE"});
      this.assignedToUserData = await this.common.postUrl("userTF", "loadDevDeptOrgUserList", {orgFlag: 1});
      this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
    },
    async changeOrg() {
      this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
        orgFlag: 1,
        orgId: this.info.srcOrgId
      });
      this.info.srcUserId='';
      this.updateRequirementInfoByField('srcOrgId');
      // this.updateRequirementInfoByField('srcUserId');

      let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary", {orgId:this.info.srcOrgId});
      if(payTitle){
        this.info.srcSettleBody=payTitle;
        this.updateRequirementInfoByField('srcSettleBody');
      }
    },
    async queryLogList() {
      let list = await this.common.postUrl("projRequirementTF", 'queryLogList', {id: this.info.id});
      this.info.logList = list;
      this.$forceUpdate();
    },
    // 保存
    contentSubmit(value){
      this.info.requirementDesc = value;
      this.updateRequirementInfoByField('requirementDesc');
    },
    solveSubmit(value,refuseDesc){
      this.info.solveDesc = value;
      this.info.refuseDesc = refuseDesc.substring(0, 2000);
      this.updateRequirementInfoByField('solveDesc');
      this.updateRequirementInfoByField('refuseDesc');
    },
    addRequirementFile(fileData,fileType){
      let param = this.common.copyObj(fileData);
      param.fileType = fileType;
      param.relId = this.info.id;
      let that = this;
      this.common.postUrl("projRequirementTF", "addRequirementFile", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
    },
    delRequirementFile(fileData,fileType){
      let param = this.common.copyObj(fileData);
      param.fileType = fileType;
      param.relId = this.info.id;
      let that = this;
      this.common.postUrl("projRequirementTF", "delRequirementFile", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
    },
    updateRequirementInfoByField(field){
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
      if(this.initFlag){
        if(this.info.acceptState != '1'||this.info.state=='6'){
          this.baseDisable = true;
        }else{
          this.baseDisable = false;
        }
        if(this.info.state=='6'){
          this.solveDisable = true;
        }else{
          this.solveDisable = false;
        }
        let that = this;
        this.common.postUrl("projRequirementTF", "updateRequirementInfoByField", param, function (data) {
          if (that.common.isNotBlank(data)) {
            that.queryLogList();
            that.oldInfo[field] = that.info[field];            
            that.$refs.wangEditor.clearEditor();
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
        query: {relId:this.info.id},
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
    updateTaskInfoByField(item,field){
      let param = {
        id:item.id,
        fieldName:field,
        fieldValue:item[field]
      };
      let that = this;
      this.common.postUrl("projTaskTF", "updateTaskInfoByField", param, function (data) {
        if (that.common.isNotBlank(data)) {
          that.queryLogList();
          that.$forceUpdate();
        }
      },null,'',true);
      this.$forceUpdate();
    },
    gotoTask(item){
      this.$emit("openTab",{
        urlId: 'viewTask' + new Date().getTime(),
        query: {id:item.parentId},
        urlName: "任务详情",
        urlPathName: "/viewTask",
        urlPath: "/pt/proj/task/taskDetail.vue"});
    },
    async handleClick() {
      if (this.tab == '2') {
        let that = this;
        let {items} = await this.$refs.table.load("projTaskTF", "queryProjTaskInfoPage", {relId: that.info.id});
        items.forEach((el) => {
          if (el.state == 7 || el.state == 8) {
            el.disabled = true;
          }
          el.state = el.state + '';
        })
        this.$refs.table.resetData(items);
      }
    }


  },
}