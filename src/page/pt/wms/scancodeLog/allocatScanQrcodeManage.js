import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'allocatScanQrcodeManage',
    data() {
        return {
            head: [
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "所属货主", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "120", "type": "text"},
                {"name": "管理单位", "code": "unitName", "width": "120", "type": "text"},
                {"name": "数量", "code": "nums", "width": "100", "type": "text"},
                {"name": "物料标签编码", "code": "codeNum", "width": "150", "type": "text"},
                {"name": "原库区", "code": "srcReservoirCode", "width": "120", "type": "text"},
                {"name": "原库位", "code": "srcStorageCode", "width": "120", "type": "text"},
                {"name": "新库区", "code": "newReservoirCode", "width": "120", "type": "text"},
                {"name": "新库位", "code": "newStorageCode", "width": "120", "type": "text"},
                {"name": "操作时间", "code": "doDate", "width": "150", "type": "text"},
                {"name": "操作人", "code": "doUserName", "width": "120", "type": "text"},
            ],
            loadParam: {
                tenantName:'',
                doDate:[],
                codeNum:'',
                materialNum:'',
                batchNum:'',
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
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.doDate) && this.loadParam.doDate.length==2){
                this.loadParam.startDate = this.loadParam.doDate[0];
                this.loadParam.endDate = this.loadParam.doDate[1];
            }else{
                this.loadParam.startDate = '';
                this.loadParam.endDate = '';
            }
            this.$refs.table.load("wmsStockMaterialTF", "queryAllocatScanQrcodePage", this.loadParam);
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
                {"name":"所属货主","model":"tenantName","type":"input","placeholder":"所属货主","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"操作时间","model":"doDate","type":"datetimerange","isshow":true,"row":2},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"物料标签","model":"codeNum","type":"input","placeholder":"物料标签","isshow":true},
            ]
        }
    },
}
