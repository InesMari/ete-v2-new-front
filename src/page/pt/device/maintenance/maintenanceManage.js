import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import myImport from "@/components/myImport/myImport";

export default {
  name: 'maintenanceManage',
  data()
  {
    return {
      head:
          [
            {"name": "器具名称", "code": "name", "width": "150", "type": "text"},
            {"name": "长宽高（mm*mm*mm）", "code": "spec", "width": "150", "type": "text"},
            {"name": "器具备注", "code": "remark", "width": "150", "type": "text"},
            {"name": "管理单位", "code": "deviceUnitName", "width": "100", "type": "text","issum": "true"},
            {"name": "器具类型", "code": "deviceTypeName", "width": "100", "type": "text","issum": "true"},
            {"name": "器具图片", "code": "img", "width": "100", "type": "diy","issum": "true"},
            {"name": "创建人", "code": "createUserName", "width": "100", "type": "text","issum": "true"},
            {"name": "创建时间", "code": "createDate", "width": "100", "type": "text"},
          ],
      query: {
        deviceName: '',
        deviceType:'',
      },
      title: "新增器具",
      isShowAddDialog: false,
      devInfo:{},
      deviceUnitOptions:[],
      deviceTypeOptions:[],
      srcList: [],
      uploadOpen:false,
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.init();
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
      this.uploadOpen = false;
      this.$refs.table.load("deviceBaseService", "queryDeviceInfoPage", this.query);

    },
    init() {
      let that = this;
      this.common.postUrl("commonTF", "getSysStaticData", {codeType:"DEVICE_UNIT"}, function (data) {
        that.deviceUnitOptions = data;
      });
      this.common.postUrl("commonTF", "getSysStaticData", {codeType:"DEVICE_TYPE"}, function (data) {
        that.deviceTypeOptions = data;
        // if(that.deviceTypeOptions.length>2){
        //   that.deviceTypeOptions.splice(2, that.deviceTypeOptions.length-2);
        // }
        // that.$forceUpdate();
      });
    },

    /**
     * 展示Dialog
     * @param isShow
     */
    showAddDialog(isShow) {
      this.devInfo = {};
      if (isShow) {
        this.title = '新增器具';
        this.isShowAddDialog = true;
      } else {
        this.isShowAddDialog = false;
        this.$refs.devImg.clean();
      }
    },
    clear(){
      this.query ={
        deviceName: '',
      };
    },

    /**
     * 显示弹出框
     * type 1-修改
     */
    displayDialog(type){
      let data = null;
      this.devInfo = {};
      if(type !== 1){
        let array = this.$refs.table.getSelectItem();
        if (array.length !== 1) {
          this.$message.error("请选择一条数据!");
          return false;
        }
        data = array[0];
      }
      this.toDisplay(type, data);
    },

    /**
     * 显示弹出框
     * type 2-修改
     */
    toDisplay(type,data){
      if (type == 2) {
        this.devInfo = this.common.copyObj(data);
        this.$nextTick(() => {
          if (this.devInfo.imgId) {
            this.$refs.devImg.initDate(this.devInfo.imgId);
          }
        })
        this.devInfo.deviceUnit = data.deviceUnit + '';
        this.devInfo.deviceType = data.deviceType + '';
        this.title = '修改器具';
        this.isShowAddDialog = true;
        this.$forceUpdate();
      }
    },

    /**
     * 删除包装
     */
    async delDevInfo() {
      let that = this;
      this.devInfo = {};
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1) {
        this.$message.error("请选择一条数据!");
        return false;
      }
      let data = array[0];

      await this.$confirm('确定要删除此器具信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
  
      await this.common.postUrl("deviceBaseService", "delDeviceInfo", data);
      that.$message.success("删除成功！");
      that.doQuery();
    },

    // 上传图片回调
    successCallback(imgData){
        this.devInfo.imgId = imgData.flowId;
        this.devInfo.imgPath = imgData.storePath;
    },

    /**
     * 新建器具
     */
    saveDevData() {
      let method = 'saveDeviceInfo';
      let that = this;
      let param = that.devInfo;
      if (this.common.isBlank(this.devInfo.deviceType))
      {
        this.$message.error("请选择器具类型！");
        return false;
      }
      this.common.postUrl("deviceBaseService", method, param, function (data) {
        if (data) {
          that.$message.success("保存成功！")
          that.doQuery();
          that.showAddDialog(false);
        }
      }, null, '', true);
    },
    showImg(data){
      this.srcList=[];
      this.srcList.push(data.imgUrl);
      this.$refs.viewer.show();

    },

  },


    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel,
        fileViewer,
        myImport
    },
}