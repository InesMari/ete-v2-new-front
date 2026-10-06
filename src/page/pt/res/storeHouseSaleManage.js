import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'storeHouseSaleManage',
  data() {
    return {
      head: [
        {"name": "客户", "code": "custName", "width": "250", "type": "text"},
        {"name": "报价单号", "code": "quoteNum", "width": "150", "type": "text"},
        {"name": "租赁类型", "code": "leaseTypeName", "width": "60", "type": "text"},
        {"name": "结算类型", "code": "settleTypeName", "width": "120", "type": "text"},
        {"name": "仓库名称", "code": "storeHouseName", "width": "150", "type": "text"},
        {"name": "仓库地址", "code": "workAddressStr", "width": "250", "type": "text"},
        {"name": "仓库面积（㎡)", "code": "storehouseArea", "width": "90", "type": "text"},
        {"name": "仓库高度（m)", "code": "storehouseHeight", "width": "90", "type": "text"},
        {"name": "仓库类型", "code": "storehouseTypeName", "width": "100", "type": "text"},
        {"name": "消防等级", "code": "firecontrolTypeName", "width": "60", "type": "text"},
        {"name": "租赁面积（㎡）", "code": "leaseAreaTotal", "width": "100", "type": "text"},
        {"name": "加收公摊%", "code": "shareRate", "width": "100", "type": "text"},
        {"name": "计费面积（㎡）", "code": "chargeArea", "width": "100", "type": "text"},
        {"name": "最大托数", "code": "maxPalletNums", "width": "100", "type": "text"},
        {"name": "租赁开始日期", "code": "leaseBeginDate", "width": "140", "type": "date"},
        {"name": "租赁结束日期", "code": "leaseEndDate", "width": "140", "tpype": "date"},
        {"name": "月租费", "code": "leaseFeeArea", "width": "100", "type": "text"},
        // {"name": "硬件费（元/月）", "code": "leaseFeeHardware", "width": "100", "type": "text"},
        // {"name": "税率（%）", "code": "taxRate", "width": "100", "type": "text"},
        // {"name": "税金", "code": "taxAmount", "width": "100", "type": "text"},
        {"name": "单价（元/㎡/月）", "code": "unitPrice", "width": "100", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"}
      ],
      query: {
        custTenantId: this.common.isBlank(this.$route.query.tenantId) ? '' : Number(this.$route.query.tenantId),//客户详情仓储合同跳转
        quoteNum:this.common.isBlank(this.$route.query.quoteNum) ? '' : this.$route.query.quoteNum,
        storeHouseType: '',
        storeHouseId: '',
        storeHouseName: '',
        workAddressStr: '',
        fireControlType: '',
        expirationStatus:'',
        settleType:''
      },
      hzTenantOptions: '',
      dic_store_house_type:[] ,
      storeHouseOptionsSearch: [],
      dic_fire_control_type:[] ,
      settleTypeData:[],
      expirationStatusData:[{
        codeValue: 1,
        codeName: '未到期'
      },{
        codeValue: 2,
        codeName: '将到期'
      },{
        codeValue: 3,
        codeName: '已到期'
      }],
      endDate:'',
      showDlg:false,
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.doQuery();
    this.initData();
  },
  /**
   * 组件
   */
  components: {
    myFileModel,
    tableCommon,
    searchList
  },
  /**
   * 绑定函数
   */
  methods: {

    /**
     * 查询列表
     */ async doQuery(query = this.query) {
      this.query = query;
      let {items} = await this.$refs.table.load("storeHouseBizTF", "queryCmStoreHouseSaleRelPage", query);
      items.forEach((el) =>{
        if (el.display == 1) {//1个月内到期
          el.class = 'trRed';
        }else if(el.display==9){//已到期
          el.disabled = true;
        }
      })
      this.$refs.table.resetData(items);
    },
    /**
     * 初始化数据
     */
    initData() {
      let that = this;

      //加载静态枚举
      let codeTypes = 'STOREHOUSE_TYPE,FIRECONTROL_TYPE,LEASE_TYPE,SETTLE_TYPE';
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType': codeTypes},function (data) {
        that.dic_store_house_type = data.STOREHOUSE_TYPE;
        that.dic_fire_control_type = data.FIRECONTROL_TYPE;
        that.dic_lease_type = data.LEASE_TYPE;
        that.settleTypeData = data.SETTLE_TYPE;
      });

      this.common.postUrl("tenantTF", "getHzTenantList", {}, function (data) {
        that.hzTenantOptions = data;
      });
      this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
        that.storeHouseOptions = data;
        that.storeHouseOptionsSearch = data;
      });

    },

    updateStateToInvalid(state) {
      let that = this;
      let array = this.$refs.table.getSelectItem();
      if (array.length == 0) {
        this.$message.error("请至少选择一条数据");
        return false;
      }
      let ids = '';
      for (let i = 0; i < array.length; i++) {
        if (array[i].sts == state) {
          this.$message.error("数据错误!当前状态与目标操作状态一致!");
          return false;
        }
        ids += ',' + array[i].id;
      }
      ids = ids.substr(1);
      let info = '';
      if (state == 0) {
        info = '删除';
      }
      this.$confirm("确定需要删除？", "提示").then(() =>{
        that.common.postUrl("storeHouseBizTF", 'updateStateToInvalid', {ids: ids,data:array}, function (data) {
          if (data) {
            that.doQuery();
            that.$message.success(info + "成功！");
          }
        },null,'',true);
      }).catch(() =>{})
    },

    // 新增仓储合同
    addSale(){
      this.$emit("openTab",{
        urlId: new Date().getTime(),
        query:{custTenantId:this.query.custTenantId},
        urlName: "新增仓储合同",
        urlPathName: "/addStoreHouseSale",
        urlPath: "/pt/res/addStoreHouseSale.vue"
      });
    },
    // 修改仓储合同
    editSale(){
      let item = this.$refs.table.getSelectItem();
      if(item.length!=1){
        this.$message.error("请选择一条数据。")
      }
      let id = item[0].id;
      this.$emit("openTab",{
        urlId: id,
        query:{id},
        urlName: "修改仓储合同",
        urlPathName: "/addStoreHouseSale",
        urlPath: "/pt/res/addStoreHouseSale.vue"
      });
    },
    // 查看仓储合同
    dblclickItem({id}){
      this.$emit("openTab",{
        urlId: id+"detail",
        query:{
          id,
          logId: id,
          logType: enumData.LOG_TYPE.WMS_CONTRACT,
        },
        urlName: "仓储合同详情",
        urlPathName: "/storeHouseSaleDetail",
        urlPath: "/pt/res/storeHouseSaleDetailMain.vue"
      });
    },
    download() {
      this.$refs.table.downloadExcelFile('仓库客户合同列表');
    },
    showRenewal(){
      let item = this.$refs.table.getSelectItem();
      if(item.length!=1){
        this.$message.error("请选择一条数据。")
      }
      this.endDate = new Date(item[0].leaseEndDate);
      this.endDate.setFullYear(this.endDate.getFullYear()+1);
      let year = this.endDate.getFullYear();
      let month = this.endDate.getMonth()+1;
      let day = this.endDate.getDate();
      this.endDate = year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);
      this.showDlg=true;
    },
    closeDialog(){
      this.showDlg=false;
    },
    renewal(){
      let item = this.$refs.table.getSelectItem();
      let that  = this;
      that.common.postUrl("storeHouseBizTF", 'renewal', {id: item[0].id,endDate:this.endDate}, function (data) {
        if (data) {
          that.doQuery();
          that.$message.success("续期成功！");
          that.showDlg=false;
        }
      },null,'',true);

    },
  },
  computed:{
    formData(){
      return [
        {"name":"客户","model":"custTenantId","type":"select","options":this.hzTenantOptions,"label":"name","value":"id","placeholder":"客户","method":"doQuery","isshow":true},
        {"name":"报价单号","model":"quoteNum","type":"input","placeholder":"报价单号","isshow":true},
        {"name":"仓库类型","model":"storehouseType","type":"select","options":this.dic_store_house_type,"label":"codeName","value":"codeValue","placeholder":"仓库类型","method":"doQuery","isshow":true},
        {"name":"仓库名称","model":"storeHouseId","type":"select","options":this.storeHouseOptionsSearch,"label":"workName","value":"storeHouseId","placeholder":"仓库名称","method":"doQuery","isshow":true},
        {"name":"仓库地址","model":"workAddressStr","type":"input","placeholder":"仓库地址","isshow":true},
        {"name":"消防等级","model":"firecontrolType","type":"select","options":this.dic_fire_control_type,"label":"codeName","value":"codeValue","placeholder":"消防等级","method":"doQuery","isshow":true},
        {"name":"到期状态","model":"expirationStatus","type":"select","options":this.expirationStatusData,"label":"codeName","value":"codeValue","placeholder":"到期状态","method":"doQuery","isshow":true},
        {"name":"结算类型","model":"settleType","type":"select","options":this.settleTypeData,"label":"codeName","value":"codeValue","placeholder":"结算类型","method":"doQuery","isshow":true},
      ]
    }
  }
}
