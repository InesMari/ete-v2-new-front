import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'wmsStoreHouseFeeManage',
  data() {
    return {
      head: [
        {"name": "租赁费用编号", "code": "workFeeExtNum", "width": "150", "type": "text"},
        {"name": "物流中心", "code": "workName", "width": "180", "type": "text"},
        {"name": "费用类型", "code": "feeTypeName", "width": "180", "type": "text"},
        {"name": "仓储租赁合同编号", "code": "contractNum", "width": "150", "type": "diy"},
        {"name": "供应商", "code": "supplierTenantName", "width": "180", "type": "text"},
        {"name": "租赁面积（㎡）", "code": "storehouseArea", "width": "100", "type": "text"},
        {"name": "计费开始日期", "code": "leaseStartDate", "width": "140", "type": "date"},
        {"name": "计费结束日期", "code": "leaseEndDate", "width": "140", "type": "date"},
        {"name": "合同期限", "code": "leaseMonth", "width": "120", "type": "text"},
        {"name": "未税单价", "code": "leaseFeePriceNoTax", "width": "100", "type": "text"},
        {"name": "租金税率", "code": "leaseFeeTaxRate", "width": "100", "type": "text"},
        {"name": "含税单价", "code": "leaseFeePrice", "width": "100", "type": "text"},
        {"name": "未税管理费单价", "code": "manageFeePriceNoTax", "width": "100", "type": "text"},
        {"name": "管理费税率", "code": "manageFeeTaxRate", "width": "100", "type": "text"},
        {"name": "含税管理费单价", "code": "manageFeePrice", "width": "100", "type": "text"},
        {"name": "未税其他杂费", "code": "otherFeeNoTax", "width": "100", "type": "text"},
        {"name": "杂费税率", "code": "otherFeeTaxRate", "width": "100", "type": "text"},
        {"name": "含税其他杂费", "code": "otherFee", "width": "100", "type": "text"},
        {"name": "未税费用", "code": "totalFeeNoTax", "width": "100", "type": "text"},
        {"name": "含税费用", "code": "totalFee", "width": "100", "type": "text"},
        {"name": "支付周期", "code": "payCycleName", "width": "100", "type": "text"},
        {"name": "计费方式", "code": "billingMethodName", "width": "100", "type": "text"},
        {"name": "押金（保证金）", "code": "deposit", "width": "100", "type": "text"},
        {"name": "合同开始日期", "code": "billingStartDate", "width": "140", "type": "date"},
        {"name": "合同结束日期", "code": "billingEndDate", "width": "140", "type": "date"},
        {"name": "未税费用合计", "code": "itemTotalFeeNoTax", "width": "120", "type": "text"},
        {"name": "含税费用合计", "code": "itemTotalFee", "width": "120", "type": "text"},
        // {"name": "水电费合计(含税)", "code": "waterAndEnergyFee", "width": "120", "type": "text"},
        {"name": "异动费用合计(含税)", "code": "changeFee", "width": "120", "type": "text"},
        {"name": "总费用合计(含税)", "code": "amount", "width": "120", "type": "text"},
        {"name": "实付费用合计(含税)", "code": "payFee", "width": "120", "type": "text"},
        {"name": "备注", "code": "remark", "width": "250", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
        {"name": "审核状态", "code": "verifyStateName", "width": "100", "type": "text"},
        {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
        {"name": "审核时间", "code": "verifyDate", "width": "130", "type": "text"},
        {"name": "审核意见", "code": "verifyRemark", "width": "130", "type": "text"}
      ],
      query: {
        workId: '',
        billingDate: [],
        workFeeExtNum: '',
        billingMethod: '',
        verifyState:'',
        supplierTenantName: '',
        remark: '',
      },
      workData:[],
      billingMethodData:[],
      verifyStateData:[],
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
     */
    async doQuery(query = this.query) {
      this.query = query;
      if(this.common.isNotBlank(this.query.billingDate) && this.query.billingDate.length === 2){
        this.query.billingStartDate = this.query.billingDate[0];
        this.query.billingEndDate = this.query.billingDate[1];
      }else{
        this.query.billingStartDate = '';
        this.query.billingEndDate = '';
      }
      let {items} = await this.$refs.table.load("wmsStorehouseTF", "queryStorehouseFeePage", query);
      items.forEach((el) =>{
        let billingEndDate = new Date(el.billingEndDate);
        if(billingEndDate.getTime()<new Date().getTime()){//已到期
          el.disabled = true;
        }
      })
      this.$refs.table.resetData(items);
    },
    /**
     * 初始化数据
     */
    async initData() {
      this.billingMethodData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BILLING_METHOD"});
      this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
      // 仓库
      this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
    },
    add(){
      this.$emit("openTab",{
        urlId: new Date().getTime(),
        query:{type:1},
        urlName: "新增仓储租赁费用",
        urlPathName: "/saveStorehouseFee",
        urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
      });
    },
    update(){
      let item = this.$refs.table.getSelectItem();
      if(item.length!=1){
        this.$message.error("请选择一条数据。")
      }
      let id = item[0].id;

      if (item[0].verifyState==1)
      {
        let msg = `
                    <p style="text-align:center;">注：租赁费用编号：${item[0].workFeeExtNum}已审核!</p>
                    <p style="text-align:center;">若继续进行此操作，原费用单将自动存放于历史费用中，</p>
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
        this.$confirm(msg, "修改提示" ,{
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString:true
        }).then(() =>{
          this.$emit("openTab",{
            urlId: "update"+id,
            query:{id,type:2},
            urlName: "修改仓储租赁费用",
            urlPathName: "/saveStorehouseFee",
            urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
          });
        }).catch(() =>{})
      }else{
        this.$emit("openTab",{
          urlId: "update"+id,
          query:{id,type:2},
          urlName: "修改仓储租赁费用",
          urlPathName: "/saveStorehouseFee",
          urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
        });
      }
    },
    del(){
      let that = this;
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1) {
        this.$message.error("请选择一条数据");
        return false;
      }
      if(array[0].verifyState==1){
        this.$message.error("该费用已经审核通过，不能删除");
        return false;
      }
      this.$confirm("你将删除费用编号："+array[0].workFeeExtNum+"，是否继续？", "提示").then(() =>{
        that.common.postUrl("wmsStorehouseTF", 'delStorehouseFee', {id: array[0].id}, function (data) {
          if (data) {
            that.doQuery();
            that.$message.success("删除成功！");
          }
        },null,'',true);
      }).catch(() =>{})
    },
    verify(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !== 1)
      {
        this.$message.error("请选择一条需要审核的数据！");
        return false;
      }
      if (selectData[0].verifyState!=0)
      {
        this.$message.error("只有未审核的数据才可以确认！");
        return false;
      }
      let id = selectData[0].id;
      this.$emit("openTab",{
        urlId: "verify"+id,
        query:{id,type:4},
        urlName: "审核仓储租赁费用",
        urlPathName: "/saveStorehouseFee",
        urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
      });
    },
    copyAdd(){
      let item = this.$refs.table.getSelectItem();
      if(item.length!=1){
        this.$message.error("请选择一条数据。")
      }
      let id = item[0].id;
      this.$emit("openTab",{
        urlId: id+new Date().getTime(),
        query:{id,type:1},
        urlName: "新增仓储租赁费用",
        urlPathName: "/saveStorehouseFee",
        urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
      });
    },
    // 查看仓储合同
    dblclickItem({id}){
      this.$emit("openTab",{
        urlId: id+"detail",
        query:{id,type:3,
          logId: id,
          logType: enumData.LOG_TYPE.WMS_FEE,
        },
        urlName: "查看仓储租赁费用",
        urlPathName: "/saveStorehouseFee",
        urlPath: "/pt/res/wmsStorehouse/saveStorehouseFeeMain.vue"
      });
    },
    open(item){
      let title = "查看供应商-仓储运作合同";
      this.$emit('openTab', {
        urlName: title,
        urlId: 'contractDetail'+new Date().getTime(),
        urlPathName: "/contractDetail",
        urlPath: "/pt/cm/contract/contractDetail.vue",
        query: {type:3,contractType:3,id:item.contractId},
      });
    },
    download() {
      this.$refs.table.downloadExcelFile('仓储租赁费用列表');
    },
  },
  computed:{
    formData(){
      return [
        {"name":"物流中心","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"物流中心","method":"doQuery","isshow":true},
        {"name":"合同日期","model":"billingDate","type":"daterange","placeholder":"合同日期","isshow":true},
        {"name":"租赁费用编号","model":"workFeeExtNum","type":"input","placeholder":"费用编号","isshow":true},
        {"name":"计费方式","model":"billingMethod","type":"select","options":this.billingMethodData,"label":"codeName","value":"codeValue","placeholder":"计费方式","method":"doQuery","isshow":true},
        {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
        {"name":"供应商","model":"supplierTenantName","type":"input","placeholder":"供应商","isshow":true},
        {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
      ]
    }
  }
}
