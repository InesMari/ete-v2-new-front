import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import MyImport from "@/components/myImport/myImport.vue";

export default {
    name: 'vehicleNoGpsManage',
    data() {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "客户订单编号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "首次查询时间", "code": "firstQryTime", "width": "150", "type": "text"},
                {"name": "上次查询时间", "code": "lastQryTime", "width": "150", "type": "text"},
                {"name": "订单编号", "code": "orderNum", "width": "150", "type": "diy"},
            ],
            query: {
                plateNumber: '',
                custOrderNum: '',
            },
            uploadOpen : false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        MyImport,
        myFileModel,
        fileViewer,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         *
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        async doQuery(query = this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("resVehicleInfoTF", "queryVehicleNoGpsInfoList", this.query);
            items.forEach((el) => {
                if (new Date(el.expireTime).getTime() < new Date().getTime()) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        openDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'orderDetail' + data.orderId,
                query: {orderId: data.orderId,pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("导入成功！");
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },

    },
    computed:{
      formData(){  
            return [
                {"name":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"客户订单编号","model":"custOrderNum","type":"input","isshow":true},
            ]
        }
    },
}
