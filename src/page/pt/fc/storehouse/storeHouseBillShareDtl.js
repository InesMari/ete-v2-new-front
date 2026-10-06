import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'storeHouseBillShareDtl',
  data() {
    return {
      head:
      [
        {"name": "客户", "code": "custName", "width": "150", "type": "text"},
        {"name": "供应商", "code": "supplierName", "width": "150", "type": "text"},
        {"name": "仓库名称", "code": "storeHouseName", "width": "90", "type": "text"},
        {"name": "仓库地址", "code": "storeHouseAddress", "width": "150", "type": "text"},
        {"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
        {"name": "仓库成本", "code": "totalCostAmount", "width": "100", "type": "text"},
        {"name": "分摊成本", "code": "shareCostAmount", "width": "100", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "100", "type": "text"}
      ],
      query: {
        id: '',
        custId: '',
        supplierTenantId: '',
        storeHouseId: '',
        workAddressStr: '',
        billMonth: '',
        isEntry: '',
      },
      hzTenantOptions:'',
      supplierData:'',
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
      this.$refs.table.load("fcStoreHouseBillBizTF", "queryFcStoreHouseBillShareDtlPage", this.query);
    },


    /**
     * 初始化数据
     */
    initData() {
      let that = this;
      //客户
      this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
        that.hzTenantOptions = data;
      });
      //仓库数据
      // this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
      //   that.storeHouseOptions = data;
      //   // that.storeHouseOptions.unshift({storeHouseId: '', workName: ''});
      // });
      //供应商
      this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
        that.supplierData = data;
      });
    },

    /**
     * 清空
     */
    clear() {
      this.query=
          {
            id: '',
            billType: this.$route.query.t,
            storeHouseId: '',
            workAddressStr: '',
            billMonth: '',
            isEntry: '',
          };
    },


  },
  /**
   * 组件
   */
  components: {
    tableCommon,
  },
}
