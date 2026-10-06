import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'inOrderDtlManage',
    data() {
        return {
            head: [
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "120", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
                {"name": "入库单号", "code": "inOrderNum", "width": "120", "type": "diy"},
                {"name": "ASN", "code": "asn", "width": "120", "type": "text"},
                {"name": "管理单位", "code": "unitName", "width": "120", "type": "text"},
                {"name": "是否退货", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "是否冻结", "code": "freezeStateName", "width": "120", "type": "text"},
                {"name": "生产日期", "code": "produceDate", "width": "120", "type": "text"},
                {"name": "入库日期", "code": "realInDate", "width": "120", "type": "text"},
                {"name": "入库数量", "code": "nums", "width": "120", "type": "text"},
                {"name": "入库箱数", "code": "boxNums", "width": "120", "type": "text"},
                {"name": "入库托数", "code": "palletNums", "width": "120", "type": "text"},
                {"name": "库区", "code": "reservoirCode", "width": "120", "type": "text"},
                {"name": "库位", "code": "storageCode", "width": "120", "type": "text"}
            ],
            loadParam: {
                realInDate:'',
                produceDate:'',
                srcTenantName:'',
            },
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
        tableCommon,
        myElDatePicker,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.realInDate) && this.loadParam.realInDate.length === 2){
                this.loadParam.startRealInDate = this.loadParam.realInDate[0];
                this.loadParam.endRealInDate = this.loadParam.realInDate[1];
            }else{
                this.loadParam.startRealInDate = '';
                this.loadParam.endRealInDate = '';
            }
            if(this.common.isNotBlank(this.loadParam.produceDate) && this.loadParam.produceDate.length === 2){
                this.loadParam.startProduceDate = this.loadParam.produceDate[0];
                this.loadParam.endProduceDate = this.loadParam.produceDate[1];
            }else{
                this.loadParam.startProduceDate = '';
                this.loadParam.endProduceDate = '';
            }
            this.loadParam.isHZ=1;
            this.$refs.table.load("wmsInOrderTF", "queryInOrderDtlPage", this.loadParam);
        },
        view(data){
            this.$emit("openTab",{
                urlId: "inOrderDetail"+data.inOrderId,
                query: {inOrderId:data.inOrderId},
                urlName: '入库单详情',
                urlPathName: "/inOrderDetail",
                urlPath: '/hz/wms/ord/inOrderDetail.vue'});
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
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"物料描述","isshow":true},
                {"name":"ASN","model":"asn","type":"input","placeholder":"ASN","isshow":true},
                {"name":"入库日期","model":"realInDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
            ]
        }
    },
}
