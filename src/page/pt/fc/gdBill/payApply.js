import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";

export default {
    name: 'payApply',
    data()
    {
        return {
            head: [
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "已申请金额", "code": "applyFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "可申请金额", "code": "applyAbleFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "干线供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "干线运费", "code": "transitFee", "width": "90", "type": "text","isSum":"true"},
                {"name": "提货费", "code": "pickupFee", "width": "90", "type": "text","isSum":"true"},
                {"name": "送货费", "code": "deliveryFee", "width": "90", "type": "text","isSum":"true"},
                {"name": "异动费用", "code": "statementFee", "width": "90", "type": "text","isSum":"true"},
                {"name": "费用合计", "code": "amount", "width": "90", "type": "text","isSum":"true"},
                {"name": "预付金额", "code": "prePay", "width": "90", "type": "text","isSum":"true"},
                {"name": "到付金额", "code": "afterPay", "width": "90", "type": "text","isSum":"true"},
                {"name": "周期付金额", "code": "periodicalPay", "width": "90", "type": "text","isSum":"true"},
                {"name": "周期付天数", "code": "periodicalDay", "width": "90", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "调度人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "调度时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            headAdd:[
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "干线供应商", "code": "supplierName", "width": "120", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveBankId", "width": "220", "type": "diy"},
                {"name": "收款人手机号码", "code": "bankPhone", "width": "150", "type": "text"},
                {"name": "开户卡号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "110", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "110", "type": "text"},
                {"name": "身份证", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "费用合计", "code": "amount", "width": "80", "type": "text","isSum":"true"},
                {"name": "已申请金额", "code": "applyFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "可申请金额", "code": "applyAbleFee", "width": "80", "type": "text","isSum":"true"},
                {"name": "申请金额", "code": "fee", "width": "80", "type": "diy","isSum":"true"},
                {"name": "申请备注", "code": "remark", "width": "150", "type": "input"},
            ],
            query:{thirdType:2,supplierName: this.$route.query.supplierName},
            showDialog:false,
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
            selectItem:[],
            totalInfo:{},
            allFee:'',
            totalSelFee:0,
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
        scrollTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        clickItem(){
            let selectData = this.$refs.table.getSelectItem();
            this.totalSelFee = 0;
            for (let i = 0; i < selectData.length; i++) {
                this.totalSelFee = this.common.accAdd(this.totalSelFee,selectData[i].applyAbleFee);
            }
            this.$forceUpdate();
        },

        /**
         *
         */
        doQuery(){
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            this.$refs.table.load("fcThirdPayFeeTF", "queryOrdWaybillForGDPage", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
        },
        showPayApplyDialog(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个派车单！");
                return false;
            }
            //查询所有的银行卡信息
            this.selectItem = selectData;
            let supplierTenantId = [];
            this.allFee = 0;
            for (let i = 0; i < this.selectItem.length; i++) {
                let item = this.selectItem[i];
                this.selectItem[i].fee = 0;
                this.selectItem[i].remark = '';
                supplierTenantId.push(item.supplierTenantId);
            }

            this.showDialog = true;
            this.$nextTick(async()=>{
                let data = await this.common.postUrl("fcThirdPayFeeTF", "querySupplierBankDataNoPage", {supplierTenantId});
                for (let i = 0; i < this.selectItem.length; i++) {
                    let item = this.selectItem[i];
                    item.supplierBankData = data[item.supplierTenantId+''];
                    if(item.supplierBankData!=null&&item.supplierBankData.length>0){
                        this.setBankInfo(item,item.supplierBankData[0]);
                    }
                }
                this.$refs.scrollTable.setData(this.selectItem);    //设置表格数据
                this.$refs.scrollTable.calcFootSum();   //表格合计
                this.$nextTick(()=>{
                    this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
                })
            })
        },
        selBank(item){
            // item.receiveBankId = '';
            item.receiveUserId = '';
            item.bankNum = '';
            item.bankName = '';
            item.branchName = '';
            item.receiveUserIdCard = '';
            item.bankPhone = '';
            for (let i = 0; i < item.supplierBankData.length; i++) {
                let bankInfo = item.supplierBankData[i];
                if(item.receiveBankId==bankInfo.receiveBankId){
                    if(!bankInfo.bankPhone){
                        this.$message.error("收款人手机号码为空，请先去银行卡管理修改！");
                        return false;
                    }
                    this.setBankInfo(item,bankInfo);
                    break;
                }
            }
            this.$forceUpdate();
        },
        setBankInfo(item,bankInfo){
            item.receiveBankId = bankInfo.receiveBankId;
            item.receiveUserId = bankInfo.receiveUserId;
            item.bankNum = bankInfo.bankNum;
            item.bankName = bankInfo.bankName;
            item.branchName = bankInfo.branchName;
            item.receiveUserIdCard = bankInfo.receiveUserIdCard;
            item.bankPhone = bankInfo.bankPhone;
        },
        inputFee(item){
            if(!this.checkFee(item)){
                return;
            }
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$forceUpdate();
        },
        checkFee(item){
            if(item.fee>item.applyAbleFee){
                this.$message.error("申请金额不能大于可申请金额");
                return false;
            }
            return true;
        },
        shareFee(){
            let selectItem = this.common.copyObj(this.$refs.scrollTable.getData())
            let remainFee = parseFloat(this.allFee);
            for (let i = 0; i < selectItem.length; i++) {
                let item = selectItem[i];
                if(remainFee>item.applyAbleFee){
                    item.fee = item.applyAbleFee;
                    remainFee = this.common.accSub(remainFee,item.applyAbleFee);
                }else{
                    item.fee = remainFee;
                    remainFee = 0;
                }
                selectItem[i] = item;
            }
            this.$refs.scrollTable.setData(selectItem);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$forceUpdate();
            if(remainFee>0){
                this.$message.error("申请金额太大，拆分不完");
            }
        },
        applyPay(){
            this.selectItem = this.common.copyObj(this.$refs.scrollTable.getData())
            let payList = [];
            for (let i = 0; i < this.selectItem.length; i++) {
                if(!this.checkFee(this.selectItem[i])){
                    return ;
                }
                if(this.selectItem[i].fee>0&&this.selectItem[i].receiveBankId>0){
                    payList.push(this.selectItem[i]);
                }
            }
            if(payList.length==0){
                this.$message.error("请填写金额或者收款人");
                return;
            }
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "addFcThirdPayFeeInfo", {payList,thirdType:2}, function (data) {
                that.$message.success("申请成功");
                that.showDialog = false;
                that.$forceUpdate();
                that.doQuery();
            },null,null,true);
        },
        /**
         * 清空
         */
        clear(){
            this.query={thirdType:2};
        },

    },
}
