import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";

export default {
  name: 'pkgBusinessManage',
  data() {
    return {
      head:
          [
            {"name": "包装名称", "code": "pkgName", "width": "150", "type": "text"},
            {"name": "包装类型", "code": "packingTypeName", "width": "150", "type": "text"},
            {"name": "长宽高(mm)", "code": "lengthStr", "width": "90", "type": "text"},
            {"name": "包装配件", "code": "packComponentsStr", "width": "150", "type": "text"},
            {"name": "总数量", "code": "totalNums", "width": "100", "type": "text"},
            {"name": "内部在库", "code": "innerNums", "width": "100", "type": "text"},
            {"name": "客户在库", "code": "outterNums", "width": "100", "type": "text"},
            {"name": "未回收", "code": "reoveryNums", "width": "100", "type": "text"},
            {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
            {"name": "创建时间", "code": "createDate", "width": "100", "type": "text"}
          ],
      query: {},
      packTypeOptions: [],
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
     *
     */
    doQuery() {
      this.query.custTenantId = this.common.userInfo().tenantId;
      this.$refs.table.load("pkgBusinessTF", "queryPkgBusinessPage", this.query);
    },

    /**
     * 初始化数据
     */
    initData() {
      let that = this;
      //包装类型
      this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"}, function (data) {
        that.packTypeOptions = data;
      });
    },

    /** 查看明细 */
    dblclickItem(data)
    {
      // let array = this.$refs.table.getSelectItem();
      // if (array.length !== 1)
      // {
      //   this.$message.error("请选择一条数据");
      //   return false;
      // }
      // this.$emit("openTab",{
      //   urlId: 'packObjectManage' + array[0].pkgId,
      //   query: {pkgId:array[0].pkgId,custTenantId:array[0].custTenantId},
      //   urlName: "查看明细",
      //   urlPathName: "/business",
      //   urlPath: "/hz/pkg/business/packObjectManage.vue"});

      this.$emit("openTab",{
        urlId: 'packObjectManage' + data.pkgId,
        query: {pkgId:data.pkgId,custTenantId:data.custTenantId},
        urlName: "查看明细",
        urlPathName: "/business",
        urlPath: "/hz/pkg/business/packObjectManage.vue"});
    },

    /** 地图查看 */
    toPackMonitor()
    {
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1)
      {
        this.$message.error("请选择一条数据!");
        return false;
      }
      this.$emit("openTab",{
        urlId: 'packMonitor' + array[0].pkgId,
        query: {custTenantId:array[0].custTenantId},
        urlName: "地图查看",
        urlPathName: "/business",
        urlPath: "/pt/pkg/business/packMonitor.vue"});
    },

    /**
     * 清空
     */
    clear() {
      this.query = {};
    },
  },

    /**
     * 组件
     */
    components: {
      tableCommon,
      myFileModel,
      myElDatePicker,
      myImport,
    },
}