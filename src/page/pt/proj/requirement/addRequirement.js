import WangEditor from "@/components/wangEditor/wangEditor.vue";
import MyFileModelList from "@/components/myFileModel/myFileModelList.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'addRequirement',
  data() {
    return {
      info:this.initInfo(),
      isNext:false,
      requirementClassData:[],
      typeData:[],
      priorityData:[],
      orgData:[],
      settleBodyData:[],
      orgUserData:[],
      custOptions: [],
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
        title:'',
        requirementDesc:'',
        requirementClass:'1',
        type:"1",
        priority:"2",
        srcUserId:this.common.userInfo().userId,
        srcOrgId:this.common.userInfo().orgId,
        srcSettleBody:'',
        srcTenantId:'',
        iterationId:this.common.isBlank(this.$route.query.iterationId)?'':Number(this.$route.query.iterationId),
        itDisabled:this.common.isNotBlank(this.$route.query.iterationId),
        workHours:'',
        confirmUserId:'',
      };
      return this.info;
    },
    /**
     * 初始化数据
     */
    async initData(){
      this.requirementClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_CLASS"});
      this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_TYPE"});
      this.priorityData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRIORITY"});
      this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
      this.custOptions = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
      this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
      this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
      await this.changeOrg();
      this.info.srcUserId = this.common.userInfo().userId;
    },
    async changeOrg() {
      this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
        orgFlag: 1,
        orgId: this.info.srcOrgId
      });
      let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary", {orgId:this.info.srcOrgId});
      if(payTitle){
        this.info.srcSettleBody=payTitle;
      }
      this.info.srcUserId='';
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
      this.info.requirementDesc = this.$refs.wangEditor.html;
      this.info.files = this.$refs.fileModelList.getAllFileList();
      let that  = this;
      this.common.postUrl("projRequirementTF", "addRequirementInfo", this.info, function (data) {
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