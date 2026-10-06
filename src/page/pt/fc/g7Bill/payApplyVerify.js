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
                {"name": "推送状态", "code": "syncStateName", "width": "90", "type": "text"},
                {"name": "推送时间", "code": "syncDate", "width": "150", "type": "text"},
                {"name": "推送失败原因", "code": "syncMsg", "width": "150", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "diy"},
                {"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
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
                {"name": "运费合计", "code": "amount", "width": "90", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
            ],
            headDetail:[
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "100", "type": "text"},
                {"name": "手机号", "code": "driverPhone", "width": "100", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "100", "type": "text"},
                {"name": "开户卡号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "120", "type": "text"},
                {"name": "身份证号", "code": "receiveUserIdCard", "width": "150", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text","isSum":"true"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query:{type:1, syncState: this.$route.query.syncState},
            syncStateData:[{codeValue:0,codeName:'未推送'},{codeValue:2,codeName:'失败'}],
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
            title:'',
            selectItem:[],
            totalInfo: {fee:0},
            allPayIds:[],
            payIds:[],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
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
            this.query={type:1};
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
            this.title='计划推送'+selectData.length+'单，需要推送请点击确认按钮';
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "queryFcThirdPayFeeInfoPage", {payIds:payIds,rows:50}, function (data) {
                that.selectItem = data.items;
                that.totalInfo.fee = 0;
                for (let i = 0; i < that.selectItem.length; i++) {
                    that.totalInfo.fee = that.common.accAdd(that.totalInfo.fee,that.selectItem[i].fee);
                }
                that.showDialog = true;
                that.$nextTick(()=>{
                    that.$refs.scrollTable.setData(that.selectItem);    //设置表格数据
                    that.$refs.scrollTable.calcFootSum();   //表格合计
                    that.$refs.scrollTable.changeTop(0);    //表格滚动初始化
                })
                that.$forceUpdate();
            }, null, null, true);
            //this.syncPay();
        },
        async syncPay(){
            let payIds = this.payIds;
            let allPayIds = this.allPayIds;
            if(payIds.length==0){
                this.showDialog = false;
                return;
            }
            await this.common.postUrl("fcThirdPayFeeTF", "verifyFcThirdPayFeeInfo", {payIds}, null, null, null, true);
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "queryFcThirdPayFeeInfoPage", {payIds:allPayIds,rows:50}, function (data) {
                that.selectItem = data.items;
                that.payIds = [];
                let s1 = 0;
                let s2 = 0;
                that.totalInfo.fee = 0;
                for (let i = 0; i < that.selectItem.length; i++) {
                    that.totalInfo.fee = that.common.accAdd(that.totalInfo.fee,that.selectItem[i].fee);
                    if(that.selectItem[i].syncState==1){
                        s1++;
                    }else{
                        s2++;
                        that.payIds.push(that.selectItem[i].payId);
                    }
                }
                that.title='计划推送'+allPayIds.length+'单，成功'+s1+'单，失败'+s2+'单，继续推送请点击确认按钮';
                that.showDialog = true;
                that.$forceUpdate();
                that.doQuery();
                that.$parent.loadTodoData();
            }, null, null, true);
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
                {"name":"派车单号","placeholder":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"推送状态","model":"syncState","type":"select","options":this.syncStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"完成时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"司机","placeholder":"司机","model":"driverName","type":"input","isshow":true},
                {"name":"车牌号码","placeholder":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"付款申请编号","placeholder":"付款申请编号","model":"applyPayNum","type":"input","isshow":true},
            ]
        }
    },
}
