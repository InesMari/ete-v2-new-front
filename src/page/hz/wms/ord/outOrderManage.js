import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'outOrderManage',
    data() {
        return {
            head: [
                {"name": "出库单号", "code": "outOrderNum", "width": "150", "type": "text"},
                {"name": "仓库", "code": "workName", "width": "250", "type": "text"},
                {"name": "出库状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "是否退货", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "出库数量", "code": "outStockNums", "width": "120", "type": "text"},
                {"name": "实际出库数量", "code": "realOutStockNums", "width": "120", "type": "text"},
                {"name": "实际出库箱数", "code": "realBoxNums", "width": "120", "type": "text"},
                {"name": "实际出库托数", "code": "realPalletNums", "width": "120", "type": "text"},
                {"name": "可回收包材", "code": "outStockPackNums", "width": "120", "type": "text"},
                {"name": "要求出库日期", "code": "requireOutDate", "width": "120", "type": "text"},
                {"name": "实际出库日期", "code": "realOutDate", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {
                requireOutDate:'',
                realOutDate:'',
                produceDate:'',
                expireDate:'',
                srcTenantName: this.$route.query.srcTenantName,
                states:this.common.isBlank(this.$route.query.states) ? [] : this.$route.query.states,//仓储首页跳转
            },
            stateData:[],
            workList:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.requireOutDate) && this.loadParam.requireOutDate.length === 2){
                this.loadParam.startRequireOutDate = this.loadParam.requireOutDate[0];
                this.loadParam.endRequireOutDate = this.loadParam.requireOutDate[1];
            }else{
                this.loadParam.startRequireOutDate = '';
                this.loadParam.endRequireOutDate = '';
            }
            if(this.common.isNotBlank(this.loadParam.realOutDate) && this.loadParam.realOutDate.length === 2){
                this.loadParam.startRealOutDate = this.loadParam.realOutDate[0];
                this.loadParam.endRealOutDate = this.loadParam.realOutDate[1];
            }else{
                this.loadParam.startRealOutDate = '';
                this.loadParam.endRealOutDate = '';
            }
            if(this.common.isNotBlank(this.loadParam.produceDate) && this.loadParam.produceDate.length === 2){
                this.loadParam.startProduceDate = this.loadParam.produceDate[0];
                this.loadParam.endProduceDate = this.loadParam.produceDate[1];
            }else{
                this.loadParam.startProduceDate = '';
                this.loadParam.endProduceDate = '';
            }
            if(this.common.isNotBlank(this.loadParam.expireDate) && this.loadParam.expireDate.length === 2){
                this.loadParam.startExpireDate = this.loadParam.expireDate[0];
                this.loadParam.endExpireDate = this.loadParam.expireDate[1];
            }else{
                this.loadParam.startExpireDate = '';
                this.loadParam.endExpireDate = '';
            }
            this.loadParam.isHZ=1;
            this.$refs.table.load("wmsOutOrderTF", "queryOutOrderPage", this.loadParam);
        },
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "OUT_ORDER_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl('wmsBaseTF','getAllWorkStore',{isHZ: 1},function (data) {
                that.workList = data;
            });
        },
        /**
         * 双击查看详情
         * @param data
         * @returns {Promise<void>}
         */
       async view(data){
            this.$emit("openTab",{
                urlId: "outOrderDetail"+data.outOrderId,
                query: {outOrderId:data.outOrderId},
                urlName: '出库单详情',
                urlPathName: "/outOrderDetail",
                urlPath: '/hz/wms/ord/outOrderDetail.vue'});
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
                {"name":"出库单","model":"outOrderNum","type":"input","placeholder":"出库单","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"出库状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"出库状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"ASN","model":"asn","type":"input","placeholder":"ASN","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"物料描述","isshow":true},
                {"name":"预计出库时间","model":"requireOutDate","type":"daterange","isshow":true},
                {"name":"实际出库日期","model":"realOutDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
                {"name":"过期日期","model":"expireDate","type":"daterange","isshow":true},
                {"name":"条码编号","model":"codeNum","type":"input","placeholder":"条码编号","isshow":true},
                {"name":"仓库","model":"workStoreId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"仓库","method":"doQuery","multiple":true,"isshow":true},

            ]
        }
    },
}
