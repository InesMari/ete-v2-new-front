  import tableCommon from "@/components/table/tableCommon.vue";
  import searchList from "@/components/searchList/searchList.vue";

  export default {
      name: 'ordWaybillVehicleManage',
      data()
      {
          return {
              head: [
                  {"name": "统计月份", "code": "createDateMonth", "width": "150", "type": "text"},
                  {"name": "运单总数", "code": "allCount", "width": "120", "type": "text"},
                  {"name": "危车数量", "code": "wyCount", "width": "120", "type": "text"},
                  {"name": "危车比例", "code": "wyRadio", "width": "120", "type": "text"},
                  {"name": "自有车数量", "code": "zyCount", "width": "120", "type": "text"},
                  {"name": "自有车比例", "code": "zyRadio", "width": "120", "type": "text"},
              ],
              query: this.initQuery(1),
          }
      },
      /**
       * 组件
       */
      components: {
          tableCommon,
          searchList
      },
      /**
       * 初始化
       */
      mounted()
      {
          this.initHead();  // 初始化表头
          this.doQuery();
      },
      watch: {
          // 监听整个 query 对象的变化（深度监听）
          query: {
              handler(newQuery) {
                  this.initHead();  // query 变化时重新初始化表头
              },
              deep: true  // 深度监听
          }
      },
      /**
       * 绑定函数
       */
      methods: {
          initHead() {
              // 重置 head
              this.head = [
                  {"name": "统计月份", "code": "createDateMonth", "width": "150", "type": "text"},
                  {"name": "运单总数", "code": "allCount", "width": "120", "type": "text"},
                  {"name": "危车数量", "code": "wyCount", "width": "120", "type": "text"},
                  {"name": "危车比例", "code": "wyRadio", "width": "120", "type": "text"},
                  {"name": "自有车数量", "code": "zyCount", "width": "120", "type": "text"},
                  {"name": "自有车比例", "code": "zyRadio", "width": "120", "type": "text"},
              ];

              // 根据 type 添加客户名称列
              if (this.query.type === 1) {
                  this.head.splice(1, 0, {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"});
              }
          },
          initQuery(type)
          {
              const now = new Date();
              const endMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
              const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6个月前
              const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
              return this.query = {
                  tenantName: '',
                  createMonth: [startMonth, endMonth],
                  type:type,
              }
          },
          /**
           * 查询列表
           * query  空值时，默认为页面配置参this.query，传值时为传值参
           */
          async doQuery(query = this.query)
          {
              this.query = query;
              
              // 验证统计月份必须存在且跨度不超过一年
              if(!this.query.createMonth || this.query.createMonth.length !== 2){
                  this.$message.warning('请选择统计月份');
                  return;
              }
              
              const [startMonth, endMonth] = this.query.createMonth;
              const startDate = new Date(startMonth + '-01');
              const endDate = new Date(endMonth + '-01');
              const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
              
              if(diffMonths > 12){
                  this.$message.warning('统计月份跨度不能超过一年');
                  return;
              }
              
              this.query.startCreateMonth = startMonth;
              this.query.endCreateMonth = endMonth;
              
              this.$refs.table.load("ordWaybillTF", "queryOrdWaybillVehiclePage", this.query);
          },
          downloadExcel()
          {
              this.$refs.table.downloadExcelFile();
          },

      },
      computed: {
          formData() {
              let data = [
                  {"name":"统计月份","model":"createMonth","type":"monthrange","isshow":true},
              ];
              if(this.query.type==1){
                  data.push({"name":"客户名称","model":"tenantName","type":"input","isshow":true});
              }
            return data;
          }
      },
  }