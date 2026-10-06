import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'payApplyVerify',
    data()
    {
        return {
            head: [
                {"name": "付款申请编号", "code": "applyPayNum", "width": "120", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "diy"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text",isSum:true},
                {"name": "干线供应商", "code": "supplierName", "width": "180", "type": "text"},
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
            ],
            headDetail:[
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "100", "type": "text"},
                {"name": "开户卡号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "120", "type": "text"},
                {"name": "身份证号", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text","isSum":"true"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query:{type:1,thirdType:2, verifyState: this.$route.query.verifyState},
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
            showDialog:false,
            selectItem:[],
            totalInfo: {fee:0},
            allPayIds:[],
            payIds:[],
            verifyStateData:[],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        scrollTable,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        init()
        {
            let that = this;
            //审核状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
        },
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
         * 清空
         */
        clear(){
            this.query={type:1,thirdType:2};
        },
        payApplyVerify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            let payIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].verifyState == 1) {
                    this.$message.error("付款申请单: " + selectData[i].applyPayNum + "已经审核，不用再次审核！");
                    return false;
                }
                payIds.push(selectData[i].payId);
            }

            if(payIds.length==0){
                this.$message.error("请至少选择一个需要审核的付款申请单！");
                return;
            }
            this.allPayIds = payIds;
            this.payIds = payIds;
            let that = this;
            that.selectItem = selectData;
            that.totalInfo.fee = 0;
            for (let i = 0; i < that.selectItem.length; i++) {
                that.totalInfo.fee = that.common.accAdd(that.totalInfo.fee,that.selectItem[i].fee);
            }
            that.showDialog = true;
            this.$nextTick(()=>{
                this.$refs.scrollTable.setData(that.selectItem);    //设置表格数据
                this.$refs.scrollTable.calcFootSum();   //表格合计
                this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            })
            that.$forceUpdate();
        },
        async syncPay(){
            let payIds = this.payIds;
            if(payIds.length==0){
                this.showDialog = false;
                return;
            }
            await this.common.postUrl("fcThirdPayFeeTF", "verifyFcThirdPayFeeInfo", {payIds,thirdType:2}, null, null, null, true);
            let that = this;
            that.showDialog = false;
            that.$forceUpdate();
            that.doQuery();
            that.$parent.loadTodoData();
        },
        /**
         * 打开详情
         * @param data
         * @param isCallParent 是否调用父组件调用
         */
        openDetail(data)
        {
            if (data.isTransit == 1)
            {
                this.$emit('openTab', {
                    urlName: '查看中转',
                    urlId: 'transitManage' + data.waybillId,
                    urlPathName: "/order",
                    urlPath: "/pt/ord/transit/transitDetailMain",
                    query:{t:3,waybillNum: data.waybillNum, tansitWaybillId: data.waybillId},
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + data.waybillId,
                    query: {waybillId: data.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
    },
    computed:{
        formData(){
            return [
                {"name":"派车单号：","placeholder":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"供应商：","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"审核状态：","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"完成时间：","model":"createDate","type":"daterange","isshow":true},
                {"name":"付款申请编号：","placeholder":"付款申请编号","model":"applyPayNum","type":"input","isshow":true},
            ]
        }
    },
}
