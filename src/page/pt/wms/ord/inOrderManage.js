import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";


export default {
    name: 'inOrderManage',
    data() {
        return {
            head: [
                {"name": "入库单号", "code": "inOrderNum", "width": "150", "type": "text"},
                {"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "预约编号", "code": "appointNum", "width": "120", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "司机姓名", "code": "linkman", "width": "120", "type": "text"},
                {"name": "手机号码", "code": "linkPhone", "width": "120", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "入库状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "入库类型", "code": "rejectedStateName", "width": "120", "type": "text"},
                {"name": "退货类型", "code": "rejectedTypeName", "width": "120", "type": "text"},
                {"name": "退货责任方", "code": "rejectedDuty", "width": "120", "type": "text"},
                {"name": "入库数量", "code": "stockNums", "width": "120", "type": "text"},
                {"name": "实际入库数量", "code": "realStockNums", "width": "120", "type": "text"},
                {"name": "实际出库数量", "code": "realOutNums", "width": "120", "type": "text"},
                {"name": "实际入库箱数", "code": "realBoxNums", "width": "120", "type": "text"},
                {"name": "实际入库托数", "code": "realPalletNums", "width": "120", "type": "text"},
                {"name": "可回收包材", "code": "stockPackNums", "width": "120", "type": "text"},
                {"name": "预计入库时间", "code": "requireInDate", "width": "120", "type": "text"},
                {"name": "实际入库日期", "code": "realInDate", "width": "120", "type": "text"},
                {"name": "核查状态", "code": "orderExamineStsName", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {
                requireInDate:'',
                realInDate:'',
                produceDate:'',
                expireDate:'',
                srcTenantName: this.$route.query.srcTenantName,
                states:this.common.isBlank(this.$route.query.states) ? [] : this.$route.query.states,//仓储首页跳转
                rejectedState:'',
                rejectedType:'',
            },
            stateData:[],
            packMateriaOptions:[],
            orderExamineStsData:[],
            rejectedStateData:[],
            rejectedTypeData:[],
            pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
            uploadOpen:false,
            uploadOpen2:false,
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
            this.$refs.table.load("wmsInOrderTF", "queryInOrderPage", this.loadParam);
        },
        async init() {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'IN_ORDER_STATE,ORDER_EXAMINE_STS,WMS_IN_ORDER_TYPE,REJECTED_TYPE'});
            this.stateData = data.IN_ORDER_STATE;//入库状态
            this.orderExamineStsData = data.ORDER_EXAMINE_STS;//核查状态
            this.rejectedStateData = data.WMS_IN_ORDER_TYPE;
            this.rejectedTypeData = data.REJECTED_TYPE;
        },
        showDialog(){
            this.$emit("openTab",{
                urlId: "addOrUpdateInOrder" + new Date().getTime(),
                query: {},
                urlName: '新增入库单',
                urlPathName: "/addOrUpdateInOrder",
                urlPath: '/pt/wms/ord/addOrUpdateInOrder.vue'});
        },
        showUpdateDialog(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state==3){
                this.$message.error("入库单已经部分扫码不能修改！");
                return;
            }
            if(selectData[0].state==4){
                this.$message.error("入库单已经扫码完成不能修改！");
                return;
            }
            if(selectData[0].state==5){
                this.$message.error("入库单已入库完成不能修改！");
                return;
            }
            let inOrderId = selectData[0].inOrderId;
            this.$emit("openTab",{
                urlId: "addOrUpdateInOrder" + inOrderId,
                query: {inOrderId,type:2},
                urlName: '修改入库单',
                urlPathName: "/addOrUpdateInOrder",
                urlPath: '/pt/wms/ord/addOrUpdateInOrder.vue'});
        },
        updateInOrderQrcode()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state<3){
                this.$message.error("入库单未扫码请到修改入库单页面修改！");
                return;
            }
            if(selectData[0].state==5){
                this.$message.error("入库单已入库完成不能修改！");
                return;
            }
            //标签
            if (!selectData[0].hasNewQrcode||selectData[0].scanCustQrcode==1)
            {
                this.$message.error("该入库单没有标签信息！");
                return;
            }
            let inOrderId = selectData[0].inOrderId;
            this.$emit("openTab",{
                urlId: "updateInOrderForQrcode" + inOrderId,
                query: {inOrderId, isUpdateQrcode: 1},
                urlName: '修改入库单-修改标签',
                urlPathName: "/updateInOrderForQrcode",
                urlPath: '/pt/wms/ord/updateInOrderForQrcode.vue'});
        },
        print(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state < 2){
                this.$message.error("入库单未确认接收，不能打印！");
                return;
            }
            this.$emit("openTab",{
                urlId: "printInOrder"+selectData[0].inOrderId,
                query: {inOrderId:selectData[0].inOrderId},
                urlName: '打印入库单',
                urlPathName: "/printInOrder",
                urlPath: '/pt/wms/ord/printInOrder.vue'});
        },
        /** 保存入库单 */
        saveInOrder() {
            if(this.common.isBlank(this.info.srcTenantId)){
                this.$message.error("请选择货主！");
                return;
            }
            if(this.common.isBlank(this.info.rejectedState)){
                this.$message.error("请选择请选择是否退货！");
                return;
            }
            //物料规格信息
            if(this.materialData.length==0){
                this.$message.error("请输入物料信息！");
                return;
            }
            for (let i = 0; i < this.materialData.length; i++) {
                if(this.common.isBlank(this.materialData[i].batchNum)){
                    this.$message.error("请输入第"+(i+1)+"行物料批次号！");
                    return;
                }
                if(this.common.isBlank(this.materialData[i].fromTenantId)){
                    this.$message.error("请选择第"+(i+1)+"行的到货厂商！");
                    return;
                }
                if(this.common.isBlank(this.materialData[i].materialId)){
                    this.$message.error("请选择第"+(i+1)+"行的物料！");
                    return;
                }
                if(this.common.isBlank(this.materialData[i].materialSpecsId)){
                    this.$message.error("请选择第"+(i+1)+"行的物料规格！");
                    return;
                }
                if(this.common.isBlank(this.materialData[i].nums)){
                    this.$message.error("请输入第"+(i+1)+"行的物料入库数量！");
                    return;
                }
            }
            this.info.materialList = this.materialData;
            this.info.packMaterialList = this.packMaterialData;

            let mes = this.common.isBlank(this.info.inOrderId) ? "新增入库单成功！" : "修改入库单成功！";
            let that = this;
            that.common.postUrl("wmsInOrderTF", "addOrUpdateInOrder", that.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        /**
         * 确认接收
         */
        updateInOrderState() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state==2){
                this.$message.error("入库单已经确认接收不能操作！");
                return;
            }
            if(selectData[0].state==3){
                this.$message.error("入库单已经部分扫码不能操作！");
                return;
            }
            if(selectData[0].state==4){
                this.$message.error("入库单已经扫码完成不能操作！");
                return;
            }
            if(selectData[0].state==5){
                this.$message.error("入库单已入库完成不能操作！");
                return;
            }
            let inOrderId = selectData[0].inOrderId;
            this.$confirm("确认接收后请进行卸货安排，是否确认接收？", "提示", {
                center: true,
            }).then(async () =>{
                await this.common.postUrl("wmsInOrderTF", "updateInOrderState", {inOrderId: inOrderId},
                    null, null, '', true);
                this.$message.success("确认接收成功！");
                await this.doQuery();
                this.$emit("openTab",{
                    urlId: "printInOrder" + inOrderId,
                    query: {inOrderId: inOrderId},
                    urlName: '打印入库单',
                    urlPathName: "/printInOrder",
                    urlPath: '/pt/wms/ord/printInOrder.vue'});

            }).catch(() =>{
                //取消
            });
        },

        delInOrder() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state==3){
                this.$message.error("入库单已部分扫码不能删除！");
                return;
            }
            if(selectData[0].state==3){
                this.$message.error("入库单已扫码完成不能删除！");
                return;
            }
            if(selectData[0].state==5){
                this.$message.error("入库单已入库完成不能删除！");
                return;
            }
            this.$confirm("是否确认删除入库单？", "提示", {
                center: true,
            }).then(async () =>{
                await this.common.postUrl("wmsInOrderTF", "delInOrder", {inOrderId:selectData[0].inOrderId},
                    null, null, '', true);
                this.$message.success("删除入库单成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        dblclickItem(data){
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
        async feeConfirm() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if (selectData[0].state != 5) {
                this.$message.error("入库单不是订单确认入库状态，不能操作！");
                return;
            }
            await this.common.postUrl("wmsInOrderTF", "checkFeeConfirm", {inOrderId: selectData[0].inOrderId},
                null, null, '', true);

            let data = selectData[0];
            this.$emit("openTab", {
                urlId: "inOrderDetail" + data.inOrderId,
                query: {inOrderId: data.inOrderId},
                urlName: '费用确认',
                urlPathName: "/inOrderFeeConfirm",
                urlPath: '/pt/wms/ord/inOrderFeeConfirm.vue'
            });
        },
        /**
         * 修改入库物料箱数托数
         *
         */
        go(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state!=5){
                this.$message.error("入库单未入库完成，请直接修改入库单即可！");
                return;
            }
            this.$emit("openTab",{
                urlId: "inOrderDetailUpdate"+selectData[0].inOrderId,
                query: {inOrderId: selectData[0].inOrderId},
                urlName: '入库单物料修改',
                urlPathName: "/inOrderDetailUpdate",
                urlPath: '/pt/wms/ord/inOrderDetailUpdate.vue'});
        },
        modify(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state != 3 && selectData[0].state != 5){
                this.$message.error("入库单不是确认入库/已入库完成状态，不能操作！");
                return;
            }
            if(selectData[0].realOutNums>0){
                this.$message.error("入库单对应库存有做过出库操作，不能操作");
                return;
            }
            let inOrderId=selectData[0].inOrderId;
            this.$emit("openTab",{
                urlId: "inOrderModify"+inOrderId,
                query: {inOrderId:inOrderId},
                urlName: '入库单批次修改',
                urlPathName: "/inOrderModify",
                urlPath: '/pt/wms/ord/inOrderModify.vue'});
        },
        async deal() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            // 1待收货 2确认收货 3确认入库  5已入库完成
            if (selectData[0].state != 2 && selectData[0].state != 4) {
                this.$message.error("入库单不是订单已接收/已扫码状态，不能操作！");
                return;
            }
            if (selectData[0].rejectedState == 2 || selectData[0].rejectedState == 3) {
                if (!selectData[0].deliveryPalletNums) {
                    var str = "此";
                    if (selectData[0].rejectedState == 2) {
                        str += "退货入库";
                    } else {
                        str += "提货入库";
                    }
                    str += "单还没新建短驳配送，";

                    let msg = `
                    <p style="text-align:center;">${str}</p>
                    <p style="text-align:center;">确认入库后将无法新建短驳配送单，</p>
                    <p style="text-align:center;font-weight:bold;">是否继续确认入库？</p>
                    `;
                    let rst = await this.$confirm(msg, "提示",{
                        dangerouslyUseHTMLString: true,
                        center: true,
                        type: "info",
                    }).then(async () => {
                        return true;
                    }).catch(() => {
                        return false;
                    });
                    if(!rst){
                        return;
                    }
                }
            }
            let flag = false;
            if (selectData[0].orderExamineSts == 0 || selectData[0].orderExamineSts == 1) {
                flag = true;
            }
            let inOrderId = selectData[0].inOrderId;
            // if (selectData[0].hasNewQrcode)
            // {
            //有新扫码的查询是否已经扫码
            let data = await this.common.postUrl("wmsInOrderTF", "checkNewQrcode", {inOrderId: inOrderId},
                null, null, '', true);
            if (!data)
            {
                this.$message.error("该入库单存在物料未扫码，请先扫码！");
                return;
            }
            // }

            if (flag) {
                this.$confirm("核查未完成，是否继续？", "提示", {
                    center: true, type: "warning"}).then(async () => {
                    this.$emit("openTab", {
                        urlId: "inOrderConfirm" + inOrderId,
                        query: {inOrderId: inOrderId},
                        urlName: '入库单确认',
                        urlPathName: "/inOrderConfirm",
                        urlPath: '/pt/wms/ord/inOrderConfirm.vue'
                    });
                }).catch(() => {
                    //取消
                });
            } else {
                this.$emit("openTab", {
                    urlId: "inOrderConfirm" + inOrderId,
                    query: {inOrderId: inOrderId},
                    urlName: '入库单确认',
                    urlPathName: "/inOrderConfirm",
                    urlPath: '/pt/wms/ord/inOrderConfirm.vue'
                });
            }
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("入库单导入成功！");
        },
        toDtl(){
            this.$emit("openTab",{
                urlId: "inOrderDtl",
                query: {},
                urlName: '入库物料列表',
                urlPathName: "/inOrderDtl",
                urlPath: '/pt/wms/ord/inOrderDtlManage.vue'});
        },
        printTagCode(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条入库单信息！");
                return;
            }
            if(selectData[0].state < 2){
                this.$message.error("入库单未确认接收，不能预览！");
                return;
            }
            if(!selectData[0].hasNewQrcode){
                this.$message.error("该入库单没有标签！");
                return;
            }
            this.$emit("openTab",{
                urlId: "printTagCode_inOrderId"+selectData[0].inOrderId,
                query: {inOrderId:selectData[0].inOrderId,type:1},
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
        // 导入二次确认
        uploadConfirm(){
            this.$confirm("导入入库单后不可删除，不可修改，是否确认继续导入？", "提示", {
                center: true,
                type: "warning"
            }).then(async () => {
                this.$refs.myImport.submit();
            }).catch(() => {
                //取消
            });
        },
    },
    computed:{
        formData(){
            return [
                {"name":"入库单号","model":"inOrderNum","type":"input","placeholder":"入库单号","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"货主","model":"srcTenantName","type":"input","placeholder":"货主","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"入库状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"入库状态","method":"doQuery","multiple":true,"isshow":true},
                // {"name":"ASN","model":"asn","type":"input","placeholder":"ASN","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"物料描述","isshow":true},
                {"name":"预计入库时间","model":"requireInDate","type":"daterange","isshow":true},
                {"name":"实际入库日期","model":"realInDate","type":"daterange","isshow":true},
                {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
                {"name":"过期日期","model":"expireDate","type":"daterange","isshow":true},
                {"name":"核查状态","model":"orderExamineSts","type":"select","options":this.orderExamineStsData,"label":"codeName","value":"codeValue","placeholder":"核查状态","method":"doQuery","isshow":true},
                {"name":"入库类型","model":"rejectedState","type":"select","options":this.rejectedStateData,"label":"codeName","value":"codeValue","placeholder":"入库类型","method":"doQuery","isshow":true},
                {"name":"退货类型","model":"rejectedType","type":"select","options":this.rejectedTypeData,"label":"codeName","value":"codeValue","placeholder":"退货类型","method":"doQuery","isshow":true},
                {"name":"条码编号","model":"codeNum","type":"input","placeholder":"条码编号","isshow":true},
                {"name":"预约编号","model":"appointNum","type":"input","placeholder":"预约编号","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
            ]
        }
    },
}
