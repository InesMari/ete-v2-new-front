import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'wmsFeeIncomeManage',
  data() {
    return {
      head:
      [
        {"name": "客户", "code": "custTenantName", "width": "250", "type": "text"},
        {"name": "账单编号", "code": "", "width": "150", "type": "diy"},
        {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
        // {"name": "仓库地址", "code": "workAddressStr", "width": "300", "type": "text"},
        {"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
        {"name": "费用类型", "code": "itemTypeName", "width": "100", "type": "text"},
        // {"name": "费用来源", "code": "srcName", "width": "100", "type": "text"},
        {"name": "税率(%)", "code": "tax", "width": "90", "type": "text"},
        {"name": "费用合计", "code": "totalFeeWithTax", "width": "100", "type": "text"},
        {"name": "费用合计(不含税)", "code": "totalFee", "width": "100", "type": "text"},
        {"name": "是否入账", "code": "isEntryName", "width": "100", "type": "text"},
        {"name": "是否生成报表", "code": "isEntryRptName", "width": "100", "type": "text"},
        {"name": "数据来源", "code": "srcName", "width": "100", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
      ],
      detailHead:[
        {"name": "类型", "code": "srcOperationName", "width": "80", "type": "text"},
        {"name": "单号", "code": "orderNum", "width": "120", "type": "text"},
        {"name": "费用类型", "code": "itemTypeName", "width": "100", "type": "text"},
        {"name": "费用项目名称", "code": "itemName", "width": "150", "type": "text"},
        {"name": "不含税价", "code": "price", "width": "80", "type": "text"},
        {"name": "税率(%)", "code": "tax", "width": "80", "type": "text"},
        {"name": "含税价", "code": "priceWithTax", "width": "80", "type": "text"},
        {"name": "数量", "code": "num", "width": "80", "type": "text"},
        {"name": "不含税金额", "code": "totalFee", "width": "100", "type": "text"},
        {"name": "含税金额", "code": "totalFeeWithTax", "width": "100", "type": "text"},
      ],
      query: {
        tenantName: this.$route.query.tenantName,//客户详情仓储费用跳转
        workId: this.common.isBlank(this.$route.query.workId) ? '' : parseInt(this.$route.query.workId),
        workAddressStr: '',
        billMonths: this.common.isBlank(this.$route.query.startDate) ? '' :[this.$route.query.startDate,this.$route.query.endDate],
        src: this.common.isBlank(this.$route.query.startDate) ? '' :2,
        isEntry: '',
        isEntryRpt: '',
        itemType:'',
        ids:this.$route.query.ids,
      },
      storeHouseOptions:[],
      dic_whether:[],
      itemTypeData:[],
      bizItemTypeData:[],
      leasingTenantOptions: [],
      srcData:[{
        "codeName": "自动生成",
        "codeValue":1
      },
      {
        "codeName": "手工录入",
        "codeValue":2
      }],
      bizData:{
        billMonth:'',
        custTenantId:'',
        itemType:'',
        tax:'',
        totalFee:'',
        totalFeeWithTax:'',
        remark:'',
        workStoreId:'',
      },
      showDialog: false,
      showCommitButton: false,
      detailDisableSwitch: true,
      add:true,
      dialogTitle: '',
      pickerOptions: {
        disabledDate(time) {
          //当前日期小于等于5号时,可以选择上月和当月.
          let now = new Date();
          let date = now.getDate();
          if (date <= 5)
          {
            let curDate = new Date().getTime();
            let monthTime = 30 * 24 * 3600 * 1000;
            let startDate = curDate - monthTime;
            return time.getTime() < startDate;
          }
          else
          {
            return time.getTime() < new Date(now.toLocaleDateString()).getTime();
          }
        },
      },
      showDetailDialog:false,

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
    initQuery()
    {
      return this.query = {
        tenantName: '',
        workId: '',
        workAddressStr: '',
        billMonths: '',
        isEntry: '',
        isEntryRpt: '',
        itemType:'',
        ids: '',
      };
    },
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      if(this.common.isNotBlank(this.query.billMonths) && this.query.billMonths.length === 2){
        this.query.startBillMonth = this.query.billMonths[0];
        this.query.endBillMonth = this.query.billMonths[1];
      }else{
        this.query.startBillMonth = '';
        this.query.endBillMonth = '';
      }
      this.$refs.table.load("wmsFeeIncomeTF", "queryWmsFeeIncome", this.query);
    },


    /**
     * 初始化数据
     */ async initData() {
      let that = this;
      //租赁客户数据
      this.common.postUrl("storeHouseBizTF", "getLeasingCustomer", {}, function (data) {
        that.leasingTenantOptions = data;
      });
      //仓库数据
      this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {regionFlag: 1}, function (data) {
        that.storeHouseOptions = data;
      });
      //加载静态枚举
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
        that.dic_whether = data;
      });
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_TYPE"}, function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].codeValue ==1||data[i].codeValue >=100){//长途运输
            that.itemTypeData.push(data[i]);
          }
        }
        that.$forceUpdate();
      });
      //仓库数据
      this.common.postUrl("wmsQuoteSheetTF", "queryItemType", {}, function (data) {
        that.bizItemTypeData = data;
      });
      let billDateInfo = await this.common.postUrl("commonTF", "getBillDate", {});
      this.pickerOptions = {
        disabledDate(time) {
          //当前日期小于等于5号时,可以选择上月和当月.
          let now = new Date();
          let date = now.getDate();
          if (date < parseInt(billDateInfo.billDate)||billDateInfo.specialOrg) {
            let month = parseInt(billDateInfo.billMonth);
            let curDate = new Date().getTime();
            let monthTime = 30 * 24 * 3600 * 1000 * month;
            let startDate = curDate - monthTime;
            return time.getTime() < startDate;
          } else {
            return time.getTime() < new Date(now.toLocaleDateString()).getTime();
          }
        },
      };
      this.$forceUpdate();


    },
    clearBizData(){
      this.bizData={
          billMonth:'',
          custTenantId:'',
          itemType:'',
          tax:'',
          totalFee:'',
          totalFeeWithTax:'',
          remark:'',
          workStoreId:'',
      };
    },
    itemTypeChange(){
      let that = this;
      let data = this.itemTypeData.find( item => item.codeValue ==that.bizData.itemType)
      if(data){
        this.bizData.tax = data.codeDesc;
      }
    },

    async dblclickItem(item) {
       if(item.src==3){
         this.dialogTitle = '查看月收入';
         this.showCommitButton = false;
         this.detailDisableSwitch = false;
         this.add = false;
         this.bizData = this.common.copyObj(item);
         this.bizData.itemType = this.bizData.itemType+'';
         // let workStoreId = this.bizData.workStoreId;
         // await this.changeCustomer();
         // this.bizData.workStoreId = workStoreId;
         // this.storeHouseChange();
         this.showDialog = true;
       }else{
         if (item.detailType == 1) {
           this.$emit('openTab', {
             urlName: '仓储收入明细列表',
             urlId: 'wmsFeeIncomeDtlManage' + new Date().getTime(),
             urlPathName: "/wmsFeeIncomeDtlManage",
             urlPath: "/pt/fc/storehouse/wmsFeeIncomeDtlManage.vue",
             query: {workId: item.workStoreId,billMonth:item.billMonth,itemType:item.itemType,tenantName:item.custTenantName},
           });
         }else{
           this.$emit('openTab', {
             urlName: '月收入详情',
             urlId: 'wmsFeeIncomeRentStatement',
             urlPathName: "/wmsFeeIncomeRentStatement",
             urlPath: "/pt/fc/storehouse/wmsFeeIncomeRentStatement.vue",
             query: {id: item.id},
           });
         }
       }
    },
    toDetail(){
      let array = this.$refs.table.getSelectItem();
      if(array.length==0){
        this.$emit('openTab', {
          urlName: '仓储收入明细列表',
          urlId: 'wmsFeeIncomeDtlManage' + new Date().getTime(),
          urlPathName: "/wmsFeeIncomeDtlManage",
          urlPath: "/pt/fc/storehouse/wmsFeeIncomeDtlManage.vue",
          query: {},
        });
        return;
      }
      if (array.length !== 1) {
        this.$message.error("请选择一条数据!");
        return false;
      }
      this.dblclickItem(array[0]);
      // if (array[0].detailType == 1) {
      //   this.$emit('openTab', {
      //     urlName: '仓储收入明细列表',
      //     urlId: 'wmsFeeIncomeDtlManage',
      //     urlPathName: "/wmsFeeIncomeDtlManage",
      //     urlPath: "/pt/fc/storehouse/wmsFeeIncomeDtlManage.vue",
      //     query: {workId: array[0].workStoreId,billMonth:array[0].billMonth,itemType:array[0].itemType,tenantName:array[0].custTenantName},
      //   });
      // }else{
      //   this.$emit('openTab', {
      //     urlName: '月收入详情',
      //     urlId: 'wmsFeeIncomeRentStatement',
      //     urlPathName: "/wmsFeeIncomeRentStatement",
      //     urlPath: "/pt/fc/storehouse/wmsFeeIncomeRentStatement.vue",
      //     query: {id: array[0].id},
      //   });
      // }
    },
    /**
     * 显示新增弹出框
     * type 1 新增  2 修改  3 查看
     */
    async displayDialog(type) {
      this.clearBizData();
      this.detailDisableSwitch = true;
      this.add = true;
      //租赁客户数据
      let that = this;
      this.common.postUrl("storeHouseBizTF", "getLeasingCustomer", {}, function (data) {
        that.leasingTenantOptions = data;
      });
      if (type == 1) {
        this.dialogTitle = '新增月收入';
        this.showCommitButton = true;
      } else {
        let array = this.$refs.table.getSelectItem();
        if (array.length !== 1) {
          this.$message.error("请选择一条数据!");
          return false;
        }
        if (type == 2) {
          if (this.common.isNotBlank(array[0].billNum)) {
            this.$message.error("已入账数据不允许修改！账单编号：" + array[0].billNum);
            return false;
          }
          if (this.common.isNotBlank(array[0].rptMonth)) {
            this.$message.error("已入报表数据不允许修改！报表月份：" + array[0].rptMonth);
            return false;
          }
          if (array[0].src != 3) {
            this.$message.error("手动添加的数据才可以修改");
            return false;
          }
          this.dialogTitle = '修改月收入';
          this.showCommitButton = true;
        }else{
          this.dialogTitle = '查看月收入';
          this.showCommitButton = false;
          this.detailDisableSwitch = false;
        }
        this.add = false;
        this.bizData = this.common.copyObj(array[0]);
        this.bizData.itemType = this.bizData.itemType+'';
        // let workStoreId = this.bizData.workStoreId;
        // await this.changeCustomer();
        // this.bizData.workStoreId = workStoreId;
        // this.storeHouseChange();
      }
      this.showDialog = true;
    },
    /**
     * 关闭新增客户弹出框
     */
    closeDialog() {
      this.showDialog = false;
    },
    closeDetailDialog(){
      this.showDetailDialog = false;
    },
    /**
     * 选择客户时，刷新仓库数据
     */
    async changeCustomer() {
      let that = this;
      let cust = this.leasingTenantOptions.find(item => item.custTenantId == that.bizData.custTenantId);
      if(that.bizData.custTenantId&&(cust==null||cust==undefined)){
        this.$message.error('客户合同已经过期，不再允许修改');
      }
      let custId = cust.custId
      if (custId) {
        await this.common.postUrl("storeHouseBizTF", 'getActiveStoreHouseInfo', {
          custId: custId,
        }, function (data) {
          that.bizData.workStoreId = '';
          that.bizData.workAddressStr = '';
          that.bizData.storeHouseArea = '';
          that.storeHouseOptions = data;
          if(that.storeHouseOptions!=null&&that.storeHouseOptions.length==1){
            that.bizData.workStoreId=that.storeHouseOptions[0].workId;
            that.storeHouseChange();
          }
        }, null, '', true);
      }
    },


    /** 选择仓库 */
    storeHouseChange() {
      let that = this;
      this.bizData.workAddressStr = '';
      this.bizData.storeHouseArea = '';

      let storeHouseOption = this.storeHouseOptions.find( item => item.workId ==that.bizData.workStoreId);
      if(storeHouseOption){
        this.bizData.workAddressStr = storeHouseOption.workAddressStr;
        this.bizData.storeHouseArea = storeHouseOption.storehouseArea;
      }
      this.$forceUpdate();
    },

    /**
     * 计算不含税费用
     */
    calculateFeeAmountExTax() {
      let totalFeeWithTax = this.bizData.totalFeeWithTax;//含税费用
      let taxRate = this.bizData.tax;//税率
      if (totalFeeWithTax > 0 && taxRate > 0) {
        this.bizData.totalFee = this.common.accDiv(totalFeeWithTax,
            1 + this.common.accDiv(taxRate, 100)).toFixed(4);
      }
    },
    save() {
      let that = this;
      if(this.common.isBlank(this.bizData.custTenantId)){
        this.$message.error("客户不能为空");
        return false;
      }
      if(this.common.isBlank(this.bizData.workStoreId)){
        this.$message.error("仓库名称不能为空");
        return false;
      }
      if(this.common.isBlank(this.bizData.billMonth)){
        this.$message.error("费用月份不能为空");
        return false;
      }
      if(this.common.isBlank(this.bizData.itemType)){
        this.$message.error("费用类型不能为空");
        return false;
      }
      if(this.common.isBlank(this.bizData.totalFeeWithTax)){
        this.$message.error("含税费用不能为空");
        return false;
      }

      this.common.postUrl("wmsFeeIncomeTF", 'addOrUpdateWmsfee', that.bizData, function (data) {
        if (data) {
          that.showDialog = false;
          that.doQuery();
          that.$message.success(that.dialogTitle + "成功！");
        }
      }, null, '', true);
    },
    /**
     * 确认账单的明细
     */
    toCustomerConfirmedBillDetail(data)
    {
      this.$emit('openTab', {
        urlName: '确认账单明细',
        urlId: 'confirmBillDetail',
        urlPathName: "/fc",
        urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
        query: {billId: data.fcCustBillId,tabId: enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE, flag: 1},
      });
    },
    deleteFee() {
      let that = this;
      let array = this.$refs.table.getSelectItem();
      if (array.length == 0) {
        this.$message.error("请至少选择一条数据");
        return false;
      }
      let ids = '';
      let names = '';
      for (let i = 0; i < array.length; i++) {
        if (this.common.isNotBlank(array[i].billNum)) {
          this.$message.error("已入账数据不允许删除！账单编号：" + array[i].billNum);
          return false;
        }
        if (this.common.isNotBlank(array[i].rptMonth)) {
          this.$message.error("已入报表数据不允许删除！报表月份：" + array[i].rptMonth);
          return false;
        }
        if (array[i].src != 3) {
          this.$message.error("手动添加的数据才可以删除");
          return false;
        }
        ids += ',' + array[i].id;
        names += ','+array[i].custTenantName+'-'+array[i].workName+array[i].billMonth+array[i].itemTypeName;
      }
      ids = ids.substr(1);
      names = names.substr(1);

      const h = this.$createElement;
      this.$msgbox({
        title: "删除客户月收入",
        message: h('p', null, [
          h('span', null, "此操作将客户月收入："),
          h('i', { style: 'color: red' }, names),
          h('span', null, "删除，是否继续？"),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      }).then(() => {
        this.common.postUrl("wmsFeeIncomeTF", "delWmsFee", {ids:ids}, function (data) {
          if (that.common.isNotBlank(data)) {
            that.doQuery();
            that.$message.success("删除成功！");
          }
        }, null, '', true);
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },

    /**
     * 清空
     */
    clear() {
      this.query =
          {
            tenantName: '',
            workId: '',
            workAddressStr: '',
            billMonths: this.common.isBlank(this.$route.query.startDate) ? '' :[this.$route.query.startDate,this.$route.query.endDate],
            isEntry: '',
            isEntryRpt: '',
            itemType:'',
          };
    },

    /**
     * 导出
     */
    downExcel() {
      this.$refs.table.downloadExcelFile();
    },
    gotoLog()
    {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
        this.$message.error("请选择一条数据！");
        return;
      }
      let data = selectData[0];
      this.$emit("openTab",{
        urlId: 'feeIncome' + 'Detail' + data.id,
        query: {
          logId: data.id,
          logType: enumData.LOG_TYPE.WMS_FEE_INCOME,
        },
        urlName: "月收入" + "操作日志",
        urlPathName: "/operateLog",
        urlPath: "/pt/operateLog/operateLog.vue"});
    },

  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    searchList
  },
  computed:{
    formData(){
      return [
        {"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
        {"name":"仓库名称","model":"workId","type":"select","options":this.storeHouseOptions,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
        {"name":"费用类型","model":"itemType","type":"select","options":this.itemTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
        // {"name":"仓库地址","model":"workAddressStr","type":"input","placeholder":"仓库地址","isshow":true},
        {"name":"费用产生月份","model":"billMonths","type":"monthrange","isshow":true},
        {"name":"数据来源","model":"src","type":"select","options":this.srcData,"label":"codeName","value":"codeValue","placeholder":"数据来源","method":"doQuery","isshow":true},
        {"name":"是否入账","model":"isEntry","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
        {"name":"是否生成报表","model":"isEntryRpt","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
      ]
    }
  },
}
