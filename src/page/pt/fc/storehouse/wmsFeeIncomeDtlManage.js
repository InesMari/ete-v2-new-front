import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
  name: 'wmsFeeIncomeDtlManage',
  data() {
    return {
      head:
      [
        {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
        {"name": "结算日期", "code": "billDate", "width": "100", "type": "text"},
        {"name": "客户", "code": "custTenantName", "width": "250", "type": "text"},
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
        workId: this.common.isBlank(this.$route.query.workId) ? '' : parseInt(this.$route.query.workId),
        billMonth: this.common.isBlank(this.$route.query.billMonth) ? '' :this.$route.query.billMonth,
        tenantName: this.$route.query.tenantName,//客户详情仓储费用跳转
        itemType:this.$route.query.itemType,
      },
      storeHouseOptions:[],
      itemTypeData:[],
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
      };
    },
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      this.$refs.table.load("wmsFeeIncomeTF", "queryWmsFeeIncomeDetail", this.query);
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
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_TYPE"}, function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].codeValue ==1||data[i].codeValue >=100){//长途运输
            that.itemTypeData.push(data[i]);
          }
        }
        that.$forceUpdate();
      });
      this.$forceUpdate();

    },

    /**
     * 清空
     */
    clear() {
      this.query =
          {
            workId: '',
            tenantName: '',
            billMonth: '',
            itemType:'',
          };
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
        {"name":"费用类型","model":"itemType","type":"select","options":this.itemTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
      ]
    }
  },
}
