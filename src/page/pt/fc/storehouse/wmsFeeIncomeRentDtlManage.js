import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
  name: 'wmsFeeIncomeRentDtlManage',
  data() {
    return {
      head:
      [
        {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
        {"name": "结算日期", "code": "billDate", "width": "100", "type": "text"},
        {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
        {"name": "计费类型", "code": "countRuleName", "width": "140", "type": "text"},
        {"name": "计费单位", "code": "unit", "width": "100", "type": "text"},
        {"name": "结存数量", "code": "balanceNum", "width": "100", "type": "text"},
        {"name": "最大流量", "code": "maxPalletNums", "width": "100", "type": "text"},
        {"name": "计费流量", "code": "num", "width": "100", "type": "text"},
        {"name": "税率(%)", "code": "tax", "width": "80", "type": "text"},
        {"name": "不含税价", "code": "price", "width": "80", "type": "text"},
        {"name": "含税价", "code": "priceWithTax", "width": "80", "type": "text"},
        {"name": "不含税金额", "code": "totalFee", "width": "100", "type": "text"},
        {"name": "含税金额", "code": "totalFeeWithTax", "width": "100", "type": "text"},
      ],
      query: {
        workId: '',
        billMonth: '',
        tenantName: '',//客户详情仓储费用跳转
        countRule:'',
        feeStatementId:this.$route.query.feeStatementId
      },
      storeHouseOptions:[],
      countRuleData:[],
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
        workId: '',
        tenantName: '',
        billMonth: '',
        itemType:'',
        feeStatementId:'',
      };
    },
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      this.$refs.table.load("wmsFeeIncomeTF", "queryWmsFeeIncomeRentDetail", this.query);
    },


    /**
     * 初始化数据
     */
    async initData() {
      let that = this;
      //仓库数据
      this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {regionFlag: 1}, function (data) {
        that.storeHouseOptions = data;
      });
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COUNT_RULE"}, function (data) {
        that.countRuleData = data;
      });
      this.$forceUpdate();

    },

    /**
     * 导出
     */
    downExcel() {
      this.$refs.table.downloadExcelFile();
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
        {"name":"仓库名称","model":"workId","type":"select","options":this.storeHouseOptions,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
        {"name":"费用产生月份","model":"billMonth","type":"month","isshow":true},
        {"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
        {"name":"计费类型","model":"countRule","type":"select","options":this.countRuleData,"label":"codeName","value":"codeValue","placeholder":"计费类型","method":"doQuery","isshow":true},
      ]
    }
  },
}
