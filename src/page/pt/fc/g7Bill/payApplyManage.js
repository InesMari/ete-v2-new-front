import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'payApplyManage',
    data()
    {
        return {
            head: [
                {"name": "付款申请编号", "code": "applyPayNum", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "推送状态", "code": "syncStateName", "width": "90", "type": "text"},
                {"name": "推送时间", "code": "syncDate", "width": "150", "type": "text"},
                {"name": "推送失败原因", "code": "syncMsg", "width": "150", "type": "text"},
                {"name": "下单客户", "code": "orderCustName", "width": "150", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "90", "type": "text"},
                {"name": "发货日期", "code": "startWorkDate", "width": "150", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "起始地", "code": "startWorkName", "width": "120", "type": "text"},
                {"name": "起始地详细地址", "code": "startWorkAddress", "width": "180", "type": "text"},
                {"name": "目的地", "code": "endWorkName", "width": "120", "type": "text"},
                {"name": "目的地详细地址", "code": "endWorkAddress", "width": "180", "type": "text"},
                {"name": "平台基地","code":"g7NtoccGroundName","width":"120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "100", "type": "text"},
                {"name": "下单时间", "code": "waybillCreateDate", "width": "150", "type": "text"},
                {"name": "出车时间", "code": "startCarDate", "width": "150", "type": "text"},
                {"name": "完成时间", "code": "endCarDate", "width": "150", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "100", "type": "text"},
                {"name": "开户账号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "120", "type": "text"},
                {"name": "身份证号", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "付款人", "code": "payUserName", "width": "90", "type": "text"},
                {"name": "付款时间", "code": "payDate", "width": "150", "type": "text"},
            ],
            query:{supplierName: this.$route.query.supplierName},
            verifyStateData:[{codeValue:0,codeName:'未审核'},{codeValue:1,codeName:'已审核'}],
            syncStateData:[{codeValue:0,codeName:'未推送'},{codeValue:1,codeName:'成功'},{codeValue:2,codeName:'失败'}],
            payStateData:[{codeValue:1,codeName:'已付款'},{codeValue:0,codeName:'未付款'}],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth()-3);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            payInfo:{},
            supplierBankData:[],
            showDialog:false,
            dialogVisible:false,
            excelDialogVisible:false,
            preApplyFee:0,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         *
         */
        doQuery(query=this.query){
            this.query=query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            this.$refs.table.load("fcThirdPayFeeTF", "queryFcThirdPayFeeInfoPage", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
        },
        /**
         * 清空
         */
        clear(){
            this.query={};
        },
        addPayApply() {
            let item = {
                urlName: '付款申请',
                urlId: 'payApply',
                urlPathName: "/payApply",
                urlPath: "/pt/fc/g7Bill/payApply.vue",
            }
            this.$emit('openTab', item);
        },
        //打印付款申请单
        toPayApplyPrint(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            let payIds = [];
            let payFee = 0;
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].verifyState != 1) {
                    this.$message.error("付款申请单: " + selectData[i].applyPayNum + "没有审核，不能打印！");
                    return false;
                }
                payFee = this.common.accAdd(payFee,selectData[i].fee);
                payIds.push(selectData[i].payId);
            }
            if(payIds.length==0){
                this.$message.error("请至少选择一个可以打印的付款申请单！");
                return;
            }

            let item = {
                urlName: '打印付款申请单',
                query: {payIds,payFee},
                urlId: 'payApplyPrint',
                urlPathName: "/payApplyPrint",
                urlPath: "/pt/fc/g7Bill/payApplyPrint.vue",
            }
            this.$emit('openTab', item);
        },
        showCancelPayApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            let payIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].verifyState == 1) {
                    this.$message.error("付款申请单: " + selectData[i].applyPayNum + "已经审核，不能撤销！");
                    return false;
                }
                payIds.push(selectData[i].payId);
            }
            if(payIds.length==0){
                this.$message.error("请至少选择一个可以撤掉的付款申请单！");
                return;
            }
            this.dialogVisible = true;
        },
        cancelPayApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            let payIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].verifyState == 1) {
                    this.$message.error("付款申请单: " + selectData[i].applyPayNum + "已经审核，不能撤销！");
                    return false;
                }
                payIds.push(selectData[i].payId);
            }
            if(payIds.length==0){
                this.$message.error("请至少选择一个可以撤掉的付款申请单！");
                return;
            }
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "delFcThirdPayFeeInfo", {payIds}, function (data) {
                that.$message.success("撤销成功");
                that.dialogVisible = false;
                that.doQuery();
            },null,null,true);

        },
        showPayApplyModifyDialog(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一个付款申请单！");
                return false;
            }
            if (selectData[0].verifyState == 1) {
                this.$message.error("付款申请单: " + selectData[0].applyPayNum + "已经审核，不能修改！");
                return false;
            }
            this.payInfo = selectData[0];
            let supplierTenantId = [];
            supplierTenantId.push(this.payInfo.supplierTenantId);
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "querySupplierBankDataNoPage", {supplierTenantId,g7Flag:1}, function (data) {
                that.supplierBankData = data[that.payInfo.supplierTenantId+''];
                that.preApplyFee = that.payInfo.fee;
                that.showDialog = true;
            });
        },
        selBank(){
            for (let i = 0; i < this.supplierBankData.length; i++) {
                let bankInfo = this.supplierBankData[i];
                if(this.payInfo.receiveBankId==bankInfo.receiveBankId){
                    this.payInfo.receiveBankId = bankInfo.receiveBankId;
                    this.payInfo.receiveUserId = bankInfo.receiveUserId;
                    this.payInfo.bankNum = bankInfo.bankNum;
                    this.payInfo.bankName = bankInfo.bankName;
                    this.payInfo.branchName = bankInfo.branchName;
                    this.payInfo.receiveUserIdCard = bankInfo.receiveUserIdCard;
                    break;
                }
            }
            this.$forceUpdate();
        },
        checkFee(){
            let applyAbleFee = this.common.accAdd(this.preApplyFee,this.payInfo.applyAbleFee);
            if(this.payInfo.fee>applyAbleFee){
                this.$message.error("申请金额不能大于可申请金额");
                return false;
            }
            return true;
        },

        modifyApplyPay(){
            if(!this.checkFee()){
                return;
            }
            if(this.payInfo.fee<=0){
                this.$message.error("请填写金额");
                return;
            }
            if(this.payInfo.receiveBankId<=0){
                this.$message.error("请选择收款人");
                return;
            }

            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "updateFcThirdPayFeeInfo", this.payInfo, function (data) {
                that.$message.success("修改成功");
                that.showDialog = false;
                that.$forceUpdate();
                that.doQuery();
            },null,null,true);
        },
        downloadSelect(){
            this.excelDialogVisible = true;
        },
        /**
         *
         * @param {是否导出选中数据} exportExcelSelect
         */
        download(exportExcelSelect){
            this.$refs.table.downloadExcelFile('G7付款申请列表',exportExcelSelect);
            this.excelDialogVisible = false;
        },
        downloadOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            let waybillIds = [];
            for (let i = 0; i < selectData.length; i++) {
                waybillIds.push(selectData[i].waybillId);
            }
            let query = {
                waybillIds: waybillIds,
                page: 1,
                rows: 50,
            }
            let head = [
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "180", "type": "text"},
                {"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
                {"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "完成时间", "code": "finishDate", "width": "150", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
                {"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
                {"name": "是否回单", "code": "haveReceiptName", "width": "100", "type": "text"},
                {"name": "派车单数", "code": "waybillNums", "width": "90", "type": "text"},
                {"name": "是否入账", "code": "entryBillFlagName", "width": "90", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "120", "type": "text"},
                {"name": "回单状态", "code": "receiptStateName", "width": "90", "type": "text"},
                {"name": "是否生成报表", "code": "generateReportFlagName", "width": "120", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
                {"name": "货物件数", "code": "goodsCountSum", "width": "100", "type": "text",isSum:true},
                {"name": "货物重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text",isSum:true},
                {"name": "货物体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text",isSum:true},
                {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
                {"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
                {"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text",isSum:true},
                {"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text", "entityId": "1003029",},
                {"name": "中途点数", "code": "midwayPointCount", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "点位费", "code": "pointFee", "width": "90", "type": "text", "entityId": "1003029"},
                {"name": "点位费合计", "code": "totalPointFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "运费", "code": "freight", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "保险费", "code": "premiumFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "装货费", "code": "loadingFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "卸货费", "code": "dischargeFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "其他费", "code": "otherFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "订单收入合计", "code": "income", "width": "100", "type": "text", "entityId": "1003029",isSum:true},
                {"name": "订单成本合计", "code": "pay", "width": "100", "type": "text", "entityId": "1003030",isSum:true},
                {"name": "下单人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
                {"name": "协同区域", "code": "cdtRegionName", "width": "90", "type": "text",},
                {"name": "协同费用", "code": "cdtFee", "width": "90", "type": "text",},
            ];
            let excelKeys='';
            let excelLables='';

            for(let el of head){
                excelKeys+=','+el.code;
                excelLables+=','+el.name;
            }
            if(excelKeys.length>0){
                excelKeys=excelKeys.substr(1);
                excelLables=excelLables.substr(1);
            }
            this.common.downloadExcelFile('orderTF|queryOrderInfoList',query,excelLables,excelKeys,"订单",'fcSupplierBillDetailTable');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","placeholder":"派车单号","model":"waybillNum","type":"textarea","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"完成时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"司机","placeholder":"司机","model":"driverName","type":"input","isshow":true},
                {"name":"车牌号码","placeholder":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"推送状态","model":"syncState","type":"select","options":this.syncStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"客户名称","placeholder":"客户名称","model":"custName","type":"input","isshow":true},
                {"name":"起始地","placeholder":"起始地","model":"startWorkName","type":"input","isshow":true},
                {"name":"目的地","placeholder":"目的地","model":"endWorkName","type":"input","isshow":true},
            ]
        }
    },
}
