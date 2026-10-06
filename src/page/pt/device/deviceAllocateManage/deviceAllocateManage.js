import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
  name: 'deviceAllocateManage',
  data()
  {
    return {
      head:
          [
            {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
            {"name": "器具规格", "code": "spec", "width": "150", "type": "text"},
            {"name": "调拨单号", "code": "transferOrderNum", "width": "120", "type": "text"},
            {"name": "调拨数量", "code": "nums", "width": "100", "type": "text"},
            {"name": "交付地", "code": "deliveryWorkName", "width": "180", "type": "text","issum": "true"},
            {"name": "开始计费日期", "code": "chargeDate", "width": "150", "type": "text","issum": "true"},
            {"name": "调出仓库", "code": "fromWorkName", "width": "180", "type": "text","issum": "true"},
            {"name": "调出客户", "code": "fromTenantName", "width": "180", "type": "text"},
            {"name": "调入仓库", "code": "toWorkName", "width": "180", "type": "text"},
            {"name": "调入客户", "code": "toTenantName", "width": "180", "type": "text"},
            {"name": "调拨返回数量", "code": "returnNums", "width": "100", "type": "text"},
            {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
            {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
            {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"},
            {"name": "操作人", "code": "createUserName", "width": "120", "type": "text"},
            {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
          ],
      query: {
        deviceName: '',
        verifyState:'',
      },
      title: "新增调拨",
      isShowAddDialog: false,
      viewFlag:false,
      deviceInfo:{
        id:'',
        fromWorkId:'',
        fromSettleBody:'',
        fromTenantId:'',
        toWorkId:'',
        toSettleBody:'',
        toTenantId:'',
        devDeviceId:'',
        spec:'',
        nums:'',
        deliveryWorkId:'',
        chargeDate:'',
      },
      workList:[],
      settleBodyData:[],
      fromCustomerData:[],
      toCustomerData:[],
      deviceInfoData:[],
      deliveryWorkData:[],
      verifyStateData:[],//审核状态
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initData();
    this.doQuery();
  },
  /**
   * 绑定函数
   */
  methods: {

    /**
     * 查询列表
     */
    doQuery() {
      this.$refs.table.load("devAllocatDeviceService", "queryAllocatDevicePage", this.query);
    },
    clear(){
      this.query={deviceName:'',verifyState:''};
    },
    async initData() {
      this.workList = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
      this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
      this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
    },
    async initCustomers(type) {
      if (type==1){
        if(this.deviceInfo.fromWorkId){
          this.initDeviceInfoData();
          this.fromCustomerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {workId:this.deviceInfo.fromWorkId});
        }else{
          this.fromCustomerData = [];
        }
      }else{
        if(this.deviceInfo.toWorkId){
          this.toCustomerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {workId:this.deviceInfo.toWorkId});
        }else{
          this.toCustomerData = [];
        }
      }
    },
    async initDeviceInfoData() {
      let that = this;
      if(this.deviceInfo.fromWorkId&&this.deviceInfo.fromTenantId&&this.deviceInfo.fromSettleBody){
        this.deviceInfoData = await this.common.postUrl("devAllocatDeviceService", "queryAllPurchaseOrderDevices", {custTenantId:that.deviceInfo.fromTenantId,workId:that.deviceInfo.fromWorkId,settleBody:that.deviceInfo.fromSettleBody});
      }
    },
    selDevice(){
      if(this.deviceInfo.devDeviceId){
        let selDeviceInfo = this.deviceInfoData.find(item => item.devDeviceId === this.deviceInfo.devDeviceId);
        this.deviceInfo.spec = selDeviceInfo.spec;
      }else{
        this.deviceInfo.spec = '';
      }
    },
    async initDeliveryWork() {
      this.initCustomers(2);
      this.deliveryWorkData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:this.deviceInfo.toWorkId,tenantId:this.deviceInfo.toTenantId});
    },

    /**
     * 展示Dialog
     * @param isShow
     */
    showAddDialog(isShow) {
      this.deviceInfo = {};
      if (isShow) {
        this.title = '新增调拨';
        this.viewFlag = false;
        this.isShowAddDialog = true;
      } else {
        this.isShowAddDialog = false;
      }
    },

    /**
     * 显示弹出框
     * type 2 修改
     */
    displayDialog(type){
      let data = null;
      this.deviceInfo = {};
      if(type !== 1){
        let array = this.$refs.table.getSelectItem();
        if (array.length !== 1) {
          this.$message.error("请选择一条数据!");
          return false;
        }
        data = array[0];
        if(data.verifyState==1){
          this.$message.error("审核通过不能修改！");
          return false;
        }
      }
      this.toDisplay(type, data);
    },
    dblclickItem(data){
      this.toDisplay(3, data);
    },

    /**
     * 显示弹出框
     * type 2-修改
     */
    async toDisplay(type, data) {
      this.deviceInfo = this.common.copyObj(data);
      this.deviceInfo.fromSettleBody = this.deviceInfo.fromSettleBody + '';
      this.deviceInfo.toSettleBody = this.deviceInfo.toSettleBody + '';
      this.isShowAddDialog = true;
      await this.initDeviceInfoData();
      this.selDevice();
      this.initCustomers(1);
      this.initDeliveryWork();
      if (type == 2) {
        this.viewFlag = false;
        this.title = '修改调拨';
      } else {
        this.viewFlag = true;
        this.title = '查看调拨';
      }
      this.$forceUpdate();
    },

    /**
     * 删除
     */
    async delAllocatDevice() {
      let that = this;
      this.deviceInfo = {};
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1) {
        this.$message.error("请选择一条数据!");
        return false;
      }
      let data = array[0];
      if(data.verifyState==1){
        this.$message.error("审核通过不能删除！");
        return false;
      }
      await this.$confirm('确定要删除此调拨信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      await this.common.postUrl("devAllocatDeviceService", "delAllocatDevice", data);
      that.$message.success("删除成功！");
      that.doQuery();
    },

    /**
     * 新建器具
     */
    saveDevAllocatDeviceInfo() {
      let method = 'saveDevAllocatDeviceInfo';
      let that = this;
      let param = that.deviceInfo;
      this.common.postUrl("devAllocatDeviceService", method, param, function (data) {
        if (data) {
          that.$message.success("保存成功！")
          that.clear();
          that.doQuery();
          that.showAddDialog(false);
        }
      }, null, '', true);
    },

    async returnAllocatDevice()
    {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !== 1)
      {
        this.$message.error("请选择一条数据！");
        return false;
      }
      if(selectData[0].verifyState!=1){
        this.$message.error("审核通过才能操作返回！");
        return false;
      }
      if (selectData[0].returnNums>= selectData[0].nums)
      {
        this.$message.error("已经全部返回的数据不能操作");
        return false;
      }
      let param = this.common.copyObj(selectData[0]);
      this.$prompt("调拨返回会改变仓库之间的器具数量，确定是否调拨返回？", "调拨返回",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        showInput: true,
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        inputPlaceholder: '调拨返回数量',
        inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
          if(!value) {
            return '调拨返回数量不能为空';
          }
        },
      }).then(async ({value}) =>{
        param.returnNums = value;
        await this.common.postUrl("devAllocatDeviceService", "returnAllocatDevice", param,null,null,'',true);
        await this.doQuery();
        this.$message.success("操作成功！");
      }).catch();
    },
    verify(flag){
      let selectData = this.$refs.table.getSelectItem();
      if(selectData.length !== 1)
      {
        this.$message.error("请选择一个需要审核的数据！");
        return false;
      }
      let data = selectData[0];
      let tip = "审核通过";
      if (flag)
      {
        if (data.verifyState == enumData.verifyState.approved)
        {
          this.$message.error("已经审核通过的数据,请勿重复操作！");
          return false;
        }
        if (data.verifyState == enumData.verifyState.noApproved)
        {
          this.$message.error("已经审核不通过的数据,不允许操作！");
          return false;
        }
      }
      else
      {
        if (data.verifyState == enumData.verifyState.noApproved)
        {
          this.$message.error("已经审核不通过的数据,请勿重复操作！");
          return false;
        }
        if (data.verifyState == enumData.verifyState.approved)
        {
          this.$message.error("已经审核通过的数据,不允许操作操作！");
          return false;
        }
        tip = "审核不通过";
      }
      let param = this.common.copyObj(data);
      param.verifyState=flag;
      this.$confirm("是否确认" + tip +"？", "提示").then(async () =>{
        await this.common.postUrl("devAllocatDeviceService", "verifyAllocatDevice", param, null, null, '', true);
        this.$message.success(tip + "成功！");
        await this.doQuery();
      }).catch(() =>{
        //取消
      });
    },
    print(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
          this.$message.error("请选择一条数据修改！");
          return;
      }            
      if (selectData[0].verifyState != 1 && selectData[0].verifyState != 2) {
          this.$message.error("审核后才能打印！");
          return;
      }
      this.$emit("openTab",{
          query:{data:selectData[0]},
          urlId: 'deviceAllocatePrint' + selectData[0].id,
          urlName: '打印采购单',
          urlPathName: '/deviceAllocatePrint',
          urlPath: "/pt/device/deviceAllocateManage/deviceAllocatePrint.vue",
      });
    },
  },


    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel
    },
}