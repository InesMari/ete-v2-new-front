import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'payApplyRegister',
    data()
    {
        return {
            head: [
                {"name": "付款申请编号", "code": "applyPayNum", "width": "120", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "90", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "下单客户", "code": "orderCustName", "width": "150", "type": "text"},
                {"name": "发货日期", "code": "startWorkDate", "width": "150", "type": "text"},
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
                {"name": "运费合计", "code": "amount", "width": "90", "type": "text",isSum:true},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text",isSum:true},
                {"name": "申请人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "付款人", "code": "payUserName", "width": "90", "type": "text"},
                {"name": "付款时间", "code": "payDate", "width": "150", "type": "text"},
            ],
            headDetail:[
                {"name": "付款申请编号", "code": "applyPayNum", "width": "120", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "150", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "100", "type": "text"},
                {"name": "手机号", "code": "driverPhone", "width": "100", "type": "text"},
                {"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
                {"name": "开户名字", "code": "receiveUserName", "width": "100", "type": "text"},
                {"name": "开户卡号", "code": "bankNum", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankName", "width": "120", "type": "text"},
                {"name": "支行名称", "code": "branchName", "width": "120", "type": "text"},
                {"name": "身份证号", "code": "receiveUserIdCard", "width": "120", "type": "text"},
                {"name": "申请金额", "code": "fee", "width": "90", "type": "text","isSum":"true"},
                {"name": "申请备注", "code": "remark", "width": "170", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query:{type:2,supplierName: this.$route.query.supplierName},
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
            showDialog:false,
            selectItem:[],
            totalInfo: {fee:0},
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
            this.query={type:2};
        },
        showRegister() {
            let selectData = this.$refs.table.getSelectItem();
            this.totalInfo.fee = 0;
            if (selectData.length < 1) {
                this.$message.error("请至少选择一个付款申请单！");
                return false;
            }
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].payState == 1) {
                    this.$message.error("付款申请单: " + selectData[i].applyPayNum + "已经付款，不用再次付款登记！");
                    return false;
                }
                this.totalInfo.fee = this.common.accAdd(this.totalInfo.fee,selectData[i].fee);
            }
            this.selectItem = selectData;
            this.showDialog = true;
            this.$nextTick(()=>{
                this.$refs.scrollTable.setData(this.selectItem);    //设置表格数据
                this.$refs.scrollTable.calcFootSum();   //表格合计
                this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            })
        },
        confirmRegister(){
            let payIds = [];
            for (let i = 0; i < this.selectItem.length; i++) {
                payIds.push(this.selectItem[i].payId);
            }
            let that = this;
            this.common.postUrl("fcThirdPayFeeTF", "payFcThirdPayFeeInfo", {payIds}, function (data) {
                that.$message.success("付款登记成功");
                that.showDialog = false;
                that.doQuery();
            },null,null,true);
        },
        download(){
            this.$refs.table.downloadExcelFile('G7待登记申请列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"派车单号：","placeholder":"派车单号","model":"waybillNum","type":"textarea","isshow":true},
                {"name":"供应商：","placeholder":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"完成时间：","model":"createDate","type":"daterange","isshow":true},
                {"name":"司机：","placeholder":"司机","model":"driverName","type":"input","isshow":true},
                {"name":"车牌号码：","placeholder":"车牌号码","model":"plateNumber","type":"input","isshow":true},
                {"name":"付款申请编号：","placeholder":"付款申请编号","model":"applyPayNum","type":"input","isshow":true},
                {"name":"付款状态：","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"开户名字：","placeholder":"开户名字","model":"receiveUserName","type":"input","isshow":true},
            ]
        }
    },
}
