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
                {"name": "付款状态", "code": "payStateName", "width": "90", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text",isSum:true},
                {"name": "干线供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "干线运费", "code": "transitFee", "width": "90", "type": "text",isSum:true},
                {"name": "提货费", "code": "pickupFee", "width": "90", "type": "text",isSum:true},
                {"name": "送货费", "code": "deliveryFee", "width": "90", "type": "text",isSum:true},
                {"name": "异动费用", "code": "statementFee", "width": "90", "type": "text",isSum:true},
                {"name": "费用合计", "code": "amount", "width": "90", "type": "text",isSum:true},
                {"name": "开户名字", "code": "receiveUserName", "width": "100", "type": "text"},
                {"name": "收款人手机号码", "code": "bankPhone", "width": "150", "type": "text"},
                {"name": "开户账号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "120", "type": "text"},
                {"name": "身份证号", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "付款人", "code": "payUserName", "width": "90", "type": "text"},
                {"name": "付款时间", "code": "payDate", "width": "150", "type": "text"},
            ],
            query:{thirdType:2,supplierName: this.$route.query.supplierName},
            verifyStateData:[{codeValue:0,codeName:'未审核'},{codeValue:1,codeName:'已审核'}],
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
        },
        addPayApply() {
            let item = {
                urlName: '付款申请',
                urlId: 'gdPayApply',
                urlPathName: "/gdPayApply",
                urlPath: "/pt/fc/gdBill/payApply.vue",
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
                query: {payIds,payFee,thirdType:2},
                urlId: 'gdPayApplyPrint',
                urlPathName: "/gdPayApplyPrint",
                urlPath: "/pt/fc/gdBill/payApplyPrint.vue",
            }
            this.$emit('openTab', item);
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
            that.$confirm("确认账单后不可回退,是否确认账单？", "提示").then(() =>{
                that.common.postUrl("fcThirdPayFeeTF", "delFcThirdPayFeeInfo", {payIds}, function (data) {
                    that.$message.success("撤销成功");
                    that.doQuery();
                },null,null,true);
            }).catch(() =>{});
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
            this.common.postUrl("fcThirdPayFeeTF", "querySupplierBankDataNoPage", {supplierTenantId}, function (data) {
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
        download(){
            this.$refs.table.downloadExcelFile('高灯付款申请列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","placeholder":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"完成时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
