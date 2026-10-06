import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'outOrderManage',
    data() {
        return {
            head: [
                {"name": "出库单号", "code": "outOrderNum", "width": "150", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "出库类型", "code": "orderTypeName", "width": "250", "type": "text"},
                {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "出库状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "是否退货", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "是否自提", "code": "selfPickupName", "width": "120", "type": "text"},
                {"name": "是否紧急", "code": "isEmergencyName", "width": "120", "type": "text"},
                {"name": "出库数量", "code": "outStockNums", "width": "120", "type": "text"},
                {"name": "实际出库数量", "code": "realOutStockNums", "width": "120", "type": "text"},
                {"name": "实际出库箱数", "code": "realBoxNums", "width": "120", "type": "text"},
                {"name": "实际出库托数", "code": "realPalletNums", "width": "120", "type": "text"},
                {"name": "可回收包材", "code": "outStockPackNums", "width": "120", "type": "text"},
                {"name": "要求出库日期", "code": "requireOutDate", "width": "120", "type": "text"},
                {"name": "实际出库日期", "code": "realOutDate", "width": "120", "type": "text"},
                {"name": "要求送达时间", "code": "requireDoneTime", "width": "150", "type": "text"},
                {"name": "抛单时间", "code": "deliverOrderTime", "width": "150", "type": "text"},
                {"name": "超时原因", "code": "timeoutReasonName", "width": "120", "type": "text"},
                {"name": "核查状态", "code": "orderExamineStsName", "width": "120", "type": "text"},
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
                selfPickup:'',
            },
            stateData:[],
            whetherData: [],
            orderExamineStsData:[],
            uploadOpen:false,
            showSelWork:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.doQuery();
        this.init();
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
            //选择仓库之后加载列表
            this.doQuery();
        },
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
            this.$refs.table.load("wmsOutOrderTF", "queryOutOrderPage", this.loadParam);
        },
        async init() {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'OUT_ORDER_STATE,WHETHER,ORDER_EXAMINE_STS,WMS_IN_ORDER_TYPE,REJECTED_TYPE'});
            this.stateData = data.OUT_ORDER_STATE;//出库状态
            this.whetherData = data.WHETHER;
            this.orderExamineStsData = data.ORDER_EXAMINE_STS;//核查状态
            this.packMateriaOptions = await this.common.postUrl("wmsPackMaterialTF", "queryPackMaterialBaseList", {});
        },
        print(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            // if(selectData[0].state<3){
            //     this.$message.error("出库单分拣以后才能打印");
            //     return;
            // }
            // if(selectData[0].state==5){
            //     this.$message.error("出库单已经确认出库不能操作！");
            //     return;
            // }
            this.$emit("openTab",{
                urlId: "printOutOrder"+selectData[0].outOrderId,
                query: {outOrderId:selectData[0].outOrderId},
                urlName: '打印出库单',
                urlPathName: "/printOutOrder",
                urlPath: '/pt/wms/ord/printOutOrder.vue'});
        },
        async showDialog(flag){
            this.$emit("openTab",{
                urlId: "addOrUpdateOutOrder" + new Date().getTime(),
                query: {},
                urlName: '新增出库单',
                urlPathName: "/addOrUpdateOutOrder",
                urlPath: '/pt/wms/ord/addOrUpdateOutOrder.vue'});
        },
        async showUpdateDialog(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            if(selectData[0].state==5){
                this.$message.error("出库单已经确认出库不能操作！");
                return;
            }
            let data = await this.common.postUrl("wmsOutOrderTF", "checkWmsStockQrcodeScanState", {outOrderId: selectData[0].outOrderId},
                null, null, '', true);
            if (data) {
                if(selectData[0].state==3||selectData[0].state==4){
                    //进入修改备注
                    let outOrderId = selectData[0].outOrderId;
                    this.$emit("openTab",{
                        urlId: "addOrUpdateOutOrder" + outOrderId,
                        query: {outOrderId,modifyRemark:1},
                        urlName: '修改出库单',
                        urlPathName: "/addOrUpdateOutOrder",
                        urlPath: '/pt/wms/ord/addOrUpdateOutOrder.vue'});
                    return;
                }
                this.$message.error("出库单已经扫码，不能修改！");
                return;
            }
            if(selectData[0].state!=1){
                this.$message.error("出库单不处于待出货状态，不能操作");
                return;
            }
            let that = this;
            let state = await this.common.postUrl("wmsOutOrderTF", "checkWmsStockQrcodeSplitState", {outOrderId: selectData[0].outOrderId},
                null, null, '', true);
            if (state) {
                this.$confirm("这是拆托出库单，原拆托出、入标签需重新打印及重帖新标签，是否确认？", "提示", {
                    center: true
                }).then(async () => {
                    let outOrderId = selectData[0].outOrderId;
                    that.$emit("openTab",{
                        urlId: "addOrUpdateOutOrder" + outOrderId,
                        query: {outOrderId},
                        urlName: '修改出库单',
                        urlPathName: "/addOrUpdateOutOrder",
                        urlPath: '/pt/wms/ord/addOrUpdateOutOrder.vue'});
                }).catch(() => {
                    //取消
                });
                return;
            }else{
                let outOrderId = selectData[0].outOrderId;
                this.$emit("openTab",{
                    urlId: "addOrUpdateOutOrder" + outOrderId,
                    query: {outOrderId},
                    urlName: '修改出库单',
                    urlPathName: "/addOrUpdateOutOrder",
                    urlPath: '/pt/wms/ord/addOrUpdateOutOrder.vue'});
            }

        },
        async delOutOrder() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            let data = await this.common.postUrl("wmsOutOrderTF", "checkWmsStockQrcodeScanState", {outOrderId: selectData[0].outOrderId},
                null, null, '', true);
            if (data) {
                this.$message.error("出库单已经部分扫码，不能删除！");
                return;
            }
            if (selectData[0].state == 3) {
                this.$message.error("出库单部分扫码不能操作！");
                return;
            }
            if (selectData[0].state == 4) {
                this.$message.error("出库单已扫码不能操作！");
                return;
            }
            if (selectData[0].state == 5) {
                this.$message.error("出库单已经确认出库不能操作！");
                return;
            }
            let state = await this.common.postUrl("wmsOutOrderTF", "checkWmsStockQrcodeSplitState", {outOrderId: selectData[0].outOrderId},
                null, null, '', true);
            if (state) {
                this.$confirm("这是拆托出库单，原拆托出、入标签需重新打印及重帖新标签，是否确认？", "提示", {
                    center: true
                }).then(async () => {
                    await this.common.postUrl("wmsOutOrderTF", "delOutOrder", {outOrderId: selectData[0].outOrderId},
                        null, null, '', true);
                    this.$message.success("删除出库单成功！");
                    await this.doQuery();
                }).catch(() => {
                    //取消
                });
                return;
            }

            this.$confirm("是否确认删除出库单？", "提示", {
                center: true
            }).then(async () => {
                await this.common.postUrl("wmsOutOrderTF", "delOutOrder", {outOrderId: selectData[0].outOrderId},
                    null, null, '', true);
                this.$message.success("删除出库单成功！");
                await this.doQuery();
            }).catch(() => {
                //取消
            });
        },

        //确认分配开始
        async showDealDialog(flag) {
            if (!flag) {
                this.dealDialogShow = flag;
                this.viewMaterialData = [];
                this.dealMaterialData = [];
                this.baseBatchNumList = [];
                this.batchNumList = [];
                this.totalInfo = {nums: 0, boxNums: 0, palletNums: 0, stockNums: 0};
            } else {
                //查询逻辑
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条出库单信息！");
                    return;
                }
                if (selectData[0].state != 1) {
                    this.$message.error("出库单不是待出库状态，不能操作！");
                    return;
                }
                await this.go(selectData[0].outOrderId, 1, '确认分配');
            }
        },
        /**
         * 确认分拣
         * @returns {Promise<void>}
         */
        async sureSorting()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            if (selectData[0].state != 2) {
                this.$message.error("出库单不是已分配状态，不能操作！");
                return;
            }
            await this.go(selectData[0].outOrderId, 2, '确认分拣');
        },
        async outOrderDeal() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            if(selectData[0].state!=1&&selectData[0].state!=4){
                this.$message.error("出库单不处于待出库或者已扫码状态，不能操作！");
                return;
            }
            if(selectData[0].state==1&&(selectData[0].scanQrcode==1||selectData[0].newScanQrcode==1)){
                this.$message.error("请先扫码！");
                return;
            }
            let flag = false;
            if(selectData[0].orderExamineSts==0||selectData[0].orderExamineSts==1){
                flag = true;
            }
            if(flag){
                let that = this;
                this.$confirm("核查未完成，是否继续？", "提示",{
                    center:true}).then(async () =>{
                    await that.go(selectData[0].outOrderId, 3, '确认出库');
                }).catch(() =>{
                    //取消
                });
            }else{
                await this.go(selectData[0].outOrderId, 3, '确认出库');
            }
        },
        async feeConfirm() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            if (selectData[0].state != 5) {
                this.$message.error("出库单不是确认出库状态，不能操作！");
                return;
            }
            await this.common.postUrl("wmsOutOrderTF", "checkFeeConfirm", {outOrderId: selectData[0].outOrderId},
                null, null, '', true);

            let data = selectData[0];
            this.$emit("openTab", {
                urlId: "outOrderDetail" + data.outOrderId,
                query: {outOrderId: data.outOrderId},
                urlName: '费用确认',
                urlPathName: "/outOrderFeeConfirm",
                urlPath: '/pt/wms/ord/outOrderFeeConfirm.vue'
            });
        },
        async go(outOrderId, type, name)
        {
            this.$emit("openTab",{
                urlId: "outOrderConfirm" + outOrderId + type,
                query: {outOrderId: outOrderId, type: type},
                urlName: name,
                urlPathName: "/outOrderConfirm",
                urlPath: '/pt/wms/ord/outOrderConfirm.vue'});
        },
        /**
         * 双击查看详情
         * @param data
         * @returns {Promise<void>}
         */
       async dblclickItem(data){
            this.$emit("openTab",{
                urlId: "outOrderDetail"+data.outOrderId,
                query: {outOrderId:data.outOrderId,
                    logId: data.outOrderId,
                    logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
                },
                urlName: '出库单详情',
                urlPathName: "/outOrderDetail",
                urlPath: '/pt/wms/ord/outOrderDetail.vue'});
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("入库单导入成功！");
        },
        toDtl(){
            this.$emit("openTab",{
                urlId: "outOrderDtl",
                query: {},
                urlName: '出库物料列表',
                urlPathName: "/outOrderDtl",
                urlPath: '/pt/wms/ord/outOrderDtlManage.vue'});
        },
        printTagCode(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条出库单信息！");
                return;
            }
            if(!selectData[0].hasNewQrcode){
                this.$message.error("该出库单没有标签！");
                return;
            }
            this.$emit("openTab",{
                urlId: "printTagCode_outOrderId"+selectData[0].outOrderId,
                query: {outOrderId:selectData[0].outOrderId,type:2},
                urlName: '标签预览',
                urlPathName: "/printTagCode",
                urlPath: '/pt/wms/ord/printTagCode.vue'});
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
                {"name":"出库单号","model":"outOrderNum","type":"input","placeholder":"出库单号","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"所属货主","model":"srcTenantName","type":"input","placeholder":"所属货主","isshow":true},
                {"name":"客户单号","model":"custOrderNum","type":"input","placeholder":"客户单号","isshow":true},
                {"name":"出库状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"出库状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"ASN","model":"asn","type":"input","placeholder":"ASN","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"物料描述","isshow":true},
                {"name":"预计出库时间","model":"requireOutDate","type":"daterange","isshow":true},
                {"name":"实际出库日期","model":"realOutDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
                {"name":"过期日期","model":"expireDate","type":"daterange","isshow":true},
                {"name":"核查状态","model":"orderExamineSts","type":"select","options":this.orderExamineStsData,"label":"codeName","value":"codeValue","placeholder":"核查状态","method":"doQuery","isshow":true},
                {"name":"是否退货","model":"rejectedState","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否退货","method":"doQuery","isshow":true},
                {"name":"是否自提","model":"selfPickup","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否自提","method":"doQuery","isshow":true},
                {"name":"条码编号","model":"codeNum","type":"input","placeholder":"条码编号","isshow":true},
            ]
        }
    },
}
