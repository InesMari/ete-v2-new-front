import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'inOrderManage',
    data() {
        return {
            head: [
                {"name": "入库单号", "code": "inOrderNum", "width": "150", "type": "text"},
                {"name": "仓库", "code": "workName", "width": "250", "type": "text"},
                {"name": "入库状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "是否退货", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "入库数量", "code": "stockNums", "width": "120", "type": "text"},
                {"name": "实际入库数量", "code": "realStockNums", "width": "120", "type": "text"},
                {"name": "实际出库数量", "code": "realOutNums", "width": "120", "type": "text"},
                {"name": "实际入库箱数", "code": "realBoxNums", "width": "120", "type": "text"},
                {"name": "实际入库托数", "code": "realPalletNums", "width": "120", "type": "text"},
                {"name": "可回收包材", "code": "stockPackNums", "width": "120", "type": "text"},
                {"name": "预计入库时间", "code": "requireInDate", "width": "120", "type": "text"},
                {"name": "实际入库日期", "code": "realInDate", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {
                requireInDate:'',
                realInDate:'',
                produceDate:'',
                expireDate:'',
                isHZ:1,
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
            if(this.common.isNotBlank(this.loadParam.expireDate) && this.loadParam.expireDate.length === 2){
                this.loadParam.startExpireDate = this.loadParam.expireDate[0];
                this.loadParam.endExpireDate = this.loadParam.expireDate[1];
            }else{
                this.loadParam.startExpireDate = '';
                this.loadParam.endExpireDate = '';
            }
            this.loadParam.isHZ=1;
            this.$refs.table.load("wmsInOrderTF", "queryInOrderPage", this.loadParam);
        },
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "IN_ORDER_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl('wmsBaseTF','getAllWorkStore',{isHZ: 1},function (data) {
                that.workList = data;
            });
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
                {"name":"入库单号","model":"inOrderNum","type":"input","placeholder":"入库单号","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"入库状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"入库状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"物料描述","isshow":true},
                {"name":"预计入库时间","model":"requireInDate","type":"daterange","isshow":true},
                {"name":"实际入库日期","model":"realInDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
                {"name":"过期日期","model":"expireDate","type":"daterange","isshow":true},
                {"name":"条码编号","model":"codeNum","type":"input","placeholder":"条码编号","isshow":true},
                {"name":"仓库","model":"workStoreId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"仓库","method":"doQuery","multiple":true,"isshow":true},
            ]
        }
    },
}
