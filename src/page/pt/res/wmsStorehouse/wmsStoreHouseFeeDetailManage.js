import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
  name: 'wmsStoreHouseFeeDetailManage',
  data() {
    return {
      head: [
        {"name": "物流中心", "code": "workName", "width": "180", "type": "text"},
        {"name": "费用类型", "code": "feeTypeName", "width": "180", "type": "text"},
        {"name": "供应商", "code": "supplierTenantName", "width": "180", "type": "text"},
        {"name": "费用月份", "code": "billMonth", "width": "150", "type": "text"},
        {"name": "是否入账", "code": "isEntryAcctName", "width": "100", "type": "text"},
        {"name": "是否支付", "code": "isPayName", "width": "100", "type": "text"},
        {"name": "租赁费用编号", "code": "workFeeExtNum", "width": "150", "type": "diy"},
        {"name": "租赁面积（㎡）", "code": "storehouseArea", "width": "100", "type": "text"},
        {"name": "合同开始日期", "code": "leaseStartDate", "width": "140", "type": "date"},
        {"name": "合同结束日期", "code": "leaseEndDate", "width": "140", "type": "date"},
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
        {"name": "支付周期", "code": "payCycleName", "width": "100", "type": "text"},
        {"name": "计费方式", "code": "billingMethodName", "width": "100", "type": "text"},
        {"name": "押金（保证金）", "code": "deposit", "width": "100", "type": "text"},
        {"name": "计费开始日期", "code": "billingStartDate", "width": "140", "type": "date"},
        {"name": "计费结束日期", "code": "billingEndDate", "width": "140", "type": "date"},
        {"name": "租赁天数", "code": "leaseDays", "width": "120", "type": "text"},
        {"name": "月天数", "code": "billMonthDays", "width": "120", "type": "text"},
        {"name": "未税费用", "code": "totalFeeNoTax", "width": "100", "type": "text"},
        {"name": "含税费用", "code": "totalFee", "width": "100", "type": "text"},
        // {"name": "水费(含税)", "code": "waterFee", "width": "120", "type": "text"},
        // {"name": "电费(含税)", "code": "energyFee", "width": "120", "type": "text"},
        {"name": "异动费用(含税)", "code": "changeFee", "width": "120", "type": "text"},
        {"name": "费用合计(含税)", "code": "amount", "width": "120", "type": "text"},
        {"name": "实付费用(含税)", "code": "payFee", "width": "120", "type": "text"},
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
        supplierTenantName: '',
        billingMonth: [],
        isEntryAcct:'',
        isPay:'',
        billingMethod: '',
        remark: '',
      },
      workData:[],
      billingMethodData:[],
      whetherData:[],
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
      if(this.common.isNotBlank(this.query.billingMonth) && this.query.billingMonth.length === 2){
        this.query.startBillMonth = this.query.billingMonth[0];
        this.query.endBillMonth = this.query.billingMonth[1];
      }else{
        this.query.startBillMonth = '';
        this.query.endBillMonth = '';
      }
      let {items} = await this.$refs.table.load("wmsStorehouseTF", "queryStorehouseFeeDetailPage", query);
      items.forEach((el) =>{
        if(el.payFee>=el.amount){//已到期
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
      this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
      // 仓库
      this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
    },
    // 查看仓储合同
    toDetail({id}){
      this.$emit("openTab",{
        urlId: id+"detail",
        query:{id},
        urlName: "查看仓储租赁月费用详情",
        urlPathName: "/wmsStorehouseFeeDetail",
        urlPath: "/pt/res/wmsStorehouse/wmsStorehouseFeeDetail.vue"
      });
    },
    // 查看费用维护
    open({workFeeExtId}){
      this.$emit("openTab",{
        urlId: workFeeExtId+"detail",
        query:{id:workFeeExtId,type:3},
        urlName: "查看仓储租赁费用",
        urlPathName: "/saveStorehouseFee",
        urlPath: "/pt/res/wmsStorehouse/saveStorehouseFee.vue"
      });
    },
    download() {
      this.$refs.table.downloadExcelFile('仓租租赁月费用列表');
    },
  },
  computed:{
    formData(){
      return [
        {"name":"物流中心","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"物流中心","method":"doQuery","isshow":true},
        {"name":"供应商","model":"supplierTenantName","type":"input","placeholder":"供应商","isshow":true},
        {"name":"费用月份","model":"billingMonth","type":"monthrange","placeholder":"费用月份","isshow":true},
        {"name":"是否入账","model":"isEntryAcct","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
        {"name":"是否支付","model":"isPay","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否支付","method":"doQuery","isshow":true},
        {"name":"计费方式","model":"billingMethod","type":"select","options":this.billingMethodData,"label":"codeName","value":"codeValue","placeholder":"计费方式","method":"doQuery","isshow":true},
        {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
      ]
    }
  }
}
