import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";


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
                {"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "管理单位", "code": "unitName", "width": "120", "type": "text"},
                {"name": "入库类型", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "是否冻结", "code": "freezeStateName", "width": "120", "type": "text"},
                {"name": "生产日期", "code": "produceDate", "width": "120", "type": "text"},
                {"name": "预计入库日期", "code": "requireInDate", "width": "120", "type": "text"},
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
            showSelWork:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
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
        selectWork
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.requireInDate) && this.loadParam.requireInDate.length === 2){
                this.loadParam.startRequireInDate = this.loadParam.requireInDate[0];
                this.loadParam.endRequireInDate = this.loadParam.requireInDate[1];
            }else{
                this.loadParam.startRequireInDate = '';
                this.loadParam.endRequireInDate = '';
            }
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
            this.$refs.table.load("wmsInOrderTF", "queryInOrderDtlPage", this.loadParam);
        },
        view(data){
            this.$emit("openTab",{
                urlId: "inOrderDetail"+data.inOrderId,
                query: {inOrderId:data.inOrderId,
                    logId: data.inOrderId,
                    logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                },
                urlName: '入库单详情',
                urlPathName: "/inOrderDetail",
                urlPath: '/pt/wms/ord/inOrderDetail.vue'});
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
                {"name":"货主","model":"srcTenantName","type":"input","placeholder":"货主","isshow":true},
                {"name":"ASN","model":"asn","type":"input","placeholder":"ASN","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"预计入库日期","model":"requireInDate","type":"daterange","isshow":true},
                {"name":"入库日期","model":"realInDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
                {"name":"库区","model":"reservoirCode","type":"input","placeholder":"库区","isshow":true},
                {"name":"库位","model":"storageCode","type":"input","placeholder":"库位","isshow":true},
            ]
        }
    },
}
